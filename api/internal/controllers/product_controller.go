package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"api/internal/config"
	"api/internal/models"

	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	var products []models.Product
	config.DB.Find(&products)
	c.JSON(http.StatusOK, gin.H{"data": products})
}

func GetProductByID(c *gin.Context) {
	var product models.Product
	if err := config.DB.Where("id = ?", c.Param("id")).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func CreateProduct(c *gin.Context) {
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	name := c.PostForm("name")
	description := c.PostForm("description")
	pricesJson := c.PostForm("prices")
	categoryIdStr := c.PostForm("categoryId")
	isHiddenStr := c.PostForm("isHidden")

	var prices map[string]float64
	if pricesJson != "" {
		json.Unmarshal([]byte(pricesJson), &prices)
	} else {
		prices = make(map[string]float64)
	}

	categoryId, _ := strconv.ParseUint(categoryIdStr, 10, 32)
	isHidden := isHiddenStr == "true"

	var imageUrls []string
	if c.Request.MultipartForm != nil {
		files := c.Request.MultipartForm.File["images"]
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err == nil {
				url, uploadErr := config.UploadImage(file)
				if uploadErr == nil {
					imageUrls = append(imageUrls, url)
				}
				file.Close()
			}
		}
	}

	product := models.Product{
		Name:        name,
		Description: description,
		Prices:      prices,
		ImageURLs:   imageUrls,
		IsHidden:    isHidden,
		CategoryID:  uint(categoryId),
	}

	config.DB.Create(&product)
	c.JSON(http.StatusCreated, gin.H{"data": product})
}

func UpdateProduct(c *gin.Context) {
	var product models.Product
	if err := config.DB.Where("id = ?", c.Param("id")).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found!"})
		return
	}

	c.Request.ParseMultipartForm(10 << 20)

	if name := c.PostForm("name"); name != "" {
		product.Name = name
	}
	if description := c.PostForm("description"); description != "" {
		product.Description = description
	}
	if pricesJson := c.PostForm("prices"); pricesJson != "" {
		var prices map[string]float64
		if err := json.Unmarshal([]byte(pricesJson), &prices); err == nil {
			product.Prices = prices
		}
	}
	if categoryIdStr := c.PostForm("categoryId"); categoryIdStr != "" {
		if categoryId, err := strconv.ParseUint(categoryIdStr, 10, 32); err == nil {
			product.CategoryID = uint(categoryId)
		}
	}
	if isHiddenStr := c.PostForm("isHidden"); isHiddenStr != "" {
		product.IsHidden = isHiddenStr == "true"
	}

	// Handle Images
	existingImagesJson := c.PostForm("existingImageUrls")
	if existingImagesJson != "" {
		var finalImageUrls []string
		if err := json.Unmarshal([]byte(existingImagesJson), &finalImageUrls); err == nil {
			product.ImageURLs = finalImageUrls
		}
	}

	if c.Request.MultipartForm != nil {
		files := c.Request.MultipartForm.File["images"]
		for _, fileHeader := range files {
			file, err := fileHeader.Open()
			if err == nil {
				url, uploadErr := config.UploadImage(file)
				if uploadErr == nil {
					product.ImageURLs = append(product.ImageURLs, url)
				}
				file.Close()
			}
		}
	}

	config.DB.Save(&product)
	c.JSON(http.StatusOK, gin.H{"data": product})
}

func DeleteProduct(c *gin.Context) {
	var product models.Product
	if err := config.DB.Where("id = ?", c.Param("id")).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found!"})
		return
	}

	config.DB.Delete(&product)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
