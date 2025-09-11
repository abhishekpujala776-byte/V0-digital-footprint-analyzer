"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from "lucide-react"
import { RiskCalculator } from "@/lib/risk-assessment"

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
            <span>Risk Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Risk Assessment Available</h3>
            <p className="text-slate-500 mb-4">Run your first digital footprint scan to see your risk overview.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const riskLevel = RiskCalculator.calculateRiskLevel(latestScan.risk_score)
  const riskColor = RiskCalculator.getRiskColor(riskLevel)
  const riskBgColor = RiskCalculator.getRiskBgColor(riskLevel)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Risk Overview</span>
          </div>
          <Badge className={`${riskBgColor} ${riskColor} border-0`}>{riskLevel.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Overall Risk Score</span>
            <span className="text-2xl font-bold text-slate-900">{latestScan.risk_score}/100</span>
          </div>
          <Progress value={latestScan.risk_score} className="h-3" />
        </div>

        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Data Breaches</p>
                <p className="text-2xl font-bold text-slate-900">{latestScan.breach_count}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Social Exposure</p>
                <p className="text-2xl font-bold text-slate-900">{latestScan.social_exposure_score}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Privacy Score</p>
                <p className="text-2xl font-bold text-slate-900">{latestScan.privacy_score}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Last Scan Info */}
        <div className="pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Last scan completed on {new Date(latestScan.completed_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
