# Resume Tailor Frontend

The Electron + React frontend for the Resume Tailor desktop application.

## 🚀 Quick Start

### Option 1: Local Development (Recommended - Full Electron Experience)
```bash
# From this directory (frontend/)
npm install
npm run dev

# This opens the full Electron desktop app with all features
# May conflict with other apps on port 3000
```

### Option 2: Containerized Development (Vite Only)
```bash
# From the project root (UserTest/)
docker-compose up --build

# Access at http://localhost:4000 (no port conflicts!)
# Note: This runs only Vite, not Electron
```

## 🔧 Development Commands

```bash
npm run dev              # Start Vite + Electron (full experience - RECOMMENDED)
npm run vite:dev         # Start only Vite dev server
npm run build            # Build React app + Electron
npm run build:electron   # Build only Electron TypeScript
npm run lint             # Run ESLint
npm run preview          # Preview production build
```

## 📁 Frontend Structure

```
frontend/
├── src/                 # React app source
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # React entry point
│   └── vite-env.d.ts   # TypeScript declarations
├── electron/            # Electron main process (TypeScript)
│   ├── main.ts         # Main process entry
│   ├── preload.ts      # Preload script
│   ├── ipc/            # IPC handlers
│   ├── services/       # Business logic
│   └── utils/          # Utility functions
├── electron-dist/       # Compiled Electron files
├── dist/               # Built React app
└── Dockerfile.dev      # Development container
```

## 🌐 Access Points

- **Containerized**: http://localhost:4000 ✅ (recommended)
- **Local**: http://localhost:3000 (may conflict)
- **Electron App**: Opens automatically after build

## 🔗 Related Files

- **Root Docker Setup**: See `../docker-compose.yml`
- **Project Overview**: See `../README.md`
- **Development**: See `../docker-compose.override.yml`

## 📝 Notes

- This frontend is designed to work with the containerized setup
- Electron processes run in the container environment
- All dependencies are managed at the project root level
- Ready for backend integration via Docker services
