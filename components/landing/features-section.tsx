import { Card, CardContent } from "@/components/ui/card"
import { Database, Users, Brain, Shield, TrendingUp, AlertTriangle } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Breach Scanning",
      description: "Check your email against 15+ billion compromised records from major data breaches worldwide.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Social Media Privacy Analysis",
      description: "Analyze privacy settings across major platforms to identify potential information exposures.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized security recommendations based on your unique risk profile and behavior patterns.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Shield,
      title: "Real-time Risk Assessment",
      description: "Continuous monitoring and scoring of your digital footprint with instant alerts for new threats.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Privacy Score Tracking",
      description: "Track improvements in your privacy posture over time with detailed analytics and insights.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: AlertTriangle,
      title: "Threat Intelligence",
      description: "Stay informed about emerging threats and vulnerabilities that could affect your digital security.",
      color: "bg-red-100 text-red-600",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-balance">
            Comprehensive Digital Security Analysis
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
            Our platform combines advanced scanning technology with AI-powered insights to give you complete visibility
            into your digital risk exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
