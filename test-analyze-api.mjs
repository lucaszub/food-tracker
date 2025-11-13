#!/usr/bin/env node
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_URL = "http://localhost:3001/api/analyze-meal";
const IMAGE_PATH = join(__dirname, "public/foodtest.png");

console.log("🧪 Test de l'API d'analyse de repas\n");

try {
  // 1. Lire l'image
  console.log("📸 Lecture de l'image:", IMAGE_PATH);
  const imageBuffer = readFileSync(IMAGE_PATH);
  const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  console.log("✅ Image convertie en base64 (" + (base64Image.length / 1024).toFixed(1) + " KB)\n");

  // 2. Appeler l'API
  console.log("📡 Appel de l'API:", API_URL);
  const startTime = Date.now();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  const duration = Date.now() - startTime;
  console.log(`⏱️  Réponse reçue en ${duration}ms\n`);

  // 3. Vérifier la réponse
  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Erreur HTTP:", response.status);
    console.error("Détails:", errorData);
    process.exit(1);
  }

  const data = await response.json();

  // 4. Afficher les résultats
  console.log("✅ Analyse réussie!\n");

  if (data.analysis) {
    const { foods, total, confidence, notes } = data.analysis;

    console.log("📊 RÉSUMÉ NUTRITIONNEL");
    console.log("─".repeat(50));
    console.log(`Calories totales: ${total.calories} kcal`);
    console.log(`Protéines: ${total.protein}g`);
    console.log(`Glucides: ${total.carbs}g`);
    console.log(`Lipides: ${total.fat}g`);
    console.log(`Fibres: ${total.fiber}g`);
    console.log(`Confiance: ${(confidence * 100).toFixed(0)}%`);
    console.log(`Notes: ${notes}\n`);

    console.log("🍽️  ALIMENTS DÉTECTÉS (" + foods.length + ")");
    console.log("─".repeat(50));
    foods.forEach((food, idx) => {
      console.log(
        `${idx + 1}. ${food.name} (${food.quantity}${food.unit}) - ${food.calories} kcal`
      );
      console.log(
        `   P:${food.protein}g  G:${food.carbs}g  L:${food.fat}g  F:${food.fiber}g  [${(
          food.confidence * 100
        ).toFixed(0)}%]`
      );
    });

    console.log("\n🎉 TEST RÉUSSI!");
  } else {
    console.error("⚠️  Pas de données d'analyse dans la réponse");
    console.log("Réponse complète:", JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error("\n❌ ERREUR:", error.message);
  if (error.cause) {
    console.error("Cause:", error.cause);
  }
  process.exit(1);
}
