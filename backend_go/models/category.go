package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name           string    `json:"name"`
	Badge          string    `json:"badge"`
	Title          string    `json:"title"`
	TitleHighlight string    `json:"titleHighlight"`
	Description    string    `json:"description"`
	IsHidden       bool      `json:"isHidden"`
	Products       []Product `json:"products"`
}
