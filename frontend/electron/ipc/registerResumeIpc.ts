import { ipcMain } from 'electron'
import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extractTextFromDocxBuffer, createTailoredDocx, packDocxToBuffer } from '../services/docxService.js'

interface TailorResumePayload {
  resumeFile: { name: string; type: string; size: number; arrayBuffer: ArrayBuffer }
  job: string
  jobInputType: 'text' | 'url'
}

export function registerResumeIpc(): void {
  ipcMain.handle('tailor:resume', async (_event, payload: TailorResumePayload) => {
    const { resumeFile, job, jobInputType } = payload ?? ({} as TailorResumePayload)
    if (!resumeFile || !job) throw new Error('Resume file and job input are required')

    const buffer = Buffer.from(resumeFile.arrayBuffer)
    const resumeText = await extractTextFromDocxBuffer(buffer)

    // Enhanced title inference based on input type
    const inferredTitle = inferFromInput(job, jobInputType)

    const tailoredDoc = createTailoredDocx(resumeText, inferredTitle)
    const outBuffer = await packDocxToBuffer(tailoredDoc)
    const tempPath = join(tmpdir(), `tailored-resume-${Date.now()}.docx`)
    writeFileSync(tempPath, outBuffer)

    return {
      resume: tailoredDoc.text ?? '',
      downloadUrl: `file://${tempPath}`,
    }
  })
}

function inferFromInput(job: string, inputType: 'text' | 'url'): string {
  // For URLs, we could potentially fetch and parse the content
  // For now, we'll use the existing logic but could enhance it later
  const lines = job.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  const direct = lines.find(l => /^(role|position|title)[:\-]/i.test(l))
  if (direct) {
    const p = direct.split(/[:\-]/)[1]
    if (p) return p.replace(/[\-–—|]/g, ' ').replace(/\s+/g, ' ').trim()
  }
  const m = job.match(/([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+){0,5})(?: at | — | - |\||\n|$)/)
  if (m && m[1]) return m[1].replace(/[\-–—|]/g, ' ').replace(/\s+/g, ' ').trim()
  const keywords = ['Software Engineer','Frontend Engineer','Backend Engineer','Full Stack Engineer','Data Scientist','Product Manager','Designer','Mobile Engineer','DevOps Engineer','Machine Learning Engineer']
  const k = keywords.find(k => new RegExp(k, 'i').test(job))
  return k ?? 'Candidate'
}
