import { Suspense } from "react"
import EnhancedPIIAnalyzer from "@/components/dashboard/enhanced-pii-analyzer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function EnhancedPIIPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enhanced PII Detection</h1>
        <p className="text-muted-foreground">
          Advanced analysis using fine-tuned models to detect comprehensive personal information
        </p>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        }
      >
        <EnhancedPIIAnalyzer />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>About Enhanced PII Detection</CardTitle>
          <CardDescription>Understanding our advanced privacy analysis capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Detection Capabilities</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Names and personal identifiers</li>
              <li>Email addresses and phone numbers</li>
              <li>Social Security Numbers (SSN)</li>
              <li>Credit card numbers</li>
              <li>Physical addresses</li>
              <li>Dates of birth and sensitive dates</li>
              <li>Organization and location names</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Risk Assessment</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-red-600">Critical:</span> SSN, Credit Cards
              </li>
              <li>
                <span className="font-medium text-orange-600">High:</span> Addresses, Birth Dates
              </li>
              <li>
                <span className="font-medium text-yellow-600">Medium:</span> Email, Phone Numbers
              </li>
              <li>
                <span className="font-medium text-green-600">Low:</span> Names, Organizations
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
