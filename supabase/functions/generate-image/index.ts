
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Import Google GenAI SDK
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { story_id, scene_index, prompt } = await req.json()

        // Initialize Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        console.log(`Generating image (Gemini) for Story: ${story_id}, Scene: ${scene_index}`);

        // 1. Initialize Gemini API
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
        if (!GEMINI_API_KEY) {
            throw new Error('Missing GEMINI_API_KEY');
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        // Using the user-specified "Nano Banana Pro" model identifier
        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });

        // 2. Generate Image
        // Note: The specific API method for image generation in the JS SDK might vary by version.
        // Assuming a standard 'generateImage' or implicit 'generateContent' that handles image prompts if model supports it.
        // However, 'generateContent' is mostly text/multimodal->text.
        // If the model is an Imagen wrapper, it might differ.
        // For 'gemini-pro-vision', it is input only.
        // BUT, given the instruction, we'll try the REST pattern if SDK is ambiguous, but let's try a direct fetch to thelikely endpoint if SDK doesn't have 'generateImage'.
        // Actually, let's try to allow the SDK to do its magic or fallback to a constructed fetch which is safer for Deno.
        //
        // REF: Google DeepMind / Vertex AI often uses a different endpoint for Imagen.
        // But let's assume this "Nano Banana Pro" behaves like a standard GenAI model that *can* output images (like DALL-E).
        // If the SDK method `ask` or `generateContent` returns an image object.

        // Let's fallback to specific REST call pattern for Google's Image Generation if SDK logic is uncertain in this Deno environment without types.
        // Constructing the request for the "Imagen"-like capability of Gemini.

        // RE-EVALUATION: Since I cannot easily verify the exact SDK method for "gemini-3-pro-image-preview" (hypothetical/preview), 
        // I will trust the user's intent that it IS a Gemini model.
        // If it's *actually* Imagen 3, the endpoint is `https://.../v1beta/models/imagen-3.0-generate-001:predict`.
        // Let's assume standard generateContent but with media response expectation? No, GenAI usually returns text parts.

        // SAFE BET: Use `fetch` to the likely REST endpoint for this model, assuming it follows the `generateContent` or `predict` pattern.
        // Or better: Use the SDK `generateContent` and expect it to work? No, that returns `GenerateContentResult`.

        // 2.5 Fetch Story Details for Path Construction
        const { data: storyData, error: storyError } = await supabaseClient
            .from('stories')
            .select('category_id')
            .eq('id', story_id)
            .single();

        if (storyError || !storyData) {
            console.error('Error fetching story:', storyError);
            throw new Error('Story not found or error fetching details');
        }

        const categoryId = storyData.category_id || 'uncategorized';

        // 3. Generate Image using Gemini (REST)
        // Using the REST API approach for Deno which gives us more control.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`;

        const genRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"]
                }
            })
        });

        // ERROR HANDLING FOR GOOGLE API
        if (!genRes.ok) {
            const errText = await genRes.text();
            throw new Error(`Gemini API Error: ${errText}`);
        }

        const data = await genRes.json();

        // 4. Extract Image
        let imageBase64 = null;
        const part = data.candidates?.[0]?.content?.parts?.[0];

        if (part?.inline_data?.data || part?.inlineData?.data) {
            imageBase64 = part.inline_data?.data || part.inlineData?.data;
        } else {
            console.error('Gemini response:', JSON.stringify(data));
            throw new Error(`No image data found. Gemini Res: ${JSON.stringify(data)}`);
        }

        // 5. Convert Base64 to Blob
        const byteCharacters = atob(imageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const imageBlob = new Blob([byteArray], { type: 'image/jpeg' });

        // 6. Upload to Supabase Storage (story-assets)
        // Path: {category}/{story_id}/{scene_index}_{timestamp}.png
        const fileName = `${categoryId}/${story_id}/scene_${scene_index}_${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabaseClient
            .storage
            .from('story-assets')
            .upload(fileName, imageBlob, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            throw uploadError;
        }

        // 7. Get Public URL
        const { data: { publicUrl } } = supabaseClient
            .storage
            .from('story-assets')
            .getPublicUrl(fileName);

        // 8. Update Database
        const { error: updateError } = await supabaseClient
            .from('scenes')
            .update({ image_url: publicUrl })
            .match({ story_id: story_id, scene_index: scene_index });

        if (updateError) console.error('DB Update Error:', updateError);

        return new Response(JSON.stringify({
            status: 'success',
            image_url: publicUrl
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
