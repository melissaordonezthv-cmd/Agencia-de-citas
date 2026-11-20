import React, { useState } from "react";
import { Camera, Check, Heart, Image as ImageIcon, X } from "lucide-react";
import { BACKDROPS, CHARACTERS, getCharacterChapter } from "../data/gameData";
import {
  CharacterProfile,
  ChibiAppearance,
  ChibiPose,
  EmotionalState,
  PhotoRecord,
} from "../types/game";
import { ChibiAvatar } from "./ChibiAvatar";

interface CameraModalProps {
  playerName: string;
  playerAppearance: ChibiAppearance;
  character: CharacterProfile;
  photos: PhotoRecord[];
  onTakePhoto: (photo: Omit<PhotoRecord, "id" | "takenAt">) => void;
  onClose: () => void;
}

const POSES: { id: ChibiPose; label: string }[] = [
  { id: "idle", label: "Natural" },
  { id: "wave", label: "Saludo" },
  { id: "finger_heart", label: "Corazón" },
  { id: "wink_pose", label: "Guiño" },
  { id: "shy_hold", label: "Tímido" },
  { id: "toast", label: "Brindis" },
];

const PHOTO_MOODS: { id: EmotionalState; label: string }[] = [
  { id: "encantado", label: "Feliz" },
  { id: "enamorado", label: "Enamorado" },
  { id: "timido", label: "Sonrojado" },
  { id: "jugueton", label: "Travieso" },
];

