'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Beer {
  id: string;
  name: string;
  beerType: 'commercial' | 'restaurant';
  brewery: string;
  restaurant?: {
    id: string;
    name: string;
    category: string;
  } | null;
  category: string;
  alcoholContent: number;
  price?: number | null;
  imageUrl?: string;
  country?: string;
  description?: string;
}

interface BeerCategory {
  id: string;
  category: string;
  icon?: string;
  color?: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
}

interface DrinkingRecord {
  beerId: string;
  restaurantId: string;
  amount: number;
  price: number;
  time: string;
  rating: number;
  text: string;
  share: boolean;
  imageUrl?: string;
}

interface SearchFilters {
  search: string;
  category: string;
  minAlcohol: string;
  maxAlcohol: string;
  brewery: string;
}

export default function NewDrinkingRecord() {
  const [formData, setFormData] = useState<DrinkingRecord>({
    beerId: '',
    restaurantId: '',
    amount: 350,
    price: 500,
    time: new Date().toISOString().slice(0, 16),
    rating: 5,
    text: '',
    share: false,
    imageUrl: ''
  });

  const [beers, setBeers] = useState<Beer[]>([]);
  const [beerCategories, setBeerCategories] = useState<BeerCategory[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  
  // ビール検索関連
  const [searchBeer, setSearchBeer] = useState('');
  const [beerFilters, setBeerFilters] = useState<SearchFilters>({
    search: '',
    category: '',
    minAlcohol: '',
    maxAlcohol: '',
    brewery: ''
  });
  const [showBeerSearch, setShowBeerSearch] = useState(false);
  const [showBeerFilters, setShowBeerFilters] = useState(false);
  
  // レストラン検索関連
  const [searchRestaurant, setSearchRestaurant] = useState('');
  const [showRestaurantSearch, setShowRestaurantSearch] = useState(false);

  // データの初期読み込み
  useEffect(() => {
    loadInitialData();
  }, []);

  // ビール検索時の再取得
  useEffect(() => {
    if (showBeerSearch) {
      loadBeers();
    }
  }, [beerFilters, showBeerSearch]);

  // レストラン検索時の再取得
  useEffect(() => {
    if (showRestaurantSearch) {
      loadRestaurants();
    }
  }, [searchRestaurant, showRestaurantSearch]);

  const loadInitialData = async () => {
    try {
      setDataLoading(true);
      await Promise.all([
        loadBeers(),
        loadBeerCategories(),
        loadRestaurants()
      ]);
    } catch (error) {
      console.error('初期データ読み込みエラー:', error);
      alert('データの読み込みに失敗しました');
    } finally {
      setDataLoading(false);
    }
  };

  const loadBeers = async () => {
    try {
      const params = new URLSearchParams();
      if (beerFilters.search) params.append('search', beerFilters.search);
      if (beerFilters.category) params.append('category', beerFilters.category);
      if (beerFilters.minAlcohol) params.append('minAlcohol', beerFilters.minAlcohol);
      if (beerFilters.maxAlcohol) params.append('maxAlcohol', beerFilters.maxAlcohol);
      if (beerFilters.brewery) params.append('brewery', beerFilters.brewery);

      const response = await fetch(`/api/beers?${params.toString()}`);
      if (!response.ok) throw new Error('ビール一覧の取得に失敗しました');
      
      const data = await response.json();
      setBeers(data);
    } catch (error) {
      console.error('ビール読み込みエラー:', error);
    }
  };

  const loadBeerCategories = async () => {
    try {
      const response = await fetch('/api/beer-categories');
      if (!response.ok) throw new Error('ビールカテゴリの取得に失敗しました');
      
      const data = await response.json();
      setBeerCategories(data);
    } catch (error) {
      console.error('ビールカテゴリ読み込みエラー:', error);
    }
  };

  const loadRestaurants = async () => {
    try {
      const params = new URLSearchParams();
      if (searchRestaurant) params.append('search', searchRestaurant);

      const response = await fetch(`/api/restaurants?${params.toString()}`);
      if (!response.ok) throw new Error('レストラン一覧の取得に失敗しました');
      
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('レストラン読み込みエラー:', error);
    }
  };

  const selectedBeer = beers.find(beer => beer.id === formData.beerId);
  const selectedRestaurant = restaurants.find(restaurant => restaurant.id === formData.restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: 実際のユーザーIDを取得する (認証実装後)
      const userId = '990e8400-e29b-41d4-a716-446655440001'; // 仮のユーザーID

      const response = await fetch('/api/drinking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '飲酒記録の保存に失敗しました');
      }

      const result = await response.json();
      console.log('保存成功:', result);
      
      alert('飲酒記録を保存しました！');
      // TODO: 成功後のリダイレクト
    } catch (error) {
      console.error('保存エラー:', error);
      alert(error instanceof Error ? error.message : '保存に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleQuickPrice = (price: number) => {
    setFormData(prev => ({ ...prev, price }));
  };

  const handleBeerFilterChange = (key: keyof SearchFilters, value: string) => {
    setBeerFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearBeerFilters = () => {
    setBeerFilters({
      search: '',
      category: '',
      minAlcohol: '',
      maxAlcohol: '',
      brewery: ''
    });
  };

  if (dataLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">データを読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 dark:from-amber-800 dark:to-orange-900 safe-area-inset-top">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/"
                className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  🍺 飲酒記録
                </h1>
                <p className="text-amber-100 text-sm">
                  新しい記録を追加
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 space-y-6 pb-safe">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ビール選択 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🍺 ビール選択
            </h2>
            
            {selectedBeer ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{selectedBeer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBeer.beerType === 'commercial' ? (
                        <>🏪 {selectedBeer.brewery} • {selectedBeer.category}</>
                      ) : (
                        <>🍺 {selectedBeer.restaurant?.name} • {selectedBeer.category}</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      アルコール度数: {selectedBeer.alcoholContent}%
                      {selectedBeer.price && ` • ¥${selectedBeer.price}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, beerId: '' }))}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowBeerSearch(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                + ビールを選択してください
              </button>
            )}

            {/* ビール検索モーダル */}
            {showBeerSearch && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">ビールを選択</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setShowBeerSearch(false);
                          clearBeerFilters();
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* 基本検索 */}
                    <input
                      type="text"
                      placeholder="ビール名または醸造所で検索..."
                      value={beerFilters.search}
                      onChange={(e) => handleBeerFilterChange('search', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 mb-3"
                    />
                    
                    {/* フィルター切り替えボタン */}
                    <button
                      type="button"
                      onClick={() => setShowBeerFilters(!showBeerFilters)}
                      className="text-sm text-amber-600 hover:text-amber-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                      詳細フィルター {showBeerFilters ? '隠す' : '表示'}
                    </button>
                    
                    {/* 詳細フィルター */}
                    {showBeerFilters && (
                      <div className="mt-4 space-y-3 p-3 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                        {/* カテゴリフィルター */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">カテゴリ</label>
                          <select
                            value={beerFilters.category}
                            onChange={(e) => handleBeerFilterChange('category', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                          >
                            <option value="">全てのカテゴリ</option>
                            {beerCategories.map(category => (
                              <option key={category.id} value={category.category}>
                                {category.icon} {category.category}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* アルコール度数フィルター */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">最小アルコール度数</label>
                            <input
                              type="number"
                              placeholder="0"
                              step="0.1"
                              value={beerFilters.minAlcohol}
                              onChange={(e) => handleBeerFilterChange('minAlcohol', e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">最大アルコール度数</label>
                            <input
                              type="number"
                              placeholder="15"
                              step="0.1"
                              value={beerFilters.maxAlcohol}
                              onChange={(e) => handleBeerFilterChange('maxAlcohol', e.target.value)}
                              className="w-full p-2 text-sm border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                            />
                          </div>
                        </div>
                        
                        {/* 醸造所フィルター */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">醸造所</label>
                          <input
                            type="text"
                            placeholder="醸造所名で絞り込み"
                            value={beerFilters.brewery}
                            onChange={(e) => handleBeerFilterChange('brewery', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
                          />
                        </div>
                        
                        {/* フィルタークリアボタン */}
                        <button
                          type="button"
                          onClick={clearBeerFilters}
                          className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-1"
                        >
                          フィルターをクリア
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 overflow-y-auto max-h-96">
                    <div className="space-y-2">
                      {/* 新しいビール追加ボタン */}
                      <Link
                        href="/beers/new"
                        className="inline-block px-6 py-3 mx-auto
                                    text-center bg-green-50 dark:bg-green-900/20
                                    border-2 border-dashed border-green-300 dark:border-green-700
                                    rounded-lg text-green-600 dark:text-green-400
                                    hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          新しいビールを追加
                        </div>
                      </Link>
                      
                      {beers.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          条件に一致するビールが見つかりません
                        </p>
                      ) : (
                        beers.map((beer) => (
                          <button
                            key={beer.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, beerId: beer.id }));
                              setShowBeerSearch(false);
                              clearBeerFilters();
                            }}
                            className="w-full p-3 text-left bg-gray-50 dark:bg-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                          >
                            <div className="font-medium text-gray-800 dark:text-gray-200">{beer.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {beer.beerType === 'commercial' ? (
                                <>🏪 {beer.brewery} • {beer.category}</>
                              ) : (
                                <>🍺 {beer.restaurant?.name} • {beer.category}</>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              アルコール度数: {beer.alcoholContent}%
                              {beer.price && ` • ¥${beer.price}`}
                            </div>
                            {beer.description && (
                              <div className="text-xs text-gray-500 mt-1">{beer.description}</div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 容量と価格 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📏 容量と価格
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  容量 (ml)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  min="0"
                  step="50"
                />
                <div className="flex gap-2 mt-2">
                  {[330, 350, 500].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleQuickAmount(amount)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    >
                      {amount}ml
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  価格 (円)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  min="0"
                  step="50"
                />
                <div className="flex gap-2 mt-2">
                  {[300, 500, 800].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => handleQuickPrice(price)}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors"
                    >
                      ¥{price}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 日時 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📅 日時
            </h2>
            <input
              type="datetime-local"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
              required
            />
          </div>

          {/* レストラン選択 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              🏪 場所
            </h2>
            
            {selectedRestaurant ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{selectedRestaurant.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRestaurant.category}</p>
                    {selectedRestaurant.address && (
                      <p className="text-xs text-gray-500">{selectedRestaurant.address}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, restaurantId: '' }))}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowRestaurantSearch(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + 場所を選択してください（オプション）
              </button>
            )}

            {/* レストラン検索モーダル */}
            {showRestaurantSearch && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">場所を選択</h3>
                      <button
                        type="button"
                        onClick={() => setShowRestaurantSearch(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="店名またはカテゴリで検索..."
                      value={searchRestaurant}
                      onChange={(e) => setSearchRestaurant(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div className="p-4 overflow-y-auto max-h-96">
                    <div className="space-y-2">
                      {restaurants.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          条件に一致する場所が見つかりません
                        </p>
                      ) : (
                        restaurants.map((restaurant) => (
                          <button
                            key={restaurant.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, restaurantId: restaurant.id }));
                              setShowRestaurantSearch(false);
                              setSearchRestaurant('');
                            }}
                            className="w-full p-3 text-left bg-gray-50 dark:bg-zinc-700 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                          >
                            <div className="font-medium text-gray-800 dark:text-gray-200">{restaurant.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{restaurant.category}</div>
                            {restaurant.address && (
                              <div className="text-xs text-gray-500">{restaurant.address}</div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 評価 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              ⭐ 評価
            </h2>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-3xl transition-colors ${
                    star <= formData.rating 
                      ? 'text-yellow-400 hover:text-yellow-500' 
                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {formData.rating}点 / 5点
            </p>
          </div>

          {/* コメント */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              💬 コメント
            </h2>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="今日の一杯はどうでしたか？"
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 resize-none"
            />
          </div>

          {/* SNSシェア */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  📱 SNSでシェア
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  この記録をSNSでシェアしますか？
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.share}
                  onChange={(e) => setFormData(prev => ({ ...prev, share: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || !formData.beerId}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  保存中...
                </div>
              ) : (
                '🍺 記録を保存'
              )}
            </button>
            
            <Link
              href="/"
              className="block w-full text-center py-3 px-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 