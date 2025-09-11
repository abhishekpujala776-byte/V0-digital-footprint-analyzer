"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-slate-900 text-white hover:bg-slate-800">AI-Powered Security Analysis</Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight text-balance">
                Protect Your
                <span className="text-blue-600"> Digital Footprint</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed text-pretty">
                Discover what personal information is exposed online, assess your privacy risks, and get AI-powered
                recommendations to secure your digital presence.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              {[
                "Scan for data breaches across 15+ billion records",
                "Analyze social media privacy exposures",
                "Get personalized AI security recommendations",
                "Monitor your digital footprint continuously",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800" asChild>
                <Link href="/auth/sign-up">
                  Start Free Scan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Enterprise-grade security</span>
              </div>
              <div>•</div>
              <div>No data stored permanently</div>
              <div>•</div>
              <div>GDPR compliant</div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
              <div className="space-y-6">
                {/* Mock Dashboard Preview */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Risk Assessment</h3>
                  <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Overall Score</span>
                    <span className="text-2xl font-bold text-slate-900">73/100</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: "73%" }}></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-red-600">3</div>
                      <div className="text-xs text-slate-500">Breaches</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-orange-600">5</div>
                      <div className="text-xs text-slate-500">Exposures</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-green-600">8</div>
                      <div className="text-xs text-slate-500">Actions</div>
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
