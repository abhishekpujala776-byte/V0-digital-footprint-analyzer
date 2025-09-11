"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, CheckCircle, AlertTriangle, Lock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-orange-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-red-600 text-white hover:bg-red-700">🛑 80% of Cyberattacks Start Here</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight text-balance">
                Your Digital Footprint is
                <span className="text-red-600"> At Risk</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed text-pretty">
                Discover how much of your personal information is exposed online. Get a personalized Digital Risk Score
                and AI-powered action plan to protect yourself from cyber threats.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              {[
                "Email & Phone Breach Detection across millions of records",
                "Social Media Exposure Analysis with privacy recommendations",
                "Dark Web Monitoring for leaked credentials",
                "Personalized Digital Risk Score (0-100) with improvement tracking",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/auth/sign-up">
                  Check My Risk Score
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">No Data Stored</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Explicit Consent Required</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                We only use publicly available data and require your explicit permission before any analysis. Your
                privacy is protected under GDPR, CCPA, and India's DPDP Act.
              </p>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="space-y-6">
                {/* Mock Dashboard Preview */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Digital Risk Assessment</h3>
                  <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    High Risk
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Digital Risk Score</span>
                    <span className="text-3xl font-bold text-red-600">78/100</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-4">
                    <div className="bg-red-500 h-4 rounded-full" style={{ width: "78%" }}></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-lg font-bold text-red-600">4</div>
                      <div className="text-xs text-slate-500">Data Breaches</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="text-lg font-bold text-orange-600">12</div>
                      <div className="text-xs text-slate-500">Exposed Sites</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="text-lg font-bold text-blue-600">6</div>
                      <div className="text-xs text-slate-500">AI Actions</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs font-medium text-slate-700 mb-2">Recent Exposures:</div>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>LinkedIn (2021)</span>
                        <span className="text-red-600">Email + Phone</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Facebook (2019)</span>
                        <span className="text-orange-600">Personal Info</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
