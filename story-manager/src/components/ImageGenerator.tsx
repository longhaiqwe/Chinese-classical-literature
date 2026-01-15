import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ImageGeneratorProps {
    storyId: string;
    story: any[];
    prompts: any[];
    onBack: () => void;
    onFinish: () => void;
}

interface ImageStatus {
    status: 'missing' | 'pending' | 'success' | 'failed';
    image_url?: string;
    error?: string;
}

export default function ImageGenerator({ storyId, story, prompts, onBack, onFinish }: ImageGeneratorProps) {
    const [imageStatuses, setImageStatuses] = useState<Record<number, ImageStatus>>({});
    const [globalLoading, setGlobalLoading] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

    // Initial check for existing images
    useEffect(() => {
        fetchExistingImages();
    }, [storyId]);

    const fetchExistingImages = async () => {
        if (!storyId) return;
        try {
            // We can fetch from scenes table directly
            const { data, error } = await supabase
                .from('scenes')
                .select('scene_index, image_url')
                .eq('story_id', storyId);

            if (error) throw error;

            const statuses: Record<number, ImageStatus> = {};
            data?.forEach((scene) => {
                if (scene.image_url && scene.scene_index !== null) {
                    statuses[scene.scene_index] = {
                        status: 'success',
                        image_url: scene.image_url
                    };
                }
            });
            setImageStatuses(statuses);
        } catch (err) {
            console.error('Error fetching images:', err);
        }
    };

    const generateImage = async (sceneIndex: number, prompt: string) => {
        // Optimistic update
        setImageStatuses(prev => ({
            ...prev,
            [sceneIndex]: { status: 'pending' }
        }));

        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    story_id: storyId,
                    scene_index: sceneIndex,
                    prompt: prompt
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate image');
            }

            setImageStatuses(prev => ({
                ...prev,
                [sceneIndex]: {
                    status: 'success',
                    image_url: result.image_url
                }
            }));

        } catch (err: any) {
            console.error('Generation error:', err);
            setImageStatuses(prev => ({
                ...prev,
                [sceneIndex]: { status: 'failed', error: err.message }
            }));
        }
    };

    const generateAllImages = async () => {
        // Identify scenes needing generation
        const scenesToGenerate = story.map((_, index) => {
            const sIndex = index + 1; // 1-based index
            // In DatabaseSync, we inserted with i (0-based) but DB index is i+1.
            return { index: sIndex, prompt: prompts.find(p => p.scene_id === story[index].id)?.prompt_en };
        }).filter(item => {
            const status = imageStatuses[item.index];
            return !status || status.status !== 'success';
        });

        if (scenesToGenerate.length === 0) {
            alert('所有图片已生成');
            return;
        }

        if (!confirm(`确定为 ${scenesToGenerate.length} 个场景生成图片吗？`)) return;

        setGlobalLoading(true);
        setBatchProgress({ current: 0, total: scenesToGenerate.length });

        // Sequential execution to avoid overwhelming server/rate limits
        for (let i = 0; i < scenesToGenerate.length; i++) {
            const { index, prompt } = scenesToGenerate[i];
            if (prompt) {
                await generateImage(index, prompt);
            }
            setBatchProgress({ current: i + 1, total: scenesToGenerate.length });
        }

        setGlobalLoading(false);
        setBatchProgress(null);
    };

    // Check if all done
    const allDone = story.length > 0 && story.every((_, index) => imageStatuses[index]?.status === 'success');

    const handleFinish = async () => {
        try {
            setGlobalLoading(true);
            const { error } = await supabase
                .from('stories')
                .update({ is_ready: true })
                .eq('id', storyId);

            if (error) throw error;

            // Success
            onFinish();
        } catch (err) {
            console.error("Failed to publish story:", err);
            alert("发布失败，请重试");
        } finally {
            setGlobalLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 bg-[#FDFBF7] font-serif min-h-screen">
            <header className="mb-8 border-b-2 border-accent-red/10 pb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-calligraphy text-ink-900 mb-2">第六步：图片生成</h2>
                    <p className="text-ink-500">为故事注入视觉灵魂</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 border border-ink-300 rounded text-ink-600 hover:bg-ink-50"
                        disabled={globalLoading}
                    >
                        返回上一步
                    </button>
                    <button
                        onClick={generateAllImages}
                        disabled={globalLoading || allDone}
                        className="px-6 py-2 bg-accent-red text-white rounded hover:bg-red-700 disabled:opacity-50 shadow-md"
                    >
                        {globalLoading ? '批量生成中...' : '一键生成所有图片'}
                    </button>
                    <button
                        onClick={handleFinish}
                        disabled={globalLoading}
                        className="px-8 py-2 rounded font-bold shadow-md transition-all bg-emerald-700 text-white hover:bg-emerald-800 hover:scale-105 disabled:opacity-50"
                    >
                        发布故事 (Finish)
                    </button>
                </div>
            </header>

            {batchProgress && (
                <div className="mb-8 bg-paper-100 p-4 rounded-lg border border-accent-red/20 flex items-center justify-center gap-4">
                    <div className="animate-spin h-6 w-6 border-2 border-accent-red border-t-transparent rounded-full"></div>
                    <span className="text-accent-red font-bold">
                        正在批量生成: {batchProgress.current} / {batchProgress.total}
                    </span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {story.map((scene, index) => {
                    const sceneIndex = index + 1;
                    const status = imageStatuses[sceneIndex] || { status: 'missing' };
                    const promptData = prompts.find(p => p.scene_id === scene.id);
                    const prompt = promptData?.prompt_en || "No prompt available";

                    return (
                        <div key={scene.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-ink-100 overflow-hidden flex flex-col">
                            {/* Image Area */}
                            <div className="aspect-video bg-stone-100 relative group">
                                {status.status === 'success' && status.image_url ? (
                                    <img
                                        src={status.image_url}
                                        alt={`Scene ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                                        {status.status === 'pending' ? (
                                            <>
                                                <div className="animate-spin h-8 w-8 border-2 border-accent-red border-t-transparent rounded-full mb-2"></div>
                                                <span className="text-sm">正在绘制...</span>
                                            </>
                                        ) : status.status === 'failed' ? (
                                            <div className="text-red-400">
                                                <span className="block text-2xl mb-1">⚠</span>
                                                <span className="text-xs">{status.error || '生成失败'}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-3xl mb-2 opacity-20">🖼</span>
                                                <span className="text-xs">暂无图片</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => generateImage(sceneIndex, prompt)}
                                        disabled={globalLoading}
                                        className="bg-white text-ink-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-accent-red hover:text-white transition-colors"
                                    >
                                        {status.status === 'success' ? '重新生成' : '生成图片'}
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-ink-800 text-lg truncate pr-2">#{index + 1} {scene.title}</h3>
                                    {status.status === 'success' && (
                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">已完成</span>
                                    )}
                                </div>
                                <p className="text-sm text-ink-500 line-clamp-2 mb-4 h-10">
                                    {scene.narrative}
                                </p>

                                <div className="bg-stone-50 p-2 rounded border border-stone-100">
                                    <p className="text-[10px] text-stone-400 font-mono leading-tight line-clamp-3" title={prompt}>
                                        PROMPT: {prompt}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
