package controllers

import (
	"net/http"

	"inventory-backend/config"
	"inventory-backend/models"

	"github.com/gin-gonic/gin"
)



func GetProducts(c *gin.Context) {
    var products []models.Product
    config.DB.Find(&products)

    if products == nil {
        products = []models.Product{}
    }
    
    c.JSON(http.StatusOK, products)
}

// Create a new product
func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validation checks
	if product.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price must be greater than 0"})
		return
	}
	if product.Quantity < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot be negative"})
		return
	}

	result := config.DB.Create(&product)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

// Get product by ID
func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// Update product
func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var updateData models.Product
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.Name = updateData.Name
	product.SKU = updateData.SKU
	product.Category = updateData.Category
	product.Price = updateData.Price
	product.Quantity = updateData.Quantity
	product.Status = updateData.Status

	config.DB.Save(&product)
	c.JSON(http.StatusOK, product)
}

// Delete product
func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	config.DB.Delete(&product)
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
// Update product stock quantity only
func UpdateStock(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var input struct {
		Quantity int `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Quantity < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot be negative"})
		return
	}

	product.Quantity = input.Quantity
	
	// Optional: Auto update status based on quantity
	if product.Quantity == 0 {
		product.Status = "Out of Stock"
	} else if product.Quantity <= 5 {
		product.Status = "Low Stock"
	} else {
		product.Status = "In Stock"
	}

	config.DB.Save(&product)
	c.JSON(http.StatusOK, gin.H{"message": "Stock updated successfully", "product": product})
}
