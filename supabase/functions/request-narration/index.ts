
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { story_id, scene_index, text } = await req.json()
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Check existing
        const { data: existing } = await supabaseClient
            .from('scene_narrations')
            .select('*')
            .eq('story_id', story_id)
            .eq('scene_index', scene_index)
            .single()

        if (existing && existing.status === 'success') {
            return new Response(JSON.stringify({ status: 'success', audio_url: existing.audio_url }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // If pending, return pending so frontend can poll
        if (existing && existing.status === 'pending') {
            return new Response(JSON.stringify({ status: 'pending', episode_id: existing.episode_id }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 2. Call ListenHub
        console.log('Calling ListenHub for:', text.substring(0, 20) + '...')
        const listenHubRes = await fetch('https://api.marswave.ai/openapi/v1/flow-speech/episodes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('LISTENHUB_API_KEY')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sources: [{ type: 'text', content: text }],
                speakers: [{ speakerId: 'CN-Man-Beijing-V2' }],
                language: 'zh',
                mode: 'direct'
            })
        })

        if (!listenHubRes.ok) {
            const err = await listenHubRes.text()
            console.error('ListenHub Error:', err)
            throw new Error(`ListenHub error: ${err}`)
        }

        const listenHubData = await listenHubRes.json()
        if (listenHubData.code !== 0) {
            console.error('ListenHub API Data Error:', listenHubData)
            throw new Error(`ListenHub API error: ${listenHubData.message}`)
        }

        const episodeId = listenHubData.data.episodeId

        // 3. Save to DB
        const { error: insertError } = await supabaseClient
            .from('scene_narrations')
            .upsert({
                story_id,
                scene_index,
                episode_id: episodeId,
                status: 'pending'
            }, { onConflict: 'story_id, scene_index' })

        if (insertError) throw insertError

        return new Response(JSON.stringify({ status: 'pending', episode_id: episodeId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
