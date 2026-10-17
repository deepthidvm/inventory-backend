import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './models/product';
import { ProductService } from './services/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 1200px; margin: auto;">
      <h2>Inventory Management System</h2>

      <!-- Error / Success Message Box -->
      <div *ngIf="errorMessage" style="padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; margin-bottom: 15px; border-radius: 4px;">
        {{ errorMessage }}
      </div>

      <!-- Search & Filter Section -->
      <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
        <input 
          type="text" 
          placeholder="Search by Name or SKU..." 
          [(ngModel)]="searchTerm" 
          (input)="filterProducts()" 
          style="padding: 8px; flex: 1; min-width: 200px;"
        >
        
        <select [(ngModel)]="selectedCategory" (change)="filterProducts()" style="padding: 8px;">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
      </div>

      <!-- Product Form (Add / Edit) -->
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 5px; background: #f9f9f9;">
        <h3>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
        <form (ngSubmit)="saveProduct()">
          <input type="text" [(ngModel)]="currentProduct.name" name="name" placeholder="Product Name" required style="margin: 5px; padding: 8px;">
          <input type="text" [(ngModel)]="currentProduct.sku" name="sku" placeholder="SKU (Unique)" required style="margin: 5px; padding: 8px;">
          <input type="text" [(ngModel)]="currentProduct.category" name="category" placeholder="Category" required style="margin: 5px; padding: 8px;">
          <input type="number" [(ngModel)]="currentProduct.price" name="price" placeholder="Price (> 0)" required style="margin: 5px; padding: 8px;">
          <input type="number" [(ngModel)]="currentProduct.quantity" name="quantity" placeholder="Quantity (>= 0)" required style="margin: 5px; padding: 8px;">
          
          <select [(ngModel)]="currentProduct.status" name="status" style="margin: 5px; padding: 8px;">
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <button type="submit" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; cursor: pointer; margin-left: 5px;">
            {{ isEditing ? 'Update Product' : 'Add Product' }}
          </button>
          
          <button type="button" *ngIf="isEditing" (click)="resetForm()" style="padding: 8px 15px; background-color: #6c757d; color: white; border: none; cursor: pointer; margin-left: 5px;">
            Cancel
          </button>
        </form>
      </div>

      <!-- Product Table -->
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>ID</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of filteredProducts">
            <td>{{ product.id }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>₹{{ product.price }}</td>
            <td>
              {{ product.quantity }}
              <span *ngIf="product.quantity <= 5 && product.quantity > 0" style="color: #856404; background-color: #fff3cd; padding: 2px 6px; font-size: 11px; border-radius: 3px;">⚠️ Low Stock</span>
            </td>
            <td>
              <span [style.color]="product.quantity === 0 ? 'red' : (product.quantity <= 5 ? 'orange' : 'green')">
                {{ product.quantity === 0 ? 'Out of Stock' : (product.quantity <= 5 ? 'Low Stock' : 'In Stock') }}
              </span>
            </td>
            <td>
              <button (click)="editProduct(product)" style="background-color: #ffc107; color: black; border: none; padding: 5px 8px; cursor: pointer; margin-right: 3px;">Edit</button>
              <button (click)="quickStockUpdate(product)" style="background-color: #17a2b8; color: white; border: none; padding: 5px 8px; cursor: pointer; margin-right: 3px;">Stock</button>
              <button (click)="deleteProduct(product.id)" style="background-color: #dc3545; color: white; border: none; padding: 5px 8px; cursor: pointer;">Delete</button>
            </td>
          </tr>
          <tr *ngIf="filteredProducts.length === 0">
            <td colspan="8" style="text-align: center; color: #777;">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  errorMessage: string = '';

  currentProduct: Product = {
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0,
    status: 'In Stock'
  };

  isEditing: boolean = false;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef // Added ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data || [];
        this.filteredProducts = data || [];
        this.extractCategories();
        this.cdr.detectChanges(); // UI update
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.products = [];
        this.filteredProducts = [];
        this.errorMessage = 'Failed to load products from server.';
        this.cdr.detectChanges();
      }
    });
  }

extractCategories(): void {
    if (!this.products) {
      this.categories = [];
      return;
    }
    const cats = this.products.map(p => p.category);
    this.categories = Array.from(new Set(cats));
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCat = this.selectedCategory ? p.category === this.selectedCategory : true;
      return matchesSearch && matchesCat;
    });
  }

 saveProduct(): void {
    this.errorMessage = '';

    if (this.currentProduct.quantity === 0 && this.currentProduct.status === 'In Stock') {
      this.errorMessage = "Validation Error: Products with 0 quantity cannot be set to 'In Stock'. Please select 'Out of Stock'.";
      return;
    }

    
    if (this.currentProduct.price <= 0) {
      this.errorMessage = 'Validation Error: Price must be greater than zero.';
      return;
    }
    if (this.currentProduct.quantity < 0) {
      this.errorMessage = 'Validation Error: Quantity cannot be negative.';
      return;
    }

    if (this.isEditing && this.currentProduct.id) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to update product.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.productService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to add product. SKU must be unique.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.currentProduct = { ...product };
  }

  quickStockUpdate(product: Product): void {
    const newQtyStr = prompt(`Enter new stock quantity for ${product.name}:`, product.quantity.toString());
    if (newQtyStr !== null) {
      const newQty = parseInt(newQtyStr, 10);
      if (isNaN(newQty) || newQty < 0) {
        alert('Invalid quantity. Quantity cannot be negative.');
        return;
      }
      this.productService.updateStock(product.id!, newQty).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Failed to update stock quantity.')
      });
    }
  }

  deleteProduct(id?: number): void {
    if (id && confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => {
          console.error('Error deleting product:', err);
          this.errorMessage = 'Failed to delete product.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentProduct = {
      name: '',
      sku: '',
      category: '',
      price: 0,
      quantity: 0,
      status: 'In Stock'
    };
  }
}