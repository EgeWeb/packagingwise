import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/types/inventory'
import { getStockStatus } from '@/lib/inventory'

// In-memory storage (will sync with localStorage on frontend)
let products: Product[] = []

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.action === 'sync') {
    // Sync products from localStorage
    products = body.products || []
    return NextResponse.json({ success: true, products })
  }

  if (body.action === 'create') {
    const newProduct: Product = {
      ...body.product,
      id: `PROD-${Date.now()}`,
      stockStatus: getStockStatus(
        body.product.stock || 0,
        body.product.lowStockThreshold || 1000
      ),
      lastRestocked: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    products.push(newProduct)
    return NextResponse.json({ success: true, product: newProduct })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { productId, updates } = body

  const productIndex = products.findIndex(p => p.id === productId)
  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updates,
    stockStatus: getStockStatus(
      updates.stock ?? products[productIndex].stock,
      updates.lowStockThreshold ?? products[productIndex].lowStockThreshold
    )
  }

  return NextResponse.json({ success: true, product: products[productIndex] })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get('id')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const productIndex = products.findIndex(p => p.id === productId)
  if (productIndex === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const deletedProduct = products[productIndex]
  products.splice(productIndex, 1)

  return NextResponse.json({ success: true, product: deletedProduct })
}
