import React, { useState } from "react";
import { Gift, ShoppingBag, Sparkles, X } from "lucide-react";
import { GIFT_CATALOG, GIFT_TIER_META } from "../data/gameData";
import { CharacterProfile, ReceivedGiftRecord } from "../types/game";

interface InventoryModalProps {
  character: CharacterProfile;
  tokens: number;
  inventory: Record<string, number>;
  receivedGifts: ReceivedGiftRecord[];
  isLoadingAI: boolean;
  onBuyGift: (giftId: string) => void;
  onGiveGift: (giftId: string) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  character,
  tokens,
  inventory,
  receivedGifts,
  isLoadingAI,
  onBuyGift,
  onGiveGift,
  onClose,
}) => {
  const [tab, setTab] = useState<"bag" | "shop" | "received">("bag");

  const ownedGifts = GIFT_CATALOG.filter((g) => (inventory[g.id] || 0) > 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-black/8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#231F28] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#D9822B]" />
              Inventario y Regalos
            </h2>
            <p className="text-xs text-[#6B5E70]">
              Entrega regalos a {character.name} o revisa los detalles (lujosos, lindos, raros, tontos o desagradables) que te han dado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer"
            aria-label="Cerrar inventario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#F5EFF0] rounded-xl">
              <button
                type="button"
                onClick={() => setTab("bag")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  tab === "bag"
                    ? "bg-white text-[#231F28] shadow-sm"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                Mochila ({ownedGifts.reduce((sum, g) => sum + (inventory[g.id] || 0), 0)})
              </button>
              <button
                type="button"
                onClick={() => setTab("shop")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  tab === "shop"
                    ? "bg-white text-[#231F28] shadow-sm"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                Tienda
              </button>
              <button
                type="button"
                onClick={() => setTab("received")}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                  tab === "received"
                    ? "bg-white text-[#231F28] shadow-sm"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                Recibidos ({receivedGifts.length})
              </button>
            </div>

            <div className="text-sm font-mono-num font-semibold text-[#D9822B]">
              {tokens} fichas
            </div>
          </div>

          {tab === "bag" &&
            (ownedGifts.length === 0 ? (
              <div className="py-10 text-center space-y-3 border border-dashed border-black/15 rounded-xl bg-[#FAF7F6]">
                <p className="text-sm text-[#4D4254]">Tu mochila de regalos está vacía.</p>
                <button
                  type="button"
                  onClick={() => setTab("shop")}
                  className="px-4 py-2 rounded-xl bg-[#E14D7A] text-white text-xs font-semibold cursor-pointer"
                >
                  Ir a comprar regalos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {ownedGifts.map((gift) => {
                  const qty = inventory[gift.id] || 0;
                  return (
                    <div
                      key={gift.id}
                      className="p-4 rounded-xl border border-black/10 bg-[#FAF7F6] flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#231F28]">{gift.name}</span>
                          <span className="font-mono-num text-xs font-semibold text-[#4D4254]">
                            x{qty}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B5E70] mt-1">{gift.description}</p>
                      </div>

                      <button
                        type="button"
                        disabled={isLoadingAI}
                        onClick={() => onGiveGift(gift.id)}
                        className="w-full py-2 px-3 rounded-lg bg-[#E14D7A] hover:bg-[#C93B6B] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Regalar a {character.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}

          {tab === "shop" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {GIFT_CATALOG.map((gift) => {
                const canAfford = tokens >= gift.price;
                const qty = inventory[gift.id] || 0;
                return (
                  <div
                    key={gift.id}
                    className="p-4 rounded-xl border border-black/10 bg-[#FAF7F6] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#231F28]">{gift.name}</span>
                        <span className="text-xs font-mono-num font-semibold text-[#D9822B]">
                          {gift.price} fichas
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6B5E70] mt-0.5">
                        {gift.category} · +{gift.baseAffinity} afinidad base
                      </div>
                      <p className="text-xs text-[#4D4254] mt-1.5">{gift.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyGift(gift.id)}
                      className="w-full py-2 px-3 rounded-lg bg-[#231F28] hover:bg-[#3A3342] disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Comprar {qty > 0 ? `(Tienes ${qty})` : ""}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "received" &&
            (receivedGifts.length === 0 ? (
              <div className="py-10 text-center space-y-2 border border-dashed border-black/15 rounded-xl bg-[#FAF7F6]">
                <Sparkles className="w-6 h-6 text-[#E14D7A] mx-auto opacity-70" />
                <p className="text-sm text-[#4D4254]">
                  Todavía no has recibido regalos sorpresa de los personajes.
                </p>
                <p className="text-xs text-[#6B5E70]">
                  Charla en citas, por teléfono o en casa con tus parejas; según su personalidad pueden regalarte algo lujoso, lindo, raro, tonto o desagradable.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {receivedGifts.map((rg) => {
                  const tierMeta = GIFT_TIER_META[rg.tier];
                  return (
                    <div
                      key={rg.id}
                      className={`p-4 rounded-xl border space-y-1.5 ${tierMeta.bgClass}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#231F28]">{rg.name}</span>
                        <span className={`text-[11px] font-bold ${tierMeta.colorClass}`}>
                          {tierMeta.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#4D4254] leading-relaxed">{rg.description}</p>
                      <div className="text-[11px] text-[#6B5E70] pt-1">
                        De: <strong>{rg.fromCharacterName}</strong> · {rg.receivedAt}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
