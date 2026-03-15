package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Prices      map[string]float64 `json:"prices" gorm:"serializer:json"` // e.g {"đầu trăm": 100000, "đầu chục": 150000}
	ImageURLs   []string           `json:"imageUrls" gorm:"serializer:json"`
	IsHidden    bool               `json:"isHidden"`
	CategoryID  uint               `json:"categoryId"`
}
