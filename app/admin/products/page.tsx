'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product, Supplier } from '@/types/inventory'

const STORAGE_KEY = 'packagingwise_products'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: 0,
    category: 'cup' as 'cup' | 'lid',
    image: '',
    minOrder: '',
    size: '',
    color: '',
    material: '',
    description: '',
    stock: 0,
    lowStockThreshold: 1000,
    supplierId: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedProducts = JSON.parse(stored)
        setProducts(parsedProducts)
        // Sync with API
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', products: parsedProducts })
        })
      }

      // Load suppliers
      const suppliersRes = await fetch('/api/suppliers')
      const suppliersData = await suppliersRes.json()
      setSuppliers(suppliersData)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const saveToLocalStorage = (updatedProducts: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
    // Dispatch custom event to notify other tabs/pages
    window.dispatchEvent(new Event('productsUpdated'))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch('/api/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: editingProduct.id,
            updates: formData
          })
        })

        const data = await response.json()
        if (data.success) {
          const updatedProducts = products.map(p =>
            p.id === editingProduct.id ? data.product : p
          )
          saveToLocalStorage(updatedProducts)
        }
      } else {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            product: formData
          })
        })

        const data = await response.json()
        if (data.success) {
          const updatedProducts = [...products, data.product]
          saveToLocalStorage(updatedProducts)
        }
      }

      setShowModal(false)
      setEditingProduct(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        const updatedProducts = products.filter(p => p.id !== productId)
        saveToLocalStorage(updatedProducts)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      code: product.code,
      price: product.price,
      category: product.category,
      image: product.image,
      minOrder: product.minOrder,
      size: product.size || '',
      color: product.color || '',
      material: product.material || '',
      description: product.description || '',
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      supplierId: product.supplierId
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      price: 0,
      category: 'cup',
      image: '',
      minOrder: '',
      size: '',
      color: '',
      material: '',
      description: '',
      stock: 0,
      lowStockThreshold: 1000,
      supplierId: suppliers[0]?.id || ''
    })
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-1">Katalogdaki ürünleri ekleyin, düzenleyin veya silin</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            resetForm()
            setShowModal(true)
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bardaklar</p>
              <p className="text-2xl font-bold text-purple-600">
                {products.filter(p => p.category === 'cup').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Kapaklar</p>
              <p className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.category === 'lid').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Değer</p>
              <p className="text-2xl font-bold text-green-600">
                ₺{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
            <div className="relative aspect-square bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getStockStatusColor(product.stockStatus)}`}>
                  {getStockStatusText(product.stockStatus)}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">{product.code}</p>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mt-1 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
              </div>

              {(product.size || product.color || product.material) && (
                <div className="flex flex-wrap gap-1">
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
                <p className="text-xl font-bold text-green-600">₺{product.price.toFixed(2)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Min: {product.minOrder}</span>
                  <span className="font-medium text-gray-900">Stok: {product.stock.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Henüz ürün eklenmemiş</p>
          <button
            onClick={() => {
              setEditingProduct(null)
              resetForm()
              setShowModal(true)
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            İlk Ürünü Ekle
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: Kahverengi Çift Cidarlı Kahve Bardağı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Kodu *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: KB-16OZ-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'cup' | 'lid' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="cup">Bardak</option>
                      <option value="lid">Kapak/Aksesuar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Sipariş *</label>
                    <input
                      type="text"
                      required
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: 500 adet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boyut</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: 16oz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: Kahverengi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Malzeme</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Örn: Çift Cidarlı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Düşük Stok Eşiği *</label>
                    <input
                      type="number"
                      required
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi *</label>
                    <select
                      required
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Seçiniz</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ürün hakkında ek bilgiler..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Kaydediliyor...' : editingProduct ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
