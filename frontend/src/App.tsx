
import { useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Link, Download, CheckCircle, AlertCircle, Info } from 'lucide-react'

type TailorStatus = 'idle' | 'processing' | 'done' | 'error'
type JobInputType = 'text' | 'url'

export default function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobInput, setJobInput] = useState('')
  const [jobInputType, setJobInputType] = useState<JobInputType>('text')
  const [titleOnlyResume, setTitleOnlyResume] = useState('')
  const [status, setStatus] = useState<TailorStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [jobContext, setJobContext] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canTailor = useMemo(() => resumeFile && jobInput.trim().length > 0, [resumeFile, jobInput])

  const isLinkedInJobUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes('linkedin.com') && urlObj.pathname.includes('/jobs/')
    } catch {
      return false
    }
  }

  const getJobContext = (input: string, type: JobInputType): string => {
    if (type === 'url') {
      if (isLinkedInJobUrl(input)) {
        return 'LinkedIn job listing detected. The app will analyze this job posting to tailor your resume.'
      } else if (input.includes('linkedin.com')) {
        return 'LinkedIn URL detected but not a job listing. Please provide a direct job posting URL.'
      } else {
        return 'URL provided. The app will attempt to extract job information from this link.'
      }
    }
    return 'Job description text provided. The app will analyze this content to tailor your resume.'
  }

  const handleJobInputChange = (value: string, type: JobInputType) => {
    setJobInput(value)
    setJobInputType(type)
    setJobContext(getJobContext(value, type))
  }

  const handleUrlInput = (url: string) => {
    if (url.trim()) {
      handleJobInputChange(url, 'url')
    } else {
      setJobInput('')
      setJobContext('')
    }
  }

  const handleTextInput = (text: string) => {
    if (text.trim()) {
      handleJobInputChange(text, 'text')
    } else {
      setJobInput('')
      setJobContext('')
    }
  }

  async function handleTailor() {
    try {
      setStatus('processing')
      setErrorMessage('')
      if (!resumeFile) return
      const result = await window.api.tailorResume({ resumeFile: resumeFile, job: jobInput, jobInputType })
      setTitleOnlyResume(result?.resume ?? '')
      setDownloadUrl(result?.downloadUrl ?? null)
      setStatus('done')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to tailor resume'
      setErrorMessage(errorMessage)
      setStatus('error')
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setResumeFile(file)
    } else {
      alert('Please select a valid .docx file')
    }
  }

  function handleDownload() {
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'tailored-resume.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Resume Tailor</h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume (.docx) and provide a job listing. We will adapt the resume to match the job title only.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Resume (.docx)
              </CardTitle>
              <CardDescription>
                Upload your Word document resume to be tailored
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50">
                {resumeFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="h-8 w-8" />
                      <span className="font-semibold text-lg">{resumeFile.name}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => { setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = '' } }
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Click to select or drag & drop</p>
                      <p className="text-sm text-muted-foreground">Supports .docx files only</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      Select File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Listing
              </CardTitle>
              <CardDescription>
                Provide job details via text or URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Type Toggle */}
              <Tabs value={jobInputType} onValueChange={(value: string) => handleJobInputChange(jobInput, value as JobInputType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-4">
                  <Input
                    type="url"
                    value={jobInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlInput(e.target.value)}
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    className="w-full"
                  />
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    value={jobInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextInput(e.target.value)}
                    placeholder="Paste job listing text here..."
                    rows={12}
                    className="w-full resize-none"
                  />
                </TabsContent>
              </Tabs>

              {/* Job Context */}
              {jobContext && (
                <div className={`p-4 rounded-lg border ${
                  jobContext.includes('LinkedIn job listing detected') 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : jobContext.includes('LinkedIn URL detected but not a job listing')
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="flex items-start gap-2">
                    {jobContext.includes('LinkedIn job listing detected') ? (
                      <CheckCircle className="h-5 w-5 mt-0.5 text-green-600" />
                    ) : jobContext.includes('LinkedIn URL detected but not a job listing') ? (
                      <AlertCircle className="h-5 w-5 mt-0.5 text-yellow-600" />
                    ) : (
                      <Info className="h-5 w-5 mt-0.5 text-blue-600" />
                    )}
                    <p className="text-sm">{jobContext}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleTailor}
            disabled={!canTailor || status === 'processing'}
            size="lg"
            className="min-w-[200px]"
          >
            {status === 'processing' ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              'Tailor Resume (Title Only)'
            )}
          </Button>

          {downloadUrl && status === 'done' && (
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Tailored Resume
            </Button>
          )}
        </div>

        {/* Status Messages */}
        <div className="text-center">
          {status === 'error' && (
            <div className="inline-flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
          {status === 'done' && (
            <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              Resume tailored successfully!
            </div>
          )}
        </div>

        {/* Preview */}
        {titleOnlyResume && (
          <Card>
            <CardHeader>
              <CardTitle>Preview (First 500 characters)</CardTitle>
              <CardDescription>
                Preview of your tailored resume content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={titleOnlyResume.substring(0, 500) + (titleOnlyResume.length > 500 ? '...' : '')}
                readOnly
                rows={8}
                className="w-full resize-none bg-muted/50"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}