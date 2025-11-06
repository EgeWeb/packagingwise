import { Product, Supplier, StockMovement, InventoryStats } from '@/types/inventory'

// Sample suppliers
export const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Kağıt Ambalaj A.Ş.',
    contactPerson: 'Ahmet Yılmaz',
    email: 'ahmet@kagitambalaj.com.tr',
    phone: '+90 212 555 0101',
    address: 'İstanbul, Türkiye',
    rating: 4.5,
    productsSupplied: ['KB-16OZ-001', 'KB-12OZ-002', 'KB-8OZ-003'],
    createdAt: '2024-01-15'
  },
  {
    id: 'SUP-002',
    name: 'Eko Ambalaj Ltd.',
    contactPerson: 'Ayşe Demir',
    email: 'ayse@ekoambalaj.com.tr',
    phone: '+90 216 555 0202',
    address: 'Ankara, Türkiye',
    rating: 4.8,
    productsSupplied: ['BT-2-004', 'BK-1216-005'],
    createdAt: '2024-02-20'
  },
  {
    id: 'SUP-003',
    name: 'Premium Packaging Co.',
    contactPerson: 'Mehmet Kaya',
    email: 'mehmet@premiumpkg.com',
    phone: '+90 232 555 0303',
    address: 'İzmir, Türkiye',
    rating: 4.3,
    productsSupplied: ['KB-16OZ-006', 'KB-12OZ-007'],
    createdAt: '2024-03-10'
  }
]

// Initialize products with inventory data
export function initializeProductsWithInventory(baseProducts: Omit<Product, 'stock' | 'lowStockThreshold' | 'supplierId' | 'lastRestocked' | 'stockStatus'>[]): Product[] {
  return baseProducts.map((product, index) => ({
    ...product,
    stock: Math.floor(Math.random() * 10000) + 1000,
    lowStockThreshold: product.category === 'cup' ? 2000 : 1000,
    supplierId: initialSuppliers[index % initialSuppliers.length].id,
    lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    stockStatus: getStockStatus(
      Math.floor(Math.random() * 10000) + 1000,
      product.category === 'cup' ? 2000 : 1000
    )
  }))
}

export function getStockStatus(stock: number, threshold: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stock === 0) return 'out_of_stock'
  if (stock <= threshold) return 'low_stock'
  return 'in_stock'
}

export function calculateInventoryStats(products: Product[]): InventoryStats {
  const stats = products.reduce((acc, product) => {
    acc.totalProducts++
    if (product.stockStatus === 'in_stock') acc.inStock++
    if (product.stockStatus === 'low_stock') acc.lowStock++
    if (product.stockStatus === 'out_of_stock') acc.outOfStock++
    acc.totalValue += product.stock * product.price
    return acc
  }, {
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    lowStockAlerts: [] as Product[]
  })

  stats.lowStockAlerts = products.filter(p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock')

  return stats
}

// Stock movement history (in-memory for now)
const stockMovements: StockMovement[] = []

export function addStockMovement(movement: Omit<StockMovement, 'id' | 'date'>): StockMovement {
  const newMovement: StockMovement = {
    ...movement,
    id: `SM-${Date.now()}`,
    date: new Date().toISOString()
  }
  stockMovements.push(newMovement)
  return newMovement
}

export function getStockMovements(productId?: string): StockMovement[] {
  if (productId) {
    return stockMovements.filter(m => m.productId === productId)
  }
  return stockMovements
}

export function getRecentMovements(limit: number = 10): StockMovement[] {
  return stockMovements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}
