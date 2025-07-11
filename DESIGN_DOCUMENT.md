# ビール家計簿アプリ 設計書

## 1. プロジェクト概要

### 1.1 アプリケーション名
**ビール家計簿 (Beer Bankbook)**

### 1.2 目的
ユーザーがお店で飲んだビールを記録し、支出を追跡できるWebアプリケーション

### 1.3 主要機能
- ビール購入記録の登録・編集・削除
- 購入履歴の表示と検索
- 月別・年別の支出統計
- ビールの種類別分析

## 2. 技術スタック

### 2.1 フロントエンド
- **フレームワーク**: Next.js 15.3.5 (React 19)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **状態管理**: React Hooks + Context API
- **UIライブラリ**: 必要に応じて追加

### 2.2 バックエンド
- **フレームワーク**: Next.js API Routes
- **言語**: TypeScript
- **ORM**: Prisma
- **認証**: NextAuth.js

### 2.3 データベース
- **RDBMS**: PostgreSQL 16
- **接続プール**: PgBouncer（本番環境）

### 2.4 インフラ・開発環境
- **コンテナ化**: Docker & Docker Compose
- **開発環境**: Docker Compose for local development
- **本番環境**: クラウドサービス（AWS/GCP/Azure）

## 3. データベース設計

### 3.1 PostgreSQL設定
```sql
-- データベース作成
CREATE DATABASE beer_bankbook;
CREATE USER beer_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE beer_bankbook TO beer_user;
```

### 3.2 テーブル設計（更新）

以下の6テーブルでデータベースを再設計します。

| テーブル名 | 役割 |
| --- | --- |
| users | ユーザー情報 |
| beer_category | ビールカテゴリマスタ |
| beer | ビールマスタ |
| restaurant_category | レストランカテゴリマスタ |
| restaurant | レストランマスタ |
| drinking | 飲酒記録 |

#### 3.2.1 users テーブル（変更なし）
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.2 beer_category テーブル
```sql
CREATE TABLE beer_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL
);
```

#### 3.2.3 beer テーブル
```sql
CREATE TABLE beer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES beer_category(id)
);
```

#### 3.2.4 restaurant_category テーブル
```sql
CREATE TABLE restaurant_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL
);
```

#### 3.2.5 restaurant テーブル
```sql
CREATE TABLE restaurant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES restaurant_category(id)
);
```

#### 3.2.6 drinking テーブル
```sql
CREATE TABLE drinking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    beer_id UUID REFERENCES beer(id),
    restaurant_id UUID REFERENCES restaurant(id),
    amount INTEGER NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    text TEXT,
    share BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 インデックス設計（更新）
```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_drinking_user_time ON drinking(user_id, time);
CREATE INDEX idx_drinking_time ON drinking(time);
CREATE INDEX idx_beer_category ON beer(category_id);
CREATE INDEX idx_restaurant_category ON restaurant(category_id);
```

## 4. Docker構成

### 4.1 プロジェクト構造
```
beer-bankbook/
├── frontend/                 # Next.jsアプリケーション
├── backend/                  # APIサーバー（必要に応じて）
├── database/                 # データベース関連ファイル
│   ├── init/                 # 初期化SQL
│   └── migrations/           # マイグレーションファイル
├── docker-compose.yml        # 開発環境用
├── docker-compose.prod.yml   # 本番環境用
├── Dockerfile.frontend       # フロントエンド用Dockerfile
├── Dockerfile.backend        # バックエンド用Dockerfile
└── .env.example             # 環境変数テンプレート
```

### 4.2 Docker Compose設定

#### 4.2.1 docker-compose.yml (開発環境)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://beer_user:secure_password@postgres:5432/beer_bankbook
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - postgres
    networks:
      - beer-network

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=beer_bankbook
      - POSTGRES_USER=beer_user
      - POSTGRES_PASSWORD=secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    networks:
      - beer-network

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@beerbankbook.com
      - PGADMIN_DEFAULT_PASSWORD=admin123
    ports:
      - "8080:80"
    depends_on:
      - postgres
    networks:
      - beer-network

volumes:
  postgres_data:

networks:
  beer-network:
    driver: bridge
```

#### 4.2.2 docker-compose.prod.yml (本番環境)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://beer_user:secure_password@postgres:5432/beer_bankbook
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - postgres
    networks:
      - beer-network
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=beer_bankbook
      - POSTGRES_USER=beer_user
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - beer-network
    restart: unless-stopped

  pgbouncer:
    image: edoburu/pgbouncer:latest
    environment:
      - DB_HOST=postgres
      - DB_USER=beer_user
      - DB_PASSWORD=${POSTGRES_PASSWORD}
      - DB_NAME=beer_bankbook
      - POOL_MODE=transaction
      - MAX_CLIENT_CONN=100
      - DEFAULT_POOL_SIZE=20
    ports:
      - "6432:5432"
    depends_on:
      - postgres
    networks:
      - beer-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  beer-network:
    driver: bridge
