import { NextRequest, NextResponse } from 'next/server'
import { getStockMovements, getRecentMovements } from '@/lib/inventory'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get('productId')
  const limit = searchParams.get('limit')

  if (productId) {
    const movements = getStockMovements(productId)
    return NextResponse.json(movements)
  }

  if (limit) {
    const movements = getRecentMovements(parseInt(limit))
    return NextResponse.json(movements)
  }

  const movements = getStockMovements()
  return NextResponse.json(movements)
}
