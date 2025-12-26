import React, { useState, useEffect } from 'react';
import { IGameScene, AppState, IGameCategory, IGameStory } from './types';
import { CATEGORIES } from './data/storyData';
import { loadProgressFromDB, saveProgressToDB } from './services/db';
import { APP_TITLE, APP_SUBTITLE, UI_LABELS } from './constants';
import GameScene from './components/GameScene';
import HomeView from './components/HomeView';
import CategoryView from './components/CategoryView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);

  // Navigation State
  const [selectedCategory, setSelectedCategory] = useState<IGameCategory | null>(null);
  const [selectedStory, setSelectedStory] = useState<IGameStory | null>(null);

  // Game Play State
  const [scenes, setScenes] = useState<IGameScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Initialize - No longer fetching "static story" blindly
  useEffect(() => {
    // Only load DB progress if we end up implementing per-story progress saving later.
    // For now, we start at HOME.
  }, []);

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
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setAppState(AppState.HOME);
  };

  const handleSelectStory = (story: IGameStory) => {
    setSelectedStory(story);
    setScenes(story.scenes);
    setCurrentSceneIndex(0);
    setAppState(AppState.PLAYING);
  };

  const handleBackToCategory = () => {
    setSelectedStory(null);
    setScenes([]);
    setAppState(AppState.CATEGORY_VIEW);
  };

  // --- Game Gameplay Handlers ---

  const handleNextScene = () => {
    // Valid text flow from Bad Ending (Index 6) is to restart
    if (currentSceneIndex === 6) {
      handleRestart();
      return;
    }

    // Victory Condition: If current scene is the last "Good" scene (ID 6, Index 5)
    if (currentSceneIndex === 5) {
      setAppState(AppState.VICTORY);
      // saveProgressToDB(0); // Optional: Reset progress on victory
      return;
    }

    // Standard progression
    const nextIndex = currentSceneIndex + 1;
    setCurrentSceneIndex(nextIndex);
    window.scrollTo(0, 0);
  };

  const handleGameOver = () => {
    // Navigate to Bad Ending Sceene (ID 7, Index 6)
    setCurrentSceneIndex(6);
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    saveProgressToDB(0);
    setAppState(AppState.PLAYING);
    window.scrollTo(0, 0);
  };

  const handleExitGame = () => {
    // Return to story selection
    handleBackToCategory();
  };

  return (
    <div className="min-h-screen bg-paper-50 bg-paper-texture text-ink-900 font-serif selection:bg-accent-red selection:text-white">
      {/* Decorative Border */}
      <div className="fixed top-0 left-0 w-full h-2 bg-ink-800 z-50"></div>
      <div className="fixed bottom-0 left-0 w-full h-2 bg-ink-800 z-50"></div>

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">

        {/* Header */}
        <header className="text-center mb-8 pt-4 animate-fade-in relative">
          {/* Optional: Home Button if not on Home */}
          {appState !== AppState.HOME && (
            <button
              onClick={handleBackToHome}
              className="absolute left-4 top-4 text-sm text-ink-500 hover:text-ink-900 font-sans hidden md:block"
            >
              首页
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
        <div className="flex-grow flex flex-col items-center justify-center w-full">

          {/* HOME VIEW */}
          {appState === AppState.HOME && (
            <HomeView
              categories={CATEGORIES}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {/* CATEGORY VIEW */}
          {appState === AppState.CATEGORY_VIEW && selectedCategory && (
            <CategoryView
              category={selectedCategory}
              onSelectStory={handleSelectStory}
              onBack={handleBackToHome}
            />
          )}

          {/* PLAYING VIEW */}
          {appState === AppState.PLAYING && scenes.length > 0 && (
            <div className="w-full">
              <div className="mb-4 text-center">
                <button onClick={handleExitGame} className="text-sm text-ink-400 hover:text-accent-red">结束闯关</button>
              </div>
              <GameScene
                key={currentSceneIndex}
                scene={scenes[currentSceneIndex]}
                onNext={handleNextScene}
                onGameOver={handleGameOver}
              />
            </div>
          )}

          {/* VICTORY VIEW */}
          {appState === AppState.VICTORY && (
            <div className="text-center animate-fade-in p-8 border-4 border-double border-accent-red bg-paper-100 shadow-2xl max-w-2xl">
              <h2 className="text-5xl font-calligraphy text-accent-red mb-6">义薄云天</h2>
              <p className="text-xl mb-8 leading-relaxed">
                三位英雄于桃园焚香结拜，誓同生死。一段波澜壮阔的三国史诗就此拉开序幕。
                <br />
                恭喜你完成了这段历史的演绎。
              </p>
              <div className="flex gap-4 justify-center">
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

        </div>
      </main>
    </div>
  );
};

export default App;
