import React, { useEffect, useRef, useState } from "react";
import { Award, Coins, Heart, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import {
  ACHIEVEMENTS,
  BACKDROPS,
  CHARACTERS,
  DATE_DURATION_SECONDS,
  DIFFICULTY_META,
  GIFT_CATALOG,
  GIFT_TIER_META,
  RANDOM_EVENTS,
  WARDROBE_ITEMS,
  calculateAttractiveness,
  createInitialGameState,
  createInitialProgress,
  getCharacterChapter,
  getFilteredCharacters,
  rollTimedDate,
} from "./data/gameData";
import {
  ActiveModal,
  ActiveRoom,
  ChibiAppearance,
  ConquestCelebrationData,
  DatePreference,
  DialogueOption,
  EmotionalState,
  GameSaveState,
  GiftTier,
  PhotoRecord,
  PlayerGender,
  PlayerPronoun,
  RandomEventChoice,
  ReceivedGiftRecord,
  SexualOrientation,
} from "./types/game";
import { sfx } from "./utils/sound";
import { BedroomStudio } from "./components/BedroomStudio";
import { OfficeScene } from "./components/OfficeScene";
import { CameraModal } from "./components/CameraModal";
import { InventoryModal } from "./components/InventoryModal";
import { PhoneModal } from "./components/PhoneModal";
import { NotebookModal } from "./components/NotebookModal";
import { RosterModal } from "./components/RosterModal";
import { AchievementsModal } from "./components/AchievementsModal";
import { RandomEventCard } from "./components/RandomEventCard";
import { ConquestCelebrationModal } from "./components/ConquestCelebrationModal";

const STORAGE_KEY = "agencia_latido_save_v2";

function loadSavedState(): GameSaveState {
  const defaults = createInitialGameState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("agencia_latido_save_v1");
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<GameSaveState>;
    const mergedProgress = { ...defaults.characterProgress };
    CHARACTERS.forEach((char) => {
      if (parsed.characterProgress && parsed.characterProgress[char.id]) {
        const saved = parsed.characterProgress[char.id];
        mergedProgress[char.id] = {
          ...defaults.characterProgress[char.id],
          ...saved,
          playerAttraction: saved.playerAttraction ?? 0,
          npcConfessing: saved.npcConfessing ?? false,
          isTimedDate: saved.isTimedDate ?? false,
          dateSecondsLeft: saved.dateSecondsLeft ?? DATE_DURATION_SECONDS,
          contactAdded: true,
        };
      }
    });

    const mergedWardrobe = Array.from(
      new Set([...(defaults.unlockedWardrobeIds || []), ...(parsed.unlockedWardrobeIds || [])])
    );

    const safePhotos = Array.isArray(parsed.photos)
      ? parsed.photos.map((ph) => ({
          ...ph,
          characterSnapshot:
            ph.characterSnapshot ||
            CHARACTERS.find((c) => c.id === ph.characterId)?.appearance ||
            defaults.playerAppearance,
        }))
      : [];

    return {
      ...defaults,
      ...parsed,
      photos: safePhotos,
      favoriteCharacterId: parsed.favoriteCharacterId ?? null,
      homePartnerId: parsed.homePartnerId ?? null,
      receivedGifts: parsed.receivedGifts || [],
      playerAppearance: {
        ...defaults.playerAppearance,
        ...(parsed.playerAppearance || {}),
        mouthStyle:
          parsed.playerAppearance?.mouthStyle || defaults.playerAppearance.mouthStyle,
        faceMark:
          parsed.playerAppearance?.faceMark || defaults.playerAppearance.faceMark,
      },
      unlockedWardrobeIds: mergedWardrobe,
      characterProgress: mergedProgress,
      unlockedAchievementIds: parsed.unlockedAchievementIds || [],
    };
  } catch {
    return defaults;
  }
}

