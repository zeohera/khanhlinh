package main

import (
	"encoding/json"
	"log"

	"khanhlinh-backend/pkg/config"
	"khanhlinh-backend/pkg/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Auto migrate
	err = db.AutoMigrate(&models.SiteContent{})
	if err != nil {
		log.Fatal(err)
	}

	config.DB = db

	seedSection("hero", map[string]interface{}{
		"badge":    "✨ Tổng Kho Sỉ Hot Trend · Giá Tận Gốc",
		"title":    "Khánh Linh –\nNhà Phân Phối\nGiá Tốt Nhất! 🌸",
		"subtitle": "NPP chính thức Vali Hùng Phát · Gấu Bông · Mũ Bảo Hiểm và nhiều sản phẩm hot trend khác tại Vĩnh Phúc. Giá tận gốc – Tuyển CTV toàn quốc!",
		"tags": []string{
			"Gấu Bông 🧸", "Mũ Bảo Hiểm 🪖", "Nón Mũ 🎩", "Vali Hùng Phát 🧳",
			"Túi Ví Da 👜", "Cặp Sách & Balo 🎒", "Đồ Chơi Thông Minh 🎮", "Văn Phòng Phẩm 📎",
		},
	})

	seedSection("features", map[string]interface{}{
		"badge":          "💎 Tại sao chọn chúng tôi",
		"title":          "Chất Lượng Vượt Trội –",
		"titleHighlight": "Tin Dùng Hàng Triệu Khách",
		"subtitle":       "Vali Hùng Phát được sản xuất tại nhà máy đạt chuẩn BSCI, xuất khẩu sang Mỹ, Anh, Nhật Bản – cam kết chất lượng quốc tế với giá Việt Nam.",
		"items": []map[string]string{
			{"icon": "🛡️", "title": "Chống Sốc, Chống Vỡ", "desc": "Vỏ nhựa PP/PC/ABS được gia cố nhiều lớp, chịu lực va đập mạnh, bảo vệ đồ vật bên trong tuyệt đối."},
			{"icon": "🔐", "title": "Khóa TSA Chuẩn Quốc Tế", "desc": "Khóa số TSA được công nhận tại hơn 40 quốc gia, đảm bảo an toàn cho hành lý của bạn khi đi máy bay."},
			{"icon": "⚙️", "title": "Bánh Xe 360° Êm Ái", "desc": "Bánh xe kép bọc cao su chịu tải, xoay 360° linh hoạt trên mọi địa hình, di chuyển không gây tiếng ồn."},
			{"icon": "🎨", "title": "Đa Dạng Màu Sắc", "desc": "Hơn 16 màu sắc thời trang để lựa chọn – từ tông pastel nhẹ nhàng đến màu nổi bật cá tính."},
			{"icon": "💼", "title": "Nội Thất Thông Minh", "desc": "Dung tích rộng rãi với hệ thống chia ngăn thông minh, móc treo đồ tiện lợi, khay để cốc tích hợp."},
			{"icon": "✅", "title": "Bảo Hành Chính Hãng", "desc": "Sản phẩm NPP chính thức, bảo hành đầy đủ theo chính sách nhà sản xuất Hùng Phát, hỗ trợ sau bán hàng."},
		},
	})

	seedSection("about", map[string]interface{}{
		"badge":          "ℹ️ Về chúng tôi",
		"title":          "NPP Khánh Linh –",
		"titleHighlight": "Đối Tác Tin Cậy",
		"description":    "Là nhà phân phối chính thức của Vali Hùng Phát tại khu vực Vĩnh Phúc, Khánh Linh cam kết mang đến sản phẩm chính hãng, chất lượng cao với giá cạnh tranh nhất. Chúng tôi trực tiếp nhập hàng từ nhà máy, đảm bảo nguồn gốc rõ ràng và bảo hành đầy đủ theo chính sách hãng.",
		"highlights": []map[string]string{
			{"text": "Thương hiệu Hùng Phát thành lập năm 2006, xuất phát từ làng nghề truyền thống Kiêu Kỵ, Gia Lâm, Hà Nội."},
			{"text": "Nhà máy rộng 33.000m² với 12 dây chuyền sản xuất hiện đại, tự chủ 95% linh kiện từ bánh xe, tay kéo đến vỏ nhựa."},
			{"text": "Đạt chứng nhận BSCI, tiêu chuẩn xuất khẩu sang Mỹ, Anh, Nhật Bản và hơn 10 quốc gia khác."},
			{"text": "Hơn 2.000 điểm bán trên toàn quốc và hệ thống NPP phủ rộng 63 tỉnh thành."},
		},
		"stats": []map[string]string{
			{"value": "20+", "label": "Năm Kinh Nghiệm"},
			{"value": "33K m²", "label": "Diện Tích Nhà Máy"},
			{"value": "10+", "label": "Quốc Gia XK"},
			{"value": "2000+", "label": "Điểm Bán"},
		},
	})

	seedSection("contact", map[string]interface{}{
		"badge":          "📍 Liên hệ & Tìm đến",
		"title":          "Đến Ghé Thăm",
		"highlight":      "Cửa Hàng Khánh Linh",
		"subtitle":       "Trực tiếp trải nghiệm sản phẩm tại cửa hàng hoặc liên hệ qua điện thoại/Zalo để được tư vấn và đặt hàng giao tận nơi.",
		"phone":          "0965 699 399 · 0949 231 826",
		"address":        "Đường đôi, phố Tân Phát, xã Thổ Tang, Vĩnh Phúc",
		"hours":          "Thứ 2 – Chủ Nhật: 7:00 – 20:00",
		"facebookUrl":   "https://web.facebook.com/khanhlinh1062",
		"mapEmbedSrc":   "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.9429532287877!2d105.486983!3d21.2737256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134f30001d39839%3A0x8ed361a0eed26fa1!2zTlBQIGJhbG8sIHTDumkgeMOhY2gsIHZhbGksIHZwcCBLaMOhbmggTGluaA!5e0!3m2!1sen!2s!4v1772370285759!5m2!1sen!2s",
		"phoneHref":     "tel:0965699399",
		"mapHref":       "https://maps.app.goo.gl/TpEuzCXo31nRFwnB8",
	})

	log.Println("Seeding completed successfully!")
}

func seedSection(section string, data interface{}) {
	jsonData, _ := json.Marshal(data)
	var content models.SiteContent
	result := config.DB.Where("section = ?", section).First(&content)

	if result.Error != nil {
		content = models.SiteContent{
			Section: section,
			Data:    string(jsonData),
		}
		config.DB.Create(&content)
	} else {
		config.DB.Model(&content).Update("data", string(jsonData))
	}
}
