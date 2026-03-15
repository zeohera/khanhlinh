package controllers

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"api/internal/config"
)

// AnalysisResult is what Gemini Vision returns
type AnalysisResult struct {
	ProductName string             `json:"name"`
	Description string             `json:"description"`
	CategoryID  uint               `json:"categoryId"`
	Prices      map[string]float64 `json:"prices"`
}

// DownloadImageBytes downloads image from any URL and returns bytes
func DownloadImageBytes(url string) ([]byte, string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, "", err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}

	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/jpeg"
	}
	return data, contentType, nil
}

// UploadImageFromURL downloads image from URL and uploads to Cloudinary
func UploadImageFromURL(imageURL string) (string, error) {
	resp, err := http.Get(imageURL)
	if err != nil {
		return "", fmt.Errorf("failed to download image: %w", err)
	}
	defer resp.Body.Close()

	cloudURL, err := config.UploadImage(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to upload to cloudinary: %w", err)
	}
	return cloudURL, nil
}

// AnalyzeImage calls Gemini Vision API to classify a product image.
// It takes raw image bytes, a hint from user text, and returns an AnalysisResult.
func AnalyzeImage(imageBytes []byte, mimeType string, userHint string) (*AnalysisResult, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY not set")
	}

	b64Image := base64.StdEncoding.EncodeToString(imageBytes)

	prompt := `Bạn là trợ lý phân loại sản phẩm cho cửa hàng NPP Khánh Linh.
Nhiệm vụ: Phân tích hình ảnh và Gợi ý của người dùng để trả về JSON sản phẩm.

Gợi ý từ người dùng: "` + userHint + `"

QUY TẮC BẮT BUỘC:
1. Trả về JSON thuần, KHÔNG kèm giải thích, KHÔNG có markdown.
2. Cột "prices" BẮT BUỘC phải dùng 2 tên khóa này: "Giá trăm" và "Giá chục".
3. Nếu thấy giá (ví dụ "28k", "28000", "28.000") đi kèm với từ "trăm" hoặc "chục" trong gợi ý hoặc ảnh, hãy điền vào đúng khóa.
4. Nếu không thấy giá mẫu, để giá trị là 0.

Cấu trúc mẫu:
{
  "name": "Tên SP",
  "description": "Mô tả",
  "categoryId": 1,
  "prices": {
    "Giá trăm": 28000,
    "Giá chục": 30000
  }
}

Danh mục (categoryId): 1=Gấu, 2=Mũ BH, 3=Nón, 4=Vali, 5=Túi/Ví, 6=Cặp, 7=Đồ chơi, 8=VPP.`

	requestBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{
						"text": prompt,
					},
					{
						"inline_data": map[string]string{
							"mime_type": mimeType,
							"data":      b64Image,
						},
					},
				},
			},
		},
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", apiKey)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("gemini API request failed: %w", err)
	}
	defer resp.Body.Close()

	var geminiResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&geminiResp); err != nil {
		return nil, fmt.Errorf("failed to decode gemini response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("empty gemini response")
	}

	rawText := strings.TrimSpace(geminiResp.Candidates[0].Content.Parts[0].Text)
	// Strip potential markdown code fences
	rawText = strings.TrimPrefix(rawText, "```json")
	rawText = strings.TrimPrefix(rawText, "```")
	rawText = strings.TrimSuffix(rawText, "```")
	rawText = strings.TrimSpace(rawText)

	var result AnalysisResult
	if err := json.Unmarshal([]byte(rawText), &result); err != nil {
		log.Printf("Gemini raw response: %s", rawText)
		return nil, fmt.Errorf("failed to parse gemini result as JSON: %w", err)
	}

	return &result, nil
}
