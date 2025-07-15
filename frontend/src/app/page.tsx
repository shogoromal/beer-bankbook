'use client';

import { useState, useEffect } from 'react';

interface MonthlyStats {
  totalVolume: number;
  totalAmount: number;
  totalPrice: number;
  previousVolume: number;
  previousAmount: number;
  previousPrice: number;
  loading: boolean;
}

interface Mission {
  id: string;
  title: string;
  progress: number;
  target: number;
  badge: string;
  type: 'volume' | 'variety' | 'streak' | 'social';
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  priority: number;
  publishedAt: string;
}

export default function Home() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalVolume: 0,
    totalAmount: 0,
    totalPrice: 0,
    previousVolume: 0,
    previousAmount: 0,
    previousPrice: 0,
    loading: true
  });

  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  // TODO: 実際のAPIからデータを取得する
  useEffect(() => {
    // 模擬データ（後でAPIと置き換え）
    setTimeout(() => {
      setMonthlyStats({
        totalVolume: 2450, // ml
        totalAmount: 12, // 杯数
        totalPrice: 12500, // 円
        previousVolume: 2100,
        previousAmount: 10,
        previousPrice: 11200,
        loading: false
      });
    }, 1000);

    // ミッション模擬データ
    setTimeout(() => {
      setActiveMissions([
        {
          id: '1',
          title: '月間50杯チャレンジ',
          progress: 40,
          target: 50,
          badge: 'volume_master',
          type: 'volume'
        },
        {
          id: '2',
          title: 'ビール図鑑コンプリート',
          progress: 8,
          target: 10,
          badge: 'beer_explorer',
          type: 'variety'
        }
      ]);
      setMissionsLoading(false);
    }, 1200);

    // 新着情報模擬データ
    setTimeout(() => {
      setNews([
        {
          id: '1',
          title: '新商品「プレミアムIPA」登場！',
          category: 'new_product',
          priority: 1,
          publishedAt: '2024-07-01'
        },
        {
          id: '2',
          title: 'ハッピーアワー開始！',
          category: 'campaign',
          priority: 2,
          publishedAt: '2024-07-05'
        },
        {
          id: '3',
          title: '夏季限定ビアガーデンオープン',
          category: 'event',
          priority: 1,
          publishedAt: '2024-06-15'
        }
      ]);
      setNewsLoading(false);
    }, 800);
  }, []);

  const currentDate = new Date();
  const thisMonthName = currentDate.toLocaleDateString('ja-JP', { month: 'long' });
  const lastMonthName = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    .toLocaleDateString('ja-JP', { month: 'long' });

  const volumeChange = monthlyStats.totalVolume - monthlyStats.previousVolume;
  const volumeChangePercent = monthlyStats.previousVolume > 0 
    ? Math.round((volumeChange / monthlyStats.previousVolume) * 100) 
    : 0;

  const priceChange = monthlyStats.totalPrice - monthlyStats.previousPrice;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* モバイルバンキング風ヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 safe-area-inset-top">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                🍺 ビール通帳
              </h1>
              <p className="text-blue-100 text-sm">
                {currentDate.toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 space-y-6 pb-safe">
        {/* 飲酒実績サマリー - バンキング風カード */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              📊 今月の飲酒実績
            </h2>
            <div className="text-xs text-gray-500 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
              {thisMonthName}
            </div>
          </div>
          
          {monthlyStats.loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* メイン指標 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {monthlyStats.totalVolume.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">ml</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ¥{monthlyStats.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">合計金額</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {monthlyStats.totalAmount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">杯</p>
                </div>
              </div>

              {/* 前月比較 */}
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">前月比</span>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center ${volumeChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d={volumeChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                      </svg>
                      <span className="font-medium">
                        {volumeChange >= 0 ? '+' : ''}{volumeChangePercent}%
                      </span>
                    </div>
                    <div className={`text-xs ${priceChange >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {priceChange >= 0 ? '+' : ''}¥{priceChange.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 進行中のミッション */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🎯 進行中のミッション
          </h2>
          
          {missionsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeMissions.map((mission) => {
                const progressPercent = Math.round((mission.progress / mission.target) * 100);
                return (
                  <div key={mission.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-700 dark:to-zinc-600 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {mission.title}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white dark:bg-zinc-800 px-2 py-1 rounded-full">
                        {mission.progress}/{mission.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {progressPercent}% 完了
                    </p>
                  </div>
                );
              })}
              
              {activeMissions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                  現在進行中のミッションはありません
                </p>
              )}
            </div>
          )}
        </div>

        {/* クイックアクション */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🔥 クイックアクション
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* 飲酒記録 */}
            <a
              href="/drinking/new"
              className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[80px]"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">🍺 記録</span>
            </a>

            {/* 統計 */}
            <a
              href="/drinking/stats"
              className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[80px]"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium">📊 統計</span>
            </a>

            {/* 友達 */}
            <a
              href="/friends"
              className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 text-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[80px]"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">👥 友達</span>
            </a>

            {/* 印刷 */}
            <a
              href="/print"
              className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white rounded-xl p-4 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[80px]"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="text-sm font-medium">🖨️ 印刷</span>
            </a>
          </div>
        </div>

        {/* 新着情報 */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              📰 新着情報
            </h2>
            <a 
              href="/news" 
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              すべて見る
            </a>
          </div>
          
          {newsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {news.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.priority === 1 ? 'bg-red-500' : 
                      item.priority === 2 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
              
              {news.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                  新着情報はありません
                </p>
              )}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Beer Bankbook - あなたのビールライフをサポート
          </p>
        </div>
      </div>
    </main>
  );
}
