"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, X, Info } from "lucide-react"
import Link from "next/link"

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem("privacy-consent")
    if (!hasConsented) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("privacy-consent", "true")
    localStorage.setItem("privacy-consent-date", new Date().toISOString())
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem("privacy-consent", "false")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/50 backdrop-blur-sm">
      <Card className="max-w-4xl mx-auto border-slate-300 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Privacy & Data Protection</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecline}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  <strong>We respect your privacy.</strong> By using our Digital Footprint Risk Analyzer, you agree to
                  let us:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Check your email against publicly known breach databases</li>
                  <li>• Analyze your digital footprint using public data sources only</li>
                  <li>• Generate AI-powered security recommendations</li>
                </ul>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Info className="w-3 h-3" />
                  <span>We do NOT store, sell, or share your personal information.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700">
                  I Agree - Continue
                </Button>
                <Button variant="outline" onClick={handleDecline}>
                  Decline
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                    Read Privacy Policy
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
