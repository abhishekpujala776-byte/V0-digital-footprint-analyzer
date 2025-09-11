"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Digital Shield</h1>
              <p className="text-xs text-slate-500">Risk Assessment Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">
              Testimonials
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
