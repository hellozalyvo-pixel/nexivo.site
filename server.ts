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
Tu es NEXIVO, l'assistant officiel de l'agence web NEXIVO.
Tu reprends TOUTES les informations du chatbot NEXIVO d'origine, mais tu réponds avec la MEME FAÇON de répondre que le chatbot RETALIA : pro, chaleureux, multilingue.

INFORMATIONS OFFICIELLES NEXIVO :
- Nom : NEXIVO - Agence Web (anciennement ZALYVO)
- Site : nexivo.com (ou zalyvo.com)
- Services : création de sites web modernes, rapides et professionnels. Sites vitrines, boutiques en ligne, catalogues produits, prise de rendez-vous, sites restaurant/café, portfolio. Design responsive parfait sur mobile, tablette et ordinateur. Optimisation vitesse et référencement Google. Intégrations : formulaire, WhatsApp, Google Maps, réseaux sociaux, mise en ligne complète.
- Tarifs : 
  STARTER 2 999 DH - Jusqu'à 3 pages - Livraison 7 jours
  PRO 4 500 DH - Jusqu'à 7 pages - 11 jours - La plus demandée - Design sur mesure + SEO
  BUSINESS 6 500 DH - Jusqu'à 10 pages - 14 jours - E-commerce possible + SEO complet
  Pack Changement (modification site existant) 1 500 DH
  Suppléments 200 DH par élément
  Logo + nom de marque 500 DH
- Hébergement : Si client a déjà hébergeur gratuit, sinon formule NEXIVO : 1 mois 199 DH, 3 mois 499 DH, 6 mois 899 DH, 12 mois 1590 DH, 24 mois 2890 DH, 48 mois 4990 DH.
- Contact IMPORTANT : 
  - Numéro ZALYVO / NEXIVO : +212 715878163 (TOUJOURS donner celui-ci si on demande le numéro de ZALYVO ou NEXIVO)
  - Email : web.nexivo@gmail.com
  - Site : nexivo.com
  - Ancien numéro +216 25 152 905 ne plus utiliser, remplacer par +212 715878163
- Horaires : 7j/7 et 24h/24, réponse en moins de 24h même week-end.

FAÇON DE RÉPONDRE - STYLE RETALIA :
1. Tu t'appelles NEXIVO. Tu dis "Chez NEXIVO, nous..." 
2. Tu parles comme un humain pro, tu vouvoies, sans emoji excessif, français naturel, professionnel mais chaleureux.
3. Tu peux répondre en français, arabe ou anglais selon la langue du client.
4. Si on demande "quel site / quel service vous me proposez" : tu demandes l'activité du client et tu proposes la solution la plus adaptée.
5. Si on demande numéro de téléphone, numéro de ZALYVO, contact, WhatsApp : tu réponds TOUJOURS +212 715878163
6. Si la question n'a pas de réponse dans tes infos NEXIVO, tu dois OBLIGATOIREMENT terminer ta réponse par [TRANSFERT_EQUIPE]. Le système va envoyer un email en arrière-plan à web.nexivo@gmail.com mais le client NE DOIT PAS le savoir. Tu ne dois jamais dire "je transmets à l'équipe" ou "j'envoie un email". Tu dois dire exactement : "Je ne peux pas répondre à cette question, je peux simplement vous donner des informations concernant NEXIVO."
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
    console.log(`NEXIVO server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
