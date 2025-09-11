import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { scanId } = await request.json()

    if (!scanId) {
      return NextResponse.json({ error: "Scan ID required" }, { status: 400 })
    }

    // Get breach data for this scan
    const { data: breachData, error: breachError } = await supabase
      .from("breach_data")
      .select("*")
      .eq("scan_id", scanId)

    if (breachError) {
      console.error("Error fetching breach data:", breachError)
      return NextResponse.json({ error: "Failed to fetch breach data" }, { status: 500 })
    }

    // Get social exposure data for this scan
    const { data: socialData, error: socialError } = await supabase
      .from("social_exposure")
      .select("*")
      .eq("scan_id", scanId)

    if (socialError) {
      console.error("Error fetching social data:", socialError)
      return NextResponse.json({ error: "Failed to fetch social data" }, { status: 500 })
    }

    // Calculate risk scores (simplified version - in production, you'd call the Python engine)
    const breachCount = breachData?.length || 0
    const socialCount = socialData?.length || 0

    // Simple risk calculation
    let riskScore = 0

    // Breach risk calculation
    breachData?.forEach((breach) => {
      const severityScores = { low: 5, medium: 15, high: 25, critical: 40 }
      riskScore += severityScores[breach.severity as keyof typeof severityScores] || 5

      // Add points for data types
      const dataTypeScores = {
        password: 20,
        ssn: 25,
        credit_card: 30,
        email: 5,
        phone: 10,
        address: 15,
        name: 3,
      }
      breach.data_types?.forEach((type: string) => {
        riskScore += dataTypeScores[type as keyof typeof dataTypeScores] || 2
      })
    })

    // Social exposure risk
    socialData?.forEach((exposure) => {
      const exposureScores = {
        public_profile: 10,
        personal_info: 20,
        location_data: 25,
        financial_info: 35,
      }
      const riskMultipliers = { low: 0.5, medium: 1.0, high: 1.8 }

      const baseScore = exposureScores[exposure.exposure_type as keyof typeof exposureScores] || 10
      const multiplier = riskMultipliers[exposure.risk_level as keyof typeof riskMultipliers] || 1.0
      riskScore += baseScore * multiplier * 0.8 // Social media weighted less than breaches
    })

    // Normalize to 0-100 scale
    const normalizedScore = Math.min(100, riskScore)

    // Determine risk level
    let riskLevel: string
    if (normalizedScore >= 80) riskLevel = "critical"
    else if (normalizedScore >= 60) riskLevel = "high"
    else if (normalizedScore >= 40) riskLevel = "medium"
    else riskLevel = "low"

    // Generate recommendations
    const recommendations = []
    if (breachCount > 0) {
      recommendations.push("Change passwords for all accounts associated with compromised email")
      recommendations.push("Enable two-factor authentication on all important accounts")
    }
    if (socialCount > 0) {
      recommendations.push("Review and tighten social media privacy settings")
      recommendations.push("Limit personal information visible to public")
    }

    // Update scan with results
    const { error: updateError } = await supabase
      .from("footprint_scans")
      .update({
        status: "completed",
        risk_score: Math.round(normalizedScore),
        breach_count: breachCount,
        social_exposure_score: socialCount * 10,
        privacy_score: Math.max(0, 100 - normalizedScore),
        recommendations: recommendations,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scanId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating scan:", updateError)
      return NextResponse.json({ error: "Failed to update scan" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      riskAssessment: {
        overall_score: Math.round(normalizedScore),
        risk_level: riskLevel,
        breach_count: breachCount,
        social_exposure_count: socialCount,
        recommendations: recommendations,
        summary: `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk detected (Score: ${Math.round(normalizedScore)}/100)`,
      },
    })
  } catch (error) {
    console.error("Risk assessment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
