# 開発者ガイド

Beer Bankbook プロジェクトの開発環境セットアップと機能拡張に関するガイドです。

## プロジェクト概要

### アーキテクチャ

```
beer-bankbook/
├── frontend/                    # Next.js アプリケーション
│   ├── src/
│   │   ├── app/                # App Router ベースのページ
│   │   │   ├── api/           # API Routes
│   │   │   ├── drinking/      # 飲酒記録関連ページ
│   │   │   └── beers/         # ビール管理ページ
│   │   └── lib/               # 共通ライブラリ
│   └── prisma/                # Prisma スキーマ
├── database/                   # データベース関連
│   └── init/                  # 初期化SQL
├── docs/                      # ドキュメント
└── docker-compose.yml         # 開発環境定義
```

### 技術スタック

| 領域 | 技術 | バージョン | 用途 |
|------|------|-----------|------|
| Frontend | Next.js | 15.3.5 | フルスタックフレームワーク |
| UI | React | 19.0.0 | ユーザーインターフェース |
| 言語 | TypeScript | 5.x | 型安全な開発 |
| スタイリング | Tailwind CSS | 4.x | CSS フレームワーク |
| Database | PostgreSQL | 16 | リレーショナルデータベース |
| ORM | Prisma | 6.x | データベースORM |
| コンテナ | Docker | - | 開発環境構築 |
| DB管理 | pgAdmin | 4 | データベース管理ツール |

## 開発環境セットアップ

### 1. 前提条件

- **Docker Desktop**: 最新版
- **Node.js**: 18.x 以上（ローカル開発時）
- **Git**: 最新版

### 2. プロジェクトクローン

```bash
git clone <repository-url>
cd beer-bankbook
```

### 3. 環境変数設定

```bash
# 環境変数ファイルをコピー
cp env.example .env

# 必要に応じて編集（基本的にはデフォルト値で動作）
nano .env
```

### 4. Docker環境起動

```bash
# バックグラウンドでコンテナ起動
docker-compose up -d

# ログ確認
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 5. 依存関係インストール

```bash
cd frontend

# パッケージインストール
npm install

# Prismaクライアント生成
npx prisma generate
```

### 6. データベース初期化

```bash
# スキーマとサンプルデータの投入
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/01-init-schema.sql
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/02-sample-data.sql
```

### 7. 開発サーバー起動

```bash
cd frontend
npm run dev
```

### 8. Makefileを使用した自動セットアップ（推奨）

手動セットアップの代わりに、Makefileを使用して全工程を自動化できます：

```bash
# ワンコマンドでセットアップ完了
make setup

# または個別コマンド
make start          # アプリケーション起動
make db-status      # データベース状況確認
make logs           # ログ表示
```

## Makefileによる開発効率化

### 利用可能なコマンド

```bash
# コマンド一覧表示
make help
```

### 基本操作
```bash
make setup          # 初回セットアップ（環境構築）
make start          # アプリケーション起動
make stop           # アプリケーション停止
make restart        # アプリケーション再起動
make logs           # ログ表示
```

### データベース操作
```bash
make db-init        # データベース初期化
make db-sample      # サンプルデータ追加
make db-reset       # データベースリセット
make db-status      # データベース状況確認
make db-shell       # データベースシェル接続
```

### 開発用コマンド
```bash
make dev-logs               # フロントエンドログのみ表示
make dev-restart-frontend   # フロントエンドのみ再起動
make dev-rebuild            # フロントエンドの再ビルド
make health                 # ヘルスチェック
```

### メンテナンス
```bash
make clean          # 不要なファイル・イメージ削除
```

## サンプルデータ管理

### サンプルデータの構成

#### ファイル構成
```
database/init/
├── 01-init-schema.sql           # データベーススキーマ
├── 02-sample-data.sql           # 基本サンプルデータ
└── 03-restaurant-beer-samples.sql  # レストランビール詳細サンプル
```

#### データ内容
- **市販ビール**: 10種類（基本情報のみ）
- **レストランビール**: 6種類（全フィールド完備）
- **レストラン**: 10店舗
- **カテゴリ**: ビール7種、レストラン7種

### サンプルデータの操作

#### 自動追加
```bash
# Makefileを使用（推奨）
make db-sample

# 手動実行
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/03-restaurant-beer-samples.sql
```

#### データ確認
```bash
# 統計情報表示
make db-status

# SQLシェルで直接確認
make db-shell
\dt                 # テーブル一覧
SELECT * FROM beer WHERE beer_type = 'restaurant';
```

#### データリセット
```bash
# 全データ削除・再構築
make db-reset
```

### カスタムサンプルデータの追加

新しいサンプルデータを追加する場合：

1. **SQLファイル作成**
```bash
touch database/init/04-custom-data.sql
```

2. **SQL文記述**
```sql
-- 例: 新しいビールカテゴリ追加
INSERT INTO beer_category (category, icon, color) VALUES 
('セゾン', '🌾', '#F59E0B'),
('バーレイワイン', '🍯', '#92400E');

