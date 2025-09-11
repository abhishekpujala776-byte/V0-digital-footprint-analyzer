"use client"

import { useState, useEffect } from "react"
import { DataConsentForm } from "./data-consent-form"
import { ConsentBanner } from "./consent-banner"

interface ConsentData {
  emailScan: boolean
  socialMediaAnalysis: boolean
  aiRecommendations: boolean
  dataRetention: boolean
  marketingCommunications: boolean
}

interface ConsentManagerProps {
  onConsentComplete?: (consents: ConsentData) => void
  requireDetailedConsent?: boolean
}

export function ConsentManager({ onConsentComplete, requireDetailedConsent = false }: ConsentManagerProps) {
  const [showDetailedConsent, setShowDetailedConsent] = useState(false)
  const [hasBasicConsent, setHasBasicConsent] = useState(false)

  useEffect(() => {
    // Check existing consent status
    const basicConsent = localStorage.getItem("privacy-consent")
    const detailedConsent = localStorage.getItem("detailed-consent")

    setHasBasicConsent(basicConsent === "true")

    if (requireDetailedConsent && !detailedConsent && basicConsent === "true") {
      setShowDetailedConsent(true)
    }
  }, [requireDetailedConsent])

  const handleDetailedConsent = (consents: ConsentData) => {
    setShowDetailedConsent(false)
    onConsentComplete?.(consents)
  }

  const handleDetailedDecline = () => {
    setShowDetailedConsent(false)
    // Clear basic consent if they decline detailed consent
    localStorage.removeItem("privacy-consent")
    localStorage.removeItem("detailed-consent")
    setHasBasicConsent(false)
  }

  if (showDetailedConsent) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DataConsentForm onConsent={handleDetailedConsent} onDecline={handleDetailedDecline} />
        </div>
      </div>
    )
  }

  // Show basic consent banner if no consent given
  if (!hasBasicConsent) {
    return <ConsentBanner />
  }

  return null
}
