'use client'

import { useState, useEffect } from 'react'
import { StockMovement, Product } from '@/types/inventory'

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<'all' | 'in' | 'out' | 'adjustment'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        fetch('/api/movements'),
        fetch('/api/inventory')
      ])

      const movementsData = await movementsRes.json()
      const productsData = await productsRes.json()

      setMovements(movementsData)
      setProducts(productsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Bilinmeyen Ürün'
  }

  const getProductCode = (productId: string) => {
    return products.find(p => p.id === productId)?.code || '-'
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'bg-green-100 text-green-800'
      case 'out': return 'bg-red-100 text-red-800'
      case 'adjustment': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'in': return 'Giriş'
      case 'out': return 'Çıkış'
      case 'adjustment': return 'Düzeltme'
      default: return 'Bilinmiyor'
    }
  }

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
          </svg>
        )
      case 'out':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 0l4 4m-4-4l-4 4" />
          </svg>
        )
      case 'adjustment':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        )
    }
  }

  const filteredMovements = filter === 'all'
    ? movements
    : movements.filter(m => m.type === filter)

  // Sort by date, most recent first
  const sortedMovements = [...filteredMovements].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calculate totals
  const totalIn = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0)
  const totalOut = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0)
  const totalAdjustments = movements.filter(m => m.type === 'adjustment').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stok Hareketleri</h1>
        <p className="text-gray-600 mt-1">Tüm stok giriş, çıkış ve düzeltmelerini takip edin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Hareket</p>
              <p className="text-2xl font-bold text-gray-900">{movements.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Giriş</p>
              <p className="text-2xl font-bold text-green-600">{totalIn.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m0 0l4 4m-4-4l-4 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Çıkış</p>
              <p className="text-2xl font-bold text-red-600">{totalOut.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Düzeltmeler</p>
              <p className="text-2xl font-bold text-purple-600">{totalAdjustments}</p>
            </div>
          </div>
        </div>
      </div>

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
            onClick={() => setFilter('in')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'in' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Giriş
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'out' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Çıkış
          </button>
          <button
            onClick={() => setFilter('adjustment')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'adjustment' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Düzeltme
          </button>
        </div>
      </div>

      {/* Movements Timeline */}
      <div className="bg-white rounded-lg shadow-sm">
        {sortedMovements.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">Henüz stok hareketi bulunmamaktadır</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedMovements.map((movement) => (
              <div key={movement.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getMovementTypeColor(movement.type).replace('text-', 'bg-').replace('800', '100')}`}>
                    {getMovementTypeIcon(movement.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{getProductName(movement.productId)}</h3>
                        <p className="text-sm text-gray-500">{getProductCode(movement.productId)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeText(movement.type)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Miktar</p>
                        <p className={`text-lg font-bold ${
                          movement.type === 'in' ? 'text-green-600' :
                          movement.type === 'out' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}
                          {Math.abs(movement.quantity).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Tarih</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(movement.date).toLocaleDateString('tr-TR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(movement.date).toLocaleTimeString('tr-TR')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Yapan</p>
                        <p className="text-sm font-medium text-gray-900">{movement.performedBy}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Sebep</p>
                        <p className="text-sm font-medium text-gray-900">{movement.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
