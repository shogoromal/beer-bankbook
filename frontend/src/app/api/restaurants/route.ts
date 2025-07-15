import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// レストラン一覧取得 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    // 検索条件を構築
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = {
        category: { contains: category, mode: 'insensitive' }
      }
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // レスポンス形式を整形
    const formattedRestaurants = restaurants.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      category: restaurant.category?.category || '',
      address: restaurant.address,
      phone: restaurant.phone,
      website: restaurant.website,
      imageUrl: restaurant.imageUrl,
      latitude: restaurant.latitude ? parseFloat(restaurant.latitude.toString()) : null,
      longitude: restaurant.longitude ? parseFloat(restaurant.longitude.toString()) : null
    }))

    return NextResponse.json(formattedRestaurants)
  } catch (error) {
    console.error('レストラン一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'レストラン一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
} 