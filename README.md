# Beer Bankbook - ビール家計簿アプリ

ビールの飲酒記録を管理し、支出を追跡できるWebアプリケーション

## 🆕 最新アップデート

- **データベース連携機能**: PostgreSQLからリアルタイムでデータを取得
- **ビール追加機能**: 新しいビールをデータベースに追加可能
- **検索機能強化**: カテゴリ、アルコール度数、醸造所での詳細フィルタリング
- **API実装**: RESTful API でデータ操作が可能

## 📚 ドキュメント

- [📋 ドキュメント一覧](docs/INDEX.md) - 全ドキュメントの目次とガイド
- [📖 機能ガイド](docs/FEATURES.md) - アプリの機能と使い方
- [🔧 API仕様書](docs/API.md) - REST API の詳細仕様
- [👨‍💻 開発者ガイド](docs/DEVELOPMENT.md) - 開発環境構築と機能拡張

## 開発環境の起動方法

### 前提条件
- Docker Desktop がインストールされていること
- Git がインストールされていること

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd beer-bankbook
```

### 2. 環境変数の設定
```bash
# 環境変数ファイルをコピー
cp env.example .env

# 必要に応じて .env ファイルを編集
# （基本的にはデフォルト値で動作します）
```

### 3. Docker環境の起動
```bash
# バックグラウンドでコンテナを起動
docker-compose up -d

# ログを確認したい場合
docker-compose logs -f
```

### 4. フロントエンドの依存関係インストール
```bash
# フロントエンドコンテナに入る
docker-compose exec frontend sh

# Prismaクライアントのインストール
npm install @prisma/client prisma

# Prismaクライアントの生成
npx prisma generate

# コンテナから出る
exit
```

### 5. データベースの初期化
```bash
# Prismaマイグレーションの実行
docker-compose exec frontend npx prisma migrate dev --name init

# または、SQLファイルで直接初期化する場合
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/01-init-schema.sql
docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/02-sample-data.sql
```

### 6. アプリケーションへのアクセス

#### フロントエンド
- URL: http://localhost:3000
- 新しいBeer Bankbookのホームページが表示されます
- **表示内容**:
  - 今月・先月の飲酒量サマリー
  - 3つの丸いアクションボタン:
    - 🍺 **お酒を追加** → `/drinking/new`
    - 📊 **記録・統計を見る** → `/drinking`
    - 👥 **友人を探す** → `/friends`

#### 新機能へのアクセス
- **飲酒記録作成**: `http://localhost:3000/drinking/new`
  - データベースから10種類のビールを選択可能
  - 詳細検索・フィルター機能搭載
  - 新しいビールの追加機能付き
- **ビール追加**: `http://localhost:3000/beers/new`
  - 新しいビールをデータベースに登録
  - リアルタイムプレビュー機能
- **API エンドポイント**: `http://localhost:3000/api/`
  - ビール一覧取得: `/api/beers`
  - ビール追加: `POST /api/beers`
  - カテゴリ一覧: `/api/beer-categories`
  - レストラン一覧: `/api/restaurants`
  - 飲酒記録保存: `POST /api/drinking`

#### pgAdmin（データベース管理）
- URL: `http://localhost:8080`
- **ログイン情報**:
  - メールアドレス: `admin@beerbankbook.com`
  - パスワード: `admin123`
- **データベース接続設定**:
  - ホスト名: `postgres`
  - ポート: `5432`
  - データベース名: `beer_bankbook`
  - ユーザー名: `beer_user`
  - パスワード: `secure_password`

#### PostgreSQL直接接続
- Host: localhost
- Port: 5432
- Database: beer_bankbook
- Username: beer_user
- Password: secure_password

## データベース管理について

データベース管理は以下の方法で行えます：

### 1. コマンドラインでの接続
```bash
# PostgreSQLコンテナに直接接続
docker-compose exec postgres psql -U beer_user -d beer_bankbook

# テーブル一覧表示
\dt

# 特定のテーブルの内容確認
SELECT * FROM users;
SELECT * FROM drinking;
```

### 2. 外部ツールでの接続
- **DBeaver**、**TablePlus**、**pgAdmin**（ローカルインストール）などの
  データベース管理ツールで localhost:5432 に接続可能

### 3. PrismaStudioの使用（推奨）
```bash
# ブラウザベースのデータベース管理ツール
docker-compose exec frontend npx prisma studio
```

## 開発時の便利なコマンド

### Docker関連
```bash
# コンテナの状態確認
docker-compose ps

# ログの確認
docker-compose logs frontend
docker-compose logs postgres

# コンテナの再起動
docker-compose restart frontend

# 環境の停止
docker-compose down

# 環境の完全削除（データベースも含む）
docker-compose down -v
```

### Prisma関連
```bash
# コンテナ内でのPrismaコマンド実行
docker-compose exec frontend npx prisma studio
docker-compose exec frontend npx prisma db push
docker-compose exec frontend npx prisma generate
```

### データベース関連
```bash
# PostgreSQLコンテナに入る
docker-compose exec postgres psql -U beer_user -d beer_bankbook

# データベースの状態確認
docker-compose exec postgres psql -U beer_user -d beer_bankbook -c "\\dt"
```

## トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :5432
lsof -i :8080

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラーの場合
```bash
# PostgreSQLコンテナの再起動
docker-compose restart postgres

# データベースの初期化をやり直す
docker-compose down -v
docker-compose up -d
```

### フロントエンドのエラーの場合
```bash
# node_modulesを削除して再インストール
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
```

## ディレクトリ構造
```
beer-bankbook/
├── frontend/                 # Next.jsアプリケーション
│   ├── src/
│   │   ├── app/             # App Router ベースのページ
│   │   │   ├── api/        # API Routes（新実装）
│   │   │   ├── drinking/   # 飲酒記録関連ページ
│   │   │   └── beers/      # ビール管理ページ（新実装）
│   │   └── lib/            # 共通ライブラリ
│   └── prisma/             # Prismaスキーマ
├── database/                # データベース関連ファイル
│   └── init/               # 初期化SQL
├── docs/                   # ドキュメント（新追加）
│   ├── API.md              # API仕様書
│   ├── FEATURES.md         # 機能ガイド
│   └── DEVELOPMENT.md      # 開発者ガイド
├── docker-compose.yml      # 開発環境用
├── docker-compose.prod.yml # 本番環境用
└── README.md               # このファイル
```

## 主要な技術スタック
- **フロントエンド**: Next.js 15.3.5 + React 19 + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes + Prisma ORM
- **データベース**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **DB管理**: pgAdmin 4
- **開発環境**: Docker + Docker Compose
- **API**: RESTful API (JSON) 