# Dating App Free · Local Offline PWA

A minimalist habit and sobriety tracker for staying dating-app-free. Styled with the calm, warm aesthetic of **Claude AI's overlay**.

> 💡 **Experiment Note:** This project was created as a **vibe coding experiment / test with Gemini Flash 3.8** — designed to prove that a fully functional, offline-capable iOS PWA with real-time tracking, zero data loss updates, and multi-app habits can be built without macOS, Xcode, or Swift.

---

## ⚡ Quick Start: Run Locally & Connect Your iPhone

### 1. Download or Clone
```bash
git clone https://github.com/Marv15/DatingAppFree.git
cd DatingAppFree
```

### 2. Start with One Click
- **Windows**: Double-click `start.bat`
- **macOS / Linux**: Run `./start.sh` *(or run `node server.js`)*

The terminal will automatically detect your local Wi-Fi IP and display:
```
=============================================================
       🕊️  Dating App Free · Local Server Ready
=============================================================
  🖥️  On this Computer:   http://localhost:8080
  📱  On your iPhone:     http://192.168.x.x:8080
=============================================================
```

### 3. Resolve & Install on Your Phone (iPhone & Android)
1. Ensure your phone is connected to the **same Wi-Fi network**.
2. Click the **"📱 Add to Mobile"** button at the top of your PC's browser window to view the **QR Code**.
3. Point your phone's **Camera** at the screen and tap the link to open it in your browser.
4. Add to your home screen:
   - **iPhone (Safari)**: Tap the **Share** button (square with arrow) &rarr; **"Add to Home Screen"** &rarr; tap **Add**.
   - **Android (Chrome)**: Tap the **three dots (⋮)** in the top right &rarr; **"Install app"** or **"Add to Home screen"**.
5. The **FreeTime** app icon is now on your phone's Home Screen! It runs full-screen without browser URL bars, works completely offline, and saves all your streaks locally.

---

## ✨ Core Features

- **Master Sobriety Timer**: Real-time ticker (Days, Hours, Minutes, Seconds) dating-app-free. Automatically calculates from your **most recently used / last deleted app**.
- **Multi-App Tracking**: Add apps like *Hinge*, *Tinder*, *Bumble*, *Grindr*, *Feeld*, or custom apps separately. Each app has its own quit date, time saved, subscription fee saved, and personal motivation.
- **Personal Motivations**: Write down why you deleted each app (e.g., *"Hinge felt like an unpaid job"*, *"Tinder destroyed my attention span"*).
- **Urge SOS (Craving Shield)**: Feeling tempted to redownload an app? Tap the shield to view your personalized motivation, follow an interactive 2-minute box breathing visualizer, and get 5 quick real-world grounding activities.
- **Quantified Freedom (Smoke-Free Style)**: Cumulative hours saved, subscription money saved (€/$/£/CHF), and swipes avoided, translated into real-world equivalents (books read, gym workouts).
- **Cognitive Milestones**: 10 neuroscience & psychology-backed recovery phases (Day 1 to Year 1) with progress bars.
- **Daily Reflection Journal**: 1-tap mood check-ins (🌿 Peaceful, ⚡ Energized, ✨ Grounded, 🌧️ Lonely, 🔥 Tempted) with personal notes.
- **Zero Data Loss on Updates**: App code cached by the Service Worker is strictly decoupled from your streak data. Updating the code will **never** delete your streaks.
- **1-Tap Backup & Restore**: Export your backup JSON file or copy your backup to your clipboard anytime in Settings.

---

## 🔒 Privacy & Data Safety

- **100% Offline & Private**: No data is sent over the internet or to third-party servers. All streaks, motivations, and reflections live exclusively in your iPhone's browser storage.
- **Zero Internet Exposure**: The local server only listens on your private home Wi-Fi network (`192.168.x.x` or `10.x.x.x`).
- **Safe Code Updates**: When you pull new updates from GitHub (`git pull`), your existing streaks and logs remain 100% untouched.

---

## 📁 Repository Structure

| File / Folder | Purpose |
| :--- | :--- |
| [`start.bat`](start.bat) | Windows 1-click launcher (auto-detects Node.js or Python) |
| [`start.sh`](start.sh) | macOS & Linux 1-click launcher |
| [`server.js`](server.js) | Zero-dependency Node.js server with auto-IP detection & `/api/info` |
| [`index.html`](index.html) | PWA markup, iOS meta tags, and Claude AI overlay modals |
| [`css/styles.css`](css/styles.css) | Claude AI design system, warm oatmeal/charcoal palette, iOS safe areas |
| [`js/app.js`](js/app.js) | Ticker engine, tabs, modals, Urge SOS, service worker updates |
| [`js/storage.js`](js/storage.js) | Multi-app store, persistence, motivations, backup/restore |
| [`js/milestones.js`](js/milestones.js) | Milestones definitions & neurochemical recovery stages |
| [`js/qrcode.js`](js/qrcode.js) | Pure standalone SVG QR code generator for instant iPhone scanning |
| [`manifest.webmanifest`](manifest.webmanifest) | PWA configuration for iOS standalone display |
| [`sw.js`](sw.js) | Service worker with offline caching |
| [`icons/`](icons/) | High-res icons (180x180 Apple touch icon, 192x192, 512x512, SVG) |
