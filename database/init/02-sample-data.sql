-- ビール通帳アプリ サンプルデータ

-- 1. ビールカテゴリサンプルデータ（拡張）
INSERT INTO beer_category (id, category, icon, color) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'ラガー', '🍺', '#FFD700'),
    ('550e8400-e29b-41d4-a716-446655440002', 'エール', '🍻', '#FF8C00'),
    ('550e8400-e29b-41d4-a716-446655440003', 'IPA', '🍺', '#8B4513'),
    ('550e8400-e29b-41d4-a716-446655440004', 'スタウト', '🍺', '#2F1B14'),
    ('550e8400-e29b-41d4-a716-446655440005', 'ヴァイツェン', '🍺', '#F5DEB3'),
    ('550e8400-e29b-41d4-a716-446655440006', 'ピルスナー', '🍺', '#FFFF99');

-- 2. ビールサンプルデータ（拡張）
INSERT INTO beer (id, name, category_id, alcohol_content, brewery, country, description, image_url, untappd_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'アサヒスーパードライ', '550e8400-e29b-41d4-a716-446655440001', 5.0, 'アサヒビール', '日本', 'キレ味抜群のドライなビール', 'https://example.com/asahi.jpg', 'asahi_super_dry'),
    ('660e8400-e29b-41d4-a716-446655440002', 'キリン一番搾り', '550e8400-e29b-41d4-a716-446655440001', 5.0, 'キリンビール', '日本', '一番搾り麦汁のみを使用', 'https://example.com/kirin.jpg', 'kirin_ichiban'),
    ('660e8400-e29b-41d4-a716-446655440003', 'サッポロ黒ラベル', '550e8400-e29b-41d4-a716-446655440001', 5.0, 'サッポロビール', '日本', '完璧な生ビール', 'https://example.com/sapporo.jpg', 'sapporo_black'),
    ('660e8400-e29b-41d4-a716-446655440004', 'サントリー ザ・プレミアム・モルツ', '550e8400-e29b-41d4-a716-446655440001', 5.5, 'サントリー', '日本', 'プレミアムな味わい', 'https://example.com/premium.jpg', 'premium_malts'),
    ('660e8400-e29b-41d4-a716-446655440005', 'ヱビスビール', '550e8400-e29b-41d4-a716-446655440001', 5.0, 'サッポロビール', '日本', '恵比寿麦酒の伝統', 'https://example.com/yebisu.jpg', 'yebisu_beer'),
    ('660e8400-e29b-41d4-a716-446655440006', 'ハイネケン', '550e8400-e29b-41d4-a716-446655440006', 5.0, 'ハイネケン', 'オランダ', '世界で愛されるプレミアムビール', 'https://example.com/heineken.jpg', 'heineken'),
    ('660e8400-e29b-41d4-a716-446655440007', 'コロナエキストラ', '550e8400-e29b-41d4-a716-446655440001', 4.5, 'コロナ', 'メキシコ', 'ライムと一緒に', 'https://example.com/corona.jpg', 'corona_extra'),
    ('660e8400-e29b-41d4-a716-446655440008', 'ギネス', '550e8400-e29b-41d4-a716-446655440004', 4.2, 'ギネス', 'アイルランド', '黒ビールの代表格', 'https://example.com/guinness.jpg', 'guinness'),
    ('660e8400-e29b-41d4-a716-446655440009', 'ヒューガルデン', '550e8400-e29b-41d4-a716-446655440005', 4.9, 'ヒューガルデン', 'ベルギー', '白ビールの定番', 'https://example.com/hoegaarden.jpg', 'hoegaarden'),
    ('660e8400-e29b-41d4-a716-446655440010', 'よなよなエール', '550e8400-e29b-41d4-a716-446655440002', 5.5, 'ヤッホーブルーイング', '日本', '日本のクラフトビール', 'https://example.com/yonayona.jpg', 'yona_yona_ale');

-- 3. レストランカテゴリサンプルデータ（拡張）
INSERT INTO restaurant_category (id, category, icon, color) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '居酒屋', '🏮', '#FF6B6B'),
    ('770e8400-e29b-41d4-a716-446655440002', 'ビアホール', '🍺', '#4ECDC4'),
    ('770e8400-e29b-41d4-a716-446655440003', 'バー', '🍸', '#45B7D1'),
    ('770e8400-e29b-41d4-a716-446655440004', 'レストラン', '🍽️', '#96CEB4'),
    ('770e8400-e29b-41d4-a716-446655440005', 'カフェ', '☕', '#FFEAA7'),
    ('770e8400-e29b-41d4-a716-446655440006', 'クラフトビール専門店', '🍻', '#DDA0DD');

