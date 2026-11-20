import React, { useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Clock,
  Gift,
  Globe,
  Heart,
  Home,
  Loader2,
  MapPin,
  RotateCcw,
  Send,
  SkipForward,
  Smartphone,
  Sparkles,
  UserMinus,
  Users,
  Zap,
} from "lucide-react";
import {
  DIFFICULTY_META,
  MOOD_LABELS,
  calculateAttractiveness,
  getCharacterChapter,
} from "../data/gameData";
import {
  ActiveModal,
  CharacterProfile,
  CharacterProgress,
  ChibiAppearance,
  ChibiPose,
  DialogueOption,
  PlayerPronoun,
} from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface OfficeSceneProps {
  playerName: string;
  playerPronoun: PlayerPronoun;
  playerAppearance: ChibiAppearance;
  character: CharacterProfile;
  progress: CharacterProgress;
  isLoadingAI: boolean;
  aiError: string | null;
  inventoryCount: number;
  onSelectOption: (option: DialogueOption) => void;
  onSendCustomLine: (text: string) => void;
  onMakeLoseInterest: () => void;
  onTriggerSpecial: (specialId: string) => void;
  onTriggerRandomEvent: () => void;
  onConfess: () => void;
  onAcceptNpcConfession: () => void;
  onDeclineNpcConfession: () => void;
  onSkipLevel: () => void;
  onRecoverFromBreakup: () => void;
  onInviteHome: () => void;
  onOpenModal: (modal: ActiveModal) => void;
}

const TONE_ACCENT: Record<DialogueOption["tone"], string> = {
  dulce: "text-rose-700",
  coqueto: "text-pink-700",
  sincero: "text-emerald-700",
  broma: "text-amber-700",
  atrevido: "text-violet-700",
};

