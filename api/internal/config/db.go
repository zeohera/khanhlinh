package config

import (
	"log"
	"os"
	"api/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var database *gorm.DB
	var err error

	dsn := os.Getenv("DATABASE_URL")
	if dsn != "" {
		log.Println("Connecting to PostgreSQL...")
		database, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	} else {
		log.Println("Connecting to SQLite...")
		database, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	}

	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}

	err = database.AutoMigrate(&models.Category{}, &models.Product{}, &models.SiteContent{})
	if err != nil {
		log.Fatal("Failed to migrate database!", err)
	}

	DB = database
}
