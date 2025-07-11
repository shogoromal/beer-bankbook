-- ビール家計簿データベース初期化スクリプト

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ビールカテゴリテーブル
CREATE TABLE IF NOT EXISTS beer_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL
);

-- ビールテーブル
CREATE TABLE IF NOT EXISTS beer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES beer_category(id)
);

-- レストランカテゴリテーブル
CREATE TABLE IF NOT EXISTS restaurant_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL
);

-- レストランテーブル
CREATE TABLE IF NOT EXISTS restaurant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    category_id UUID REFERENCES restaurant_category(id)
);

-- 飲酒記録テーブル
CREATE TABLE IF NOT EXISTS drinking (
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

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_drinking_user_time ON drinking(user_id, time);
CREATE INDEX IF NOT EXISTS idx_drinking_time ON drinking(time);
CREATE INDEX IF NOT EXISTS idx_beer_category ON beer(category_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_category ON restaurant(category_id); 