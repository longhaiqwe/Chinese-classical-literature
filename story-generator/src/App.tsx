import { useState, useEffect } from 'react';
import StoryGenerator from './components/StoryGenerator';
import StoryReview from './components/StoryReview';
import DatabaseSync from './components/DatabaseSync';
import AudioGenerator from './components/AudioGenerator';
import ImagePromptGenerator from './components/ImagePromptGenerator';
import ImageGenerator from './components/ImageGenerator';

// Keys for localStorage
const STORAGE_KEYS = {
  STEP: 'sg_current_step',
  STORY: 'sg_generated_story',
  TITLE: 'sg_story_title',
  ID: 'sg_story_id',
  PROMPTS: 'sg_image_prompts'
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

  // State for Step 5: Image Prompts
  const [imagePrompts, setImagePrompts] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    return saved ? JSON.parse(saved) : [];
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

  // Persist image prompts
  useEffect(() => {
    if (imagePrompts.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(imagePrompts));
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROMPTS);
    }
  }, [imagePrompts]);

  const handleClearCache = () => {
    localStorage.removeItem(STORAGE_KEYS.STEP);
    localStorage.removeItem(STORAGE_KEYS.STORY);
    localStorage.removeItem(STORAGE_KEYS.TITLE);
    localStorage.removeItem(STORAGE_KEYS.ID);
    localStorage.removeItem(STORAGE_KEYS.PROMPTS);

    // Reset state defaults
    setCurrentStep(1);
    setGeneratedStory(null);
    setStoryTitle('');
    setStoryId(null);
    setImagePrompts([]);
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

          {currentStep === 4 && generatedStory && storyId && (
            <AudioGenerator
              story={generatedStory}
              storyId={storyId}
              onBack={() => setCurrentStep(3)}
              onNext={() => setCurrentStep(5)}
            />
          )}

          {currentStep === 5 && generatedStory && (
            <ImagePromptGenerator
              story={generatedStory}
              initialPrompts={imagePrompts}
              onPromptsChange={setImagePrompts}
              onBack={() => setCurrentStep(4)}
              onNext={() => {
                // Save prompts before moving (although handled by state, ensure sync if needed)
                setCurrentStep(6);
              }}
            />
          )}

          {currentStep === 6 && generatedStory && storyId && (
            <ImageGenerator
              storyId={storyId}
              story={generatedStory}
              prompts={imagePrompts}
              onBack={() => setCurrentStep(5)}
              onFinish={() => {
                alert('恭喜！故事制作完成！(Story Published)');
                // In a real app, maybe navigate back to dashboard or show a preview link
                // For now, we just stay here or maybe reset?
                // Let's just confirm it's done.
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
