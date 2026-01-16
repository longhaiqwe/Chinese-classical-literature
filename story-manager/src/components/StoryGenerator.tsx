import { useState } from 'react';
import { generateContent, GENERATE_STORY_PROMPT } from '../lib/gemini';

// Define the Scene type based on our JSON schema
interface Choice {
    text: string;
    next_scene_id: string | null;
    is_correct: boolean;
    feedback: string;
}

interface Scene {
    id: string;
    title: string;
    narrative: string;
    choices: Choice[];
}

interface StoryGeneratorProps {
    onStoryGenerated: (story: Scene[], topic: string, metadata?: {
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
            const prompt = GENERATE_STORY_PROMPT(topic);
            const output = await generateContent(prompt);

            console.log('Gemini Output:', output);

            if (!output) {
                throw new Error('No output from Gemini');
            }

            // Parse JSON from the response
            // The response might contain markdown code blocks (```json ... ```), we need to clean it
            let jsonStr = output.trim();
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/^```(json)?|```$/g, '');
            }

            const result = JSON.parse(jsonStr);

            // Check if result is the new object format or fallback (though schema enforces object now)
            let storyData: Scene[] = [];
            let metadata = { id: '', categoryId: '', description: '', endingTitle: '', endingDescription: '' };

            if (Array.isArray(result)) {
                storyData = result;
            } else if (result.scenes) {
                storyData = result.scenes;
                metadata = {
                    id: result.id || '',
                    categoryId: result.category_id || '',
                    description: result.description || '',
                    endingTitle: result.ending_title || '',
                    endingDescription: result.ending_description || ''
                };
            } else {
                throw new Error('Invalid JSON format');
            }

            // Post-process to ensure clean titles (Frontend adds "Chapter X" based on index)
            storyData = storyData.map((scene) => {

                // Remove any likely existing prefix (Chinese or English, 0-based or 1-based)
                let cleanTitle = scene.title
                    .replace(/^第\s*\d+\s*章/, '')
                    .replace(/^Chapter\s*\d+/i, '')
                    .replace(/^\d+\./, '') // Handles "1. Title"
                    .trim();

                // Cleanup separators like "·", ".", ":"
                if (/^[·.:]/.test(cleanTitle)) {
                    cleanTitle = cleanTitle.substring(1).trim();
                }

                return {
                    ...scene,
                    title: cleanTitle
                };
            });

            onStoryGenerated(storyData, topic, metadata);
        } catch (err: any) {
            console.error('Generation failed:', err);
            setError(err.message || '生成故事失败');
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
