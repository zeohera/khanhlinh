package main

import (
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Minimal Product struct just for migration
type Product struct {
	gorm.Model
	Prices map[string]float64 `gorm:"serializer:json"`
	Name   string
}

func main() {
	_, filename, _, _ := runtime.Caller(0)
	dbPath, _ := filepath.Abs(filepath.Join(filepath.Dir(filename), "..", "test.db"))

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		log.Fatalf("Database not found at: %s", dbPath)
	}
	log.Printf("Using database: %s", dbPath)

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	var products []Product
	if err := db.Find(&products).Error; err != nil {
		log.Fatal("Failed to fetch products!", err)
	}

	updated := 0
	for _, p := range products {
		newPrices := make(map[string]float64)
		changed := false

		for k, v := range p.Prices {
			newKey := k
			normalizedK := strings.ToLower(strings.TrimSpace(k))

			switch normalizedK {
			case "sỉ", "giá sỉ":
				newKey = "đầu trăm"
				changed = true
			case "lẻ", "giá lẻ":
				newKey = "đầu chục"
				changed = true
			}
			newPrices[newKey] = v
		}

		if changed {
			p.Prices = newPrices
			if err := db.Save(&p).Error; err != nil {
				log.Printf("❌ Failed to update product %d (%s): %v", p.ID, p.Name, err)
			} else {
				log.Printf("✅ Updated product %d: %s", p.ID, p.Name)
				updated++
			}
		}
	}

	log.Printf("Migration completed! %d product(s) updated.", updated)
}
