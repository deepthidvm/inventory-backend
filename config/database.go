package config

import (
    "fmt"
    "log"
    "os"
    "time"

    "github.com/joho/godotenv"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    err := godotenv.Load()
    if err != nil {
        log.Println("Error loading .env file")
    }

    dsn := os.Getenv("DB_DSN")
    
db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, 
	}), &gorm.Config{})
    
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    sqlDB, err := db.DB()
    if err != nil {
        log.Fatal("Failed to get database instance:", err)
    }
    sqlDB.SetMaxIdleConns(10)
    sqlDB.SetMaxOpenConns(100)
    sqlDB.SetConnMaxLifetime(time.Hour)

    // db.AutoMigrate(&models.Product{}) 
    DB = db
    fmt.Println("Database connected successfully!")
}