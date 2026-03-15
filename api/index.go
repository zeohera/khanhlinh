package main

import (
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"api/internal/config"
	"api/internal/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var (
	engine *gin.Engine
	once   sync.Once
)

func initApp() {
	once.Do(func() {
		// Load .env only if not in production
		if os.Getenv("VERCEL_ENV") == "" {
			err := godotenv.Load()
			if err != nil {
				log.Println("No .env file found or error loading it")
			}
		}

		config.ConnectDatabase()
		config.SetupCloudinary()

		gin.SetMode(gin.ReleaseMode)
		engine = gin.Default()

		// CORS config
		engine.Use(cors.New(cors.Config{
			AllowOrigins:     []string{"*"}, // Allow all origins for development
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		}))

		routes.SetupRoutes(engine)
	})
}

// Handler is the entry point for Vercel Serverless Functions
func Handler(w http.ResponseWriter, r *http.Request) {
	initApp()
	engine.ServeHTTP(w, r)
}
