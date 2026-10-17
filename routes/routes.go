package routes

import (
	"inventory-backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Enable CORS for Angular Frontend (PATCH method added here)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API Routes
	api := r.Group("/api/products")
	{
		api.GET("", controllers.GetProducts)
		api.POST("", controllers.CreateProduct)
		api.GET("/:id", controllers.GetProductByID)
		api.PUT("/:id", controllers.UpdateProduct)
		api.DELETE("/:id", controllers.DeleteProduct)
		api.PATCH("/:id/stock", controllers.UpdateStock) // Added Stock Update Route
	}

	return r
}