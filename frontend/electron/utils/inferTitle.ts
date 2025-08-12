export function inferJobTitle(jobText: string): string {
  if (!jobText) return 'Candidate'

  const lines = jobText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const titleLike = lines.find((l) => /^(role|position|title)[:\-]/i.test(l))
  if (titleLike) {
    const m = titleLike.split(/[:\-]/)[1]
    if (m) return sanitizeTitle(m)
  }

  const titleRegex = /([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+){0,5})(?: at | — | - |\||\n|$)/
  const m2 = jobText.match(titleRegex)
  if (m2 && m2[1]) return sanitizeTitle(m2[1])

  const keywords = [
    'Software Engineer',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'Data Scientist',
    'Product Manager',
    'Designer',
    'Mobile Engineer',
    'DevOps Engineer',
    'Machine Learning Engineer',
  ]
  for (const k of keywords) {
    if (new RegExp(k, 'i').test(jobText)) return k
  }
  return 'Candidate'
}

export function sanitizeTitle(t: string): string {
  return t.replace(/[\-–—|]/g, ' ').replace(/\s+/g, ' ').trim()
}
