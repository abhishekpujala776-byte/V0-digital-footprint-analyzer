import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Digital Footprint Risk Analyzer - Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                The Digital Footprint Risk Analyzer ("we," "our," or "us") is committed to protecting your privacy and
                personal data. This Privacy Policy explains how we collect, use, and protect your information when you
                use our digital security assessment service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Data We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-slate-800">Information You Provide:</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                  <li>Email address for breach scanning</li>
                  <li>Account information (name, email) if you create an account</li>
                  <li>Social media usernames (optional, for privacy analysis)</li>
                </ul>

                <h3 className="text-lg font-medium text-slate-800">Information We Generate:</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                  <li>Digital risk scores and assessments</li>
                  <li>Security recommendations</li>
                  <li>Scan results and findings</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How We Use Your Data</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                <li>
                  <strong>Security Analysis:</strong> Check your email against publicly known breach databases
                </li>
                <li>
                  <strong>Risk Assessment:</strong> Generate personalized digital risk scores
                </li>
                <li>
                  <strong>AI Recommendations:</strong> Provide tailored security improvement suggestions
                </li>
                <li>
                  <strong>Service Improvement:</strong> Enhance our analysis algorithms (anonymized data only)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Data Sources</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                We only use publicly available data sources and legitimate security databases:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li>HaveIBeenPwned and similar breach notification services</li>
                <li>Public social media profiles (only what's publicly visible)</li>
                <li>Open source intelligence (OSINT) databases</li>
                <li>Publicly disclosed security vulnerabilities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Protection & Security</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">🔒 Security Measures:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• End-to-end encryption for all data transmission</li>
                  <li>• Secure cloud infrastructure with SOC 2 compliance</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Minimal data retention (30 days maximum)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Your Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                Under GDPR, CCPA, and India's DPDP Act, you have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Correct inaccurate personal data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a machine-readable format
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Revoke permission for data processing at any time
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Data Retention</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>Minimal Retention Policy:</strong> We automatically delete scan results after 30 days unless
                  you explicitly consent to longer retention for tracking improvements. Account data is retained only
                  while your account is active.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Third-Party Services</h2>
              <p className="text-slate-700 leading-relaxed">
                We may use trusted third-party services for breach data (like HaveIBeenPwned) and cloud infrastructure.
                These services are bound by strict data processing agreements and cannot access your personal
                information beyond what's necessary for the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Contact Us</h2>
              <p className="text-slate-700 leading-relaxed">
                For privacy-related questions, data requests, or to exercise your rights:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-3">
                <p className="text-slate-700 text-sm">
                  <strong>Privacy Officer:</strong> privacy@digitalfootprintanalyzer.com
                  <br />
                  <strong>Data Protection Officer:</strong> dpo@digitalfootprintanalyzer.com
                  <br />
                  <strong>Response Time:</strong> Within 30 days as required by law
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We'll
                notify you of significant changes via email or prominent notice on our website.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
