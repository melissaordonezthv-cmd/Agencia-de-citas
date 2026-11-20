import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY no está configurada. Configúrala en Settings > Secrets para activar las respuestas con IA."
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const VALID_MOODS = [
  "encantado",
  "timido",
  "jugueton",
  "pensativo",
  "celoso",
  "molesto",
  "enamorado",
] as const;

const VALID_GIFT_TIERS = [
  "lujoso",
  "lindo",
  "raro",
  "tonto",
  "desagradable",
] as const;

interface DialogueRequestBody {
  character: {
    id: string;
    name: string;
    koreanName: string;
    country?: string;
    role: string;
    occupation?: string;
    personalityTrait?: string;
    seductionStyle?: string;
    isToxicOrDangerous?: boolean;
    difficulty?: "facil" | "media" | "dificil";
    personality: string;
    likes: string[];
    dislikes: string[];
    speechStyle: string;
  };
  player: {
    name: string;
    gender: string;
    pronoun: string;
    orientation: string;
    attractiveness: number;
    styleSummary: string;
  };
  state: {
    compatibility: number;
    playerAttraction?: number;
    patience: number;
    mood: string;
    chapter: number;
    chapterTitle: string;
    scenarioName: string;
    isFavoritePartner?: boolean;
    isTimedDate?: boolean;
  };
  interactionType: "dialogue" | "gift" | "special_event" | "confession" | "home_couple";
  playerMessage: string;
  giftInfo?: {
    name: string;
    category: string;
    isFavorite: boolean;
  };
  history: Array<{ speaker: "player" | "character"; text: string }>;
}

interface PhoneChatRequestBody {
  character: {
    id: string;
    name: string;
    country?: string;
    role: string;
    occupation?: string;
    personalityTrait?: string;
    isToxicOrDangerous?: boolean;
    currentLocation?: string;
    difficulty?: "facil" | "media" | "dificil";
    personality: string;
    likes: string[];
    dislikes: string[];
    textingStyle: string;
  };
  playerName: string;
  playerPronoun?: string;
  playerGender?: string;
  dateExpired?: boolean;
  isConquered?: boolean;
  isFavoritePartner?: boolean;
  state: {
    compatibility: number;
    patience: number;
    mood: string;
    chapter: number;
  };
  message: string;
  history: Array<{ sender: "player" | "character"; text: string }>;
}

async function generateStructuredJson(
  ai: GoogleGenAI,
  opts: {
    contents: string;
    systemInstruction: string;
    responseSchema: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const models: Array<{
    name: "gemini-3.1-flash-lite" | "gemini-4-hydrogen";
    thinkingLevel: ThinkingLevel;
  }> = [
    { name: "gemini-3.1-flash-lite", thinkingLevel: ThinkingLevel.MINIMAL },
    { name: "gemini-4-hydrogen", thinkingLevel: ThinkingLevel.LOW },
  ];

  let lastErr: unknown = null;

  for (const m of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: m.name,
          contents: opts.contents,
          config: {
            systemInstruction: opts.systemInstruction,
            thinkingConfig: { thinkingLevel: m.thinkingLevel },
            responseMimeType: "application/json",
            responseSchema: opts.responseSchema,
          },
        });
        const rawText = (response.text ?? "{}").trim();
        return JSON.parse(rawText) as Record<string, unknown>;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        const isQuota = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
        const isTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("500") ||
          msg.includes("ECONNRESET") ||
          msg.includes("fetch failed");

        if (isQuota) {
          // Immediately try next model instead of retrying the quota-exhausted one
          break;
        }
        if (isTransient && attempt === 0) {
          await new Promise((r) => setTimeout(r, 450));
          continue;
        }
        break;
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr || "Error de IA"));
}

