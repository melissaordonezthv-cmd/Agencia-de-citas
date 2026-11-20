import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Gift,
  Heart,
  Lock,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { DIFFICULTY_META, GIFT_CATALOG, MOOD_LABELS } from "../data/gameData";
import { CharacterProfile, CharacterProgress } from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface NotebookModalProps {
  character: CharacterProfile;
  progress: CharacterProgress;
  onClose: () => void;
}

type NotebookTab = "ficha" | "gustos" | "secretos" | "capitulos";

export const NotebookModal: React.FC<NotebookModalProps> = ({
  character,
  progress,
  onClose,
}) => {
  const [tab, setTab] = useState<NotebookTab>("ficha");
  const moodMeta = MOOD_LABELS[progress.mood];
  const diffMeta = DIFFICULTY_META[character.difficulty];
  const favGifts = GIFT_CATALOG.filter((g) => character.favoriteGiftIds.includes(g.id));

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Vertical Korean Stationery Notebook */}
      <div className="bg-[#FDF9F3] w-full max-w-xl rounded-2xl border-2 border-[#D9CBBF] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Binder Header */}
        <div className="px-5 py-3.5 border-b border-[#E7DDD3] bg-[#F6EFE6] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#D9CBBF] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#E14D7A]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#231F28]">
                Libreta Confidencial · Expediente #{character.order}
              </h2>
              <p className="text-xs text-[#6B5E70]">
                Notas personales de {character.name} ({character.koreanName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer"
            aria-label="Cerrar libreta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vertical Notebook Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Top Polaroid & Ledger Summary */}
          <div className="p-4 sm:p-5 bg-[#FAF3EB] border-b border-[#E7DDD3] space-y-3.5">
            <div className="bg-white p-3.5 rounded-xl border border-[#E7DDD3] shadow-xs flex items-center gap-4">
              <div className="w-24 py-2 rounded-lg bg-[#FDF7FA] border border-[#F3E2EA] flex justify-center shrink-0">
                <ChibiAvatar
                  appearance={character.appearance}
                  mood={progress.mood}
                  pose="idle"
                  size="sm"
                  floating={false}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[#231F28] truncate">{character.name}</h3>
                <p className="text-xs text-[#6B5E70] truncate">
                  {character.koreanName} · {character.mbti} · {character.role}
                </p>
                <p className="text-xs text-[#4D4254] mt-1.5 leading-relaxed italic">
                  “{character.tagline}”
                </p>
              </div>
            </div>

            {/* Clean Ledger Metrics */}
            <div className="bg-white rounded-xl border border-[#E7DDD3] p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B5E70]">Compatibilidad</span>
                <span className="font-mono-num font-bold text-[#E14D7A]">
                  {progress.compatibility}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#F3ECEA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E14D7A]"
                  style={{ width: `${progress.compatibility}%` }}
                />
              </div>

              <div className="pt-1.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/6">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">País</span>
                  <span className="font-semibold text-[#231F28] truncate">{character.country}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">Carácter</span>
                  <span
                    className={`font-semibold truncate ${
                      character.isToxicOrDangerous ? "text-red-700" : "text-[#231F28]"
                    }`}
                  >
                    {character.personalityTrait}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">Trabajo</span>
                  <span className="font-semibold text-[#231F28] truncate">{character.occupation}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">Dificultad</span>
                  <span className={`font-semibold ${diffMeta.colorClass}`}>{diffMeta.shortLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">Estado</span>
                  <span className={`font-semibold ${moodMeta.colorClass}`}>{moodMeta.label}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[#6B5E70]">Premio</span>
                  <span className="font-mono-num font-semibold text-[#D9822B]">
                    +{character.rewardTokens} fichas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabbed Sections */}
          <div className="p-4 sm:p-5 flex flex-col gap-4 bg-[#FFFDF9]">
            {/* Index Divider Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F3ECEA] rounded-xl">
              {(
                [
                  { id: "ficha", label: "Ficha" },
                  { id: "gustos", label: "Gustos" },
                  { id: "secretos", label: `Secretos (${progress.discoveredSecrets.length})` },
                  { id: "capitulos", label: "Capítulos" },
                ] as { id: NotebookTab; label: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    tab === t.id
                      ? "bg-white text-[#231F28] shadow-xs"
                      : "text-[#6B5E70] hover:text-[#231F28]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-[300px] max-h-[380px] overflow-y-auto pr-1 space-y-4">
              {tab === "ficha" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-2">
                    <h4 className="text-xs font-bold text-[#6B5E70] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#E14D7A]" />
                      Personalidad y Trato
                    </h4>
                    <p className="text-sm text-[#231F28] leading-relaxed">
                      {character.personality}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-2">
                    <h4 className="text-xs font-bold text-[#6B5E70]">Forma de Hablar</h4>
                    <p className="text-xs sm:text-sm text-[#4D4254] leading-relaxed">
                      {character.speechStyle}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-1.5 text-xs">
                    <div className="font-bold text-[#6B5E70]">Comida Favorita</div>
                    <div className="text-sm font-medium text-[#231F28]">
                      {character.favoriteFood}
                    </div>
                  </div>
                </div>
              )}

              {tab === "gustos" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-2.5">
                    <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      Lo que le conquista
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#231F28]">
                      {character.likes.map((item) => (
                        <li
                          key={item}
                          className="px-3 py-2 rounded-lg bg-[#FAF7F5] border border-black/6 capitalize"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-2.5">
                    <h4 className="text-xs font-bold text-red-700">Lo que debes evitar</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4D4254]">
                      {character.dislikes.map((item) => (
                        <li
                          key={item}
                          className="px-3 py-2 rounded-lg bg-red-50/40 border border-red-200/50 capitalize"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E7DDD3] space-y-2">
                    <h4 className="text-xs font-bold text-[#D9822B] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      Regalos Ideales
                    </h4>
                    {progress.compatibility >= 15 || progress.conquered ? (
                      <div className="flex flex-wrap gap-2">
                        {favGifts.map((g) => (
                          <div
                            key={g.id}
                            className="px-3 py-2 rounded-lg bg-[#FFF5F8] border border-[#E14D7A]/25 text-xs font-semibold text-[#C93B6B]"
                          >
                            {g.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B5E70]">
                        Alcanza 15% de compatibilidad o revisa su SeoulGram para revelar sus regalos
                        favoritos.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {tab === "secretos" && (
                <div className="space-y-2.5">
                  <p className="text-xs text-[#6B5E70]">
                    Cada confesión o secreto que descubres en tus citas queda anotado aquí.
                  </p>
                  {progress.discoveredSecrets.map((sec, idx) => (
                    <div
                      key={`${sec}_${idx}`}
                      className="p-3.5 rounded-xl bg-white border border-[#E7DDD3] flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-[#E14D7A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#231F28] leading-relaxed">
                        {sec}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "capitulos" && (
                <div className="space-y-2.5">
                  {character.chapters.map((ch) => {
                    const reached = progress.compatibility >= ch.minCompatibility;
                    return (
                      <div
                        key={ch.chapter}
                        className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                          reached
                            ? "bg-white border-[#D9CBBF]"
                            : "bg-[#FAF3EB]/60 border-black/6 opacity-65"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-[#231F28]">
                            Capítulo {ch.chapter}: {ch.title}
                          </div>
                          <div className="text-[11px] text-[#6B5E70] mt-0.5">
                            {ch.scenarioName} — {ch.summary}
                          </div>
                        </div>
                        {reached ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono-num text-[#6B5E70] shrink-0">
                            <Lock className="w-3 h-3" /> {ch.minCompatibility}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
