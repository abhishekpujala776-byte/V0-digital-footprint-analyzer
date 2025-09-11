import { type NextRequest, NextResponse } from "next/server"

const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN
const HF_API_BASE = "https://api-inference.huggingface.co/models"

export async function POST(request: NextRequest) {
  try {
    const { text, model, task } = await request.json()

    if (!text || !model || !task) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const modelEndpoints = {
      ner: "dslim/bert-base-NER",
      classification: "facebook/bart-large-mnli",
      embeddings: "sentence-transformers/all-MiniLM-L6-v2",
      ocr: "microsoft/trocr-base-printed",
    }

    const modelName = modelEndpoints[task as keyof typeof modelEndpoints] || model

    const response = await fetch(`${HF_API_BASE}/${modelName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters:
          task === "classification"
            ? {
                candidate_labels: [
                  "medical condition",
                  "financial information",
                  "contact information",
                  "identity information",
                  "political opinion",
                  "personal relationship",
                ],
              }
            : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`)
    }

    const result = await response.json()

    return NextResponse.json({
      model: modelName,
      task,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Hugging Face API error:", error)
    return NextResponse.json({ error: "Failed to process with Hugging Face models" }, { status: 500 })
  }
}
