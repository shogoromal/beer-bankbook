# ビール通帳アプリ 設計書

## 1. プロジェクト概要

### 1.1 アプリケーション名
**ビール通帳 (Beer Bankbook)**

### 1.2 目的
ユーザーがお店で飲んだビールを記録し、モバイルバンキングアプリのような直感的なUIで飲酒実績を管理できるWebアプリケーション

### 1.3 必須要件
- **TOPページ**: モバイルバンキングアプリのようなUI
  - 預金残高のように合計飲酒容量など飲んだ実績が確認できる
- **飲酒ログ入力**: 手動または容易に飲酒した情報を記録
- **履歴・統計**: 日付・銘柄・容量・場所・コメント等で振り返り
- **プリンタ連携**: スタッフが操作する印字ソフト機能

### 1.4 アイデア機能
- **新着情報**: イベント情報、新商品情報等を見せる掲示板機能
- **ミッション**: 記録を盛り上げる要素として、ミッションを設定
- **SNSシェア**: Untappd / Instagram / X 等のSNSに投稿を連携

## 2. 技術スタック

### 2.1 フロントエンド
- **フレームワーク**: Next.js 15.3.5 (React 19)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **状態管理**: React Hooks + Context API
- **UIライブラリ**: Framer Motion (アニメーション)
- **PWA**: Service Worker対応
- **プリント**: React-to-print / jsPDF

### 2.2 バックエンド
- **フレームワーク**: Next.js API Routes
- **言語**: TypeScript
- **ORM**: Prisma
- **認証**: NextAuth.js
- **ファイルアップロード**: Cloudinary / AWS S3
- **プッシュ通知**: Web Push API

### 2.3 データベース
- **RDBMS**: PostgreSQL 16
- **接続プール**: PgBouncer（本番環境）
- **キャッシュ**: Redis（統計データ）

### 2.4 外部API連携
- **SNS連携**: 
  - Untappd API
  - Instagram Basic Display API
  - X (Twitter) API v2
- **地図・位置情報**: Google Maps API
- **QRコード**: QR Code Generator

### 2.5 インフラ・開発環境
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

### 3.2 テーブル設計（拡張版）

| テーブル名 | 役割 |
| --- | --- |
| users | ユーザー情報 |
| beer_category | ビールカテゴリマスタ |
| beer | ビールマスタ |
| restaurant_category | レストランカテゴリマスタ |
| restaurant | レストランマスタ |
| drinking | 飲酒記録 |
| news | 新着情報 |
| missions | ミッション |
| user_missions | ユーザーミッション進捗 |
| sns_connections | SNS連携情報 |
| print_jobs | 印刷ジョブ |

#### 3.2.1 users テーブル（拡張）
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    total_volume INTEGER DEFAULT 0,
    favorite_beer_id UUID REFERENCES beer(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.2 beer_category テーブル
```sql
CREATE TABLE beer_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(7)
);
```

#### 3.2.3 beer テーブル（拡張）
```sql
CREATE TABLE beer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES beer_category(id),
    alcohol_content DECIMAL(3,1),
    brewery VARCHAR(100),
    country VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    untappd_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.4 restaurant_category テーブル
```sql
CREATE TABLE restaurant_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(7)
);
```

#### 3.2.5 restaurant テーブル（拡張）
```sql
CREATE TABLE restaurant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES restaurant_category(id),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20),
    website VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.6 drinking テーブル（拡張）
