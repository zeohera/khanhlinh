package routes

import (
	"api/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.GET("/products", controllers.GetProducts)
		api.GET("/products/:id", controllers.GetProductByID)
		api.POST("/products", controllers.CreateProduct)
		api.PUT("/products/:id", controllers.UpdateProduct)
		api.DELETE("/products/:id", controllers.DeleteProduct)

		api.GET("/categories", controllers.GetCategories)
		api.GET("/categories/:id", controllers.GetCategoryByID)
		api.POST("/categories", controllers.CreateCategory)
		api.PUT("/categories/:id", controllers.UpdateCategory)
		api.DELETE("/categories/:id", controllers.DeleteCategory)

		api.GET("/site-content", controllers.GetAllSiteContent)
		api.GET("/site-content/:section", controllers.GetSiteContentBySection)
		api.PUT("/site-content/:section", controllers.UpdateSiteContent)
	}

	// Webhook routes for AI auto-import
	router.POST("/webhook/telegram", controllers.HandleTelegramWebhook)
	router.POST("/webhook/zalo", controllers.HandleZaloWebhook)
	router.GET("/webhook/telegram/setup", func(c *gin.Context) {
		webhookURL := c.Query("url")
		if webhookURL == "" {
			c.JSON(400, gin.H{"error": "Missing 'url' query parameter"})
			return
		}
		err := controllers.RegisterTelegramWebhook(webhookURL)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Telegram webhook registered successfully to " + webhookURL + "/webhook/telegram"})
	})
}