-- 4. レストランサンプルデータ（拡張）
INSERT INTO restaurant (id, name, category_id, address, latitude, longitude, phone, website, image_url) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '鳥貴族 渋谷店', '770e8400-e29b-41d4-a716-446655440001', '東京都渋谷区渋谷1-1-1', 35.6598, 139.7006, '03-1234-5678', 'https://torikizoku.co.jp', 'https://example.com/torikizoku.jpg'),
    ('880e8400-e29b-41d4-a716-446655440002', 'キリンシティ 新宿店', '770e8400-e29b-41d4-a716-446655440002', '東京都新宿区新宿3-1-1', 35.6896, 139.7006, '03-2345-6789', 'https://kirincity.co.jp', 'https://example.com/kirincity.jpg'),
    ('880e8400-e29b-41d4-a716-446655440003', 'HUB 六本木店', '770e8400-e29b-41d4-a716-446655440003', '東京都港区六本木6-1-1', 35.6627, 139.7314, '03-3456-7890', 'https://hub-pub.com', 'https://example.com/hub.jpg'),
    ('880e8400-e29b-41d4-a716-446655440004', 'ビアガーデン 屋上', '770e8400-e29b-41d4-a716-446655440002', '東京都中央区銀座4-1-1', 35.6762, 139.7653, '03-4567-8901', 'https://biergarten.co.jp', 'https://example.com/biergarten.jpg'),
    ('880e8400-e29b-41d4-a716-446655440005', 'クラフトビール タップ', '770e8400-e29b-41d4-a716-446655440006', '東京都世田谷区三軒茶屋2-1-1', 35.6439, 139.6689, '03-5678-9012', 'https://crafttap.co.jp', 'https://example.com/crafttap.jpg'),
    ('880e8400-e29b-41d4-a716-446655440006', 'ワタミ 池袋店', '770e8400-e29b-41d4-a716-446655440001', '東京都豊島区池袋2-1-1', 35.7295, 139.7109, '03-6789-0123', 'https://watami.co.jp', 'https://example.com/watami.jpg'),
    ('880e8400-e29b-41d4-a716-446655440007', 'サッポロビール園', '770e8400-e29b-41d4-a716-446655440002', '北海道札幌市中央区北7条東9-2-10', 43.0642, 141.3469, '011-7890-1234', 'https://sapporobeer.jp', 'https://example.com/sapporobeer.jpg'),
    ('880e8400-e29b-41d4-a716-446655440008', 'オクトーバーフェスト会場', '770e8400-e29b-41d4-a716-446655440002', '東京都港区お台場1-1-1', 35.6267, 139.7750, '03-8901-2345', 'https://oktoberfest.jp', 'https://example.com/oktoberfest.jpg');

-- 5. ユーザーサンプルデータ（拡張）
INSERT INTO users (id, email, name, avatar_url, total_volume, favorite_beer_id) VALUES
    ('990e8400-e29b-41d4-a716-446655440001', 'test@example.com', 'テストユーザー', 'https://example.com/avatar1.jpg', 2450, '660e8400-e29b-41d4-a716-446655440001'),
    ('990e8400-e29b-41d4-a716-446655440002', 'beer.lover@example.com', 'ビール愛好家', 'https://example.com/avatar2.jpg', 5280, '660e8400-e29b-41d4-a716-446655440010'),
    ('990e8400-e29b-41d4-a716-446655440003', 'craft.master@example.com', 'クラフトマスター', 'https://example.com/avatar3.jpg', 3750, '660e8400-e29b-41d4-a716-446655440009');

-- 6. 飲酒記録サンプルデータ（拡張）
INSERT INTO drinking (id, user_id, beer_id, restaurant_id, amount, price, time, text, rating, share, image_url, location_lat, location_lng, weather) VALUES
    ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 350, 450.00, '2024-01-15 19:30:00+09', '仕事帰りに一杯！', 4, true, 'https://example.com/drink1.jpg', 35.6598, 139.7006, '晴れ'),
    ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 500, 600.00, '2024-01-20 18:00:00+09', '友達と乾杯', 5, true, 'https://example.com/drink2.jpg', 35.6896, 139.7006, '曇り'),
    ('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440003', 330, 800.00, '2024-01-25 20:15:00+09', '黒ビール最高！', 5, false, 'https://example.com/drink3.jpg', 35.6627, 139.7314, '雨'),
    ('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440010', '880e8400-e29b-41d4-a716-446655440005', 350, 750.00, '2024-02-01 19:45:00+09', 'クラフトビール初体験', 4, true, 'https://example.com/drink4.jpg', 35.6439, 139.6689, '晴れ'),
    ('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440009', '880e8400-e29b-41d4-a716-446655440004', 500, 900.00, '2024-02-05 17:30:00+09', 'ビアガーデンで白ビール', 5, true, 'https://example.com/drink5.jpg', 35.6762, 139.7653, '晴れ'),
    ('aa0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440008', 330, 650.00, '2024-02-10 16:00:00+09', 'オクトーバーフェストで', 4, true, 'https://example.com/drink6.jpg', 35.6267, 139.7750, '晴れ');

