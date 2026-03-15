package controllers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"api/config"
	"api/models"

	"github.com/gin-gonic/gin"
)

// --- Zalo OA Types ---
type ZaloWebhookEvent struct {
	AppID     string          `json:"app_id"`
	EventName string          `json:"event_name"`
	Timestamp string          `json:"timestamp"`
	Sender    ZaloSender      `json:"sender"`
	Message   ZaloOAMessage   `json:"message"`
}

type ZaloSender struct {
	ID string `json:"id"`
}

type ZaloOAMessage struct {
	MsgID       string               `json:"msg_id"`
	Text        string               `json:"text"`
	Attachments []ZaloAttachment     `json:"attachments"`
}

type ZaloAttachment struct {
	Type    string                 `json:"type"`
	Payload ZaloAttachmentPayload  `json:"payload"`
}

type ZaloAttachmentPayload struct {
	URL string `json:"url"`
}

// VerifyZaloSignature validates HMAC-SHA256 signature from Zalo
func VerifyZaloSignature(body []byte, signature string) bool {
	appSecret := os.Getenv("ZALO_APP_SECRET")
	if appSecret == "" {
		return true // Skip verification if secret not set (dev mode)
	}

	mac := hmac.New(sha256.New, []byte(appSecret))
	mac.Write(body)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

// SendZaloMessage sends a text reply to a Zalo user via OA API
func SendZaloMessage(recipientID string, text string) {
	token := os.Getenv("ZALO_OA_ACCESS_TOKEN")
	if token == "" {
		return
	}

	body := map[string]interface{}{
		"recipient": map[string]string{"user_id": recipientID},
		"message":   map[string]string{"text": text},
	}
	jsonBody, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "https://openapi.zalo.me/v3.0/oa/message/cs", strings.NewReader(string(jsonBody)))
	req.Header.Set("access_token", token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	client.Do(req)
}

// HandleZaloWebhook processes Zalo OA webhook events
func HandleZaloWebhook(c *gin.Context) {
	// Read raw body for signature verification
	rawBody, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read body"})
		return
	}

	// Verify signature
	signature := c.GetHeader("X-ZaloOA-Signature")
	if !VerifyZaloSignature(rawBody, signature) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid signature"})
		return
	}

	var event ZaloWebhookEvent
	if err := json.Unmarshal(rawBody, &event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true}) // Respond quickly to Zalo

	go func() {
		senderID := event.Sender.ID

		// Only handle image messages
		if event.EventName != "user_send_image" && event.EventName != "user_send_file" {
			if event.EventName == "user_send_text" {
				text := strings.ToLower(strings.TrimSpace(event.Message.Text))
				if text == "hi" || text == "hello" || text == "xin chào" {
					SendZaloMessage(senderID, "🌸 Chào bạn! Gửi ảnh sản phẩm để bot tự động nhận dạng và thêm vào website nhé.\n\n🔹 Gửi ảnh → Tạo sản phẩm mới\n🔹 Gửi ảnh kèm tin nhắn \"add 5\" → Thêm ảnh vào SP ID=5")
				}
			}
			return
		}

		if len(event.Message.Attachments) == 0 {
			return
		}

		imageURL := event.Message.Attachments[0].Payload.URL
		if imageURL == "" {
			return
		}

		SendZaloMessage(senderID, "⏳ Đang xử lý ảnh...")

		// Download image bytes for Gemini analysis
		imageBytes, mimeType, err := DownloadImageBytes(imageURL)
		if err != nil {
			log.Printf("Zalo: failed to download image: %v", err)
			SendZaloMessage(senderID, "❌ Không thể tải ảnh. Vui lòng thử lại.")
			return
		}

		// Upload to Cloudinary
		cloudURL, err := UploadImageFromURL(imageURL)
		if err != nil {
			log.Printf("Zalo: cloudinary upload failed: %v", err)
			// Fallback: use original Zalo URL
			cloudURL = imageURL
		}

		// Check for "add <id>" command in message text
		msgText := strings.TrimSpace(event.Message.Text)
		if strings.HasPrefix(strings.ToLower(msgText), "add ") {
			idStr := strings.TrimSpace(msgText[4:])
			productID, err := strconv.ParseUint(idStr, 10, 64)
			if err != nil {
				SendZaloMessage(senderID, "❌ ID không hợp lệ. Dùng: add 5")
				return
			}

			var product models.Product
			if err := config.DB.First(&product, productID).Error; err != nil {
				SendZaloMessage(senderID, fmt.Sprintf("❌ Không tìm thấy sản phẩm ID=%d", productID))
				return
			}

			product.ImageURLs = append(product.ImageURLs, cloudURL)
			config.DB.Save(&product)
			SendZaloMessage(senderID, fmt.Sprintf("✅ Đã thêm ảnh vào \"%s\" (ID=%d)!", product.Name, product.ID))
			return
		}

		// Analyze with Gemini
		analysis, err := AnalyzeImage(imageBytes, mimeType, msgText)
		if err != nil {
			log.Printf("Zalo: AI analysis failed: %v", err)
			analysis = &AnalysisResult{
				ProductName: "Sản phẩm mới",
				Description: "",
				CategoryID:  1,
				Prices:      map[string]float64{},
			}
		}

		// Support "new " command or use text as hint via AnalyzeImage
		if strings.HasPrefix(strings.ToLower(msgText), "new ") {
			analysis.ProductName = strings.TrimSpace(msgText[4:])
		}

		product := models.Product{
			Name:        analysis.ProductName,
			Description: analysis.Description,
			Prices:      map[string]float64{},
			ImageURLs:   []string{cloudURL},
			IsHidden:    true,
			CategoryID:  analysis.CategoryID,
		}
		config.DB.Create(&product)

		SendZaloMessage(senderID, fmt.Sprintf(
			"✅ Đã tạo sản phẩm!\n\n📦 %s\n📝 %s\n🆔 ID: %d\n\n⚠️ Đang ẩn — vào Dashboard để duyệt.",
			product.Name, product.Description, product.ID,
		))
	}()
}
