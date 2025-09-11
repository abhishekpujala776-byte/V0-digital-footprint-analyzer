"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, CheckCircle, Search, Calendar, Database } from "lucide-react"

interface BreachScannerProps {
  scanId: string
  onScanComplete?: (results: any) => void
}

export function BreachScanner({ scanId, onScanComplete }: BreachScannerProps) {
  const [email, setEmail] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async () => {
    if (!email) {
      setError("Please enter an email address")
      return
    }

    setIsScanning(true)
    setError(null)

    try {
      const response = await fetch("/api/check-breaches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, scanId }),
      })

      if (response.ok) {
        const data = await response.json()
        setScanResults(data)
        onScanComplete?.(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to scan for breaches")
      }
    } catch (err) {
      setError("Network error occurred during scan")
    } finally {
      setIsScanning(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="w-4 h-4" />
    }
    return <Shield className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Breach Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address to Check</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isScanning}
              />
              <Button onClick={handleScan} disabled={isScanning || !email}>
                {isScanning ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Scan
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {isScanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Checking breach databases...</span>
                <span>Please wait</span>
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {scanResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {scanResults.total === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
                <span>Breach Scan Results</span>
              </div>
              <Badge variant={scanResults.total === 0 ? "default" : "destructive"}>
                {scanResults.total} {scanResults.total === 1 ? "Breach" : "Breaches"} Found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanResults.note && (
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">{scanResults.note}</AlertDescription>
              </Alert>
            )}

            {scanResults.total === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Great News!</h3>
                <p className="text-slate-600">Your email address was not found in any known data breaches.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-slate-600 mb-4">
                  Your email address appears in the following data breaches:
                </div>

                {scanResults.breaches.map((breach: any, index: number) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSeverityIcon(breach.severity)}
                        <div>
                          <h4 className="font-medium text-slate-900">{breach.name}</h4>
                          {breach.date && (
                            <div className="flex items-center space-x-1 text-sm text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(breach.date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={getSeverityColor(breach.severity)}>{breach.severity.toUpperCase()}</Badge>
                    </div>

                    {breach.description && <p className="text-sm text-slate-600">{breach.description}</p>}

                    {breach.dataClasses && breach.dataClasses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Compromised Data:</p>
                        <div className="flex flex-wrap gap-1">
                          {breach.dataClasses.map((dataClass: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {dataClass}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {breach.verified && (
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified breach</span>
                      </div>
                    )}
                  </div>
                ))}

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Recommended Actions:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Change passwords for all accounts using this email</li>
                      <li>• Enable two-factor authentication where possible</li>
                      <li>• Monitor your accounts for suspicious activity</li>
                      <li>• Consider using a password manager</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
