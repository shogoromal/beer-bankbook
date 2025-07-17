# Beer Bankbook - Makefile
# データベース操作とプロジェクト管理の自動化

.PHONY: help setup start stop restart logs db-init db-sample db-reset db-status db-shell clean

# デフォルトターゲット
help:
	@echo "🍺 Beer Bankbook - 利用可能なコマンド"
	@echo ""
	@echo "📋 基本操作:"
	@echo "  make setup          - 初回セットアップ（環境構築）"
	@echo "  make start          - アプリケーション起動"
	@echo "  make stop           - アプリケーション停止"
	@echo "  make restart        - アプリケーション再起動"
	@echo "  make logs           - ログ表示"
	@echo ""
	@echo "🗄️  データベース操作:"
	@echo "  make db-init        - データベース初期化"
	@echo "  make db-sample      - サンプルデータ追加"
	@echo "  make db-reset       - データベースリセット"
	@echo "  make db-status      - データベース状況確認"
	@echo "  make db-shell       - データベースシェル接続"
	@echo ""
	@echo "🧹 メンテナンス:"
	@echo "  make clean          - 不要なファイル・イメージ削除"

# 初回セットアップ
setup:
	@echo "🚀 Beer Bankbook セットアップ開始..."
	@if [ ! -f .env ]; then \
		echo "📄 環境設定ファイルをコピー中..."; \
		cp env.example .env; \
	fi
	@echo "🐳 Dockerコンテナをビルド・起動中..."
	docker-compose up -d --build
	@echo "⏳ データベース起動を待機中..."
	sleep 10
	@echo "🗄️  データベースを初期化中..."
	$(MAKE) db-init
	@echo "📊 サンプルデータを追加中..."
	$(MAKE) db-sample
	@echo ""
	@echo "✅ セットアップ完了！"
	@echo "🌐 アプリケーション: http://localhost:3000"
	@echo "🔧 pgAdmin: http://localhost:8080"

# アプリケーション起動
start:
	@echo "🚀 アプリケーションを起動中..."
	docker-compose up -d
	@echo "✅ 起動完了！"
	@echo "🌐 http://localhost:3000"

# アプリケーション停止
stop:
	@echo "⏹️  アプリケーションを停止中..."
	docker-compose down
	@echo "✅ 停止完了！"

# アプリケーション再起動
restart:
	@echo "🔄 アプリケーションを再起動中..."
	docker-compose restart
	@echo "✅ 再起動完了！"

# ログ表示
logs:
	@echo "📋 ログを表示中..."
	docker-compose logs -f

# データベース初期化
db-init:
	@echo "🗄️  データベースを初期化中..."
	docker-compose exec frontend npx prisma db push --force-reset
	docker-compose exec frontend npx prisma generate
	@echo "✅ データベース初期化完了！"

# サンプルデータ追加
db-sample:
	@echo "📊 サンプルデータを追加中..."
	@echo "- レストランビールサンプルデータを追加..."
	docker-compose exec postgres psql -U beer_user -d beer_bankbook -f /docker-entrypoint-initdb.d/03-restaurant-beer-samples.sql
	@echo "✅ サンプルデータ追加完了！"
	$(MAKE) db-status

# データベースリセット
db-reset:
	@echo "⚠️  データベースをリセットします（全データが削除されます）"
	@read -p "続行しますか？ [y/N]: " confirm && [ "$$confirm" = "y" ]
	docker-compose down
	docker volume rm beer-bankbook_postgres_data || true
	docker-compose up -d postgres
	@echo "⏳ PostgreSQL起動を待機中..."
	sleep 10
	docker-compose up -d
	@echo "⏳ アプリケーション起動を待機中..."
	sleep 5
	$(MAKE) db-init
	$(MAKE) db-sample
	@echo "✅ データベースリセット完了！"

# データベース状況確認
db-status:
	@echo "📊 データベース状況:"
	@docker-compose exec postgres psql -U beer_user -d beer_bankbook -c "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'beer', COUNT(*) FROM beer UNION ALL SELECT 'restaurant', COUNT(*) FROM restaurant UNION ALL SELECT 'drinking', COUNT(*) FROM drinking ORDER BY table_name;"
	@echo ""
	@echo "🍺 ビール種類別統計:"
	@docker-compose exec postgres psql -U beer_user -d beer_bankbook -c "SELECT beer_type, COUNT(*) as count, ROUND(AVG(alcohol_content), 1) as avg_alcohol, ROUND(AVG(price), 0) as avg_price FROM beer WHERE beer_type IS NOT NULL GROUP BY beer_type ORDER BY beer_type;"

# データベースシェル接続
db-shell:
	@echo "🐘 PostgreSQLシェルに接続中..."
	@echo "終了するには \\q を入力してください"
	docker-compose exec postgres psql -U beer_user -d beer_bankbook

# 不要ファイル・イメージ削除
clean:
	@echo "🧹 不要なファイルとイメージを削除中..."
	docker-compose down -v
	docker system prune -f
	docker volume prune -f
	@echo "✅ クリーンアップ完了！"

# 開発用ターゲット
dev-logs:
	docker-compose logs -f frontend

dev-restart-frontend:
	docker-compose restart frontend

dev-rebuild:
	docker-compose up -d --build frontend

# ヘルスチェック
health:
	@echo "🏥 ヘルスチェック実行中..."
	@echo "Frontend: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "ERROR")"
	@echo "pgAdmin: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 || echo "ERROR")"
	@echo "API: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/beers || echo "ERROR")" 