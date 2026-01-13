import { useState, useEffect } from 'react';
import { generateImagePrompts } from '../lib/gemini';

interface PromptData {
    scene_id: string;
    prompt_en: string;
    prompt_cn: string;
}

interface ImagePromptGeneratorProps {
    story: any[];
    onBack: () => void;
    onNext: () => void;
    initialPrompts?: PromptData[];
    onPromptsChange?: (prompts: PromptData[]) => void;
}

export default function ImagePromptGenerator({ story, onBack, onNext, initialPrompts, onPromptsChange }: ImagePromptGeneratorProps) {
    const [prompts, setPrompts] = useState<PromptData[]>(initialPrompts || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync prompts to parent whenever they change
    useEffect(() => {
        if (onPromptsChange) {
            onPromptsChange(prompts);
        }
    }, [prompts, onPromptsChange]);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const rawResponse = await generateImagePrompts(story);
            // Clean up markdown code blocks if present
            const cleanJson = rawResponse.replace(/```json\n?|\n?```/g, '').trim();
            const parsedPrompts = JSON.parse(cleanJson);

            if (!Array.isArray(parsedPrompts)) {
                throw new Error("Invalid response format: expected an array");
            }

            setPrompts(parsedPrompts);
        } catch (err) {
            console.error("Failed to generate prompts:", err);
            setError("Failed to generate prompts. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePromptChange = (index: number, field: 'prompt_en' | 'prompt_cn', value: string) => {
        const newPrompts = [...prompts];
        newPrompts[index] = { ...newPrompts[index], [field]: value };
        setPrompts(newPrompts);
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prompts, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "story_image_prompts.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Helper to find scene details
    const getSceneDetails = (sceneId: string) => {
        const scene = story.find(s => s.id === sceneId);
        return scene ? { title: scene.title, narrative: scene.narrative } : { title: 'Unknown Scene', narrative: '' };
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-calligraphy text-accent-red mb-6 text-center">生成图片提示词 (Prompt Generation)</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="flex justify-center mb-8 gap-4">
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-accent-red text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-serif"
                >
                    {loading ? '正在生成...' : prompts.length > 0 ? '重新生成' : '开始生成提示词'}
                </button>
            </div>

            {prompts.length > 0 && (
                <div className="space-y-8">
                    {prompts.map((item, index) => {
                        const scene = getSceneDetails(item.scene_id);
                        return (
                            <div key={item.scene_id} className="bg-white p-6 rounded-lg shadow-md border border-stone-200">
                                <div className="mb-4 bg-stone-50 p-3 rounded border border-stone-100">
                                    <h3 className="font-bold text-lg text-emerald-800 mb-1">{scene.title}</h3>
                                    <p className="text-stone-600 text-sm line-clamp-3">{scene.narrative}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1">English Prompt (Used for Generation)</label>
                                        <textarea
                                            value={item.prompt_en}
                                            onChange={(e) => handlePromptChange(index, 'prompt_en', e.target.value)}
                                            className="w-full h-32 p-2 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-accent-red focus:border-accent-red bg-stone-50 font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-500 mb-1">中文翻译 (仅供参考)</label>
                                        <textarea
                                            value={item.prompt_cn}
                                            onChange={(e) => handlePromptChange(index, 'prompt_cn', e.target.value)}
                                            className="w-full h-32 p-2 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-accent-red focus:border-accent-red"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-between items-center bg-paper-100 p-4 rounded-lg sticky bottom-0 border-t border-stone-200 shadow-lg">
                        <button
                            onClick={onBack}
                            className="px-6 py-2 border border-stone-400 rounded hover:bg-stone-100 text-stone-600"
                        >
                            返回
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDownload}
                                className="px-6 py-2 border border-emerald-600 text-emerald-700 rounded hover:bg-emerald-50 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                下载 JSON
                            </button>
                            <button
                                onClick={onNext}
                                className="px-6 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800 shadow-md"
                            >
                                下一步：生成图片
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {prompts.length === 0 && !loading && (
                <div className="text-center text-stone-500 py-12 border-2 border-dashed border-stone-300 rounded-lg">
                    点击上方按钮开始为 {story.length} 个场景生成提示词
                </div>
            )}
        </div>
    );
}
