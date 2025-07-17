-- レストランビールの詳細サンプルデータ
-- このファイルは開発・テスト環境用のサンプルデータを提供します

-- レストランビールの追加
INSERT INTO beer (
  name, 
  beer_type, 
  category_id, 
  alcohol_content, 
  brewery, 
  restaurant_id, 
  price, 
  country, 
  description, 
  image_url, 
  untappd_id
) VALUES 
-- クラフトビールタップ - オリジナルIPA
(
  'タップハウスIPA',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = 'IPA' LIMIT 1),
  6.5,
  NULL,
  (SELECT id FROM restaurant WHERE name = 'クラフトビールタップ' LIMIT 1),
  850.00,
  'Japan',
  'クラフトビールタップの看板メニュー。ホップの苦味と柑橘系の香りが絶妙にバランスした自家醸造IPA。毎日少量生産で新鮮さが自慢。',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
  'taphouse_ipa_2024'
),
-- アサヒビール園 - 限定ラガー
(
  'ビール園限定プレミアムラガー',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1),
  5.2,
  NULL,
  (SELECT id FROM restaurant WHERE name = 'アサヒビール園' LIMIT 1),
  720.00,
  'Japan',
  'アサヒビール園でのみ味わえる特別なラガー。厳選された麦芽とホップを使用し、すっきりとした喉越しと深いコクを実現。ジンギスカンとの相性抜群。',
  'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400',
  'asahi_garden_premium'
),
-- HUB - オリジナルエール
(
  'HUBオリジナルブリティッシュエール',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = 'エール' LIMIT 1),
  4.8,
  NULL,
  (SELECT id FROM restaurant WHERE name = 'HUB' LIMIT 1),
  680.00,
  'Japan',
  '英国パブHUBが誇るオリジナルエール。伝統的な英国スタイルを日本人の味覚に合わせてアレンジ。フルーティーな香りとマイルドな苦味が特徴。',
  'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
  'hub_british_ale_original'
),
-- ビアガーデン東京 - 季節限定小麦ビール
(
  '東京ビアガーデン夏季限定ヴァイツェン',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = '小麦ビール' LIMIT 1),
  5.0,
  NULL,
  (SELECT id FROM restaurant WHERE name = 'ビアガーデン東京' LIMIT 1),
  750.00,
  'Japan',
  '夏季限定の特別な小麦ビール。小麦由来のまろやかな口当たりと、レモンピールを加えた爽やかな風味。暑い夏の夜に最適な一杯。',
  'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'tokyo_garden_weizen_summer'
),
-- 銀座ライオン - プレミアムスタウト
(
  '銀座ライオン特製ドライスタウト',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = 'スタウト' LIMIT 1),
  4.6,
  NULL,
  (SELECT id FROM restaurant WHERE name = '銀座ライオン' LIMIT 1),
  800.00,
  'Japan',
  '銀座ライオンの伝統を受け継ぐプレミアムスタウト。ローストした大麦の香ばしい風味とクリーミーな泡立ち。ビール通も唸る本格的な味わい。',
  'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
  'ginza_lion_dry_stout'
),
-- クラフトビールタップ - セゾン
(
  'タップハウスファームハウスセゾン',
  'restaurant',
  (SELECT id FROM beer_category WHERE category = 'クラフトビール' LIMIT 1),
  5.8,
  NULL,
  (SELECT id FROM restaurant WHERE name = 'クラフトビールタップ' LIMIT 1),
  920.00,
  'Japan',
  'ベルギー伝統のセゾンスタイル。野生酵母を使用した複雑な味わいと、スパイシーで華やかな香り。クラフトビール愛好家に絶大な人気。',
  'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400',
  'taphouse_farmhouse_saison'
)
ON CONFLICT (name) DO NOTHING;

-- データ追加結果の確認
DO $$
DECLARE
    commercial_count INTEGER;
    restaurant_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO commercial_count FROM beer WHERE beer_type = 'commercial';
    SELECT COUNT(*) INTO restaurant_count FROM beer WHERE beer_type = 'restaurant';
    
    RAISE NOTICE '=== ビールデータ統計 ===';
    RAISE NOTICE '市販ビール: %件', commercial_count;
    RAISE NOTICE 'レストランビール: %件', restaurant_count;
    RAISE NOTICE '総計: %件', commercial_count + restaurant_count;
END $$;