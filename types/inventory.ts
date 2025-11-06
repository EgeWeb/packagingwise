export interface Supplier {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  rating: number
  productsSupplied: string[]
  createdAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  date: string
  performedBy: string
}

export interface Product {
  id: string
  name: string
  code: string
  price: number
  category: 'cup' | 'lid'
  image: string
  minOrder: string
  // Inventory fields
  stock: number
  lowStockThreshold: number
  supplierId: string
  lastRestocked: string
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface InventoryStats {
  totalProducts: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
  lowStockAlerts: Product[]
}
