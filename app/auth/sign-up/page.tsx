"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Lock, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasReadPrivacyPolicy, setHasReadPrivacyPolicy] = useState(false)
  const [consentToAnalysis, setConsentToAnalysis] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!hasReadPrivacyPolicy || !consentToAnalysis) {
      setError("Please read and agree to the privacy policy and consent to data analysis")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            privacy_consent: true,
            analysis_consent: consentToAnalysis,
            consent_date: new Date().toISOString(),
          },
        },
      })
      if (error) throw error

      localStorage.setItem("privacy-consent", "true")
      localStorage.setItem("privacy-consent-date", new Date().toISOString())

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-slate-900 rounded-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-600">Start protecting your digital footprint today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Create your account to begin your security assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirm Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900">Privacy & Consent</h3>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">Your Privacy is Protected</p>
                        <p>We only analyze publicly available data and require explicit consent for all processing.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent-analysis"
                        checked={consentToAnalysis}
                        onCheckedChange={(checked) => setConsentToAnalysis(!!checked)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="consent-analysis" className="text-sm cursor-pointer">
                          I consent to digital footprint analysis using public data sources
                        </Label>
                        <div className="flex items-center space-x-1 mt-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            Includes breach databases, public social media, and OSINT sources
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="privacy-policy"
                        checked={hasReadPrivacyPolicy}
                        onCheckedChange={(checked) => setHasReadPrivacyPolicy(!!checked)}
                      />
                      <Label htmlFor="privacy-policy" className="text-sm cursor-pointer">
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
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !hasReadPrivacyPolicy || !consentToAnalysis}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
