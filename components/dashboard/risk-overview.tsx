"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, TrendingUp, Eye, RefreshCw } from "lucide-react"

interface RiskOverviewProps {
  latestScan: any
}

export function RiskOverview({ latestScan }: RiskOverviewProps) {
  if (!latestScan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Digital Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Get Your Digital Risk Score</h3>
            <p className="text-slate-500 mb-4">
              Discover what personal information is exposed online and get your personalized risk assessment.
            </p>
            <Button className="bg-red-600 hover:bg-red-700">Start Risk Analysis</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const riskScore = latestScan.risk_score || latestScan.findings?.risk_score || 0
  const riskLevel = getRiskLevel(riskScore)
  const riskColor = getRiskColor(riskLevel)
  const riskBgColor = getRiskBgColor(riskLevel)

  const findings = latestScan.findings || {}
  const breaches = findings.breaches || []
  const exposedSites = findings.exposed_sites || []
  const recommendations = findings.recommendations || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Digital Risk Score</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${riskBgColor} ${riskColor} border-0`}>{riskLevel.toUpperCase()} RISK</Badge>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-1" />
              Rescan
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Your Digital Risk Score</span>
            <span className="text-3xl font-bold text-slate-900">
              {Math.round(riskScore)}
              <span className="text-lg text-slate-500">/100</span>
            </span>
          </div>
          <Progress value={riskScore} className="h-4" />
          <p className="text-xs text-slate-500 mt-1">
            {riskScore < 30
              ? "Low risk - Good digital hygiene!"
              : riskScore < 70
                ? "Medium risk - Some improvements needed"
                : "High risk - Immediate action required"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 uppercase tracking-wide font-medium">Data Breaches</p>
                <p className="text-2xl font-bold text-red-700">{breaches.length}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-1">Credentials exposed</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 uppercase tracking-wide font-medium">Exposed Sites</p>
                <p className="text-2xl font-bold text-orange-700">{exposedSites.length}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-1">Public exposure</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">AI Actions</p>
                <p className="text-2xl font-bold text-blue-700">{recommendations.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-1">Recommended</p>
          </div>
        </div>

        {exposedSites.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-900 mb-3">Recent Exposures Found</h4>
            <div className="space-y-2">
              {exposedSites.slice(0, 3).map((site: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{site.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      site.risk === "High"
                        ? "text-red-600 border-red-200"
                        : site.risk === "Medium"
                          ? "text-orange-600 border-orange-200"
                          : "text-slate-600 border-slate-200"
                    }
                  >
                    {site.type}
                  </Badge>
                </div>
              ))}
              {exposedSites.length > 3 && (
                <p className="text-xs text-slate-500">+{exposedSites.length - 3} more sites</p>
              )}
            </div>
          </div>
        )}

        {/* Last Scan Info */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Last scan completed on {new Date(latestScan.created_at || latestScan.completed_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getRiskLevel(score: number): string {
  if (score < 30) return "low"
  if (score < 70) return "medium"
  return "high"
}

function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-green-700"
    case "medium":
      return "text-orange-700"
    case "high":
      return "text-red-700"
    default:
      return "text-slate-700"
  }
}

function getRiskBgColor(level: string): string {
  switch (level) {
    case "low":
      return "bg-green-100"
    case "medium":
      return "bg-orange-100"
    case "high":
      return "bg-red-100"
    default:
      return "bg-slate-100"
  }
}
