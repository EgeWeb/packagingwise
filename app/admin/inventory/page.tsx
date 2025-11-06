'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product, InventoryStats, Supplier } from '@/types/inventory'
import { calculateInventoryStats } from '@/lib/inventory'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [filter, setFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateType, setUpdateType] = useState<'in' | 'out' | 'adjustment'>('in')
  const [updateQuantity, setUpdateQuantity] = useState('')
  const [updateReason, setUpdateReason] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      setStats(calculateInventoryStats(products))
    }
  }, [products])

  const loadData = async () => {
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/suppliers')
      ])

      const productsData = await productsRes.json()
      const suppliersData = await suppliersRes.json()

      setProducts(productsData)
      setSuppliers(suppliersData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleUpdateStock = async () => {
    if (!selectedProduct || !updateQuantity) return

    setLoading(true)
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStock',
          productId: selectedProduct.id,
          quantity: parseInt(updateQuantity),
          type: updateType,
          reason: updateReason || 'Manuel güncelleme'
        })
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.map(p =>
          p.id === selectedProduct.id ? data.product : p
        ))
        setShowUpdateModal(false)
        setUpdateQuantity('')
        setUpdateReason('')
        setSelectedProduct(null)
      }
    } catch (error) {
      console.error('Failed to update stock:', error)
    } finally {
      setLoading(false)
    }
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
      case 'low_stock': return 'Düşük Stok'
      case 'out_of_stock': return 'Tükendi'
      default: return 'Bilinmiyor'
    }
  }

  const getSupplierName = (supplierId: string) => {
    return suppliers.find(s => s.id === supplierId)?.name || 'Bilinmiyor'
  }

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.stockStatus === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stok Yönetimi</h1>
        <p className="text-gray-600 mt-1">Ürünlerinizin stok durumunu yönetin</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stokta</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tükendi</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Değer</p>
                <p className="text-2xl font-bold text-purple-600">₺{stats.totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('in_stock')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'in_stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Stokta
          </button>
          <button
            onClick={() => setFilter('low_stock')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'low_stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Düşük Stok
          </button>
          <button
            onClick={() => setFilter('out_of_stock')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'out_of_stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tükendi
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tedarikçi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Stok</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">₺{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-mono text-gray-900">{product.code}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.stock.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Eşik: {product.lowStockThreshold.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStockStatusColor(product.stockStatus)}`}>
                      {getStockStatusText(product.stockStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{getSupplierName(product.supplierId)}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs text-gray-500">
                      {new Date(product.lastRestocked).toLocaleDateString('tr-TR')}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowUpdateModal(true)
                      }}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Stok Güncelle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Stock Modal */}
      {showUpdateModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Stok Güncelle</h3>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{selectedProduct.name}</p>
                  <p className="text-xs text-gray-500">{selectedProduct.code}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    Mevcut Stok: {selectedProduct.stock.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İşlem Tipi</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setUpdateType('in')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        updateType === 'in' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Giriş
                    </button>
                    <button
                      onClick={() => setUpdateType('out')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        updateType === 'out' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Çıkış
                    </button>
                    <button
                      onClick={() => setUpdateType('adjustment')}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                        updateType === 'adjustment' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Düzeltme
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {updateType === 'adjustment' ? 'Yeni Stok Miktarı' : 'Miktar'}
                  </label>
                  <input
                    type="number"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sebep (Opsiyonel)</label>
                  <input
                    type="text"
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Örn: Yeni sevkiyat"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateStock}
                    disabled={loading || !updateQuantity}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
