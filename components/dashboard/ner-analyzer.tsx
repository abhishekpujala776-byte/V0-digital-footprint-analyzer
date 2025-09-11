"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Eye, Shield, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NEREntity {
  text: string
  label: string
  confidence: number
  category: string
  start?: number
  end?: number
}

interface NERAnalysis {
  entities: NEREntity[]
  categories: string[]
  riskScore: number
  riskLevel: string
  recommendations: string[]
  summary: string
}

export function NERAnalyzer() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<NERAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/ner-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze text")
      }

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Person Name": "destructive",
      Location: "default",
      Organization: "secondary",
      Email: "destructive",
      Phone: "default",
      Ssn: "destructive",
    }
    return colors[category] || "outline"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Personal Information Detector
          </CardTitle>
          <CardDescription>
            Analyze text to identify personal information and assess privacy risks using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Paste your text here to analyze for personal information (names, locations, organizations, etc.)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={analyzeText} disabled={isAnalyzing || !text.trim()} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          {/* Risk Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Risk Assessment
                <Badge variant={getRiskColor(analysis.riskLevel)}>
                  {analysis.riskLevel} Risk ({analysis.riskScore}/100)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{analysis.summary}</p>

              {analysis.categories.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Information Categories Found:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.categories.map((category) => (
                      <Badge key={category} variant={getCategoryColor(category)}>
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detected Entities */}
          {analysis.entities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detected Personal Information</CardTitle>
                <CardDescription>{analysis.entities.length} entities found in your text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.entities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{entity.text}</span>
                        <div className="text-sm text-muted-foreground">
                          {entity.category} • {Math.round(entity.confidence * 100)}% confidence
                        </div>
                      </div>
                      <Badge variant={getCategoryColor(entity.category)}>{entity.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
