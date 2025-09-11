"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Brain, AlertTriangle, Eye, Shield } from "lucide-react"

export function AIRiskScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const handleScan = async () => {
    if (!email) return

    setIsScanning(true)
    try {
      const response = await fetch("/api/ai-risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      })

      if (response.ok) {
        const results = await response.json()
        setScanResults(results)
      } else {
        console.error("Scan failed")
      }
    } catch (error) {
      console.error("Scan error:", error)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span>AI Risk Scanner</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!scanResults ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Button onClick={handleScan} disabled={!email || isScanning} className="w-full bg-red-600 hover:bg-red-700">
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Digital Footprint...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Get My Risk Score
                </>
              )}
            </Button>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Scans 15+ billion breach records</p>
              <p>• Analyzes social media exposure</p>
              <p>• Checks dark web mentions</p>
              <p>• Generates AI recommendations</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">{Math.round(scanResults.risk_score)}/100</div>
              <Badge className={`${getRiskBadgeColor(scanResults.risk_level)} text-white`}>
                {scanResults.risk_level.toUpperCase()} RISK
              </Badge>
            </div>

            <Progress value={scanResults.risk_score} className="h-3" />

            {/* Breaches Found */}
            {scanResults.breaches?.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">Data Breaches Found</span>
                </div>
                <div className="space-y-1">
                  {scanResults.breaches.map((breach: any, index: number) => (
                    <div key={index} className="text-sm text-red-700">
                      {breach.site} - {breach.data_types?.join(", ")}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exposed Sites */}
            {scanResults.exposed_sites?.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Sites Where You're Exposed</span>
                </div>
                <div className="space-y-2">
                  {scanResults.exposed_sites.slice(0, 3).map((site: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-orange-700">{site.name}</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {site.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {scanResults.recommendations?.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">AI Recommendations</span>
                </div>
                <div className="space-y-2">
                  {scanResults.recommendations.slice(0, 2).map((rec: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-blue-800">{rec.action}</div>
                      <div className="text-blue-600">{rec.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={() => setScanResults(null)} variant="outline" className="w-full">
              Scan Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getRiskBadgeColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "low":
      return "bg-green-600"
    case "medium":
      return "bg-orange-600"
    case "high":
      return "bg-red-600"
    default:
      return "bg-slate-600"
  }
}
