"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Mail, Users, FileText, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Email Scan",
      description: "Check if your email appears in data breaches",
      icon: Mail,
      href: "/dashboard/new-scan?type=email",
      color: "bg-blue-500",
    },
    {
      title: "Social Media Audit",
      description: "Analyze your social media privacy settings",
      icon: Users,
      href: "/dashboard/new-scan?type=social_media",
      color: "bg-purple-500",
    },
    {
      title: "Full Assessment",
      description: "Comprehensive digital footprint analysis",
      icon: Search,
      href: "/dashboard/new-scan?type=full",
      color: "bg-green-500",
    },
    {
      title: "View Reports",
      description: "Access your previous scan reports",
      icon: FileText,
      href: "/dashboard/reports",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="w-full justify-start h-auto p-4 bg-transparent"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">{action.title}</p>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
