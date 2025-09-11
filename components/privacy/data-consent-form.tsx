"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, Eye, Database } from "lucide-react"
import Link from "next/link"

interface DataConsentFormProps {
  onConsent: (consents: ConsentData) => void
  onDecline: () => void
}

interface ConsentData {
  emailScan: boolean
  socialMediaAnalysis: boolean
  aiRecommendations: boolean
  dataRetention: boolean
  marketingCommunications: boolean
}

export function DataConsentForm({ onConsent, onDecline }: DataConsentFormProps) {
  const [consents, setConsents] = useState<ConsentData>({
    emailScan: false,
    socialMediaAnalysis: false,
    aiRecommendations: false,
    dataRetention: false,
    marketingCommunications: false,
  })

  const [hasReadPolicy, setHasReadPolicy] = useState(false)

  const handleConsentChange = (key: keyof ConsentData, value: boolean) => {
    setConsents((prev) => ({ ...prev, [key]: value }))
  }

  const canProceed = consents.emailScan && consents.aiRecommendations && hasReadPolicy

  const handleSubmit = () => {
    if (canProceed) {
      // Store consent in localStorage with timestamp
      localStorage.setItem(
        "detailed-consent",
        JSON.stringify({
          ...consents,
          timestamp: new Date().toISOString(),
          version: "1.0",
        }),
      )
      onConsent(consents)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Data Usage Consent</span>
        </CardTitle>
        <p className="text-sm text-slate-600">
          Please review and consent to how we'll use your data for the Digital Footprint Risk Analysis.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Your Privacy is Protected</p>
              <p className="text-blue-700">
                We only use publicly available data and breach databases. Your information is processed securely and
                never sold or shared with third parties.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Required Permissions</h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
              <Checkbox
                id="email-scan"
                checked={consents.emailScan}
                onCheckedChange={(checked) => handleConsentChange("emailScan", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="email-scan" className="font-medium text-slate-900 cursor-pointer">
                  Email Breach Scanning (Required)
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  Check your email against publicly known data breach databases to identify compromised accounts.
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Database className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">Uses: HaveIBeenPwned, public breach databases</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
              <Checkbox
                id="ai-recommendations"
                checked={consents.aiRecommendations}
                onCheckedChange={(checked) => handleConsentChange("aiRecommendations", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="ai-recommendations" className="font-medium text-slate-900 cursor-pointer">
                  AI-Powered Security Recommendations (Required)
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  Generate personalized security recommendations based on your risk profile and findings.
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-medium text-slate-900 pt-4">Optional Permissions</h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
              <Checkbox
                id="social-media"
                checked={consents.socialMediaAnalysis}
                onCheckedChange={(checked) => handleConsentChange("socialMediaAnalysis", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="social-media" className="font-medium text-slate-900 cursor-pointer">
                  Social Media Privacy Analysis (Optional)
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  Analyze publicly visible social media profiles to identify potential privacy risks.
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-500">Only analyzes public information</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
              <Checkbox
                id="data-retention"
                checked={consents.dataRetention}
                onCheckedChange={(checked) => handleConsentChange("dataRetention", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="data-retention" className="font-medium text-slate-900 cursor-pointer">
                  Temporary Data Retention (Optional)
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  Store scan results for 30 days to track improvements and provide historical analysis.
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-slate-500">Data automatically deleted after 30 days</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
              <Checkbox
                id="marketing"
                checked={consents.marketingCommunications}
                onCheckedChange={(checked) => handleConsentChange("marketingCommunications", !!checked)}
              />
              <div className="flex-1">
                <Label htmlFor="marketing" className="font-medium text-slate-900 cursor-pointer">
                  Security Updates & Tips (Optional)
                </Label>
                <p className="text-sm text-slate-600 mt-1">
                  Receive occasional emails about new security threats and protection tips.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy-policy"
              checked={hasReadPolicy}
              onCheckedChange={(checked) => setHasReadPolicy(!!checked)}
            />
            <Label htmlFor="privacy-policy" className="text-sm text-slate-700 cursor-pointer">
              I have read and agree to the{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                Terms of Service
              </Link>
            </Label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
            Continue with Selected Permissions
          </Button>
          <Button variant="outline" onClick={onDecline}>
            Decline & Exit
          </Button>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p>• You can withdraw consent at any time from your account settings</p>
          <p>• We comply with GDPR, CCPA, and India's DPDP Act</p>
          <p>• Your data is processed securely and never sold to third parties</p>
        </div>
      </CardContent>
    </Card>
  )
}
