package models

type Product struct {
    ID       uint    `json:"id" gorm:"primaryKey"`
    Name     string  `json:"name" binding:"required" gorm:"column:name"`
    SKU      string  `json:"sku" binding:"required" gorm:"unique;column:sku"`
    Category string  `json:"category" binding:"required" gorm:"column:category"`
    Price    float64 `json:"price" binding:"required,gt=0" gorm:"column:price"`
    Quantity int     `json:"quantity" binding:"gte=0" gorm:"column:quantity"`
    Status   string  `json:"status" gorm:"column:status"`
}

func (Product) TableName() string {
    return "products"
}