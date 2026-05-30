import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchVideos } from './services/youtubeService.js';
import { searchProblems } from './services/leetcodeService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function run() {
  console.log("Testing YouTube recommendation...");
  try {
    const videos = await searchVideos("Binary Search", 3);
    console.log("Videos:", JSON.stringify(videos, null, 2));
  } catch (err) {
    console.error("YouTube Error:", err);
  }

  console.log("Testing LeetCode recommendation...");
  try {
    const problems = await searchProblems("Binary Search", 3);
    console.log("Problems:", JSON.stringify(problems, null, 2));
  } catch (err) {
    console.error("LeetCode Error:", err);
  }
}

run();
