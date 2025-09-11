import { Badge } from "@/components/ui/badge"
import { Search, Brain, Shield } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      icon: Search,
      title: "Comprehensive Scan",
      description:
        "We scan your email across breach databases and analyze your social media privacy settings to identify potential exposures.",
      color: "bg-blue-500",
    },
    {
      step: 2,
      icon: Brain,
      title: "AI Analysis",
      description:
        "Our AI engine analyzes your risk profile, considering breach severity, data types, and behavioral patterns to calculate your risk score.",
      color: "bg-purple-500",
    },
    {
      step: 3,
      icon: Shield,
      title: "Personalized Action Plan",
      description:
        "Receive tailored recommendations prioritized by urgency, with step-by-step guidance to improve your digital security posture.",
      color: "bg-green-500",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-slate-900 text-white">How It Works</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-balance">
            Three Steps to Digital Security
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
            Our streamlined process makes it easy to understand and improve your digital security posture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-slate-300 z-0"
                  style={{ width: "calc(100% - 2rem)", left: "2rem" }}
                />
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200 z-10">
                <div className="space-y-6">
                  {/* Step Number & Icon */}
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {step.step}
                    </div>
                    <div
                      className={`w-12 h-12 ${step.color.replace("bg-", "bg-").replace("-500", "-100")} rounded-lg flex items-center justify-center`}
                    >
                      <step.icon className={`w-6 h-6 ${step.color.replace("bg-", "text-")}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
