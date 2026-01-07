import { Capacitor } from '@capacitor/core';
import React, { useState, useEffect, useRef } from 'react';
import { STORAGE_KEYS } from './constants';
import { IGameScene, AppState, IGameCategory, IGameStory } from './types';
import { storyService } from './services/storyService';
import { loadProgressFromDB, saveProgressToDB } from './services/db';
import { APP_TITLE, UI_LABELS } from './constants';
import GameScene from './components/GameScene';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';
import LoadingScreen from './components/LoadingScreen';
import FeedbackModal from './components/FeedbackModal';
import FeedbackTassel from './components/FeedbackTassel';

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
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // --- URL State Management Helper ---
  const updateUrlParams = (categoryId: string | null, storyId: string | null, sceneIndex: number | string | null) => {
    const url = new URL(window.location.href);

    if (categoryId) url.searchParams.set('category', categoryId);
    else url.searchParams.delete('category');

    if (storyId) url.searchParams.set('story', storyId);
    else url.searchParams.delete('story');

    if (sceneIndex !== null) {
      url.searchParams.set('scene', sceneIndex.toString());
    } else {
      url.searchParams.delete('scene');
    }

    // Remove legacy state param if it exists, to keep URLs clean
    url.searchParams.delete('state');

    window.history.replaceState({}, '', url.toString());
  };

  // Initialize
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    loadCategories();
  }, []);

  // Deep Linking Handler (for Automation/Debugging/State Persistence)
  // This useEffect is now largely replaced by logic within loadCategories for initial load
  // but remains for handling specific 'scene' states after a story is loaded via deep link.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sceneParam = params.get('scene');

    if (selectedStory && scenes.length > 0) {
      // Handle special states via 'scene' param
      if (sceneParam === 'game_over') {
        setAppState(AppState.GAME_OVER);
        // Ensure scene is at end for data consistency if needed
        if (scenes) setCurrentSceneIndex(scenes.length - 1);
        return;
      }
      if (sceneParam === 'victory') {
        setAppState(AppState.VICTORY);
        return;
      }

      // Handle numeric scene index
      if (sceneParam) {
        const idx = parseInt(sceneParam, 10);
        if (!isNaN(idx) && idx >= 0 && idx < scenes.length) {
          setCurrentSceneIndex(idx);
        }
      }
    }
  }, [selectedStory, scenes]); // Depend on selectedStory and scenes to ensure they are loaded

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await storyService.getCategories();


      // Check for deep links
      const params = new URLSearchParams(window.location.search);
      const storyId = params.get('story');
      const catId = params.get('category');

      // Check for auto-resume (Last played story) - Only if NO deep link is present
      const lastPlayedStoryId = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED_STORY);

      setCategories(data); // Set categories first so they are available for selection logic

      if (storyId) {
        // Handle Story Deep Link (Prioritized)
        const flatStories = data.flatMap(c => c.stories);
        const targetStory = flatStories.find(s => s.id === storyId);
        if (targetStory) {
          console.log(`Deep linking to story: ${storyId}`);
          await handleSelectStory(targetStory); // This handles loading progress too
        }
      } else if (lastPlayedStoryId) {
        // Auto-resume logic if no story deep link
        const flatStories = data.flatMap(c => c.stories);
        const targetStory = flatStories.find(s => s.id === lastPlayedStoryId);
        if (targetStory) {
          // We found the story, let's go!
          await handleSelectStory(targetStory);
        }
      } else if (catId) {
        // Handle Category Deep Link (If no story selected)
        const targetCat = data.find(c => c.id === catId);
        if (targetCat) {
          console.log(`Deep linking to category: ${catId}`);
          setSelectedCategory(targetCat);
          setAppState(AppState.CATEGORY_VIEW);
        }
      }

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
    if (appState === AppState.PLAYING && selectedStory) {
      saveProgressToDB(selectedStory.id, currentSceneIndex).catch(err => console.error("Failed to save progress", err));
    }
  }, [currentSceneIndex, appState, selectedStory]);


  // --- Navigation Handlers ---

  const handleSelectCategory = (category: IGameCategory) => {
    setSelectedCategory(category);
    setAppState(AppState.CATEGORY_VIEW);
    updateUrlParams(category.id, null, null);
  };

  const handleBackToHome = () => {
    setAppState(AppState.HOME);
    setSelectedCategory(null);
    setSelectedStory(null);
    // User explicitly exited, so clear the auto-resume record
    localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED_STORY);
    updateUrlParams(null, null, null);
  };

  const handleSelectStory = async (story: IGameStory) => {
    try {
      setIsLoading(true);
      const allScenes = await storyService.getStoryDetails(story.id);

      // Remove the last scene (Bad Ending) to unify logic
      // Only slice if we have multiple scenes, assuming the last is always the Bad Ending placeholder
      const validScenes = allScenes.length > 1 ? allScenes.slice(0, -1) : allScenes;

      setSelectedStory(story);
      setScenes(validScenes);

      // Load saved progress
      const savedIndex = await loadProgressFromDB(story.id);


      // Auto-resume if within valid range
      const initialIndex = (savedIndex >= 0 && savedIndex < validScenes.length) ? savedIndex : 0;
      setCurrentSceneIndex(initialIndex);

      setAppState(AppState.PLAYING);

      // Save as last played story for auto-resume on next launch
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYED_STORY, story.id);

      const parentCat = categories.find(c => c.stories.some(s => s.id === story.id));
      updateUrlParams(parentCat?.id || null, story.id, initialIndex);

      return validScenes; // Return scenes for deep linking logic
    } catch (err) {
      console.error("Failed to load story details", err);
      // Ideally show a toast or alert
      alert("无法加载故事详情，请稍后再试。");
      return null;
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
    const nextIndex = currentSceneIndex + 1;

    // If we've completed all valid scenes, it's Victory
    if (nextIndex >= scenes.length) {
      handleVictory();
      return;
    }

    // Standard progression
    setCurrentSceneIndex(nextIndex);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, nextIndex);
    }
    window.scrollTo(0, 0);
  };

  const handleGameOver = () => {
    setAppState(AppState.GAME_OVER);
    // Use 'game_over' state in URL, but do NOT set index to a scene that doesn't exist in our filtered list
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, 'game_over');
    }
  };

  const handleVictory = () => {
    if (selectedStory) {
      // Clear progress on victory so they can start fresh next time
      saveProgressToDB(selectedStory.id, 0);
      // Also clear auto-resume since they finished it
      localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED_STORY);
    }
    setAppState(AppState.VICTORY);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, 'victory');
    }
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    if (selectedStory) {
      saveProgressToDB(selectedStory.id, 0);
    }
    setAppState(AppState.PLAYING);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, 0);
    }
    window.scrollTo(0, 0);
  };

  const handleRetry = () => {
    // Retry current chapter (keep same scene index)
    // No need to reset progress to 0, just set state back to PLAYING
    setAppState(AppState.PLAYING);
    if (selectedStory) {
      updateUrlParams(selectedCategory?.id || null, selectedStory.id, currentSceneIndex);
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

          {/* Feedback Button */}
          {/* Feedback Button - Only on Home */}
          {(appState === AppState.HOME && !isNative) && (
            // Web fallback or alternative if needed, but for now we use the Tassel for both if desired.
            // However, the user specifically asked for "App" design. Let's make it consistent.
            // Actually, the user's prompt implies the previous Web one was "Okay", but this Tassel is for "App".
            // To ensure consistent high-quality aesthetics, we will use the Tassel everywhere.
            <></>
          )}

          {appState === AppState.HOME && (
            <FeedbackTassel
              onClick={() => setIsFeedbackOpen(true)}
            />
          )}

          <h1 className="text-[42px] md:text-6xl font-calligraphy text-ink-900 mb-2 drop-shadow-sm tracking-widest cursor-pointer" onClick={handleBackToHome}>
            {APP_TITLE}
          </h1>

        </header>

        {/* Content Area */}
        <div className="flex-grow flex flex-col items-center justify-start w-full">

          {/* LOADING */}
          {isLoading && (
            <LoadingScreen mode="story" />
          )}

          {/* ERROR MESSAGE */}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="text-accent-red text-xl mb-4 font-bold">出错了</div>
              <p className="text-ink-600 mb-6">{error}</p>
              <button
                onClick={loadCategories}
                className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-700 transition-colors"
              >
                重试
              </button>
            </div>
          )}

          {/* HOME VIEW */}
          {!isLoading && !error && appState === AppState.HOME && (
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
                currentSceneIndex={currentSceneIndex}
                totalScenes={scenes.length}
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
                挑战失败
              </h2>

              <p className="text-lg md:text-xl mb-8 leading-relaxed whitespace-pre-line font-serif text-ink-800">
                胜败乃兵家常事，少侠请重新来过。
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

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default App;
