'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [monthlyData, setMonthlyData] = useState({
    thisMonth: 0,
    lastMonth: 0,
    loading: true
  });

  // TODO: 実際のAPIからデータを取得する
  useEffect(() => {
    // 模擬データ（後でAPIと置き換え）
    setTimeout(() => {
      setMonthlyData({
        thisMonth: 12, // ml単位を想定
        lastMonth: 8,
        loading: false
      });
    }, 1000);
  }, []);

  const currentDate = new Date();
  const thisMonthName = currentDate.toLocaleDateString('ja-JP', { month: 'long' });
  const lastMonthName = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    .toLocaleDateString('ja-JP', { month: 'long' });

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800 font-[family-name:var(--font-geist-sans)]">
      {/* スマホ用コンテナ - 安全エリアとパディングを考慮 */}
      <div className="safe-area-inset px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-lg mx-auto space-y-6">
          
          {/* ヘッダー - スマホでコンパクト */}
          <div className="text-center pt-4 pb-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-700 dark:text-amber-400 tracking-tight mb-1">
              Beer Bankbook
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm">
              あなたのビール飲酒記録
            </p>
          </div>

          {/* 月別飲酒量表示 - スマホでフルワイズ */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
              飲酒量サマリー
            </h2>
            
            <div className="flex justify-between items-center px-2">
              <div className="text-center flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{thisMonthName}</p>
                {monthlyData.loading ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {monthlyData.thisMonth}
                    <span className="text-xs sm:text-sm ml-1 text-gray-500">杯</span>
                  </p>
                )}
              </div>
              
              <div className="w-px h-10 sm:h-12 bg-gray-200 dark:bg-gray-600 mx-4"></div>
              
              <div className="text-center flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{lastMonthName}</p>
                {monthlyData.loading ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-gray-500 dark:text-gray-400">
                    {monthlyData.lastMonth}
                    <span className="text-xs sm:text-sm ml-1 text-gray-500">杯</span>
                  </p>
                )}
              </div>
            </div>

            {/* 前月比表示 */}
            {!monthlyData.loading && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  前月比: 
                  <span className={`ml-1 font-medium ${
                    monthlyData.thisMonth > monthlyData.lastMonth 
                      ? 'text-red-500' 
                      : monthlyData.thisMonth < monthlyData.lastMonth 
                        ? 'text-green-500' 
                        : 'text-gray-500'
                  }`}>
                    {monthlyData.thisMonth > monthlyData.lastMonth ? '+' : ''}
                    {monthlyData.thisMonth - monthlyData.lastMonth}杯
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* 丸いボタン群 - スマホでは縦配置、大きめサイズ */}
          <div className="space-y-6 pb-8">
            <h3 className="text-center text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 px-4">
              アクション
            </h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
              {/* お酒を追加ボタン */}
              <div className="flex flex-col items-center">
                <a
                  href="/drinking/new"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </a>
                <p className="mt-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 text-center px-2">
                  お酒を追加
                </p>
              </div>

              {/* 記録・統計を見るボタン */}
              <div className="flex flex-col items-center">
                <a
                  href="/drinking"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </a>
                <p className="mt-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 text-center px-2">
                  記録・統計を見る
                </p>
              </div>

              {/* 友人を探すボタン */}
              <div className="flex flex-col items-center">
                <a
                  href="/friends"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </a>
                <p className="mt-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 text-center px-2">
                  友人を探す
                </p>
              </div>
            </div>
          </div>

          {/* 今月の目標達成率（今後実装予定） */}
          <div className="text-center pb-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 px-4">
              今月の目標達成率などの機能は今後追加予定です
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
