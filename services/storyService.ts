import { supabase } from './supabase';
import { IGameCategory, IGameScene, GameOption } from '../types';

export const storyService = {
    /**
     * Fetches all categories and their stories (shallow, without scenes).
     */
    async getCategories(): Promise<IGameCategory[]> {
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (catError) throw catError;

        // Fetch stories for each category (shallow fetch)
        const { data: stories, error: storiesError } = await supabase
            .from('stories')
            .select('*')
            .order('sort_order', { ascending: true });

        if (storiesError) throw storiesError;

        // Check which stories have scenes to determining "Unlock" status (Unlock = has scenes)
        const { data: distinctScenes, error: sceneError } = await supabase
            .from('scenes')
            .select('story_id');

        if (sceneError) {
            console.error("Failed to fetch scene counts", sceneError);
            // Continue without crashing, but stories might be locked
        }

        const validStoryIds = new Set(distinctScenes?.map((s: any) => s.story_id));

        return categories.map((cat: any) => ({
            id: cat.id,
            title: cat.title,
            coverImage: cat.cover_image,
            stories: stories
                .filter((s: any) => s.category_id === cat.id)
                .map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    description: s.description,
                    endingTitle: s.ending_title,
                    endingDescription: s.ending_description,
                    isReady: s.is_ready,
                    // If story has scenes in DB, give it a dummy scene to pass the UI check (length > 0)
                    scenes: validStoryIds.has(s.id) ? [{ id: -1 } as any] : []
                }))
        }));
    },

    /**
     * Fetches full details for a story, including scenes and options.
     */
    async getStoryDetails(storyId: string): Promise<IGameScene[]> {
        const { data: scenes, error } = await supabase
            .from('scenes')
            .select(`
        *,
        options:scene_options(*)
      `)
            .eq('story_id', storyId)
            .order('scene_index', { ascending: true });

        if (error) throw error;

        return scenes.map((scene: any) => ({
            id: scene.scene_index,
            title: scene.title,
            narrative: scene.narrative,
            environmentDescription: scene.environment_description,
            characterState: scene.character_state,
            imageUrl: scene.image_url,
            options: (scene.options || [])
                // Sort options by sort_order or id as stable fallback
                .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((opt: any) => ({
                    text: opt.text,
                    isCorrect: opt.is_correct,
                    feedback: opt.feedback
                } as GameOption))
        }));
    }
};
