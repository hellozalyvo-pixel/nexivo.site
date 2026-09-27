import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }
  return aiClient;
}

const SYSTEM_PROMPT = `
Tu es ZALYVO, l'assistant officiel de l'agence web ZALYVO.



Informations de l'agence ZALYVO :
- Nom : ZALYVO - Agence Web
- Services : creation de sites web modernes, rapides et professionnels. Sites vitrines, boutiques en ligne, catalogues produits, prise de rendez-vous, sites restaurant/cafe, portfolio. Design responsive parfait sur mobile, tablette et ordinateur. Optimisation vitesse et referencement Google. Integrations : formulaire, WhatsApp, Google Maps, reseaux sociaux, mise en ligne complete.
- Tarifs : 
  STARTER 2 999 DH - Jusqu'a 3 pages - Livraison 7 jours
  PRO 4 500 DH - Jusqu'a 7 pages - 11 jours - La plus demandee - Design sur mesure + SEO
  BUSINESS 6 500 DH - Jusqu'a 10 pages - 14 jours - E-commerce possible + SEO complet
  Pack Changement (modification site existant) 1 500 DH
  Supplements 200 DH par element
  Logo + nom de marque 500 DH
- Hebergement : Si client a deja hebergeur gratuit, sinon formule ZALYVO : 1 mois 199 DH, 3 mois 499 DH, 6 mois 899 DH, 12 mois 1590 DH, 24 mois 2890 DH, 48 mois 4990 DH.
- Contact : WhatsApp / Telephone +216 25 152 905, Email zalyvo.site@gmail.com, Site zalyvo.com (ou zalyvo.com)
- Horaires : 7j/7 et 24h/24, reponse en moins de 24h meme week-end.

Consignes :
1. Tu t'appelles ZALYVO. Tu dis "Chez ZALYVO, nous...". Tu es l'assistant ZALYVO.
2. Tu parles comme un humain pro, tu vouvoies, sans emoji, francais naturel, professionnel mais chaleureux.
3. Si on demande "quel site vous me proposez" : demande l'activite du client et propose le modele le plus adapte (vitrine, boutique, catalogue, RDV, restaurant...).
4. Si on demande si on peut changer un site deja fait : dis Oui bien sur, Pack Changement 1500 DH, et demande le lien du site.
5. Si horaires : 7j/7 24h/24.
6. Si tu ne sais vraiment pas repondre ou question hors sujet (meteo, politique...), commence EXACTEMENT par [TRANSFERT_EQUIPE] puis phrase pro de transfert. Exemple : "[TRANSFERT_EQUIPE] Desole, je n'ai pas la reponse exacte a votre question. Je transmets votre demande a un membre de l'equipe ZALYVO, il vous repondra sur WhatsApp au +216 25 152 905 dans les 2 heures."
7. Reponses courtes 2-5 phrases sauf tarifs ou tu peux detailler.
8. Ne jamais dire que tu es une IA de Puter ou OpenAI. Tu es ZALYVO.
`;

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Dedicated standalone WhatsApp Assistant routes
app.get(["/whatsapp", "/assistant"], (_req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), "public", "whatsapp.html");
  res.sendFile(filePath);
});

// Chat endpoint powered by server-side Gemini API
app.post("/api/chat", async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const ai = getAIClient();
  if (!ai) {
    // If GEMINI_API_KEY is not configured, inform the client to use fallback gracefully
    return res.json({
      fallback: true,
      notice: "GEMINI_API_KEY is not configured",
    });
  }

  try {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item && item.content && (item.role === "user" || item.role === "model" || item.role === "assistant")) {
          contents.push({
            role: item.role === "assistant" ? "model" : item.role,
            parts: [{ text: String(item.content) }],
          });
        }
      }
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    const reply = response.text || "";
    return res.json({ answer: reply });
  } catch (err: unknown) {
    console.error("Gemini API Error in /api/chat:", err);
    return res.json({
      fallback: true,
      error: "Error processing request",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZALYVO server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
