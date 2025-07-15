-- ビール通帳アプリ データベーススキーマ初期化

-- 1. ユーザーテーブル（拡張）
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    total_volume INTEGER DEFAULT 0,
    favorite_beer_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ビールカテゴリテーブル（拡張）
CREATE TABLE beer_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(7)
);

-- 3. ビールテーブル（拡張）
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

-- 4. レストランカテゴリテーブル（拡張）
CREATE TABLE restaurant_category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    color VARCHAR(7)
);

-- 5. レストランテーブル（拡張）
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

-- 6. 飲酒記録テーブル（拡張）
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

-- 7. 新着情報テーブル
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

-- 8. ミッションテーブル
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

-- 9. ユーザーミッション進捗テーブル
CREATE TABLE user_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mission_id)
);

-- 10. SNS連携テーブル
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

-- 11. 印刷ジョブテーブル
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

-- 外部キー制約を追加
ALTER TABLE users ADD CONSTRAINT fk_users_favorite_beer 
    FOREIGN KEY (favorite_beer_id) REFERENCES beer(id);

-- インデックス作成
CREATE INDEX idx_drinking_user_time ON drinking(user_id, time);
CREATE INDEX idx_drinking_time ON drinking(time);
CREATE INDEX idx_beer_category ON beer(category_id);
CREATE INDEX idx_restaurant_category ON restaurant(category_id);
CREATE INDEX idx_news_published ON news(published_at, expires_at);
CREATE INDEX idx_missions_active ON missions(is_active, start_date, end_date);
CREATE INDEX idx_user_missions_progress ON user_missions(user_id, completed_at);
CREATE INDEX idx_sns_connections_user ON sns_connections(user_id, platform, is_active);
CREATE INDEX idx_print_jobs_status ON print_jobs(status, created_at);

-- 権限設定
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO beer_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO beer_user; 