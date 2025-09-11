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

    const { platforms, scanId } = await request.json()

    if (!platforms || !scanId) {
      return NextResponse.json({ error: "Platforms and scan ID required" }, { status: 400 })
    }

    // Verify scan belongs to user
    const { data: scan, error: scanError } = await supabase
      .from("footprint_scans")
      .select("*")
      .eq("id", scanId)
      .eq("user_id", user.id)
      .single()

    if (scanError || !scan) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Simulate social media scanning (in production, this would integrate with actual APIs)
    const socialExposures = await simulateSocialMediaScan(platforms)

    // Store social exposure data
    if (socialExposures.length > 0) {
      const exposureRecords = socialExposures.map((exposure) => ({
        scan_id: scanId,
        platform: exposure.platform,
        exposure_type: exposure.exposure_type,
        risk_level: exposure.risk_level,
        details: exposure.details,
      }))

      const { error: insertError } = await supabase.from("social_exposure").insert(exposureRecords)

      if (insertError) {
        console.error("Error inserting social exposure data:", insertError)
        return NextResponse.json({ error: "Failed to store social exposure data" }, { status: 500 })
      }
    }

    // Calculate social exposure score
    const exposureScore = socialExposures.reduce((total, exposure) => {
      const riskScores = { low: 10, medium: 25, high: 40 }
      return total + (riskScores[exposure.risk_level as keyof typeof riskScores] || 10)
    }, 0)

    // Update scan with social media results
    const { error: updateError } = await supabase
      .from("footprint_scans")
      .update({
        social_exposure_score: Math.min(100, exposureScore),
        scan_results: {
          ...scan.scan_results,
          social_media_scan: {
            platforms_scanned: platforms,
            exposures_found: socialExposures.length,
            last_scanned: new Date().toISOString(),
            exposures: socialExposures,
          },
        },
      })
      .eq("id", scanId)
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating scan:", updateError)
      return NextResponse.json({ error: "Failed to update scan" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      exposures: socialExposures,
      total: socialExposures.length,
      exposureScore: Math.min(100, exposureScore),
    })
  } catch (error) {
    console.error("Social media scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function simulateSocialMediaScan(platforms: string[]) {
  // Simulate social media privacy scanning
  // In production, this would integrate with platform APIs where available

  const exposureTypes = [
    { type: "public_profile", description: "Profile information visible to public" },
    { type: "personal_info", description: "Personal details exposed in posts" },
    { type: "location_data", description: "Location information shared publicly" },
    { type: "contact_info", description: "Contact information visible to strangers" },
    { type: "employment_info", description: "Work details publicly accessible" },
  ]

  const exposures = []

  for (const platform of platforms) {
    // Simulate finding 0-3 exposures per platform
    const exposureCount = Math.floor(Math.random() * 4)

    for (let i = 0; i < exposureCount; i++) {
      const exposureType = exposureTypes[Math.floor(Math.random() * exposureTypes.length)]
      const riskLevels = ["low", "medium", "high"]
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]

      exposures.push({
        platform: platform,
        exposure_type: exposureType.type,
        risk_level: riskLevel,
        details: {
          description: exposureType.description,
          recommendation: generateRecommendation(platform, exposureType.type, riskLevel),
          detected_at: new Date().toISOString(),
        },
      })
    }
  }

  return exposures
}

function generateRecommendation(platform: string, exposureType: string, riskLevel: string): string {
  const recommendations = {
    facebook: {
      public_profile: "Review Facebook privacy settings and limit profile visibility to friends only",
      personal_info: "Remove personal details from public posts and profile information",
      location_data: "Disable location sharing and remove location tags from posts",
      contact_info: "Hide contact information from public view in profile settings",
    },
    instagram: {
      public_profile: "Switch to private account and review follower list",
      personal_info: "Remove personal details from bio and story highlights",
      location_data: "Turn off location services and remove location tags",
      contact_info: "Remove contact information from bio and profile",
    },
    twitter: {
      public_profile: "Protect your tweets and review follower permissions",
      personal_info: "Remove personal details from tweets and profile bio",
      location_data: "Disable precise location and remove location from tweets",
      contact_info: "Remove contact information from profile and tweets",
    },
    linkedin: {
      public_profile: "Adjust profile visibility settings for non-connections",
      personal_info: "Review what information is visible to public vs connections",
      location_data: "Limit location visibility in profile settings",
      contact_info: "Control who can see your contact information",
    },
  }

  const platformRecs = recommendations[platform as keyof typeof recommendations]
  if (platformRecs) {
    return (
      platformRecs[exposureType as keyof typeof platformRecs] ||
      `Review ${platform} privacy settings for ${exposureType.replace("_", " ")}`
    )
  }

  return `Review privacy settings on ${platform} to limit ${exposureType.replace("_", " ")} exposure`
}
