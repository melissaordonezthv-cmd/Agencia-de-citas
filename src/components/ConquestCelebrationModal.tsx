import React from "react";
import { ArrowRight, Award, Coins, Heart, Sparkles } from "lucide-react";
import { CharacterProfile, ChibiAppearance } from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface ConquestCelebrationModalProps {
  playerName: string;
  playerAppearance: ChibiAppearance;
  conqueredCharacter: CharacterProfile;
  nextCharacter?: CharacterProfile;
  rewardTokens: number;
  conqueredByNpcProposal?: boolean;
  onAdvanceToNextTarget: () => void;
  onStayHere: () => void;
}

const CONFETTI_PIECES = [
  { left: "8%", delay: "0s", color: "#E14D7A" },
  { left: "18%", delay: "0.4s", color: "#F6C453" },
  { left: "29%", delay: "0.9s", color: "#B59DE8" },
  { left: "41%", delay: "0.2s", color: "#F09FB7" },
  { left: "54%", delay: "0.7s", color: "#3A7D6B" },
  { left: "66%", delay: "0.3s", color: "#E14D7A" },
  { left: "78%", delay: "1.1s", color: "#F6C453" },
  { left: "89%", delay: "0.5s", color: "#B59DE8" },
];

export const ConquestCelebrationModal: React.FC<ConquestCelebrationModalProps> = ({
  playerName,
  playerAppearance,
  conqueredCharacter,
  nextCharacter,
  rewardTokens,
  conqueredByNpcProposal,
  onAdvanceToNextTarget,
  onStayHere,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="animate-celebration-pop relative bg-white w-full max-w-xl rounded-3xl border border-[#E14D7A]/30 shadow-2xl overflow-hidden">
        {/* Confetti Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {CONFETTI_PIECES.map((piece, idx) => (
            <span
              key={idx}
              className="animate-confetti absolute top-0 w-2.5 h-3.5 rounded-xs"
              style={{
                left: piece.left,
                animationDelay: piece.delay,
                backgroundColor: piece.color,
              }}
            />
          ))}
        </div>

        {/* Celebratory Banner */}
        <div className="relative z-10 bg-gradient-to-br from-[#FFF1F6] via-[#FFF9F2] to-[#F5EFFC] px-6 pt-7 pb-5 text-center border-b border-black/8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E14D7A] mb-2">
            <Award className="w-4 h-4" />
            <span>
              {conqueredByNpcProposal
                ? "Te Conquistó el Corazón"
                : "Logro de Conquista Completado"}
            </span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#231F28]">
            ¡Felicidades, {playerName}!
          </h2>
          <p className="text-sm text-[#4D4254] mt-1.5 max-w-md mx-auto">
            {conqueredByNpcProposal ? (
              <>
                <strong>{conqueredCharacter.name}</strong> se declaró primero y aceptaste su corazón. ¡Ya son pareja oficial!
              </>
            ) : (
              <>
                Conquistaste el corazón de <strong>{conqueredCharacter.name}</strong> y ahora son pareja oficial.
              </>
            )}
          </p>

          {/* Dual Chibi Celebration Poses */}
          <div className="mt-4 flex items-end justify-center gap-3">
            <ChibiAvatar
              appearance={playerAppearance}
              mood="enamorado"
              pose="finger_heart"
              facing="right"
              size="md"
              floating={true}
            />
            <div className="mb-14 flex flex-col items-center">
              <Heart className="w-7 h-7 text-[#E14D7A] fill-[#E14D7A] animate-bounce" />
            </div>
            <ChibiAvatar
              appearance={conqueredCharacter.appearance}
              mood="enamorado"
              pose="finger_heart"
              facing="left"
              size="md"
              floating={true}
            />
          </div>
        </div>

        {/* Rewards & Next Target Action */}
        <div className="relative z-10 p-6 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#FFF9EC] border border-amber-200/70">
              <div className="text-[11px] font-medium text-[#6B5E70]">Recompensa</div>
              <div className="text-lg font-bold font-mono-num text-[#D9822B] inline-flex items-center gap-1.5 mt-0.5">
                <Coins className="w-4 h-4" />+{rewardTokens} fichas
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF5F8] border border-rose-200/70">
              <div className="text-[11px] font-medium text-[#6B5E70]">Relación</div>
              <div className="text-lg font-bold text-[#E14D7A] mt-0.5">100% Novios</div>
            </div>
          </div>

          {nextCharacter ? (
            <div className="p-4 rounded-2xl bg-[#FAF7F6] border border-black/8 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#E14D7A]">
                  Siguiente objetivo desbloqueado
                </div>
                <div className="text-base font-bold text-[#231F28] truncate">
                  {nextCharacter.name} · {nextCharacter.occupation}
                </div>
                <div className="text-xs text-[#6B5E70] truncate">
                  Ubicación: {nextCharacter.currentLocation}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FAF7F6] border border-black/8 text-xs text-[#4D4254] text-center">
              ¡Ya desbloqueaste todo el elenco actual! Puedes iniciar una nueva ruta o seguir chateando con tu pareja.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            {nextCharacter && (
              <button
                type="button"
                onClick={onAdvanceToNextTarget}
                className="flex-1 py-3 px-5 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Pasar al siguiente objetivo
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onStayHere}
              className="py-3 px-4 rounded-xl border border-black/15 hover:bg-black/5 text-sm font-semibold text-[#231F28] cursor-pointer"
            >
              {nextCharacter ? "Quedarme aquí" : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
