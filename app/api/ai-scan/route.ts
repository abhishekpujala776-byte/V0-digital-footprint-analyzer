import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const text = formData.get("text") as string
    const files = formData.getAll("files") as File[]
    const scanType = (formData.get("scanType") as string) || "comprehensive"

    const aiScanResponse = await fetch(`${process.env.AI_SCANNER_URL}/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_SCANNER_TOKEN}`,
      },
      body: JSON.stringify({
        text,
        files: files.map((f) => f.name), // In production, upload files to storage first
        scanType,
        userId: user.id,
      }),
    })

    if (!aiScanResponse.ok) {
      throw new Error("AI scanner service unavailable")
    }

    const aiResults = await aiScanResponse.json()

    const { data: scanRecord, error } = await supabase
      .from("ai_scans")
      .insert({
        user_id: user.id,
        scan_type: scanType,
        input_text: text,
        pii_entities: aiResults.pii_entities,
        sensitive_categories: aiResults.sensitive_categories,
        risk_score: aiResults.risk_score,
        recommendations: aiResults.recommendations,
        leak_matches: aiResults.leak_matches,
        ocr_results: aiResults.ocr_results,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save scan results" }, { status: 500 })
    }

    return NextResponse.json({
      scanId: scanRecord.id,
      riskScore: aiResults.risk_score,
      piiEntities: aiResults.pii_entities,
      sensitiveCategories: aiResults.sensitive_categories,
      recommendations: aiResults.recommendations,
      leakMatches: aiResults.leak_matches,
      ocrResults: aiResults.ocr_results,
      timestamp: scanRecord.created_at,
    })
  } catch (error) {
    console.error("AI scan error:", error)
    return NextResponse.json({ error: "Failed to process AI scan" }, { status: 500 })
  }
}
