import { NextRequest, NextResponse } from 'next/server'
import { Supplier } from '@/types/inventory'
import { initialSuppliers } from '@/lib/inventory'

// In-memory storage (in a real app, this would be a database)
const suppliers: Supplier[] = [...initialSuppliers]

export async function GET() {
  return NextResponse.json(suppliers)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body.action === 'create') {
    const newSupplier: Supplier = {
      ...body.supplier,
      id: `SUP-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    suppliers.push(newSupplier)
    return NextResponse.json({ success: true, supplier: newSupplier })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { supplierId, updates } = body

  const supplierIndex = suppliers.findIndex(s => s.id === supplierId)
  if (supplierIndex === -1) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  suppliers[supplierIndex] = {
    ...suppliers[supplierIndex],
    ...updates
  }

  return NextResponse.json({ success: true, supplier: suppliers[supplierIndex] })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const supplierId = searchParams.get('id')

  if (!supplierId) {
    return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 })
  }

  const supplierIndex = suppliers.findIndex(s => s.id === supplierId)
  if (supplierIndex === -1) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  suppliers.splice(supplierIndex, 1)
  return NextResponse.json({ success: true })
}
