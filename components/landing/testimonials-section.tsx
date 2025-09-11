import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "Digital Shield helped me discover that my email was in 3 data breaches I didn't know about. The AI recommendations were spot-on and easy to follow.",
      rating: 5,
      avatar: "/professional-woman-diverse.png",
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer",
      company: "StartupXYZ",
      content:
        "The social media privacy analysis was eye-opening. I had no idea how much personal information was publicly visible. Fixed everything in under an hour.",
      rating: 5,
      avatar: "/professional-man.png",
    },
    {
      name: "Emily Johnson",
      role: "Freelance Designer",
      company: "Independent",
      content:
        "As a freelancer, protecting my digital identity is crucial. This platform gives me peace of mind and actionable steps to stay secure online.",
      rating: 5,
      avatar: "/creative-woman.png",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-balance">
            Trusted by Security-Conscious Professionals
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
            Join thousands of users who have taken control of their digital security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-slate-200">
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-slate-700 leading-relaxed">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
