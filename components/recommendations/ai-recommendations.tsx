"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  AlertTriangle,
  Clock,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Zap,
  Target,
  GraduationCap,
} from "lucide-react"

interface AIRecommendationsProps {
  scanId: string
  initialRecommendations?: any
}

export function AIRecommendations({ scanId, initialRecommendations }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [isGenerating, setIsGenerating] = useState(false)
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set())

  const generateRecommendations = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleActionComplete = (action: string) => {
    const newCompleted = new Set(completedActions)
    if (newCompleted.has(action)) {
      newCompleted.delete(action)
    } else {
      newCompleted.add(action)
    }
    setCompletedActions(newCompleted)
  }

  const getPriorityColor = (score: number) => {
    if (score >= 80) return "bg-red-100 text-red-800 border-red-200"
    if (score >= 60) return "bg-orange-100 text-orange-800 border-orange-200"
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  if (!recommendations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI-Powered Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Generate Personalized Recommendations</h3>
            <p className="text-slate-500 mb-4">
              Our AI will analyze your risk profile and generate tailored security recommendations.
            </p>
            <Button onClick={generateRecommendations} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate AI Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Priority Score */}
      <Alert className={getPriorityColor(recommendations.priority_score)}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Priority Score: {recommendations.priority_score}/100</p>
              <p className="text-sm mt-1">
                {recommendations.priority_score >= 80
                  ? "Critical - Take immediate action"
                  : recommendations.priority_score >= 60
                    ? "High - Address within 24 hours"
                    : recommendations.priority_score >= 40
                      ? "Medium - Address within a week"
                      : "Low - Address when convenient"}
              </p>
            </div>
            <Badge variant="outline" className="ml-4">
              AI Generated
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Recommendations Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Personalized Security Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="immediate" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="immediate" className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Immediate</span>
              </TabsTrigger>
              <TabsTrigger value="short-term" className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Short-term</span>
              </TabsTrigger>
              <TabsTrigger value="long-term" className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Long-term</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center space-x-1">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Learn</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="immediate" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Immediate Actions Required</h3>
                  <Badge variant="destructive">Urgent</Badge>
                </div>

                {recommendations.immediate_actions?.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.immediate_actions.map((action: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 border border-red-200 rounded-lg bg-red-50"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActionComplete(action)}
                          className={`mt-0.5 ${completedActions.has(action) ? "text-green-600" : "text-slate-400"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${completedActions.has(action) ? "line-through text-slate-500" : "text-slate-900"}`}
                          >
                            {action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No immediate actions required at this time.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="short-term" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Short-term Goals (1-4 weeks)</h3>
                </div>

                {recommendations.short_term_goals?.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.short_term_goals.map((goal: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 border border-orange-200 rounded-lg bg-orange-50"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActionComplete(goal)}
                          className={`mt-0.5 ${completedActions.has(goal) ? "text-green-600" : "text-slate-400"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${completedActions.has(goal) ? "line-through text-slate-500" : "text-slate-900"}`}
                          >
                            {goal}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No short-term goals identified.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="long-term" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Long-term Improvements</h3>
                </div>

                {recommendations.long_term_improvements?.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.long_term_improvements.map((improvement: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 border border-blue-200 rounded-lg bg-blue-50"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActionComplete(improvement)}
                          className={`mt-0.5 ${completedActions.has(improvement) ? "text-green-600" : "text-slate-400"}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${completedActions.has(improvement) ? "line-through text-slate-500" : "text-slate-900"}`}
                          >
                            {improvement}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No long-term improvements suggested.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Educational Resources</h3>
                </div>

                {recommendations.educational_resources?.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.educational_resources.map((resource: string, index: number) => (
                      <div key={index} className="p-3 border border-purple-200 rounded-lg bg-purple-50">
                        <p className="text-sm text-slate-900">{resource}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No educational resources available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
