import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NERAnalyzer } from "@/components/dashboard/ner-analyzer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NERAnalysisPage() {
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

  // Get recent NER analyses
  const { data: recentAnalyses } = await supabase
    .from("ner_analyses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Text Privacy Analysis</h1>
              <p className="text-slate-600">Identify personal information in your text using AI-powered analysis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main NER Analyzer */}
          <div className="lg:col-span-2">
            <NERAnalyzer />
          </div>

          {/* Sidebar with recent analyses and tips */}
          <div className="space-y-6">
            {/* Privacy Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">What we detect:</p>
                  <ul className="mt-1 text-blue-800 space-y-1">
                    <li>• Person names</li>
                    <li>• Organizations</li>
                    <li>• Locations</li>
                    <li>• Email addresses</li>
                    <li>• Phone numbers</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">Best practices:</p>
                  <ul className="mt-1 text-green-800 space-y-1">
                    <li>• Use initials instead of full names</li>
                    <li>• Avoid specific addresses</li>
                    <li>• Consider pseudonyms for public posts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent Analyses */}
            {recentAnalyses && recentAnalyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>Your latest text privacy scans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Risk: {analysis.risk_level}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {analysis.input_text.substring(0, 60)}...
                      </p>
                      <div className="flex gap-1 mt-2">
                        {analysis.sensitive_categories?.slice(0, 2).map((category: string) => (
                          <span key={category} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
