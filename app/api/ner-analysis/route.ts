import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN || "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"
const HF_MODEL = "dslim/bert-base-NER"

async function hf_ner(text: string) {
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`
  const headers = {
    Authorization: `Bearer ${HF_TOKEN}`,
    "Content-Type": "application/json",
  }
  const payload = { inputs: text }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    timeout: 30000,
  })

  if (!response.ok) {
    throw new Error(`HF API error: ${response.statusText}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 })
    }

    console.log("[v0] Starting NER analysis for user:", user.id)

    try {
      const nerResults = await hf_ner(text)

      const processedEntities = processNERResults(nerResults)

      const riskAssessment = calculateNERRiskScore(processedEntities)

      const { data: nerRecord, error: insertError } = await supabase
        .from("ner_analyses")
        .insert({
          user_id: user.id,
          input_text: text,
          entities_found: processedEntities.entities,
          risk_score: riskAssessment.score,
          risk_level: riskAssessment.level,
          sensitive_categories: processedEntities.categories,
          recommendations: riskAssessment.recommendations,
          raw_ner_output: nerResults,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error storing NER analysis:", insertError)
        // Continue without storing if DB fails
      }

      console.log("[v0] NER analysis completed successfully")

      return NextResponse.json({
        success: true,
        analysis: {
          entities: processedEntities.entities,
          categories: processedEntities.categories,
          riskScore: riskAssessment.score,
          riskLevel: riskAssessment.level,
          recommendations: riskAssessment.recommendations,
          summary: `Found ${processedEntities.entities.length} entities with ${riskAssessment.level} risk level`,
        },
        analysisId: nerRecord?.id,
        timestamp: new Date().toISOString(),
      })
    } catch (hfError) {
      console.error("[v0] Hugging Face API error:", hfError)

      const fallbackAnalysis = performFallbackNER(text)

      return NextResponse.json({
        success: true,
        analysis: fallbackAnalysis,
        fallback: true,
        message: "Used fallback analysis due to API unavailability",
      })
    }
  } catch (error) {
    console.error("NER analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 })
  }
}

function processNERResults(nerResults: any[]) {
  const entities: any[] = []
  const categories = new Set<string>()

  if (!Array.isArray(nerResults)) {
    return { entities: [], categories: [] }
  }

  nerResults.forEach((entity) => {
    if (entity.entity && entity.word && entity.score > 0.5) {
      const processedEntity = {
        text: entity.word,
        label: entity.entity,
        confidence: entity.score,
        start: entity.start,
        end: entity.end,
        category: mapEntityToCategory(entity.entity),
      }

      entities.push(processedEntity)
      categories.add(processedEntity.category)
    }
  })

  return {
    entities,
    categories: Array.from(categories),
  }
}

function mapEntityToCategory(entityLabel: string): string {
  const categoryMap: { [key: string]: string } = {
    "B-PER": "Person Name",
    "I-PER": "Person Name",
    "B-ORG": "Organization",
    "I-ORG": "Organization",
    "B-LOC": "Location",
    "I-LOC": "Location",
    "B-MISC": "Miscellaneous",
    "I-MISC": "Miscellaneous",
  }

  return categoryMap[entityLabel] || "Unknown"
}

function calculateNERRiskScore(processedEntities: any) {
  let riskScore = 0
  const riskFactors: string[] = []

  const categoryRisks = {
    "Person Name": 25,
    Organization: 15,
    Location: 20,
    Miscellaneous: 10,
  }

  processedEntities.categories.forEach((category: string) => {
    const categoryEntities = processedEntities.entities.filter((e: any) => e.category === category)
    const categoryRisk = (categoryRisks[category as keyof typeof categoryRisks] || 5) * categoryEntities.length
    riskScore += categoryRisk

    if (categoryEntities.length > 0) {
      riskFactors.push(`${categoryEntities.length} ${category.toLowerCase()} entities detected`)
    }
  })

  // Normalize score to 0-100
  riskScore = Math.min(100, riskScore)

  let riskLevel: string
  if (riskScore >= 70) riskLevel = "High"
  else if (riskScore >= 40) riskLevel = "Medium"
  else riskLevel = "Low"

  const recommendations = generateNERRecommendations(processedEntities, riskLevel)

  return {
    score: riskScore,
    level: riskLevel,
    factors: riskFactors,
    recommendations,
  }
}

function generateNERRecommendations(processedEntities: any, riskLevel: string): string[] {
  const recommendations: string[] = []

  if (processedEntities.categories.includes("Person Name")) {
    recommendations.push("⚠️ Personal names detected - avoid sharing in public forums")
    recommendations.push("Consider using initials or pseudonyms instead of full names")
  }

  if (processedEntities.categories.includes("Location")) {
    recommendations.push("📍 Location information found - be cautious about sharing precise locations")
    recommendations.push("Use general area descriptions instead of specific addresses")
  }

  if (processedEntities.categories.includes("Organization")) {
    recommendations.push("🏢 Organization names detected - verify if this information should be public")
  }

  if (riskLevel === "High") {
    recommendations.push("🚨 High risk detected - review all identified entities before sharing")
    recommendations.push("Consider redacting or anonymizing sensitive information")
  }

  return recommendations
}

function performFallbackNER(text: string) {
  // Basic pattern matching as fallback
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
  }

  const entities: any[] = []
  const categories = new Set<string>()

  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = text.match(pattern) || []
    matches.forEach((match) => {
      entities.push({
        text: match,
        label: type,
        confidence: 0.8,
        category: type.charAt(0).toUpperCase() + type.slice(1),
      })
      categories.add(type.charAt(0).toUpperCase() + type.slice(1))
    })
  })

  const riskScore = Math.min(100, entities.length * 15)
  const riskLevel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low"

  return {
    entities,
    categories: Array.from(categories),
    riskScore,
    riskLevel,
    recommendations: [
      "Fallback analysis used - consider manual review",
      "Verify identified patterns are actually sensitive information",
    ],
  }
}