-- 7. 新着情報サンプルデータ
INSERT INTO news (id, title, content, category, image_url, published_at, expires_at, priority) VALUES
    ('bb0e8400-e29b-41d4-a716-446655440001', '新商品「プレミアムIPA」登場！', '待望の新商品「プレミアムIPA」が各店舗で販売開始されました。ホップの香りが豊かで、苦味と甘味のバランスが絶妙です。', 'new_product', 'https://example.com/news1.jpg', '2024-07-01 10:00:00+09', '2024-07-31 23:59:59+09', 1),
    ('bb0e8400-e29b-41d4-a716-446655440002', 'ハッピーアワー開始！', '平日17:00-19:00の間、全ビールが20%オフ！この機会をお見逃しなく。', 'campaign', 'https://example.com/news2.jpg', '2024-07-05 09:00:00+09', '2024-07-30 23:59:59+09', 2),
    ('bb0e8400-e29b-41d4-a716-446655440003', '夏季限定ビアガーデンオープン', '屋上ビアガーデンが今年もオープン！夏の夜空の下で最高のビールを楽しもう。', 'event', 'https://example.com/news3.jpg', '2024-06-15 12:00:00+09', '2024-08-31 23:59:59+09', 1),
    ('bb0e8400-e29b-41d4-a716-446655440004', 'クラフトビール試飲会開催', '7月20日（土）14:00より、クラフトビール試飲会を開催します。参加費無料！', 'event', 'https://example.com/news4.jpg', '2024-07-10 15:00:00+09', '2024-07-20 23:59:59+09', 3),
    ('bb0e8400-e29b-41d4-a716-446655440005', 'アプリ新機能追加のお知らせ', 'ミッション機能とSNSシェア機能を追加しました。より楽しくビールライフを記録できます！', 'update', 'https://example.com/news5.jpg', '2024-07-12 11:00:00+09', NULL, 2);

-- 8. ミッションサンプルデータ
INSERT INTO missions (id, title, description, mission_type, target_value, reward_points, reward_badge, start_date, end_date, is_active) VALUES
    ('cc0e8400-e29b-41d4-a716-446655440001', '月間50杯チャレンジ', '今月中に50杯のビールを飲んでミッションクリア！', 'volume', 50, 500, 'volume_master', '2024-07-01 00:00:00+09', '2024-07-31 23:59:59+09', true),
    ('cc0e8400-e29b-41d4-a716-446655440002', 'ビール図鑑コンプリート', '10種類の異なるビールを飲んでビール図鑑を完成させよう', 'variety', 10, 300, 'beer_explorer', '2024-07-01 00:00:00+09', '2024-07-31 23:59:59+09', true),
    ('cc0e8400-e29b-41d4-a716-446655440003', '7日連続記録', '7日間連続でビールを記録してストリークを達成しよう', 'streak', 7, 200, 'streak_keeper', '2024-07-01 00:00:00+09', '2024-07-31 23:59:59+09', true),
    ('cc0e8400-e29b-41d4-a716-446655440004', 'SNSシェア王', '10回SNSにシェアしてみんなと楽しさを共有しよう', 'social', 10, 250, 'social_king', '2024-07-01 00:00:00+09', '2024-07-31 23:59:59+09', true),
    ('cc0e8400-e29b-41d4-a716-446655440005', 'クラフトビール愛好家', 'クラフトビールを5種類飲んでクラフトマスターになろう', 'variety', 5, 400, 'craft_master', '2024-07-01 00:00:00+09', '2024-08-31 23:59:59+09', true),
    ('cc0e8400-e29b-41d4-a716-446655440006', '夏の大容量チャレンジ', '夏の間に100杯のビールを飲んで夏マスターに！', 'volume', 100, 1000, 'summer_master', '2024-06-01 00:00:00+09', '2024-08-31 23:59:59+09', true);

-- 9. ユーザーミッション進捗サンプルデータ
INSERT INTO user_missions (id, user_id, mission_id, progress, completed_at) VALUES
    ('dd0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', 40, NULL),
    ('dd0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440002', 8, NULL),
    ('dd0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440003', 7, '2024-07-10 23:59:59+09'),
    ('dd0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440004', 5, NULL),
    ('dd0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440005', 3, NULL),
    ('dd0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440006', 75, NULL);

