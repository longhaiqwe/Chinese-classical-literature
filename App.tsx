
import React, { useState, useEffect, useCallback } from 'react';
import { IGameScene, AppState, GenerationProgress } from './types';
import { getStaticGameStory, generateSceneImage } from './services/geminiService';
import { loadScenesFromDB, saveScenesToDB, loadProgressFromDB, saveProgressToDB, clearDB } from './services/db';
import { loadScenesFromCloud, saveScenesToCloud, isCloudConfigured } from './services/cloudDb';
import { APP_TITLE, APP_SUBTITLE, UI_LABELS } from './constants';
import LoadingScreen from './components/LoadingScreen';
import GameScene from './components/GameScene';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingKey, setIsCheckingKey] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [scenes, setScenes] = useState<IGameScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState<GenerationProgress>({ total: 0, current: 0, message: '' });
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const [dataSource, setDataSource] = useState<'none' | 'local' | 'cloud'>('none');
  const [isCloudReady, setIsCloudReady] = useState(false);

  // Check for API Key on mount and Load Data
  useEffect(() => {
    const initialize = async () => {
      setIsCheckingKey(true);
      await checkApiKey();
      setIsCheckingKey(false);
      
      setIsCloudReady(isCloudConfigured());
      await initData();
    };
    initialize();
  }, []);

  // Save progress to Local DB (for resume capability)
  useEffect(() => {
    if (appState === AppState.PLAYING) {
      saveProgressToDB(currentSceneIndex).catch(err => console.error("Failed to save progress", err));
    }
  }, [currentSceneIndex, appState]);

  const checkApiKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        setHasApiKey(true); 
      }
    } catch (e) {
      console.error("Error checking API key:", e);
      setHasApiKey(false);
    }
  };

  const initData = async () => {
    setIsDataLoading(true);
    try {
      // Logic:
      // 1. Look for cloud existence first.
      // 2. If not found, look for local existence.
      // 3. If neither exists, dataSource remains 'none' (Regenerate).

      let loadedScenes: IGameScene[] | null = null;
      let source: 'cloud' | 'local' | 'none' = 'none';

      // 1. Attempt Cloud Load
      if (isCloudConfigured()) {
        try {
          console.log("Checking Cloud storage...");
          const cloudScenes = await loadScenesFromCloud();
          if (cloudScenes && cloudScenes.length > 0) {
            loadedScenes = cloudScenes;
            source = 'cloud';
            // Sync cloud data to local immediately for offline backup
            console.log("Syncing Cloud data to Local...");
            await saveScenesToDB(cloudScenes); 
          }
        } catch (e) {
          console.warn("Cloud load failed or returned no data, proceeding to local check.", e);
        }
      }

      // 2. Fallback to Local Load if Cloud failed or empty
      if (!loadedScenes) {
        console.log("Checking Local storage...");
        loadedScenes = await loadScenesFromDB();
        if (loadedScenes && loadedScenes.length > 0) {
          source = 'local';
        }
      }
      
      const savedProgress = await loadProgressFromDB();

      if (loadedScenes && loadedScenes.length > 0) {
        setScenes(loadedScenes);
        setDataSource(source);
        console.log(`Data initialized from ${source}`);
        
        if (savedProgress >= 0 && savedProgress < loadedScenes.length) {
          setCurrentSceneIndex(savedProgress);
        }
      } else {
        console.log("No data found in Cloud or Local. Ready to generate.");
        setDataSource('none');
      }
    } catch (e) {
      console.warn("Failed to load data", e);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSelectKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio && win.aistudio.openSelectKey) {
        await win.aistudio.openSelectKey();
        await checkApiKey();
      }
    } catch (e) {
      console.error("Error selecting key:", e);
    }
  };

  const clearCacheAndRestart = async () => {
    if (window.confirm("确定要删除本地存档并重新绘制吗？(不会删除云端数据)")) {
      await clearDB();
      setDataSource('none');
      setScenes([]);
      setCurrentSceneIndex(0);
      setAppState(AppState.INITIAL);
      // Directly trigger start to regenerate
      startGameGeneration(true);
    }
  };

  // Initialization: Load Story and Generate Images
  const startGameGeneration = useCallback(async (forceRedraw = false) => {
    try {
      // 1. If we have data and not forcing redraw, just play
      if (!forceRedraw && scenes.length > 0) {
         setAppState(AppState.PLAYING);
         return;
      }

      // 2. Load Static Story Structure
      const staticScenes = getStaticGameStory();
      setScenes(staticScenes);
      setErrorMsg('');
      setCurrentSceneIndex(0);

      // 3. Generate Images
      setAppState(AppState.GENERATING_IMAGES);
      const scenesWithImages = [...staticScenes];
      const totalImages = staticScenes.length;
      
      for (let i = 0; i < totalImages; i++) {
        setProgress({
          total: totalImages,
          current: i + 1,
          message: `绘制: ${staticScenes[i].title}`
        });
        
        const imageUrl = await generateSceneImage(staticScenes[i].imagePrompt);
        scenesWithImages[i] = { ...scenesWithImages[i], imageUrl };
      }

      // 4. Save to IndexedDB (Local) FIRST
      try {
        setProgress({
          total: totalImages,
          current: totalImages,
          message: "正在保存至本地 (Saving to Local)..."
        });
        await saveScenesToDB(scenesWithImages);
        await saveProgressToDB(0);
        setDataSource('local');
        console.log("Saved to Local DB");
      } catch (e) {
        console.error("Local DB Save failed", e);
      }

      // 5. Save to Cloud Firestore (If configured) SECOND
      if (isCloudConfigured()) {
        try {
           setProgress({ total: totalImages, current: totalImages, message: "正在同步至云端 (Syncing to Cloud)..." });
           // Wait a brief moment to let UI render the message
           await new Promise(r => setTimeout(r, 200));
           
           await saveScenesToCloud(scenesWithImages);
           setDataSource('cloud');
           console.log("Synced to Cloud");
        } catch (e) {
          console.error("Cloud Save failed", e);
          // Don't block gameplay if cloud save fails, but log it
        }
      }

      setScenes(scenesWithImages);
      setAppState(AppState.PLAYING);
      setCurrentSceneIndex(0);

    } catch (err: any) {
      console.error(err);
      
      if (err.message && (err.message.includes("403") || err.message.includes("Requested entity was not found"))) {
         setHasApiKey(false); 
         setAppState(AppState.INITIAL);
         setErrorMsg("API Key invalid or permission denied. Please select a valid key.");
         return;
      }

      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Failed to generate game content.");
    }
  }, [scenes.length]);

  const handleNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      window.scrollTo(0, 0);
    } else {
      setAppState(AppState.VICTORY);
      saveProgressToDB(0);
    }
  };

  const handleGameOver = () => {
    setAppState(AppState.GAME_OVER);
  };

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    saveProgressToDB(0);
    setAppState(AppState.PLAYING);
    window.scrollTo(0, 0);
  };

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  if (isCheckingKey || isDataLoading) {
    return (
      <div className="min-h-screen bg-paper-50 bg-paper-texture flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 border-4 border-ink-800 rounded-full flex items-center justify-center animate-spin-slow">
           <div className="w-10 h-10 border-t-2 border-r-2 border-accent-red rounded-full animate-spin"></div>
        </div>
        <div className="text-ink-500 font-serif animate-pulse">
          {isCheckingKey ? "验证身份中... (Verifying)" : "检查历史存档... (Checking Data)"}
        </div>
      </div>
    );
  }

  // Key Selection Gatekeeper (Only needed if we need to GENERATE)
  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-paper-50 bg-paper-texture text-ink-900 font-serif flex items-center justify-center p-4">
        <div className="max-w-md w-full border-4 border-double border-ink-800 bg-paper-100 p-8 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-red text-paper-50 px-4 py-1 font-calligraphy text-xl shadow-md border border-ink-900">
               通关文牒
            </div>
            <h2 className="text-3xl font-bold text-center mb-6 mt-4 font-calligraphy">身份验证</h2>
            <p className="text-justify mb-6 leading-relaxed text-ink-800">
              欲观此画卷（使用 Gemini 3 Pro 高清绘图），需出示有效的通关文牒（API Key）。
            </p>
            <div className="flex flex-col space-y-4">
               <button 
                 onClick={handleSelectKey}
                 className="w-full py-3 bg-ink-900 text-paper-50 font-bold hover:bg-accent-red transition-colors shadow-lg border-2 border-transparent hover:border-ink-900"
               >
                 选择密钥 (Select API Key)
               </button>
               <a 
                 href="https://ai.google.dev/gemini-api/docs/billing" 
                 target="_blank" 
                 rel="noreferrer"
                 className="text-center text-sm text-ink-500 hover:text-accent-brown underline"
               >
                 关于计费 (Billing Documentation)
               </a>
            </div>
            {errorMsg && (
              <p className="mt-4 text-center text-accent-red text-sm font-bold bg-red-50 p-2 border border-red-200">
                {errorMsg}
              </p>
            )}
        </div>
      </div>
    );
  }

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
                {/* Source Indicator Badge */}
                {dataSource !== 'none' && (
                  <div className={`absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 text-xs font-bold text-white rounded shadow ${dataSource === 'cloud' ? 'bg-blue-700' : 'bg-green-700'}`}>
                    {dataSource === 'cloud' ? '☁️ 云端数据 (Cloud Data)' : '💾 本地存档 (Local Save)'}
                  </div>
                )}

                <p className="text-xl leading-loose mb-6">
                  东汉末年，朝政腐败，天下大乱。涿郡之中，三位英雄即将际遇。
                  <br/>
                  这是一个由AI实时生成的交互式历史绘卷。
                </p>
                
                <div className="text-md text-ink-500 italic flex flex-col items-center justify-center gap-2">
                  {dataSource !== 'none' ? (
                     <>
                      <span>● 画卷已就绪，无需消耗生成额度</span>
                      {currentSceneIndex > 0 && <span className="text-accent-brown">| 进度: 第 {currentSceneIndex + 1} 章</span>}
                     </>
                  ) : (
                     <span>(尚未发现历史存档，需重新绘制)</span>
                  )}
                  
                  {!isCloudReady && (
                    <span className="text-xs text-red-400 mt-2 bg-red-50 px-2 py-1 rounded">
                      ⚠️ 未配置 Firebase，数据仅保存在本地浏览器
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => startGameGeneration(false)}
                  className="group relative px-12 py-4 bg-ink-900 text-paper-50 text-xl font-bold rounded shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 w-64"
                >
                  <div className="absolute inset-0 w-full h-full bg-accent-red translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="font-calligraphy text-2xl">
                      {dataSource !== 'none' ? '📖' : '🖌️'}
                    </span> 
                    {dataSource !== 'none' ? (currentSceneIndex > 0 ? UI_LABELS.continue_button : '开始阅览') : '生成画卷 (Generate)'}
                  </span>
                </button>

                {dataSource !== 'none' && (
                   <button
                   onClick={clearCacheAndRestart}
                   className="text-ink-500 hover:text-accent-red underline text-sm transition-colors opacity-60 hover:opacity-100"
                 >
                   {UI_LABELS.redraw}
                 </button>
                )}
              </div>
            </div>
          )}

          {appState === AppState.GENERATING_IMAGES && (
            <LoadingScreen 
              progress={progress} 
              mode='image'
            />
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
                <br/>
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

          {appState === AppState.GAME_OVER && (
            <div className="text-center animate-fade-in p-8 bg-paper-100 shadow-xl border-t-8 border-ink-500 max-w-xl">
              <h2 className="text-4xl font-calligraphy text-ink-500 mb-6">历史改写</h2>
              <p className="text-lg mb-8 text-ink-800">
                虽未成桃园之义，但江湖路远，或许别有一番际遇。
              </p>
              <button
                onClick={handleRestart}
                className="px-8 py-3 bg-ink-800 text-white rounded hover:bg-ink-900 transition-all"
              >
                {UI_LABELS.try_again}
              </button>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="text-center text-red-600 p-8 border border-red-200 bg-red-50 rounded">
              <h3 className="text-xl font-bold mb-2">生成失败</h3>
              <p>{errorMsg}</p>
              <button
                onClick={handleRestart}
                className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
              >
                {UI_LABELS.try_again}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
