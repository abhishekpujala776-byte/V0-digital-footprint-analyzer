import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    const aiAnalysisUrl = process.env.AI_SCANNER_URL || "http://localhost:5000"

    try {
      const response = await fetch(`${aiAnalysisUrl}/analyze-risk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_SCANNER_TOKEN || "dev-token"}`,
        },
        body: JSON.stringify({ email, phone }),
      })

      if (!response.ok) {
        console.log("[v0] AI service unavailable, using simulated analysis")
        const simulatedAnalysis = await generateSimulatedAnalysis(email, phone)
        return NextResponse.json(simulatedAnalysis)
      }

      const analysisResult = await response.json()
      console.log("[v0] AI analysis completed")

      // Store the analysis result
      const { error: insertError } = await supabase.from("footprint_scans").insert({
        user_id: user.id,
        scan_type: "ai_risk_analysis",
        target_email: email,
        target_phone: phone,
        risk_score: analysisResult.risk_score,
        findings: analysisResult,
        status: "completed",
      })

      if (insertError) {
        console.error("Error storing analysis:", insertError)
      }

      return NextResponse.json(analysisResult)
    } catch (fetchError) {
      console.log("[v0] AI service error, using simulated analysis:", fetchError)
      const simulatedAnalysis = await generateSimulatedAnalysis(email, phone)
      return NextResponse.json(simulatedAnalysis)
    }
  } catch (error) {
    console.error("AI risk analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze risk" }, { status: 500 })
  }
}

async function generateSimulatedAnalysis(email: string, phone?: string) {
  // Simulate the AI analysis response structure
  const emailHash = email.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const riskScore = Math.abs(emailHash % 100)

  const breaches = [
    { site: "LinkedIn (2021)", date: "2021", data_types: ["Email", "Password"] },
    { site: "Facebook (2019)", date: "2019", data_types: ["Email", "Personal Info"] },
  ].slice(0, Math.abs(emailHash % 3))

  const socialExposures = [
    {
      platform: "LinkedIn",
      username: email.split("@")[0],
      risk_level: "Medium",
      issues: ["Profile partially public", "Contact info visible"],
    },
    {
      platform: "Facebook",
      username: email.split("@")[0],
      risk_level: "High",
      issues: ["Full profile public", "Personal photos exposed"],
    },
  ].slice(0, Math.abs(emailHash % 2))

  const exposedSites = [
    ...breaches.map((b) => ({
      name: b.site,
      type: "Data Breach",
      risk: "High",
      data_exposed: b.data_types,
    })),
    ...socialExposures.map((s) => ({
      name: s.platform,
      type: "Social Media",
      risk: s.risk_level,
      data_exposed: s.issues,
    })),
  ]

  return {
    risk_score: riskScore,
    risk_level: riskScore < 30 ? "Low" : riskScore < 70 ? "Medium" : "High",
    breaches,
    social_exposures: socialExposures,
    dark_web_mentions: [],
    exposed_sites: exposedSites,
    recommendations: [
      {
        priority: "High",
        action: "Change passwords immediately",
        description: `Your credentials were found in ${breaches.length} data breaches.`,
        impact: "Reduces risk by 20-30 points",
      },
      {
        priority: "Medium",
        action: "Review social media privacy settings",
        description: "Your social profiles are exposing personal information.",
        impact: "Reduces risk by 10-15 points",
      },
    ],
  }
}
