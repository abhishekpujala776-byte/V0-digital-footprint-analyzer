"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface SocialMediaAccount {
  platform: string
  username: string
  riskLevel: "low" | "medium" | "high"
  issues: string[]
  privacyScore: number
}

export function SocialMediaScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<SocialMediaAccount[] | null>(null)

  const handleNewScan = async () => {
    setIsScanning(true)
    setScanResults(null)

    try {
      const response = await fetch("/api/scan-social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Scan failed")
      }

      const data = await response.json()
      setScanResults(data.accounts || [])
      toast.success("Social media scan completed successfully!")
    } catch (error) {
      console.error("Scan error:", error)
      toast.error("Scan failed. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <XCircle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "low":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Social Media Scanner
        </CardTitle>
        <CardDescription>Scan social media accounts linked to your email and phone number</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleNewScan} disabled={isScanning} className="w-full">
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              New Scan
            </>
          )}
        </Button>

        {scanResults && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-slate-700">Found {scanResults.length} linked accounts:</h4>
            {scanResults.map((account, index) => (
              <div key={index} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{account.platform}</span>
                    <span className="text-sm text-slate-500">@{account.username}</span>
                  </div>
                  <Badge variant="outline" className={`${getRiskColor(account.riskLevel)} flex items-center gap-1`}>
                    {getRiskIcon(account.riskLevel)}
                    {account.riskLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600">Privacy Score: {account.privacyScore}/100</div>

                {account.issues.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-slate-700">Issues found:</div>
                    {account.issues.map((issue, issueIndex) => (
                      <div key={issueIndex} className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
