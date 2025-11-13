import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fonction pour nettoyer la réponse JSON (enlever markdown)
function cleanJsonResponse(text: string): string {
  // Enlever les backticks markdown si présents
  let cleaned = text.trim();

  // Pattern: ```json\n{...}\n```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return cleaned.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image manquante" },
        { status: 400 }
      );
    }

    // Extraire le base64 (enlever le prefix data:image/...)
    const base64Data = image.includes("base64,")
      ? image.split("base64,")[1]
      : image;

    // Détecter le type MIME
    const imageMatch = image.match(/data:(image\/\w+);base64,/);
    const mediaType = imageMatch
      ? (imageMatch[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp")
      : "image/jpeg";

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: `Tu es un expert nutritionniste. Analyse cette photo de repas et identifie tous les aliments visibles.

Pour CHAQUE aliment, estime:
- Nom en français
- Quantité (nombre avec unité: g, ml, pièce, etc.)
- Valeurs nutritionnelles: calories, protéines, glucides, lipides, fibres
- Confiance de l'estimation (0.0 à 1.0)

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans backticks, sans markdown.
Ne commence PAS par \`\`\`json et ne termine PAS par \`\`\`.
Retourne directement l'objet JSON qui commence par { et finit par }.

Format exact:
{
  "foods": [
    {
      "name": "nom de l'aliment",
      "quantity": nombre,
      "unit": "g",
      "calories": nombre,
      "protein": nombre,
      "carbs": nombre,
      "fat": nombre,
      "fiber": nombre,
      "confidence": 0.0-1.0
    }
  ],
  "total": {
    "calories": somme,
    "protein": somme,
    "carbs": somme,
    "fat": somme,
    "fiber": somme
  },
  "confidence": moyenne,
  "notes": "brève description du repas"
}`,
            },
          ],
        },
      ],
    });

    // Extraire le texte de la réponse
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    console.log("🤖 Claude raw response:", responseText.substring(0, 200));

    // Nettoyer la réponse (enlever markdown si présent)
    const cleanedResponse = cleanJsonResponse(responseText);

    console.log("🧹 Cleaned response:", cleanedResponse.substring(0, 200));

    // Parser le JSON
    const analysis = JSON.parse(cleanedResponse);

    console.log("✅ Parsed successfully:", {
      foodsCount: analysis.foods?.length,
      totalCalories: analysis.total?.calories,
    });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Erreur analyse repas:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'analyse",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