function formatDateTimer(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const OfficeScene: React.FC<OfficeSceneProps> = ({
  playerName,
  playerPronoun,
  playerAppearance,
  character,
  progress,
  isLoadingAI,
  aiError,
  inventoryCount,
  onSelectOption,
  onSendCustomLine,
  onMakeLoseInterest,
  onTriggerSpecial,
  onTriggerRandomEvent,
  onConfess,
  onAcceptNpcConfession,
  onDeclineNpcConfession,
  onSkipLevel,
  onRecoverFromBreakup,
  onInviteHome,
  onOpenModal,
}) => {
  const [customLine, setCustomLine] = useState("");
  const [backdropBroken, setBackdropBroken] = useState(false);
  const [rightTab, setRightTab] = useState<"dialogue" | "specials">("dialogue");

  const chapter = getCharacterChapter(character, progress.compatibility);
  const moodMeta = MOOD_LABELS[progress.mood];
  const diffMeta = DIFFICULTY_META[character.difficulty];
  const attractiveness = calculateAttractiveness(playerAppearance);
  const latestDialogue =
    progress.dialogueHistory[progress.dialogueHistory.length - 1];
  const latestCharacterLine = [...progress.dialogueHistory]
    .reverse()
    .find((entry) => entry.speaker !== "player");
  const latestPlayerLine =
    latestDialogue?.speaker === "player"
      ? latestDialogue
      : progress.dialogueHistory.length >= 2 &&
          progress.dialogueHistory[progress.dialogueHistory.length - 2]?.speaker === "player"
        ? progress.dialogueHistory[progress.dialogueHistory.length - 2]
        : null;

  const isBrokenUp = progress.patience <= 0 || progress.dateStatus === "broken";
  const isDateExpired =
    progress.isTimedDate && progress.dateStatus === "expired" && !progress.conquered;
  const isDateInactive = isBrokenUp || isDateExpired;

  const canConfess =
    progress.compatibility >= 85 && !progress.conquered && !isDateInactive;

  const partnerPose: ChibiPose =
    progress.mood === "enamorado"
      ? "finger_heart"
      : progress.mood === "jugueton"
        ? "wink_pose"
        : progress.mood === "timido"
          ? "shy_hold"
          : progress.mood === "encantado"
            ? "toast"
            : "idle";

  const playerPose: ChibiPose = progress.conquered
    ? "finger_heart"
    : progress.compatibility >= 50
      ? "wave"
      : "idle";

  const rewardPerStepText =
    character.difficulty === "dificil"
      ? `+25 fichas/subida · +${character.rewardTokens} al conquistar`
      : character.difficulty === "media"
        ? `+15 fichas/subida · +${character.rewardTokens} al conquistar`
        : `+10 fichas/subida · +${character.rewardTokens} al conquistar`;

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customLine.trim();
    if (!trimmed || isLoadingAI || isDateInactive) return;
    setCustomLine("");
    onSendCustomLine(trimmed);
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      {/* TOP (PINNED STILL): Visual Novel Stage + Always-Visible Dialogue Box + Tool Dock */}
      <div className="shrink-0 rounded-2xl overflow-hidden border border-black/10 bg-[#F3EAE6] flex flex-col shadow-sm">
        <div className="relative h-[23dvh] min-h-[172px] max-h-[235px] w-full overflow-hidden flex flex-col justify-between">
          {!backdropBroken ? (
            <img
              src={chapter.backdropUrl}
              alt={chapter.scenarioName}
              referrerPolicy="no-referrer"
              onError={() => setBackdropBroken(true)}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#FBEFF4] via-[#F5E8DE] to-[#E9DFEE]" />
          )}

          {/* Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#231F28]/65 via-[#231F28]/5 to-[#231F28]/85" />

          {/* Falling Sakura petals in evolved chapters (>= Ch. 2) */}
          {chapter.chapter >= 2 && !isDateInactive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[12, 32, 54, 76, 88].map((leftPct, i) => (
                <span
                  key={leftPct}
                  className="animate-petal absolute top-0 w-2.5 h-1.5 rounded-full bg-pink-200/85"
                  style={{
                    left: `${leftPct}%`,
                    animationDelay: `${i * 1.3}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Top Stage HUD */}
          <div className="relative z-10 p-2.5 sm:p-3.5 flex flex-col gap-1.5 sm:gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="bg-white/93 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-black/8 min-w-0 max-w-[68%] sm:max-w-sm">
                <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-[11px] text-[#6B5E70]">
                  <span className={`font-semibold ${diffMeta.colorClass}`}>
                    {diffMeta.label}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 truncate">
                    <Globe className="w-3 h-3 text-indigo-600 shrink-0" />
                    {character.country}
                  </span>
                  {character.isToxicOrDangerous && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-red-700 truncate">
                        {character.personalityTrait}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-[#231F28] truncate">
                    {character.name}
                  </h2>
                  <span className="text-[11px] text-[#6B5E70] shrink-0">{character.koreanName}</span>
                  {progress.conquered && (
                    <span className="text-[11px] font-semibold text-[#E14D7A] shrink-0">
                      · Novios
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex text-[11px] text-[#4D4254] items-center gap-1.5 mt-0.5 truncate">
                  <Briefcase className="w-3 h-3 text-[#6B5E70] shrink-0" />
                  <span className="truncate">{character.occupation}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#6B5E70] flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-[#E14D7A] shrink-0" />
                  <span className="truncate">{chapter.scenarioName}</span>
                </div>
              </div>

              {/* Conditional 5-Minute Timer / Relaxed Date Badge + Mood */}
              <div className="bg-white/93 backdrop-blur-sm rounded-xl px-2.5 py-1.5 border border-black/8 flex items-center gap-2.5 shrink-0">
                {!progress.conquered && (
                  <div className="border-r border-black/10 pr-2">
                    <div className="text-[9px] sm:text-[10px] text-[#6B5E70] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {progress.isTimedDate ? "Agenda" : "Ritmo"}
                    </div>
                    {progress.isTimedDate ? (
                      <div
                        className={`text-xs sm:text-sm font-mono-num font-bold ${
                          isDateExpired
                            ? "text-red-700"
                            : progress.dateSecondsLeft <= 30
                              ? "text-red-600"
                              : "text-[#231F28]"
                        }`}
                      >
                        {formatDateTimer(progress.dateSecondsLeft)}
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-emerald-700">
                        Sin prisa
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="text-[9px] sm:text-[10px] text-[#6B5E70]">Ánimo</div>
                  <div
                    className={`text-[11px] sm:text-xs font-semibold flex items-center gap-1 ${moodMeta.colorClass}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${moodMeta.dotClass}`} />
                    {moodMeta.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Dual Conquest & Patience Meters Bar */}
            <div className="bg-white/93 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-black/8 grid grid-cols-3 gap-2.5 items-center">
              <div>
                <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6B5E70]">
                  <span className="truncate">Tu Conquista</span>
                  <span className="font-mono-num font-bold text-[#E14D7A]">
                    {progress.compatibility}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/8 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-[#E14D7A] transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, progress.compatibility))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6B5E70]">
                  <span className="truncate">Su Coqueteo</span>
                  <span className="font-mono-num font-bold text-violet-700">
                    {progress.playerAttraction || 0}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/8 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-violet-500 transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, progress.playerAttraction || 0))}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6B5E70]">
                  <span className="truncate">Paciencia</span>
                  <span
                    className={`font-mono-num font-bold ${
                      progress.patience <= 40 ? "text-red-700" : "text-[#231F28]"
                    }`}
                  >
                    {progress.patience}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/8 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progress.patience <= 35
                        ? "bg-red-500"
                        : progress.patience <= 60
                          ? "bg-amber-500"
                          : "bg-emerald-600"
                    }`}
                    style={{
                      width: `${Math.max(0, Math.min(100, progress.patience))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Pixel Chibis */}
          <div className="relative z-10 px-3 sm:px-5 pb-1.5 flex flex-col gap-1">
            {/* Warning strip if Patience is dropping or Character is Molesto */}
            {!isDateInactive && (progress.mood === "molesto" || progress.patience <= 45) && (
              <div className="mx-auto px-2.5 py-0.5 rounded-lg bg-red-50/95 border border-red-200 text-[10px] font-semibold text-red-800 flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {progress.mood === "molesto"
                  ? "Se nota molesto/a · El afecto baja si no arreglas el ambiente"
                  : "Paciencia baja · Cuesta más sumar afinidad"}
              </div>
            )}

            <div className="flex items-end justify-between px-2 sm:px-6">
              <div className="flex flex-col items-center">
                <ChibiAvatar
                  appearance={playerAppearance}
                  pose={playerPose}
                  facing="right"
                  size="md"
                  floating={true}
                  className="!w-18 !h-22 sm:!w-26 sm:!h-30"
                />
                <span className="mt-0.5 px-2 py-0.5 rounded-md bg-white/92 text-[10px] font-semibold text-[#231F28] shadow-xs">
                  {playerName} ({playerPronoun}) · +{attractiveness}
                </span>
              </div>

              {canConfess && (
                <button
                  type="button"
                  onClick={onConfess}
                  disabled={isLoadingAI}
                  className="mb-4 px-3 py-1.5 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  Declararse Novios
                </button>
              )}

              {!isDateExpired ? (
                <div className="flex flex-col items-center">
                  <ChibiAvatar
                    appearance={character.appearance}
                    mood={progress.mood}
                    pose={partnerPose}
                    facing="left"
                    size="md"
                    floating={!isBrokenUp}
                    showMoodAura={true}
                    className="!w-18 !h-22 sm:!w-26 sm:!h-30"
                  />
                  <span className="mt-0.5 px-2 py-0.5 rounded-md bg-white/92 text-[10px] font-semibold text-[#231F28] shadow-xs">
                    {character.name}
                  </span>
                </div>
              ) : (
                <div className="mb-3 px-3 py-2 rounded-xl bg-white/92 border border-black/10 text-center max-w-[170px] shadow-sm">
                  <div className="text-xs font-bold text-[#231F28]">
                    {character.name} se retiró
                  </div>
                  <div className="text-[10px] text-[#6B5E70] mt-0.5">
                    Escríbele por teléfono para agendar otra cita.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Manhwa Dialogue Reply Box (Never clipped, always visible below stage) */}
        <div className="bg-white border-t border-black/8 px-3.5 py-2.5 space-y-1 max-h-[116px] overflow-y-auto">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-[#E14D7A]">
              {character.name}
            </span>
            <span className="text-[#6B5E70] truncate">
              Cap. {chapter.chapter}: {chapter.title} ·{" "}
              {latestCharacterLine?.timestamp || latestDialogue?.timestamp || "Ahora"}
            </span>
          </div>

          {latestPlayerLine && (
            <p className="text-[11px] text-[#6B5E70] truncate">
              <strong className="text-[#4D4254]">{playerName}:</strong> “{latestPlayerLine.text}”
            </p>
          )}

          {isLoadingAI ? (
            <div className="text-xs sm:text-sm text-[#E14D7A] font-medium flex items-center gap-2 py-0.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>{character.name} está pensando su respuesta...</span>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-[#231F28] leading-snug font-medium">
                “{latestCharacterLine?.text || latestDialogue?.text || character.openingLine}”
              </p>
              {latestCharacterLine?.pursuitAction && (
                <div className="text-[11px] font-semibold text-violet-700 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{latestCharacterLine.pursuitAction}</span>
                </div>
              )}
              {latestCharacterLine?.note && (
                <p className="text-[11px] text-[#6B5E70] italic">{latestCharacterLine.note}</p>
              )}
            </>
          )}
        </div>

        {/* Bottom Tool Dock Bar */}
        <div className="bg-white border-t border-black/8 px-2.5 sm:px-3.5 py-2 flex items-center justify-between gap-1.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenModal("camera")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 bg-[#FAF7F6] hover:bg-[#F3ECEA] text-[11px] sm:text-xs font-medium text-[#231F28] cursor-pointer whitespace-nowrap"
            >
              <Camera className="w-3.5 h-3.5 text-[#E14D7A]" />
              Cámara
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("inventory")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 bg-[#FAF7F6] hover:bg-[#F3ECEA] text-[11px] sm:text-xs font-medium text-[#231F28] cursor-pointer whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-[#D9822B]" />
              Regalos ({inventoryCount})
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("phone")}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-medium cursor-pointer whitespace-nowrap ${
                isDateExpired
                  ? "border-[#E14D7A] bg-[#FFF5F8] text-[#C93B6B] font-semibold"
                  : "border-black/10 bg-[#FAF7F6] hover:bg-[#F3ECEA] text-[#231F28]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              Teléfono
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("notebook")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 bg-[#FAF7F6] hover:bg-[#F3ECEA] text-[11px] sm:text-xs font-medium text-[#231F28] cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              Libreta
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("achievements")}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 bg-[#FAF7F6] hover:bg-[#F3ECEA] text-[11px] sm:text-xs font-medium text-[#231F28] cursor-pointer whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Logros
            </button>
            <button
              type="button"
              disabled={isDateInactive || isLoadingAI}
              onClick={onTriggerRandomEvent}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E14D7A]/30 bg-[#FFF5F8] hover:bg-[#FFE8F0] disabled:opacity-45 text-[11px] sm:text-xs font-semibold text-[#C93B6B] cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5" />
              Evento
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenModal("roster")}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/10 bg-white hover:bg-[#FAF7F6] text-[11px] sm:text-xs font-semibold text-[#231F28] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-[#6B5E70]" />
            Elenco
          </button>
        </div>
      </div>

      {/* BOTTOM: Pinned Switcher & Error + Scrollable Options + Pinned Reply Input */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-black/10 p-3 sm:p-3.5 flex flex-col gap-2.5 shadow-sm overflow-hidden">
        {/* Mutual Conquest Info Strip */}
        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-[#FAF7F6] border border-black/8 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
          <span className="font-medium text-[#4D4254]">
            {character.difficulty === "dificil"
              ? progress.compatibility >= 45
                ? "Difícil (confianza ganada): tú conquistas, ya empieza a coquetear contigo."
                : "Difícil: tú conquistas primero · al superar 45% de afinidad coqueteará de vuelta."
              : "Conquista mutua: puedes conquistarle o dejar que te conquiste con su coqueteo."}
          </span>
          <span className="font-mono-num font-semibold text-[#D9822B]">
            {rewardPerStepText}
          </span>
        </div>

        {aiError && (
          <div className="shrink-0 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
            {aiError}
          </div>
        )}

        {/* NPC Proposal Banner (when facil/media NPC reaches high attraction) */}
        {progress.npcConfessing && !progress.conquered && !isDateInactive && (
          <div className="shrink-0 p-3.5 rounded-2xl bg-gradient-to-r from-[#FFF1F6] via-[#FFF8FA] to-[#F5EFFC] border border-[#E14D7A]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E14D7A]">
              <Heart className="w-4 h-4 fill-[#E14D7A]" />
              ¡{character.name} quiere conquistarte!
            </div>
            <p className="text-xs text-[#231F28] leading-relaxed">
              {character.name} no aguantó las ganas y te está pidiendo ser novios oficiales tras ganarse tu corazón ({progress.playerAttraction}% de coqueteo).
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onAcceptNpcConfession}
                className="px-4 py-2 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                ¡Aceptar ser novios!
              </button>
              <button
                type="button"
                onClick={onDeclineNpcConfession}
                className="px-4 py-2 rounded-xl border border-black/15 bg-white hover:bg-black/5 text-[#231F28] text-xs font-semibold cursor-pointer"
              >
                Hacerme esperar un poco
              </button>
            </div>
          </div>
        )}

        {isBrokenUp ? (
          <div className="flex-1 min-h-0 overflow-y-auto py-3 space-y-4">
            <div className="text-xs font-semibold text-red-700">
              Perdió el interés · Paciencia agotada (0%)
            </div>
            <h3 className="text-xl font-bold text-[#231F28]">
              {character.name} perdió todo interés y se marchó
            </h3>
            <p className="text-sm text-[#4D4254] leading-relaxed">
              Ya que su paciencia llegó a cero, puedes <strong>saltar este nivel</strong> para
              desbloquear y pasar al siguiente personaje, o reintentar si cambias de opinión.
            </p>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onSkipLevel}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                Saltar nivel y pasar al siguiente
              </button>
              <button
                type="button"
                onClick={onRecoverFromBreakup}
                className="w-full py-2.5 px-4 rounded-xl border border-black/15 hover:bg-black/5 text-[#231F28] text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reintentar conquista
              </button>
            </div>
          </div>
        ) : isDateExpired ? (
          <div className="flex-1 min-h-0 overflow-y-auto py-3 space-y-4">
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Tiempo terminado (00:00) · Cita de 5 minutos concluida
            </div>
            <h3 className="text-xl font-bold text-[#231F28]">
              {character.name} tuvo que volver a su trabajo
            </h3>
            <p className="text-sm text-[#4D4254] leading-relaxed">
              Hoy tenía agenda apretada y pasaron los 5 minutos de esta cita sin cerrar la conquista.
              ¡Pero no termina aquí! Escríbele por el teléfono para agendar otra cita; cuando acepte aparecerá el botón{" "}
              <strong>Ir a cita</strong> en el chat.
            </p>
            <div className="p-3.5 rounded-xl bg-[#FAF7F6] border border-black/8 text-xs text-[#6B5E70] space-y-1">
              <div>
                Afinidad conservada:{" "}
                <strong className="text-[#E14D7A] font-mono-num">
                  {progress.compatibility}%
                </strong>{" "}
                · Paciencia:{" "}
                <strong className="text-[#231F28] font-mono-num">{progress.patience}%</strong>
              </div>
              <div>
                Trabajo: <strong className="text-[#231F28]">{character.occupation}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenModal("phone")}
              className="w-full py-3 px-4 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Smartphone className="w-4 h-4" />
              Escribir por Teléfono y agendar otra cita
            </button>
          </div>
        ) : (
          <>
            {/* Pinned Panel Switcher */}
            <div className="shrink-0 grid grid-cols-2 gap-1 p-1 bg-[#F5EFF0] rounded-xl">
              <button
                type="button"
                onClick={() => setRightTab("dialogue")}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  rightTab === "dialogue"
                    ? "bg-white text-[#231F28] shadow-xs"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                Diálogos Dinámicos
              </button>
              <button
                type="button"
                onClick={() => setRightTab("specials")}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  rightTab === "specials"
                    ? "bg-white text-[#231F28] shadow-xs"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                Escenas Especiales
              </button>
            </div>

            {/* Independently Scrollable Options / Specials */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5">
              {rightTab === "dialogue" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B5E70]">
                    <span>Elige cómo responder</span>
                    {isLoadingAI && (
                      <span className="inline-flex items-center gap-1.5 text-[#E14D7A] font-semibold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Respondiendo...
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {progress.currentOptions.map((opt, idx) => (
                      <button
                        key={`${opt.text}_${idx}`}
                        type="button"
                        disabled={isLoadingAI}
                        onClick={() => onSelectOption(opt)}
                        className="w-full text-left p-3 rounded-xl border border-black/10 bg-[#FAF7F6] hover:bg-[#FFF5F8] hover:border-[#E14D7A]/50 transition-colors disabled:opacity-55 cursor-pointer flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[11px] font-bold ${TONE_ACCENT[opt.tone]}`}>
                            {opt.hint}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-[#231F28] font-medium leading-snug">
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-[#6B5E70] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E14D7A]" />
                    Momentos exclusivos por nivel de compatibilidad
                  </div>
                  {character.specialInteractions.map((sp) => {
                    const unlocked = progress.compatibility >= sp.minCompatibility;
                    const used = progress.usedSpecialIds.includes(sp.id);

                    return (
                      <button
                        key={sp.id}
                        type="button"
                        disabled={!unlocked || used || isLoadingAI}
                        onClick={() => onTriggerSpecial(sp.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${
                          unlocked && !used
                            ? "border-[#E14D7A]/40 bg-[#FFF7FA] hover:bg-[#FFEBF2] cursor-pointer"
                            : "border-black/8 bg-[#FAF7F6] opacity-70 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-[#231F28]">
                            {sp.title}
                          </span>
                          <span className="text-xs font-mono-num font-medium text-[#6B5E70]">
                            {used
                              ? "Completada"
                              : unlocked
                                ? "Disponible"
                                : `${sp.minCompatibility}%`}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B5E70] mt-1">{sp.description}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pinned Instant Send Free-Form Input + Quick Lose Interest / Home Actions */}
            <div className="shrink-0 pt-2.5 border-t border-black/8 space-y-2">
              <form onSubmit={handleSubmitCustom} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                  disabled={isLoadingAI}
                  placeholder={`Escribe tu respuesta para ${character.name}...`}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F6] border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E14D7A]/30"
                />
                <button
                  type="submit"
                  disabled={isLoadingAI || !customLine.trim()}
                  className="px-4 py-2 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B5E70]">
                <span className="truncate">{diffMeta.desc}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {progress.conquered ? (
                    <button
                      type="button"
                      onClick={onInviteHome}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#231F28] text-white font-semibold cursor-pointer hover:bg-[#3A3342]"
                    >
                      <Home className="w-3 h-3" />
                      Ir a Casa juntos
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isLoadingAI}
                      onClick={onMakeLoseInterest}
                      title="Responde con frialdad para bajar su paciencia y saltar este nivel si no te gusta"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-black/10 bg-[#FAF7F6] hover:bg-red-50 hover:text-red-700 text-[#4D4254] font-semibold cursor-pointer disabled:opacity-50"
                    >
                      <UserMinus className="w-3 h-3" />
                      Hacer perder interés
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
