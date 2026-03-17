package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"khanhlinh-backend/pkg/config"
	"khanhlinh-backend/pkg/models"

	"github.com/gin-gonic/gin"
)

// --- Telegram types ---
type TelegramUpdate struct {
	UpdateID int             `json:"update_id"`
	Message  TelegramMessage `json:"message"`
}

type TelegramMessage struct {
	MessageID int            `json:"message_id"`
	Chat      TelegramChat   `json:"chat"`
	Text      string         `json:"text"`
	Caption   string         `json:"caption"`
	Photo     []TelegramPhoto `json:"photo"`
}

type TelegramChat struct {
	ID int64 `json:"id"`
}

type TelegramPhoto struct {
	FileID   string `json:"file_id"`
	FileSize int    `json:"file_size"`
	Width    int    `json:"width"`
	Height   int    `json:"height"`
}

// GetTelegramFileURL resolves a file_id to a download URL
func GetTelegramFileURL(fileID string) (string, error) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	url := fmt.Sprintf("https://api.telegram.org/bot%s/getFile?file_id=%s", token, fileID)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		OK     bool `json:"ok"`
		Result struct {
			FilePath string `json:"file_path"`
		} `json:"result"`
	}
	json.NewDecoder(resp.Body).Decode(&result)

	if !result.OK || result.Result.FilePath == "" {
		return "", fmt.Errorf("telegram getFile failed")
	}

	return fmt.Sprintf("https://api.telegram.org/file/bot%s/%s", token, result.Result.FilePath), nil
}

// SendTelegramMessage sends a reply to a Telegram chat
func SendTelegramMessage(chatID int64, text string) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", token)

	body := map[string]interface{}{"chat_id": chatID, "text": text}
	jsonBody, _ := json.Marshal(body)
	http.Post(url, "application/json", strings.NewReader(string(jsonBody)))
}

