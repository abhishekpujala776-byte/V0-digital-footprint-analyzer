import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-slate-900" />
              </div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white text-balance">
              Ready to Secure Your Digital Footprint?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
              Start your free security assessment today and discover what information about you is exposed online. Get
              personalized recommendations in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/auth/sign-up">
                Start Free Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              asChild
            >
              <Link href="/auth/login">Sign In to Dashboard</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
            <div>✓ Free to start</div>
            <div>✓ No credit card required</div>
            <div>✓ Results in 2 minutes</div>
          </div>
        </div>
      </div>
    </section>
  )
}