-- 10. SNS連携サンプルデータ
INSERT INTO sns_connections (id, user_id, platform, platform_user_id, access_token, refresh_token, expires_at, is_active) VALUES
    ('ee0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'untappd', 'user123', 'dummy_access_token_1', 'dummy_refresh_token_1', '2024-12-31 23:59:59+09', true),
    ('ee0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'instagram', 'beer_lover_ig', 'dummy_access_token_2', 'dummy_refresh_token_2', '2024-12-31 23:59:59+09', true),
    ('ee0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'twitter', 'craft_master_tw', 'dummy_access_token_3', 'dummy_refresh_token_3', '2024-12-31 23:59:59+09', true),
    ('ee0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440001', 'instagram', 'test_user_ig', 'dummy_access_token_4', 'dummy_refresh_token_4', '2024-12-31 23:59:59+09', false);

-- 11. 印刷ジョブサンプルデータ
INSERT INTO print_jobs (id, user_id, job_type, data, status, printer_id, processed_at) VALUES
    ('ff0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'receipt', '{"drinking_id": "aa0e8400-e29b-41d4-a716-446655440001", "beer_name": "アサヒスーパードライ", "amount": 350, "price": 450, "restaurant": "鳥貴族 渋谷店", "time": "2024-01-15 19:30:00"}', 'completed', 'printer_001', '2024-01-15 19:35:00+09'),
    ('ff0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'summary', '{"month": "2024-01", "total_volume": 1980, "total_price": 8500, "beer_count": 6, "favorite_beer": "ギネス"}', 'completed', 'printer_002', '2024-02-01 10:00:00+09'),
    ('ff0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440001', 'certificate', '{"mission_id": "cc0e8400-e29b-41d4-a716-446655440003", "mission_title": "7日連続記録", "completed_at": "2024-07-10 23:59:59", "badge": "streak_keeper"}', 'pending', 'printer_001', NULL),
    ('ff0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'summary', '{"month": "2024-06", "total_volume": 2250, "total_price": 12000, "beer_count": 5, "favorite_beer": "ヒューガルデン"}', 'processing', 'printer_003', NULL);

-- 12. 統計用のビューを作成
CREATE VIEW user_monthly_stats AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    DATE_TRUNC('month', d.time) as month,
    COUNT(*) as drink_count,
    SUM(d.amount) as total_volume,
    SUM(d.price) as total_price,
    AVG(d.rating) as avg_rating,
    COUNT(DISTINCT d.beer_id) as unique_beers,
    COUNT(DISTINCT d.restaurant_id) as unique_restaurants
FROM users u
LEFT JOIN drinking d ON u.id = d.user_id
GROUP BY u.id, u.name, DATE_TRUNC('month', d.time)
ORDER BY month DESC, user_name;

-- 13. ミッション進捗更新用の関数を作成
CREATE OR REPLACE FUNCTION update_mission_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- 容量チャレンジのミッション進捗を更新
    UPDATE user_missions 
    SET progress = (
        SELECT COUNT(*)
        FROM drinking d
        WHERE d.user_id = NEW.user_id
        AND d.time >= m.start_date
        AND d.time <= m.end_date
    )
    FROM missions m
    WHERE user_missions.mission_id = m.id
    AND user_missions.user_id = NEW.user_id
    AND m.mission_type = 'volume'
    AND m.is_active = true;
    
    -- バラエティチャレンジのミッション進捗を更新
    UPDATE user_missions 
    SET progress = (
        SELECT COUNT(DISTINCT d.beer_id)
        FROM drinking d
        WHERE d.user_id = NEW.user_id
        AND d.time >= m.start_date
        AND d.time <= m.end_date
    )
    FROM missions m
    WHERE user_missions.mission_id = m.id
    AND user_missions.user_id = NEW.user_id
    AND m.mission_type = 'variety'
    AND m.is_active = true;
    
    -- ユーザーの総容量を更新
    UPDATE users 
    SET total_volume = (
        SELECT COALESCE(SUM(amount), 0)
        FROM drinking 
        WHERE user_id = NEW.user_id
    )
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. トリガーを作成
CREATE TRIGGER update_mission_progress_trigger
    AFTER INSERT OR UPDATE ON drinking
    FOR EACH ROW
    EXECUTE FUNCTION update_mission_progress();

-- 15. 初期データの整合性チェック
DO $$
BEGIN
    -- ユーザーの総容量を計算して更新
    UPDATE users 
    SET total_volume = (
        SELECT COALESCE(SUM(amount), 0)
        FROM drinking 
        WHERE user_id = users.id
    );
    
    RAISE NOTICE 'サンプルデータの挿入が完了しました。';
    RAISE NOTICE 'ユーザー数: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE 'ビール数: %', (SELECT COUNT(*) FROM beer);
    RAISE NOTICE 'レストラン数: %', (SELECT COUNT(*) FROM restaurant);
    RAISE NOTICE '飲酒記録数: %', (SELECT COUNT(*) FROM drinking);
    RAISE NOTICE '新着情報数: %', (SELECT COUNT(*) FROM news);
    RAISE NOTICE 'ミッション数: %', (SELECT COUNT(*) FROM missions);
END $$; 