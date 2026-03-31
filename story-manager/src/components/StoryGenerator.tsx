import { useState } from 'react';
import { generateStory } from '../lib/gemini';
import type { StoryScene } from '../core/types.js';

interface StoryGeneratorProps {
    onStoryGenerated: (story: StoryScene[], topic: string, metadata?: {
        id: string;
        categoryId: string;
        description: string;
        endingTitle: string;
        endingDescription: string;
    }) => void;
}

export default function StoryGenerator({ onStoryGenerated }: StoryGeneratorProps) {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const storyDocument = await generateStory(topic);
            onStoryGenerated(storyDocument.scenes, topic, {
                id: storyDocument.id,
                categoryId: storyDocument.category_id,
                description: storyDocument.description,
                endingTitle: storyDocument.ending_title,
                endingDescription: storyDocument.ending_description,
            });
        } catch (err: unknown) {
            console.error('Generation failed:', err);
            setError(err instanceof Error ? err.message : '生成故事失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-6 bg-paper-100 rounded-lg ink-border">
            <h2 className="text-xl md:text-2xl font-serif text-ink-900 mb-6 border-b-2 border-accent-brown pb-2">
                第一步：生成故事结构
            </h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="topic" className="block text-ink-800 font-bold mb-2 text-base">
                        故事主题 / 标题
                    </label>
                    <input
                        id="topic"
                        type="text"
                        className="w-full p-3 bg-paper-50 border-2 border-ink-500 rounded focus:border-accent-red focus:outline-none transition-colors text-ink-900 text-base"
                        placeholder="例如：孔融让梨、草船借箭"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm md:text-base">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className={`w-full py-3 px-6 rounded font-bold text-paper-50 transition-all text-base md:text-lg ${loading || !topic.trim()
                        ? 'bg-ink-500 cursor-not-allowed'
                        : 'bg-accent-red hover:bg-[#a63030] shadow-md hover:shadow-lg active:scale-95'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            正在生成中...
                        </span>
                    ) : (
                        '开始生成故事'
                    )}
                </button>
            </div>

            <div className="mt-6 text-sm text-ink-500">
                <p>使用模型：<strong>Gemini 3 Pro</strong></p>
            </div>
        </div>
    );
}
