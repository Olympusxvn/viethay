# VietHay Web App

Next.js 15 app for the VietHay hackathon project — AI video marketing for Vietnamese e-commerce sellers.

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/generate` | Product input + script preview + video generation |
| `/results/[id]` | Video player, subtitles, mock analytics |
| `/history` | Video gallery |
| `/templates` | Industry templates |
| `/settings` | PixVerse API key (localStorage) |

## Deploy (Vercel)

Set root directory to `web`, build command `npm run build`, output default Next.js.

## PixVerse

Add your API key in **Settings**. Without a key, the app uses demo mode with a sample video URL.
