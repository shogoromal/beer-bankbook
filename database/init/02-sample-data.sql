-- サンプルデータ挿入スクリプト

-- ビールカテゴリのサンプルデータ
INSERT INTO beer_category (category) VALUES
('ラガー'),
('エール'),
('スタウト'),
('IPA'),
('小麦ビール'),
('ピルスナー'),
('クラフトビール')
ON CONFLICT DO NOTHING;

-- ビールのサンプルデータ
INSERT INTO beer (name, category_id) VALUES
('アサヒスーパードライ', (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1)),
('キリン一番搾り', (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1)),
('サッポロ黒ラベル', (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1)),
('サントリープレミアムモルツ', (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1)),
('ギネス', (SELECT id FROM beer_category WHERE category = 'スタウト' LIMIT 1)),
('よなよなエール', (SELECT id FROM beer_category WHERE category = 'エール' LIMIT 1)),
('インドの青鬼', (SELECT id FROM beer_category WHERE category = 'IPA' LIMIT 1)),
('ヒューガルデン', (SELECT id FROM beer_category WHERE category = '小麦ビール' LIMIT 1)),
('ステラ・アルトワ', (SELECT id FROM beer_category WHERE category = 'ピルスナー' LIMIT 1)),
('コロナエキストラ', (SELECT id FROM beer_category WHERE category = 'ラガー' LIMIT 1))
ON CONFLICT DO NOTHING;

-- レストランカテゴリのサンプルデータ
INSERT INTO restaurant_category (category) VALUES
('居酒屋'),
('ビアガーデン'),
('バー'),
('レストラン'),
('パブ'),
('ビアホール'),
('カフェ'),
('ファミリーレストラン')
ON CONFLICT DO NOTHING;

-- レストランのサンプルデータ
INSERT INTO restaurant (name, category_id) VALUES
('鳥貴族', (SELECT id FROM restaurant_category WHERE category = '居酒屋' LIMIT 1)),
('とりあえず吾平', (SELECT id FROM restaurant_category WHERE category = '居酒屋' LIMIT 1)),
('ビアガーデン東京', (SELECT id FROM restaurant_category WHERE category = 'ビアガーデン' LIMIT 1)),
('アサヒビール園', (SELECT id FROM restaurant_category WHERE category = 'ビアホール' LIMIT 1)),
('HUB', (SELECT id FROM restaurant_category WHERE category = 'パブ' LIMIT 1)),
('ガスト', (SELECT id FROM restaurant_category WHERE category = 'ファミリーレストラン' LIMIT 1)),
('デニーズ', (SELECT id FROM restaurant_category WHERE category = 'ファミリーレストラン' LIMIT 1)),
('クラフトビールタップ', (SELECT id FROM restaurant_category WHERE category = 'バー' LIMIT 1)),
('スターバックス', (SELECT id FROM restaurant_category WHERE category = 'カフェ' LIMIT 1)),
('銀座ライオン', (SELECT id FROM restaurant_category WHERE category = 'ビアホール' LIMIT 1))
ON CONFLICT DO NOTHING; 