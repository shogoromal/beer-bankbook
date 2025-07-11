-- データベース初期化スクリプト

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ビールカテゴリテーブル
CREATE TABLE IF NOT EXISTS beer_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ビールブランドテーブル
CREATE TABLE IF NOT EXISTS beer_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES beer_categories(id),
    country VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ビール購入記録テーブル
CREATE TABLE IF NOT EXISTS beer_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES beer_brands(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL,
    store_name VARCHAR(200),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 予算テーブル
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month_year DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month_year)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_beer_purchases_user_date ON beer_purchases(user_id, purchase_date);
CREATE INDEX IF NOT EXISTS idx_beer_purchases_date ON beer_purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_beer_brands_category ON beer_brands(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month_year);

-- サンプルデータ挿入
INSERT INTO beer_categories (name, description) VALUES
('ラガー', '淡色で爽やかな味わいのビール'),
('エール', '濃厚でフルーティな味わいのビール'),
('スタウト', '黒色でコーヒーやチョコレートの風味'),
('IPA', 'ホップの苦味と香りが特徴'),
('小麦ビール', '小麦を使用した軽やかなビール')
ON CONFLICT DO NOTHING;

INSERT INTO beer_brands (name, category_id, country, description) VALUES
('アサヒスーパードライ', (SELECT id FROM beer_categories WHERE name = 'ラガー'), '日本', '日本の代表的なラガービール'),
('キリン一番搾り', (SELECT id FROM beer_categories WHERE name = 'ラガー'), '日本', '一番搾り麦芽100%使用'),
('サッポロ黒ラベル', (SELECT id FROM beer_categories WHERE name = 'ラガー'), '日本', '北海道の水を使用'),
('ギネス', (SELECT id FROM beer_categories WHERE name = 'スタウト'), 'アイルランド', '世界で最も有名なスタウト'),
('ホワイトエール', (SELECT id FROM beer_categories WHERE name = '小麦ビール'), 'ベルギー', 'オレンジピールとコリアンダー使用')
ON CONFLICT DO NOTHING; 