export const CameraModal: React.FC<CameraModalProps> = ({
  playerName,
  playerAppearance,
  character,
  photos,
  onTakePhoto,
  onClose,
}) => {
  const [playerPose, setPlayerPose] = useState<ChibiPose>("finger_heart");
  const [charPose, setCharPose] = useState<ChibiPose>("shy_hold");
  const [playerMood, setPlayerMood] = useState<EmotionalState>("encantado");
  const [charMood, setCharMood] = useState<EmotionalState>("timido");
  const [sceneIdx, setSceneIdx] = useState(0);
  const [albumFilter, setAlbumFilter] = useState<"all" | "current">("all");
  const [caption, setCaption] = useState(`Recuerdo especial con ${character.name}`);
  const [justCaptured, setJustCaptured] = useState(false);

  const charCh = getCharacterChapter(character, 0);
  const SCENES = [
    { id: "char_loc", name: charCh.scenarioName, url: charCh.backdropUrl },
    { id: "coupleHome", name: "En Casa Juntos", url: BACKDROPS.coupleHome },
    { id: "rooftop", name: "Terraza Namsan", url: BACKDROPS.rooftop },
    { id: "hanRiver", name: "Río Han Nocturno", url: BACKDROPS.hanRiver },
    { id: "tokyoNeon", name: "Neón Tokio", url: BACKDROPS.tokyoNeon },
    { id: "parisAtelier", name: "Atelier París", url: BACKDROPS.parisAtelier },
    { id: "medTerrace", name: "Costa Italia", url: BACKDROPS.mediterraneanTerrace },
    { id: "bedroom", name: "Mi Habitación", url: BACKDROPS.bedroom },
  ];

  const selectedScene = SCENES[sceneIdx] || SCENES[0];
  const currentCharPhotos = photos.filter((p) => p.characterId === character.id);
  const visiblePhotos = albumFilter === "current" ? currentCharPhotos : photos;

  const handleCapture = () => {
    onTakePhoto({
      characterId: character.id,
      characterName: character.name,
      characterSnapshot: { ...character.appearance },
      backdropName: selectedScene.name,
      backdropUrl: selectedScene.url,
      playerPose,
      characterPose: charPose,
      playerMood,
      characterMood: charMood,
      caption: caption.trim() || `Cita en ${selectedScene.name}`,
      playerSnapshot: { ...playerAppearance },
    });
    setJustCaptured(true);
    setTimeout(() => setJustCaptured(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#231F28]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-black/8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#231F28] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#E14D7A]" />
              Estudio Cámara Chibi
            </h2>
            <p className="text-xs text-[#6B5E70]">
              Toma Polaroids con cada cita; todas quedan guardadas con esa persona.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5 text-[#4D4254] cursor-pointer"
            aria-label="Cerrar cámara"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          {/* Polaroid Live Preview */}
          <div className="space-y-3">
            <div className="bg-[#FAF7F5] p-3 pb-4 rounded-xl border border-black/10 shadow-sm">
              <div className="relative h-64 sm:h-72 rounded-lg overflow-hidden">
                <img
                  src={selectedScene.url}
                  alt={selectedScene.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

                {/* Flash effect */}
                {justCaptured && (
                  <div className="absolute inset-0 bg-white/80 z-30 transition-opacity duration-300" />
                )}

                <div className="relative z-10 h-full flex items-end justify-center gap-3 sm:gap-4 pb-2 px-4">
                  <ChibiAvatar
                    appearance={playerAppearance}
                    mood={playerMood}
                    pose={playerPose}
                    facing="right"
                    size="lg"
                    floating={false}
                    showMoodAura={true}
                  />
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400 self-center mb-10 shrink-0" />
                  <ChibiAvatar
                    appearance={character.appearance}
                    mood={charMood}
                    pose={charPose}
                    facing="left"
                    size="lg"
                    floating={false}
                    showMoodAura={true}
                  />
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
                <input
                  type="text"
                  value={caption}
                  maxLength={48}
                  onChange={(e) => setCaption(e.target.value)}
                  className="text-sm font-medium text-[#231F28] bg-transparent border-b border-black/15 focus:border-[#E14D7A] focus:outline-none w-full py-1"
                />
                <span className="text-[11px] text-[#6B5E70] whitespace-nowrap">{selectedScene.name}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCapture}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E14D7A] hover:bg-[#C93B6B] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {justCaptured ? (
                <>
                  <Check className="w-4 h-4" />
                  ¡Foto guardada en el álbum de {character.name}!
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Tomar Foto Polaroid
                </>
              )}
            </button>
          </div>

          {/* Pose & Scene Controls */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">Fondo del Estudio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {SCENES.map((sc, i) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSceneIdx(i)}
                    className={`px-2.5 py-2 rounded-lg border text-[11px] font-medium cursor-pointer text-left truncate ${
                      sceneIdx === i
                        ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                        : "border-black/10 bg-[#FAF7F6] text-[#4D4254]"
                    }`}
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3 rounded-xl bg-[#FAF7F6] border border-black/8">
                <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                  Pose de {playerName}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {POSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlayerPose(p.id)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-medium cursor-pointer ${
                        playerPose === p.id
                          ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                          : "border-black/10 bg-white text-[#4D4254]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {PHOTO_MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPlayerMood(m.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer ${
                        playerMood === m.id
                          ? "bg-[#231F28] text-white"
                          : "bg-black/5 text-[#6B5E70]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F6] border border-black/8">
                <h3 className="text-xs font-semibold text-[#6B5E70] mb-2">
                  Pose de {character.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {POSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCharPose(p.id)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-medium cursor-pointer ${
                        charPose === p.id
                          ? "border-[#E14D7A] bg-[#FFF5F8] text-[#231F28]"
                          : "border-black/10 bg-white text-[#4D4254]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {PHOTO_MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setCharMood(m.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer ${
                        charMood === m.id
                          ? "bg-[#231F28] text-white"
                          : "bg-black/5 text-[#6B5E70]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Complete Preserved Album (no 6-photo limit!) */}
          <div className="pt-3 border-t border-black/8 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#231F28]">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#E14D7A]" />
                Álbum de Recuerdos ({photos.length})
              </span>
              <div className="flex items-center gap-1 bg-[#F3ECEA] p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setAlbumFilter("all")}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${
                    albumFilter === "all" ? "bg-white text-[#231F28] shadow-xs" : "text-[#6B5E70]"
                  }`}
                >
                  Todas ({photos.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAlbumFilter("current")}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${
                    albumFilter === "current"
                      ? "bg-white text-[#231F28] shadow-xs"
                      : "text-[#6B5E70]"
                  }`}
                >
                  Con {character.name.split(" ")[0]} ({currentCharPhotos.length})
                </button>
              </div>
            </div>

            {visiblePhotos.length === 0 ? (
              <p className="text-xs text-[#6B5E70] py-3 text-center">
                {albumFilter === "current"
                  ? `Todavía no tienes fotos guardadas con ${character.name}.`
                  : "Aún no has tomado fotos. Posad juntos para guardar vuestro primer recuerdo."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {visiblePhotos.map((ph) => {
                  const partnerAppearance =
                    ph.characterSnapshot ||
                    CHARACTERS.find((c) => c.id === ph.characterId)?.appearance ||
                    character.appearance;
                  return (
                    <div
                      key={ph.id}
                      className="p-2 rounded-xl border border-black/8 bg-[#FAF7F6] flex items-center gap-2.5"
                    >
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-black/10">
                        <img
                          src={ph.backdropUrl}
                          alt={ph.caption}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="relative z-10 h-full flex items-end justify-center gap-0.5 pb-0.5">
                          <ChibiAvatar
                            appearance={ph.playerSnapshot}
                            mood={ph.playerMood}
                            pose={ph.playerPose}
                            size="sm"
                            floating={false}
                            className="!w-8 !h-10"
                          />
                          <ChibiAvatar
                            appearance={partnerAppearance}
                            mood={ph.characterMood}
                            pose={ph.characterPose}
                            size="sm"
                            floating={false}
                            className="!w-8 !h-10"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#231F28] truncate">
                          {ph.caption}
                        </p>
                        <p className="text-[11px] font-medium text-[#E14D7A] truncate">
                          Con {ph.characterName}
                        </p>
                        <p className="text-[10px] text-[#6B5E70] truncate">
                          {ph.backdropName} · {ph.takenAt}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
