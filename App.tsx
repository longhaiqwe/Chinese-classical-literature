import { Capacitor } from '@capacitor/core';
import React, { useState, useEffect, useRef } from 'react';
import { IGameScene, AppState, IGameCategory, IGameStory } from './types';
import { storyService } from './services/storyService';
import { loadProgressFromDB, saveProgressToDB } from './services/db';
import { APP_TITLE, APP_SUBTITLE, UI_LABELS } from './constants';
import GameScene from './components/GameScene';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [isNative, setIsNative] = useState(false);
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);

  // Navigation State
  const [categories, setCategories] = useState<IGameCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IGameCategory | null>(null);
  const [selectedStory, setSelectedStory] = useState<IGameStory | null>(null);

  // Game Play State
  const [scenes, setScenes] = useState<IGameScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- URL State Management Helper ---
  const updateUrlParams = (categoryId: string | null, storyId: string | null, sceneIndex: number | null) => {
    const url = new URL(window.location.href);

    if (categoryId) {
      url.searchParams.set('category', categoryId);
    } else {
      url.searchParams.delete('category');
    }

    if (storyId) {
      url.searchParams.set('story', storyId);
    } else {
      url.searchParams.delete('story');
    }

    if (sceneIndex !== null) {
      url.searchParams.set('scene', sceneIndex.toString());
    } else {
      url.searchParams.delete('scene');
    }

    window.history.replaceState({}, '', url.toString());
  };

  // Initialize
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    loadCategories();
  }, []);

  // Deep Linking Handler (for Automation/Debugging/State Persistence)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('category');
    const storyId = params.get('story');
    const sceneIndexStr = params.get('scene');

    if (categories.length > 0 && !isLoading) {
      // 1. Handle Story Deep Link (Prioritized)
      if (storyId && !selectedStory) {
        const targetCategory = categories.find(c => c.stories.some(s => s.id === storyId));
        if (targetCategory) {
          const targetStory = targetCategory.stories.find(s => s.id === storyId);
          if (targetStory) {
            console.log(`Deep linking to story: ${storyId}, scene: ${sceneIndexStr}`);
            handleSelectStory(targetStory).then(() => {
              if (sceneIndexStr) {
                const idx = parseInt(sceneIndexStr, 10);
                if (!isNaN(idx)) {
                  setCurrentSceneIndex(idx);
                }
              }
            });
            return; // Exit if handling story
          }
        }
      }

      // 2. Handle Category Deep Link (If no story selected)
      if (categoryId && !selectedCategory && !selectedStory) {
        const targetCategory = categories.find(c => c.id === categoryId);
        if (targetCategory) {
          console.log(`Deep linking to category: ${categoryId}`);
          setSelectedCategory(targetCategory);
          setAppState(AppState.CATEGORY_VIEW);
        }
      }
    }
  }, [categories, isLoading]); // Depend on categories to ensure they are loaded

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await storyService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError("无法加载故事数据，请检查网络连接。");
    } finally {
      setIsLoading(false);
    }
  };

  // Save progress to Local DB (Keep existing logic but only when playing)
  useEffect(() => {
    if (appState === AppState.PLAYING) {
      saveProgressToDB(currentSceneIndex).catch(err => console.error("Failed to save progress", err));
    }
  }, [currentSceneIndex, appState]);


  // --- Navigation Handlers ---

  const handleSelectCategory = (category: IGameCategory) => {
    setSelectedCategory(category);
    setAppState(AppState.CATEGORY_VIEW);
    updateUrlParams(category.id, null, null);
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setAppState(AppState.HOME);
    updateUrlParams(null, null, null);
  };

  const handleSelectStory = async (story: IGameStory) => {
    try {
      setIsLoading(true);
      const scenes = await storyService.getStoryDetails(story.id);
      setSelectedStory(story);
      setScenes(scenes);
      setCurrentSceneIndex(0);
      setAppState(AppState.PLAYING);
      // We keep result param categoryId if available, but simplest is to find it or just set story
      // Ideally we know the category of this story.
      // Let's find it from state or list.
      const parentCat = categories.find(c => c.stories.some(s => s.id === story.id));
      updateUrlParams(parentCat?.id || null, story.id, 0);
    } catch (err) {
      console.error("Failed to load story details", err);
      // Ideally show a toast or alert
      alert("无法加载故事详情，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCategory = () => {
    setSelectedStory(null);
    setScenes([]);
    setAppState(AppState.CATEGORY_VIEW);
    if (selectedCategory) {
      updateUrlParams(selectedCategory.id, null, null);
    } else {
      updateUrlParams(null, null, null); // Fallback
    }
  };

  // --- Game Gameplay Handlers ---

  const handleNextScene = () => {
    // Valid text flow from Bad Ending (Index 6) is to restart
    if (currentSceneIndex === 6) {
      handleRestart();
      return;
    }

    // Victory Condition: If current scene is the second to last scene (assuming last is Bad Ending)
    // OR if we define "Success" differently. For now, let's assume if there are N scenes,
    // index N-1 is Bad Ending, so index N-2 is the Final Good Scene.
    // If we are at index N-2 and click Next, we win.

    // Better logic: Check if the *next* index is the Bad Ending (which we need to identify).
    // Convention: The last scene in the array is the Bad Ending (id=7 or similar).
    // So if currentSceneIndex satisfies (nextIndex === scenes.length - 1), it means we are trying to go to the bad ending
    // but via the "Success" path (because options handle the bad path).

    // Simplified: If we are at the last "Good" scene.
    // Let's assume the last scene in the list is the Bad Ending.
    const badEndingIndex = scenes.length - 1;
    if (currentSceneIndex === badEndingIndex - 1) {
      setAppState(AppState.VICTORY);
      // saveProgressToDB(0); // Optional: Reset progress on victory
      return;
    }

    // Standard progression
    const nextIndex = currentSceneIndex + 1;
    setCurrentSceneIndex(nextIndex);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, nextIndex);
    }
    window.scrollTo(0, 0);
  };

  const handleGameOver = () => {
    setAppState(AppState.GAME_OVER);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    saveProgressToDB(0);
    setAppState(AppState.PLAYING);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, 0);
    }
    window.scrollTo(0, 0);
  };

  const handleExitGame = () => {
    // Return to story selection
    handleBackToCategory();
  };

  // Mobile: Swipe to Exit Game Listener
  useEffect(() => {
    if (!isNative || appState !== AppState.PLAYING) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const startX = touchStartRef.current.x;
      const currentX = e.changedTouches[0].clientX;
      const currentY = e.changedTouches[0].clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - touchStartRef.current.y;

      // Logic:
      // 1. Must start from the left edge (e.g., within 50px)
      // 2. Must swipe right significantly (> 60px)
      // 3. Must be relatively horizontal (abs(deltaY) < abs(deltaX))
      if (startX < 50 && deltaX > 60 && Math.abs(deltaY) < Math.abs(deltaX)) {
        handleExitGame();
      }

      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isNative, appState]);

  return (
    <div className="min-h-screen bg-paper-50 bg-paper-texture text-ink-900 font-serif selection:bg-accent-red selection:text-white">
      {/* Decorative Border */}
      {/* Decorative Border - Hide in screenshot mode (when ?scene= is present) to avoid scrolling artifacts */}
      {!new URLSearchParams(window.location.search).has('scene') && (
        <>
          <div className="fixed top-0 left-0 w-full h-2 bg-ink-800 z-50"></div>
          <div className="fixed bottom-0 left-0 w-full h-2 bg-ink-800 z-50"></div>
        </>
      )}

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">

        {/* Header */}
        <header className="text-center mb-8 pt-12 animate-fade-in relative">
          {/* Optional: Home Button if not on Home (WEB ONLY) */}
          {!isNative && appState !== AppState.HOME && (
            <button
              onClick={handleBackToHome}
              className="absolute left-4 top-4 text-ink-500 hover:text-ink-900 flex items-center gap-1 transition-colors z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span className="font-sans font-bold">首页</span>
            </button>
          )}

          <h1 className="text-5xl md:text-6xl font-calligraphy text-ink-900 mb-2 drop-shadow-sm tracking-widest cursor-pointer" onClick={handleBackToHome}>
            {APP_TITLE}
          </h1>
          <p className="text-lg text-accent-brown uppercase tracking-widest font-bold opacity-80 border-b border-ink-800/20 inline-block pb-1">
            {APP_SUBTITLE}
          </p>
        </header>

        {/* Content Area */}
        <div className="flex-grow flex flex-col items-center justify-start w-full">

          {/* LOADING */}
          {isLoading && (
            <LoadingScreen mode="story" />
          )}

          {/* HOME VIEW */}
          {!isLoading && appState === AppState.HOME && (
            <HomeView
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {/* CATEGORY VIEW */}
          {!isLoading && appState === AppState.CATEGORY_VIEW && selectedCategory && (
            <CategoryView
              category={selectedCategory}
              onSelectStory={handleSelectStory}
              onBack={handleBackToHome}
            />
          )}

          {/* PLAYING VIEW */}
          {!isLoading && appState === AppState.PLAYING && scenes.length > 0 && (
            <div className="w-full">
              <div className="mb-4 flex justifyContent-between items-center px-4 md:px-0">
                {/* Spacer to center the content if needed, or just simple alignment */}
                {!isNative && (
                  <button
                    onClick={handleExitGame}
                    className="flex items-center gap-2 px-4 py-2 border border-ink-300 rounded-full text-ink-600 hover:border-accent-red hover:text-accent-red hover:bg-paper-50 transition-all text-sm font-serif group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    结束闯关
                  </button>
                )}
              </div>
              <GameScene
                key={currentSceneIndex}
                scene={scenes[currentSceneIndex]}
                storyId={selectedStory?.id || 'unknown'}
                onNext={handleNextScene}
                onGameOver={handleGameOver}
              />
            </div>
          )}

          {/* VICTORY VIEW */}
          {appState === AppState.VICTORY && (
            <div className="text-center animate-fade-in p-8 border-4 border-double border-accent-red bg-paper-100 shadow-2xl max-w-2xl mx-4">
              <h2 className="text-4xl md:text-5xl font-calligraphy text-accent-red mb-6">
                {selectedStory?.endingTitle || "通关成功"}
              </h2>
              <p className="text-lg md:text-xl mb-8 leading-relaxed whitespace-pre-line font-serif text-ink-900">
                {selectedStory?.endingDescription || "恭喜你完成了这段历史的演绎。"}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 bg-ink-900 text-paper-100 font-serif text-lg rounded hover:bg-accent-red transition-colors shadow-lg"
                >
                  {UI_LABELS.restart}
                </button>
                <button
                  onClick={handleExitGame}
                  className="px-8 py-3 border-2 border-ink-900 text-ink-900 font-serif text-lg rounded hover:bg-ink-100 transition-colors shadow-lg"
                >
                  返回目录
                </button>
              </div>
            </div>
          )}

          {/* GAME OVER VIEW */}
          {appState === AppState.GAME_OVER && (
            <div className="text-center animate-fade-in p-8 border-4 border-double border-ink-400 bg-paper-100 shadow-2xl max-w-2xl mx-4">
              <h2 className="text-4xl md:text-5xl font-calligraphy text-ink-600 mb-6">
                {scenes[scenes.length - 1]?.title || "挑战失败"}
              </h2>

              {/* Optional: Show the bad ending image if available */}
              {scenes[scenes.length - 1]?.imageUrl && (
                <div className="mb-6 rounded overflow-hidden border-2 border-ink-200 shadow-md">
                  <img src={scenes[scenes.length - 1].imageUrl} alt="Failure" className="w-full aspect-video object-cover opacity-80" />
                </div>
              )}

              <p className="text-lg md:text-xl mb-8 leading-relaxed whitespace-pre-line font-serif text-ink-800">
                {scenes[scenes.length - 1]?.narrative || "胜败乃兵家常事，少侠请重新来过。"}
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-3 bg-ink-900 text-paper-100 font-serif text-lg rounded hover:bg-ink-700 transition-colors shadow-lg"
                >
                  {UI_LABELS.restart}
                </button>
                <button
                  onClick={handleExitGame}
                  className="px-8 py-3 border-2 border-ink-500 text-ink-600 font-serif text-lg rounded hover:bg-ink-100 transition-colors shadow-lg"
                >
                  返回目录
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
