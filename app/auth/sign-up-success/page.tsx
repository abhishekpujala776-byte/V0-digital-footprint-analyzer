import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, Shield } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Check Your Email</h1>
          <p className="text-slate-600">We've sent you a confirmation link</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="w-12 h-12 text-slate-400" />
            </div>
            <CardTitle className="text-xl">Thank you for signing up!</CardTitle>
            <CardDescription>Confirm your email to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 text-center">
              We&apos;ve sent a confirmation email to your inbox. Please click the link in the email to verify your
              account and start using Digital Shield.
            </p>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-slate-900">What's next?</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the confirmation link</li>
                <li>• Start your first security scan</li>
              </ul>
            </div>

            <div className="text-center">
              <Button asChild className="w-full">
                <Link href="/">
                  <Shield className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
