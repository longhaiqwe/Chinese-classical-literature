
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
            height: 600, // Small initial height to let content determine the full page size
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true
        }
    });

    const page = await browser.newPage();
    const BASE_URL = 'http://localhost:3002'; // Updated to match running dev server

    // 5. Generate Text & Screenshots
    let postContent = '';

    // Header for Text File
    postContent += `【标题提案】\n`;
    postContent += `1. 🔥这版《${storyId}》画风太绝了！竟然是APP里的...\n`;
    postContent += `2. 纯手绘硬派国风！《${storyId}》全剧情图解\n`;
    postContent += `3. 这种暗黑国漫风谁懂啊？西游记《${storyId}》\n\n`;
    postContent += `【正文内容】\n`;

    for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const indexStr = (i + 1).toString().padStart(2, '0');
        const screenshotPath = path.join(storyDir, `${indexStr}_${scene.title.replace(/\s+/g, '_')}.png`);

        console.log(`📸 Capturing [${indexStr}/${scenes.length}]: ${scene.title}...`);

        try {
            // Navigate to exact scene
            const url = `${BASE_URL}?story=${storyId}&scene=${i}`;
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Wait specifically for the GameScene component to appear
            // We'll target a generic class that should exist in your GameScene
            // Based on App.tsx, GameScene is rendered. Let's assume some stable selector or just wait briefly.
            // Better to wait for a specific text or element from the scene to be robust.

            // Wait a moment for animations/images to load
            await new Promise(r => setTimeout(r, 2000)); // 2s delay for safety

            // Capture screenshot
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
