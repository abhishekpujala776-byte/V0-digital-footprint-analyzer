"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileText, Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface AIResult {
  scanId: string
  riskScore: number
  piiEntities: Array<{
    entity_group: string
    word: string
    confidence: number
    start: number
    end: number
  }>
  sensitiveCategories: Array<{
    label: string
    score: number
  }>
  recommendations: Array<{
    priority: string
    action: string
    description: string
  }>
  leakMatches: Array<{
    similarity: number
    source: string
    data: string
  }>
  ocrResults?: Array<{
    text: string
    confidence: number
  }>
}

export function AdvancedScanner() {
  const [inputText, setInputText] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [results, setResults] = useState<AIResult | null>(null)
  const [scanType, setScanType] = useState("comprehensive")

  const handleScan = async () => {
    if (!inputText.trim() && !files?.length) return

    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append("text", inputText)
      formData.append("scanType", scanType)

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("files", file)
        })
      }

      const response = await fetch("/api/ai-scan", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Scan failed")

      const result = await response.json()
      setResults(result)
    } catch (error) {
      console.error("Scan error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High Risk"
    if (score >= 40) return "Medium Risk"
    return "Low Risk"
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Digital Footprint Scanner
          </CardTitle>
          <CardDescription>
            Advanced analysis using Hugging Face models for PII detection, content classification, and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={scanType} onValueChange={setScanType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comprehensive">Comprehensive</TabsTrigger>
              <TabsTrigger value="pii-only">PII Only</TabsTrigger>
              <TabsTrigger value="leak-check">Leak Check</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Text to Analyze</label>
              <Textarea
                placeholder="Paste social media posts, bios, or any text content to analyze..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Upload Files (Images, PDFs)</label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => setFiles(e.target.files)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <Button
              onClick={handleScan}
              disabled={isScanning || (!inputText.trim() && !files?.length)}
              className="w-full"
            >
              {isScanning ? "Scanning..." : "Start AI Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-3xl font-bold ${getRiskColor(results.riskScore)}`}>{results.riskScore}/100</div>
                  <div className={`text-sm ${getRiskColor(results.riskScore)}`}>{getRiskLevel(results.riskScore)}</div>
                </div>
                <Progress value={results.riskScore} className="w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Personal Information Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.piiEntities.map((entity, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{entity.entity_group}</Badge>
                      <span className="text-sm text-gray-500">{Math.round(entity.confidence * 100)}% confidence</span>
                    </div>
                    <div className="font-mono text-sm bg-gray-50 p-2 rounded">{entity.word}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Classification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.sensitiveCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{category.label}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={category.score * 100} className="w-24" />
                      <span className="text-sm text-gray-500">{Math.round(category.score * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertDescription>
                      <div className="flex items-start gap-3">
                        <Badge
                          variant={
                            rec.priority === "high"
                              ? "destructive"
                              : rec.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {rec.priority}
                        </Badge>
                        <div>
                          <div className="font-medium">{rec.action}</div>
                          <div className="text-sm text-gray-600 mt-1">{rec.description}</div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