-- 例: 新しいレストランビール追加
INSERT INTO beer (name, beer_type, category_id, alcohol_content, restaurant_id, price, country, description) VALUES 
('限定セゾン', 'restaurant', 
 (SELECT id FROM beer_category WHERE category = 'セゾン'), 
 5.5, 
 (SELECT id FROM restaurant WHERE name = 'クラフトビールタップ'), 
 980.00, 
 'Belgium', 
 '期間限定のベルギー風セゾン');
```

3. **データ追加実行**
```bash
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/04-custom-data.sql
```

アクセス先:
- **Frontend**: http://localhost:3000
- **pgAdmin**: http://localhost:8080

## API 開発

### エンドポイント作成手順

1. **ルートファイル作成**
   ```bash
   # 例: 新しいカテゴリAPIの作成
   mkdir -p frontend/src/app/api/categories
   touch frontend/src/app/api/categories/route.ts
   ```

2. **基本構造実装**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { prisma } from '@/lib/prisma'

   // GET /api/categories
   export async function GET(request: NextRequest) {
     try {
       const categories = await prisma.category.findMany()
       return NextResponse.json(categories)
     } catch (error) {
       console.error('カテゴリ取得エラー:', error)
       return NextResponse.json(
         { error: 'カテゴリの取得に失敗しました' },
         { status: 500 }
       )
     }
   }

   // POST /api/categories
   export async function POST(request: NextRequest) {
     try {
       const body = await request.json()
       const category = await prisma.category.create({
         data: body
       })
       return NextResponse.json(category, { status: 201 })
     } catch (error) {
       console.error('カテゴリ作成エラー:', error)
       return NextResponse.json(
         { error: 'カテゴリの作成に失敗しました' },
         { status: 500 }
       )
     }
   }
   ```

3. **型定義追加**
   ```typescript
   // types/index.ts
   export interface Category {
     id: string
     name: string
     description?: string
     createdAt: Date
     updatedAt: Date
   }
   ```

### パラメータ処理

```typescript
// クエリパラメータ
const { searchParams } = new URL(request.url)
const page = parseInt(searchParams.get('page') || '1')
const limit = parseInt(searchParams.get('limit') || '10')

// パスパラメータ（動的ルーティング）
// ファイル名: [id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  // ...
}
```

### エラーハンドリングベストプラクティス

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    if (!body.name) {
      return NextResponse.json(
        { error: '名前は必須です' },
        { status: 400 }
      )
    }

    const result = await prisma.item.create({
      data: body
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('作成エラー:', error)
    
    // Prismaエラーの詳細処理
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '既に存在する名前です' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: '内部サーバーエラー' },
      { status: 500 }
    )
  }
}
```

## データベース開発

### Prismaスキーマ更新手順

1. **スキーマファイル編集**
   ```prisma
   // frontend/prisma/schema.prisma
   model NewTable {
     id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
     name      String
     createdAt DateTime @default(now()) @map("created_at")
     updatedAt DateTime @updatedAt @map("updated_at")

     @@map("new_table")
   }
   ```

2. **データベース反映**
   ```bash
   # 開発環境での即座反映
   npx prisma db push

   # または、マイグレーションファイル生成
   npx prisma migrate dev --name add_new_table
   ```

3. **クライアント再生成**
   ```bash
   npx prisma generate
   ```

### データベースシード作成

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // サンプルデータ作成
  await prisma.user.createMany({
    data: [
      { email: 'user1@example.com', name: 'User 1' },
      { email: 'user2@example.com', name: 'User 2' },
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

実行:
```bash
npx prisma db seed
```

### よく使うPrismaクエリパターン

```typescript
// 基本のCRUD
const users = await prisma.user.findMany()
const user = await prisma.user.findUnique({ where: { id } })
const newUser = await prisma.user.create({ data: userData })
const updatedUser = await prisma.user.update({ where: { id }, data: updateData })
await prisma.user.delete({ where: { id } })

// リレーション含む取得
const userWithPosts = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: true,
    profile: true
  }
})

// 条件検索
const filteredUsers = await prisma.user.findMany({
  where: {
    AND: [
      { name: { contains: 'search' } },
      { createdAt: { gte: new Date('2024-01-01') } }
    ]
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
})

// 集計
const userCount = await prisma.user.count()
const avgAge = await prisma.user.aggregate({
  _avg: { age: true }
})
```

## フロントエンド開発

### ページ作成手順

1. **ページファイル作成**
   ```bash
   mkdir -p frontend/src/app/new-feature
   touch frontend/src/app/new-feature/page.tsx
   ```

2. **基本構造実装**
   ```typescript
   'use client'

   import { useState, useEffect } from 'react'
   import Link from 'next/link'

   export default function NewFeaturePage() {
     const [data, setData] = useState([])
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       loadData()
     }, [])

     const loadData = async () => {
       try {
         const response = await fetch('/api/new-feature')
         const result = await response.json()
         setData(result)
       } catch (error) {
         console.error('データ取得エラー:', error)
       } finally {
         setLoading(false)
       }
     }

     if (loading) {
       return <div>読み込み中...</div>
     }

     return (
       <main>
         <h1>新機能</h1>
         {/* コンテンツ */}
       </main>
     )
   }
   ```

### カスタムフック作成

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react'

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('データの取得に失敗しました')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
```

