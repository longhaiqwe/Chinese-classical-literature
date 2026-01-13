import { useState } from 'react';
import StoryGenerator from './components/StoryGenerator';
import StoryReview from './components/StoryReview';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedStory, setGeneratedStory] = useState<any[] | null>(null);

  const handleStoryGenerated = (story: any[]) => {
    setGeneratedStory(story);
    // Move to next step (Review) - implementation of Step 2 will follow
    setCurrentStep(2);
    console.log('Story generated:', story);
  };

  return (
    <div className="min-h-screen bg-paper-50 font-serif p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-calligraphy text-accent-red mb-2">
          中国古典文学故事生成工具
        </h1>
        <p className="text-ink-500">自动化内容生产流水线</p>
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
                // TODO: Prepare for Step 3 (Sync DB)
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto text-center p-12 bg-paper-100 rounded ink-border">
              <h2 className="text-2xl font-bold mb-4">第三步：同步到数据库</h2>
              <p className="text-ink-500">即将实现...</p>
              <button onClick={() => setCurrentStep(2)} className="mt-4 px-4 py-2 border border-ink-500 rounded">
                返回审阅
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
