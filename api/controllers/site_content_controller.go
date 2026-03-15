package controllers

import (
	"net/http"

	"api/config"
	"api/models"

	"github.com/gin-gonic/gin"
)

func GetAllSiteContent(c *gin.Context) {
	var contents []models.SiteContent
	config.DB.Find(&contents)
	c.JSON(http.StatusOK, gin.H{"data": contents})
}

func GetSiteContentBySection(c *gin.Context) {
	section := c.Param("section")
	var content models.SiteContent
	if err := config.DB.Where("section = ?", section).First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Section not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": content})
}

func UpdateSiteContent(c *gin.Context) {
	section := c.Param("section")
	var input struct {
		Data string `json:"data"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var content models.SiteContent
	result := config.DB.Where("section = ?", section).First(&content)

	if result.Error != nil {
		// Create new if not exists
		content = models.SiteContent{
			Section: section,
			Data:    input.Data,
		}
		config.DB.Create(&content)
	} else {
		// Update existing
		config.DB.Model(&content).Update("data", input.Data)
	}

	c.JSON(http.StatusOK, gin.H{"data": content})
}
