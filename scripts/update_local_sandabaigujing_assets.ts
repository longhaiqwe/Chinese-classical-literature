
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Dirs
const TARGET_DIR = path.join(process.cwd(), "public/assets/xiyouji/sandabaigujing");

// File Mapping (Source Filename -> Target Filename)
const IMAGE_MAP = [
    { src: '01.png', target: 'bg_01_girl.jpg' },
    { src: '02.png', target: 'bg_02_old_woman.jpg' },
    { src: '03.png', target: 'bg_03_old_man.jpg' },
    { src: '04.png', target: 'bg_04_parting.jpg' },
    { src: '05.png', target: 'bg_05_tiger.jpg' },
    { src: '06.png', target: 'bg_06_pleading.jpg' },
    { src: '07.png', target: 'bg_07_reunion.jpg' },
    { src: '08.png', target: 'bg_08_happy_team.jpg' }
];

async function main() {
    console.log(`Optimizing images in ${TARGET_DIR}...`);

    for (const item of IMAGE_MAP) {
        const srcPath = path.join(TARGET_DIR, item.src);
        const destPath = path.join(TARGET_DIR, item.target);

        if (!fs.existsSync(srcPath)) {
            if (fs.existsSync(destPath)) {
                console.log(`${item.src} already processed to ${item.target}, skipping.`);
                continue;
            }
            console.error(`Could not find source image for ${item.src}`);
            continue;
        }

        console.log(`Processing ${item.src} -> ${item.target}`);

        // SIPS Command: Convert to jpg, Resample width to 1024, Crop to 1024x576 (16:9), Quality default is usually good (around 80%)
        // We use --setProperty formatOptions "good" (or specific quality if needed, but sips default is decent)
        try {
            // Using sips to convert and resize. 
            // Note: sips handles format conversion via --setProperty format jpeg
            execSync(`sips -s format jpeg -s formatOptions 70 --resampleWidth 1024 --cropToHeightWidth 576 1024 "${srcPath}" --out "${destPath}"`, { stdio: 'ignore' });

            // Verify and Delete original
            if (fs.existsSync(destPath)) {
                fs.unlinkSync(srcPath);
                console.log(`Deleted original: ${item.src}`);
            } else {
                console.error(`Failed to create ${item.target}`);
            }

        } catch (e) {
            console.error(`Error using sips on ${srcPath}`, e);
        }
    }

    console.log('Local optimization complete.');
}

main().catch(console.error);
