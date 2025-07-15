# API仕様書

Beer Bankbook アプリケーションのAPI仕様書です。

## 概要

- **ベースURL**: `http://localhost:3000/api`
- **認証**: 現在は未実装（将来的にJWTトークンベース認証を予定）
- **レスポンス形式**: JSON
- **文字エンコーディング**: UTF-8

## エンドポイント一覧

### ビール関連

#### 1. ビール一覧取得

```http
GET /api/beers
```

**説明**: 条件に基づいてビール一覧を取得します。

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|-----|-----|---|
| `search` | string | No | ビール名、醸造所、説明での検索 | `アサヒ` |
| `category` | string | No | カテゴリ名での絞り込み | `ラガー` |
| `minAlcohol` | number | No | 最小アルコール度数 | `4.0` |
| `maxAlcohol` | number | No | 最大アルコール度数 | `6.0` |
| `brewery` | string | No | 醸造所名での絞り込み | `アサヒビール` |

**レスポンス例**:
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "アサヒスーパードライ",
    "brewery": "アサヒビール",
    "category": "ラガー",
    "alcoholContent": 5.0,
    "imageUrl": "https://example.com/asahi.jpg",
    "country": "日本",
    "description": "キレ味抜群のドライなビール",
    "untappdId": "asahi_super_dry"
  }
]
```

**エラーレスポンス**:
```json
{
  "error": "ビール一覧の取得に失敗しました"
}
```

#### 2. ビール追加

```http
POST /api/beers
```

**説明**: 新しいビールをデータベースに追加します。

**リクエストボディ**:
```json
{
  "name": "新しいビール名",
  "brewery": "醸造所名",
  "categoryId": "550e8400-e29b-41d4-a716-446655440001",
  "alcoholContent": 5.5,
  "country": "日本",
  "description": "ビールの説明",
  "imageUrl": "https://example.com/beer.jpg",
  "untappdId": "beer_id"
}
```

**必須フィールド**:
- `name`: ビール名

**レスポンス例**:
```json
{
  "id": "新しく生成されたUUID",
  "name": "新しいビール名",
  "brewery": "醸造所名",
  "category": "ラガー",
  "alcoholContent": 5.5,
  "imageUrl": "https://example.com/beer.jpg",
  "country": "日本",
  "description": "ビールの説明",
  "untappdId": "beer_id"
}
```

**エラーレスポンス**:
```json
{
  "error": "ビール名は必須です"
}
```

### ビールカテゴリ関連

#### 3. ビールカテゴリ一覧取得

```http
GET /api/beer-categories
```

**説明**: 利用可能なビールカテゴリ一覧を取得します。

**レスポンス例**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "category": "ラガー",
    "icon": "🍺",
    "color": "#FFD700"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "category": "エール",
    "icon": "🍻",
    "color": "#FF8C00"
  }
]
```

### レストラン関連

#### 4. レストラン一覧取得

```http
GET /api/restaurants
```

**説明**: 条件に基づいてレストラン一覧を取得します。

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 | 例 |
|-----------|---|-----|-----|---|
| `search` | string | No | レストラン名、住所での検索 | `鳥貴族` |
| `category` | string | No | カテゴリ名での絞り込み | `居酒屋` |

**レスポンス例**:
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "name": "鳥貴族 渋谷店",
    "category": "居酒屋",
    "address": "東京都渋谷区渋谷1-1-1",
    "phone": "03-1234-5678",
    "website": "https://torikizoku.co.jp",
    "imageUrl": "https://example.com/torikizoku.jpg",
    "latitude": 35.6598,
    "longitude": 139.7006
  }
]
```

### 飲酒記録関連

#### 5. 飲酒記録保存

```http
POST /api/drinking
```

**説明**: 新しい飲酒記録を保存します。

**リクエストボディ**:
```json
{
  "userId": "990e8400-e29b-41d4-a716-446655440001",
  "beerId": "660e8400-e29b-41d4-a716-446655440001",
  "restaurantId": "880e8400-e29b-41d4-a716-446655440001",
  "amount": 350,
  "price": 500,
  "time": "2024-01-15T19:30:00+09:00",
  "text": "今日の一杯は最高でした！",
  "rating": 5,
  "share": true,
  "imageUrl": "https://example.com/drink.jpg",
  "locationLat": 35.6598,
  "locationLng": 139.7006,
  "weather": "晴れ"
}
```

**必須フィールド**:
- `userId`: ユーザーID
- `beerId`: ビールID
- `amount`: 容量（ml）
- `time`: 飲酒時刻

**レスポンス例**:
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440001",
  "amount": 350,
  "price": 500,
  "time": "2024-01-15T19:30:00+09:00",
  "text": "今日の一杯は最高でした！",
  "rating": 5,
  "share": true,
  "imageUrl": "https://example.com/drink.jpg",
  "locationLat": 35.6598,
  "locationLng": 139.7006,
  "weather": "晴れ",
  "beer": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "アサヒスーパードライ",
    "brewery": "アサヒビール",
    "category": "ラガー",
    "alcoholContent": 5.0
  },
  "restaurant": {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "name": "鳥貴族 渋谷店",
    "category": "居酒屋",
    "address": "東京都渋谷区渋谷1-1-1"
  },
  "createdAt": "2024-01-15T19:30:00+09:00",
  "updatedAt": "2024-01-15T19:30:00+09:00"
}
```

