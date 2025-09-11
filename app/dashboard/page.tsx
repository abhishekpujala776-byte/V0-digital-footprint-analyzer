import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RiskOverview } from "@/components/dashboard/risk-overview"
import { RecentScans } from "@/components/dashboard/recent-scans"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SecurityInsights } from "@/components/dashboard/security-insights"
import { SocialMediaScanner } from "@/components/dashboard/social-media-scanner"
import { NERAnalyzer } from "@/components/dashboard/ner-analyzer"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get recent scans
  const { data: recentScans } = await supabase
    .from("footprint_scans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get latest completed scan for risk overview
  const { data: latestScan } = await supabase
    .from("footprint_scans")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <RiskOverview latestScan={latestScan} />
            <NERAnalyzer />
            <RecentScans scans={recentScans || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SocialMediaScanner />
            <QuickActions />
            <SecurityInsights latestScan={latestScan} />
          </div>
        </div>
      </main>
    </div>
  )
}