```

### 4.3 Dockerfile設定

#### 4.3.1 frontend/Dockerfile.dev (開発環境)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

#### 4.3.2 frontend/Dockerfile.prod (本番環境)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 5. アプリケーション設計

### 5.1 ページ構成（更新）
```
/                    # ホームページ（ダッシュボード）
/login              # ログインページ
/register           # ユーザー登録
/dashboard          # メインダッシュボード
/drinking           # 飲酒記録一覧
/drinking/new       # 新規飲酒記録
/drinking/[id]      # 飲酒記録詳細・編集
/analytics          # 統計・分析ページ
/settings           # 設定ページ
```

### 5.2 API設計（更新）

#### 5.2.1 認証関連
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/session
```

#### 5.2.2 飲酒記録関連
```
GET    /api/drinking            # 飲酒記録一覧
POST   /api/drinking            # 新規飲酒記録
GET    /api/drinking/[id]       # 飲酒記録詳細
PUT    /api/drinking/[id]       # 飲酒記録更新
DELETE /api/drinking/[id]       # 飲酒記録削除
```

#### 5.2.3 マスタ管理関連
```
# ビールカテゴリ
GET  /api/beer-categories             # 一覧
POST /api/beer-categories             # 追加

# ビール
GET  /api/beers                       # 一覧
POST /api/beers                       # 追加
GET  /api/beers/[id]                  # 詳細
PUT  /api/beers/[id]                  # 更新
DELETE /api/beers/[id]                # 削除

# レストランカテゴリ
GET  /api/restaurant-categories       # 一覧
POST /api/restaurant-categories       # 追加

# レストラン
GET  /api/restaurants                 # 一覧
POST /api/restaurants                 # 追加
GET  /api/restaurants/[id]            # 詳細
PUT  /api/restaurants/[id]            # 更新
DELETE /api/restaurants/[id]          # 削除
```

#### 5.2.4 統計・分析関連
```
GET /api/analytics/monthly            # 月別統計
GET /api/analytics/yearly             # 年別統計
GET /api/analytics/beer-categories    # ビールカテゴリ別統計
GET /api/analytics/restaurant         # レストラン別統計
```

## 6. セキュリティ設計

### 6.1 認証・認可
- NextAuth.jsを使用したセッション管理
- JWTトークンの使用
- パスワードハッシュ化（bcrypt）

### 6.2 データベースセキュリティ
- 接続文字列の環境変数管理
- 最小権限の原則に基づくユーザー権限設定
- SQLインジェクション対策（Prisma ORM使用）

### 6.3 アプリケーションセキュリティ
- CSRF対策
- XSS対策
- 入力値検証
- レート制限

## 7. パフォーマンス設計

### 7.1 データベース最適化
- 適切なインデックス設定
- クエリ最適化
- 接続プール（PgBouncer）

### 7.2 フロントエンド最適化
- Next.jsのSSR/SSG活用
- 画像最適化
- コード分割
- キャッシュ戦略

## 8. 開発・デプロイメント

### 8.1 開発環境セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd beer-bankbook

# 環境変数設定
cp .env.example .env
# .envファイルを編集

# Docker環境起動
docker-compose up -d

# データベースマイグレーション
docker-compose exec frontend npx prisma migrate dev

# 開発サーバー起動
docker-compose logs -f frontend
```

### 8.2 本番環境デプロイ
```bash
# 本番環境用Docker Compose起動
docker-compose -f docker-compose.prod.yml up -d

# データベースマイグレーション
docker-compose -f docker-compose.prod.yml exec frontend npx prisma migrate deploy
```

## 9. 監視・ログ

### 9.1 ログ管理
- アプリケーションログ
- データベースログ
- アクセスログ

### 9.2 監視項目
- アプリケーションの応答時間
- データベース接続数
- エラー率
- リソース使用率

## 10. 今後の拡張予定

### 10.1 機能拡張
- モバイルアプリ対応
- ソーシャル機能（友達との共有）
- ビール評価・レビュー機能
- おすすめビール機能

### 10.2 技術拡張
- GraphQL API
- リアルタイム通知
- 機械学習による支出予測
- 多言語対応

---

この設計書に基づいて、段階的にアプリケーションを開発していきます。まずは基本的なCRUD機能から始めて、徐々に機能を追加していく予定です。 