import React from "react";
import { AlertTriangle, Gift, Sparkles } from "lucide-react";
import { GIFT_CATALOG } from "../data/gameData";
import { CharacterProfile, RandomEvent, RandomEventChoice } from "../types/game";

interface RandomEventCardProps {
  character: CharacterProfile;
  event: RandomEvent;
  onAcceptPositive: () => void;
  onSelectNegativeChoice: (choice: RandomEventChoice) => void;
}

export const RandomEventCard: React.FC<RandomEventCardProps> = ({
  character,
  event,
  onAcceptPositive,
  onSelectNegativeChoice,
}) => {
  const isPositive = event.type === "positive";
  const bonusGift = event.rewardGiftId
    ? GIFT_CATALOG.find((g) => g.id === event.rewardGiftId)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-black/10 shadow-2xl overflow-hidden">
        <div
          className={`px-6 py-4 border-b border-black/8 flex items-center gap-3 ${
            isPositive ? "bg-[#FFF5F8]" : "bg-amber-50"
          }`}
        >
          {isPositive ? (
            <Sparkles className="w-5 h-5 text-[#E14D7A] shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <p className="text-[11px] font-semibold text-[#6B5E70]">
              {isPositive ? "Evento Aleatorio Positivo" : "Evento Aleatorio · Malentendido"}
            </p>
            <h3 className="text-base font-bold text-[#231F28]">{event.title}</h3>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#231F28] leading-relaxed">{event.description}</p>

          {isPositive ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#FAF7F6] border border-black/8 space-y-1 text-xs">
                <div className="font-semibold text-[#E14D7A]">
                  +{event.affectionDelta || 0}% Compatibilidad · +{event.patienceDelta || 0}% Paciencia
                </div>
                {bonusGift && (
                  <div className="flex items-center gap-1.5 text-[#231F28] font-medium pt-1">
                    <Gift className="w-3.5 h-3.5 text-[#D9822B]" />
                    {character.name} te regala: <strong>{bonusGift.name}</strong> (se guarda en tu inventario)
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onAcceptPositive}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-sm font-semibold cursor-pointer transition-colors"
              >
                Aceptar momento especial
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#6B5E70]">
                Elige la respuesta adecuada para resolver la situación con {character.name}:
              </p>
              {event.choices?.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => onSelectNegativeChoice(choice)}
                  className="w-full text-left p-3.5 rounded-xl border border-black/10 bg-[#FAF7F6] hover:bg-[#FFF5F8] hover:border-[#E14D7A]/45 text-xs sm:text-sm font-medium text-[#231F28] transition-colors cursor-pointer"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
