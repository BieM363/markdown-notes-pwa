import fs from 'fs';
import path from 'path';

// Create SVG icons for PWA manifest icons
const pwaIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="url(#grad)" />
  <path d="M140 120H300C322.091 120 340 137.909 340 160V360C340 382.091 322.091 400 300 400H140C117.909 400 100 382.091 100 360V160C100 137.909 117.909 120 140 120Z" fill="white" fill-opacity="0.15" stroke="white" stroke-width="24" stroke-linejoin="round"/>
  <path d="M160 200H280" stroke="white" stroke-width="24" stroke-linecap="round"/>
  <path d="M160 260H300" stroke="white" stroke-width="24" stroke-linecap="round"/>
  <path d="M160 320H240" stroke="white" stroke-width="24" stroke-linecap="round"/>
  <path d="M370 260L395 300L420 260V340H440V230H415L395 265L375 230H350V340H370V260Z" fill="#38BDF8"/>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4F46E5" />
      <stop offset="1" stop-color="#06B6D4" />
    </linearGradient>
  </defs>
</svg>`;

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), pwaIconSvg);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), pwaIconSvg);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), pwaIconSvg);

console.log('PWA SVG icons generated successfully!');
