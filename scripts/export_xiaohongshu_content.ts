
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

// Helper to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types for Story Data (simplified adaptation from source)
interface GameScene {
    id: number;
    title: string;
    narrative: string;
}

// Function to recursively find file
const findFile = (dir: string, filename: string): string | null => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const result = findFile(filePath, filename);
            if (result) return result;
        } else if (file === filename + '.ts') {
            return filePath;
        }
    }
    return null;
};

async function main() {
    // 1. Parse Arguments
    const args = process.argv.slice(2);
    const storyArgIndex = args.indexOf('--story');
    const storyId = storyArgIndex !== -1 ? args[storyArgIndex + 1] : null;

    if (!storyId) {
        console.error('❌ Error: Please specify a story ID using --story [id] (e.g., --story sandabaigujing)');
        process.exit(1);
    }

    console.log(`🔍 Looking for story: ${storyId}...`);

    // 2. Locate and Load Story Data
    const storiesDir = path.resolve(__dirname, '../data/stories');
    const storyFilePath = findFile(storiesDir, storyId);

    if (!storyFilePath) {
        console.error(`❌ Error: Could not find story file for "${storyId}" in ${storiesDir}`);
        process.exit(1);
    }

    const storyModule = await import(storyFilePath);
    const sceneExportKey = Object.keys(storyModule).find(key => key.includes('SCENES'));

    if (!sceneExportKey || !Array.isArray(storyModule[sceneExportKey])) {
        console.error(`❌ Error: Could not find SCENES array in ${storyFilePath}`);
        process.exit(1);
    }

    const scenes: GameScene[] = storyModule[sceneExportKey];
    console.log(`📖 Found ${scenes.length} scenes.`);

    // 3. Prepare Output Directory
    const outputBase = path.resolve(__dirname, '../xiaohongshu_exports');
    const storyDir = path.join(outputBase, storyId);

    if (fs.existsSync(storyDir)) {
        fs.rmSync(storyDir, { recursive: true, force: true });
    }
    fs.mkdirSync(storyDir, { recursive: true });
    console.log(`📂 Created output directory: ${storyDir}`);

    // 4. Puppeteer Setup
    console.log('🚀 Launching Puppeteer...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: {
            width: 1080,
            height: 1440, // 3:4 Ratio (1080 * 1.333...)
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true
        }
    });

    const page = await browser.newPage();
    const portArgIndex = args.indexOf('--port');
    const port = portArgIndex !== -1 ? args[portArgIndex + 1] : '3000';
    const BASE_URL = `http://localhost:${port}`;

    // 5. Generate Text & Screenshots
    let postContent = '';

    // Header for Text File
    postContent += `【标题提案】\n`;
    postContent += `1. 🔥这版《${storyId}》画风太绝了！竟然是APP里的...\n`;
    postContent += `2. 纯手绘硬派国风！《${storyId}》全剧情图解\n`;
    postContent += `3. 这种暗黑国漫风谁懂啊？西游记《${storyId}》\n\n`;
    postContent += `【正文内容】\n`;

    // Exclude the last scene (Bad Ending) as requested
    for (let i = 0; i < scenes.length - 1; i++) {
        const scene = scenes[i];
        const indexStr = (i + 1).toString().padStart(2, '0');
        const screenshotPath = path.join(storyDir, `${indexStr}_${scene.title.replace(/\s+/g, '_')}.png`);

        console.log(`📸 Capturing [${indexStr}/${scenes.length}]: ${scene.title}...`);

        try {
            // Navigate to exact scene
            const url = `${BASE_URL}?story=${storyId}&scene=${i}`;
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Wait a moment for animations/images to load
            await new Promise(r => setTimeout(r, 2000)); // 2s delay for safety

            // Inject Custom CSS for Better Visibility on 1080px width
            await page.addStyleTag({
                content: `
                    /* Hide Global App Header - Aggressive Selector */
                    header { display: none !important; }

                    /* Title */
                    h2 { 
                        font-size: 56px !important; 
                        margin-bottom: 24px !important; 
                        margin-top: 40px !important; 
                    }
                    
                    /* Narrative Text - Target GameScene (text-justify) and Game Over (generic) differently */
                    p { 
                        font-size: 36px !important; 
                        line-height: 1.5 !important; 
                        margin-bottom: 24px !important;
                    }
                    /* Indent only for Story Scene */
                    p.text-justify {
                        text-indent: 2em !important; 
                    }
                    /* Center for Game Over Scene */
                    p:not(.text-justify) {
                        text-align: center !important;
                        text-indent: 0 !important;
                    }

                    /* Layout Enforcement - Allow growth but ensure min 3:4 ratio */
                    html, body, #root, main { 
                        min-height: 1440px !important; 
                        height: auto !important;
                        overflow: visible !important;
                        background-color: #f7f5f0; 
                    }

                    /* Main Container Flex */
                    main {
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important; /* Start from top now that padding is managed */
                        padding-top: 40px !important; 
                        padding-bottom: 80px !important; /* Add padding at bottom for breathing room */
                    }

                    /* Reduce Scene Spacing */
                    .space-y-6 > :not([hidden]) ~ :not([hidden]) {
                        --tw-space-y-reverse: 0;
                        margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
                        margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
                    }
                    
                    /* Image Container - Limit Height to save space */
                    .aspect-video {
                        aspect-ratio: auto !important;
                        height: 500px !important; /* Fixed height for image */
                        width: 100% !important;
                        margin-bottom: 24px !important;
                    }
                    img { object-fit: cover !important; height: 100% !important; width: 100% !important; }
                    
                    /* Scene Container Padding */
                    .p-6, .p-8 { padding: 32px !important; }
                    
                    /* Options Text */
                    button { margin-bottom: 16px !important; font-size: 32px !important; }
                    button span { font-size: 32px !important; }

                    /* Hide Interactive Buttons (Back button in header) */
                    button:has(svg) { display: none !important; } 
                    
                    /* Allow Game Over buttons to be visible but style them */
                    /* The above :has(svg) might hide Game Over buttons if they have icons? No icons in Game Over buttons in App.tsx */
                    
                    /* Force Game Over Card Width */
                    div[class*="max-w-2xl"] {
                        max-width: 90% !important; /* Widen it a bit for the screenshot */
                    }
                `
            });

            // Debug: Log the height
            const height = await page.evaluate(() => document.documentElement.scrollHeight);
            console.log(`📏 Page height for scene ${i + 1}: ${height}px`);

            // Capture screenshot (full page for long content)
            await page.screenshot({ path: screenshotPath, fullPage: true });

        } catch (err) {
            console.error(`⚠️ Failed to capture scene ${scene.id}:`, err);
        }

        // Append to Text
        postContent += `P${i + 1}：${scene.title}\n`;
        postContent += `${scene.narrative}\n\n`;
    }

    await browser.close();

    postContent += `------------------------\n`;
    postContent += `【标签】\n`;
    postContent += `#国风 #游戏美术 #独立开发 #西游记 #中国传统文化 #插画分享 #我的宝藏APP\n`;

    // 6. Write Text File
    fs.writeFileSync(path.join(storyDir, 'post_copy.txt'), postContent, 'utf-8');

    console.log(`✨ Export complete! Check folder: ${storyDir}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