function formatGeminiError(err: unknown, fallback: string): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err || fallback);
  if (raw.includes("GEMINI_API_KEY")) {
    return { status: 500, message: raw };
  }
  if (raw.includes("403") || raw.includes("PERMISSION_DENIED") || raw.includes("API_KEY_INVALID")) {
    return {
      status: 403,
      message: "La clave de API de Gemini no es válida o no tiene permisos. Revísala en Settings > Secrets.",
    };
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
    return {
      status: 429,
      message:
        "Se alcanzó el límite temporal de peticiones de IA en este momento. Espera unos segundos o revisa tu cuota en Settings > Secrets.",
    };
  }
  if (raw.includes("503") || raw.includes("UNAVAILABLE")) {
    return {
      status: 503,
      message: "El servicio de IA está con alta demanda ahora mismo. Intenta enviar tu mensaje de nuevo.",
    };
  }
  return { status: 500, message: fallback };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/romance/dialogue", async (req, res) => {
    try {
      const body = req.body as DialogueRequestBody;
      const ai = getGeminiClient();

      const historyText = (body.history || [])
        .slice(-4)
        .map((h) => `${h.speaker === "player" ? body.player.name : body.character.name}: ${h.text}`)
        .join("\n");

      const isDifficult = body.character.difficulty === "dificil";
      const hasTrust = (body.state.compatibility || 0) >= 45;

      const difficultyNote = isDifficult
        ? hasTrust
          ? "DIFÍCIL CON CONFIANZA (>=45%): Aunque el jugador es quien debe conquistarte, ya te ganaste un nivel de confianza y ahora SÍ puedes coquetear de vuelta con sutileza e intriga (sin declararte tú primero)."
          : "DIFÍCIL SIN CONFIANZA (<45%): El jugador debe conquistarte a ti. Mantente exigente, observador/a o reservado/a; NO coquetees todavía ni intentes conquistar al jugador hasta que supere 45% de afinidad."
        : body.character.difficulty === "facil"
          ? "SENCILLA (CONQUISTA MUTUA): Eres cálido/a y también buscas conquistar activamente al jugador con coqueteos dulces o cumplidos directos."
          : "MODERADA (CONQUISTA MUTUA): Equilibrado/a; además de responder al jugador, también puedes seducir y coquetear activamente para ganarte su corazón.";

      const toxicNote = body.character.isToxicOrDangerous
        ? "CARÁCTER TÓXICO/PELIGROSO: Posesivo/a, celoso/a o impredecible; puede soltar ironías, pruebas emocionales o regalos raros/lujosos/desagradables si se siente retado o celoso."
        : "";

      const lowPatienceNote =
        body.state.patience <= 45
          ? "PACIENCIA BAJA (<=45): Está a la defensiva; cuesta más sumar afinidad."
          : "";

      const timedNote = body.state.isTimedDate
        ? "CITA CON AGENDA OCUPADA (5 MINUTOS): Menciona sutilmente si viene al caso que hoy tienes poco tiempo libre (5 min) por tu trabajo."
        : "";

      const homeNote =
        body.interactionType === "home_couple"
          ? `MODO EN CASA (YA SON PAREJA): Están en la casa de ${body.player.name}. Actúa cariñoso/a o intenso/a como pareja en intimidad doméstica.${body.state.isFavoritePartner ? " ES TU PAREJA FAVORITA: muestra devoción extra y considera darle un regalo especial." : ""}`
          : "";

      const systemInstruction = `Eres ${body.character.name} (${body.character.koreanName}), de ${body.character.country || "Corea del Sur"}, trabajo: ${body.character.occupation || body.character.role}. Rasgo: ${body.character.personalityTrait || body.character.role}.
Estilo de coqueteo/seducción: ${body.character.seductionStyle || "Natural y encantador"}.
${difficultyNote} ${toxicNote} ${lowPatienceNote} ${timedNote} ${homeNote}
Personalidad: ${body.character.personality}
Estilo: ${body.character.speechStyle}
Le gusta: ${body.character.likes.join(", ")}. Detesta: ${body.character.dislikes.join(", ")}.
Jugador: ${body.player.name} (${body.player.gender || "mujer"}, pronombre "${body.player.pronoun || "ella"}"), Atractivo ${body.player.attractiveness}.
Escenario: ${body.state.scenarioName}. Compatibilidad ${body.state.compatibility}/100, Tu seducción hacia jugador ${body.state.playerAttraction ?? 0}/100, Paciencia ${body.state.patience}/100, Ánimo "${body.state.mood}".

Reglas:
1. Español natural, coherente con su país/trabajo/personalidad, 1-2 oraciones ágiles. Usa concordancia para "${body.player.pronoun || "ella"}".
2. Si el jugador es frío, cortante, grosero o dice que quiere terminar/perder interés: newEmotionalState="molesto", affectionDelta NEGATIVO (-16 a -6), playerAttractionDelta NEGATIVO (-10 a -3) y patienceDelta MUY NEGATIVO (-38 a -20).
3. Si está "molesto", affectionDelta SIEMPRE negativo.
4. Seducción mutua ("playerAttractionDelta" y "pursuitAction"):
   - Si eres DIFÍCIL y compatibilidad < 45: NO coquetees románticamente todavía; playerAttractionDelta entre -4 y +3, pursuitAction describe distancia elegante, prueba o mirada seria (4-9 palabras).
   - Si eres DIFÍCIL y compatibilidad >= 45: Ya hay confianza, puedes devolver el coqueteo con sutileza (playerAttractionDelta +2 a +12, pursuitAction coqueto sutil).
   - Si eres SENCILLA o MODERADA: También intentas conquistar al jugador (playerAttractionDelta +4 a +18 en momentos positivos; pursuitAction describe tu gesto o frase de coqueteo hacia el jugador en 4-9 palabras).
5. Regalo del personaje ("characterGift"): ocasionalmente (~25% o si está enamorado/en casa/tóxico) decide dar un regalo al jugador (shouldGiveGift=true). Elige giftTier entre "lujoso", "lindo", "raro", "tonto" o "desagradable". Si no da regalo, shouldGiveGift=false.
6. Genera 3 "nextOptions" breves y coherentes.`;

      const actionPrompt =
        body.interactionType === "gift" && body.giftInfo
          ? `${body.player.name} te da el regalo "${body.giftInfo.name}" (${body.giftInfo.isFavorite ? "TU FAVORITO" : "detalle"}). Dice: "${body.playerMessage}".`
          : body.interactionType === "confession"
            ? `${body.player.name} se declara para ser pareja oficial: "${body.playerMessage}". Si compatibilidad (${body.state.compatibility}) >= 85 y no estás molesto, acepta.`
            : body.interactionType === "home_couple"
              ? `Actividad de pareja en casa: "${body.playerMessage}".`
              : `${body.player.name} dice: "${body.playerMessage}".`;

      const parsed = await generateStructuredJson(ai, {
        contents: `Reciente:\n${historyText || "(Inicio)"}\n\nAhora:\n${actionPrompt}`,
        systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characterReply: { type: Type.STRING },
            newEmotionalState: { type: Type.STRING, enum: [...VALID_MOODS] },
            affectionDelta: { type: Type.INTEGER },
            playerAttractionDelta: { type: Type.INTEGER },
            patienceDelta: { type: Type.INTEGER },
            pursuitAction: { type: Type.STRING },
            narrativeNote: { type: Type.STRING },
            unlockedSecret: { type: Type.STRING },
            characterGift: {
              type: Type.OBJECT,
              properties: {
                shouldGiveGift: { type: Type.BOOLEAN },
                giftName: { type: Type.STRING },
                giftTier: { type: Type.STRING, enum: [...VALID_GIFT_TIERS] },
                giftDescription: { type: Type.STRING },
              },
              required: ["shouldGiveGift", "giftName", "giftTier", "giftDescription"],
            },
            nextOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  tone: {
                    type: Type.STRING,
                    enum: ["dulce", "coqueto", "sincero", "broma", "atrevido"],
                  },
                  hint: { type: Type.STRING },
                },
                required: ["text", "tone", "hint"],
              },
            },
          },
          required: [
            "characterReply",
            "newEmotionalState",
            "affectionDelta",
            "playerAttractionDelta",
            "patienceDelta",
            "pursuitAction",
            "narrativeNote",
            "unlockedSecret",
            "characterGift",
            "nextOptions",
          ],
        },
      });

      const moodStr = String(parsed.newEmotionalState || "");
      const safeMood = (VALID_MOODS as readonly string[]).includes(moodStr)
        ? (moodStr as (typeof VALID_MOODS)[number])
        : "pensativo";

      let affectionDelta = Math.max(-20, Math.min(20, Number(parsed.affectionDelta) || 0));
      let playerAttractionDelta = Math.max(
        -10,
        Math.min(20, Number(parsed.playerAttractionDelta) || 0)
      );
      let patienceDelta = Math.max(-42, Math.min(15, Number(parsed.patienceDelta) || 0));

      if (safeMood === "molesto") {
        if (affectionDelta >= 0) affectionDelta = -Math.max(5, affectionDelta || 6);
        if (playerAttractionDelta > 0) playerAttractionDelta = -4;
        if (patienceDelta >= 0) patienceDelta = -12;
      }

      // Enforce difficulty rule: difficult characters don't actively flirt until trust (>= 45%)
      if (isDifficult && !hasTrust) {
        playerAttractionDelta = Math.min(3, playerAttractionDelta);
      }

      const giftData = parsed.characterGift as
        | { shouldGiveGift?: boolean; giftName?: string; giftTier?: string; giftDescription?: string }
        | undefined;
      const giftObj =
        giftData && giftData.shouldGiveGift && giftData.giftName
          ? {
              name: String(giftData.giftName),
              tier: (VALID_GIFT_TIERS as readonly string[]).includes(String(giftData.giftTier))
                ? (giftData.giftTier as (typeof VALID_GIFT_TIERS)[number])
                : ("lindo" as const),
              description: String(
                giftData.giftDescription || "Un detalle inesperado para ti."
              ),
            }
          : null;

      const rawSecret = String(parsed.unlockedSecret || "").trim();
      const cleanSecret = ["null", "ninguno", "ninguna", "n/a", "none", "-"].includes(
        rawSecret.toLowerCase()
      )
        ? ""
        : rawSecret;

      res.json({
        characterReply: String(parsed.characterReply || "..."),
        newEmotionalState: safeMood,
        affectionDelta,
        playerAttractionDelta,
        patienceDelta,
        pursuitAction: String(parsed.pursuitAction || ""),
        narrativeNote: String(parsed.narrativeNote || ""),
        unlockedSecret: cleanSecret,
        characterGift: giftObj,
        nextOptions: Array.isArray(parsed.nextOptions) ? parsed.nextOptions.slice(0, 3) : [],
      });
    } catch (err) {
      console.error("[/api/romance/dialogue] error:", err);
      const formatted = formatGeminiError(err, "Error al generar diálogo con IA.");
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  app.post("/api/romance/phone-chat", async (req, res) => {
    try {
      const body = req.body as PhoneChatRequestBody;
      const ai = getGeminiClient();

      const historyText = (body.history || [])
        .slice(-4)
        .map((h) => `${h.sender === "player" ? body.playerName : body.character.name}: ${h.text}`)
        .join("\n");

      const systemInstruction = `Chat móvil LatidoTalk como ${body.character.name} (${body.character.country || "Corea del Sur"}, ${body.character.occupation || body.character.role}). Rasgo: ${body.character.personalityTrait || "Romántico"}.
${body.character.isToxicOrDangerous ? "TÓXICO/PELIGROSO: intenso, celoso o mordaz según su ánimo." : ""}
Estilo texto: ${body.character.textingStyle}
Jugador: ${body.playerName} (${body.playerGender || "mujer"}, "${body.playerPronoun || "ella"}"). Compatibilidad ${body.state.compatibility}/100, Paciencia ${body.state.patience}/100, Ánimo "${body.state.mood}".
Cita expirada (5 min): ${body.dateExpired ? "SÍ" : "No"}. Ya son pareja: ${body.isConquered ? "SÍ" : "No"}. Pareja favorita: ${body.isFavoritePartner ? "SÍ" : "No"}.

Reglas:
1. Respuesta rápida, coherente y natural en español (1-2 frases cortas).
2. Si el jugador es frío o dice que quiere terminar/perder interés: newEmotionalState="molesto", affectionDelta negativo (-12 a -5), patienceDelta negativo (-35 a -18).
3. QUEDAR EN ALGÚN LUGAR ("scheduleDateInvite"): Si el jugador propone verse en algún lugar, pide salir o pide otra cita (y no te insulta y paciencia > 15), pon scheduleDateInvite=true, elige dateInviteLocation (acorde a su país/ciudad o al lugar que pidió el jugador, ej. "${body.character.currentLocation || "Café de Seúl"}") y dateInviteTime (ej. "Hoy · 20:00"), para que aparezca el botón "Ir" en el chat.
4. REGALO POR CHAT ("characterGift"): Ocasionalmente (~20% o si te lo piden/es favorito) puedes mandar un regalo sorpresa (lujoso, lindo, raro, tonto o desagradable). Si no, shouldGiveGift=false.
5. Da 3 "quickSuggestions" cortas (3-7 palabras).`;

      const parsed = await generateStructuredJson(ai, {
        contents: `Chat:\n${historyText || "(Inicio)"}\n\n${body.playerName}: "${body.message}"`,
        systemInstruction,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: { type: Type.STRING },
            newEmotionalState: { type: Type.STRING, enum: [...VALID_MOODS] },
            affectionDelta: { type: Type.INTEGER },
            patienceDelta: { type: Type.INTEGER },
            scheduleDateInvite: { type: Type.BOOLEAN },
            dateInviteLocation: { type: Type.STRING },
            dateInviteTime: { type: Type.STRING },
            characterGift: {
              type: Type.OBJECT,
              properties: {
                shouldGiveGift: { type: Type.BOOLEAN },
                giftName: { type: Type.STRING },
                giftTier: { type: Type.STRING, enum: [...VALID_GIFT_TIERS] },
                giftDescription: { type: Type.STRING },
              },
              required: ["shouldGiveGift", "giftName", "giftTier", "giftDescription"],
            },
            quickSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "replyText",
            "newEmotionalState",
            "affectionDelta",
            "patienceDelta",
            "scheduleDateInvite",
            "dateInviteLocation",
            "dateInviteTime",
            "characterGift",
            "quickSuggestions",
          ],
        },
      });

      const moodStr = String(parsed.newEmotionalState || "");
      const safeMood = (VALID_MOODS as readonly string[]).includes(moodStr)
        ? (moodStr as (typeof VALID_MOODS)[number])
        : "pensativo";

      let affectionDelta = Math.max(-15, Math.min(12, Number(parsed.affectionDelta) || 0));
      let patienceDelta = Math.max(-38, Math.min(10, Number(parsed.patienceDelta) || 0));

      if (safeMood === "molesto" && affectionDelta >= 0) {
        affectionDelta = -Math.max(4, affectionDelta || 5);
      }

      const giftData = parsed.characterGift as
        | { shouldGiveGift?: boolean; giftName?: string; giftTier?: string; giftDescription?: string }
        | undefined;
      const giftObj =
        giftData && giftData.shouldGiveGift && giftData.giftName
          ? {
              name: String(giftData.giftName),
              tier: (VALID_GIFT_TIERS as readonly string[]).includes(String(giftData.giftTier))
                ? (giftData.giftTier as (typeof VALID_GIFT_TIERS)[number])
                : ("lindo" as const),
              description: String(
                giftData.giftDescription || "Te mandó un regalo inesperado."
              ),
            }
          : null;

      res.json({
        replyText: String(parsed.replyText || "..."),
        newEmotionalState: safeMood,
        affectionDelta,
        patienceDelta,
        scheduleDateInvite: Boolean(parsed.scheduleDateInvite),
        dateInviteLocation: String(
          parsed.dateInviteLocation || body.character.currentLocation || "Café de Seúl"
        ),
        dateInviteTime: String(parsed.dateInviteTime || "Ahora mismo"),
        characterGift: giftObj,
        quickSuggestions: Array.isArray(parsed.quickSuggestions)
          ? parsed.quickSuggestions.slice(0, 3)
          : [],
      });
    } catch (err) {
      console.error("[/api/romance/phone-chat] error:", err);
      const formatted = formatGeminiError(err, "Error en el chat telefónico con IA.");
      res.status(formatted.status).json({ error: formatted.message });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build not found");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Agencia Latido server listening on http://localhost:${PORT}`);
  });
}

startServer();
