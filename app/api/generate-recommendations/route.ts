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

    // Get scan data
    const { data: scan, error: scanError } = await supabase
      .from("footprint_scans")
      .select("*")
      .eq("id", scanId)
      .eq("user_id", user.id)
      .single()

    if (scanError || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Get breach data
    const { data: breachData } = await supabase.from("breach_data").select("*").eq("scan_id", scanId)

    // Get social exposure data
    const { data: socialData } = await supabase.from("social_exposure").select("*").eq("scan_id", scanId)

    // Generate AI recommendations based on risk profile
    const recommendations = generateAIRecommendations(scan, breachData || [], socialData || [])

    // Update scan with AI recommendations
    const { error: updateError } = await supabase
      .from("footprint_scans")
      .update({
        recommendations: recommendations.all_recommendations,
        scan_results: {
          ...scan.scan_results,
          ai_recommendations: recommendations,
          generated_at: new Date().toISOString(),
        },
      })
      .eq("id", scanId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating recommendations:", updateError)
      return NextResponse.json({ error: "Failed to save recommendations" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      recommendations,
    })
  } catch (error) {
    console.error("AI recommendation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateAIRecommendations(scan: any, breachData: any[], socialData: any[]) {
  // Analyze risk profile
  const riskProfile = {
    breach_severity: calculateBreachSeverity(breachData),
    social_exposure: calculateSocialExposure(socialData),
    urgency_level: determineUrgencyLevel(scan.risk_score, breachData),
    data_sensitivity: assessDataSensitivity(breachData),
  }

  const recommendations = {
    immediate_actions: [] as string[],
    short_term_goals: [] as string[],
    long_term_improvements: [] as string[],
    educational_resources: [] as string[],
    priority_score: 0,
    all_recommendations: [] as string[],
  }

  // Generate immediate actions based on urgency
  if (riskProfile.urgency_level === "critical" || riskProfile.urgency_level === "high") {
    if (riskProfile.data_sensitivity.financial_data) {
      recommendations.immediate_actions.push(
        "🚨 URGENT: Monitor all bank and credit card accounts for unauthorized transactions",
        "🚨 Contact your bank immediately to report potential compromise",
        "🚨 Place fraud alerts on your credit reports with all three bureaus",
      )
    }

    if (riskProfile.data_sensitivity.authentication_data) {
      recommendations.immediate_actions.push(
        "🔐 Change passwords on ALL accounts immediately, starting with financial and email",
        "🔐 Enable two-factor authentication on every account that supports it",
      )
    }
  }

  // Password security recommendations
  if (breachData.length > 0) {
    recommendations.short_term_goals.push(
      "Install and set up a password manager (recommended: Bitwarden, 1Password)",
      "Generate unique passwords for each of your accounts",
      "Update your most important accounts first: email, banking, work",
    )
  }

  // Social media privacy recommendations
  if (socialData.length > 0) {
    const platforms = [...new Set(socialData.map((s) => s.platform))]
    platforms.forEach((platform) => {
      recommendations.short_term_goals.push(
        `Review ${platform} privacy settings and limit public information visibility`,
      )
    })

    recommendations.short_term_goals.push(
      "Audit and remove third-party apps connected to your social accounts",
      "Turn off location sharing across all social media platforms",
    )
  }

  // Long-term improvements
  recommendations.long_term_improvements = [
    "Set up regular security audits (quarterly review of accounts and passwords)",
    "Enable security notifications on all important accounts",
    "Consider using a VPN for enhanced privacy protection",
    "Regularly monitor your credit reports and identity theft protection services",
  ]

  // Educational resources
  recommendations.educational_resources = [
    "Learn about phishing attacks and how to identify them",
    "Understand the basics of two-factor authentication",
    "Read about safe browsing practices and public Wi-Fi risks",
  ]

  // Calculate priority score
  recommendations.priority_score = calculatePriorityScore(riskProfile)

  // Combine all recommendations
  recommendations.all_recommendations = [
    ...recommendations.immediate_actions,
    ...recommendations.short_term_goals,
    ...recommendations.long_term_improvements,
  ]

  return recommendations
}

function calculateBreachSeverity(breachData: any[]): number {
  if (!breachData.length) return 0

  const severityScores = { low: 10, medium: 30, high: 60, critical: 90 }
  const maxSeverity = Math.max(
    ...breachData.map((b) => severityScores[b.severity as keyof typeof severityScores] || 10),
  )
  const multiplier = Math.min(1.5, 1 + (breachData.length - 1) * 0.1)

  return Math.min(100, maxSeverity * multiplier)
}

function calculateSocialExposure(socialData: any[]): number {
  if (!socialData.length) return 0

  const exposureScores = { low: 15, medium: 40, high: 75 }
  const totalScore = socialData.reduce(
    (sum, s) => sum + (exposureScores[s.risk_level as keyof typeof exposureScores] || 15),
    0,
  )

  return Math.min(100, totalScore)
}

function determineUrgencyLevel(riskScore: number, breachData: any[]): string {
  const hasCriticalBreach = breachData.some((b) => b.severity === "critical")

  if (riskScore >= 80 || hasCriticalBreach) return "critical"
  if (riskScore >= 60) return "high"
  if (riskScore >= 40) return "medium"
  return "low"
}

function assessDataSensitivity(breachData: any[]) {
  const compromisedTypes = new Set(breachData.flatMap((b) => b.data_types || []))

  return {
    financial_data: ["credit_card", "bank_account", "ssn"].some((t) => compromisedTypes.has(t)),
    authentication_data: ["password", "security_question"].some((t) => compromisedTypes.has(t)),
    personal_identifiers: ["ssn", "passport", "drivers_license"].some((t) => compromisedTypes.has(t)),
    contact_information: ["email", "phone", "address"].some((t) => compromisedTypes.has(t)),
  }
}

function calculatePriorityScore(riskProfile: any): number {
  const urgencyScores = { low: 20, medium: 50, high: 75, critical: 95 }
  let score = urgencyScores[riskProfile.urgency_level as keyof typeof urgencyScores] || 20

  if (riskProfile.data_sensitivity.financial_data) score += 20
  if (riskProfile.data_sensitivity.personal_identifiers) score += 15

  return Math.min(100, score)
}
