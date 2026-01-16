
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
        const { story_id, scene_index } = await req.json()
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get record
        const { data: record } = await supabaseClient
            .from('scene_narrations')
            .select('*')
            .eq('story_id', story_id)
            .eq('scene_index', scene_index)
            .single()

        if (!record) throw new Error('Record not found')

        // If already success, return immediately
        if (record.status === 'success') {
            return new Response(JSON.stringify({ status: 'success', audio_url: record.audio_url }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!record.episode_id) throw new Error('No Episode ID')

        // 2. Poll ListenHub
        const listenHubRes = await fetch(`https://api.marswave.ai/openapi/v1/podcast/episodes/${record.episode_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('LISTENHUB_API_KEY')}`
            }
        })

        if (!listenHubRes.ok) throw new Error('ListenHub fetch error')

        const lhData = await listenHubRes.json()
        if (lhData.code !== 0) throw new Error(`ListenHub API error: ${lhData.message}`)

        const processStatus = lhData.data.processStatus


        const { data: storyData, error: storyError } = await supabaseClient
            .from('stories')
            .select('category_id')
            .eq('id', story_id)
            .single()

        if (storyError || !storyData) throw new Error('Story/Category not found')

        const category_id = storyData.category_id

        if (processStatus === 'success') {
            // 3. Download and Upload to Supabase Storage
            const audioUrl = lhData.data.audioUrl
            console.log('Downloading audio from:', audioUrl)

            const audioBlob = await (await fetch(audioUrl)).blob()

            let fileName = `${story_id}_${scene_index}.mp3`
            if (String(scene_index) === '-1') {
                fileName = `${story_id}_ending.mp3`
            }
            const filePath = `${category_id}/${story_id}/${fileName}`

            const { data: storageData, error: uploadError } = await supabaseClient
                .storage
                .from('narrations')
                .getPublicUrl(filePath) // Check existence or just upload. Original used upload.

            // Re-instating correct upload logic
            const { data: uploadData, error: upError } = await supabaseClient
                .storage
                .from('narrations')
                .upload(filePath, audioBlob, {
                    contentType: 'audio/mpeg',
                    upsert: true
                })

            if (upError) throw upError

            const { data: { publicUrl } } = supabaseClient
                .storage
                .from('narrations')
                .getPublicUrl(filePath)

            // 4. Update DB
            await supabaseClient
                .from('scene_narrations')
                .update({ status: 'success', audio_url: publicUrl })
                .eq('id', record.id)

            return new Response(JSON.stringify({ status: 'success', audio_url: publicUrl }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        } else if (processStatus === 'failed') {
            await supabaseClient
                .from('scene_narrations')
                .update({ status: 'failed' })
                .eq('id', record.id)

            return new Response(JSON.stringify({ status: 'failed', message: lhData.data.message }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        } else {
            // Pending
            return new Response(JSON.stringify({ status: 'pending' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

    } catch (error) {
        console.error('Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
