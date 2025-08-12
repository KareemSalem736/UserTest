/// <reference types="vite/client" />

declare global {
  interface Window {
    api: {
      tailorResume: (payload: { resumeFile: File; job: string; jobInputType: 'text' | 'url' }) => Promise<{ resume: string; downloadUrl: string }>
    }
  }
}

export {}
