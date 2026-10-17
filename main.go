package main

import (
	"os"

	"inventory-backend/config"
	"inventory-backend/routes"
)

func main() {
	// database connection
	config.ConnectDB()

	// setup routes
	r := routes.SetupRouter()

	// to set the port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Used to run server
	r.Run(":" + port)
}