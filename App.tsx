import React, { useState, useEffect } from 'react';
import { IGameScene, AppState } from './types';
import { getStaticGameStory } from './services/geminiService';
import { loadProgressFromDB, saveProgressToDB } from './services/db';
import { APP_TITLE, APP_SUBTITLE, UI_LABELS } from './constants';
import GameScene from './components/GameScene';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [scenes, setScenes] = useState<IGameScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // Initialize Game Data
  useEffect(() => {
    const initialize = async () => {
      // 1. Load Static Data
      const staticScenes = getStaticGameStory();
      setScenes(staticScenes);

      // 2. Load Saved Progress
      try {
        const savedProgress = await loadProgressFromDB();
        if (savedProgress >= 0 && savedProgress < staticScenes.length) {
          setCurrentSceneIndex(savedProgress);
        }
      } catch (e) {
        console.warn("Failed to load progress", e);
      }
    };
    initialize();
  }, []);

  // Save progress to Local DB
  useEffect(() => {
    if (appState === AppState.PLAYING) {
      saveProgressToDB(currentSceneIndex).catch(err => console.error("Failed to save progress", err));
    }
  }, [currentSceneIndex, appState]);

  const startGame = () => {
    setAppState(AppState.PLAYING);
  };

  const handleNextScene = () => {
    // Valid text flow from Bad Ending (Index 6) is to restart
    if (currentSceneIndex === 6) {
      handleRestart();
      return;
    }

    // Victory Condition: If current scene is the last "Good" scene (ID 6, Index 5)
    if (currentSceneIndex === 5) {
      setAppState(AppState.VICTORY);
      saveProgressToDB(0);
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

  return (
    <div className="min-h-screen bg-paper-50 bg-paper-texture text-ink-900 font-serif selection:bg-accent-red selection:text-white">
      {/* Decorative Border */}
      <div className="fixed top-0 left-0 w-full h-2 bg-ink-800 z-50"></div>
      <div className="fixed bottom-0 left-0 w-full h-2 bg-ink-800 z-50"></div>

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">

        {/* Header */}
        <header className="text-center mb-8 pt-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-calligraphy text-ink-900 mb-2 drop-shadow-sm tracking-widest">
            {APP_TITLE}
          </h1>
          <p className="text-lg text-accent-brown uppercase tracking-widest font-bold opacity-80 border-b border-ink-800/20 inline-block pb-1">
            {APP_SUBTITLE}
          </p>
        </header>

        {/* Content Area */}
        <div className="flex-grow flex flex-col items-center justify-center w-full">

          {appState === AppState.INITIAL && (
            <div className="text-center space-y-8 animate-fade-in max-w-2xl">
              <div className="p-8 border-y-4 border-double border-ink-800 bg-paper-100 shadow-xl relative">
                <p className="text-xl leading-loose mb-6">
                  东汉末年，朝政腐败，天下大乱。涿郡之中，三位英雄即将际遇。
                  <br />
                  这是一个由AI实时生成的交互式历史绘卷。
                </p>

                <div className="text-md text-ink-500 italic flex flex-col items-center justify-center gap-2">
                  {currentSceneIndex > 0 && <span className="text-accent-brown">| 进度: 第 {currentSceneIndex + 1} 章</span>}
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={startGame}
                  className="group relative px-12 py-4 bg-ink-900 text-paper-50 text-xl font-bold rounded shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 w-64"
                >
                  <div className="absolute inset-0 w-full h-full bg-accent-red translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="font-calligraphy text-2xl">📖</span>
                    {currentSceneIndex > 0 ? UI_LABELS.continue_button : '开始阅览'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {appState === AppState.PLAYING && scenes.length > 0 && (
            <GameScene
              key={currentSceneIndex}
              scene={scenes[currentSceneIndex]}
              onNext={handleNextScene}
              onGameOver={handleGameOver}
            />
          )}

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
              </div>
            </div>
          )}



        </div>
      </main>
    </div>
  );
};

export default App;