## エラーハンドリング

### HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 201 | 作成成功 |
| 400 | 不正なリクエスト |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

### エラーレスポンス形式

```json
{
  "error": "エラーメッセージ"
}
```

## データ型定義

### Beer型

```typescript
interface Beer {
  id: string;
  name: string;
  brewery: string;
  category: string;
  alcoholContent: number;
  imageUrl?: string;
  country?: string;
  description?: string;
  untappdId?: string;
}
```

### BeerCategory型

```typescript
interface BeerCategory {
  id: string;
  category: string;
  icon?: string;
  color?: string;
}
```

### Restaurant型

```typescript
interface Restaurant {
  id: string;
  name: string;
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}
```

### DrinkingRecord型

```typescript
interface DrinkingRecord {
  id: string;
  amount: number;
  price?: number;
  time: string;
  text?: string;
  rating?: number;
  share: boolean;
  imageUrl?: string;
  locationLat?: number;
  locationLng?: number;
  weather?: string;
  beer?: Beer;
  restaurant?: Restaurant;
  createdAt: string;
  updatedAt: string;
}
```

## 使用例

### 検索機能を使ったビール一覧取得

```javascript
// アルコール度数4-6%のラガーを検索
const response = await fetch('/api/beers?category=ラガー&minAlcohol=4.0&maxAlcohol=6.0');
const beers = await response.json();

// アサヒビールのビールを検索
const response = await fetch('/api/beers?brewery=アサヒビール');
const beers = await response.json();

// キーワード検索
const response = await fetch('/api/beers?search=スーパードライ');
const beers = await response.json();
```

### 新しいビールの追加

```javascript
const newBeer = {
  name: "クラフトIPA",
  brewery: "地ビール工房",
  categoryId: "550e8400-e29b-41d4-a716-446655440003", // IPA
  alcoholContent: 6.5,
  country: "日本",
  description: "ホップの香りが強いクラフトビール"
};

const response = await fetch('/api/beers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newBeer)
});

const addedBeer = await response.json();
```

### 飲酒記録の保存

```javascript
const drinkingRecord = {
  userId: "990e8400-e29b-41d4-a716-446655440001",
  beerId: "660e8400-e29b-41d4-a716-446655440001",
  amount: 350,
  price: 500,
  time: new Date().toISOString(),
  rating: 5,
  text: "美味しかった！",
  share: true
};

const response = await fetch('/api/drinking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(drinkingRecord)
});

const savedRecord = await response.json();
```

## 開発者向け情報

### 新しいエンドポイントの追加方法

1. `frontend/src/app/api/` ディレクトリに新しいルートファイルを作成
2. Next.js App Router の規約に従って `route.ts` ファイルを作成
3. HTTP メソッド（GET, POST, PUT, DELETE）に対応する関数をエクスポート
4. Prisma クライアントを使用してデータベース操作を実装
5. 適切なエラーハンドリングとレスポンス形式を実装

### データベーススキーマの変更方法

1. `frontend/prisma/schema.prisma` ファイルを更新
2. `npx prisma db push` でデータベースに反映
3. `npx prisma generate` でクライアントコードを再生成

### 認証機能の実装予定

将来的に以下の認証機能を実装予定：

- JWT トークンベース認証
- NextAuth.js による OAuth 連携
- ユーザー登録・ログイン機能
- API エンドポイントの認証ミドルウェア 