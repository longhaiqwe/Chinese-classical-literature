
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Story {
    id: string;
    title: string;
    created_at: string | null;
    category_id: string | null;
}

interface StoryDeleterProps {
    onBack: () => void;
}

export default function StoryDeleter({ onBack }: StoryDeleterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [menuLoading, setMenuLoading] = useState(false);
    const [storyList, setStoryList] = useState<Story[]>([]);
    const [searched, setSearched] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<Story | null>(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('id, title, created_at, category_id')
                .ilike('title', `%${searchTerm.trim()}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStoryList(data || []);
        } catch (err: any) {
            console.error('Search error:', err);
            alert('搜索失败: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const cleanStorage = async (story: Story) => {
        // 1. Clean Images
        // Check both categorized path and root path for backward compatibility
        const categoryId = story.category_id || 'uncategorized';
        const possiblePaths = [
            `${categoryId}/${story.id}`, // Standard path: category/story_id
            `${story.id}`                // Root path (legacy or migrated): story_id
        ];

        for (const imagePath of possiblePaths) {
            const { data: imageFiles } = await supabase.storage
                .from('images')
                .list(imagePath);

            if (imageFiles && imageFiles.length > 0) {
                const pathsToRemove = imageFiles.map(f => `${imagePath}/${f.name}`);
                console.log(`Deleting images from ${imagePath}:`, pathsToRemove);
                await supabase.storage.from('images').remove(pathsToRemove);
            }
        }

        // 2. Clean Audios: we need to find them first based on pattern or existing narrations
        // Since we delete DB records later, we can query narrations now
        const { data: narrations } = await supabase
            .from('scene_narrations')
            .select('audio_url, scene_index')
            .eq('story_id', story.id);

        if (narrations && narrations.length > 0) {
            // Extract paths. 
            // URL format: .../storage/v1/object/public/narrations/{category_id}/{story_id}/{filename}

            const audioPaths = narrations.map(n => {
                if (!n.audio_url) return null;
                try {
                    const url = new URL(n.audio_url);
                    const path = url.pathname.split('/narrations/')[1];
                    return decodeURIComponent(path);
                } catch (e) {
                    // Fallback: Construct path manually if URL parsing fails
                    // Structure: category_id/story_id/story_id_scene_index.mp3
                    return `${categoryId}/${story.id}/${story.id}_${n.scene_index}.mp3`;
                }
            }).filter(p => p !== null) as string[];

            if (audioPaths.length > 0) {
                await supabase.storage.from('narrations').remove(audioPaths);
            }
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        setMenuLoading(true);
        try {
            // 1. Clean Storage (Best effort)
            try {
                await cleanStorage(deleteConfirm);
            } catch (e) {
                console.warn("Storage cleanup warning:", e);
            }

            const storyId = deleteConfirm.id;
            console.log('Starting deletion for storyId:', storyId);

            // 2. Clean DB - Dependent tables first

            // Get scenes
            const { data: scenes, error: scenesError } = await supabase
                .from('scenes')
                .select('id')
                .eq('story_id', storyId);

            if (scenesError) {
                console.error('Error fetching scenes:', scenesError);
                throw scenesError;
            }

            const sceneIds = scenes?.map(s => s.id) || [];
            console.log('Found scenes to delete:', sceneIds);

            if (sceneIds.length > 0) {
                const { error: optError, count: optCount } = await supabase
                    .from('scene_options')
                    .delete({ count: 'exact' })
                    .in('scene_id', sceneIds);

                if (optError) {
                    console.error('Error deleting scene_options:', optError);
                    throw optError;
                }
                console.log(`Deleted ${optCount} scene_options`);
            }

            const { error: narrError, count: narrCount } = await supabase
                .from('scene_narrations')
                .delete({ count: 'exact' })
                .eq('story_id', storyId);

            if (narrError) {
                console.error('Error deleting scene_narrations:', narrError);
                throw narrError;
            }
            console.log(`Deleted ${narrCount} scene_narrations`);

            const { error: sceneError, count: sceneCount } = await supabase
                .from('scenes')
                .delete({ count: 'exact' })
                .eq('story_id', storyId);

            if (sceneError) {
                console.error('Error deleting scenes:', sceneError);
                throw sceneError;
            }
            console.log(`Deleted ${sceneCount} scenes`);

            // 3. Delete Story
            const { error: storyError, count: storyCount } = await supabase
                .from('stories')
                .delete({ count: 'exact' })
                .eq('id', storyId);

            if (storyError) {
                console.error('Error deleting story:', storyError);
                throw storyError;
            }
            console.log(`Deleted ${storyCount} stories`);

            if (storyCount === 0) {
                throw new Error('Stories deletion returned 0 rows affected. Likely permission denied or record not found.');
            }

            alert('删除成功');
            setDeleteConfirm(null);
            handleSearch(); // Refresh list

        } catch (err: any) {
            console.error('Delete error:', err);
            alert('删除失败: ' + err.message);
        } finally {
            setMenuLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-[#FDFBF7] font-serif min-h-[600px]">
            <div className="mb-6 md:mb-8 border-b-2 border-accent-red/20 pb-4 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-calligraphy text-ink-900 mb-2">删除故事</h2>
                    <p className="text-sm md:text-base text-ink-500">管理并删除已生成的故事</p>
                </div>
                <button
                    onClick={onBack}
                    className="w-full md:w-auto px-6 py-2 border border-ink-300 rounded text-ink-600 hover:bg-ink-50 text-center"
                >
                    返回
                </button>
            </div>

            {/* Search Area */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="输入故事标题 (中文)"
                    className="flex-grow p-3 border border-ink-300 rounded text-base md:text-lg focus:border-accent-red focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-ink-800 text-white rounded font-bold hover:bg-ink-900 disabled:opacity-50"
                >
                    {loading ? '搜索中...' : '搜索'}
                </button>
            </div>

            {/* Results */}
            {searched && (
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-ink-400 py-8">搜索中...</p>
                    ) : storyList.length === 0 ? (
                        <p className="text-center text-ink-400 py-8">未找到相关故事</p>
                    ) : (
                        storyList.map((story) => (
                            <div
                                key={story.id}
                                className="bg-white p-4 md:p-6 rounded-xl border border-ink-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-ink-900 mb-1">{story.title}</h3>
                                    <div className="text-xs md:text-sm text-ink-500 flex flex-wrap gap-2 md:gap-4">
                                        <span>ID: {story.id}</span>
                                        <span>分类: {story.category_id || 'N/A'}</span>
                                        <span>{story.created_at ? new Date(story.created_at).toLocaleString() : '未知时间'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm(story)}
                                    className="w-full md:w-auto px-4 py-2 bg-red-50 text-red-600 rounded border border-red-100 hover:bg-red-100 transition-colors text-center"
                                >
                                    删除
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-red-600 mb-4">危险操作确认</h3>
                        <div className="text-ink-700 mb-6">
                            確定要刪除故事 <span className="font-bold">“{deleteConfirm.title}”</span> 嗎？
                            <br />
                            <br />
                            <span className="text-sm text-ink-500">
                                此操作将永久删除：
                                <ul className="list-disc list-inside mt-1">
                                    <li>数据库记录 (Stories, Scenes, Options)</li>
                                    <li>生成的音频文件</li>
                                    <li>生成的图片文件</li>
                                </ul>
                                <b className="text-red-500">此操作不可恢复！</b>
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 border border-ink-300 rounded font-bold hover:bg-ink-50"
                                disabled={menuLoading}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 bg-red-600 text-white rounded font-bold hover:bg-red-700 disabled:opacity-50"
                                disabled={menuLoading}
                            >
                                {menuLoading ? '删除中...' : '确认删除'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