// --- Webhook Handler ---
func HandleTelegramWebhook(c *gin.Context) {
	var update TelegramUpdate
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true}) // Respond quickly to Telegram

	go func() {
		msg := update.Message
		chatID := msg.Chat.ID

		// Only process messages with photos
		if len(msg.Photo) == 0 {
			// Handle text commands for registration etc.
			if msg.Text == "/start" {
				SendTelegramMessage(chatID, "🌸 Chào mừng đến bot NPP Khánh Linh!\n\nGửi ảnh để tự động nhận dạng sản phẩm.\n\n📌 Cách dùng:\n• Gửi ảnh (không caption) → Tạo sản phẩm mới bằng AI\n• Gửi ảnh + caption \"add 5\" → Thêm ảnh vào sản phẩm ID=5\n• Gửi ảnh + caption \"new Tên SP\" → Tạo SP với tên cụ thể")
			}
			return
		}

		// Get largest photo (last in array)
		largestPhoto := msg.Photo[len(msg.Photo)-1]
		fileURL, err := GetTelegramFileURL(largestPhoto.FileID)
		if err != nil {
			log.Printf("Telegram: failed to get file URL: %v", err)
			SendTelegramMessage(chatID, "❌ Không thể tải ảnh. Vui lòng thử lại.")
			return
		}

		SendTelegramMessage(chatID, "⏳ Đang xử lý ảnh...")

		// Download image bytes for Gemini
		imageBytes, mimeType, err := DownloadImageBytes(fileURL)
		if err != nil {
			log.Printf("Telegram: failed to download image: %v", err)
			SendTelegramMessage(chatID, "❌ Lỗi tải ảnh.")
			return
		}

		// Upload to Cloudinary
		cloudURL, err := UploadImageFromURL(fileURL)
		if err != nil {
			log.Printf("Telegram: cloudinary upload failed: %v", err)
			SendTelegramMessage(chatID, "❌ Lỗi upload ảnh lên Cloudinary.")
			return
		}

		caption := strings.TrimSpace(msg.Caption)

		// Case 1: add <product_info> — append image to existing product
		if strings.HasPrefix(strings.ToLower(caption), "add ") {
			target := strings.TrimSpace(caption[4:])
			var product models.Product

			// Try by ID first
			productID, err := strconv.ParseUint(target, 10, 64)
			if err == nil {
				if err := config.DB.First(&product, productID).Error; err != nil {
					SendTelegramMessage(chatID, fmt.Sprintf("❌ Không tìm thấy sản phẩm ID=%d", productID))
					return
				}
			} else {
				// Try by Name search
				if err := config.DB.Where("name LIKE ?", "%"+target+"%").First(&product).Error; err != nil {
					SendTelegramMessage(chatID, fmt.Sprintf("❌ Không tìm thấy sản phẩm nào có tên giống \"%s\"", target))
					return
				}
			}

			product.ImageURLs = append(product.ImageURLs, cloudURL)
			config.DB.Save(&product)
			SendTelegramMessage(chatID, fmt.Sprintf("✅ Đã thêm ảnh vào sản phẩm \"%s\" (ID=%d)!", product.Name, product.ID))
			return
		}

		// Case 2: Analyze with AI → create new product
		analysis, err := AnalyzeImage(imageBytes, mimeType, caption)
		if err != nil {
			log.Printf("Telegram: AI analysis failed: %v", err)
			analysis = &AnalysisResult{
				ProductName: "Sản phẩm mới",
				Description: "",
				CategoryID:  1,
				Prices:      map[string]float64{},
			}
		}

		// --- Manual Price Parsing Fallback ---
		if analysis.Prices["Giá trăm"] == 0 || analysis.Prices["Giá chục"] == 0 {
			if analysis.Prices == nil {
				analysis.Prices = make(map[string]float64)
			}
			
			cleanCaption := strings.ReplaceAll(strings.ReplaceAll(strings.ToLower(caption), ".", ""), ",", "")
			cleanCaption = strings.ReplaceAll(cleanCaption, ":", " ")
			words := strings.Fields(cleanCaption)
			
			for i, w := range words {
				var price float64
				found := false
				
				if strings.HasSuffix(w, "k") {
					val, err := strconv.ParseFloat(strings.TrimSuffix(w, "k"), 64)
					if err == nil {
						price = val * 1000
						found = true
					}
				} else {
					val, err := strconv.ParseFloat(w, 64)
					if err == nil && val > 100 { // Assume > 100 is actual price not just a size
						price = val
						found = true
					}
				}

				if found {
					// Look back for context keywords
					context := ""
					if i > 0 {
						context = words[i-1]
					}
					
					if strings.Contains(context, "trăm") {
						analysis.Prices["Giá trăm"] = price
					} else if strings.Contains(context, "chục") {
						analysis.Prices["Giá chục"] = price
					} else {
						// Default assignment if no context
						if analysis.Prices["Giá trăm"] == 0 { analysis.Prices["Giá trăm"] = price }
						if analysis.Prices["Giá chục"] == 0 { analysis.Prices["Giá chục"] = price }
					}
				}
			}
		}

		// Support "new ", "mới ", "mới :" prefixes
		lowerCaption := strings.ToLower(caption)
		if strings.HasPrefix(lowerCaption, "new ") {
			analysis.ProductName = strings.TrimSpace(caption[4:])
		} else if strings.HasPrefix(lowerCaption, "mới :") {
			analysis.ProductName = strings.TrimSpace(caption[5:])
		} else if strings.HasPrefix(lowerCaption, "mới ") {
			analysis.ProductName = strings.TrimSpace(caption[4:])
		}

		// Create product
		product := models.Product{
			Name:        analysis.ProductName,
			Description: analysis.Description,
			Prices:      analysis.Prices,
			ImageURLs:   []string{cloudURL},
			IsHidden:    true,
			CategoryID:  analysis.CategoryID,
		}
		config.DB.Create(&product)

		priceStr := ""
		for k, v := range analysis.Prices {
			if v > 0 {
				priceStr += fmt.Sprintf("\n💰 %s: %.0fđ", k, v)
			}
		}

		SendTelegramMessage(chatID, fmt.Sprintf(
			"✅ Đã tạo sản phẩm mới!\n\n📦 Tên: %s\n📝 Mô tả: %s%s\n🗂 Danh mục ID: %d\n🆔 ID: %d\n\n⚠️ Sản phẩm đang ẩn — vào Dashboard để duyệt.",
			product.Name, product.Description, priceStr, product.CategoryID, product.ID,
		))
	}()
}

// RegisterTelegramWebhook calls Telegram API to set the webhook URL
func RegisterTelegramWebhook(webhookURL string) error {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	if token == "" {
		return fmt.Errorf("TELEGRAM_BOT_TOKEN not set")
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/setWebhook?url=%s/webhook/telegram", token, webhookURL)
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	log.Printf("Telegram setWebhook result: %v", result)
	return nil
}