使用例:
```typescript
const { data: beers, loading, error } = useApi<Beer[]>('/api/beers')
```

### コンポーネント共通化

```typescript
// components/common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function LoadingSpinner({ size = 'md', color = 'amber' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`border-4 border-${color}-600 border-t-transparent rounded-full animate-spin ${sizeClasses[size]}`}></div>
  )
}
```

## テスト

### APIテスト例

```typescript
// __tests__/api/beers.test.ts
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/beers/route'

describe('/api/beers', () => {
  describe('GET', () => {
    it('ビール一覧を取得できる', async () => {
      const request = new NextRequest('http://localhost:3000/api/beers')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('POST', () => {
    it('新しいビールを作成できる', async () => {
      const beerData = {
        name: 'テストビール',
        brewery: 'テスト醸造所'
      }

      const request = new NextRequest('http://localhost:3000/api/beers', {
        method: 'POST',
        body: JSON.stringify(beerData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.name).toBe(beerData.name)
    })
  })
})
```

### コンポーネントテスト例

```typescript
// __tests__/components/BeerCard.test.tsx
import { render, screen } from '@testing-library/react'
import { BeerCard } from '@/components/BeerCard'

const mockBeer = {
  id: '1',
  name: 'テストビール',
  brewery: 'テスト醸造所',
  category: 'ラガー',
  alcoholContent: 5.0
}

describe('BeerCard', () => {
  it('ビール情報が正しく表示される', () => {
    render(<BeerCard beer={mockBeer} />)

    expect(screen.getByText('テストビール')).toBeInTheDocument()
    expect(screen.getByText('テスト醸造所')).toBeInTheDocument()
    expect(screen.getByText('アルコール度数: 5.0%')).toBeInTheDocument()
  })
})
```

## デプロイメント

### 本番環境設定

```bash
# 本番用環境変数設定
cp env.example .env.production

# 本番用Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### ビルド最適化

```typescript
// next.config.ts
const nextConfig = {
  // 画像最適化
  images: {
    domains: ['example.com', 'cdn.example.com']
  },
  
  // 静的エクスポート（必要な場合）
  output: 'export',
  
  // 実験的機能
  experimental: {
    turbo: {
      // Turbopackオプション
    }
  }
}

export default nextConfig
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Prismaクライアント生成エラー

```bash
# エラー: Prisma client not generated
# 解決方法:
npx prisma generate
npm run dev
```

#### 2. データベース接続エラー

```bash
# エラー: Connection refused
# 解決方法:
docker-compose down
docker-compose up -d postgres
# データベース起動を待ってから
docker-compose up -d frontend
```

#### 3. ポート競合

```bash
# エラー: Port already in use
# 解決方法:
lsof -ti:3000 | xargs kill -9  # プロセス強制終了
# または docker-compose.yml でポート変更
```

#### 4. TypeScriptエラー

```bash
# エラー: Type errors
# 解決方法:
npm run type-check
# 型定義ファイル更新
npm install @types/node@latest
```

## コーディング規約

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string
  name: string
  email: string
}

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ❌ Bad
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

### ファイル命名

```
// ページ
src/app/feature/page.tsx

// コンポーネント
components/FeatureCard.tsx        # PascalCase
components/common/Button.tsx      # 共通コンポーネント

// フック
hooks/useFeature.ts              # camelCase

// API
src/app/api/features/route.ts     # snake_case for URLs

// ユーティリティ
lib/utils.ts                     # camelCase
```

### コミットメッセージ

```bash
# 形式: type(scope): description

feat(api): ビール検索APIにフィルター機能を追加
fix(ui): ビール追加フォームのバリデーション修正
docs(readme): セットアップ手順を更新
refactor(db): Prismaスキーマを整理
test(api): ビールAPIのテストケースを追加
```

## 機能拡張のベストプラクティス

### 1. 新機能開発の流れ

1. **要件定義** → 機能仕様書作成
2. **設計** → API設計, DB設計
3. **実装** → バックエンド → フロントエンド
4. **テスト** → 単体テスト, 統合テスト
5. **ドキュメント更新** → API仕様書, 機能ガイド

### 2. パフォーマンス考慮事項

- **データベース**: 適切なインデックス設定
- **API**: ページネーション実装
- **フロントエンド**: 仮想化, メモ化
- **画像**: Next.js Image コンポーネント使用

### 3. セキュリティ

- **入力検証**: サーバーサイドでの必須検証
- **SQLインジェクション**: Prismaによる自動エスケープ
- **XSS**: dangerouslySetInnerHTML の使用禁止
- **認証**: JWT + httpOnly Cookie （実装予定）

このガイドを参考に、安全で拡張性の高い機能開発を進めてください。 