import React, { useRef, useState } from "react";
import {
  Check,
  Coins,
  Eye,
  Heart,
  Home,
  Loader2,
  Lock,
  RotateCcw,
  Send,
  Smartphone,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import {
  BACKDROPS,
  BLUSH_COLORS,
  BLUSH_STYLES,
  COUPLE_HOME_ACTIVITIES,
  EYE_COLORS,
  EYE_SPECS,
  FACE_MARKS,
  HAIR_COLORS,
  MOOD_LABELS,
  MOUTH_SPECS,
  SKIN_TONES,
  WARDROBE_ITEMS,
  calculateAttractiveness,
} from "../data/gameData";
import {
  CharacterProfile,
  CharacterProgress,
  ChibiAppearance,
  ChibiPose,
  DatePreference,
  EmotionalState,
  FaceMarkId,
  PlayerGender,
  PlayerPronoun,
  SexualOrientation,
  WardrobeItem,
} from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface BedroomStudioProps {
  playerName: string;
  playerGender: PlayerGender;
  playerPronoun: PlayerPronoun;
  orientation: SexualOrientation;
  datePreference: DatePreference;
  onChangeName: (name: string) => void;
  onUpdateIdentity: (patch: {
    playerGender?: PlayerGender;
    playerPronoun?: PlayerPronoun;
    orientation?: SexualOrientation;
    datePreference?: DatePreference;
  }) => void;
  appearance: ChibiAppearance;
  unlockedWardrobeIds: string[];
  tokens: number;
  conqueredPartners: CharacterProfile[];
  homePartner: CharacterProfile | null;
  homePartnerProgress: CharacterProgress | null;
  favoriteCharacterId: string | null;
  isHomeLoading: boolean;
  onSelectHomePartner: (charId: string | null) => void;
  onToggleFavorite: (charId: string) => void;
  onCoupleHomeAction: (promptText: string) => void;
  onOpenPhone: () => void;
  onUpdateAppearance: (patch: Partial<ChibiAppearance>) => void;
  onBuyWardrobeItem: (itemId: string) => void;
  onGoToOffice: () => void;
}

type StudioTab =
  | "outfit"
  | "hair"
  | "eyes"
  | "mouth"
  | "face"
  | "accessory"
  | "home"
  | "identity";

export const BedroomStudio: React.FC<BedroomStudioProps> = ({
  playerName,
  playerGender,
  playerPronoun,
  orientation,
  datePreference,
  onChangeName,
  onUpdateIdentity,
  appearance,
  unlockedWardrobeIds,
  tokens,
  conqueredPartners,
  homePartner,
  homePartnerProgress,
  favoriteCharacterId,
  isHomeLoading,
  onSelectHomePartner,
  onToggleFavorite,
  onCoupleHomeAction,
  onOpenPhone,
  onUpdateAppearance,
  onBuyWardrobeItem,
  onGoToOffice,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>(
    homePartner ? "home" : "outfit"
  );
  const [sectionFilter, setSectionFilter] = useState<"todas" | "chicas" | "chicos">("todas");
  const [eyeCategoryFilter, setEyeCategoryFilter] = useState<
    "todas" | "dulces" | "intensos" | "coquetos" | "idolo"
  >("todas");
  const [mouthCategoryFilter, setMouthCategoryFilter] = useState<
    "todas" | "dulces" | "coquetos" | "actitud" | "expresivos"
  >("todas");
  const [previewPose, setPreviewPose] = useState<ChibiPose>("wave");
  const [homeChatInput, setHomeChatInput] = useState("");
  const [backdropBroken, setBackdropBroken] = useState(false);

  type TryOnSlot = "outfit" | "hair" | "eye" | "mouth" | "accessory";
  const [tryOnBySlot, setTryOnBySlot] = useState<Partial<Record<TryOnSlot, string>>>({});
  const tryOnRef = useRef<Partial<Record<TryOnSlot, string>>>({});
  const [insufficientNotice, setInsufficientNotice] = useState<string | null>(null);

  const outfitItems = WARDROBE_ITEMS.filter(
    (i) =>
      i.category === "outfit" &&
      (sectionFilter === "todas" || i.section === sectionFilter || i.section === "unisex")
  );
  const hairItems = WARDROBE_ITEMS.filter(
    (i) =>
      i.category === "hair" &&
      (sectionFilter === "todas" || i.section === sectionFilter || i.section === "unisex")
  );
  const accessoryItems = WARDROBE_ITEMS.filter((i) => i.category === "accessory");
  const eyeCategoryById = new Map(EYE_SPECS.map((e) => [e.id, e.category]));
  const eyeItems = WARDROBE_ITEMS.filter(
    (i) =>
      i.category === "eye" &&
      (eyeCategoryFilter === "todas" || eyeCategoryById.get(i.value) === eyeCategoryFilter)
  );
  const mouthCategoryById = new Map(MOUTH_SPECS.map((m) => [m.id, m.category]));
  const mouthItems = WARDROBE_ITEMS.filter(
    (i) =>
      i.category === "mouth" &&
      (mouthCategoryFilter === "todas" || mouthCategoryById.get(i.value) === mouthCategoryFilter)
  );

  const totalOutfits = WARDROBE_ITEMS.filter((i) => i.category === "outfit").length;
  const totalHairs = WARDROBE_ITEMS.filter((i) => i.category === "hair").length;
  const totalEyes = WARDROBE_ITEMS.filter((i) => i.category === "eye").length;
  const totalMouths = WARDROBE_ITEMS.filter((i) => i.category === "mouth").length;
  const totalAccessories = accessoryItems.length;

  const tryOnItems = (Object.entries(tryOnBySlot) as [TryOnSlot, string | undefined][])
    .map(([, itemId]) => (itemId ? WARDROBE_ITEMS.find((i) => i.id === itemId) : undefined))
    .filter(
      (item): item is WardrobeItem =>
        Boolean(item && !unlockedWardrobeIds.includes(item.id))
    );

  const previewAppearance: ChibiAppearance = { ...appearance };
  for (const item of tryOnItems) {
    if (item.category === "outfit") previewAppearance.outfit = item.value;
    if (item.category === "hair") previewAppearance.hairStyle = item.value;
    if (item.category === "eye") previewAppearance.eyeStyle = item.value;
    if (item.category === "mouth") previewAppearance.mouthStyle = item.value;
    if (item.category === "accessory") previewAppearance.accessory = item.value;
  }

  const attractiveness = calculateAttractiveness(appearance);
  const previewAttractiveness = calculateAttractiveness(previewAppearance);
  const tryOnBonusAttractiveness = previewAttractiveness - attractiveness;
  const isHomeMode = activeTab === "home" || Boolean(homePartner);
  const stageBackdrop =
    isHomeMode && homePartner ? BACKDROPS.coupleHome : BACKDROPS.bedroom;
  const latestHomeLine =
    homePartnerProgress?.dialogueHistory[
      homePartnerProgress.dialogueHistory.length - 1
    ];
  const isFavPartner = homePartner ? favoriteCharacterId === homePartner.id : false;

  const clearAllTryOn = () => {
    tryOnRef.current = {};
    setTryOnBySlot({});
    setInsufficientNotice(null);
  };

  const handleWardrobeItemPress = (item: WardrobeItem) => {
    const slot = item.category as TryOnSlot;
    const unlocked = unlockedWardrobeIds.includes(item.id);
    setInsufficientNotice(null);

    if (unlocked) {
      const nextSlots = { ...tryOnRef.current };
      delete nextSlots[slot];
      tryOnRef.current = nextSlots;
      setTryOnBySlot(nextSlots);

      if (slot === "outfit") {
        onUpdateAppearance({ outfit: item.value as ChibiAppearance["outfit"] });
      } else if (slot === "hair") {
        onUpdateAppearance({ hairStyle: item.value as ChibiAppearance["hairStyle"] });
      } else if (slot === "eye") {
        onUpdateAppearance({ eyeStyle: item.value as ChibiAppearance["eyeStyle"] });
      } else if (slot === "mouth") {
        onUpdateAppearance({ mouthStyle: item.value });
      } else if (slot === "accessory") {
        onUpdateAppearance({ accessory: item.value as ChibiAppearance["accessory"] });
      }
      return;
    }

    // 1st tap on a locked item: put it on as a preview ("probando")
    if (tryOnRef.current[slot] !== item.id) {
      const nextSlots = { ...tryOnRef.current, [slot]: item.id };
      tryOnRef.current = nextSlots;
      setTryOnBySlot(nextSlots);
      return;
    }

    // 2nd tap on the same locked item: buy and equip permanently
    if (tokens < item.price) {
      setInsufficientNotice(
        `Te faltan ${item.price - tokens} fichas para comprar "${item.name}". Sigue probándolo o gana más fichas en citas.`
      );
      return;
    }

    const nextSlots = { ...tryOnRef.current };
    delete nextSlots[slot];
    tryOnRef.current = nextSlots;
    setTryOnBySlot(nextSlots);
    onBuyWardrobeItem(item.id);
  };

  const getEquippedValueForSlot = (slot: TryOnSlot) => {
    if (slot === "outfit") return appearance.outfit;
    if (slot === "hair") return appearance.hairStyle;
    if (slot === "eye") return appearance.eyeStyle;
    if (slot === "mouth") return appearance.mouthStyle || "smile_soft";
    return appearance.accessory;
  };

  const renderWardrobeCard = (item: WardrobeItem, showSection = false) => {
    const slot = item.category as TryOnSlot;
    const unlocked = unlockedWardrobeIds.includes(item.id);
    const activeTryOnId = tryOnBySlot[slot];
    const isTrying = !unlocked && activeTryOnId === item.id;
    const isSavedEquipped = unlocked && getEquippedValueForSlot(slot) === item.value;
    const isVisibleEquipped = isSavedEquipped && !activeTryOnId;
    const canAfford = tokens >= item.price;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => handleWardrobeItemPress(item)}
        className={`text-left p-3 rounded-xl border transition-colors cursor-pointer ${
          isTrying
            ? "border-[#D9822B] bg-[#FFF8EB] ring-1 ring-[#D9822B]/35"
            : isVisibleEquipped
              ? "border-[#E14D7A] bg-[#FFF5F8]"
              : isSavedEquipped
                ? "border-[#E14D7A]/45 bg-[#FFF9FB]"
                : "border-black/8 bg-[#FAF7F6] hover:border-black/20"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-[#231F28]">
            {item.name}
          </span>
          {isTrying ? (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#B86314] shrink-0">
              <Eye className="w-3 h-3" />
              Probando · {item.price}
            </span>
          ) : isVisibleEquipped ? (
            <Check className="w-4 h-4 text-[#E14D7A] shrink-0" />
          ) : isSavedEquipped ? (
            <span className="text-[10px] font-semibold text-[#E14D7A] shrink-0">
              Tuyo
            </span>
          ) : !unlocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono-num font-semibold text-[#D9822B] shrink-0">
              <Lock className="w-3 h-3" /> {item.price}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-[#E14D7A] mt-0.5">
          <span>+{item.attractiveness} Atractivo</span>
          {showSection && item.section && item.section !== "unisex" && (
            <span className="text-[#6B5E70]">
              · {item.section === "chicas" ? "Chicas" : "Chicos"}
            </span>
          )}
        </div>

        <p className="text-[11px] text-[#6B5E70] mt-1 leading-relaxed">
          {item.charmNote}
        </p>

        {isTrying && (
          <div
            className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold ${
              canAfford ? "text-[#B86314]" : "text-[#9F3654]"
            }`}
          >
            {canAfford
              ? `Toca otra vez para comprar (${item.price} fichas)`
              : `Te faltan ${item.price - tokens} fichas para comprarlo`}
          </div>
        )}
      </button>
    );
  };

  const handleSendHomeChat = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = homeChatInput.trim();
    if (!clean || !homePartner || isHomeLoading) return;
    setHomeChatInput("");
    onCoupleHomeAction(clean);
  };

  const moodOptions: { id: EmotionalState; label: string }[] = [
    { id: "encantado", label: "Sonrisa Dulce" },
    { id: "jugueton", label: "Guiño Coqueto" },
    { id: "timido", label: "Sonrojo Suave" },
    { id: "pensativo", label: "Sereno" },
  ];

  const handleSelectOrientation = (ori: SexualOrientation) => {
    let nextPref: DatePreference = datePreference;
    if (ori === "lesbiana") {
      nextPref = "chicas";
      onUpdateIdentity({
        orientation: ori,
        playerGender: "mujer",
        playerPronoun: "ella",
        datePreference: nextPref,
      });
      return;
    }
    if (ori === "gay") {
      nextPref = "chicos";
      onUpdateIdentity({
        orientation: ori,
        playerGender: "hombre",
        playerPronoun: "él",
        datePreference: nextPref,
      });
      return;
    }
    if (ori === "hetero") {
      nextPref = playerGender === "mujer" ? "chicos" : "chicas";
    } else {
      nextPref = "mixto";
    }
    onUpdateIdentity({ orientation: ori, datePreference: nextPref });
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-2.5">
      {/* TOP (PINNED STILL): Cozy Bedroom / Couple Home Vertical Stage */}
      <div className="shrink-0 relative rounded-2xl overflow-hidden border border-black/10 bg-[#EDE4F5] h-[34dvh] min-h-[235px] max-h-[325px] flex flex-col justify-between shadow-sm">
        {!backdropBroken ? (
          <img
            src={stageBackdrop}
            alt={homePartner ? "En casa con tu pareja" : "Tu habitación acogedora estilo manhwa"}
            referrerPolicy="no-referrer"
            onError={() => setBackdropBroken(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F3E9FA] via-[#FBEFF4] to-[#EFE6DF]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#231F28]/78 via-[#231F28]/12 to-[#231F28]/38" />

        {/* Room header */}
        <div className="relative z-10 p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="bg-white/92 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-black/5">
            <p className="text-[10px] sm:text-xs font-medium text-[#6B5E70]">
              {homePartner
                ? `En Casa con ${homePartner.name}${isFavPartner ? " · Pareja Favorita" : ""}`
                : `Mi Habitación · Pronombre: ${playerPronoun}`}
            </p>
            <h2 className="text-sm sm:text-base font-semibold text-[#231F28]">
              {homePartner ? `Sala de ${playerName}` : `Vestidor de ${playerName}`}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-white/92 backdrop-blur-sm p-1 rounded-xl border border-black/5">
            {(["wave", "finger_heart", "wink_pose"] as ChibiPose[]).map((pose) => (
              <button
                key={pose}
                type="button"
                onClick={() => setPreviewPose(pose)}
                className={`px-2 sm:px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  previewPose === pose
                    ? "bg-[#E14D7A] text-white"
                    : "text-[#4D4254] hover:bg-black/5"
                }`}
              >
                {pose === "wave" ? "Saludo" : pose === "finger_heart" ? "Corazón" : "Guiño"}
              </button>
            ))}
          </div>
        </div>

        {/* Center Pixel Chibi Stage (Single or Couple in Home!) */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-end pb-1.5 px-4 gap-1.5">
          {homePartner ? (
            <>
              <div className="flex items-end justify-center gap-2 sm:gap-3">
                <ChibiAvatar
                  appearance={previewAppearance}
                  pose="finger_heart"
                  facing="right"
                  size="md"
                  floating={true}
                  showMoodAura={true}
                  className="!w-24 !h-28 sm:!w-34 sm:!h-40"
                />
                <Heart className="w-5 h-5 text-[#E14D7A] fill-[#E14D7A] mb-8 animate-bounce shrink-0" />
                <ChibiAvatar
                  appearance={homePartner.appearance}
                  mood={homePartnerProgress?.mood || "enamorado"}
                  pose="shy_hold"
                  facing="left"
                  size="md"
                  floating={true}
                  showMoodAura={true}
                  className="!w-24 !h-28 sm:!w-34 sm:!h-40"
                />
              </div>

              {latestHomeLine && (
                <div className="w-full bg-white/94 backdrop-blur-sm rounded-xl border border-black/10 px-3 py-1.5 shadow-sm text-[11px] max-h-[54px] overflow-y-auto">
                  <span className="font-bold text-[#E14D7A] mr-1.5">
                    {latestHomeLine.speaker === "player" ? playerName : homePartner.name}:
                  </span>
                  <span className="text-[#231F28] leading-snug">“{latestHomeLine.text}”</span>
                </div>
              )}
            </>
          ) : (
            <ChibiAvatar
              appearance={previewAppearance}
              pose={previewPose}
              size="lg"
              floating={true}
              showMoodAura={true}
              className="!w-28 !h-34 sm:!w-40 sm:!h-48"
            />
          )}
        </div>

        {/* Bottom quick CTA + Attractiveness + Try-On Indicator */}
        <div className="relative z-10 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 bg-gradient-to-t from-[#231F28]/80 to-transparent">
          <div className="text-white/95 text-xs sm:text-sm truncate flex items-center gap-1.5">
            <span className="font-semibold">
              Atractivo: +{previewAttractiveness} pts
            </span>
            {tryOnItems.length > 0 ? (
              <button
                type="button"
                onClick={clearAllTryOn}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FFF8EB] text-[#9A500D] text-[11px] font-semibold cursor-pointer hover:bg-white transition-colors shrink-0"
                title="Quitar ropa o rasgos de prueba"
              >
                <RotateCcw className="w-3 h-3" />
                Quitar prueba ({tryOnItems.length})
              </button>
            ) : (
              <>
                <span className="opacity-60">·</span>
                <span className="text-white/85 truncate">
                  {datePreference === "chicas"
                    ? "Solo Chicas"
                    : datePreference === "chicos"
                      ? "Solo Chicos"
                      : "Mixto"}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onGoToOffice}
            className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            Ir a la Cita
          </button>
        </div>
      </div>

      {/* BOTTOM (INDEPENDENTLY SCROLLABLE): Wardrobe, Hair, Eyes, Mouth, Face Marks & Identity */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-black/10 p-3.5 sm:p-4 flex flex-col gap-3 shadow-sm overflow-hidden">
        {/* Pinned Name & Balance + Tabs Header */}
        <div className="shrink-0 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/8">
            <label className="flex items-center gap-2 flex-1 min-w-[160px]">
              <User className="w-4 h-4 text-[#E14D7A] shrink-0" />
              <span className="text-xs font-medium text-[#6B5E70] whitespace-nowrap">
                Nombre
              </span>
              <input
                type="text"
                maxLength={18}
                value={playerName}
                onChange={(e) => onChangeName(e.target.value)}
                className="w-full max-w-[160px] px-2.5 py-1 text-xs sm:text-sm font-medium text-[#231F28] bg-[#FAF6F4] border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E14D7A]/30"
              />
            </label>

            <div className="flex items-center gap-3 text-xs text-[#6B5E70] font-mono-num shrink-0">
              <span>
                Atractivo:{" "}
                <strong className="text-[#E14D7A]">+{previewAttractiveness}</strong>
                {tryOnBonusAttractiveness > 0 && (
                  <span className="text-[#D9822B] ml-1">
                    (+{tryOnBonusAttractiveness} prueba)
                  </span>
                )}
              </span>
              <span>
                Saldo: <strong className="text-[#D9822B]">{tokens} fichas</strong>
              </span>
            </div>
          </div>

          {/* Segmented Tabs (8 categories) */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#F5EFF0] rounded-xl">
            {(
              [
                { id: "outfit", label: `Moda (${totalOutfits})` },
                { id: "hair", label: `Pelo (${totalHairs})` },
                { id: "eyes", label: `Ojos (${totalEyes})` },
                { id: "mouth", label: `Boca (${totalMouths})` },
                { id: "face", label: "Cara & Rubor" },
                { id: "accessory", label: `Extras (${totalAccessories})` },
                { id: "home", label: `Casa (${conqueredPartners.length})` },
                { id: "identity", label: "Perfil" },
              ] as { id: StudioTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-[#231F28] shadow-sm"
                    : "text-[#6B5E70] hover:text-[#231F28]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === "outfit" ||
            activeTab === "hair" ||
            activeTab === "eyes" ||
            activeTab === "mouth" ||
            activeTab === "accessory") && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#FFF8EB] border border-[#D9822B]/25 text-[11px] text-[#7A4A12]">
              <span>
                <strong>1º toque:</strong> probar en tu chibi · <strong>2º toque:</strong> comprar objeto
              </span>
              {tryOnItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllTryOn}
                  className="font-semibold text-[#B86314] hover:text-[#231F28] underline cursor-pointer"
                >
                  Quitar prueba ({tryOnItems.length})
                </button>
              )}
            </div>
          )}

          {insufficientNotice && (
            <div className="px-3 py-2 rounded-lg bg-[#FFF0F4] border border-[#E14D7A]/35 text-[11px] font-medium text-[#9F294D]">
              {insufficientNotice}
            </div>
          )}
        </div>

        {/* Scrollable Tab Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
            {activeTab === "outfit" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#6B5E70]">
                    Sección de Ropa Ancha & Moda ({outfitItems.length})
                  </span>
                  <div className="flex items-center gap-1 p-0.5 bg-[#F5EFF0] rounded-lg">
                    {(
                      [
                        { id: "todas", label: "Todas" },
                        { id: "chicas", label: "Chicas" },
                        { id: "chicos", label: "Chicos" },
                      ] as const
                    ).map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setSectionFilter(sec.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                          sectionFilter === sec.id
                            ? "bg-white text-[#231F28] shadow-xs"
                            : "text-[#6B5E70]"
                        }`}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {outfitItems.map((item) => renderWardrobeCard(item, true))}
                </div>
              </div>
            )}

            {activeTab === "hair" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Color de Cabello ({HAIR_COLORS.length} tonos)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {HAIR_COLORS.map((c) => {
                      const active = appearance.hairColor === c.hex;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onUpdateAppearance({ hairColor: c.hex })}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium cursor-pointer transition-colors ${
                            active
                              ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                              : "border-black/10 bg-white text-[#4D4254] hover:border-black/25"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/15"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[#6B5E70]">
                      Peinados Esponjosos & Coreanos ({hairItems.length})
                    </h3>
                    <div className="flex items-center gap-1 p-0.5 bg-[#F5EFF0] rounded-lg">
                      {(
                        [
                          { id: "todas", label: "Todos" },
                          { id: "chicas", label: "Chicas" },
                          { id: "chicos", label: "Chicos" },
                        ] as const
                      ).map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setSectionFilter(sec.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                            sectionFilter === sec.id
                              ? "bg-white text-[#231F28] shadow-xs"
                              : "text-[#6B5E70]"
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {hairItems.map((item) => renderWardrobeCard(item, true))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "eyes" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Color de Ojos ({EYE_COLORS.length} tonos)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {EYE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onUpdateAppearance({ eyeColor: c.hex })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-medium cursor-pointer ${
                          appearance.eyeColor === c.hex
                            ? "border-[#E14D7A] bg-[#FFF5F8]"
                            : "border-black/10 bg-white"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-[#6B5E70]">
                      Estilos de Ojos ({eyeItems.length})
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 p-0.5 bg-[#F5EFF0] rounded-lg">
                      {(
                        [
                          { id: "todas", label: "Todos" },
                          { id: "dulces", label: "Dulces" },
                          { id: "intensos", label: "Intensos" },
                          { id: "coquetos", label: "Coquetos" },
                          { id: "idolo", label: "Ídolo" },
                        ] as const
                      ).map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setEyeCategoryFilter(cat.id)}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                            eyeCategoryFilter === cat.id
                              ? "bg-white text-[#231F28] shadow-xs"
                              : "text-[#6B5E70]"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {eyeItems.map((item) => renderWardrobeCard(item))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mouth" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-[#6B5E70]">
                    Estilos de Boca y Labios ({mouthItems.length})
                  </h3>
                  <div className="flex flex-wrap items-center gap-1 p-0.5 bg-[#F5EFF0] rounded-lg">
                    {(
                      [
                        { id: "todas", label: "Todas" },
                        { id: "dulces", label: "Dulces" },
                        { id: "coquetos", label: "Coquetos" },
                        { id: "actitud", label: "Actitud" },
                        { id: "expresivos", label: "Expresivos" },
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setMouthCategoryFilter(cat.id)}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                          mouthCategoryFilter === cat.id
                            ? "bg-white text-[#231F28] shadow-xs"
                            : "text-[#6B5E70]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {mouthItems.map((item) => renderWardrobeCard(item))}
                </div>
              </div>
            )}

            {activeTab === "accessory" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {accessoryItems.map((item) => renderWardrobeCard(item))}
              </div>
            )}

            {activeTab === "face" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Tono de Piel ({SKIN_TONES.length} tonos diversos)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TONES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onUpdateAppearance({ skinTone: s.hex })}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                          appearance.skinTone === s.hex
                            ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                            : "border-black/10 bg-white text-[#4D4254]"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/15"
                          style={{ backgroundColor: s.hex }}
                        />
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Detalles Faciales (+2 Atractivo)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FACE_MARKS.map((fm) => {
                      const active = (appearance.faceMark || "ninguno") === fm.id;
                      return (
                        <button
                          key={fm.id}
                          type="button"
                          onClick={() =>
                            onUpdateAppearance({ faceMark: fm.id as FaceMarkId })
                          }
                          className={`text-left p-2.5 rounded-xl border cursor-pointer ${
                            active
                              ? "border-[#E14D7A] bg-[#FFF5F8]"
                              : "border-black/8 bg-[#FAF7F6]"
                          }`}
                        >
                          <div className="text-xs font-semibold text-[#231F28]">{fm.name}</div>
                          <div className="text-[11px] text-[#6B5E70]">{fm.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-black/8 space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                      Colorete de Mejillas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BLUSH_STYLES.map((b) => {
                        const active = (appearance.blushStyle || "suave") === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => onUpdateAppearance({ blushStyle: b.id })}
                            className={`text-left p-2.5 rounded-xl border cursor-pointer ${
                              active
                                ? "border-[#E14D7A] bg-[#FFF5F8]"
                                : "border-black/8 bg-[#FAF7F6]"
                            }`}
                          >
                            <div className="text-xs font-semibold text-[#231F28]">{b.name}</div>
                            <div className="text-[11px] text-[#6B5E70]">{b.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                      Tono de Colorete
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {BLUSH_COLORS.map((bc) => (
                        <button
                          key={bc.id}
                          type="button"
                          onClick={() => onUpdateAppearance({ blushColor: bc.hex })}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                            (appearance.blushColor || "#F69AB3") === bc.hex
                              ? "border-[#E14D7A] bg-[#FFF5F8]"
                              : "border-black/10 bg-white"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: bc.hex }}
                          />
                          {bc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Expresión Base
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {moodOptions.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onUpdateAppearance({ baseMood: m.id })}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium text-left cursor-pointer ${
                          appearance.baseMood === m.id
                            ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                            : "border-black/10 bg-[#FAF7F6] text-[#4D4254]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "identity" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Tu Género y Pronombre (los personajes lo verán al hablar contigo)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateIdentity({
                          playerGender: "mujer",
                          playerPronoun: "ella",
                          datePreference:
                            orientation === "hetero"
                              ? "chicos"
                              : orientation === "lesbiana"
                                ? "chicas"
                                : datePreference,
                        })
                      }
                      className={`p-3 rounded-xl border text-left cursor-pointer ${
                        playerGender === "mujer"
                          ? "border-[#E14D7A] bg-[#FFF5F8]"
                          : "border-black/10 bg-[#FAF7F6]"
                      }`}
                    >
                      <div className="text-sm font-bold text-[#231F28]">Mujer</div>
                      <div className="text-xs text-[#6B5E70]">Pronombre: ella</div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateIdentity({
                          playerGender: "hombre",
                          playerPronoun: "él",
                          datePreference:
                            orientation === "hetero"
                              ? "chicas"
                              : orientation === "gay"
                                ? "chicos"
                                : datePreference,
                        })
                      }
                      className={`p-3 rounded-xl border text-left cursor-pointer ${
                        playerGender === "hombre"
                          ? "border-[#E14D7A] bg-[#FFF5F8]"
                          : "border-black/10 bg-[#FAF7F6]"
                      }`}
                    >
                      <div className="text-sm font-bold text-[#231F28]">Hombre</div>
                      <div className="text-xs text-[#6B5E70]">Pronombre: él</div>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Orientación Romántica
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { id: "hetero", label: "Hetero" },
                        { id: "gay", label: "Gay" },
                        { id: "lesbiana", label: "Lesbiana" },
                        { id: "libre", label: "Libre / Bi" },
                      ] as { id: SexualOrientation; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOrientation(opt.id)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                          orientation === opt.id
                            ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                            : "border-black/10 bg-[#FAF7F6] text-[#4D4254]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                    Preferencia de Citas en la Agencia
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
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
                        onClick={() => onUpdateIdentity({ datePreference: pref.id })}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                          datePreference === pref.id
                            ? "border-[#231F28] bg-[#231F28] text-white"
                            : "border-black/10 bg-[#FAF7F6] text-[#4D4254]"
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[#6B5E70] mt-2 leading-relaxed">
                    Cambia en cualquier momento si quieres atender solo chicas, solo chicos o todo
                    el elenco de la agencia.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <div className="space-y-4">
                {conqueredPartners.length === 0 ? (
                  <div className="py-10 px-4 text-center space-y-2.5 border border-dashed border-black/15 rounded-2xl bg-[#FAF7F6]">
                    <Home className="w-7 h-7 text-[#E14D7A] mx-auto opacity-80" />
                    <h3 className="text-sm font-bold text-[#231F28]">
                      Aún no tienes parejas conquistadas para invitar a casa
                    </h3>
                    <p className="text-xs text-[#6B5E70] max-w-md mx-auto leading-relaxed">
                      Cuando conquistes a un personaje al 100%, podrá venir a tu casa a vivir citas
                      caseras, ver doramas, cocinar ramen, chatear y darte recompensas si es tu favorito/a.
                    </p>
                    <button
                      type="button"
                      onClick={onGoToOffice}
                      className="px-4 py-2 rounded-xl bg-[#E14D7A] text-white text-xs font-semibold cursor-pointer"
                    >
                      Ir a conquistar
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-[#6B5E70]">
                          Parejas disponibles para visitar tu casa
                        </h3>
                        {homePartner && (
                          <button
                            type="button"
                            onClick={() => onSelectHomePartner(null)}
                            className="text-[11px] font-semibold text-[#6B5E70] hover:text-[#231F28] cursor-pointer"
                          >
                            Volver al vestidor solo/a
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {conqueredPartners.map((partner) => {
                          const selected = homePartner?.id === partner.id;
                          const fav = favoriteCharacterId === partner.id;
                          return (
                            <button
                              key={partner.id}
                              type="button"
                              onClick={() => onSelectHomePartner(partner.id)}
                              className={`px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                                selected
                                  ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                                  : "border-black/10 bg-[#FAF7F6] text-[#4D4254]"
                              }`}
                            >
                              <Home className="w-3.5 h-3.5 text-[#E14D7A]" />
                              <span>{partner.name}</span>
                              {fav && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {homePartner && homePartnerProgress ? (
                      <div className="space-y-4">
                        {/* Favorite Partner Reward Bar */}
                        <div className="p-3.5 rounded-xl bg-[#FFF9EC] border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs space-y-0.5">
                            <div className="font-bold text-[#231F28] flex items-center gap-1.5">
                              <Coins className="w-3.5 h-3.5 text-[#D9822B]" />
                              {isFavPartner
                                ? `${homePartner.name} es tu Pareja Favorita (+20 fichas extra por actividad en casa)`
                                : `Convierte a ${homePartner.name} en tu Favorito/a para ganar recompensas extra`}
                            </div>
                            <div className="text-[11px] text-[#6B5E70]">
                              Ánimo en casa:{" "}
                              <strong className={MOOD_LABELS[homePartnerProgress.mood].colorClass}>
                                {MOOD_LABELS[homePartnerProgress.mood].label}
                              </strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleFavorite(homePartner.id)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                                isFavPartner
                                  ? "border-amber-400 bg-amber-100 text-amber-900"
                                  : "border-black/15 bg-white text-[#231F28]"
                              }`}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${isFavPartner ? "fill-amber-500 text-amber-600" : ""}`}
                              />
                              {isFavPartner ? "Favorito/a" : "Hacer Favorito"}
                            </button>
                            <button
                              type="button"
                              onClick={onOpenPhone}
                              className="px-3 py-1.5 rounded-lg bg-[#231F28] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              Chat
                            </button>
                          </div>
                        </div>

                        {/* Couple Home Activities */}
                        <div>
                          <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                            Cosas de parejas en casa
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {COUPLE_HOME_ACTIVITIES.map((act) => (
                              <button
                                key={act.id}
                                type="button"
                                disabled={isHomeLoading}
                                onClick={() => onCoupleHomeAction(act.prompt)}
                                className="p-3 rounded-xl border border-black/10 bg-[#FAF7F6] hover:bg-[#FFF5F8] hover:border-[#E14D7A]/45 text-left transition-colors disabled:opacity-55 cursor-pointer"
                              >
                                <div className="text-xs font-bold text-[#231F28]">
                                  {act.title}
                                </div>
                                <div className="text-[11px] text-[#6B5E70] mt-0.5 line-clamp-2">
                                  {act.prompt}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Direct Home Chat Input */}
                        <form onSubmit={handleSendHomeChat} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={homeChatInput}
                            onChange={(e) => setHomeChatInput(e.target.value)}
                            placeholder={`Habla con ${homePartner.name} en casa...`}
                            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F6] border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E14D7A]/30"
                          />
                          <button
                            type="submit"
                            disabled={isHomeLoading || !homeChatInput.trim()}
                            className="px-4 py-2.5 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            {isHomeLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            Decir
                          </button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B5E70]">
                        Elige arriba a una de tus parejas para invitarla a la sala de tu casa.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

        <div className="shrink-0 hidden sm:flex pt-2 border-t border-black/8 items-center gap-2 text-[11px] text-[#6B5E70]">
          <Sparkles className="w-3.5 h-3.5 text-[#E14D7A] shrink-0" />
          <span>
            Un mayor nivel de Atractivo suma afinidad extra en cada respuesta positiva.
          </span>
        </div>
      </div>
    </div>
  );
};
