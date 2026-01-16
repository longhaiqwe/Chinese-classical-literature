import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DatabaseSyncProps {
    story: any[];
    title: string;
    initialStoryId?: string;
    initialCategoryId?: string;
    initialDescription?: string;
    initialEndingTitle?: string;
    initialEndingDescription?: string;
    onSyncComplete: (storyId: string) => void;
    onBack: () => void;
}

export default function DatabaseSync({
    story,
    title,
    initialStoryId,
    initialCategoryId,
    initialDescription,
    initialEndingTitle,
    initialEndingDescription,
    onSyncComplete,
    onBack
}: DatabaseSyncProps) {
    const [syncing, setSyncing] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [customStoryId, setCustomStoryId] = useState(initialStoryId || '');
    const [categoryId, setCategoryId] = useState(initialCategoryId || '');
    const [description, setDescription] = useState(initialDescription || `Created on ${new Date().toLocaleDateString()}`);
    const [endingTitle, setEndingTitle] = useState(initialEndingTitle || '通关成功');
    const [endingDescription, setEndingDescription] = useState(initialEndingDescription || '恭喜你完成了这段历史的演绎。');

    // Simple effect to pre-fill ID if empty (mocking pinyin or just manual)
    useEffect(() => {
        // Just a helper to clear it if title changes, or keep it.
        // Let's just default to empty and let user type, or provide a "Generate" button?
        // User asked for "huoshaochibi", so they know what they want.
        // Let's just default to a sanitized version of title if English, or empty if Chinese.
    }, [title]);

    const handleSync = async () => {
        setSyncing(true);
        setStatus('正在创建故事记录...');
        setError(null);

        try {
            if (!customStoryId.trim()) {
                throw new Error('请输入故事 ID (ID cannot be empty)');
            }
            if (!categoryId.trim()) {
                throw new Error('请输入分类 ID (Category ID cannot be empty)');
            }

            // 1. Use provided Story ID
            const storyId = customStoryId.trim();

            // 2. Insert/Upsert Story
            const { error: storyError } = await supabase.from('stories').upsert({
                id: storyId,
                title: title,
                description: description,
                category_id: categoryId.trim(),
                ending_title: endingTitle,
                ending_description: endingDescription,
                created_at: new Date().toISOString() // Update timestamp
            });

            if (storyError) throw storyError;

            // 3. Upsert Scenes & Refresh Options
            for (let i = 0; i < story.length; i++) {
                const scene = story[i];
                setStatus(`正在同步场景 ${i + 1}/${story.length}: ${scene.title}`);

                // Upsert Scene (Handle collisions via story_id + scene_index)
                const { data: sceneData, error: sceneError } = await supabase
                    .from('scenes')
                    .upsert({
                        story_id: storyId,
                        title: scene.title,
                        narrative: scene.narrative,
                        scene_index: i + 1,
                        character_state: "",
                        environment_description: "",
                    }, { onConflict: 'story_id, scene_index' })
                    .select()
                    .single();

                if (sceneError) {
                    console.error(`Failed to upsert scene ${i + 1}:`, sceneError);
                    throw sceneError;
                }
                if (!sceneData) throw new Error(`Failed to upsert scene: ${scene.title}`);

                // Clear old options for this specific scene (since we just upserted/confirmed it exists)
                const { error: clearOptionsError } = await supabase
                    .from('scene_options')
                    .delete()
                    .eq('scene_id', sceneData.id);

                if (clearOptionsError) {
                    console.warn(`Warning clearing options for scene ${sceneData.id}:`, clearOptionsError);
                }

                // 4. Insert Options
                if (scene.choices && scene.choices.length > 0) {
                    const optionsToInsert = scene.choices.map((choice: any) => ({
                        scene_id: sceneData.id,
                        text: choice.text,
                        is_correct: choice.is_correct,
                        feedback: choice.feedback, // Map feedback directly
                    }));

                    const { error: optionsError } = await supabase
                        .from('scene_options')
                        .insert(optionsToInsert);

                    if (optionsError) throw optionsError;
                }
            }

            setStatus('同步完成！');
            onSyncComplete(storyId);

        } catch (err: any) {
            console.error('Sync failed:', err);
            setError(err.message || '数据库同步失败');
            setSyncing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 bg-paper-100 rounded-lg ink-border shadow-lg">
            <h2 className="text-xl md:text-2xl font-serif text-ink-900 mb-6 text-center border-b-2 border-accent-brown pb-4">
                第三步：同步到数据库
            </h2>

            <div className="space-y-6">
                <div className="bg-paper-50 p-6 rounded border border-ink-200">
                    <h3 className="font-bold text-lg mb-2 text-ink-800">即将同步的内容：</h3>
                    <ul className="list-disc list-inside text-ink-600 space-y-2">
                        <li>故事标题：<span className="font-medium text-ink-900">{title}</span></li>
                        <li>场景数量：<span className="font-medium text-ink-900">{story.length} 个</span></li>
                        <li>目标状态：<span className="font-medium text-ink-900">不可玩 (草稿)</span></li>
                    </ul>
                </div>

                {/* Manual ID Inputs */}
                <div className="bg-white p-4 md:p-6 rounded border border-ink-200 space-y-4">
                    <h3 className="font-bold text-lg text-ink-800">数据库配置</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1">
                                Story ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={customStoryId}
                                onChange={(e) => setCustomStoryId(e.target.value)}
                                placeholder="例如: huoshaochibi"
                                className="w-full p-2 border border-ink-300 rounded focus:border-accent-red focus:outline-none"
                                disabled={syncing}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1">
                                Category ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                placeholder="例如: sanguoyanyi"
                                className="w-full p-2 border border-ink-300 rounded focus:border-accent-red focus:outline-none"
                                disabled={syncing}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-ink-700 mb-1">
                            故事简介
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="请输入故事简介..."
                            className="w-full p-2 border border-ink-300 rounded focus:border-accent-red focus:outline-none h-20"
                            disabled={syncing}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1">
                                结局标题
                            </label>
                            <input
                                type="text"
                                value={endingTitle}
                                onChange={(e) => setEndingTitle(e.target.value)}
                                placeholder="例如: 义薄云天"
                                className="w-full p-2 border border-ink-300 rounded focus:border-accent-red focus:outline-none"
                                disabled={syncing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-ink-700 mb-1">
                                结局描述 (Ending Desc)
                            </label>
                            <textarea
                                value={endingDescription}
                                onChange={(e) => setEndingDescription(e.target.value)}
                                placeholder="例如: 刘备三顾茅庐，终得卧龙出山。此后君臣相知，如鱼得水，共创蜀汉基业。"
                                className="w-full p-2 border border-ink-300 rounded focus:border-accent-red focus:outline-none h-24"
                                disabled={syncing}
                            />
                        </div>
                    </div>

                </div>

                {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p className="font-bold">出错啦：</p>
                        <p>{error}</p>
                    </div>
                )}

                {status && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-3">
                        {syncing && (
                            <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                        )}
                        <p>{status}</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <button
                        onClick={onBack}
                        disabled={syncing}
                        className="flex-1 py-3 px-6 border-2 border-ink-500 rounded font-bold text-ink-600 hover:bg-ink-100 transition-colors disabled:opacity-50"
                    >
                        返回修改
                    </button>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex-1 py-3 px-6 bg-emerald-700 text-paper-50 rounded font-bold hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {syncing ? '同步中...' : '开始同步'}
                    </button>
                </div>
            </div>
        </div>
    );
}
