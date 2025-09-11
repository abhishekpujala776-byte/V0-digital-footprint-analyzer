// TypeScript interfaces for risk assessment
export interface BreachData {
  id: string
  breach_name: string
  breach_date: Date | null
  data_types: string[]
  severity: "low" | "medium" | "high" | "critical"
}

export interface SocialExposure {
  id: string
  platform: string
  exposure_type: string
  risk_level: "low" | "medium" | "high"
  details: Record<string, any>
}

export interface RiskAssessment {
  overall_score: number
  risk_level: "low" | "medium" | "high" | "critical"
  breach_risk: {
    score: number
    breach_count: number
    details: any[]
  }
  social_risk: {
    score: number
    exposure_count: number
    details: any[]
  }
  privacy_score: number
  recommendations: string[]
  summary: string
}

export class RiskCalculator {
  static calculateRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score >= 80) return "critical"
    if (score >= 60) return "high"
    if (score >= 40) return "medium"
    return "low"
  }

  static getRiskColor(level: string): string {
    const colors = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-orange-600",
      critical: "text-red-600",
    }
    return colors[level as keyof typeof colors] || "text-gray-600"
  }

  static getRiskBgColor(level: string): string {
    const colors = {
      low: "bg-green-100",
      medium: "bg-yellow-100",
      high: "bg-orange-100",
      critical: "bg-red-100",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100"
  }
}