```sql
CREATE TABLE drinking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    beer_id UUID REFERENCES beer(id),
    restaurant_id UUID REFERENCES restaurant(id),
    amount INTEGER NOT NULL,
    price DECIMAL(10,2),
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    share BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(500),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    weather VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.7 news テーブル
```sql
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.8 missions テーブル
```sql
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    mission_type VARCHAR(50) NOT NULL, -- 'volume', 'variety', 'streak', 'social'
    target_value INTEGER NOT NULL,
    reward_points INTEGER DEFAULT 0,
    reward_badge VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.9 user_missions テーブル
```sql
CREATE TABLE user_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mission_id)
);
```

#### 3.2.10 sns_connections テーブル
```sql
CREATE TABLE sns_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'untappd', 'instagram', 'twitter'
    platform_user_id VARCHAR(100) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, platform)
);
```

#### 3.2.11 print_jobs テーブル
```sql
CREATE TABLE print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    job_type VARCHAR(50) NOT NULL, -- 'receipt', 'summary', 'certificate'
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    printer_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);
```

### 3.3 インデックス設計（拡張）
```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_drinking_user_time ON drinking(user_id, time);
CREATE INDEX idx_drinking_time ON drinking(time);
CREATE INDEX idx_beer_category ON beer(category_id);
CREATE INDEX idx_restaurant_category ON restaurant(category_id);
CREATE INDEX idx_news_published ON news(published_at, expires_at);
CREATE INDEX idx_missions_active ON missions(is_active, start_date, end_date);
CREATE INDEX idx_user_missions_progress ON user_missions(user_id, completed_at);
CREATE INDEX idx_sns_connections_user ON sns_connections(user_id, platform, is_active);
CREATE INDEX idx_print_jobs_status ON print_jobs(status, created_at);
```

## 4. UI/UX設計

### 4.1 モバイルバンキングアプリ風デザイン

#### 4.1.1 TOPページ構成
```
┌─────────────────────────────────┐
│ 🍺 ビール通帳              👤 │
├─────────────────────────────────┤
│ 📊 今月の飲酒実績              │
│ ┌─────────────────────────────┐ │
│ │ 🍺 合計容量: 2,450ml      │ │
│ │ 💰 合計金額: ¥12,500      │ │
│ │ 📈 前月比: +15%           │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 🎯 進行中のミッション            │
│ ┌─────────────────────────────┐ │
│ │ 月間50杯チャレンジ          │ │
│ │ ████████░░ 80% (40/50)    │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 🔥 クイックアクション            │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│ │🍺 │ │📊 │ │👥 │ │🖨️ │ │
│ │記録│ │統計│ │友達│ │印刷│ │
│ └───┘ └───┘ └───┘ └───┘ │
├─────────────────────────────────┤
│ 📰 新着情報                    │
│ • 新商品「プレミアムIPA」登場   │
│ • ハッピーアワー開始！         │
└─────────────────────────────────┘
```

#### 4.1.2 カラーパレット
```css
:root {
  /* メインカラー */
  --primary-gold: #FFD700;
  --primary-amber: #FF8C00;
  --primary-brown: #8B4513;
  
  /* バンキングアプリ風 */
  --banking-blue: #1E3A8A;
  --banking-green: #059669;
  --banking-gray: #6B7280;
  
  /* アクセント */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  
  /* ニュートラル */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-900: #111827;
}
```

### 4.2 レスポンシブデザイン
- **モバイルファースト**: 320px～
- **タブレット**: 768px～
- **デスクトップ**: 1024px～
- **PWA対応**: アプリライクな体験

## 5. 機能仕様

### 5.1 必須機能

#### 5.1.1 TOPページ（ダッシュボード）
- **飲酒実績サマリー**
  - 今月の合計容量・金額
  - 前月比較
  - 週間/月間グラフ
- **クイックアクション**
  - 飲酒記録ボタン
  - 統計表示ボタン
  - 友達検索ボタン
  - 印刷ボタン
- **ミッション進捗**
  - 進行中のミッション表示
  - 達成率プログレスバー
- **新着情報**
  - イベント・新商品情報
  - お知らせ

#### 5.1.2 飲酒ログ入力
- **基本情報入力**
  - ビール選択（検索・お気に入り）
  - 容量入力（ml）
  - 価格入力（円）
  - 日時選択
- **詳細情報**
  - レストラン選択
  - 評価（5段階）
  - コメント
  - 写真添付
- **位置情報**
  - GPS自動取得
  - 手動選択
- **クイック入力**
  - よく飲むビールのショートカット
  - 前回と同じ設定で入力

#### 5.1.3 履歴・統計
- **履歴表示**
  - 時系列表示
  - フィルタリング（日付・銘柄・場所）
  - 検索機能
- **統計分析**
  - 月間/年間サマリー
  - ビール種類別分析
  - 曜日別・時間別分析
  - 支出トレンド
- **エクスポート**
  - CSV出力
  - PDF レポート

#### 5.1.4 プリンタ連携
- **印刷機能**
  - 飲酒記録レシート
  - 月間サマリー
  - 達成証明書
- **スタッフ操作画面**
  - 印刷ジョブ管理
  - プリンタ設定
  - 印刷履歴

### 5.2 アイデア機能

#### 5.2.1 新着情報
- **掲示板機能**
  - イベント情報投稿
  - 新商品情報
  - セール・キャンペーン
- **管理機能**
  - 投稿管理
  - カテゴリ分類
  - 公開期間設定

#### 5.2.2 ミッション
- **ミッション種類**
  - 容量チャレンジ（月間○○ml）
  - バラエティチャレンジ（○種類制覇）
  - 連続記録チャレンジ
  - ソーシャルチャレンジ（SNSシェア）
- **報酬システム**
  - ポイント獲得
  - バッジ取得
  - 称号システム

#### 5.2.3 SNSシェア
- **連携プラットフォーム**
  - Untappd: チェックイン連携
  - Instagram: 写真投稿
  - X (Twitter): 飲酒記録ツイート
- **自動投稿**
  - 記録時の自動シェア
  - 達成時の自動投稿
- **データ取得**
  - SNSからの飲酒記録インポート

### 5.3 追加アイデア

#### 5.3.1 ソーシャル機能
- **友達機能**
  - ユーザー検索
  - フォロー/フォロワー
  - 飲酒記録の共有
- **ランキング**
  - 月間飲酒量ランキング
  - 多様性ランキング
  - チェックイン回数ランキング

#### 5.3.2 AI機能
- **レコメンド**
  - 好みに基づくビール推薦
  - 新しい店舗の提案
  - 最適な飲酒タイミング
- **分析**
  - 飲酒パターン分析
  - 健康アドバイス
  - 予算管理提案

#### 5.3.3 ゲーミフィケーション
- **レベルシステム**
  - 経験値とレベル
  - スキルツリー
- **コレクション**
  - ビール図鑑
  - 店舗コレクション
  - 地域制覇

## 6. API設計

### 6.1 認証・ユーザー管理
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/profile
```

