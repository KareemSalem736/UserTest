import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('api', {
    tailorResume: async (payload) => {
        const serializedPayload = {
            resumeFile: {
                name: payload.resumeFile.name,
                type: payload.resumeFile.type,
                size: payload.resumeFile.size,
                arrayBuffer: await payload.resumeFile.arrayBuffer(),
            },
            job: payload.job,
            jobInputType: payload.jobInputType,
        };
        return ipcRenderer.invoke('tailor:resume', serializedPayload);
    },
});
