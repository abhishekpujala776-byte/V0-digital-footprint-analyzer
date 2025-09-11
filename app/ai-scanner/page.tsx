import { AdvancedScanner } from "@/components/ai-scanner/advanced-scanner"

export default function AIScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Security Scanner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced digital footprint analysis using state-of-the-art Hugging Face models for PII detection, content
            classification, and risk assessment.
          </p>
        </div>
        <AdvancedScanner />
      </div>
    </div>
  )
}
