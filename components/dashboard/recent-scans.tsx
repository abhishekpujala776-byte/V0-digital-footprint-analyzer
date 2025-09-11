"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface RecentScansProps {
  scans: any[]
}

export function RecentScans({ scans }: RecentScansProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Recent Scans</span>
          </CardTitle>
          <Button asChild size="sm">
            <Link href="/dashboard/new-scan">New Scan</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {scans.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Scans Yet</h3>
            <p className="text-slate-500 mb-4">Start your first digital footprint scan to analyze your online risk.</p>
            <Button asChild>
              <Link href="/dashboard/new-scan">Start First Scan</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(scan.status)}
                  <div>
                    <h4 className="font-medium text-slate-900 capitalize">{scan.scan_type.replace("_", " ")} Scan</h4>
                    <p className="text-sm text-slate-500">
                      {new Date(scan.created_at).toLocaleDateString()} at{" "}
                      {new Date(scan.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(scan.status)}>{scan.status}</Badge>
                  {scan.status === "completed" && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">Risk: {scan.risk_score}/100</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/scan/${scan.id}`}>View Results</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
