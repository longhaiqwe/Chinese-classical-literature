
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Note: In a real app, these should be in a separate config or context
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Scene {
    scene_index: number;
    narrative: string;
    environment_description: string;
}

interface AudioGeneratorProps {
    storyId: string;
    story: any[]; // The full story object
    onBack: () => void;
    onNext: () => void;
}

interface AudioStatus {
    status: 'missing' | 'pending' | 'success' | 'failed';
    audio_url?: string;
    episode_id?: string;
    error?: string;
}

export default function AudioGenerator({ storyId, story, onBack, onNext }: AudioGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [audioStatuses, setAudioStatuses] = useState<Record<number, AudioStatus>>({});

    // Flatten scenes from the story structure if needed, or just map them
    // Assuming 'story' is an array of scenes based on previous steps
    // But checking typical structure, it might be a nested object or array.
    // Based on PRD Step 1 output: "representative complete story tree JSON object"
    // Let's assume passed 'story' prop IS the array of scenes or contain them.
    // Actually, looking at App.tsx: `generatedStory` is `any[]`.
    // Let's safe guard.
    const scenes: Scene[] = Array.isArray(story) ? story : [];

    useEffect(() => {
        fetchExistingNarrations();
    }, [storyId]);

    const fetchExistingNarrations = async () => {
        if (!storyId) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('scene_narrations')
                .select('*')
                .eq('story_id', storyId);

            if (error) throw error;

            const statuses: Record<number, AudioStatus> = {};
            data?.forEach((record) => {
                statuses[record.scene_index] = {
                    status: record.status as any,
                    audio_url: record.audio_url,
                    episode_id: record.episode_id
                };
            });
            setAudioStatuses(statuses);
        } catch (err) {
            console.error('Error fetching narrations:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateAudio = async (sceneIndex: number, text: string) => {
        // Optimistic update
        setAudioStatuses(prev => ({
            ...prev,
            [sceneIndex]: { status: 'pending' }
        }));

        try {
            // const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/request-narration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    story_id: storyId,
                    scene_index: sceneIndex,
                    text: text
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to request narration');
            }

            setAudioStatuses(prev => ({
                ...prev,
                [sceneIndex]: {
                    status: result.status,
                    episode_id: result.episode_id,
                    audio_url: result.audio_url
                }
            }));

            // Start polling if pending
            if (result.status === 'pending') {
                pollStatus(sceneIndex);
            }

        } catch (err: any) {
            console.error('Generaton error:', err);
            setAudioStatuses(prev => ({
                ...prev,
                [sceneIndex]: { status: 'failed', error: err.message }
            }));
        }
    };

    const pollStatus = async (sceneIndex: number) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-narration-status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        story_id: storyId,
                        scene_index: sceneIndex
                    })
                });

                const result = await response.json();

                if (result.status === 'success' || result.status === 'failed') {
                    clearInterval(interval);
                    setAudioStatuses(prev => ({
                        ...prev,
                        [sceneIndex]: {
                            status: result.status,
                            audio_url: result.audio_url,
                            error: result.message
                        }
                    }));
                }
            } catch (err) {
                console.error('Polling error:', err);
                // Don't clear interval immediately on transient network error, but maybe after max retries
            }
        }, 3000); // Poll every 3 seconds
    };

    const [batchStatus, setBatchStatus] = useState<{ current: number; total: number; waiting: boolean } | null>(null);

    const generateAllAudio = async () => {
        // Filter scenes that need generation (not success or pending)
        const scenesToGenerate = scenes.filter((scene) => {
            const sIndex = (scene as any).scene_index ?? scenes.indexOf(scene);
            const status = audioStatuses[sIndex];
            return !status || (status.status !== 'success' && status.status !== 'pending' && status.status !== 'failed');
            // Note: Retrying failed ones automatically might be aggressive if failure is persistent,
            // but for rate limits, we might want to retry. Let's stick to "not success/pending" for now.
            // Actually, if previous attempt failed, we probably want to retry.
        });

        if (scenesToGenerate.length === 0) {
            alert('所有场景音频已生成或正在生成中');
            return;
        }

        if (!confirm(`确定要为 ${scenesToGenerate.length} 个场景生成音频吗？\n注意：由于 API 限制（每分钟 3 次），这将需要约 ${Math.ceil(scenesToGenerate.length / 3) * 60} 秒。`)) {
            return;
        }

        const BATCH_SIZE = 3;
        const DELAY_MS = 62000; // 62 seconds to be safe (Limit is 60s)

        setBatchStatus({ current: 0, total: scenesToGenerate.length, waiting: false });

        for (let i = 0; i < scenesToGenerate.length; i++) {
            const scene = scenesToGenerate[i];
            const sIndex = (scene as any).scene_index ?? scenes.indexOf(scene);

            // Rate limiting check
            // We can send 3 requests immediately, then must wait.
            // i=0,1,2 -> send. i=3 -> wait.
            if (i > 0 && i % BATCH_SIZE === 0) {
                setBatchStatus({ current: i, total: scenesToGenerate.length, waiting: true });
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                setBatchStatus({ current: i, total: scenesToGenerate.length, waiting: false });
            }

            setBatchStatus({ current: i + 1, total: scenesToGenerate.length, waiting: false });
            await generateAudio(sIndex, scene.narrative);
            // Small stagger to avoid hitting burst limit too hard if any
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setBatchStatus(null);
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-[#FDFBF7] min-h-[600px] font-serif">
            <div className="flex justify-between items-center mb-10 border-b-2 border-accent-red/20 pb-6">
                <div>
                    <h2 className="text-3xl font-calligraphy text-ink-900 mb-2">第四步：音频生成</h2>
                    <p className="text-ink-500 text-sm">为每个场景赋予声音</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={generateAllAudio}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent-red text-white rounded-lg hover:bg-red-800 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !!batchStatus}
                    >
                        <span className="text-lg">▶</span>
                        {batchStatus ? `生成中 (${batchStatus.current}/${batchStatus.total})` : '一键生成所有'}
                    </button>
                    <div className="h-10 w-px bg-ink-200 mx-2"></div>
                    <button
                        onClick={onBack}
                        className="px-5 py-2.5 bg-paper-100 border border-ink-200 text-ink-600 rounded-lg hover:bg-paper-200 hover:border-ink-300 transition-all"
                    >
                        返回修改
                    </button>
                    <button
                        onClick={onNext}
                        className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-all shadow-md flex items-center gap-2"
                    >
                        下一步：生成提示词
                        <span>→</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-16 bg-white/50 rounded-xl mb-8">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-accent-red border-t-transparent"></div>
                    <p className="mt-4 text-ink-600 font-medium">正在处理音频请求...</p>
                </div>
            )}

            {batchStatus && batchStatus.waiting && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-center gap-3 text-amber-800">
                    <div className="animate-pulse">⏳</div>
                    <div>
                        <p className="font-bold">正在等待 API 限流...</p>
                        <p className="text-sm opacity-80">每分钟仅允许 3 次请求（ListenHub 限制）。系统将自动在 60 秒后继续。</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {scenes.map((scene, index) => {
                    const sIndex = (scene as any).scene_index ?? index;
                    const status = audioStatuses[sIndex] || { status: 'missing' };
                    const isSuccess = status.status === 'success';

                    return (
                        <div
                            key={index}
                            className={`
                        relative bg-white p-6 rounded-xl border transition-all duration-300
                        ${isSuccess ? 'border-emerald-200 shadow-sm' : 'border-ink-100 shadow-md hover:shadow-lg'}
                    `}
                        >
                            <div className="absolute top-6 left-0 w-1 h-12 bg-accent-red rounded-r"></div>

                            <div className="flex gap-8 items-start pl-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl font-calligraphy text-ink-400">
                                            #{sIndex}
                                        </span>
                                        {isSuccess && (
                                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs border border-emerald-100 flex items-center gap-1">
                                                ✓ 已生成
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-lg text-ink-800 leading-8 font-medium tracking-wide">
                                        {scene.narrative}
                                    </p>

                                    {/* Audio Player if Success */}
                                    {isSuccess && status.audio_url && (
                                        <div className="mt-4 bg-paper-50 p-2 rounded-lg border border-ink-50">
                                            <audio controls className="w-full h-8 opacity-90 custom-audio-player">
                                                <source src={status.audio_url} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {status.status === 'failed' && (
                                        <div className="mt-4 flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                                            <span>⚠</span>
                                            生成失败: {status.error || '未知错误'}
                                            <button
                                                onClick={() => generateAudio(sIndex, scene.narrative)}
                                                className="ml-auto underline hover:text-red-900"
                                            >
                                                重试
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-start min-w-[120px] pt-2">
                                    {status.status === 'success' ? (
                                        <button
                                            onClick={() => generateAudio(sIndex, scene.narrative)}
                                            className="text-xs text-ink-300 hover:text-accent-red transition-colors flex items-center justify-end gap-1 mt-2"
                                        >
                                            <span>↻</span> 重新生成
                                        </button>
                                    ) : status.status === 'pending' ? (
                                        <div className="flex flex-col items-end text-right">
                                            <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin mb-2"></div>
                                            <span className="text-xs text-ink-400">正在生成...</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => generateAudio(sIndex, scene.narrative)}
                                            className="group flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-ink-200 rounded-lg hover:border-accent-red hover:bg-red-50/50 transition-all"
                                        >
                                            <span className="text-2xl text-ink-300 group-hover:text-accent-red mb-1">🎙</span>
                                            <span className="text-sm text-ink-500 group-hover:text-accent-red font-medium">生成音频</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
