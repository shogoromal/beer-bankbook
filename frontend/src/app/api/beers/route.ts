import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ビール一覧取得 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const minAlcohol = searchParams.get('minAlcohol')
    const maxAlcohol = searchParams.get('maxAlcohol')
    const brewery = searchParams.get('brewery') || ''

    // 検索条件を構築
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brewery: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = {
        category: { contains: category, mode: 'insensitive' }
      }
    }

    if (brewery) {
      where.brewery = { contains: brewery, mode: 'insensitive' }
    }

    if (minAlcohol || maxAlcohol) {
      where.alcoholContent = {}
      if (minAlcohol) {
        where.alcoholContent.gte = parseFloat(minAlcohol)
      }
      if (maxAlcohol) {
        where.alcoholContent.lte = parseFloat(maxAlcohol)
      }
    }

    const beers = await prisma.beer.findMany({
      where,
      include: {
        category: true,
        restaurant: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    // レスポンス形式を整形
    const formattedBeers = beers.map(beer => ({
      id: beer.id,
      name: beer.name,
      beerType: beer.beerType,
      brewery: beer.brewery || '',
      restaurant: beer.restaurant ? {
        id: beer.restaurant.id,
        name: beer.restaurant.name,
        category: beer.restaurant.category
      } : null,
      category: beer.category?.category || '',
      alcoholContent: beer.alcoholContent ? parseFloat(beer.alcoholContent.toString()) : 0,
      price: beer.price ? parseFloat(beer.price.toString()) : null,
      imageUrl: beer.imageUrl,
      country: beer.country,
      description: beer.description,
      untappdId: beer.untappdId
    }))

    return NextResponse.json(formattedBeers)
  } catch (error) {
    console.error('ビール一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'ビール一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 新規ビール追加 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      beerType,
      brewery,
      restaurantId,
      categoryId,
      alcoholContent,
      price,
      country,
      description,
      imageUrl,
      untappdId
    } = body

    // 必須フィールドの確認
    if (!name) {
      return NextResponse.json(
        { error: 'ビール名は必須です' },
        { status: 400 }
      )
    }

    // レストランビールの場合はレストランIDが必須
    if (beerType === 'restaurant' && !restaurantId) {
      return NextResponse.json(
        { error: 'レストランビールの場合、レストランの選択は必須です' },
        { status: 400 }
      )
    }

    // 新しいビールを作成
    const newBeer = await prisma.beer.create({
      data: {
        name,
        beerType: beerType || 'commercial',
        brewery: beerType === 'commercial' ? (brewery || null) : null,
        restaurantId: beerType === 'restaurant' ? (restaurantId || null) : null,
        categoryId: categoryId || null,
        alcoholContent: alcoholContent ? parseFloat(alcoholContent) : null,
        price: price ? parseFloat(price) : null,
        country: country || null,
        description: description || null,
        imageUrl: imageUrl || null,
        untappdId: untappdId || null
      },
      include: {
        category: true,
        restaurant: true
      }
    })

    // レスポンス形式を整形
    const formattedBeer = {
      id: newBeer.id,
      name: newBeer.name,
      beerType: newBeer.beerType,
      brewery: newBeer.brewery || '',
      restaurant: newBeer.restaurant ? {
        id: newBeer.restaurant.id,
        name: newBeer.restaurant.name,
        category: newBeer.restaurant.category
      } : null,
      category: newBeer.category?.category || '',
      alcoholContent: newBeer.alcoholContent ? parseFloat(newBeer.alcoholContent.toString()) : 0,
      price: newBeer.price ? parseFloat(newBeer.price.toString()) : null,
      imageUrl: newBeer.imageUrl,
      country: newBeer.country,
      description: newBeer.description,
      untappdId: newBeer.untappdId
    }

    return NextResponse.json(formattedBeer, { status: 201 })
  } catch (error) {
    console.error('ビール追加エラー:', error)
    return NextResponse.json(
      { error: 'ビールの追加に失敗しました' },
      { status: 500 }
    )
  }
} 