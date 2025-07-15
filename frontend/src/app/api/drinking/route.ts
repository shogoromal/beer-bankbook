import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 飲酒記録保存 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      beerId,
      restaurantId,
      amount,
      price,
      time,
      text,
      rating,
      share,
      imageUrl,
      locationLat,
      locationLng,
      weather
    } = body

    // 必須フィールドの確認
    if (!userId || !beerId || !amount || !time) {
      return NextResponse.json(
        { error: 'ユーザーID、ビールID、容量、時刻は必須です' },
        { status: 400 }
      )
    }

    // 飲酒記録を作成
    const drinkingRecord = await prisma.drinking.create({
      data: {
        userId,
        beerId,
        restaurantId: restaurantId || null,
        amount: parseInt(amount),
        price: price ? parseFloat(price) : null,
        time: new Date(time),
        text: text || null,
        rating: rating ? parseInt(rating) : null,
        share: share || false,
        imageUrl: imageUrl || null,
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        weather: weather || null
      },
      include: {
        beer: {
          include: {
            category: true
          }
        },
        restaurant: {
          include: {
            category: true
          }
        }
      }
    })

    // レスポンス形式を整形
    const formattedRecord = {
      id: drinkingRecord.id,
      amount: drinkingRecord.amount,
      price: drinkingRecord.price ? parseFloat(drinkingRecord.price.toString()) : null,
      time: drinkingRecord.time.toISOString(),
      text: drinkingRecord.text,
      rating: drinkingRecord.rating,
      share: drinkingRecord.share,
      imageUrl: drinkingRecord.imageUrl,
      locationLat: drinkingRecord.locationLat ? parseFloat(drinkingRecord.locationLat.toString()) : null,
      locationLng: drinkingRecord.locationLng ? parseFloat(drinkingRecord.locationLng.toString()) : null,
      weather: drinkingRecord.weather,
      beer: drinkingRecord.beer ? {
        id: drinkingRecord.beer.id,
        name: drinkingRecord.beer.name,
        brewery: drinkingRecord.beer.brewery,
        category: drinkingRecord.beer.category?.category || '',
        alcoholContent: drinkingRecord.beer.alcoholContent ? parseFloat(drinkingRecord.beer.alcoholContent.toString()) : 0
      } : null,
      restaurant: drinkingRecord.restaurant ? {
        id: drinkingRecord.restaurant.id,
        name: drinkingRecord.restaurant.name,
        category: drinkingRecord.restaurant.category?.category || '',
        address: drinkingRecord.restaurant.address
      } : null,
      createdAt: drinkingRecord.createdAt.toISOString(),
      updatedAt: drinkingRecord.updatedAt.toISOString()
    }

    return NextResponse.json(formattedRecord, { status: 201 })
  } catch (error) {
    console.error('飲酒記録保存エラー:', error)
    return NextResponse.json(
      { error: '飲酒記録の保存に失敗しました' },
      { status: 500 }
    )
  }
} 