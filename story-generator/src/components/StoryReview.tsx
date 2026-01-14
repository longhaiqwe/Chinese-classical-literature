
import { useState } from 'react';
import { refineStory } from '../lib/gemini';

// Reusing types from StoryGenerator (we should move these to a types file later)
interface Choice {
    text: string;
    next_scene_id: string | null;
    is_correct: boolean;
    failure_message: string | null;
}

interface Scene {
    id: string;
    title: string;
    narrative: string;
    choices: Choice[];
}

interface StoryReviewProps {
    story: Scene[];
    onBack: () => void;
    onConfirm: () => void;
}

export default function StoryReview({ story, onBack, onConfirm }: StoryReviewProps) {
    const [reviewedStory, setReviewedStory] = useState<Scene[]>(story);
    const [isRefining, setIsRefining] = useState(false);
    const [showRefineDialog, setShowRefineDialog] = useState(false);
    const [refineInstructions, setRefineInstructions] = useState('');

    const handleRefine = async () => {
        if (!refineInstructions.trim()) return;

        setIsRefining(true);
        try {
            const result = await refineStory(reviewedStory, refineInstructions);
            const refinedStory = JSON.parse(result);
            if (Array.isArray(refinedStory)) {
                setReviewedStory(refinedStory);
                setShowRefineDialog(false);
                setRefineInstructions('');
            } else {
                console.error("Refined story is not an array");
                // Optional: Add error handling/toast here
            }
        } catch (error) {
            console.error("Failed to refine story:", error);
            // Optional: Add error handling/toast here
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-ink-900">审阅故事内容</h2>
                <div className="space-x-4">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 border-2 border-ink-500 rounded hover:bg-paper-200 text-ink-800 font-bold transition-colors"
                    >
                        返回重成
                    </button>
                    <button
                        onClick={() => setShowRefineDialog(true)}
                        className="px-4 py-2 border-2 border-accent-brown rounded hover:bg-paper-200 text-accent-brown font-bold transition-colors"
                    >
                        优化故事
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-accent-red text-white rounded font-bold hover:bg-[#a63030] shadow-md transition-all"
                    >
                        确认并继续
                    </button>
                </div>
            </div>

            {reviewedStory.map((scene, index) => (
                <div key={scene.id} className="bg-paper-100 p-6 rounded-lg ink-border relative">
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent-brown text-paper-50 rounded-full flex items-center justify-center font-bold font-serif border-2 border-paper-50 shadow">
                        {index + 1}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border-b border-ink-500 pb-4 border-dashed">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-ink-500 uppercase mb-1">场景 ID</label>
                            <div className="font-mono text-sm bg-paper-50 p-2 rounded border border-ink-200 text-ink-600">
                                {scene.id}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-ink-500 uppercase mb-1">场景标题</label>
                            <div className="font-serif text-lg text-ink-900 font-bold">
                                {scene.title}
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-ink-500 uppercase mb-1">场景描述</label>
                        <div className="bg-paper-50 p-4 rounded border border-ink-200 text-ink-800 leading-relaxed font-serif whitespace-pre-wrap">
                            {scene.narrative}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-ink-500 uppercase mb-2">选项 (Choices)</label>
                        <div className="space-y-3">
                            {scene.choices.map((choice, cIndex) => (
                                <div
                                    key={cIndex}
                                    className={`p-3 rounded border flex items-start gap-3 ${choice.is_correct
                                        ? 'bg-emerald-50 border-emerald-200'
                                        : 'bg-rose-50 border-rose-200'
                                        }`}
                                >
                                    <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${choice.is_correct ? 'bg-emerald-600' : 'bg-rose-500'
                                        }`}>
                                        {choice.is_correct ? '✓' : '✕'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-ink-900 mb-1">{choice.text}</p>
                                        {choice.failure_message && (
                                            <p className={`text-sm italic ${choice.is_correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                {choice.is_correct ? '正向反馈' : '失败反馈'}: "{choice.failure_message}"
                                            </p>
                                        )}
                                        {choice.next_scene_id && (
                                            <p className="text-xs text-ink-500 mt-1 font-mono">
                                                跳转至 {`->`} {choice.next_scene_id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-end items-center gap-4 pt-4 border-t border-ink-200">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-ink-600 hover:text-ink-900 font-bold underline decoration-dotted underline-offset-4"
                >
                    返回生成页
                </button>
                <button
                    onClick={onConfirm}
                    className="px-8 py-3 bg-accent-red text-white rounded font-bold hover:bg-[#a63030] shadow-md transition-all text-lg"
                >
                    确认，下一步
                </button>
            </div>
            {showRefineDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-paper-100 p-6 rounded-lg w-full max-w-lg shadow-xl border-2 border-ink-900">
                        <h3 className="text-xl font-bold font-serif text-ink-900 mb-4">优化故事内容</h3>
                        <p className="text-sm text-ink-600 mb-4">
                            请输入您的修改意见（例如：让第一个场景的对话更幽默，或者让结局更悲惨）。
                        </p>
                        <textarea
                            value={refineInstructions}
                            onChange={(e) => setRefineInstructions(e.target.value)}
                            placeholder="请输入具体修改要求..."
                            className="w-full h-32 p-3 bg-paper-50 border border-ink-300 rounded mb-4 font-serif focus:ring-2 focus:ring-accent-brown focus:outline-none"
                            disabled={isRefining}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRefineDialog(false)}
                                className="px-4 py-2 text-ink-600 hover:bg-paper-200 rounded"
                                disabled={isRefining}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleRefine}
                                disabled={isRefining || !refineInstructions.trim()}
                                className="px-4 py-2 bg-accent-brown text-paper-50 rounded font-bold hover:bg-[#8c6b4a] disabled:opacity-50 flex items-center gap-2"
                            >
                                {isRefining ? (
                                    <>
                                        <span className="animate-spin">⏳</span> 正在优化...
                                    </>
                                ) : (
                                    '开始优化'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
