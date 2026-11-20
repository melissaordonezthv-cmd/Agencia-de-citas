import React from "react";
import {
  EYE_SPEC_MAP,
  EyeSpec,
  HAIR_SPEC_MAP,
  HairSpec,
  MOUTH_SPEC_MAP,
  MouthSpec,
  OUTFIT_SPEC_MAP,
  OutfitSpec,
} from "../data/customizationData";
import { ChibiAppearance, ChibiPose, EmotionalState } from "../types/game";

interface ChibiAvatarProps {
  appearance: ChibiAppearance;
  mood?: EmotionalState;
  pose?: ChibiPose;
  facing?: "left" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  floating?: boolean;
  showMoodAura?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: "w-20 h-24",
  md: "w-32 h-40",
  lg: "w-44 h-52 sm:w-52 sm:h-60",
  xl: "w-52 h-64 sm:w-64 sm:h-76",
};

function darkenHex(hex: string, amount = 26): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#2D2229";
  const num = parseInt(clean, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function lightenHex(hex: string, amount = 24): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#FFFFFF";
  const num = parseInt(clean, 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const DEFAULT_HAIR: HairSpec = {
  id: "soft_bob",
  name: "Bob Suave",
  section: "chicas",
  price: 0,
  attractiveness: 4,
  charmNote: "",
  fluffy: true,
  crown: "fluffy_cloud",
  bangs: "straight_thick",
  back: "fluffy_bob",
};

const DEFAULT_OUTFIT: OutfitSpec = {
  id: "pastel_sweater",
  name: "Suéter Lavanda",
  section: "chicas",
  price: 0,
  attractiveness: 3,
  charmNote: "",
  silhouette: "hoodie_wide",
  top: "#D6C6F0",
  topShade: "#B59DE8",
  inner: "#FFFFFF",
  bottom: "#3D435C",
  shoe: "#FFFFFF",
  accent: "#9F84D6",
};

const DEFAULT_EYE: EyeSpec = {
  id: "starry",
  name: "Estrella",
  category: "dulces",
  price: 0,
  attractiveness: 2,
  charmNote: "",
  shape: "round",
  lash: "soft",
  shine: "double",
  aegyosal: true,
};

const DEFAULT_MOUTH: MouthSpec = {
  id: "smile_soft",
  name: "Sonrisa Suave",
  category: "dulces",
  price: 0,
  attractiveness: 2,
  charmNote: "",
  shape: "smile",
  lipColor: "#E88B9E",
};

/**
 * Pixel-Art Korean Manhwa Chibi Renderer (42x52 crisp SVG pixel grid, centered at x=18)
 * Renders 54 hairstyles (including wide fluffy styles), 54 outfits (baggy/oversize/wide),
 * 52 pixel eye designs, 52 pixel mouths, 6 face marks, blush styles, and 20 accessories.
 */
export const ChibiAvatar: React.FC<ChibiAvatarProps> = ({
  appearance,
  mood,
  pose = "idle",
  facing = "right",
  size = "lg",
  floating = true,
  showMoodAura = false,
  className = "",
}) => {
  const activeMood = mood || appearance.baseMood;
  const ink = "#2D2229";
  const hair = appearance.hairColor;
  const hairDark = darkenHex(hair, 24);
  const hairLight = lightenHex(hair, 24);
  const skin = appearance.skinTone;
  const skinShade = darkenHex(skin, 18);
  const iris = appearance.eyeColor;
  const irisDark = darkenHex(iris, 42);
  const irisLight = lightenHex(iris, 42);

  const hairSpec = HAIR_SPEC_MAP[appearance.hairStyle] || DEFAULT_HAIR;
  const outfitSpec = OUTFIT_SPEC_MAP[appearance.outfit] || DEFAULT_OUTFIT;
  const eyeSpec = EYE_SPEC_MAP[appearance.eyeStyle] || DEFAULT_EYE;
  const mouthSpec =
    MOUTH_SPEC_MAP[appearance.mouthStyle || "smile_soft"] || DEFAULT_MOUTH;

  const blushStyle = appearance.blushStyle || "suave";
  const blushColor = appearance.blushColor || "#F69AB3";
  const faceMark = appearance.faceMark || "ninguno";

  const isWinking = pose === "wink_pose" || activeMood === "jugueton";
  const isMoodBlushing =
    activeMood === "timido" ||
    activeMood === "enamorado" ||
    activeMood === "encantado" ||
    pose === "finger_heart" ||
    pose === "shy_hold";

  const px = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    opacity = 1
  ) => (
    <rect
      key={`${x}_${y}_${w}_${h}_${fill}_${opacity}`}
      x={x}
      y={y}
      width={w}
      height={h}
      fill={fill}
      opacity={opacity}
    />
  );

  // =====================================================================
  // 1. BACK HAIR RENDERER (supports 54 hairstyles & fluffy wide silhouettes)
  // =====================================================================
  const renderBackHair = () => {
    const pad = hairSpec.fluffy ? 1 : 0;
    const xBase = 8 - pad;
    const wBase = 20 + pad * 2;

    return (
      <g>
        {/* Base scalp & side volume */}
        <rect x={xBase} y="7" width={wBase} height="17" fill={ink} />
        <rect x={xBase - 1} y="10" width={wBase + 2} height="13" fill={ink} />
        <rect x={xBase + 1} y="8" width={wBase - 2} height="15" fill={hair} />
        <rect x={xBase} y="11" width={wBase} height="11" fill={hair} />

        {/* Back silhouette extensions */}
        {hairSpec.back === "fluffy_bob" && (
          <g>
            <rect x={xBase - 1} y="13" width={wBase + 2} height="13" fill={ink} />
            <rect x={xBase} y="14" width={wBase} height="11" fill={hair} />
            <rect x={xBase} y="23" width="3" height="2" fill={hairDark} />
            <rect x={xBase + wBase - 3} y="23" width="3" height="2" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "flipped_bob" && (
          <g>
            <rect x={xBase - 1} y="13" width={wBase + 2} height="13" fill={ink} />
            <rect x={xBase - 3} y="23" width={wBase + 6} height="4" fill={ink} />
            <rect x={xBase} y="14" width={wBase} height="11" fill={hair} />
            <rect x={xBase - 2} y="24" width={wBase + 4} height="2" fill={hair} />
            <rect x={xBase - 2} y="25" width="3" height="1" fill={hairDark} />
            <rect x={xBase + wBase - 1} y="25" width="3" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "wavy_shoulder" && (
          <g>
            <rect x={xBase - 1} y="13" width={wBase + 2} height="15" fill={ink} />
            <rect x={xBase - 2} y="21" width={wBase + 4} height="6" fill={ink} />
            <rect x={xBase} y="14" width={wBase} height="13" fill={hair} />
            <rect x={xBase - 1} y="22" width={wBase + 2} height="4" fill={hair} />
            <rect x={xBase} y="25" width="3" height="2" fill={hairDark} />
            <rect x={xBase + wBase - 3} y="25" width="3" height="2" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "long_waves" && (
          <g>
            <rect x={xBase - 1} y="10" width={wBase + 2} height="22" fill={ink} />
            <rect x={xBase - 2} y="21" width={wBase + 4} height="11" fill={ink} />
            <rect x={xBase} y="11" width={wBase} height="20" fill={hair} />
            <rect x={xBase - 1} y="22" width={wBase + 2} height="9" fill={hair} />
            <rect x={xBase} y="29" width="4" height="2" fill={hairDark} />
            <rect x={xBase + wBase - 4} y="29" width="4" height="2" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "long_straight" && (
          <g>
            <rect x={xBase} y="10" width={wBase} height="24" fill={ink} />
            <rect x={xBase + 1} y="11" width={wBase - 2} height="22" fill={hair} />
            <rect x={xBase + 1} y="30" width="3" height="3" fill={hairDark} />
            <rect x={xBase + wBase - 4} y="30" width="3" height="3" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "mullet" && (
          <g>
            <rect x="7" y="13" width="22" height="12" fill={ink} />
            <rect x="8" y="14" width="20" height="10" fill={hair} />
            <rect x="8" y="24" width="5" height="5" fill={ink} />
            <rect x="23" y="24" width="5" height="5" fill={ink} />
            <rect x="9" y="24" width="3" height="4" fill={hairDark} />
            <rect x="24" y="24" width="3" height="4" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "shaggy_wolf" && (
          <g>
            <rect x="6" y="12" width="24" height="13" fill={ink} />
            <rect x="7" y="13" width="22" height="11" fill={hair} />
            <rect x="6" y="23" width="3" height="3" fill={ink} />
            <rect x="27" y="23" width="3" height="3" fill={ink} />
            <rect x="7" y="23" width="2" height="2" fill={hairDark} />
            <rect x="27" y="23" width="2" height="2" fill={hairDark} />
          </g>
        )}

        {hairSpec.back === "braided_locs" && (
          <g>
            <rect x="7" y="13" width="22" height="13" fill={ink} />
            <rect x="8" y="14" width="20" height="11" fill={hair} />
            {/* Crisp braided loc ridges */}
            <rect x="8" y="18" width="2" height="7" fill={hairDark} />
            <rect x="11" y="20" width="2" height="5" fill={hairDark} />
            <rect x="23" y="20" width="2" height="5" fill={hairDark} />
            <rect x="26" y="18" width="2" height="7" fill={hairDark} />
            <rect x="7" y="23" width="2" height="2" fill={hair} />
            <rect x="27" y="23" width="2" height="2" fill={hair} />
          </g>
        )}

        {hairSpec.back === "side_ponytail" && (
          <g>
            {/* High side ponytail on right side (matching ref image #9!) */}
            <rect x="24" y="6" width="7" height="22" fill={ink} />
            <rect x="25" y="7" width="5" height="20" fill={hair} />
            <rect x="27" y="9" width="2" height="14" fill={hairLight} />
            <rect x="25" y="25" width="4" height="2" fill={hairDark} />
            {/* Two white fluffy pom-pom hair ties */}
            <rect x="22" y="3" width="3" height="3" fill="#FFFFFF" />
            <rect x="23" y="5" width="3" height="3" fill="#F0EEF5" />
          </g>
        )}

        {hairSpec.back === "twin_tails" && (
          <g>
            <rect x="3" y="11" width="5" height="18" fill={ink} />
            <rect x="4" y="12" width="3" height="16" fill={hair} />
            <rect x="28" y="11" width="5" height="18" fill={ink} />
            <rect x="29" y="12" width="3" height="16" fill={hair} />
            <rect x="6" y="11" width="2" height="2" fill="#E14D7A" />
            <rect x="28" y="11" width="2" height="2" fill="#E14D7A" />
          </g>
        )}

        {hairSpec.back === "twin_buns" && (
          <g>
            <rect x="5" y="2" width="6" height="6" fill={ink} />
            <rect x="25" y="2" width="6" height="6" fill={ink} />
            <rect x="6" y="3" width="4" height="4" fill={hair} />
            <rect x="26" y="3" width="4" height="4" fill={hair} />
            <rect x="7" y="4" width="2" height="1" fill={hairLight} />
            <rect x="27" y="4" width="2" height="1" fill={hairLight} />
            {hairSpec.id === "girl_double_buns_long" && (
              <>
                <rect x="7" y="22" width="22" height="10" fill={ink} />
                <rect x="8" y="22" width="20" height="9" fill={hair} />
              </>
            )}
          </g>
        )}

        {hairSpec.back === "high_bun" && (
          <g>
            <rect x="13" y="1" width="10" height="7" fill={ink} />
            <rect x="14" y="2" width="8" height="5" fill={hair} />
            <rect x="15" y="3" width="6" height="1" fill={hairLight} />
          </g>
        )}

        {hairSpec.back === "side_braid" && (
          <g>
            <rect x="6" y="21" width="5" height="12" fill={ink} />
            <rect x="7" y="22" width="3" height="10" fill={hair} />
            <rect x="7" y="24" width="3" height="1" fill={hairDark} />
            <rect x="7" y="27" width="3" height="1" fill={hairDark} />
            <rect x="7" y="30" width="3" height="1" fill="#E14D7A" />
          </g>
        )}
      </g>
    );
  };

  // =====================================================================
  // 2. FRONT HAIR RENDERER (fluffy crowns, bangs, highlights, ornaments)
  // =====================================================================
  const renderFrontHair = () => {
    const isFluffy = hairSpec.fluffy || hairSpec.crown === "fluffy_cloud";

    return (
      <g>
        {/* Crown Silhouette */}
        {hairSpec.crown === "fluffy_cloud" ? (
          <g>
            <rect x="10" y="4" width="16" height="1" fill={ink} />
            <rect x="8" y="5" width="20" height="2" fill={ink} />
            <rect x="6" y="7" width="24" height="5" fill={ink} />
            <rect x="9" y="5" width="18" height="3" fill={hair} />
            <rect x="7" y="7" width="22" height="5" fill={hair} />
            <rect x="11" y="7" width="5" height="1" fill={hairLight} />
            <rect x="20" y="7" width="4" height="1" fill={hairLight} />
            {/* Fluffy side tufts */}
            <rect x="6" y="11" width="2" height="3" fill={hair} />
            <rect x="28" y="11" width="2" height="3" fill={hair} />
          </g>
        ) : hairSpec.crown === "high_volume" ? (
          <g>
            <rect x="11" y="4" width="14" height="1" fill={ink} />
            <rect x="9" y="5" width="18" height="2" fill={ink} />
            <rect x="8" y="7" width="20" height="5" fill={ink} />
            <rect x="10" y="5" width="16" height="3" fill={hair} />
            <rect x="9" y="7" width="18" height="5" fill={hair} />
            <rect x="12" y="7" width="5" height="1" fill={hairLight} />
            <rect x="20" y="8" width="4" height="1" fill={hairLight} />
          </g>
        ) : hairSpec.crown === "spiky" ? (
          <g>
            <rect x="11" y="4" width="4" height="2" fill={ink} />
            <rect x="17" y="3" width="5" height="3" fill={ink} />
            <rect x="23" y="5" width="4" height="2" fill={ink} />
            <rect x="7" y="7" width="22" height="5" fill={ink} />
            <rect x="12" y="5" width="3" height="2" fill={hair} />
            <rect x="18" y="4" width="3" height="3" fill={hair} />
            <rect x="8" y="7" width="20" height="5" fill={hair} />
            <rect x="12" y="8" width="4" height="1" fill={hairLight} />
          </g>
        ) : hairSpec.crown === "braided_crown" ? (
          <g>
            <rect x="10" y="6" width="16" height="1" fill={ink} />
            <rect x="8" y="7" width="20" height="5" fill={ink} />
            <rect x="9" y="8" width="18" height="4" fill={hair} />
            {/* Scalp part & cornrow stripes */}
            <rect x="17" y="7" width="2" height="5" fill={skinShade} />
            <rect x="11" y="9" width="5" height="1" fill={hairDark} />
            <rect x="20" y="9" width="5" height="1" fill={hairDark} />
            <rect x="10" y="11" width="5" height="1" fill={hairDark} />
            <rect x="21" y="11" width="5" height="1" fill={hairDark} />
          </g>
        ) : (
          <g>
            <rect x="11" y="6" width="14" height="1" fill={ink} />
            <rect x="9" y="7" width="18" height="5" fill={ink} />
            <rect x="10" y="7" width="16" height="5" fill={hair} />
            <rect x="9" y="9" width="18" height="4" fill={hair} />
            <rect x="12" y="9" width="4" height="1" fill={hairLight} />
            <rect x="20" y="9" width="4" height="1" fill={hairLight} />
          </g>
        )}

        {/* Bangs Styles */}
        {hairSpec.bangs === "comma" && (
          <g>
            <rect x="9" y="12" width="6" height="3" fill={hair} />
            <rect x="11" y="14" width="5" height="2" fill={hair} />
            <rect x="13" y="15" width="3" height="1" fill={hairDark} />
            <rect x="20" y="12" width="7" height="3" fill={hair} />
            <rect x="22" y="14" width="4" height="2" fill={hair} />
          </g>
        )}

        {hairSpec.bangs === "curtain_64" && (
          <g>
            <rect x="9" y="12" width="7" height="3" fill={hair} />
            <rect x="10" y="15" width="4" height="1" fill={hairDark} />
            <rect x="19" y="11" width="8" height="4" fill={hair} />
            <rect x="21" y="15" width="5" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.bangs === "straight_thick" && (
          <g>
            <rect x="9" y="12" width="18" height="4" fill={hair} />
            <rect x="11" y="15" width="14" height="1" fill={hairDark} />
            <rect x="13" y="13" width="8" height="1" fill={hairLight} />
          </g>
        )}

        {hairSpec.bangs === "hime" && (
          <g>
            <rect x="10" y="12" width="16" height="3" fill={hair} />
            <rect x="9" y="14" width="3" height="9" fill={hair} />
            <rect x="24" y="14" width="3" height="9" fill={hair} />
            <rect x="9" y="22" width="3" height="1" fill={hairDark} />
            <rect x="24" y="22" width="3" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.bangs === "messy_spiky" && (
          <g>
            <rect x="9" y="12" width="4" height="4" fill={hair} />
            <rect x="14" y="12" width="4" height="5" fill={hair} />
            <rect x="19" y="12" width="3" height="4" fill={hair} />
            <rect x="23" y="12" width="4" height="4" fill={hair} />
            <rect x="15" y="15" width="2" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.bangs === "wavy_part" && (
          <g>
            <rect x="8" y="11" width="7" height="4" fill={hair} />
            <rect x="15" y="12" width="4" height="3" fill={hair} />
            <rect x="20" y="11" width="8" height="4" fill={hair} />
            <rect x="11" y="15" width="3" height="1" fill={hairDark} />
            <rect x="22" y="15" width="3" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.bangs === "side_sweep" && (
          <g>
            <rect x="9" y="12" width="13" height="2" fill={hair} />
            <rect x="9" y="14" width="7" height="2" fill={hair} />
            <rect x="23" y="12" width="4" height="3" fill={hair} />
            <rect x="13" y="13" width="6" height="1" fill={hairLight} />
          </g>
        )}

        {hairSpec.bangs === "wispy_air" && (
          <g>
            <rect x="9" y="12" width="5" height="3" fill={hair} />
            <rect x="15" y="12" width="5" height="4" fill={hair} />
            <rect x="21" y="12" width="6" height="3" fill={hair} />
            <rect x="16" y="15" width="2" height="1" fill={hairDark} />
          </g>
        )}

        {hairSpec.bangs === "braids_front" && (
          <g>
            {/* Front braided strands like reference image #6 */}
            <rect x="10" y="11" width="4" height="3" fill={hair} />
            <rect x="22" y="11" width="4" height="3" fill={hair} />
            <rect x="11" y="14" width="2" height="6" fill={ink} />
            <rect x="11" y="14" width="2" height="5" fill={hair} />
            <rect x="11" y="16" width="2" height="1" fill={hairDark} />
            <rect x="23" y="14" width="2" height="6" fill={ink} />
            <rect x="23" y="14" width="2" height="5" fill={hair} />
            <rect x="23" y="16" width="2" height="1" fill={hairDark} />
          </g>
        )}

        {/* Side framing fluffy or sleek strands */}
        <rect x={isFluffy ? 8 : 9} y="13" width={isFluffy ? 3 : 2} height="10" fill={hair} />
        <rect x={isFluffy ? 25 : 25} y="13" width={isFluffy ? 3 : 2} height="10" fill={hair} />

        {/* Built-in Hair Ornaments */}
        {hairSpec.hairOrnament === "star_gold" && (
          <g>
            <rect x="11" y="8" width="3" height="2" fill="#F6D54A" />
            <rect x="12" y="7" width="1" height="4" fill="#F6D54A" />
            <rect x="10" y="8" width="1" height="1" fill="#FFFFFF" />
          </g>
        )}
        {hairSpec.hairOrnament === "ribbon_pink" && (
          <g>
            <rect x="23" y="8" width="4" height="2" fill="#E14D7A" />
            <rect x="24" y="7" width="2" height="4" fill="#F79BB7" />
          </g>
        )}
      </g>
    );
  };

  // =====================================================================
  // 3. FACE: 52 EYES, 52 MOUTHS, BLUSH & 6 FACE MARKS
  // =====================================================================
  const renderEyesAndFace = () => {
    const drawEye = (ex: number, isRight: boolean) => {
      if (isRight && isWinking) {
        return (
          <g key={`wink_${ex}`}>
            <rect x={ex} y="19" width="4" height="1" fill={ink} />
            <rect x={ex + 1} y="18" width="2" height="1" fill={ink} />
          </g>
        );
      }

      if (
        eyeSpec.shape === "crescent" ||
        (activeMood === "encantado" && pose === "shy_hold")
      ) {
        return (
          <g key={`cresc_${ex}`}>
            <rect x={ex} y="19" width="4" height="1" fill={ink} />
            <rect x={ex + 1} y="18" width="2" height="1" fill={ink} />
            {(eyeSpec.lash === "winged" || eyeSpec.lash === "thick") && (
              <rect
                x={isRight ? ex + 4 : ex - 1}
                y="18"
                width="1"
                height="1"
                fill={ink}
              />
            )}
          </g>
        );
      }

      const isCompact = eyeSpec.shape === "sleepy" || eyeSpec.shape === "sharp" || eyeSpec.shape === "almond";
      const eyeTopY = isCompact ? 18 : 17;
      const eyeHeight = eyeSpec.shape === "wide" ? 3 : isCompact ? 2 : 3;

      return (
        <g key={`eye_${ex}`}>
          {/* Heavy upper eyelid for sleepy/manhwa eyes */}
          {eyeSpec.heavyLid && (
            <rect x={ex} y="16" width="4" height="1" fill={skinShade} />
          )}

          {/* Upper lash line */}
          <rect
            x={eyeSpec.shape === "almond" ? ex + (isRight ? 0 : 1) : ex}
            y={eyeTopY}
            width={eyeSpec.lash === "thick" ? 5 : 4}
            height="1"
            fill={ink}
          />

          {/* Winged or droopy outer pixel */}
          {eyeSpec.lash === "winged" && (
            <rect
              x={isRight ? ex + 4 : ex - 1}
              y={eyeTopY - 1}
              width="1"
              height="1"
              fill={ink}
            />
          )}
          {eyeSpec.shape === "puppy" && (
            <rect
              x={isRight ? ex + 4 : ex - 1}
              y={eyeTopY + 1}
              width="1"
              height="1"
              fill={ink}
            />
          )}

          {/* Sclera */}
          <rect x={ex} y={eyeTopY + 1} width="4" height={eyeHeight} fill="#FFFFFF" />

          {/* Iris */}
          <rect
            x={ex + (isRight ? 0 : 1)}
            y={eyeTopY + 1}
            width="3"
            height={eyeHeight}
            fill={iris}
          />
          <rect
            x={ex + (isRight ? 1 : 1)}
            y={eyeTopY + (eyeHeight >= 3 ? 2 : 1)}
            width="2"
            height={eyeHeight >= 3 ? 2 : 1}
            fill={irisDark}
          />

          {/* Lower lash / aegyosal */}
          {eyeSpec.lash === "lower" && (
            <rect x={ex + 1} y={eyeTopY + eyeHeight + 1} width="2" height="1" fill={ink} opacity="0.55" />
          )}
          {eyeSpec.aegyosal && (
            <rect x={ex} y="21" width="4" height="1" fill={skinShade} opacity="0.7" />
          )}

          {/* Shine highlights */}
          <rect
            x={ex + (isRight ? 0 : 1)}
            y={eyeTopY + 1}
            width="1"
            height="1"
            fill="#FFFFFF"
          />
          {(eyeSpec.shine === "double" || eyeSpec.shine === "moist") && (
            <rect
              x={ex + 2}
              y={eyeTopY + eyeHeight}
              width="1"
              height="1"
              fill={eyeSpec.shine === "moist" ? irisLight : "#FFFFFF"}
            />
          )}
          {eyeSpec.shine === "star" && (
            <>
              <rect x={ex + 2} y={eyeTopY + 1} width="1" height="1" fill="#FFF2A6" />
              <rect x={ex + 1} y={eyeTopY + 2} width="1" height="1" fill="#FFFFFF" />
            </>
          )}
          {eyeSpec.shine === "heart" && (
            <rect x={ex + 2} y={eyeTopY + 2} width="1" height="1" fill="#FF9EC4" />
          )}
        </g>
      );
    };

    const renderBlush = () => {
      if (blushStyle === "ninguno" && !isMoodBlushing) return null;
      const effectiveOpacity = isMoodBlushing
        ? 0.92
        : blushStyle === "intenso"
          ? 0.85
          : 0.55;

      return (
        <g>
          <rect x="10" y="21" width="3" height="2" fill={blushColor} opacity={effectiveOpacity} />
          <rect x="23" y="21" width="3" height="2" fill={blushColor} opacity={effectiveOpacity} />
          {blushStyle === "intenso" && (
            <>
              <rect x="11" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.65" />
              <rect x="24" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.65" />
            </>
          )}
          {blushStyle === "pecas" && (
            <>
              <rect x="10" y="21" width="1" height="1" fill="#B57564" opacity="0.85" />
              <rect x="12" y="22" width="1" height="1" fill="#B57564" opacity="0.85" />
              <rect x="23" y="22" width="1" height="1" fill="#B57564" opacity="0.85" />
              <rect x="25" y="21" width="1" height="1" fill="#B57564" opacity="0.85" />
            </>
          )}
          {blushStyle === "corazon" && (
            <>
              <rect x="10" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.9" />
              <rect x="25" y="21" width="1" height="1" fill="#FFFFFF" opacity="0.9" />
            </>
          )}
        </g>
      );
    };

    const renderFaceMark = () => {
      switch (faceMark) {
        case "curita":
          return (
            <g>
              <rect x="22" y="21" width="4" height="2" fill="#E8C9A8" />
              <rect x="23" y="21" width="2" height="2" fill="#FAF0E4" />
            </g>
          );
        case "lunar":
          return <rect x="11" y="21" width="1" height="1" fill={ink} />;
        case "pecas_nariz":
          return (
            <g>
              <rect x="14" y="21" width="1" height="1" fill="#B57564" />
              <rect x="17" y="20" width="2" height="1" fill="#B57564" />
              <rect x="21" y="21" width="1" height="1" fill="#B57564" />
            </g>
          );
        case "estrellita":
          return <rect x="23" y="21" width="1" height="1" fill="#F6C453" />;
        case "corazoncito":
          return <rect x="23" y="21" width="2" height="1" fill="#E14D7A" />;
        case "ninguno":
        default:
          return null;
      }
    };

    const renderMouth = () => {
      if (activeMood === "molesto") {
        return (
          <g>
            <rect x="16" y="22" width="4" height="1" fill={ink} />
            <rect x="17" y="21" width="2" height="1" fill={skinShade} />
          </g>
        );
      }

      const lip = mouthSpec.lipColor;
      const w = mouthSpec.wide ? 4 : 2;
      const mx = mouthSpec.wide ? 16 : 17;

      switch (mouthSpec.shape) {
        case "smile":
          return (
            <g>
              <rect x={mx} y="22" width={w} height="1" fill={lip} />
              <rect x={mx - 1} y="21" width="1" height="1" fill={ink} opacity="0.45" />
              <rect x={mx + w} y="21" width="1" height="1" fill={ink} opacity="0.45" />
              {mouthSpec.gloss && <rect x={mx} y="22" width="1" height="1" fill="#FFFFFF" opacity="0.7" />}
            </g>
          );
        case "smirk":
          return (
            <g>
              <rect x="16" y="22" width={w + 1} height="1" fill={lip} />
              <rect x={16 + w + 1} y="21" width="1" height="1" fill={ink} opacity="0.65" />
            </g>
          );
        case "cat":
          return (
            <g>
              <rect x="16" y="22" width="1" height="1" fill={lip} />
              <rect x="17" y="23" width="1" height="1" fill={lip} />
              <rect x="18" y="22" width="1" height="1" fill={lip} />
              <rect x="19" y="23" width="1" height="1" fill={lip} />
              <rect x="20" y="22" width="1" height="1" fill={lip} />
            </g>
          );
        case "open_happy":
          return (
            <g>
              <rect x="16" y="21" width="4" height="1" fill={ink} opacity="0.6" />
              <rect x="16" y="22" width="4" height="2" fill={lip} />
              <rect x="17" y="22" width="2" height="1" fill="#FFFFFF" />
            </g>
          );
        case "open_soft":
          return (
            <g>
              <rect x="17" y="22" width="2" height="2" fill={lip} />
              <rect x="17" y="22" width="1" height="1" fill="#3D1F28" opacity="0.45" />
            </g>
          );
        case "fang":
          return (
            <g>
              <rect x="16" y="22" width="4" height="1" fill={lip} />
              <rect x="19" y="23" width="1" height="1" fill="#FFFFFF" />
              <rect x="20" y="21" width="1" height="1" fill={ink} opacity="0.6" />
            </g>
          );
        case "heart":
        case "rose":
          return (
            <g>
              <rect x={mx} y="22" width={w} height="1" fill={lip} />
              <rect x="17" y="23" width="2" height="1" fill={lip} />
              {mouthSpec.gloss && <rect x="17" y="22" width="1" height="1" fill="#FFFFFF" opacity="0.8" />}
            </g>
          );
        case "pout":
          return (
            <g>
              <rect x="17" y="21" width="2" height="1" fill={lip} />
              <rect x="16" y="22" width="4" height="1" fill={darkenHex(lip, 20)} />
            </g>
          );
        case "bite":
          return (
            <g>
              <rect x="16" y="22" width="4" height="1" fill={lip} />
              <rect x="18" y="22" width="1" height="1" fill="#FFFFFF" />
              <rect x="17" y="23" width="2" height="1" fill="#F48FB1" />
            </g>
          );
        case "wavy":
          return (
            <g>
              <rect x="16" y="22" width="1" height="1" fill={lip} />
              <rect x="17" y="21" width="1" height="1" fill={lip} />
              <rect x="18" y="22" width="1" height="1" fill={lip} />
              <rect x="19" y="21" width="1" height="1" fill={lip} />
            </g>
          );
        case "whistle":
          return <rect x="18" y="22" width="1" height="1" fill={lip} />;
        case "straight":
          return <rect x={mx} y="22" width={w + 1} height="1" fill={lip} />;
        case "dot":
        default:
          return <rect x="17" y="22" width="2" height="1" fill={lip} />;
      }
    };

    return (
      <g>
        {/* Eyebrows */}
        {activeMood === "molesto" || activeMood === "celoso" ? (
          <>
            <rect x="11" y="15" width="3" height="1" fill={hairDark} />
            <rect x="22" y="15" width="3" height="1" fill={hairDark} />
            <rect x="13" y="16" width="2" height="1" fill={hairDark} />
            <rect x="21" y="16" width="2" height="1" fill={hairDark} />
          </>
        ) : (
          <>
            <rect x="11" y="15" width="4" height="1" fill={hairDark} />
            <rect x="21" y="15" width="4" height="1" fill={hairDark} />
          </>
        )}

        {drawEye(11, false)}
        {drawEye(21, true)}
        {renderBlush()}
        {renderFaceMark()}
        {renderMouth()}
      </g>
    );
  };

  // =====================================================================
  // 4. OUTFITS & BODY (54 outfits — baggy/oversize/wide legs + fitted)
  // =====================================================================
  const renderOutfitAndBody = () => {
    const o = outfitSpec;
    const isWideBottom =
      o.silhouette === "baggy_street" ||
      o.silhouette === "wide_cargo" ||
      o.silhouette === "peplum_baggy" ||
      o.silhouette === "hoodie_wide" ||
      o.silhouette === "oversized_open";
    const isOversizedTop =
      o.silhouette === "baggy_street" ||
      o.silhouette === "oversized_open" ||
      o.silhouette === "hoodie_wide" ||
      o.silhouette === "wide_cargo" ||
      o.silhouette === "trench_wide";

    const sleeveColor =
      o.id === "chaqueta_varsity" ? o.inner : o.silhouette === "vest_layer" || o.silhouette === "jersey" ? o.inner : o.top;

    return (
      <g>
        {/* Neck */}
        <rect x="16" y="25" width="4" height="2" fill={skinShade} />

        {/* Torso outline & fill (wider when oversized) */}
        <rect
          x={isOversizedTop ? 10 : 11}
          y="26"
          width={isOversizedTop ? 16 : 14}
          height="11"
          fill={ink}
        />
        <rect
          x={isOversizedTop ? 11 : 12}
          y="27"
          width={isOversizedTop ? 14 : 12}
          height="9"
          fill={o.top}
        />
        <rect
          x={isOversizedTop ? 11 : 12}
          y="34"
          width={isOversizedTop ? 14 : 12}
          height="2"
          fill={o.topShade}
        />

        {/* Open Shirt / Hoodie / Jacket Inner Tee */}
        {(o.silhouette === "oversized_open" ||
          o.silhouette === "wide_cargo" ||
          o.silhouette === "baggy_street") && (
          <rect x="15" y="27" width="6" height="8" fill={o.inner} />
        )}

        {/* Formal Suit V-Collar, Tie & Lapel Pin */}
        {o.silhouette === "formal_suit" && (
          <>
            <rect x="15" y="27" width="6" height="2" fill={o.inner} />
            <rect x="16" y="29" width="4" height="1" fill={o.inner} />
            <rect x="17" y="28" width="2" height="5" fill={o.accent} />
            {o.id === "boy_suit_noir_pin" ? (
              <>
                <rect x="17" y="28" width="2" height="4" fill="#18181D" />
                <rect x="19" y="29" width="1" height="1" fill="#C93B4B" />
                <rect x="17" y="33" width="2" height="1" fill="#FFFFFF" />
              </>
            ) : (
              <rect x="17" y="33" width="2" height="1" fill={o.accent} />
            )}
          </>
        )}

        {/* Cardigan toggle buttons for winter & cream cardigans */}
        {o.silhouette === "cardigan_skirt" && (
          <>
            <rect x="17" y="29" width="2" height="1" fill={o.accent} />
            <rect x="17" y="31" width="2" height="1" fill={o.accent} />
            <rect x="17" y="33" width="2" height="1" fill={o.accent} />
          </>
        )}

        {/* Vest V-neck */}
        {o.silhouette === "vest_layer" && (
          <>
            <rect x="15" y="27" width="6" height="2" fill={o.inner} />
            <rect x="16" y="29" width="4" height="1" fill={o.inner} />
            <rect x="17" y="30" width="2" height="1" fill={o.inner} />
            <rect x="15" y="27" width="1" height="2" fill={o.accent} />
            <rect x="20" y="27" width="1" height="2" fill={o.accent} />
            <rect x="16" y="29" width="1" height="1" fill={o.accent} />
            <rect x="19" y="29" width="1" height="1" fill={o.accent} />
          </>
        )}

        {/* Basketball Jersey #06 with readable pixel digits */}
        {o.silhouette === "jersey" && (
          <>
            <rect x="15" y="27" width="6" height="2" fill={o.inner} />
            <rect x="14" y="27" width="8" height="1" fill={o.accent} />
            {o.jerseyNumber && (
              <>
                {/* Pixel digit 0 */}
                <rect x="14" y="30" width="3" height="4" fill="#FFFFFF" />
                <rect x="15" y="31" width="1" height="2" fill={o.top} />
                {/* Pixel digit 6 */}
                <rect x="19" y="30" width="3" height="4" fill="#FFFFFF" />
                <rect x="21" y="31" width="1" height="1" fill={o.top} />
                <rect x="20" y="32" width="1" height="1" fill={o.top} />
              </>
            )}
          </>
        )}

        {/* Varsity stripe accents */}
        {o.id === "chaqueta_varsity" && (
          <>
            <rect x="11" y="27" width="2" height="8" fill={o.inner} />
            <rect x="23" y="27" width="2" height="8" fill={o.inner} />
            <rect x="14" y="29" width="2" height="2" fill={o.accent} />
          </>
        )}

        {/* Plaid Coat / Trench details */}
        {o.silhouette === "trench_wide" && (
          <>
            <rect x="15" y="27" width="6" height="8" fill={o.inner} />
            <rect x="14" y="27" width="1" height="8" fill={o.topShade} />
            <rect x="21" y="27" width="1" height="8" fill={o.topShade} />
          </>
        )}

        {/* Hoodie strings & pocket */}
        {o.silhouette === "hoodie_wide" && (
          <>
            <rect x="14" y="27" width="8" height="2" fill={o.topShade} />
            <rect x="16" y="29" width="1" height="3" fill="#9CA3AF" />
            <rect x="19" y="29" width="1" height="3" fill="#9CA3AF" />
            <rect x="14" y="32" width="8" height="3" fill={o.topShade} />
          </>
        )}

        {/* Sailor collar */}
        {o.silhouette === "sailor" && (
          <>
            <rect x="13" y="27" width="10" height="3" fill={o.inner} />
            <rect x="14" y="28" width="8" height="1" fill="#FFFFFF" />
            <rect x="17" y="29" width="2" height="2" fill={o.accent} />
          </>
        )}

        {/* Peter-pan / Coquette collar */}
        {(o.silhouette === "peplum_baggy" || o.silhouette === "coquette_lace") && (
          <>
            <rect x="14" y="27" width="3" height="2" fill={o.inner} />
            <rect x="19" y="27" width="3" height="2" fill={o.inner} />
            <rect x="17" y="28" width="2" height="1" fill={o.accent} />
          </>
        )}

        {/* Tie (non-formal shirts like ice open tie & preppy) */}
        {o.hasTie && o.silhouette !== "formal_suit" && (
          <>
            <rect x="17" y="28" width="2" height="5" fill={o.accent} />
            <rect x="16" y="27" width="4" height="1" fill="#FFFFFF" />
          </>
        )}

        {/* Belt */}
        {o.hasBelt && (
          <>
            <rect x="12" y="35" width="12" height="1" fill="#231F28" />
            <rect x="17" y="35" width="2" height="1" fill="#F6C453" />
          </>
        )}

        {/* Scarf */}
        {o.hasScarf && (
          <>
            <rect x="12" y="26" width="12" height="3" fill={o.accent} />
            <rect x="13" y="27" width="10" height="1" fill="#FFFDFB" opacity="0.45" />
            <rect x="17" y="29" width="3" height="5" fill={o.accent} />
          </>
        )}

        {/* Legs / Skirt (with wide baggy trousers & plaid pleated skirts) */}
        {o.isSkirt ? (
          <>
            <rect x="11" y="36" width="14" height="4" fill={ink} />
            <rect x="12" y="36" width="12" height="3" fill={o.bottom} />
            {o.silhouette === "pleated_plaid" && (
              <>
                <rect x="13" y="37" width="2" height="2" fill={darkenHex(o.bottom, 25)} />
                <rect x="17" y="37" width="2" height="2" fill={darkenHex(o.bottom, 25)} />
                <rect x="21" y="37" width="2" height="2" fill={darkenHex(o.bottom, 25)} />
              </>
            )}
            {o.silhouette === "coquette_lace" && (
              <>
                <rect x="12" y="38" width="2" height="1" fill="#FFFFFF" />
                <rect x="16" y="38" width="2" height="1" fill="#FFFFFF" />
                <rect x="20" y="38" width="2" height="1" fill="#FFFFFF" />
              </>
            )}
            <rect x="13" y="39" width="3" height="3" fill={skin} />
            <rect x="20" y="39" width="3" height="3" fill={skin} />
            {o.ribbonSocks && (
              <>
                <rect x="13" y="40" width="3" height="2" fill="#FFFFFF" />
                <rect x="20" y="40" width="3" height="2" fill="#FFFFFF" />
                <rect x="12" y="40" width="2" height="1" fill="#F49FB8" />
                <rect x="22" y="40" width="2" height="1" fill="#F49FB8" />
              </>
            )}
          </>
        ) : isWideBottom ? (
          <>
            {/* Baggy / Wide Cargo / Wide Denim */}
            <rect x="10" y="36" width="7" height="6" fill={ink} />
            <rect x="19" y="36" width="7" height="6" fill={ink} />
            <rect x="11" y="36" width="5" height="5" fill={o.bottom} />
            <rect x="20" y="36" width="5" height="5" fill={o.bottom} />
            {o.silhouette === "wide_cargo" && (
              <>
                <rect x="10" y="38" width="2" height="2" fill={darkenHex(o.bottom, 18)} />
                <rect x="24" y="38" width="2" height="2" fill={darkenHex(o.bottom, 18)} />
              </>
            )}
            {o.id === "hoodie_urbano" && (
              <>
                <rect x="11" y="36" width="1" height="5" fill="#FFFFFF" opacity="0.85" />
                <rect x="24" y="36" width="1" height="5" fill="#FFFFFF" opacity="0.85" />
              </>
            )}
            {o.id === "boy_hoodie_plaid" && (
              <>
                <rect x="13" y="36" width="1" height="5" fill={o.accent} opacity="0.55" />
                <rect x="22" y="36" width="1" height="5" fill={o.accent} opacity="0.55" />
                <rect x="11" y="39" width="5" height="1" fill={o.accent} opacity="0.55" />
                <rect x="20" y="39" width="5" height="1" fill={o.accent} opacity="0.55" />
              </>
            )}
          </>
        ) : (
          <>
            <rect x="12" y="36" width="5" height="6" fill={ink} />
            <rect x="19" y="36" width="5" height="6" fill={ink} />
            <rect x="13" y="36" width="3" height="5" fill={o.bottom} />
            <rect x="20" y="36" width="3" height="5" fill={o.bottom} />
          </>
        )}

        {/* Shoes */}
        <rect x="12" y="42" width="5" height="3" fill={ink} />
        <rect x="19" y="42" width="5" height="3" fill={ink} />
        <rect x="13" y="42" width="3" height="2" fill={o.shoe} />
        <rect x="20" y="42" width="3" height="2" fill={o.shoe} />
        {o.duckSlippers && (
          <>
            <rect x="13" y="42" width="1" height="1" fill={ink} />
            <rect x="22" y="42" width="1" height="1" fill={ink} />
            <rect x="14" y="43" width="2" height="1" fill="#F5B82E" />
            <rect x="20" y="43" width="2" height="1" fill="#F5B82E" />
          </>
        )}

        {/* Arms & Poses (wider sleeves when oversized) */}
        {pose === "wave" ? (
          <>
            <rect x={isOversizedTop ? 8 : 9} y="27" width="3" height="7" fill={ink} />
            <rect x={isOversizedTop ? 9 : 10} y="28" width="2" height="5" fill={sleeveColor} />
            <rect x={isOversizedTop ? 9 : 10} y="33" width="2" height="2" fill={skin} />
            <rect x="25" y="21" width="3" height="7" fill={ink} />
            <rect x="25" y="22" width="2" height="5" fill={sleeveColor} />
            <rect x="25" y="20" width="3" height="2" fill={skin} />
          </>
        ) : pose === "finger_heart" ? (
          <>
            <rect x={isOversizedTop ? 8 : 9} y="27" width="3" height="7" fill={ink} />
            <rect x={isOversizedTop ? 9 : 10} y="28" width="2" height="5" fill={sleeveColor} />
            <rect x={isOversizedTop ? 9 : 10} y="33" width="2" height="2" fill={skin} />
            <rect x="24" y="26" width="4" height="5" fill={ink} />
            <rect x="24" y="27" width="3" height="3" fill={sleeveColor} />
            <rect x="26" y="25" width="2" height="2" fill={skin} />
            <rect x="25" y="21" width="1" height="1" fill="#E14D7A" />
            <rect x="27" y="21" width="1" height="1" fill="#E14D7A" />
            <rect x="25" y="22" width="3" height="1" fill="#E14D7A" />
            <rect x="26" y="23" width="1" height="1" fill="#E14D7A" />
          </>
        ) : pose === "toast" ? (
          <>
            <rect x={isOversizedTop ? 8 : 9} y="27" width="3" height="7" fill={ink} />
            <rect x={isOversizedTop ? 9 : 10} y="28" width="2" height="5" fill={sleeveColor} />
            <rect x={isOversizedTop ? 9 : 10} y="33" width="2" height="2" fill={skin} />
            <rect x="24" y="26" width="4" height="5" fill={ink} />
            <rect x="24" y="27" width="3" height="3" fill={sleeveColor} />
            <rect x="26" y="26" width="2" height="2" fill={skin} />
            <rect x="26" y="23" width="3" height="3" fill="#FFFDFB" />
            <rect x="27" y="24" width="2" height="1" fill="#C49A76" />
          </>
        ) : (
          <>
            <rect x={isOversizedTop ? 8 : 9} y="27" width={isOversizedTop ? 4 : 3} height="8" fill={ink} />
            <rect x={isOversizedTop ? 9 : 10} y="28" width={isOversizedTop ? 3 : 2} height="5" fill={sleeveColor} />
            <rect x={isOversizedTop ? 9 : 10} y="33" width="2" height="2" fill={skin} />
            <rect x={isOversizedTop ? 24 : 24} y="27" width={isOversizedTop ? 4 : 3} height="8" fill={ink} />
            <rect x="24" y="28" width={isOversizedTop ? 3 : 2} height="5" fill={sleeveColor} />
            <rect x="25" y="33" width="2" height="2" fill={skin} />
          </>
        )}
      </g>
    );
  };

  // =====================================================================
  // 5. 20 ACCESSORIES (including cap, cross earring, bunny, sprout, etc.)
  // =====================================================================
  const renderAccessory = () => {
    switch (appearance.accessory) {
      case "round_glasses":
        return (
          <g>
            <rect x="10" y="17" width="6" height="5" fill="none" stroke="#5A4038" strokeWidth="1" />
            <rect x="20" y="17" width="6" height="5" fill="none" stroke="#5A4038" strokeWidth="1" />
            <rect x="16" y="19" width="4" height="1" fill="#5A4038" />
          </g>
        );
      case "lentes_rect":
        return (
          <g>
            <rect x="10" y="18" width="6" height="3" fill="none" stroke="#231F28" strokeWidth="1" />
            <rect x="20" y="18" width="6" height="3" fill="none" stroke="#231F28" strokeWidth="1" />
            <rect x="16" y="19" width="4" height="1" fill="#231F28" />
          </g>
        );
      case "gorra_negra":
        return (
          <g>
            <rect x="8" y="3" width="20" height="7" fill={ink} />
            <rect x="9" y="4" width="18" height="5" fill="#2A2B32" />
            <rect x="7" y="9" width="22" height="2" fill="#1C1D22" />
            <rect x="15" y="6" width="5" height="1" fill="#E5E7EB" />
            <rect x="26" y="9" width="2" height="1" fill="#FFFFFF" />
          </g>
        );
      case "arete_cruz":
        return (
          <g>
            <rect x="26" y="21" width="1" height="4" fill="#1D1B22" />
            <rect x="25" y="22" width="3" height="1" fill="#1D1B22" />
          </g>
        );
      case "aretes_plata":
        return (
          <g>
            <rect x="8" y="21" width="2" height="2" fill="#E5E7EB" />
            <rect x="26" y="21" width="2" height="2" fill="#E5E7EB" />
          </g>
        );
      case "cherry_ribbon":
        return (
          <g>
            <rect x="23" y="8" width="4" height="2" fill="#E14D7A" />
            <rect x="24" y="7" width="2" height="4" fill="#F79BB7" />
          </g>
        );
      case "broche_corazon":
        return (
          <g>
            <rect x="10" y="9" width="1" height="1" fill="#F472B6" />
            <rect x="12" y="9" width="1" height="1" fill="#F472B6" />
            <rect x="10" y="10" width="3" height="1" fill="#F472B6" />
            <rect x="11" y="11" width="1" height="1" fill="#F472B6" />
          </g>
        );
      case "broche_estrella":
      case "star_pin":
        return (
          <g>
            <rect x="11" y="8" width="3" height="1" fill="#F6C453" />
            <rect x="12" y="7" width="1" height="3" fill="#F6C453" />
            <rect x="10" y="8" width="1" height="1" fill="#FFFFFF" />
          </g>
        );
      case "pastel_headphones":
        return (
          <g>
            <rect x="9" y="4" width="18" height="2" fill="#FFFFFF" />
            <rect x="7" y="13" width="3" height="7" fill={ink} />
            <rect x="8" y="14" width="2" height="5" fill="#F3F4F6" />
            <rect x="26" y="13" width="3" height="7" fill={ink} />
            <rect x="26" y="14" width="2" height="5" fill="#F3F4F6" />
          </g>
        );
      case "artist_beret":
        return (
          <g>
            <rect x="8" y="3" width="20" height="6" fill={ink} />
            <rect x="9" y="4" width="18" height="4" fill="#E87A96" />
            <rect x="17" y="2" width="2" height="1" fill={ink} />
          </g>
        );
      case "boina_negra":
        return (
          <g>
            <rect x="8" y="3" width="20" height="6" fill={ink} />
            <rect x="9" y="4" width="18" height="4" fill="#2A262D" />
            <rect x="17" y="2" width="2" height="1" fill={ink} />
          </g>
        );
      case "boina_crema":
        return (
          <g>
            <rect x="8" y="3" width="20" height="6" fill="#C9C0AA" />
            <rect x="9" y="4" width="18" height="4" fill="#F6F2E4" />
            <rect x="17" y="2" width="2" height="1" fill="#C9C0AA" />
          </g>
        );
      case "diadema_perlas":
        return (
          <g>
            <rect x="10" y="7" width="16" height="2" fill="#F4F4F6" />
            <rect x="8" y="9" width="2" height="6" fill="#F4F4F6" />
            <rect x="26" y="9" width="2" height="6" fill="#F4F4F6" />
            <rect x="8" y="20" width="1" height="1" fill="#FFFFFF" />
            <rect x="27" y="20" width="1" height="1" fill="#FFFFFF" />
          </g>
        );
      case "bufanda_otono":
        return (
          <g>
            <rect x="12" y="25" width="12" height="3" fill="#C9B28B" />
            <rect x="16" y="28" width="3" height="6" fill="#B59B72" />
          </g>
        );
      case "choker_negro":
        return (
          <g>
            <rect x="15" y="25" width="6" height="1" fill="#1F1D24" />
            <rect x="17" y="26" width="2" height="1" fill="#D1D5DB" />
          </g>
        );
      case "osito_peluche":
        return (
          <g>
            <rect x="25" y="33" width="5" height="6" fill="#7A5A46" />
            <rect x="26" y="34" width="3" height="2" fill="#9E7B63" />
            <rect x="25" y="32" width="1" height="1" fill="#7A5A46" />
            <rect x="29" y="32" width="1" height="1" fill="#7A5A46" />
            <rect x="27" y="36" width="2" height="2" fill="#E3CCA8" />
            <rect x="26" y="39" width="1" height="2" fill="#7A5A46" />
            <rect x="29" y="39" width="1" height="2" fill="#7A5A46" />
          </g>
        );
      case "brote_verde":
        return (
          <g>
            {/* Little green sprout floating beside & teddy bear */}
            <rect x="4" y="35" width="1" height="4" fill="#6AA84F" />
            <rect x="2" y="34" width="2" height="2" fill="#8FCE6B" />
            <rect x="5" y="34" width="2" height="2" fill="#8FCE6B" />
            <rect x="25" y="33" width="5" height="6" fill="#7A5A46" />
            <rect x="26" y="34" width="3" height="2" fill="#9E7B63" />
            <rect x="25" y="32" width="1" height="1" fill="#7A5A46" />
            <rect x="29" y="32" width="1" height="1" fill="#7A5A46" />
            <rect x="27" y="36" width="2" height="2" fill="#E3CCA8" />
            <rect x="26" y="39" width="1" height="2" fill="#7A5A46" />
            <rect x="29" y="39" width="1" height="2" fill="#7A5A46" />
          </g>
        );
      case "conejito_blanco":
        return (
          <g>
            {/* White bunny plush held on side (matching ref image #6!) */}
            <rect x="26" y="31" width="1" height="3" fill="#E5E7EB" />
            <rect x="28" y="31" width="1" height="3" fill="#F9A8D4" />
            <rect x="25" y="34" width="5" height="6" fill="#FFFFFF" />
            <rect x="26" y="35" width="1" height="1" fill="#231F28" />
            <rect x="28" y="35" width="1" height="1" fill="#231F28" />
            <rect x="27" y="37" width="2" height="2" fill="#F9A8D4" />
            <rect x="26" y="40" width="1" height="2" fill="#E5E7EB" />
            <rect x="29" y="40" width="1" height="2" fill="#E5E7EB" />
          </g>
        );
      case "none":
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_MAP[size]} ${
        floating ? "animate-chibi-idle" : ""
      } ${className}`}
    >
      {showMoodAura && activeMood === "enamorado" && (
        <div className="absolute -top-2 right-2 pointer-events-none text-rose-500 font-display text-lg font-bold">
          ♥
        </div>
      )}
      {showMoodAura && activeMood === "molesto" && (
        <div className="absolute -top-1 right-3 pointer-events-none text-red-500 font-display text-base font-bold">
          💢
        </div>
      )}

      <svg
        viewBox="-3 -2 42 52"
        shapeRendering="crispEdges"
        className={`w-full h-full drop-shadow-[0_8px_12px_rgba(35,31,40,0.18)] ${
          facing === "left" ? "-scale-x-100" : ""
        }`}
        aria-label="Personaje chibi pixel art"
      >
        <ellipse cx="18" cy="45.5" rx="8.5" ry="1.8" fill="#231F28" fillOpacity="0.16" />

        {renderBackHair()}
        {renderOutfitAndBody()}

        {/* Ears */}
        {px(8, 17, 2, 3, ink)}
        {px(9, 18, 1, 2, skin)}
        {px(26, 17, 2, 3, ink)}
        {px(26, 18, 1, 2, skin)}

        {/* Head */}
        {px(10, 9, 16, 16, ink)}
        {px(9, 12, 18, 11, ink)}
        {px(11, 10, 14, 14, skin)}
        {px(10, 13, 16, 9, skin)}

        {renderEyesAndFace()}
        {renderFrontHair()}
        {renderAccessory()}
      </svg>
    </div>
  );
};
