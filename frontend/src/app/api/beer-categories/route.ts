import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ビールカテゴリ一覧取得 (GET)
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.beerCategory.findMany({
      orderBy: {
        category: 'asc'
      }
    })

    // レスポンス形式を整形
    const formattedCategories = categories.map(category => ({
      id: category.id,
      category: category.category,
      icon: category.icon,
      color: category.color
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('ビールカテゴリ一覧取得エラー:', error)
    return NextResponse.json(
      { error: 'ビールカテゴリ一覧の取得に失敗しました' },
      { status: 500 }
    )
  }
} 