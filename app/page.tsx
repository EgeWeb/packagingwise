// app/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

const products = [
  {
    id: '1',
    name: 'Premium Laptop Çantası',
    code: 'LPT-001',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
  },
  {
    id: '2',
    name: 'Modern Ofis Koltuğu',
    code: 'OFK-002',
    price: 3499.99,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
  },
  {
    id: '3',
    name: 'Organik Pamuklu Havlu Seti',
    code: 'HVL-003',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=500',
  },
  {
    id: '4',
    name: 'Smart Buzdolabı',
    code: 'BZD-004',
    price: 15999.99,
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500',
  },
  {
    id: '5',
    name: 'Wireless Mouse',
    code: 'MSE-005',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
  },
  {
    id: '6',
    name: 'Ahşap Kitaplık',
    code: 'KTP-006',
    price: 2799.99,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500',
  },
  {
    id: '7',
    name: 'Yün Halı',
    code: 'HLI-007',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=500',
  },
  {
    id: '8',
    name: 'Çamaşır Makinesi',
    code: 'CMK-008',
    price: 8999.99,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500',
  },
  {
    id: '9',
    name: 'LED Masa Lambası',
    code: 'LMB-009',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
  },
  {
    id: '10',
    name: 'Bluetooth Hoparlör',
    code: 'HPR-010',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  },
  {
    id: '11',
    name: 'Yoga Matı',
    code: 'YGA-011',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
  },
  {
    id: '12',
    name: 'Kahve Makinesi',
    code: 'KHV-012',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
  },
]

export default function HomePage() {
  const [gridCols, setGridCols] = useState(4)

  const gridClass = {
    2: 'grid-cols-2',
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    8: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8',
  }[gridCols]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-blue-600">E-KATALOG</h1>
              <input
                type="search"
                placeholder="Ürün ara..."
                className="hidden md:block w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">Görünüm:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setGridCols(2)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    gridCols === 2
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    gridCols === 4
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  4
                </button>
                <button
                  onClick={() => setGridCols(6)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    gridCols === 6
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  6
                </button>
                <button
                  onClick={() => setGridCols(8)}
                  className={`px-3 py-2 rounded-lg font-semibold transition ${
                    gridCols === 8
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  8
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className={`grid ${gridClass} gap-4`}>
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{product.code}</p>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-blue-600">
                  {product.price.toLocaleString('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}