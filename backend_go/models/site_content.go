package models

import "gorm.io/gorm"

type SiteContent struct {
	gorm.Model
	Section string `json:"section" gorm:"uniqueIndex"` // "hero", "features", "about", "contact", "stats"
	Data    string `json:"data" gorm:"type:text"`     // JSON string of the section content
}
