'use client'

import { useState } from 'react'
import Image from 'next/image'

const products = [
  {
    id: '1',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 16oz',
    code: 'KB-16OZ-001',
    price: 0.15,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-16oz-large-insulated-1x500-01.jpg?v=1753296726&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '2',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 12oz',
    code: 'KB-12OZ-002',
    price: 0.12,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-12oz-large-insulated-1x500-01.jpg?v=1753297423&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '3',
    name: 'Beyaz Tek Cidarlı Kahve Bardağı 8oz',
    code: 'KB-8OZ-003',
    price: 0.08,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-white-single-wall-coffee-cup-8oz-small-takeaway-1x1000-01.jpg?v=1753294614&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '4',
    name: 'Bardak Taşıyıcı - 2li',
    code: 'BT-2-004',
    price: 0.25,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-carrier-2-cups-1x360-01.jpg?v=1751973699&width=1080',
    minOrder: '360 adet'
  },
  {
    id: '5',
    name: 'Bardak Kılıfı 12-16oz Kahverengi',
    code: 'BK-1216-005',
    price: 0.05,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-sleeve-12-16oz-brown-1x1000-01.jpg?v=1751972221&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '6',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 16oz',
    code: 'KB-16OZ-006',
    price: 0.15,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-16oz-large-insulated-1x500-01.jpg?v=1753296726&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '7',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 12oz',
    code: 'KB-12OZ-007',
    price: 0.12,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-12oz-large-insulated-1x500-01.jpg?v=1753297423&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '8',
    name: 'Beyaz Tek Cidarlı Kahve Bardağı 8oz',
    code: 'KB-8OZ-008',
    price: 0.08,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-white-single-wall-coffee-cup-8oz-small-takeaway-1x1000-01.jpg?v=1753294614&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '9',
    name: 'Bardak Taşıyıcı - 2li',
    code: 'BT-2-009',
    price: 0.25,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-carrier-2-cups-1x360-01.jpg?v=1751973699&width=1080',
    minOrder: '360 adet'
  },
  {
    id: '10',
    name: 'Bardak Kılıfı 12-16oz Kahverengi',
    code: 'BK-1216-010',
    price: 0.05,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-sleeve-12-16oz-brown-1x1000-01.jpg?v=1751972221&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '11',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 16oz',
    code: 'KB-16OZ-011',
    price: 0.15,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-16oz-large-insulated-1x500-01.jpg?v=1753296726&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '12',
    name: 'Beyaz Tek Cidarlı Kahve Bardağı 8oz',
    code: 'KB-8OZ-012',
    price: 0.08,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-white-single-wall-coffee-cup-8oz-small-takeaway-1x1000-01.jpg?v=1753294614&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '13',
    name: 'Bardak Taşıyıcı - 2li',
    code: 'BT-2-013',
    price: 0.25,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-carrier-2-cups-1x360-01.jpg?v=1751973699&width=1080',
    minOrder: '360 adet'
  },
  {
    id: '14',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 12oz',
    code: 'KB-12OZ-014',
    price: 0.12,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-12oz-large-insulated-1x500-01.jpg?v=1753297423&width=1080',
    minOrder: '500 adet'
  },
  {
    id: '15',
    name: 'Bardak Kılıfı 12-16oz Kahverengi',
    code: 'BK-1216-015',
    price: 0.05,
    category: 'lid',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-cup-sleeve-12-16oz-brown-1x1000-01.jpg?v=1751972221&width=1080',
    minOrder: '1000 adet'
  },
  {
    id: '16',
    name: 'Kahverengi Çift Cidarlı Kahve Bardağı 16oz',
    code: 'KB-16OZ-016',
    price: 0.15,
    category: 'cup',
    image: 'https://packagingwise.co.uk/cdn/shop/files/packaging-wise-brown-double-wall-coffee-cup-16oz-large-insulated-1x500-01.jpg?v=1753296726&width=1080',
    minOrder: '500 adet'
  },
]

export default function HomePage() {
  const [gridCols, setGridCols] = useState(4)
  const [activeCategory, setActiveCategory] = useState('cups')
  const [searchQuery, setSearchQuery] = useState('')

  const getGridClass = () => {
    if (gridCols === 1) return 'grid-cols-1'
    if (gridCols === 2) return 'grid-cols-2'
    if (gridCols === 4) return 'grid-cols-2 md:grid-cols-4'
    if (gridCols === 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
    if (gridCols === 8) return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
    return 'grid-cols-2 md:grid-cols-4'
  }

  const cupProducts = products.filter(p => p.category === 'cup')
  const lidProducts = products.filter(p => p.category === 'lid')
  
  let displayProducts = activeCategory === 'cups' ? cupProducts : lidProducts

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
          <div className="flex justify-center mb-4">
            <Image 
              src="https://packagingwise.co.uk/cdn/shop/files/Logo.png?v=1754919663&width=400"
              alt="Packaging Wise Logo"
              width={200}
              height={60}
              className="object-contain"
            />
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

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-4">
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
                <div className="space-y-1">
                  <p className={`font-bold text-green-600 ${
                    gridCols === 1 ? 'text-3xl' : 
                    gridCols === 2 ? 'text-lg md:text-4xl' : 
                    gridCols === 4 ? 'text-xl' : 
                    'text-base'
                  }`}>
                    ₺{product.price.toFixed(2)}
                  </p>
                  <p className={`text-gray-600 bg-gray-100 rounded-full inline-block ${
                    gridCols === 2 ? 'text-[10px] px-2 py-0.5 md:text-xs md:px-2.5 md:py-1' : 
                    gridCols >= 6 ? 'text-[10px] px-2 py-0.5' : 
                    'text-xs px-2.5 py-1'
                  }`}>
                    Min. {product.minOrder}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}