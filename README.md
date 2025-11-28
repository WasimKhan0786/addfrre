# Ad-Free Video Player

A clean, modern video player built with Next.js 14, React, and Tailwind CSS. Play videos without any advertisements.

## Features

- 🎥 Ad-free video playback
- 🎨 Clean, modern UI with dark theme
- ⚡ Built with Next.js 14 App Router
- 🎯 Custom video controls (play/pause, seek, volume, fullscreen)
- 📱 Responsive design
- 🔒 No tracking or analytics
- 🎬 Supports MP4, WebM, and Ogg formats

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Enter a direct video URL in the input field
2. Click "Load Video" to start playback
3. Use the custom controls to manage playback:
   - Play/Pause button
   - Seek bar for navigation
   - Volume control
   - Fullscreen toggle

## Supported Video Formats

- MP4 (.mp4)
- WebM (.webm)
- Ogg (.ogg)
- Any direct video URL

## Project Structure

```
├── app/
│   ├── api/
│   │   └── video/
│   │       └── route.ts       # API endpoint for video processing
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   └── VideoPlayer.tsx        # Video player component
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## API Endpoint

The application includes a Next.js API route at `/api/video` for video URL processing:

```typescript
POST /api/video
Body: { "url": "https://example.com/video.mp4" }
```

This endpoint can be extended to:
- Validate video URLs
- Proxy video content
- Add security checks
- Process video metadata

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **HTML5 Video API** - Native video playback

## Notes

- This player works with direct video URLs only
- For streaming services, you'll need additional integration
- No external video player libraries are used to ensure ad-free experience
- All video controls are custom-built

## Developer

**Wasim Khan**  
📍 Bhada Kalan, Siwan, Bihar  
💻 Full-stack Developer  
🚀 Passionate about creating beautiful web applications

### Tech Stack
- React 19
- Next.js 16
- TypeScript
- Tailwind CSS
- React Player

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/WasimKhan0786/addfrre.git

# Navigate to project directory
cd addfrre

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- **Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WasimKhan0786/addfrre)
- **Netlify:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/WasimKhan0786/addfrre)

## 📁 Project Structure

```
addfrre/
├── app/
│   ├── api/
│   │   ├── video/
│   │   │   └── route.ts
│   │   └── terabox/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── VideoPlayer.tsx
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── DEPLOYMENT.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- React Player for video playback
- Tailwind CSS for styling
- Next.js for the framework

---

Made with ❤️ in Bihar by Wasim Khan
