
# Inventory Management System

A full-stack Inventory Management application built with a **Go (Golang)** backend and an **Angular** frontend.

---

## ✨ Features

- **Product Listing & Filtering:** View all products, filter by category, and search by product name or SKU.
- **Product Management:** Add, edit, and delete products easily.
- **Stock Tracking:** Monitor current stock levels, perform stock updates, and view low-stock warning alerts.
- **Form Validations:** Built-in price and quantity input validations.
- **Database Support:** SQL database structure for storing product and inventory table data.

---

## 📸 Screenshots

### 1. Dashboard & Product Listing
![Product Listing Page](screenshots/product_listing%20page.jpg)
![Products Table Data](screenshots/products_table_data.png)
![Products Table View](screenshots/products_table.jpg)

### 2. Search & Filtering
![Search by Name / SKU](screenshots/Search_product_name_sku.png)
![Product Filter by Category](screenshots/Product_filter_category.png)

### 3. Add Product & Validations
![Add Product](screenshots/Add%20Product.png)
![Price Validation](screenshots/Product_price_validation.png)
![Quantity Validation](screenshots/Product_quantity_validation.jpg)

### 4. Stock & Inventory Updates
![Current Stock View](screenshots/Current_stock.png)
![Low Stock Warning](screenshots/Low_stock_product_warning.png)
![Product Stock Update](screenshots/Product_stock_update.png)

### 5. Edit Product Flow
![Edit Step 1](screenshots/Product_edit_1.jpg)
![Edit Step 2](screenshots/Product_edit_2.jpg)
![Edit Step 3](screenshots/Product_edit_3.jpg)

### 6. Delete Product Flow
![Delete Step 1](screenshots/Product_delete_1.jpg)
![Delete Step 2](screenshots/Product_delete_2.jpg)
![Delete Step 3](screenshots/Product_delete_3.jpg)

---

## 🛠 Tech Stack

- **Backend:** Go (Golang)
- **Frontend:** Angular, TypeScript
- **Database:** SQL

---

## 📁 Project Structure

```text
inventory-backend/
├── inventory-frontend/   # Angular frontend files
├── screenshots/          # Application screenshots
├── main.go               # Go backend server entry point
├── go.mod                # Go module dependencies
└── README.md             # Project documentation

```

---

## 🚀 Getting Started

### Prerequisites

* Go (v1.18 or higher)
* Node.js & npm
* Angular CLI

---

### Backend Setup

1. Navigate to the backend folder:
```bash
cd inventory-backend

```


2. Run the Go server:
```bash
go run main.go

```



---

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd inventory-frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the Angular development server:
```bash
ng serve

```


4. Open your browser and go to `http://localhost:4200/`.

```

```