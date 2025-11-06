import { NextRequest, NextResponse } from 'next/server'
import { Product } from '@/types/inventory'
import { getStockStatus, addStockMovement } from '@/lib/inventory'

// In-memory storage (in a real app, this would be a database)
let products: Product[] = []

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')

  let filteredProducts = products

  if (status && status !== 'all') {
    filteredProducts = products.filter(p => p.stockStatus === status)
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.action === 'initialize') {
    // Initialize products
    products = body.products
    return NextResponse.json({ success: true, products })
  }

  if (body.action === 'updateStock') {
    const { productId, quantity, type, reason } = body

    const product = products.find(p => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Update stock
    const oldStock = product.stock
    if (type === 'in') {
      product.stock += quantity
    } else if (type === 'out') {
      product.stock = Math.max(0, product.stock - quantity)
    } else if (type === 'adjustment') {
      product.stock = quantity
    }

    // Update stock status
    product.stockStatus = getStockStatus(product.stock, product.lowStockThreshold)
    product.lastRestocked = new Date().toISOString()

    // Record movement
    addStockMovement({
      productId,
      type,
      quantity: type === 'adjustment' ? quantity - oldStock : quantity,
      reason,
      performedBy: 'Admin'
    })

    return NextResponse.json({ success: true, product })
  }

  if (body.action === 'updateThreshold') {
    const { productId, threshold } = body

    const product = products.find(p => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    product.lowStockThreshold = threshold
    product.stockStatus = getStockStatus(product.stock, threshold)

    return NextResponse.json({ success: true, product })
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
