---
description: Add a new story to the Chinese Classical Literature app
---

# Add New Story Workflow

This workflow guides you through the process of adding a new story (e.g., "Hou Yi Shoots the Suns") to the application. This process is data-driven and does not require changes to the generic React frontend code.

## Prerequisites
- [ ] Story Concept: Title, ID (e.g., `houyisheri`), Description, Ending Title/Description.
- [ ] Scenes: 6-8 scenes with Narratives, Options (1 correct, 2 wrong), and Image Prompts.

## Step 1: Prepare Story Data (Python)

1.  **Edit Script**: Open `scripts/generate_seed_sql.py`.
2.  **Add Scene Data**:
    -   Create a new list variable (e.g., `houyisheri_scenes`) following the format of `jingweitianhai_scenes`.
    -   Each scene must include:
        -   `id`: Simple integer (1, 2, 3...)
        -   `title`: Short title
        -   `narrative`: Full story text
        -   `imageUrl`: Local path format `/assets/<category>/<story_id>/<filename>.jpg` (don't worry about the file not existing locally yet, this is for the DB string).
        -   `options`: List of 3 options with `text`, `isCorrect`, and `feedback`.
3.  **Register Story**:
    -   In the `generate_sql` function, add the new `INSERT INTO stories ...` statement.
    -   Add `sql.extend(get_scene_sql('<story_id>', <your_new_scene_list>))` at the end.
    -   Add the new ID to the `story_ids` cleanup list at the top of the function.

## Step 2: Generate and Upload Visual Assets

1.  **Generate Images**: Use DALL-E 3 or similar to generate images based on the scene descriptions.
    -   *Style*: Gritty Chinese Manhua style, ink wash texture, ancient atmosphere.
    -   *Size*: 1024x576 (16:9) or similar.
2.  **Upload to Supabase**:
    -   Go to Supabase Dashboard -> Storage -> `story-assets`.
    -   Create folder path: `<category_id>/<story_id>/`.
    -   Upload images matching the filenames defined in Step 1 (e.g., `bg_01_start.jpg`).

## Step 3: Generate Audio Narrations

1.  **Run Generator**: Execute the Voice Generation workflow/script.
    -   Since the DB is not updated yet (Step 4 is next), you might need to run Step 4 *first* to seed the text options, OR manually trigger the generation if the script supports it.
    -   *Recommendation*: Run Step 4 (DB Update) first so the `scenes` table is populated. Then run the `Pre-generate Voice Narrations` script which reads from the DB and calls ListenHub.
    -   *Logic*: The `VoicePlayer` component checks Supabase `scene_narrations` table.

## Step 4: Apply Database Changes

1.  **Generate SQL**: Run the python script to generate the seed file.
    ```bash
    python3 scripts/generate_seed_sql.py
    ```
2.  **Apply SQL**:
    -   Copy content of `supabase/seed.sql`.
    -   Run in Supabase SQL Editor.
    -   *Verification*: Check if the new story appears in the `stories` table.

## Step 5: Verification

1.  **Launch App**: Open the app (web or simulator).
2.  **Browse**: Navigate to the category. The new story should appear.
3.  **Play**: Enter the story.
    -   Check if **Images** load.
    -   Check if **Audio** loads (might take a moment if lazy-generated, or verify generation script success).
    -   Play through options to ensure logic flow.
