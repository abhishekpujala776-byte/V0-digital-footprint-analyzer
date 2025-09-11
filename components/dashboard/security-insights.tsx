"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface SecurityInsightsProps {
  latestScan: any
}

export function SecurityInsights({ latestScan }: SecurityInsightsProps) {
  const getInsights = () => {
    if (!latestScan) {
      return [
        {
          type: "info",
          title: "Get Started",
          message: "Run your first scan to receive personalized security insights.",
          icon: Info,
        },
      ]
    }

    const insights = []

    if (latestScan.breach_count > 0) {
      insights.push({
        type: "warning",
        title: "Data Breaches Detected",
        message: `Your email appears in ${latestScan.breach_count} known data breach${latestScan.breach_count > 1 ? "es" : ""}.`,
        icon: AlertTriangle,
      })
    }

    if (latestScan.privacy_score < 70) {
      insights.push({
        type: "warning",
        title: "Privacy Concerns",
        message: "Your privacy score indicates room for improvement in your digital security.",
        icon: AlertTriangle,
      })
    }

    if (latestScan.risk_score < 30) {
      insights.push({
        type: "success",
        title: "Good Security Posture",
        message: "Your digital footprint shows relatively low risk exposure.",
        icon: CheckCircle,
      })
    }

    return insights.length > 0
      ? insights
      : [
          {
            type: "info",
            title: "Regular Monitoring",
            message: "Keep monitoring your digital footprint regularly for the best security.",
            icon: Info,
          },
        ]
  }

  const insights = getInsights()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <span>Security Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Alert
            key={index}
            className={
              insight.type === "warning"
                ? "border-orange-200 bg-orange-50"
                : insight.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-blue-200 bg-blue-50"
            }
          >
            <insight.icon
              className={`h-4 w-4 ${
                insight.type === "warning"
                  ? "text-orange-600"
                  : insight.type === "success"
                    ? "text-green-600"
                    : "text-blue-600"
              }`}
            />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{insight.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{insight.message}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ))}

        {/* Recommendations */}
        {latestScan?.recommendations && latestScan.recommendations.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Top Recommendations</h4>
            <div className="space-y-2">
              {latestScan.recommendations.slice(0, 3).map((rec: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-slate-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