### 6.2 飲酒記録
```
GET    /api/drinking                 # 飲酒記録一覧
POST   /api/drinking                 # 飲酒記録作成
GET    /api/drinking/:id             # 飲酒記録詳細
PUT    /api/drinking/:id             # 飲酒記録更新
DELETE /api/drinking/:id             # 飲酒記録削除
GET    /api/drinking/stats           # 統計データ
```

### 6.3 マスタデータ
```
GET    /api/beers                    # ビール一覧
GET    /api/beers/search             # ビール検索
GET    /api/restaurants              # レストラン一覧
GET    /api/restaurants/search       # レストラン検索
```

### 6.4 新着情報
```
GET    /api/news                     # 新着情報一覧
GET    /api/news/:id                 # 新着情報詳細
POST   /api/news                     # 新着情報作成（管理者）
```

### 6.5 ミッション
```
GET    /api/missions                 # ミッション一覧
GET    /api/missions/user            # ユーザーミッション進捗
POST   /api/missions/complete        # ミッション完了
```

### 6.6 SNS連携
```
POST   /api/sns/connect              # SNS連携
POST   /api/sns/disconnect           # SNS連携解除
POST   /api/sns/share                # SNS投稿
GET    /api/sns/import               # SNSデータインポート
```

### 6.7 印刷
```
POST   /api/print/receipt            # レシート印刷
POST   /api/print/summary            # サマリー印刷
GET    /api/print/jobs               # 印刷ジョブ一覧
```

## 7. ページ構成

### 7.1 ユーザー向けページ
```
/                                   # TOPページ（ダッシュボード）
/login                              # ログイン
/register                           # 新規登録
/profile                            # プロフィール
/drinking/new                       # 飲酒記録入力
/drinking/edit/:id                  # 飲酒記録編集
/drinking/history                   # 飲酒履歴
/drinking/stats                     # 統計・分析
/missions                           # ミッション
/news                               # 新着情報
/friends                            # 友達
/settings                           # 設定
/print                              # 印刷
```

### 7.2 管理者向けページ
```
/admin                              # 管理者ダッシュボード
/admin/users                        # ユーザー管理
/admin/news                         # 新着情報管理
/admin/missions                     # ミッション管理
/admin/beers                        # ビール管理
/admin/restaurants                  # レストラン管理
/admin/print                        # 印刷管理
```

## 8. セキュリティ設計

### 8.1 認証・認可
- NextAuth.jsを使用したセッション管理
- JWTトークンの使用
- パスワードハッシュ化（bcrypt）

### 8.2 データベースセキュリティ
- 接続文字列の環境変数管理
- 最小権限の原則に基づくユーザー権限設定
- SQLインジェクション対策（Prisma ORM使用）

### 8.3 アプリケーションセキュリティ
- CSRF対策
- XSS対策
- 入力値検証
- レート制限

## 9. パフォーマンス設計

### 9.1 データベース最適化
- 適切なインデックス設定
- クエリ最適化
- 接続プール（PgBouncer）

### 9.2 フロントエンド最適化
- Next.jsのSSR/SSG活用
- 画像最適化
- コード分割
- キャッシュ戦略

## 10. 開発・デプロイメント

### 10.1 開発環境セットアップ
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

### 10.2 本番環境デプロイ
```bash
# 本番環境用Docker Compose起動
docker-compose -f docker-compose.prod.yml up -d

# データベースマイグレーション
docker-compose -f docker-compose.prod.yml exec frontend npx prisma migrate deploy
```

## 11. 監視・ログ

### 11.1 ログ管理
- アプリケーションログ
- データベースログ
- アクセスログ

### 11.2 監視項目
- アプリケーションの応答時間
- データベース接続数
- エラー率
- リソース使用率

## 12. 今後の拡張予定

### 12.1 機能拡張
- モバイルアプリ対応
- ソーシャル機能（友達との共有）
- ビール評価・レビュー機能
- おすすめビール機能

### 12.2 技術拡張
- GraphQL API
- リアルタイム通知
- 機械学習による支出予測
- 多言語対応

---

この設計書に基づいて、段階的にアプリケーションを開発していきます。まずは基本的なCRUD機能から始めて、徐々に機能を追加していく予定です。 