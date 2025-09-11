import { Shield } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Digital Shield</h3>
                <p className="text-sm text-slate-500">Risk Assessment Platform</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Protecting your digital identity with AI-powered security analysis and personalized recommendations.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="#features" className="block text-slate-600 hover:text-slate-900">
                Features
              </Link>
              <Link href="#how-it-works" className="block text-slate-600 hover:text-slate-900">
                How It Works
              </Link>
              <Link href="/pricing" className="block text-slate-600 hover:text-slate-900">
                Pricing
              </Link>
              <Link href="/api-docs" className="block text-slate-600 hover:text-slate-900">
                API Documentation
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-slate-600 hover:text-slate-900">
                About Us
              </Link>
              <Link href="/blog" className="block text-slate-600 hover:text-slate-900">
                Blog
              </Link>
              <Link href="/careers" className="block text-slate-600 hover:text-slate-900">
                Careers
              </Link>
              <Link href="/contact" className="block text-slate-600 hover:text-slate-900">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block text-slate-600 hover:text-slate-900">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-slate-600 hover:text-slate-900">
                Terms of Service
              </Link>
              <Link href="/security" className="block text-slate-600 hover:text-slate-900">
                Security
              </Link>
              <Link href="/compliance" className="block text-slate-600 hover:text-slate-900">
                Compliance
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© 2024 Digital Shield. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-slate-500 text-sm">Made with security in mind</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
