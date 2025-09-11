"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertTriangle, Info } from "lucide-react"

interface PIIEntity {
  entity_group: string
  entity_type: string
  confidence: number
  word: string
  start: number
  end: number
  risk_level: "low" | "medium" | "high" | "critical"
}

interface RiskAssessment {
  overall_risk: string
  risk_breakdown: Record<string, number>
  total_entities: number
  privacy_score: number
}

interface Recommendation {
  type: "info" | "warning" | "critical"
  message: string
  action: string
}

export default function EnhancedPIIAnalyzer() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<{
    entities: PIIEntity[]
    riskAssessment: RiskAssessment
    recommendations: Recommendation[]
    summary: any
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeText = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/enhanced-ner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError("Failed to analyze text. Please try again.")
      console.error("Enhanced PII analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enhanced PII Detection & Risk Analysis
          </CardTitle>
          <CardDescription>
            Advanced analysis to detect personal information including emails, phone numbers, SSNs, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter text to analyze for personal information..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32"
          />
          <Button onClick={analyzeText} disabled={!text.trim() || isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze for PII"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <div className="space-y-6">
          {/* Risk Assessment Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.riskAssessment.privacy_score}</div>
                  <div className="text-sm text-muted-foreground">Privacy Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.riskAssessment.total_entities}</div>
                  <div className="text-sm text-muted-foreground">PII Found</div>
                </div>
                <div className="text-center">
                  <Badge className={getRiskColor(results.riskAssessment.overall_risk)}>
                    {results.riskAssessment.overall_risk.toUpperCase()}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Overall Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{results.summary.most_common || "None"}</div>
                  <div className="text-sm text-muted-foreground">Most Common</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    {results.riskAssessment.risk_breakdown.critical || 0}
                  </div>
                  <div className="text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{results.riskAssessment.risk_breakdown.high || 0}</div>
                  <div className="text-muted-foreground">High</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-yellow-600">
                    {results.riskAssessment.risk_breakdown.medium || 0}
                  </div>
                  <div className="text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">{results.riskAssessment.risk_breakdown.low || 0}</div>
                  <div className="text-muted-foreground">Low</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detected Entities */}
          <Card>
            <CardHeader>
              <CardTitle>Detected Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {results.entities.length > 0 ? (
                <div className="space-y-3">
                  {results.entities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{entity.word}</div>
                        <div className="text-sm text-muted-foreground">{entity.entity_type}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(entity.risk_level)}>{entity.risk_level}</Badge>
                        <div className="text-sm text-muted-foreground">{Math.round(entity.confidence * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No personal information detected</div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <div className="flex items-start gap-3">
                      {getRecommendationIcon(rec.type)}
                      <div className="flex-1">
                        <div className="font-medium">{rec.message}</div>
                        <div className="text-sm text-muted-foreground mt-1">{rec.action}</div>
                      </div>
                    </div>
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
