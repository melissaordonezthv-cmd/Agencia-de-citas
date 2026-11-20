import React, { useEffect, useRef, useState } from "react";
import {
  BatteryCharging,
  Briefcase,
  CalendarHeart,
  Camera,
  CheckCheck,
  Clock,
  Gift,
  Globe,
  Heart,
  Home,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Send,
  Signal,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";
import {
  CHARACTERS,
  DIFFICULTY_META,
  GIFT_TIER_META,
  MOOD_LABELS,
  getCharacterChapter,
} from "../data/gameData";
import { CharacterProfile, CharacterProgress, PhotoRecord } from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface PhoneModalProps {
  playerName: string;
  character: CharacterProfile;
  progress: CharacterProgress;
  allCharacters: CharacterProfile[];
  allProgress: Record<string, CharacterProgress>;
  favoriteCharacterId: string | null;
  photos: PhotoRecord[];
  isSendingChat: boolean;
  chatError: string | null;
  onSelectContact: (charId: string) => void;
  onToggleFavorite: (charId: string) => void;
  onInviteHome: (charId: string) => void;
  onSendPhoneMessage: (text: string) => void;
  onGoToScheduledDate: (messageId: string, location: string) => void;
  onClose: () => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  playerName,
  character,
  progress,
  allCharacters,
  allProgress,
  favoriteCharacterId,
  photos,
  isSendingChat,
  chatError,
  onSelectContact,
  onToggleFavorite,
  onInviteHome,
  onSendPhoneMessage,
  onGoToScheduledDate,
  onClose,
}) => {
  const [tab, setTab] = useState<"chat" | "social" | "agenda" | "gallery">("chat");
  const [galleryFilter, setGalleryFilter] = useState<"all" | "current">("all");
  const [draft, setDraft] = useState("");
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [progress.phoneHistory, isSendingChat, tab, character.id]);

  const unlockedContacts = allCharacters.filter((c) =>
    Boolean(
      allProgress[c.id]?.unlocked ||
        allProgress[c.id]?.contactAdded ||
        (allProgress[c.id]?.phoneHistory?.length || 0) > 0
    )
  );
  const currentCharPhotos = photos.filter((ph) => ph.characterId === character.id);
  const visiblePhotos = galleryFilter === "current" ? currentCharPhotos : photos;
  const isDateExpired = progress.dateStatus === "expired" && !progress.conquered;
  const isFavorite = favoriteCharacterId === character.id;
  const moodMeta = MOOD_LABELS[progress.mood];
  const diffMeta = DIFFICULTY_META[character.difficulty];
  const currentChapter = getCharacterChapter(character, progress.compatibility);

  const nowTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = draft.trim();
    if (!clean || isSendingChat || progress.patience <= 0) return;
    setDraft("");
    onSendPhoneMessage(clean);
  };

  const toggleLike = (postId: string) => {
    setLikedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const quickPrompts = isDateExpired
    ? [
        `¿Quedamos en ${character.currentLocation} ahora para vernos?`,
        `Me quedé con ganas de estar contigo, ${character.name}. ¿Salimos hoy?`,
        "Prometo aprovechar cada minuto si nos vemos de nuevo.",
      ]
    : progress.phoneSuggestions;

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Realistic Smartphone Chassis */}
      <div className="w-full max-w-[440px] bg-[#FAF7F5] rounded-[2.2rem] sm:rounded-[2.6rem] border-[6px] border-[#1E1A22] shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col h-[92dvh] max-h-[700px]">
        {/* Top Status Bar + Dynamic Island */}
        <div className="bg-[#1E1A22] text-white px-6 pt-2.5 pb-2 flex items-center justify-between text-[11px]">
          <span className="font-mono-num font-semibold">{nowTime}</span>

          <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-end px-2">
            <span className="w-2 h-2 rounded-full bg-indigo-950 border border-indigo-400/40" />
          </div>

          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* 4-App Segmented Bar */}
        <div className="bg-white border-b border-black/8 px-3 py-2 flex items-center justify-between gap-2">
          <div className="grid grid-cols-4 gap-1 bg-[#F3ECEA] p-1 rounded-xl flex-1">
            <button
              type="button"
              onClick={() => setTab("chat")}
              className={`py-1.5 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                tab === "chat"
                  ? "bg-white text-[#231F28] shadow-sm"
                  : "text-[#6B5E70] hover:text-[#231F28]"
              }`}
            >
              <MessageCircle className="w-3 h-3 text-[#E14D7A]" />
              Talk
            </button>
            <button
              type="button"
              onClick={() => setTab("social")}
              className={`py-1.5 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                tab === "social"
                  ? "bg-white text-[#231F28] shadow-sm"
                  : "text-[#6B5E70] hover:text-[#231F28]"
              }`}
            >
              <Users className="w-3 h-3 text-indigo-600" />
              Feed
            </button>
            <button
              type="button"
              onClick={() => setTab("agenda")}
              className={`py-1.5 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                tab === "agenda"
                  ? "bg-white text-[#231F28] shadow-sm"
                  : "text-[#6B5E70] hover:text-[#231F28]"
              }`}
            >
              <CalendarHeart className="w-3 h-3 text-emerald-700" />
              Citas
            </button>
            <button
              type="button"
              onClick={() => setTab("gallery")}
              className={`py-1.5 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                tab === "gallery"
                  ? "bg-white text-[#231F28] shadow-sm"
                  : "text-[#6B5E70] hover:text-[#231F28]"
              }`}
            >
              <ImageIcon className="w-3 h-3 text-amber-600" />
              Fotos
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer shrink-0"
            aria-label="Cerrar teléfono"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* All Scheduled Contacts Strip (Agendados todos en el teléfono) */}
        <div className="bg-[#FFFDFB] border-b border-black/8 px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-[#6B5E70]">
            <span>Contactos agendados ({unlockedContacts.length})</span>
            <span>Cada cita se guarda aquí</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {unlockedContacts.map((c) => {
              const cProg = allProgress[c.id];
              const selected = c.id === character.id;
              const fav = favoriteCharacterId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectContact(c.id)}
                  className={`flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl border text-[11px] font-semibold shrink-0 cursor-pointer transition-colors ${
                    selected
                      ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                      : "border-black/8 bg-[#FAF7F6] text-[#6B5E70] hover:text-[#231F28]"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
                    <ChibiAvatar
                      appearance={c.appearance}
                      mood={cProg?.mood || c.appearance.baseMood}
                      size="sm"
                      floating={false}
                      className="!w-7 !h-7 mt-1"
                    />
                  </div>
                  <span className="truncate max-w-[74px]">{c.name.split(" ")[0]}</span>
                  {fav && <Star className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />}
                  {cProg?.conquered && !fav && (
                    <Heart className="w-3 h-3 text-[#E14D7A] fill-[#E14D7A] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Realistic Messenger (LatidoTalk) */}
        {tab === "chat" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Active Contact Header */}
            <div className="px-4 py-2.5 bg-[#FFFDFB] border-b border-black/8 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#FFF5F8] border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
                  <ChibiAvatar
                    appearance={character.appearance}
                    mood={progress.mood}
                    size="sm"
                    floating={false}
                    className="!w-12 !h-12 mt-2"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#231F28] truncate flex items-center gap-1.5">
                    <span>{character.name}</span>
                    <span className="text-[10px] font-medium text-[#6B5E70]">
                      ({character.country})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B5E70] flex items-center gap-1.5">
                    <span className={moodMeta.colorClass}>{moodMeta.label}</span>
                    <span>·</span>
                    <span>
                      {progress.conquered
                        ? "Tu pareja"
                        : isDateExpired
                          ? "Cita terminada"
                          : "En línea"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {progress.conquered && (
                  <>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(character.id)}
                      title={
                        isFavorite
                          ? "Quitar de Pareja Favorita"
                          : "Marcar como Pareja Favorita (da recompensas extra)"
                      }
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        isFavorite
                          ? "border-amber-300 bg-amber-50 text-amber-600"
                          : "border-black/10 bg-white text-[#6B5E70] hover:text-amber-600"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-amber-400" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onInviteHome(character.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#231F28] hover:bg-[#3A3342] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Home className="w-3 h-3" />
                      Casa
                    </button>
                  </>
                )}
              </div>
            </div>

            {isDateExpired && (
              <div className="px-4 py-2 bg-[#FFF5F8] border-b border-[#E14D7A]/20 text-[11px] text-[#C93B6B] font-medium flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Propón un lugar para quedar y te aparecerá el botón <strong>Ir</strong> en el
                  chat.
                </span>
              </div>
            )}

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DFEC]/55"
            >
              <div className="text-center">
                <span className="text-[10px] font-medium text-[#6B5E70] bg-white/80 px-2.5 py-0.5 rounded-md">
                  Hoy · Contacto agendado en LatidoTalk
                </span>
              </div>

              {progress.phoneHistory.length === 0 && (
                <div className="text-center py-6 text-xs text-[#6B5E70]">
                  {character.name} ya está agendado/a en tu teléfono. Escríbele para charlar o
                  quedar en algún lugar.
                </div>
              )}

              {progress.phoneHistory.map((msg) => {
                const isPlayer = msg.sender === "player";
                const giftTierMeta = msg.receivedGiftTier
                  ? GIFT_TIER_META[msg.receivedGiftTier]
                  : null;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isPlayer ? "items-end" : "items-start"
                    } space-y-1.5`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[88%]">
                      {isPlayer && (
                        <span className="text-[10px] text-[#6B5E70] flex items-center gap-0.5 mb-0.5 shrink-0">
                          <CheckCheck className="w-3 h-3 text-indigo-500" />
                          {msg.timestamp}
                        </span>
                      )}
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isPlayer
                            ? "bg-[#FEE500] text-[#231F28] font-medium rounded-br-xs"
                            : "bg-white text-[#231F28] border border-black/8 rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                      {!isPlayer && (
                        <span className="text-[10px] text-[#6B5E70] mb-0.5 shrink-0">
                          {msg.timestamp}
                        </span>
                      )}
                    </div>

                    {/* Received Gift Badge in Chat */}
                    {msg.receivedGiftName && giftTierMeta && (
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl border text-[11px] flex items-center gap-2 ${giftTierMeta.bgClass}`}
                      >
                        <Gift className={`w-3.5 h-3.5 shrink-0 ${giftTierMeta.colorClass}`} />
                        <span className="text-[#231F28]">
                          Te regaló: <strong>{msg.receivedGiftName}</strong>{" "}
                          <span className={`font-semibold ${giftTierMeta.colorClass}`}>
                            ({giftTierMeta.label})
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Interactive Meetup Card with "Ir" Button */}
                    {msg.dateInvite && (
                      <div className="w-full max-w-[86%] bg-white rounded-2xl border border-[#E14D7A]/40 p-3.5 shadow-sm space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#E14D7A]">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarHeart className="w-3.5 h-3.5" />
                            Quedaron de verse
                          </span>
                          <span className="text-[#6B5E70] font-normal">
                            {msg.dateInvite.timeLabel}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#231F28] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#E14D7A] shrink-0" />
                          <span>{msg.dateInvite.location}</span>
                        </div>
                        <button
                          type="button"
                          disabled={msg.dateInvite.accepted}
                          onClick={() =>
                            onGoToScheduledDate(msg.id, msg.dateInvite!.location)
                          }
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            msg.dateInvite.accepted
                              ? "bg-[#F3ECEA] text-[#6B5E70] cursor-default"
                              : "bg-[#E14D7A] hover:bg-[#C93B6B] text-white"
                          }`}
                        >
                          {msg.dateInvite.accepted ? "Ya fuiste" : "Ir"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {isSendingChat && (
                <div className="flex items-center gap-2">
                  <div className="bg-white border border-black/8 px-3.5 py-2 rounded-2xl rounded-bl-xs text-xs text-[#6B5E70] flex items-center gap-2">
                    <span>{character.name} está escribiendo</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6B5E70] animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#6B5E70] animate-bounce"
                        style={{ animationDelay: "0.12s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#6B5E70] animate-bounce"
                        style={{ animationDelay: "0.24s" }}
                      />
                    </span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                  {chatError}
                </div>
              )}
            </div>

            {/* Quick Reply Chips */}
            {quickPrompts.length > 0 && (
              <div className="px-3 py-2 bg-white border-t border-black/8 flex gap-1.5 overflow-x-auto">
                {quickPrompts.map((sug, idx) => (
                  <button
                    key={`${sug}_${idx}`}
                    type="button"
                    disabled={isSendingChat || progress.patience <= 0}
                    onClick={() => onSendPhoneMessage(sug)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF7F6] hover:bg-[#FFF5F8] border border-black/10 text-[11px] font-medium text-[#231F28] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-black/8 flex items-center gap-2"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={progress.patience <= 0}
                placeholder={
                  progress.patience <= 0
                    ? "Perdió el interés (sin paciencia)"
                    : `Escribe o invita a ${character.name} a un lugar...`
                }
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-[#F5EFF0] border border-black/8 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E14D7A]/30"
              />
              <button
                type="submit"
                disabled={isSendingChat || !draft.trim() || progress.patience <= 0}
                className="p-2.5 rounded-full bg-[#E14D7A] hover:bg-[#C93B6B] disabled:opacity-45 text-white cursor-pointer shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: SeoulGram Social Profile */}
        {tab === "social" && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-white">
            <div className="flex items-center gap-4 pb-3 border-b border-black/8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E14D7A] to-[#F6C453] p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#FFF5F8] overflow-hidden flex items-center justify-center">
                  <ChibiAvatar
                    appearance={character.appearance}
                    mood="encantado"
                    size="sm"
                    floating={false}
                    className="!w-18 !h-18 mt-3"
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-3 text-center">
                <div>
                  <div className="text-sm font-bold font-mono-num text-[#231F28]">
                    {character.socialPosts.length}
                  </div>
                  <div className="text-[11px] text-[#6B5E70]">Posts</div>
                </div>
                <div>
                  <div className="text-sm font-bold font-mono-num text-[#231F28]">
                    {character.followers}
                  </div>
                  <div className="text-[11px] text-[#6B5E70]">Seguidores</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#231F28] truncate">
                    {character.country}
                  </div>
                  <div className="text-[11px] text-[#6B5E70]">País</div>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div className="font-bold text-[#231F28]">
                {character.name} ·{" "}
                <span className="text-[#6B5E70] font-normal">{character.handle}</span>
              </div>
              <p className="text-[#4D4254] leading-relaxed">{character.socialBio}</p>
            </div>

            <div className="space-y-4 pt-1">
              {character.socialPosts.map((post) => {
                const liked = likedPostIds.includes(post.id);
                return (
                  <article
                    key={post.id}
                    className="rounded-xl border border-black/10 overflow-hidden bg-[#FAF7F6]"
                  >
                    <div className="px-3.5 py-2 flex items-center justify-between text-xs bg-white border-b border-black/6">
                      <span className="font-semibold text-[#231F28]">{post.handle}</span>
                      <span className="text-[#6B5E70] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </span>
                    </div>

                    {post.imageUrl && (
                      <div className="h-36 w-full relative overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-3.5 space-y-2 bg-white">
                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => toggleLike(post.id)}
                          className="inline-flex items-center gap-1.5 font-semibold text-[#E14D7A] cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${liked ? "fill-[#E14D7A]" : ""}`} />
                          <span className="font-mono-num">{post.likes + (liked ? 1 : 0)}</span>
                        </button>
                        <span className="text-[#6B5E70]">{post.timeAgo}</span>
                      </div>
                      <p className="text-xs text-[#231F28] leading-relaxed">{post.caption}</p>
                      <p className="text-[11px] font-medium text-[#6B5E70] pt-1.5 border-t border-black/6">
                        {post.clueText}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Agenda & Country/Job Scenarios */}
        {tab === "agenda" && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-[#FAF7F5]">
            <div className="bg-white p-4 rounded-2xl border border-black/8 space-y-2">
              <div className="text-[11px] font-semibold text-[#6B5E70]">
                Perfil · {character.personalityTrait}
              </div>
              <div className="text-base font-bold text-[#231F28] flex items-center justify-between">
                <span>{character.name}</span>
                {character.isToxicOrDangerous && (
                  <span className="text-[11px] font-semibold text-red-700">
                    Tóxico/Peligroso
                  </span>
                )}
              </div>
              <div className="text-xs text-[#4D4254] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                País: {character.country}
              </div>
              <div className="text-xs text-[#4D4254] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#E14D7A]" />
                {character.occupation}
              </div>
              <div className="text-xs text-[#4D4254] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E14D7A]" />
                Escenario actual: {currentChapter.scenarioName}
              </div>
              <div className={`text-xs font-semibold pt-1 ${diffMeta.colorClass}`}>
                {diffMeta.label} · {diffMeta.desc}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-[#231F28]">
                Escenarios de {character.country}
              </div>
              {character.chapters.map((ch) => {
                const reached = progress.compatibility >= ch.minCompatibility;
                return (
                  <div
                    key={ch.chapter}
                    className={`p-3 rounded-xl border ${
                      reached
                        ? "bg-white border-black/10"
                        : "bg-[#F3ECEA]/60 border-black/5 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#231F28]">
                        Cap. {ch.chapter} · {ch.scenarioName}
                      </span>
                      <span className="font-mono-num text-[#E14D7A]">
                        {ch.minCompatibility}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E70] mt-1">{ch.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Polaroid Photo Gallery (preserves historical partner & supports filter) */}
        {tab === "gallery" && (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#FAF7F5]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B5E70]">
              <span className="font-semibold text-[#231F28]">Álbum de {playerName}</span>
              <div className="flex items-center gap-1 bg-[#EAE2DF] p-0.5 rounded-lg text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => setGalleryFilter("all")}
                  className={`px-2 py-1 rounded-md cursor-pointer ${
                    galleryFilter === "all" ? "bg-white text-[#231F28] shadow-xs" : "text-[#6B5E70]"
                  }`}
                >
                  Todas ({photos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFilter("current")}
                  className={`px-2 py-1 rounded-md cursor-pointer ${
                    galleryFilter === "current"
                      ? "bg-white text-[#231F28] shadow-xs"
                      : "text-[#6B5E70]"
                  }`}
                >
                  {character.name.split(" ")[0]} ({currentCharPhotos.length})
                </button>
              </div>
            </div>

            {visiblePhotos.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <Camera className="w-8 h-8 text-[#6B5E70] mx-auto opacity-50" />
                <p className="text-xs text-[#6B5E70]">
                  {galleryFilter === "current"
                    ? `Aún no tienes fotos tomadas con ${character.name}.`
                    : "Aún no hay recuerdos guardados. Usa la Cámara en la cita para tomar una foto Polaroid."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {visiblePhotos.map((ph) => {
                  const partnerAppearance =
                    ph.characterSnapshot ||
                    CHARACTERS.find((c) => c.id === ph.characterId)?.appearance ||
                    character.appearance;

                  return (
                    <div
                      key={ph.id}
                      className="bg-white p-2 pb-3 rounded-xl border border-black/10 shadow-xs space-y-2"
                    >
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img
                          src={ph.backdropUrl}
                          alt={ph.caption}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="relative z-10 h-full flex items-end justify-center gap-1 pb-1">
                          <ChibiAvatar
                            appearance={ph.playerSnapshot}
                            mood={ph.playerMood}
                            pose={ph.playerPose}
                            size="sm"
                            floating={false}
                            className="!w-12 !h-16"
                          />
                          <ChibiAvatar
                            appearance={partnerAppearance}
                            mood={ph.characterMood}
                            pose={ph.characterPose}
                            size="sm"
                            floating={false}
                            className="!w-12 !h-16"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold text-[#231F28] truncate">
                        {ph.caption}
                      </p>
                      <p className="text-[10px] font-medium text-[#E14D7A] truncate">
                        Con {ph.characterName}
                      </p>
                      <p className="text-[10px] text-[#6B5E70] truncate">
                        {ph.backdropName} · {ph.takenAt}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Home Indicator */}
        <div className="bg-white py-2 flex justify-center border-t border-black/6">
          <div className="w-28 h-1 rounded-full bg-black/20" />
        </div>
      </div>
    </div>
  );
};
