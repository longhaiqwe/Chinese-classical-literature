import { useState, useEffect } from 'react';
import StoryGenerator from './components/StoryGenerator';
import StoryReview from './components/StoryReview';
import DatabaseSync from './components/DatabaseSync';

// Keys for localStorage
const STORAGE_KEYS = {
  STEP: 'sg_current_step',
  STORY: 'sg_generated_story',
  TITLE: 'sg_story_title',
  ID: 'sg_story_id'
};

function App() {
  // Initialize state from localStorage if available
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEP);
    return saved ? parseInt(saved, 10) : 1;
  });

  const [generatedStory, setGeneratedStory] = useState<any[] | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORY);
    return saved ? JSON.parse(saved) : null;
  });

  const [storyTitle, setStoryTitle] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TITLE) || '';
  });

  const [storyId, setStoryId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ID) || null;
  });

  const [suggestedMeta, setSuggestedMeta] = useState<{ id: string, categoryId: string } | null>(null);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEP, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    if (generatedStory) {
      localStorage.setItem(STORAGE_KEYS.STORY, JSON.stringify(generatedStory));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STORY);
    }
  }, [generatedStory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TITLE, storyTitle);
  }, [storyTitle]);

  useEffect(() => {
    if (storyId) {
      localStorage.setItem(STORAGE_KEYS.ID, storyId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ID);
    }
  }, [storyId]);

  const handleClearCache = () => {
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.STORY);
    localStorage.removeItem(STORAGE_KEYS.TITLE);
    localStorage.removeItem(STORAGE_KEYS.ID);

    // Reset state defaults
    setCurrentStep(1);
    setGeneratedStory(null);
    setStoryTitle('');
    setStoryId(null);
    window.location.reload();
  };

  const handleStoryGenerated = (story: any[], topic: string, metadata?: { id: string, categoryId: string }) => {
    setGeneratedStory(story);
    setStoryTitle(topic);
    if (metadata) {
      setSuggestedMeta(metadata);
    }
    // Move to next step (Review) - implementation of Step 2 will follow
    setCurrentStep(2);
    console.log('Story generated:', story, metadata);
  };

  return (
    <div className="min-h-screen bg-paper-50 font-serif p-8">
      <header className="mb-12 text-center relative">
        <h1 className="text-4xl font-calligraphy text-accent-red mb-2">
          中国古典文学故事生成工具
        </h1>
        <p className="text-ink-500">自动化内容生产流水线</p>

        {/* Dev tool: Clear Cache */}
        <button
          onClick={handleClearCache}
          className="absolute top-0 right-0 text-xs text-ink-400 hover:text-red-500 underline"
        >
          清除缓存 (Reset)
        </button>
      </header>

      <main className="container mx-auto">
        {/* Stepper Navigation */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center min-w-[100px] ${step === currentStep
                ? 'text-accent-red font-bold'
                : step < currentStep
                  ? 'text-emerald-700'
                  : 'text-ink-500' // Changed from gray-400 to ink-500 (defined in theme) or use opacity
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${step === currentStep
                  ? 'border-accent-red bg-paper-50'
                  : step < currentStep
                    ? 'border-emerald-700 bg-emerald-100'
                    : 'border-ink-500 opacity-40'
                  }`}
              >
                {step}
              </div>
              <span className="text-sm px-2">
                {step === 1 && '生成故事'}
                {step === 2 && '审阅调整'}
                {step === 3 && '同步数据库'}
                {step === 4 && '生成音频'}
                {step === 5 && '生成提示词'}
                {step === 6 && '生成图片'}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-8">
          {currentStep === 1 && (
            <StoryGenerator onStoryGenerated={handleStoryGenerated} />
          )}

          {currentStep === 2 && generatedStory && (
            <StoryReview
              story={generatedStory}
              onBack={() => setCurrentStep(1)}
              onConfirm={() => {
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && generatedStory && (
            <DatabaseSync
              story={generatedStory}
              title={storyTitle}
              initialStoryId={suggestedMeta?.id}
              initialCategoryId={suggestedMeta?.categoryId}
              onBack={() => setCurrentStep(2)}
              onSyncComplete={(id) => {
                setStoryId(id);
                setCurrentStep(4); // Move to Audio Generation
              }}
            />
          )}

          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto text-center p-12 bg-paper-100 rounded ink-border">
              <h2 className="text-2xl font-bold mb-4">第四步：音频生成</h2>
              <p className="text-ink-500">Story ID: {storyId}</p>
              <p className="text-ink-500">Coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
