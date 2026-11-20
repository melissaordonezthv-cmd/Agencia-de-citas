import React from "react";
import { Award, CheckCircle2, Gift, X } from "lucide-react";
import { ACHIEVEMENTS } from "../data/gameData";

interface AchievementsModalProps {
  unlockedAchievementIds: string[];
  progressCounts: Record<string, number>;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedAchievementIds,
  progressCounts,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#231F28] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D9822B]" />
              Logros de Agencia Latido
            </h2>
            <p className="text-xs text-[#6B5E70]">
              Desbloqueados: {unlockedAchievementIds.length} de {ACHIEVEMENTS.length} · Cada
              logro otorga fichas o recompensas exclusivas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer"
            aria-label="Cerrar logros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[75vh] overflow-y-auto">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchievementIds.includes(ach.id);
            const currentVal = Math.min(ach.target, progressCounts[ach.id] || 0);
            const pct = Math.round((currentVal / ach.target) * 100);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  unlocked
                    ? "border-emerald-600/30 bg-emerald-50/40"
                    : "border-black/10 bg-[#FAF7F6]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#231F28]">{ach.title}</h3>
                    {unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <span className="text-xs font-mono-num font-semibold text-[#6B5E70]">
                        {currentVal}/{ach.target}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#4D4254] mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        unlocked ? "bg-emerald-600" : "bg-[#E14D7A]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#D9822B]">
                      <Gift className="w-3 h-3" />
                      {ach.rewardLabel}
                    </span>
                    <span className="text-[#6B5E70]">
                      {unlocked ? "Completado" : "En progreso"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