function nowTimeLabel(): string {
  const d = new Date();
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function computeAchievementCounts(state: GameSaveState): Record<string, number> {
  const unlockedCharsCount = Object.values(state.characterProgress).filter(
    (p) => p.unlocked
  ).length;
  // Starter unlocked = 2 (or 1), count unlocked characters beyond initial starter (or total unlocked - 1)
  const unlockedNewCharacters = Math.max(0, unlockedCharsCount - 1);

  return {
    primer_romance: state.totalRelationshipsCompleted,
    maestro_citas: state.totalRelationshipsCompleted,
    desbloqueador_personajes: unlockedNewCharacters,
    icono_estilo: calculateAttractiveness(state.playerAppearance),
    corazon_generoso: state.totalGiftsGiven,
    mediador_experto: state.resolvedNegativeEvents,
    fotografo_seul: state.photos.length,
    estrella_chat: state.totalPhoneMessages,
  };
}

export default function App() {
  const [game, setGame] = useState<GameSaveState>(loadSavedState);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isHomeLoading, setIsHomeLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [conquestCelebration, setConquestCelebration] =
    useState<ConquestCelebrationData | null>(null);
  const [bannerNotice, setBannerNotice] = useState<{
    title: string;
    detail: string;
  } | null>(null);
  const prevStatusRef = useRef<{ charId: string; status: string } | null>(null);

  const showNotice = (title: string, detail: string) => {
    setBannerNotice({ title, detail });
    setTimeout(() => {
      setBannerNotice((prev) => (prev?.title === title ? null : prev));
    }, 5600);
  };

  // Persist save state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch {
      // Ignore storage errors
    }
  }, [game]);

  // Automatic Achievement Evaluator
  useEffect(() => {
    const counts = computeAchievementCounts(game);
    const newlyUnlocked = ACHIEVEMENTS.filter(
      (ach) =>
        !game.unlockedAchievementIds.includes(ach.id) &&
        (counts[ach.id] || 0) >= ach.target
    );

    if (newlyUnlocked.length > 0) {
      let extraTokens = 0;
      const extraInventory = { ...game.inventory };
      const extraWardrobe = [...game.unlockedWardrobeIds];

      newlyUnlocked.forEach((ach) => {
        extraTokens += ach.rewardTokens;
        if (ach.rewardGiftId) {
          extraInventory[ach.rewardGiftId] = (extraInventory[ach.rewardGiftId] || 0) + 1;
        }
        if (ach.rewardWardrobeId && !extraWardrobe.includes(ach.rewardWardrobeId)) {
          extraWardrobe.push(ach.rewardWardrobeId);
        }
      });

      sfx.conquest(game.soundEnabled);
      const firstAch = newlyUnlocked[0];
      showNotice(
        `¡Logro desbloqueado: ${firstAch.title}!`,
        `Recompensa obtenida: ${firstAch.rewardLabel}.`
      );

      setGame((prev) => ({
        ...prev,
        tokens: prev.tokens + extraTokens,
        inventory: extraInventory,
        unlockedWardrobeIds: extraWardrobe,
        unlockedAchievementIds: [
          ...prev.unlockedAchievementIds,
          ...newlyUnlocked.map((a) => a.id),
        ],
      }));
    }
  }, [game]);

  const activeCharacter =
    CHARACTERS.find((c) => c.id === game.activeCharacterId) || CHARACTERS[0];
  const activeProgress = game.characterProgress[activeCharacter.id];
  const achievementCounts = computeAchievementCounts(game);
  const conqueredPartners = CHARACTERS.filter(
    (c) => game.characterProgress[c.id]?.conquered
  );
  const homePartner = game.homePartnerId
    ? conqueredPartners.find((c) => c.id === game.homePartnerId) || null
    : null;
  const homePartnerProgress = homePartner
    ? game.characterProgress[homePartner.id]
    : null;

  // Rare 5-Minute Date Countdown Timer (ticks ONLY when isTimedDate is active)
  useEffect(() => {
    const shouldTick =
      game.activeRoom === "office" &&
      !activeModal &&
      !game.activeRandomEvent &&
      !conquestCelebration &&
      !isLoadingAI &&
      !activeProgress.conquered &&
      activeProgress.isTimedDate &&
      activeProgress.dateStatus === "active" &&
      activeProgress.patience > 0;

    if (!shouldTick) return;

    const timer = window.setInterval(() => {
      setGame((prev) => {
        const curr = prev.characterProgress[prev.activeCharacterId];
        if (
          !curr ||
          curr.conquered ||
          !curr.isTimedDate ||
          curr.dateStatus !== "active" ||
          curr.patience <= 0
        ) {
          return prev;
        }

        const nextSec = Math.max(0, curr.dateSecondsLeft - 1);
        if (nextSec > 0) {
          return {
            ...prev,
            characterProgress: {
              ...prev.characterProgress,
              [prev.activeCharacterId]: {
                ...curr,
                dateSecondsLeft: nextSec,
              },
            },
          };
        }

        return {
          ...prev,
          characterProgress: {
            ...prev.characterProgress,
            [prev.activeCharacterId]: {
              ...curr,
              dateSecondsLeft: 0,
              dateStatus: "expired",
              contactAdded: true,
              dialogueHistory: [
                ...curr.dialogueHistory,
                {
                  id: `exp_${Date.now()}`,
                  speaker: "character" as const,
                  text: "Se acabaron nuestros 5 minutos por hoy... Tengo que volver a mi trabajo, pero ¡escríbeme por el teléfono si quieres agendar otra cita!",
                  note: "Tiempo de cita agotado (00:00) · Escríbele en LatidoTalk para reagendar.",
                  timestamp: nowTimeLabel(),
                },
              ].slice(-24),
            },
          },
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    game.activeRoom,
    activeModal,
    game.activeRandomEvent,
    conquestCelebration,
    isLoadingAI,
    activeProgress.conquered,
    activeProgress.isTimedDate,
    activeProgress.dateStatus,
    activeProgress.patience,
  ]);

  // Notify player when an active timed date transitions to expired
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (
      prev &&
      prev.charId === activeCharacter.id &&
      prev.status === "active" &&
      activeProgress.isTimedDate &&
      activeProgress.dateStatus === "expired"
    ) {
      sfx.message(game.soundEnabled);
      showNotice(
        `Se terminaron los 5 minutos con ${activeCharacter.name}`,
        "Tuvo que volver a su trabajo, pero puedes escribirle por Teléfono para agendar otra cita."
      );
    }
    prevStatusRef.current = {
      charId: activeCharacter.id,
      status: activeProgress.dateStatus,
    };
  }, [
    activeCharacter.id,
    activeCharacter.name,
    activeProgress.isTimedDate,
    activeProgress.dateStatus,
    game.soundEnabled,
  ]);

  const totalInventoryCount = Object.values(game.inventory).reduce(
    (sum, n) => sum + (n || 0),
    0
  );

  const getPlayerStyleSummary = () => {
    const outfitName =
      WARDROBE_ITEMS.find((i) => i.value === game.playerAppearance.outfit)?.name ||
      "Suéter Pastel";
    const hairName =
      WARDROBE_ITEMS.find((i) => i.value === game.playerAppearance.hairStyle)?.name ||
      "Bob Suave";
    const accName =
      WARDROBE_ITEMS.find((i) => i.value === game.playerAppearance.accessory)?.name ||
      "Natural";
    return `Viste ${outfitName}, peinado ${hairName}, accesorio ${accName}`;
  };

  const triggerRandomEvent = () => {
    const picked = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    sfx.message(game.soundEnabled);
    setGame((prev) => ({ ...prev, activeRandomEvent: picked }));
  };

  const applyRelationshipUpdate = (
    charId: string,
    params: {
      affectionDelta: number;
      playerAttractionDelta?: number;
      patienceDelta: number;
      newMood: EmotionalState;
      pursuitAction?: string;
      unlockedSecret?: string;
      replyText: string;
      narrativeNote?: string;
      nextOptions?: DialogueOption[];
      playerActionText?: string;
      usedSpecialId?: string;
      isConfessionSuccess?: boolean;
      maybeTriggerEvent?: boolean;
    }
  ) => {
    const char = CHARACTERS.find((c) => c.id === charId);
    if (!char) return;

    const currSnap = game.characterProgress[charId];
    if (!currSnap.conquered && currSnap.dateStatus !== "active") {
      return;
    }

    const diffMeta = DIFFICULTY_META[char.difficulty];

    // If annoyed ("molesto"), affection MUST drop and no attractiveness bonus applies
    let finalAffectionDelta: number;
    if (params.newMood === "molesto") {
      finalAffectionDelta = -Math.max(4, Math.abs(params.affectionDelta) || 6);
    } else {
      let scaledAffection =
        params.affectionDelta > 0
          ? Math.round(params.affectionDelta * diffMeta.affectionGainMultiplier)
          : params.affectionDelta;

      // Low patience makes gaining affection noticeably harder
      if (currSnap.patience <= 45 && scaledAffection > 0) {
        scaledAffection = Math.max(1, Math.round(scaledAffection * 0.55));
      }

      const attractivenessBonus =
        scaledAffection > 0
          ? Math.floor(calculateAttractiveness(game.playerAppearance) / 10)
          : 0;
      finalAffectionDelta = scaledAffection + attractivenessBonus;
    }

    let scaledPatienceDelta =
      params.patienceDelta < 0
        ? Math.round(params.patienceDelta * diffMeta.patiencePenaltyMultiplier)
        : params.patienceDelta;
    if (params.newMood === "molesto" && scaledPatienceDelta >= 0) {
      scaledPatienceDelta = -Math.round(8 * diffMeta.patiencePenaltyMultiplier);
    }

    const projectedCompat = Math.max(
      0,
      Math.min(100, currSnap.compatibility + finalAffectionDelta)
    );
    const projectedPatience = Math.max(
      0,
      Math.min(100, currSnap.patience + scaledPatienceDelta)
    );

    const shouldTriggerRandom =
      params.maybeTriggerEvent &&
      projectedPatience > 15 &&
      projectedCompat < 95 &&
      Math.random() < 0.34;

    const conqueredNowPreview =
      !currSnap.conquered &&
      (params.isConfessionSuccess || projectedCompat >= 100);

    const preferredPoolPreview = getFilteredCharacters(game.datePreference);
    const nextPreferredPreview = preferredPoolPreview.find(
      (c) => c.id !== charId && !game.characterProgress[c.id].unlocked
    );
    const nextAnyPreview = CHARACTERS.find(
      (c) => c.id !== charId && !game.characterProgress[c.id].unlocked
    );
    const nextTargetPreview =
      nextPreferredPreview ||
      nextAnyPreview ||
      preferredPoolPreview.find(
        (c) => c.id !== charId && !game.characterProgress[c.id].conquered
      ) ||
      CHARACTERS.find(
        (c) => c.id !== charId && !game.characterProgress[c.id].conquered
      );

    setGame((prev) => {
      const curr = prev.characterProgress[charId];
      const nextCompatibility = Math.max(
        0,
        Math.min(100, curr.compatibility + finalAffectionDelta)
      );
      const nextPatience = Math.max(
        0,
        Math.min(100, curr.patience + scaledPatienceDelta)
      );

      // Scaled ficha rewards: hard dates reward noticeably higher tokens
      const stepReward =
        char.difficulty === "dificil"
          ? 25
          : char.difficulty === "media"
            ? 15
            : 10;
      const milestoneReward =
        char.difficulty === "dificil"
          ? 50
          : char.difficulty === "media"
            ? 25
            : 15;

      const affectionReward = finalAffectionDelta > 0 ? stepReward : 0;
      let bonusTokens = 0;
      const newClaimed = [...curr.claimedMilestones];
      [25, 50, 75].forEach((milestone) => {
        if (nextCompatibility >= milestone && !newClaimed.includes(milestone)) {
          newClaimed.push(milestone);
          bonusTokens += milestoneReward;
        }
      });

      const conqueredNow =
        !curr.conquered &&
        (params.isConfessionSuccess || nextCompatibility >= 100);

      if (conqueredNow) {
        bonusTokens += char.rewardTokens;
      }

      // Mutual flirting & conquest meter:
      // - Difficult characters: player conquers; flirting stays guarded (<35) until trust >= 45%
      // - Easy/Medium: mutual conquest; NPC actively flirts and can propose at >= 80%
      const rawAttractionDelta =
        params.newMood === "molesto"
          ? -Math.max(4, Math.abs(params.playerAttractionDelta || 4))
          : params.playerAttractionDelta || 0;

      let nextPlayerAttraction = curr.playerAttraction || 0;
      if (char.difficulty === "dificil") {
        if (nextCompatibility < 45) {
          nextPlayerAttraction = Math.min(
            35,
            Math.max(0, nextPlayerAttraction + Math.min(2, rawAttractionDelta))
          );
        } else {
          nextPlayerAttraction = Math.max(
            0,
            Math.min(100, nextPlayerAttraction + rawAttractionDelta)
          );
        }
      } else {
        nextPlayerAttraction = Math.max(
          0,
          Math.min(100, nextPlayerAttraction + rawAttractionDelta)
        );
      }

      const npcShouldConfess =
        char.difficulty !== "dificil" &&
        !curr.conquered &&
        !conqueredNow &&
        nextPlayerAttraction >= 80 &&
        params.newMood !== "molesto" &&
        nextPatience > 15;

      const updatedSecrets = [...curr.discoveredSecrets];
      if (
        params.unlockedSecret &&
        params.unlockedSecret.trim().length > 4 &&
        !updatedSecrets.includes(params.unlockedSecret.trim())
      ) {
        updatedSecrets.push(params.unlockedSecret.trim());
      }

      const nextDialogue = [...curr.dialogueHistory];
      if (params.playerActionText) {
        nextDialogue.push({
          id: `p_${Date.now()}`,
          speaker: "player",
          text: params.playerActionText,
          timestamp: nowTimeLabel(),
        });
      }
      nextDialogue.push({
        id: `c_${Date.now() + 1}`,
        speaker: "character",
        text: params.replyText,
        note: params.narrativeNote,
        pursuitAction: params.pursuitAction || undefined,
        timestamp: nowTimeLabel(),
      });

      const nextProgressMap = {
        ...prev.characterProgress,
        [charId]: {
          ...curr,
          compatibility: conqueredNow ? 100 : nextCompatibility,
          playerAttraction: conqueredNow ? 100 : nextPlayerAttraction,
          npcConfessing: conqueredNow ? false : npcShouldConfess || Boolean(curr.npcConfessing && nextPatience > 15 && params.newMood !== "molesto"),
          patience: nextPatience,
          dateStatus:
            nextPatience <= 0
              ? ("broken" as const)
              : curr.dateStatus,
          mood: conqueredNow ? ("enamorado" as const) : params.newMood,
          conquered: curr.conquered || conqueredNow,
          contactAdded: true,
          claimedMilestones: newClaimed,
          discoveredSecrets: updatedSecrets,
          usedSpecialIds: params.usedSpecialId
            ? [...curr.usedSpecialIds, params.usedSpecialId]
            : curr.usedSpecialIds,
          dialogueHistory: nextDialogue.slice(-24),
          currentOptions:
            params.nextOptions && params.nextOptions.length > 0
              ? params.nextOptions
              : curr.currentOptions,
        },
      };

      // Unlock next locked character (prioritize matching datePreference, then any locked)
      if (conqueredNow) {
        const preferredPool = getFilteredCharacters(prev.datePreference);
        const nextPreferred = preferredPool.find(
          (c) => !nextProgressMap[c.id].unlocked
        );
        const nextAny = CHARACTERS.find((c) => !nextProgressMap[c.id].unlocked);
        const toUnlock = nextPreferred || nextAny;
        if (toUnlock) {
          nextProgressMap[toUnlock.id] = {
            ...nextProgressMap[toUnlock.id],
            unlocked: true,
            contactAdded: true,
          };
        }
      }

      const randomEv = shouldTriggerRandom
        ? RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
        : prev.activeRandomEvent;

      return {
        ...prev,
        tokens: prev.tokens + bonusTokens + affectionReward,
        totalRelationshipsCompleted: conqueredNow
          ? prev.totalRelationshipsCompleted + 1
          : prev.totalRelationshipsCompleted,
        characterProgress: nextProgressMap,
        activeRandomEvent: randomEv,
      };
    });

    if (projectedPatience <= 0) {
      sfx.breakup(game.soundEnabled);
      showNotice(
        `${char.name} terminó la cita`,
        "Su paciencia llegó a cero. Reconstruye tu enfoque para intentarlo de nuevo."
      );
    } else if (conqueredNowPreview) {
      sfx.conquest(game.soundEnabled);
      setConquestCelebration({
        conqueredCharacterId: char.id,
        conqueredCharacterName: char.name,
        rewardTokens: char.rewardTokens,
        nextCharacterId: nextTargetPreview?.id,
        nextCharacterName: nextTargetPreview?.name,
      });
    } else if (finalAffectionDelta > 0) {
      sfx.heart(game.soundEnabled);
    }
  };

  const handleCharacterGift = (
    char: typeof activeCharacter,
    gift?: { name?: string; tier?: GiftTier; description?: string } | null
  ): { name: string; tier: GiftTier } | null => {
    if (!gift || !gift.name) return null;
    const validTier: GiftTier = (
      ["lujoso", "lindo", "raro", "tonto", "desagradable"].includes(String(gift.tier))
        ? gift.tier
        : "lindo"
    ) as GiftTier;
    const tierMeta = GIFT_TIER_META[validTier];
    const record: ReceivedGiftRecord = {
      id: `rg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: String(gift.name).trim(),
      tier: validTier,
      description: String(
        gift.description || `Obsequio ${tierMeta.label.toLowerCase()} de ${char.name}.`
      ).trim(),
      fromCharacterId: char.id,
      fromCharacterName: char.name,
      receivedAt: nowTimeLabel(),
    };

    sfx.gift(game.soundEnabled);
    setGame((prev) => ({
      ...prev,
      tokens: prev.tokens + tierMeta.tokenBonus,
      receivedGifts: [record, ...prev.receivedGifts].slice(0, 60),
    }));
    showNotice(
      `Regalo recibido de ${char.name} (${tierMeta.label})`,
      `${record.name}${tierMeta.tokenBonus > 0 ? ` · +${tierMeta.tokenBonus} fichas` : " · Guardado en Inventario > Recibidos"}`
    );
    return { name: record.name, tier: validTier };
  };

  const callDialogueAI = async (params: {
    interactionType: "dialogue" | "gift" | "special_event" | "confession";
    playerMessage: string;
    giftInfo?: { id: string; name: string; category: string; isFavorite: boolean };
    usedSpecialId?: string;
    forceLoseInterest?: boolean;
  }) => {
    if (!activeProgress.conquered && activeProgress.dateStatus !== "active") {
      return;
    }

    setIsLoadingAI(true);
    setAiError(null);
    const char = activeCharacter;
    const prog = activeProgress;
    const chapter = getCharacterChapter(char, prog.compatibility);
    const optimisticMsgId = params.playerMessage ? `p_${Date.now()}` : null;

    // Optimistic instant display of the player's words in the scene
    if (params.playerMessage && optimisticMsgId) {
      setGame((prev) => {
        const curr = prev.characterProgress[char.id];
        return {
          ...prev,
          characterProgress: {
            ...prev.characterProgress,
            [char.id]: {
              ...curr,
              dialogueHistory: [
                ...curr.dialogueHistory,
                {
                  id: optimisticMsgId,
                  speaker: "player" as const,
                  text: params.playerMessage,
                  timestamp: nowTimeLabel(),
                },
              ].slice(-24),
            },
          },
        };
      });
    }

    try {
      const response = await fetch("/api/romance/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: {
            id: char.id,
            name: char.name,
            koreanName: char.koreanName,
            country: char.country,
            role: char.role,
            occupation: char.occupation,
            personalityTrait: char.personalityTrait,
            seductionStyle: char.seductionStyle,
            isToxicOrDangerous: Boolean(char.isToxicOrDangerous),
            currentLocation: chapter.scenarioName,
            difficulty: char.difficulty,
            personality: char.personality,
            likes: char.likes,
            dislikes: char.dislikes,
            speechStyle: char.speechStyle,
          },
          player: {
            name: game.playerName,
            gender: game.playerGender,
            pronoun: game.playerPronoun,
            orientation: game.orientation,
            attractiveness: calculateAttractiveness(game.playerAppearance),
            styleSummary: getPlayerStyleSummary(),
          },
          state: {
            compatibility: prog.compatibility,
            playerAttraction: prog.playerAttraction || 0,
            patience: prog.patience,
            mood: prog.mood,
            chapter: chapter.chapter,
            chapterTitle: chapter.title,
            scenarioName: chapter.scenarioName,
            isFavoritePartner: game.favoriteCharacterId === char.id,
            isTimedDate: prog.isTimedDate,
          },
          interactionType: params.interactionType,
          playerMessage: params.playerMessage,
          giftInfo: params.giftInfo,
          history: prog.dialogueHistory
            .filter((d) => d.speaker !== "narrator")
            .slice(-4)
            .map((d) => ({
              speaker: d.speaker === "player" ? "player" : "character",
              text: d.text,
            })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "No se pudo conectar con la IA.");
      }

      let affectionDelta = Number(data.affectionDelta) || 0;
      let playerAttractionDelta = Number(data.playerAttractionDelta) || 0;
      let patienceDelta = Number(data.patienceDelta) || 0;
      let nextMood = data.newEmotionalState as EmotionalState;

      if (params.forceLoseInterest) {
        nextMood = "molesto";
        affectionDelta = Math.min(-12, affectionDelta || -12);
        playerAttractionDelta = -10;
        patienceDelta = Math.min(-38, patienceDelta || -38);
      }

      if (params.interactionType === "gift" && params.giftInfo) {
        const giftObj = GIFT_CATALOG.find((g) => g.id === params.giftInfo?.id);
        const minBoost = params.giftInfo.isFavorite
          ? (giftObj?.baseAffinity || 12) + 8
          : giftObj?.baseAffinity || 8;
        affectionDelta = Math.max(affectionDelta, minBoost);

        setGame((prev) => ({
          ...prev,
          totalGiftsGiven: prev.totalGiftsGiven + 1,
          inventory: {
            ...prev.inventory,
            [params.giftInfo!.id]: Math.max(
              0,
              (prev.inventory[params.giftInfo!.id] || 1) - 1
            ),
          },
        }));
      }

      if (data.characterGift) {
        handleCharacterGift(char, data.characterGift);
      }

      const confessionAccepted =
        params.interactionType === "confession" &&
        prog.compatibility >= 85 &&
        nextMood !== "molesto";

      applyRelationshipUpdate(char.id, {
        affectionDelta,
        playerAttractionDelta,
        patienceDelta,
        newMood: nextMood,
        pursuitAction: data.pursuitAction,
        unlockedSecret: data.unlockedSecret,
        replyText: data.characterReply,
        narrativeNote: data.narrativeNote,
        nextOptions: data.nextOptions,
        usedSpecialId: params.usedSpecialId,
        isConfessionSuccess: confessionAccepted,
        maybeTriggerEvent:
          params.interactionType === "dialogue" && !params.forceLoseInterest,
      });
    } catch (err) {
      if (optimisticMsgId) {
        setGame((prev) => {
          const curr = prev.characterProgress[char.id];
          return {
            ...prev,
            characterProgress: {
              ...prev.characterProgress,
              [char.id]: {
                ...curr,
                dialogueHistory: curr.dialogueHistory.filter(
                  (entry) => entry.id !== optimisticMsgId
                ),
              },
            },
          };
        });
      }
      setAiError(
        err instanceof Error ? err.message : "Error de conexión al generar el diálogo."
      );
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAcceptPositiveEvent = () => {
    const ev = game.activeRandomEvent;
    if (!ev || ev.type !== "positive") return;
    sfx.gift(game.soundEnabled);

    setGame((prev) => {
      const curr = prev.characterProgress[activeCharacter.id];
      const nextCompat = Math.min(
        100,
        curr.compatibility + (ev.affectionDelta || 8)
      );
      const nextPatience = Math.min(
        100,
        curr.patience + (ev.patienceDelta || 5)
      );
      const nextInventory = { ...prev.inventory };
      if (ev.rewardGiftId) {
        nextInventory[ev.rewardGiftId] = (nextInventory[ev.rewardGiftId] || 0) + 1;
      }

      const affectionGain = ev.affectionDelta || 8;
      const affectionReward = affectionGain > 0 ? 10 : 0;

      return {
        ...prev,
        tokens: prev.tokens + affectionReward,
        activeRandomEvent: null,
        inventory: nextInventory,
        characterProgress: {
          ...prev.characterProgress,
          [activeCharacter.id]: {
            ...curr,
            compatibility: nextCompat,
            patience: nextPatience,
            mood: ev.resultingMood || "encantado",
            dialogueHistory: [
              ...curr.dialogueHistory,
              {
                id: `ev_${Date.now()}`,
                speaker: "character" as const,
                text: ev.description,
                note: `Evento positivo: +${ev.affectionDelta || 8}% afinidad`,
                timestamp: nowTimeLabel(),
              },
            ].slice(-24),
          },
        },
      };
    });
  };

  const handleSelectNegativeEventChoice = (choice: RandomEventChoice) => {
    if (choice.isCorrect) {
      sfx.heart(game.soundEnabled);
    } else {
      sfx.breakup(game.soundEnabled);
    }

    setGame((prev) => {
      const curr = prev.characterProgress[activeCharacter.id];
      const nextCompat = Math.max(
        0,
        Math.min(100, curr.compatibility + choice.affectionDelta)
      );
      const nextPatience = Math.max(
        0,
        Math.min(100, curr.patience + choice.patienceDelta)
      );

      const affectionReward = choice.affectionDelta > 0 ? 10 : 0;

      return {
        ...prev,
        tokens: prev.tokens + affectionReward,
        activeRandomEvent: null,
        resolvedNegativeEvents: choice.isCorrect
          ? prev.resolvedNegativeEvents + 1
          : prev.resolvedNegativeEvents,
        characterProgress: {
          ...prev.characterProgress,
          [activeCharacter.id]: {
            ...curr,
            compatibility: nextCompat,
            patience: nextPatience,
            dateStatus: nextPatience <= 0 ? ("broken" as const) : curr.dateStatus,
            mood: choice.resultingMood,
            dialogueHistory: [
              ...curr.dialogueHistory,
              {
                id: `ev_p_${Date.now()}`,
                speaker: "player" as const,
                text: choice.text,
                timestamp: nowTimeLabel(),
              },
              {
                id: `ev_c_${Date.now() + 1}`,
                speaker: "character" as const,
                text: choice.outcomeText,
                note: choice.isCorrect
                  ? "Malentendido resuelto con éxito"
                  : "La tensión dañó la relación",
                timestamp: nowTimeLabel(),
              },
            ].slice(-24),
          },
        },
      };
    });
  };

  const handleSelectOption = (option: DialogueOption) => {
    sfx.click(game.soundEnabled);
    callDialogueAI({
      interactionType: "dialogue",
      playerMessage: option.text,
    });
  };

  const handleSendCustomLine = (text: string) => {
    sfx.click(game.soundEnabled);
    callDialogueAI({
      interactionType: "dialogue",
      playerMessage: text,
    });
  };

  const handleTriggerSpecial = (specialId: string) => {
    const sp = activeCharacter.specialInteractions.find((s) => s.id === specialId);
    if (!sp) return;
    sfx.heart(game.soundEnabled);
    callDialogueAI({
      interactionType: "special_event",
      playerMessage: sp.promptText,
      usedSpecialId: sp.id,
    });
  };

  const handleConfess = () => {
    sfx.heart(game.soundEnabled);
    callDialogueAI({
      interactionType: "confession",
      playerMessage: `Quiero dejar de ser solo tu acompañante por contrato. Me gustas de verdad, ${activeCharacter.name}. ¿Aceptarías ser mi pareja oficial?`,
    });
  };

  const handleGiveGift = (giftId: string) => {
    const gift = GIFT_CATALOG.find((g) => g.id === giftId);
    if (!gift || (game.inventory[giftId] || 0) <= 0) return;
    sfx.gift(game.soundEnabled);
    setActiveModal(null);
    const isFav = activeCharacter.favoriteGiftIds.includes(gift.id);
    callDialogueAI({
      interactionType: "gift",
      playerMessage: `Traje este detalle pensando en ti: ${gift.name}.`,
      giftInfo: {
        id: gift.id,
        name: gift.name,
        category: gift.category,
        isFavorite: isFav,
      },
    });
  };

  const handleBuyGift = (giftId: string) => {
    const gift = GIFT_CATALOG.find((g) => g.id === giftId);
    if (!gift || game.tokens < gift.price) return;
    sfx.gift(game.soundEnabled);
    setGame((prev) => ({
      ...prev,
      tokens: prev.tokens - gift.price,
      inventory: {
        ...prev.inventory,
        [gift.id]: (prev.inventory[gift.id] || 0) + 1,
      },
    }));
  };

  const handleBuyWardrobeItem = (itemId: string) => {
    const item = WARDROBE_ITEMS.find((i) => i.id === itemId);
    if (
      !item ||
      game.tokens < item.price ||
      game.unlockedWardrobeIds.includes(itemId)
    ) {
      return;
    }
    sfx.gift(game.soundEnabled);
    const patch: Partial<ChibiAppearance> = {};
    if (item.category === "outfit")
      patch.outfit = item.value as ChibiAppearance["outfit"];
    if (item.category === "hair")
      patch.hairStyle = item.value as ChibiAppearance["hairStyle"];
    if (item.category === "accessory")
      patch.accessory = item.value as ChibiAppearance["accessory"];
    if (item.category === "eye")
      patch.eyeStyle = item.value as ChibiAppearance["eyeStyle"];
    if (item.category === "mouth")
      patch.mouthStyle = item.value;

    setGame((prev) => ({
      ...prev,
      tokens: prev.tokens - item.price,
      unlockedWardrobeIds: [...prev.unlockedWardrobeIds, itemId],
      playerAppearance: { ...prev.playerAppearance, ...patch },
    }));
  };

  const handleSendPhoneMessage = async (text: string) => {
    const canChat = activeProgress.unlocked && activeProgress.patience > 0;
    if (!canChat) return;

    setIsSendingChat(true);
    setChatError(null);

    const char = activeCharacter;
    const prog = activeProgress;
    const playerMsgId = `pm_${Date.now()}`;
    const isDateExpired = prog.dateStatus === "expired" && !prog.conquered;

    setGame((prev) => ({
      ...prev,
      totalPhoneMessages: prev.totalPhoneMessages + 1,
      characterProgress: {
        ...prev.characterProgress,
        [char.id]: {
          ...prev.characterProgress[char.id],
          contactAdded: true,
          phoneHistory: [
            ...prev.characterProgress[char.id].phoneHistory,
            {
              id: playerMsgId,
              sender: "player" as const,
              text,
              timestamp: nowTimeLabel(),
            },
          ],
        },
      },
    }));

    try {
      const response = await fetch("/api/romance/phone-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: {
            id: char.id,
            name: char.name,
            country: char.country,
            role: char.role,
            occupation: char.occupation,
            personalityTrait: char.personalityTrait,
            isToxicOrDangerous: Boolean(char.isToxicOrDangerous),
            currentLocation: char.currentLocation,
            difficulty: char.difficulty,
            personality: char.personality,
            likes: char.likes,
            dislikes: char.dislikes,
            textingStyle: char.textingStyle,
          },
          playerName: game.playerName,
          playerPronoun: game.playerPronoun,
          playerGender: game.playerGender,
          dateExpired: isDateExpired,
          isConquered: prog.conquered,
          isFavoritePartner: game.favoriteCharacterId === char.id,
          state: {
            compatibility: prog.compatibility,
            patience: prog.patience,
            mood: prog.mood,
            chapter: getCharacterChapter(char, prog.compatibility).chapter,
          },
          message: text,
          history: prog.phoneHistory.slice(-4).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al enviar mensaje.");
      }

      sfx.message(game.soundEnabled);

      const giftGiven = data.characterGift
        ? handleCharacterGift(char, data.characterGift)
        : null;

      const newMood = data.newEmotionalState as EmotionalState;
      const rawAffection =
        newMood === "molesto"
          ? -Math.max(4, Math.abs(Number(data.affectionDelta) || 5))
          : Number(data.affectionDelta) || 0;
      const rawPatience =
        newMood === "molesto"
          ? Math.min(-4, Number(data.patienceDelta) || -6)
          : Number(data.patienceDelta) || 0;

      const hasInvite = Boolean(data.scheduleDateInvite);

      setGame((prev) => {
        const curr = prev.characterProgress[char.id];
        const nextCompat = Math.max(
          0,
          Math.min(100, curr.compatibility + rawAffection)
        );
        const nextPatience = Math.max(
          0,
          Math.min(100, curr.patience + rawPatience)
        );

        let bonus = 0;
        const claimed = [...curr.claimedMilestones];
        [25, 50, 75].forEach((m) => {
          if (nextCompat >= m && !claimed.includes(m)) {
            claimed.push(m);
            bonus += 15;
          }
        });

        const affectionTokens = rawAffection > 0 ? 10 : 0;

        return {
          ...prev,
          tokens: prev.tokens + bonus + affectionTokens,
          characterProgress: {
            ...prev.characterProgress,
            [char.id]: {
              ...curr,
              compatibility: nextCompat,
              patience: nextPatience,
              dateStatus:
                nextPatience <= 0 ? ("broken" as const) : curr.dateStatus,
              mood: newMood,
              claimedMilestones: claimed,
              phoneHistory: [
                ...curr.phoneHistory,
                {
                  id: `cm_${Date.now()}`,
                  sender: "character" as const,
                  text: String(data.replyText || ""),
                  timestamp: nowTimeLabel(),
                  ...(giftGiven
                    ? {
                        receivedGiftName: giftGiven.name,
                        receivedGiftTier: giftGiven.tier,
                      }
                    : {}),
                  ...(hasInvite
                    ? {
                        dateInvite: {
                          location: String(
                            data.dateInviteLocation || char.currentLocation
                          ),
                          timeLabel: String(data.dateInviteTime || "Ahora mismo"),
                          accepted: false,
                        },
                      }
                    : {}),
                },
              ].slice(-30),
              phoneSuggestions: Array.isArray(data.quickSuggestions)
                ? data.quickSuggestions
                : curr.phoneSuggestions,
            },
          },
        };
      });
    } catch (err) {
      setChatError(
        err instanceof Error ? err.message : "Error de conexión en el chat."
      );
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleGoToScheduledDate = (messageId: string, location: string) => {
    sfx.heart(game.soundEnabled);
    const char = activeCharacter;
    const isTimed = rollTimedDate(char, false);
    setGame((prev) => {
      const curr = prev.characterProgress[char.id];
      return {
        ...prev,
        activeRoom: "office",
        characterProgress: {
          ...prev.characterProgress,
          [char.id]: {
            ...curr,
            dateStatus: "active",
            isTimedDate: isTimed,
            dateSecondsLeft: DATE_DURATION_SECONDS,
            patience: Math.max(45, Math.min(100, curr.patience + 12)),
            mood: curr.mood === "molesto" ? "encantado" : curr.mood,
            phoneHistory: curr.phoneHistory.map((m) =>
              m.id === messageId && m.dateInvite
                ? { ...m, dateInvite: { ...m.dateInvite, accepted: true } }
                : m
            ),
            dialogueHistory: [
              ...curr.dialogueHistory,
              {
                id: `redate_${Date.now()}`,
                speaker: "character" as const,
                text: isTimed
                  ? `¡Ya llegué a ${location}! Hoy ando con la agenda algo apretada por mi trabajo, así que aprovechemos bien estos 5 minutos.`
                  : `¡Ya llegué a ${location}! Qué bueno que me escribiste para quedar; hoy tengo tiempo libre para estar contigo sin prisas.`,
                note: isTimed
                  ? `Cita rápida en ${location} · Reloj de 05:00.`
                  : `Cita en ${location} · Sin límite de tiempo.`,
                timestamp: nowTimeLabel(),
              },
            ].slice(-24),
          },
        },
      };
    });
    setActiveModal(null);
    showNotice(
      `¡Ya llegaste con ${char.name}!`,
      isTimed
        ? `Se encontraron en ${location}. Hoy tiene agenda apretada: 05:00 en escena.`
        : `Se encontraron en ${location}. Disfruten su cita sin prisa.`
    );
  };

  const handleAcceptNpcConfession = () => {
    const char = activeCharacter;
    const currSnap = activeProgress;
    if (currSnap.conquered || char.difficulty === "dificil") return;

    const preferredPoolPreview = getFilteredCharacters(game.datePreference);
    const nextTargetPreview =
      preferredPoolPreview.find(
        (c) => c.id !== char.id && !game.characterProgress[c.id].unlocked
      ) ||
      CHARACTERS.find(
        (c) => c.id !== char.id && !game.characterProgress[c.id].unlocked
      ) ||
      preferredPoolPreview.find(
        (c) => c.id !== char.id && !game.characterProgress[c.id].conquered
      );

    sfx.conquest(game.soundEnabled);
    setGame((prev) => {
      const curr = prev.characterProgress[char.id];
      const nextMap = {
        ...prev.characterProgress,
        [char.id]: {
          ...curr,
          compatibility: 100,
          playerAttraction: 100,
          npcConfessing: false,
          conquered: true,
          mood: "enamorado" as const,
          dialogueHistory: [
            ...curr.dialogueHistory,
            {
              id: `npc_acc_p_${Date.now()}`,
              speaker: "player" as const,
              text: `¡Sí! Me conquistaste por completo, ${char.name}. Seamos pareja oficial.`,
              timestamp: nowTimeLabel(),
            },
            {
              id: `npc_acc_c_${Date.now() + 1}`,
              speaker: "character" as const,
              text: "¡Sabía que dirías que sí! Prometo hacerte la persona más feliz de Seúl.",
              note: `Conquista mutua completada · +${char.rewardTokens} fichas.`,
              timestamp: nowTimeLabel(),
            },
          ].slice(-24),
        },
      };

      const preferredPool = getFilteredCharacters(prev.datePreference);
      const toUnlock =
        preferredPool.find((c) => !nextMap[c.id].unlocked) ||
        CHARACTERS.find((c) => !nextMap[c.id].unlocked);
      if (toUnlock) {
        nextMap[toUnlock.id] = { ...nextMap[toUnlock.id], unlocked: true };
      }

      return {
        ...prev,
        tokens: prev.tokens + char.rewardTokens,
        totalRelationshipsCompleted: prev.totalRelationshipsCompleted + 1,
        characterProgress: nextMap,
      };
    });

    setConquestCelebration({
      conqueredCharacterId: char.id,
      conqueredCharacterName: char.name,
      rewardTokens: char.rewardTokens,
      conqueredByNpcProposal: true,
      nextCharacterId: nextTargetPreview?.id,
      nextCharacterName: nextTargetPreview?.name,
    });
  };

  const handleDeclineNpcConfession = () => {
    const char = activeCharacter;
    sfx.click(game.soundEnabled);
    setGame((prev) => {
      const curr = prev.characterProgress[char.id];
      return {
        ...prev,
        characterProgress: {
          ...prev.characterProgress,
          [char.id]: {
            ...curr,
            npcConfessing: false,
            playerAttraction: 68,
            dialogueHistory: [
              ...curr.dialogueHistory,
              {
                id: `npc_dec_${Date.now()}`,
                speaker: "character" as const,
                text: "Jeje, me haces esperar un poquito más... Está bien, seguiré coqueteando hasta que quieras oficializarlo.",
                note: "Propuesta pospuesta con picardía.",
                timestamp: nowTimeLabel(),
              },
            ].slice(-24),
          },
        },
      };
    });
  };

  const handleMakeLoseInterest = () => {
    sfx.click(game.soundEnabled);
    callDialogueAI({
      interactionType: "dialogue",
      playerMessage:
        "Sinceramente no me interesas en absoluto; prefiero cortar esta cita aquí mismo.",
      forceLoseInterest: true,
    });
  };

  const handleSkipLevel = () => {
    sfx.click(game.soundEnabled);
    const preferredPool = getFilteredCharacters(game.datePreference);
    const nextLockedPreferred = preferredPool.find(
      (c) => c.id !== activeCharacter.id && !game.characterProgress[c.id]?.unlocked
    );
    const nextLockedAny = CHARACTERS.find(
      (c) => c.id !== activeCharacter.id && !game.characterProgress[c.id]?.unlocked
    );
    const nextUnconquered =
      preferredPool.find(
        (c) =>
          c.id !== activeCharacter.id &&
          !game.characterProgress[c.id]?.conquered &&
          !game.characterProgress[c.id]?.skipped
      ) ||
      CHARACTERS.find(
        (c) =>
          c.id !== activeCharacter.id &&
          !game.characterProgress[c.id]?.conquered
      );

    const targetNext = nextLockedPreferred || nextLockedAny || nextUnconquered;

    setGame((prev) => {
      const nextMap = {
        ...prev.characterProgress,
        [activeCharacter.id]: {
          ...prev.characterProgress[activeCharacter.id],
          skipped: true,
          dateStatus: "broken" as const,
        },
      };
      if (targetNext) {
        nextMap[targetNext.id] = {
          ...nextMap[targetNext.id],
          unlocked: true,
        };
      }
      return {
        ...prev,
        activeCharacterId: targetNext ? targetNext.id : prev.activeCharacterId,
        activeRoom: "office",
        characterProgress: nextMap,
      };
    });

    showNotice(
      `Nivel saltado: ${activeCharacter.name}`,
      targetNext
        ? `Pasaste al siguiente objetivo: ${targetNext.name} (${targetNext.country}).`
        : "Has marcado esta cita como descartada."
    );
  };

  const handleToggleFavorite = (charId: string) => {
    const target = CHARACTERS.find((c) => c.id === charId);
    if (!target) return;
    sfx.heart(game.soundEnabled);
    const willBeFav = game.favoriteCharacterId !== charId;
    setGame((prev) => ({
      ...prev,
      favoriteCharacterId: willBeFav ? charId : null,
    }));
    showNotice(
      willBeFav
        ? `${target.name} es tu Pareja Favorita`
        : "Favorito desactivado",
      willBeFav
        ? "Te dará +20 fichas extra al pasar tiempo juntos en casa y más regalos."
        : "Puedes elegir otra pareja favorita cuando quieras."
    );
  };

  const handleInviteHome = (charId: string) => {
    const target = CHARACTERS.find((c) => c.id === charId);
    if (!target || !game.characterProgress[charId]?.conquered) return;
    sfx.heart(game.soundEnabled);
    setGame((prev) => ({
      ...prev,
      homePartnerId: charId,
      activeRoom: "bedroom",
    }));
    setActiveModal(null);
    showNotice(
      `${target.name} llegó a tu casa`,
      "Pueden hacer actividades de pareja, charlar en casa y recibir recompensas."
    );
  };

  const handleCoupleHomeAction = async (promptText: string) => {
    if (!homePartner || !homePartnerProgress || isHomeLoading) return;
    setIsHomeLoading(true);
    const char = homePartner;
    const prog = homePartnerProgress;
    const isFav = game.favoriteCharacterId === char.id;

    setGame((prev) => {
      const curr = prev.characterProgress[char.id];
      return {
        ...prev,
        characterProgress: {
          ...prev.characterProgress,
          [char.id]: {
            ...curr,
            dialogueHistory: [
              ...curr.dialogueHistory,
              {
                id: `hp_${Date.now()}`,
                speaker: "player" as const,
                text: promptText,
                timestamp: nowTimeLabel(),
              },
            ].slice(-24),
          },
        },
      };
    });

    try {
      const response = await fetch("/api/romance/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: {
            id: char.id,
            name: char.name,
            koreanName: char.koreanName,
            country: char.country,
            role: char.role,
            occupation: char.occupation,
            personalityTrait: char.personalityTrait,
            isToxicOrDangerous: Boolean(char.isToxicOrDangerous),
            difficulty: char.difficulty,
            personality: char.personality,
            likes: char.likes,
            dislikes: char.dislikes,
            speechStyle: char.speechStyle,
          },
          player: {
            name: game.playerName,
            gender: game.playerGender,
            pronoun: game.playerPronoun,
            orientation: game.orientation,
            attractiveness: calculateAttractiveness(game.playerAppearance),
            styleSummary: getPlayerStyleSummary(),
          },
          state: {
            compatibility: prog.compatibility,
            patience: prog.patience,
            mood: prog.mood,
            chapter: getCharacterChapter(char, prog.compatibility).chapter,
            chapterTitle: "Vida en Casa",
            scenarioName: "Mi Casa · Sala de Parejas",
            isFavoritePartner: isFav,
          },
          interactionType: "home_couple",
          playerMessage: promptText,
          history: prog.dialogueHistory
            .filter((d) => d.speaker !== "narrator")
            .slice(-4)
            .map((d) => ({
              speaker: d.speaker === "player" ? "player" : "character",
              text: d.text,
            })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al conversar en casa.");
      }

      if (data.characterGift) {
        handleCharacterGift(char, data.characterGift);
      }

      const loyaltyReward = isFav ? 20 : 5;
      sfx.heart(game.soundEnabled);

      setGame((prev) => {
        const curr = prev.characterProgress[char.id];
        return {
          ...prev,
          tokens: prev.tokens + loyaltyReward,
          characterProgress: {
            ...prev.characterProgress,
            [char.id]: {
              ...curr,
              mood: (data.newEmotionalState as EmotionalState) || "enamorado",
              dialogueHistory: [
                ...curr.dialogueHistory,
                {
                  id: `hc_${Date.now()}`,
                  speaker: "character" as const,
                  text: String(data.characterReply || "Me encanta estar contigo en casa."),
                  note: isFav
                    ? `En casa con tu Pareja Favorita · +${loyaltyReward} fichas`
                    : `Momento en casa · +${loyaltyReward} fichas`,
                  timestamp: nowTimeLabel(),
                },
              ].slice(-24),
            },
          },
        };
      });

      if (isFav && !data.characterGift) {
        showNotice(
          `Recompensa de Pareja Favorita`,
          `${char.name} te dio +20 fichas por compartir este momento en casa.`
        );
      }
    } catch (err) {
      showNotice(
        "Error en casa",
        err instanceof Error ? err.message : "No se pudo completar la actividad."
      );
    } finally {
      setIsHomeLoading(false);
    }
  };

  const handleTakePhoto = (photo: Omit<PhotoRecord, "id" | "takenAt">) => {
    sfx.shutter(game.soundEnabled);
    setGame((prev) => ({
      ...prev,
      photos: [
        {
          ...photo,
          id: `ph_${Date.now()}`,
          takenAt: nowTimeLabel(),
        },
        ...prev.photos,
      ],
    }));
  };

  const handleRecoverFromBreakup = () => {
    sfx.click(game.soundEnabled);
    const fresh = createInitialProgress(activeCharacter, true);
    setGame((prev) => {
      const prevChar = prev.characterProgress[activeCharacter.id];
      return {
        ...prev,
        characterProgress: {
          ...prev.characterProgress,
          [activeCharacter.id]: {
            ...fresh,
            discoveredSecrets: prevChar.discoveredSecrets,
            conquered: prevChar.conquered,
            breakupCount: prevChar.breakupCount + 1,
          },
        },
      };
    });
  };

  const handleRenewRomance = (charId: string) => {
    const targetChar = CHARACTERS.find((c) => c.id === charId);
    if (!targetChar) return;
    sfx.click(game.soundEnabled);
    const fresh = createInitialProgress(targetChar, true);
    setGame((prev) => {
      const prevChar = prev.characterProgress[charId];
      return {
        ...prev,
        activeCharacterId: charId,
        activeRoom: "office",
        characterProgress: {
          ...prev.characterProgress,
          [charId]: {
            ...fresh,
            discoveredSecrets: prevChar.discoveredSecrets,
            conquered: false,
          },
        },
      };
    });
    setActiveModal(null);
  };

  const handleUpdateIdentity = (patch: {
    playerGender?: PlayerGender;
    playerPronoun?: PlayerPronoun;
    orientation?: SexualOrientation;
    datePreference?: DatePreference;
  }) => {
    sfx.click(game.soundEnabled);
    setGame((prev) => {
      const nextPref = patch.datePreference || prev.datePreference;
      const filtered = getFilteredCharacters(nextPref);
      const nextProgress = { ...prev.characterProgress };
      // Ensure at least the first character in the selected preference is unlocked
      if (filtered.length > 0 && !filtered.some((c) => nextProgress[c.id].unlocked)) {
        nextProgress[filtered[0].id] = {
          ...nextProgress[filtered[0].id],
          unlocked: true,
        };
      }
      const currVisibleAndUnlocked = filtered.find(
        (c) => c.id === prev.activeCharacterId && nextProgress[c.id].unlocked
      );
      const fallbackActive =
        currVisibleAndUnlocked?.id ||
        filtered.find((c) => nextProgress[c.id].unlocked)?.id ||
        prev.activeCharacterId;

      return {
        ...prev,
        ...patch,
        activeCharacterId: fallbackActive,
        characterProgress: nextProgress,
      };
    });
  };

  const handleSwitchRoom = (room: ActiveRoom) => {
    sfx.click(game.soundEnabled);
    setGame((prev) => ({ ...prev, activeRoom: room }));
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#FBF7F5] text-[#231F28]">
      {/* Top Bar Contract: Vertical Game Shell */}
      <header className="shrink-0 z-40 bg-white/95 backdrop-blur-sm border-b border-black/8">
        <div className="max-w-[720px] w-full mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => handleSwitchRoom("office")}
            className="text-sm sm:text-base font-bold tracking-tight text-[#231F28] whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <img
              src={BACKDROPS.emblem}
              alt="Emblema Agencia Latido"
              referrerPolicy="no-referrer"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-black/10"
            />
            Agencia Latido
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-[#6B5E70]">
            <button
              type="button"
              onClick={() => handleSwitchRoom("office")}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                game.activeRoom === "office"
                  ? "border-[#E14D7A] text-[#231F28] font-semibold"
                  : "border-transparent hover:text-[#231F28]"
              }`}
            >
              Oficina
            </button>
            <button
              type="button"
              onClick={() => handleSwitchRoom("bedroom")}
              className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                game.activeRoom === "bedroom"
                  ? "border-[#E14D7A] text-[#231F28] font-semibold"
                  : "border-transparent hover:text-[#231F28]"
              }`}
            >
              Habitación
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("roster")}
              className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:text-[#231F28] transition-colors cursor-pointer"
            >
              Elenco
            </button>
          </nav>

          {/* Zone 3: Primary token & sound action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              className="hidden sm:flex items-center gap-1 text-xs text-[#6B5E70] whitespace-nowrap"
              title="Relaciones completadas"
            >
              <Heart className="w-3.5 h-3.5 text-[#E14D7A]" />
              <span className="font-mono-num font-semibold text-[#231F28]">
                {game.totalRelationshipsCompleted}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal("achievements")}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-[#6B5E70] hover:text-[#231F28] cursor-pointer"
              title="Logros desbloqueados"
            >
              <Award className="w-3.5 h-3.5 text-[#D9822B]" />
              <span className="font-mono-num font-semibold text-[#231F28]">
                {game.unlockedAchievementIds.length}/{ACHIEVEMENTS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setGame((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
              }
              className="p-1.5 sm:p-2 rounded-lg border border-black/10 hover:bg-black/5 text-[#4D4254] cursor-pointer"
              aria-label={game.soundEnabled ? "Silenciar audio" : "Activar audio"}
              title={game.soundEnabled ? "Silenciar audio" : "Activar audio"}
            >
              {game.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("inventory")}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#231F28] hover:bg-[#3A3342] text-white text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-[#F6C453]" />
              <span className="font-mono-num">{game.tokens}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Achievement / Event Toast Banner (never shifts game stage) */}
      {bannerNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[680px] pointer-events-auto">
          <div className="p-3.5 rounded-xl bg-white/98 backdrop-blur-sm border border-[#E14D7A]/45 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#E14D7A] shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#231F28]">{bannerNotice.title}</p>
                <p className="text-[11px] sm:text-xs text-[#4D4254]">{bannerNotice.detail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerNotice(null)}
              className="text-xs font-medium text-[#6B5E70] hover:text-[#231F28] cursor-pointer shrink-0"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Main Vertical Viewport-Locked Container (Stage stays still, lower panel scrolls) */}
      <main className="flex-1 min-h-0 max-w-[720px] w-full mx-auto px-3 sm:px-5 py-2 sm:py-3 overflow-hidden flex flex-col">
        {game.activeRoom === "office" ? (
          <OfficeScene
            playerName={game.playerName}
            playerPronoun={game.playerPronoun}
            playerAppearance={game.playerAppearance}
            character={activeCharacter}
            progress={activeProgress}
            isLoadingAI={isLoadingAI}
            aiError={aiError}
            inventoryCount={totalInventoryCount}
            onSelectOption={handleSelectOption}
            onSendCustomLine={handleSendCustomLine}
            onMakeLoseInterest={handleMakeLoseInterest}
            onTriggerSpecial={handleTriggerSpecial}
            onTriggerRandomEvent={triggerRandomEvent}
            onConfess={handleConfess}
            onAcceptNpcConfession={handleAcceptNpcConfession}
            onDeclineNpcConfession={handleDeclineNpcConfession}
            onSkipLevel={handleSkipLevel}
            onRecoverFromBreakup={handleRecoverFromBreakup}
            onInviteHome={() => handleInviteHome(activeCharacter.id)}
            onOpenModal={setActiveModal}
          />
        ) : (
          <BedroomStudio
            playerName={game.playerName}
            playerGender={game.playerGender}
            playerPronoun={game.playerPronoun}
            orientation={game.orientation}
            datePreference={game.datePreference}
            onChangeName={(name) => setGame((prev) => ({ ...prev, playerName: name }))}
            onUpdateIdentity={handleUpdateIdentity}
            appearance={game.playerAppearance}
            unlockedWardrobeIds={game.unlockedWardrobeIds}
            tokens={game.tokens}
            conqueredPartners={conqueredPartners}
            homePartner={homePartner}
            homePartnerProgress={homePartnerProgress}
            favoriteCharacterId={game.favoriteCharacterId}
            isHomeLoading={isHomeLoading}
            onSelectHomePartner={(charId) => {
              sfx.click(game.soundEnabled);
              setGame((prev) => ({ ...prev, homePartnerId: charId }));
            }}
            onToggleFavorite={handleToggleFavorite}
            onCoupleHomeAction={handleCoupleHomeAction}
            onOpenPhone={() => setActiveModal("phone")}
            onUpdateAppearance={(patch) => {
              sfx.click(game.soundEnabled);
              setGame((prev) => ({
                ...prev,
                playerAppearance: { ...prev.playerAppearance, ...patch },
              }));
            }}
            onBuyWardrobeItem={handleBuyWardrobeItem}
            onGoToOffice={() => handleSwitchRoom("office")}
          />
        )}
      </main>

      {/* Slim Pinned Footer */}
      <footer className="shrink-0 border-t border-black/8 bg-white/80 py-2 px-4">
        <div className="max-w-[720px] mx-auto flex items-center justify-between gap-3 text-[11px] text-[#6B5E70]">
          <span className="truncate">Agencia Latido · Simulador Pixel Chibi de Manhwa</span>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              localStorage.removeItem("agencia_latido_save_v1");
              setGame(createInitialGameState());
              showNotice(
                "Partida reiniciada",
                "Comienzas un nuevo expediente en la agencia."
              );
            }}
            className="inline-flex items-center gap-1 hover:text-[#231F28] cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar
          </button>
        </div>
      </footer>

      {/* Active Random Event Overlay */}
      {game.activeRandomEvent && (
        <RandomEventCard
          character={activeCharacter}
          event={game.activeRandomEvent}
          onAcceptPositive={handleAcceptPositiveEvent}
          onSelectNegativeChoice={handleSelectNegativeEventChoice}
        />
      )}

      {/* Conquest Celebration Modal */}
      {conquestCelebration && (
        <ConquestCelebrationModal
          playerName={game.playerName}
          playerAppearance={game.playerAppearance}
          conqueredCharacter={
            CHARACTERS.find((c) => c.id === conquestCelebration.conqueredCharacterId) ||
            activeCharacter
          }
          nextCharacter={
            conquestCelebration.nextCharacterId
              ? CHARACTERS.find((c) => c.id === conquestCelebration.nextCharacterId)
              : undefined
          }
          rewardTokens={conquestCelebration.rewardTokens}
          conqueredByNpcProposal={conquestCelebration.conqueredByNpcProposal}
          onAdvanceToNextTarget={() => {
            sfx.click(game.soundEnabled);
            if (conquestCelebration.nextCharacterId) {
              setGame((prev) => ({
                ...prev,
                activeCharacterId: conquestCelebration.nextCharacterId!,
                activeRoom: "office",
              }));
            }
            setConquestCelebration(null);
          }}
          onStayHere={() => {
            sfx.click(game.soundEnabled);
            setConquestCelebration(null);
          }}
        />
      )}

      {/* Active Modals */}
      {activeModal === "camera" && (
        <CameraModal
          playerName={game.playerName}
          playerAppearance={game.playerAppearance}
          character={activeCharacter}
          photos={game.photos}
          onTakePhoto={handleTakePhoto}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "inventory" && (
        <InventoryModal
          character={activeCharacter}
          tokens={game.tokens}
          inventory={game.inventory}
          receivedGifts={game.receivedGifts}
          isLoadingAI={isLoadingAI}
          onBuyGift={handleBuyGift}
          onGiveGift={handleGiveGift}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "phone" && (
        <PhoneModal
          playerName={game.playerName}
          character={activeCharacter}
          progress={activeProgress}
          allCharacters={CHARACTERS}
          allProgress={game.characterProgress}
          favoriteCharacterId={game.favoriteCharacterId}
          photos={game.photos}
          isSendingChat={isSendingChat}
          chatError={chatError}
          onSelectContact={(charId) => {
            sfx.click(game.soundEnabled);
            setChatError(null);
            setGame((prev) => ({
              ...prev,
              activeCharacterId: charId,
            }));
          }}
          onToggleFavorite={handleToggleFavorite}
          onInviteHome={handleInviteHome}
          onSendPhoneMessage={handleSendPhoneMessage}
          onGoToScheduledDate={handleGoToScheduledDate}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "notebook" && (
        <NotebookModal
          character={activeCharacter}
          progress={activeProgress}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "achievements" && (
        <AchievementsModal
          unlockedAchievementIds={game.unlockedAchievementIds}
          progressCounts={achievementCounts}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "roster" && (
        <RosterModal
          activeCharacterId={game.activeCharacterId}
          favoriteCharacterId={game.favoriteCharacterId}
          datePreference={game.datePreference}
          characterProgress={game.characterProgress}
          onChangeDatePreference={(pref) =>
            handleUpdateIdentity({ datePreference: pref })
          }
          onSelectCharacter={(id) => {
            sfx.click(game.soundEnabled);
            setGame((prev) => ({
              ...prev,
              activeCharacterId: id,
              activeRoom: "office",
              characterProgress: {
                ...prev.characterProgress,
                [id]: {
                  ...prev.characterProgress[id],
                  unlocked: true,
                  contactAdded: true,
                },
              },
            }));
            setActiveModal(null);
          }}
          onRenewRomance={handleRenewRomance}
          onToggleFavorite={handleToggleFavorite}
          onInviteHome={handleInviteHome}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
