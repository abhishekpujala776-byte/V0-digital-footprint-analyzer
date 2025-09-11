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

    // Get user profile to access email and phone
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const linkedAccounts = await simulateLinkedAccountsScan(user.email, profile?.phone)

    return NextResponse.json({
      success: true,
      accounts: linkedAccounts,
      total: linkedAccounts.length,
    })
  } catch (error) {
    console.error("Social media scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function simulateLinkedAccountsScan(email: string, phone?: string) {
  const platforms = ["Facebook", "Instagram", "Twitter", "LinkedIn", "TikTok", "Snapchat"]
  const linkedAccounts = []

  // Simulate finding 2-5 linked accounts
  const accountCount = Math.floor(Math.random() * 4) + 2

  for (let i = 0; i < accountCount; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const username = generateUsername(email)
    const riskLevel = ["low", "medium", "high"][Math.floor(Math.random() * 3)]
    const privacyScore = Math.floor(Math.random() * 100)
    const issues = generateIssues(platform, riskLevel)

    linkedAccounts.push({
      platform,
      username,
      riskLevel,
      privacyScore,
      issues,
    })
  }

  return linkedAccounts
}

function generateUsername(email: string): string {
  const baseUsername = email.split("@")[0]
  const variations = [
    baseUsername,
    `${baseUsername}${Math.floor(Math.random() * 100)}`,
    `${baseUsername}_official`,
    `${baseUsername}.real`,
  ]
  return variations[Math.floor(Math.random() * variations.length)]
}

function generateIssues(platform: string, riskLevel: string): string[] {
  const allIssues = {
    Facebook: [
      "Profile photo visible to public",
      "Personal information in bio exposed",
      "Location data shared in posts",
      "Phone number visible to strangers",
      "Work information publicly accessible",
    ],
    Instagram: [
      "Account is public with personal photos",
      "Location tags enabled on posts",
      "Contact information in bio",
      "Stories visible to non-followers",
      "Personal details in highlights",
    ],
    Twitter: [
      "Tweets are public with personal info",
      "Location services enabled",
      "Email address discoverable",
      "Personal conversations visible",
      "Sensitive media not filtered",
    ],
    LinkedIn: [
      "Full profile visible to public",
      "Contact information exposed",
      "Current location displayed",
      "Employment history detailed",
      "Connections list visible",
    ],
    TikTok: [
      "Videos contain personal information",
      "Location visible in videos",
      "Account linked to phone number",
      "Comments from strangers enabled",
      "Profile shows real name",
    ],
    Snapchat: [
      "Location sharing enabled",
      "Phone number linked publicly",
      "Snap Map location visible",
      "Stories visible to all contacts",
      "Username linked to real identity",
    ],
  }

  const platformIssues = allIssues[platform as keyof typeof allIssues] || []

  let issueCount = 0
  if (riskLevel === "high") issueCount = Math.floor(Math.random() * 3) + 3
  else if (riskLevel === "medium") issueCount = Math.floor(Math.random() * 2) + 2
  else issueCount = Math.floor(Math.random() * 2)

  return platformIssues.slice(0, issueCount)
}
