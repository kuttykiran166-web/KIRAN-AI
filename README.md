# KIRAN AI — Android APK source project

This is an Android-ready **source project**, not a compiled APK. It uses Vite + React + Capacitor, so the user interface can be bundled into an Android app.

## Included
- KIRAN AI mobile interface: Home, AI Chat, Tamil/Tanglish prompts, Image, Video, History
- Android wrapper configuration
- Local prompt generator and session history
- Optional API base URL setting for a separately hosted backend

## Requirements
- Node.js 20+
- Android Studio + Android SDK
- For real AI chat/image/video: a deployed backend that securely stores provider API keys

## Build the Android project
1. Extract the ZIP on a computer.
2. Install Node.js 20+ and Android Studio.
3. Open a terminal in this folder and run:
   `npm install`
   `npm run build`
   `npx cap add android`
   `npx cap sync android`
   `npx cap open android`
4. Android Studio opens the Android project. Wait for Gradle sync.
5. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
6. Android Studio will show the generated APK location (usually `android/app/build/outputs/apk/debug/app-debug.apk`).

## AI backend
This app does not contain provider secrets and does not pretend AI services are configured. Set `VITE_API_BASE_URL` in `.env` to your deployed HTTPS backend URL, then rebuild. Your backend should implement:
- `POST /api/chat` -> `{ "reply": "..." }`
- `POST /api/image` -> `{ "imageUrl": "https://..." }`
- `POST /api/video` -> `{ "message": "..." }`

The prompt generator works locally as a starter. Image/video generation and AI chat need a real backend and valid API access. Do not put API keys inside this app.
