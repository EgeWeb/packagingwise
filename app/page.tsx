'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/inventory'
import { initializeProductsWithInventory } from '@/lib/inventory'

const STORAGE_KEY = 'packagingwise_products'

const sampleProducts: Omit<Product, 'stock' | 'lowStockThreshold' | 'supplierId' | 'lastRestocked' | 'stockStatus' | 'createdAt'>[] = [
  {
    id: '1',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 16oz',
    code: 'KB-16OZ-001',
    price: 0.15,
    category: 'cup' as const,
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-16oz-large-insulated-1x500-01.jpg?v=1753296726&width=1080',
    minOrder: '500 adet',
    size: '16oz',
    color: 'Kahverengi',
    material: 'Çift Cidarlı'
  },
  {
    id: '2',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 12oz',
    code: 'KB-12OZ-002',
    price: 0.12,
    category: 'cup' as const,
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-12oz-large-insulated-1x500-01.jpg?v=1753297423&width=1080',
    minOrder: '500 adet',
    size: '12oz',
    color: 'Kahverengi',
    material: 'Çift Cidarlı'
  },
  {
    id: '3',
    name: 'Beyaz Tek Cidarlı Kahve Bardağı 8oz',
    code: 'KB-8OZ-003',
    price: 0.08,
    category: 'cup' as const,
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-white-single-wall-coffee-cup-8oz-small-takeaway-1x1000-01.jpg?v=1753294614&width=1080',
    minOrder: '1000 adet',
    size: '8oz',
    color: 'Beyaz',
    material: 'Tek Cidarlı'
  },
  {
    id: '4',
    name: 'Bardak Taşıyıcı - 2li',
    code: 'BT-2-004',
    price: 0.25,
    category: 'lid' as const,
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-carrier-2-cups-1x360-01.jpg?v=1751973699&width=1080',
    minOrder: '360 adet'
  },
  {
    id: '5',
    name: 'Bardak Kılıfı 12-16oz Kahverengi',
    code: 'BK-1216-005',
    price: 0.05,
    category: 'lid' as const,
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-sleeve-12-16oz-brown-1x1000-01.jpg?v=1751972221&width=1080',
    minOrder: '1000 adet',
    size: '12-16oz',
    color: 'Kahverengi'
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [gridCols, setGridCols] = useState(4)
  const [activeCategory, setActiveCategory] = useState('cups')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [initialized, setInitialized] = useState(false)

  const initializeInventory = useCallback(async () => {
    if (initialized) return

    // Try to load from localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      // Use existing products from localStorage
      const parsedProducts = JSON.parse(stored)
      setProducts(parsedProducts)
    } else {
      // Initialize with sample products
      const productsWithInventory = initializeProductsWithInventory(sampleProducts)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsWithInventory))
      setProducts(productsWithInventory)
    }

    setInitialized(true)
  }, [initialized])

  useEffect(() => {
    initializeInventory()
  }, [initializeInventory])

  // Listen for storage changes (when products are added/edited in admin)
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setProducts(JSON.parse(stored))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event from same tab
    window.addEventListener('productsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('productsUpdated', handleStorageChange)
    }
  }, [])

  const getGridClass = () => {
    if (gridCols === 1) return 'grid-cols-1'
    if (gridCols === 2) return 'grid-cols-2'
    if (gridCols === 4) return 'grid-cols-2 md:grid-cols-4'
    if (gridCols === 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
    if (gridCols === 8) return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
    return 'grid-cols-2 md:grid-cols-4'
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'Stokta'
      case 'low_stock': return 'Az Kaldı'
      case 'out_of_stock': return 'Tükendi'
      default: return 'Bilinmiyor'
    }
  }

  const cupProducts = products.filter(p => p.category === 'cup')
  const lidProducts = products.filter(p => p.category === 'lid')

  let displayProducts = activeCategory === 'cups' ? cupProducts : lidProducts

  // Apply stock filter
  if (stockFilter !== 'all') {
    displayProducts = displayProducts.filter(p => p.stockStatus === stockFilter)
  }

  // Apply search filter
  if (searchQuery.trim()) {
    displayProducts = displayProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Image
              src="https://packagingwise.co.uk/cdn/shop/files/Logo.png?v=1754919663&width=400"
              alt="Packaging Wise Logo"
              width={200}
              height={60}
              className="object-contain"
            />
            <Link
              href="/admin/products"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Panel
            </Link>
          </div>

          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                type="search"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('cups')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  activeCategory === 'cups'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bardaklar
              </button>
              <button
                onClick={() => setActiveCategory('lids')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  activeCategory === 'lids'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Kapaklar
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => setStockFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  stockFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setStockFilter('in_stock')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  stockFilter === 'in_stock'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Stokta
              </button>
              <button
                onClick={() => setStockFilter('low_stock')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  stockFilter === 'low_stock'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Az Kaldı
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">Görünüm:</span>
              <div className="flex md:hidden items-center gap-2">
                {[1, 2].map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`w-8 h-8 rounded font-semibold text-sm transition ${
                      gridCols === cols
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2">
                {[2, 4, 6].map(cols => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`w-8 h-8 rounded font-semibold text-sm transition ${
                      gridCols === cols
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCategory === 'cups' ? 'Bardaklar' : 'Kapaklar ve Aksesuarlar'}
          </h2>
          <p className="text-gray-600">{displayProducts.length} ürün</p>
        </div>

        {displayProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">Bu kategoride ürün bulunmuyor</p>
            <Link
              href="/admin/products"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className={`grid ${getGridClass()} gap-6`}>
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusText(product.stockStatus)}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <p className={`text-gray-400 font-mono mb-1 ${gridCols === 2 ? 'text-xs' : 'text-xs'}`}>
                    {product.code}
                  </p>
                  <h3 className={`font-bold text-gray-900 leading-snug mb-2 ${
                    gridCols === 1 ? 'text-lg' :
                    gridCols === 2 ? 'text-sm md:text-xl' :
                    gridCols === 4 ? 'text-base' :
                    'text-sm line-clamp-2 min-h-[40px]'
                  }`}>
                    {product.name}
                  </h3>

                  {/* Product attributes */}
                  {(product.size || product.color || product.material) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.size && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                          {product.size}
                        </span>
                      )}
                      {product.color && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded">
                          {product.color}
                        </span>
                      )}
                      {product.material && (
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                          {product.material}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className={`font-bold text-green-600 ${
                      gridCols === 1 ? 'text-3xl' :
                      gridCols === 2 ? 'text-lg md:text-4xl' :
                      gridCols === 4 ? 'text-xl' :
                      'text-base'
                    }`}>
                      ₺{product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className={`text-gray-600 bg-gray-100 rounded-full inline-block ${
                        gridCols === 2 ? 'text-[10px] px-2 py-0.5 md:text-xs md:px-2.5 md:py-1' :
                        gridCols >= 6 ? 'text-[10px] px-2 py-0.5' :
                        'text-xs px-2.5 py-1'
                      }`}>
                        Min. {product.minOrder}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Stok: {product.stock.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
