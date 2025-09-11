"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, AlertTriangle, CheckCircle, Search, Eye, MapPin, Phone } from "lucide-react"

interface SocialMediaScannerProps {
  scanId: string
  onScanComplete?: (results: any) => void
}

export function SocialMediaScanner({ scanId, onScanComplete }: SocialMediaScannerProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const platforms = [
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "twitter", name: "Twitter/X", icon: "🐦" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
    { id: "tiktok", name: "TikTok", icon: "🎵" },
    { id: "snapchat", name: "Snapchat", icon: "👻" },
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const handleScan = async () => {
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform to scan")
      return
    }

    setIsScanning(true)
    setError(null)

    try {
      const response = await fetch("/api/scan-social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: selectedPlatforms, scanId }),
      })

      if (response.ok) {
        const data = await response.json()
        setScanResults(data)
        onScanComplete?.(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to scan social media")
      }
    } catch (err) {
      setError("Network error occurred during scan")
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[riskLevel as keyof typeof colors] || colors.low
  }

  const getExposureIcon = (exposureType: string) => {
    const icons = {
      public_profile: Eye,
      personal_info: Users,
      location_data: MapPin,
      contact_info: Phone,
      employment_info: Users,
    }
    return icons[exposureType as keyof typeof icons] || Eye
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Social Media Privacy Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Select the social media platforms you'd like to analyze for privacy exposures:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                    disabled={isScanning}
                  />
                  <label
                    htmlFor={platform.id}
                    className="text-sm font-medium cursor-pointer flex items-center space-x-2"
                  >
                    <span>{platform.icon}</span>
                    <span>{platform.name}</span>
                  </label>
                </div>
              ))}
            </div>

            <Button onClick={handleScan} disabled={isScanning || selectedPlatforms.length === 0} className="w-full">
              {isScanning ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Scanning Privacy Settings...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Scan Selected Platforms
                </>
              )}
            </Button>
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
                <span>Analyzing privacy settings...</span>
                <span>
                  {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
                </span>
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
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                )}
                <span>Privacy Scan Results</span>
              </div>
              <Badge variant={scanResults.total === 0 ? "default" : "secondary"}>
                {scanResults.total} Exposure{scanResults.total !== 1 ? "s" : ""} Found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scanResults.total === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Privacy Settings Look Good!</h3>
                <p className="text-slate-600">No significant privacy exposures detected on the scanned platforms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-slate-600 mb-4">
                  Found {scanResults.total} privacy exposure{scanResults.total !== 1 ? "s" : ""} across your social
                  media accounts:
                </div>

                {scanResults.exposures.map((exposure: any, index: number) => {
                  const IconComponent = getExposureIcon(exposure.exposure_type)
                  return (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-slate-600" />
                          <div>
                            <h4 className="font-medium text-slate-900 capitalize">{exposure.platform}</h4>
                            <p className="text-sm text-slate-600 capitalize">
                              {exposure.exposure_type.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <Badge className={getRiskColor(exposure.risk_level)}>
                          {exposure.risk_level.toUpperCase()} RISK
                        </Badge>
                      </div>

                      {exposure.details?.description && (
                        <p className="text-sm text-slate-600">{exposure.details.description}</p>
                      )}

                      {exposure.details?.recommendation && (
                        <Alert className="border-blue-200 bg-blue-50">
                          <AlertTriangle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <strong>Recommendation:</strong> {exposure.details.recommendation}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )
                })}

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>General Privacy Tips:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Regularly review and update privacy settings</li>
                      <li>• Limit personal information in public profiles</li>
                      <li>• Be cautious about location sharing</li>
                      <li>• Audit third-party app permissions</li>
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
