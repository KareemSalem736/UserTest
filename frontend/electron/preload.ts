import { contextBridge, ipcRenderer } from 'electron'

type TailorResumeArgs = { resumeFile: File; job: string; jobInputType: 'text' | 'url' }

type TailorResumeReturn = { resume: string; downloadUrl: string }

contextBridge.exposeInMainWorld('api', {
  tailorResume: async (payload: TailorResumeArgs): Promise<TailorResumeReturn> => {
    const serializedPayload = {
      resumeFile: {
        name: payload.resumeFile.name,
        type: payload.resumeFile.type,
        size: payload.resumeFile.size,
        arrayBuffer: await payload.resumeFile.arrayBuffer(),
      },
      job: payload.job,
      jobInputType: payload.jobInputType,
    }
    return ipcRenderer.invoke('tailor:resume', serializedPayload)
  },
})
