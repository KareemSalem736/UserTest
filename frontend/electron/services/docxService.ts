import mammoth from 'mammoth'
import { Document, Packer, Paragraph, TextRun } from 'docx'

export async function extractTextFromDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

export function createTailoredDocx(resumeText: string, title: string): Document & { text?: string } {
  const paragraphs = resumeText.split(/\r?\n\r?\n/).filter(p => p.trim().length > 0)
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: title, size: 32, bold: true }),
          ],
          spacing: { after: 400 },
        }),
        ...paragraphs.slice(1).map(p => new Paragraph({
          children: [ new TextRun({ text: p.trim(), size: 24 }) ],
          spacing: { after: 200 },
        })),
      ],
    }],
  }) as Document & { text?: string }
  doc.text = `${title}\n\n${paragraphs.slice(1).join('\n\n')}`
  return doc
}

export async function packDocxToBuffer(doc: Document): Promise<Buffer> {
  return Packer.toBuffer(doc)
}
