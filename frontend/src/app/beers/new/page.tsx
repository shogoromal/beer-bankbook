'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface BeerFormData {
  name: string;
  beerType: 'commercial' | 'restaurant';
  brewery: string;
  restaurantId: string;
  categoryId: string;
  alcoholContent: string;
  price: string;
  country: string;
  description: string;
  imageUrl: string;
  untappdId: string;
}

export default function NewBeer() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<BeerFormData>({
    name: '',
    beerType: 'commercial',
    brewery: '',
    restaurantId: '',
    categoryId: '',
    alcoholContent: '',
    price: '',
    country: '',
    description: '',
    imageUrl: '',
    untappdId: ''
  });

  const [beerCategories, setBeerCategories] = useState<BeerCategory[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // データの初期読み込み
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadBeerCategories(),
      loadRestaurants()
    ]);
  };

  const loadBeerCategories = async () => {
    try {
      const response = await fetch('/api/beer-categories');
      if (!response.ok) throw new Error('ビールカテゴリの取得に失敗しました');
      
      const data = await response.json();
      setBeerCategories(data);
    } catch (error) {
      console.error('ビールカテゴリ読み込みエラー:', error);
      alert('ビールカテゴリの読み込みに失敗しました');
    }
  };

  const loadRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      if (!response.ok) throw new Error('レストラン一覧の取得に失敗しました');
      
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error('レストラン読み込みエラー:', error);
      alert('レストラン一覧の読み込みに失敗しました');
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 必須フィールドの確認
      if (!formData.name.trim()) {
        throw new Error('ビール名は必須です');
      }

      // レストランビールの場合はレストラン選択が必須
      if (formData.beerType === 'restaurant' && !formData.restaurantId) {
        throw new Error('レストランビールの場合、レストランの選択は必須です');
      }

      const response = await fetch('/api/beers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          beerType: formData.beerType,
          brewery: formData.beerType === 'commercial' ? (formData.brewery.trim() || null) : null,
          restaurantId: formData.beerType === 'restaurant' ? (formData.restaurantId || null) : null,
          categoryId: formData.categoryId || null,
          alcoholContent: formData.alcoholContent ? parseFloat(formData.alcoholContent) : null,
          price: formData.price ? parseFloat(formData.price) : null,
          country: formData.country.trim() || null,
          description: formData.description.trim() || null,
          imageUrl: formData.imageUrl.trim() || null,
          untappdId: formData.untappdId.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ビールの追加に失敗しました');
      }

      const result = await response.json();
      console.log('追加成功:', result);
      
      alert('新しいビールを追加しました！');
      
      // フォームをリセット
      setFormData({
        name: '',
        beerType: 'commercial',
        brewery: '',
        restaurantId: '',
        categoryId: '',
        alcoholContent: '',
        price: '',
        country: '',
        description: '',
        imageUrl: '',
        untappdId: ''
      });
      
    } catch (error) {
      console.error('追加エラー:', error);
      alert(error instanceof Error ? error.message : 'ビールの追加に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof BeerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
      <div className="bg-gradient-to-r from-green-600 to-teal-700 dark:from-green-800 dark:to-teal-900 safe-area-inset-top">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  🍺 新しいビール追加
                </h1>
                <p className="text-green-100 text-sm">
                  データベースに新しいビールを登録
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 space-y-6 pb-safe">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📝 基本情報
            </h2>
            
            <div className="space-y-4">
              {/* ビール名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ビール名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="例: アサヒスーパードライ"
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>

              {/* ビールタイプ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ビールタイプ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.beerType}
                  onChange={(e) => handleInputChange('beerType', e.target.value as 'commercial' | 'restaurant')}
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  required
                >
                  <option value="commercial">🏪 市販ビール</option>
                  <option value="restaurant">🍺 レストランビール</option>
                </select>
              </div>

              {/* 醸造所（市販ビールの場合のみ） */}
              {formData.beerType === 'commercial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    醸造所
                  </label>
                  <input
                    type="text"
                    value={formData.brewery}
                    onChange={(e) => handleInputChange('brewery', e.target.value)}
                    placeholder="例: アサヒビール"
                    className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              )}

              {/* レストラン選択（レストランビールの場合のみ） */}
              {formData.beerType === 'restaurant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    レストラン <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.restaurantId}
                    onChange={(e) => handleInputChange('restaurantId', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                    required
                  >
                    <option value="">レストランを選択してください</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name} ({restaurant.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 値段 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  値段 (円)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="例: 500"
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                />
              </div>

              {/* カテゴリ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  カテゴリ
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="">カテゴリを選択してください</option>
                  {beerCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* アルコール度数と国 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    アルコール度数 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={formData.alcoholContent}
                    onChange={(e) => handleInputChange('alcoholContent', e.target.value)}
                    placeholder="5.0"
                    className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    原産国
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="例: 日本"
                    className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              📖 詳細情報
            </h2>
            
            <div className="space-y-4">
              {/* 説明 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="ビールの特徴や味わいについて説明してください"
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200 resize-none"
                />
              </div>

              {/* 画像URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  画像URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/beer-image.jpg"
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="ビール画像プレビュー"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Untappd ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Untappd ID
                </label>
                <input
                  type="text"
                  value={formData.untappdId}
                  onChange={(e) => handleInputChange('untappdId', e.target.value)}
                  placeholder="untappd_beer_id"
                  className="w-full p-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  UntappdのビールIDを入力すると、外部連携が可能になります
                </p>
              </div>
            </div>
          </div>

          {/* プレビューカード */}
          {formData.name && (
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                👁️ プレビュー
              </h2>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <div className="flex items-start">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt={formData.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{formData.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.beerType === 'commercial' ? '🏪 市販ビール' : '🍺 レストランビール'}
                      {formData.brewery && formData.beerType === 'commercial' && ' • ' + formData.brewery}
                      {formData.restaurantId && formData.beerType === 'restaurant' && ' • ' + restaurants.find(r => r.id === formData.restaurantId)?.name}
                      {formData.categoryId && ' • ' + (beerCategories.find(c => c.id === formData.categoryId)?.category || '')}
                    </p>
                    {formData.price && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">💰 ¥{formData.price}</p>
                    )}
                    {formData.alcoholContent && (
                      <p className="text-xs text-gray-500">アルコール度数: {formData.alcoholContent}%</p>
                    )}
                    {formData.country && (
                      <p className="text-xs text-gray-500">原産国: {formData.country}</p>
                    )}
                    {formData.description && (
                      <p className="text-xs text-gray-500 mt-1">{formData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 送信ボタン */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  追加中...
                </div>
              ) : (
                '🍺 ビールを追加'
              )}
            </button>
            
            <button
              onClick={() => router.back()}
              className="block w-full text-center py-3 px-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>

        {/* 注意事項 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">ビール追加に関するご注意</p>
              <ul className="space-y-1 text-xs">
                <li>• ビール名は必須項目です</li>
                <li>• 追加されたビールは即座に選択可能になります</li>
                <li>• 画像URLは有効なリンクを入力してください</li>
                <li>• 重複するビール名がないか確認してから追加してください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 