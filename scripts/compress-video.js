/* global process */
import ffmpegPath from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[Video Compressor] Starting video compression of WEB.mp4...');
console.log('[Video Compressor] Using ffmpeg binary:', ffmpegPath);

const inputFile = path.resolve('WEB.mp4');
const outputFile = path.resolve('public/hero-video.mp4');

if (!fs.existsSync(inputFile)) {
  console.error('[Video Compressor Error] WEB.mp4 not found in workspace root!');
  process.exit(1);
}

// Compress to 1080p, CRF 26, H.264, muted (no audio), movflags +faststart for instant web streaming
const cmd = `"${ffmpegPath}" -i "${inputFile}" -an -vcodec libx264 -crf 26 -preset fast -vf "scale='min(1920,iw)':-2" -movflags +faststart -y "${outputFile}"`;

console.log('[Video Compressor] Executing ffmpeg command...');
execSync(cmd, { stdio: 'inherit' });

const inStats = fs.statSync(inputFile);
const outStats = fs.statSync(outputFile);

console.log(`[Video Compressor] ✅ Done! Original size: ${(inStats.size / (1024 * 1024)).toFixed(2)} MB -> Compressed size: ${(outStats.size / (1024 * 1024)).toFixed(2)} MB`);
