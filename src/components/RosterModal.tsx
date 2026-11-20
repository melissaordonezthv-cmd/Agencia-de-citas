import React from "react";
import {
  Briefcase,
  CheckCircle2,
  Globe,
  Heart,
  Home,
  Lock,
  MapPin,
  RefreshCw,
  SkipForward,
  Star,
  Users,
  X,
} from "lucide-react";
import { DIFFICULTY_META, MOOD_LABELS, getFilteredCharacters } from "../data/gameData";
import { CharacterProgress, DatePreference } from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface RosterModalProps {
  activeCharacterId: string;
  favoriteCharacterId: string | null;
  datePreference: DatePreference;
  characterProgress: Record<string, CharacterProgress>;
  onChangeDatePreference: (pref: DatePreference) => void;
  onSelectCharacter: (characterId: string) => void;
  onRenewRomance: (characterId: string) => void;
  onToggleFavorite: (characterId: string) => void;
  onInviteHome: (characterId: string) => void;
  onClose: () => void;
}

export const RosterModal: React.FC<RosterModalProps> = ({
  activeCharacterId,
  favoriteCharacterId,
  datePreference,
  characterProgress,
  onChangeDatePreference,
  onSelectCharacter,
  onRenewRomance,
  onToggleFavorite,
  onInviteHome,
  onClose,
}) => {
  const visibleCharacters = getFilteredCharacters(datePreference);

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-black/8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#231F28] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E14D7A]" />
              Cartera Internacional ({visibleCharacters.length})
            </h2>
            <p className="text-xs text-[#6B5E70]">
              En citas difíciles tú conquistas (+1,050+ fichas); en sencillas/moderadas ambos coquetean.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#F5EFF0] rounded-xl">
              {(
                [
                  { id: "chicas", label: "Solo Chicas" },
                  { id: "chicos", label: "Solo Chicos" },
                  { id: "mixto", label: "Mixto" },
                ] as { id: DatePreference; label: string }[]
              ).map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => onChangeDatePreference(pref.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                    datePreference === pref.id
                      ? "bg-white text-[#231F28] shadow-sm"
                      : "text-[#6B5E70] hover:text-[#231F28]"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer"
              aria-label="Cerrar lista de acompañantes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 gap-4 max-h-[75vh] overflow-y-auto">
          {visibleCharacters.map((char, idx) => {
            const prog = characterProgress[char.id];
            const isActive = char.id === activeCharacterId;
            const isFavorite = favoriteCharacterId === char.id;
            const moodMeta = MOOD_LABELS[prog.mood];
            const diffMeta = DIFFICULTY_META[char.difficulty];
            const conquestRule =
              char.difficulty === "dificil"
                ? "Tú conquistas (coqueteo tras confianza)"
                : "Conquista mutua";

            return (
              <div
                key={char.id}
                className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between gap-4 ${
                  !prog.unlocked
                    ? "border-black/8 bg-[#FAF7F6] opacity-75"
                    : isActive
                      ? "border-[#E14D7A] bg-[#FFF8FA]"
                      : "border-black/10 bg-white hover:border-black/25"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 h-28 rounded-xl bg-[#F5EFF0] flex items-center justify-center overflow-hidden shrink-0">
                    <ChibiAvatar
                      appearance={char.appearance}
                      mood={prog.mood}
                      size="sm"
                      floating={false}
                      className={!prog.unlocked ? "grayscale opacity-60" : ""}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-[#6B5E70] truncate">
                        Ruta {String(idx + 1).padStart(2, "0")} ·{" "}
                        <span className={`font-semibold ${diffMeta.colorClass}`}>
                          {diffMeta.shortLabel}
                        </span>{" "}
                        · +{char.rewardTokens} fichas
                      </span>
                      {prog.conquered ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pareja
                        </span>
                      ) : prog.skipped ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[#6B5E70] shrink-0">
                          <SkipForward className="w-3.5 h-3.5" /> Saltado
                        </span>
                      ) : !prog.unlocked ? (
                        <span className="inline-flex items-center gap-1 font-medium text-[#6B5E70] shrink-0">
                          <Lock className="w-3.5 h-3.5" /> Bloqueado
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#231F28] truncate">
                        {char.name}
                      </h3>
                      {prog.conquered && (
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(char.id)}
                          title={
                            isFavorite
                              ? "Tu pareja favorita (da recompensas extra)"
                              : "Marcar como pareja favorita"
                          }
                          className={`p-1 rounded-md cursor-pointer ${
                            isFavorite
                              ? "text-amber-500"
                              : "text-[#6B5E70] hover:text-amber-500"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400" : ""}`} />
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-[#4D4254] flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-indigo-600" />
                        {char.country}
                      </span>
                      <span>·</span>
                      <span
                        className={
                          char.isToxicOrDangerous
                            ? "font-semibold text-red-700"
                            : "text-[#6B5E70]"
                        }
                      >
                        {char.personalityTrait}
                      </span>
                      <span>·</span>
                      <span className="font-medium text-[#E14D7A]">{conquestRule}</span>
                    </div>

                    <div className="text-xs text-[#4D4254] flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3 h-3 text-[#6B5E70] shrink-0" />
                      <span className="truncate">{char.occupation}</span>
                    </div>

                    <div className="text-[11px] text-[#6B5E70] flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-[#E14D7A] shrink-0" />
                      <span className="truncate">{char.currentLocation}</span>
                    </div>

                    <p className="text-xs text-[#4D4254] leading-relaxed pt-1">
                      {prog.unlocked
                        ? char.tagline
                        : "Conquista o haz perder el interés al acompañante anterior para desbloquear."}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/8 flex flex-wrap items-center justify-between gap-2">
                  {prog.unlocked ? (
                    <>
                      <div className="text-xs text-[#6B5E70]">
                        Afinidad{" "}
                        <strong className="font-mono-num text-[#E14D7A]">
                          {prog.compatibility}%
                        </strong>{" "}
                        · <span className={moodMeta.colorClass}>{moodMeta.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {prog.conquered && (
                          <>
                            <button
                              type="button"
                              onClick={() => onInviteHome(char.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#231F28] hover:bg-[#3A3342] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Home className="w-3 h-3" />
                              Casa
                            </button>
                            <button
                              type="button"
                              onClick={() => onRenewRomance(char.id)}
                              title="Comenzar otra cita desde 0%"
                              className="p-1.5 rounded-lg border border-black/15 hover:bg-black/5 text-[#231F28] cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectCharacter(char.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap ${
                            isActive
                              ? "bg-[#231F28] text-white"
                              : "bg-[#E14D7A] hover:bg-[#C93B6B] text-white"
                          }`}
                        >
                          {isActive ? "En Cita" : "Ir con ella/él"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-[#6B5E70] flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#E14D7A]" />
                      Recompensa al conquistar: +{char.rewardTokens} fichas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
