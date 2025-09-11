import { type NextRequest, NextResponse } from "next/server"

// Enhanced PII entity types
const PII_ENTITY_TYPES = {
  PER: "Person Name",
  ORG: "Organization",
  LOC: "Location",
  EMAIL: "Email Address",
  PHONE: "Phone Number",
  SSN: "Social Security Number",
  CREDIT: "Credit Card Number",
  DATE: "Date of Birth",
  ADDR: "Physical Address",
}

const RISK_LEVELS = {
  EMAIL: "medium",
  PHONE: "medium",
  SSN: "high",
  CREDIT: "critical",
  PER: "low",
  ORG: "low",
  LOC: "low",
  DATE: "high",
  ADDR: "high",
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // For now, use the base model with enhanced processing
    // In production, this would use your fine-tuned model
    const HF_TOKEN = process.env.HF_TOKEN || "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"
    const HF_MODEL = "dslim/bert-base-NER"

    const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`
    const headers = { Authorization: `Bearer ${HF_TOKEN}` }
    const payload = { inputs: text }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`)
    }

    const nerResults = await response.json()

    // Enhanced processing to detect additional PII patterns
    const enhancedResults = await enhanceWithPatternMatching(text, nerResults)

    // Calculate risk assessment
    const riskAssessment = calculateRiskAssessment(enhancedResults)

    return NextResponse.json({
      entities: enhancedResults,
      riskAssessment,
      recommendations: generateRecommendations(enhancedResults),
      summary: generateSummary(enhancedResults),
    })
  } catch (error) {
    console.error("Enhanced NER API error:", error)
    return NextResponse.json({ error: "Failed to analyze text for PII" }, { status: 500 })
  }
}

async function enhanceWithPatternMatching(text: string, baseResults: any[]) {
  const enhanced = [...baseResults]

  // Email pattern matching
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emailMatches = text.matchAll(emailRegex)

  for (const match of emailMatches) {
    enhanced.push({
      entity_group: "EMAIL",
      confidence: 0.95,
      word: match[0],
      start: match.index,
      end: match.index! + match[0].length,
    })
  }

  // Phone number pattern matching
  const phoneRegex = /(\+?1[-.\s]?)?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g
  const phoneMatches = text.matchAll(phoneRegex)

  for (const match of phoneMatches) {
    enhanced.push({
      entity_group: "PHONE",
      confidence: 0.9,
      word: match[0],
      start: match.index,
      end: match.index! + match[0].length,
    })
  }

  // SSN pattern matching
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g
  const ssnMatches = text.matchAll(ssnRegex)

  for (const match of ssnMatches) {
    enhanced.push({
      entity_group: "SSN",
      confidence: 0.98,
      word: match[0],
      start: match.index,
      end: match.index! + match[0].length,
    })
  }

  // Credit card pattern matching
  const creditRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
  const creditMatches = text.matchAll(creditRegex)

  for (const match of creditMatches) {
    enhanced.push({
      entity_group: "CREDIT",
      confidence: 0.92,
      word: match[0],
      start: match.index,
      end: match.index! + match[0].length,
    })
  }

  return enhanced.map((entity) => ({
    ...entity,
    entity_type: PII_ENTITY_TYPES[entity.entity_group as keyof typeof PII_ENTITY_TYPES] || entity.entity_group,
    risk_level: RISK_LEVELS[entity.entity_group as keyof typeof RISK_LEVELS] || "low",
  }))
}

function calculateRiskAssessment(entities: any[]) {
  const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 }

  entities.forEach((entity) => {
    riskCounts[entity.risk_level as keyof typeof riskCounts]++
  })

  let overallRisk = "low"
  if (riskCounts.critical > 0) overallRisk = "critical"
  else if (riskCounts.high > 0) overallRisk = "high"
  else if (riskCounts.medium > 0) overallRisk = "medium"

  return {
    overall_risk: overallRisk,
    risk_breakdown: riskCounts,
    total_entities: entities.length,
    privacy_score: Math.max(
      0,
      100 - (riskCounts.critical * 40 + riskCounts.high * 20 + riskCounts.medium * 10 + riskCounts.low * 2),
    ),
  }
}

function generateRecommendations(entities: any[]) {
  const recommendations = []

  const hasHighRisk = entities.some((e) => ["high", "critical"].includes(e.risk_level))
  const hasMediumRisk = entities.some((e) => e.risk_level === "medium")

  if (hasHighRisk) {
    recommendations.push({
      type: "critical",
      message: "Remove or redact high-risk personal information before sharing",
      action: "Immediately remove SSN, credit card numbers, and sensitive dates",
    })
  }

  if (hasMediumRisk) {
    recommendations.push({
      type: "warning",
      message: "Consider masking contact information",
      action: "Replace email addresses and phone numbers with placeholders",
    })
  }

  recommendations.push({
    type: "info",
    message: "Always verify recipient permissions before sharing personal data",
    action: "Ensure proper consent and data handling agreements are in place",
  })

  return recommendations
}

function generateSummary(entities: any[]) {
  const entityCounts = entities.reduce(
    (acc, entity) => {
      acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    total_pii_found: entities.length,
    entity_breakdown: entityCounts,
    most_common: Object.entries(entityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
  }
}
