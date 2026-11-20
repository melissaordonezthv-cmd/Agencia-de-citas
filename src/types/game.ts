export type EmotionalState =
  | "encantado"
  | "timido"
  | "jugueton"
  | "pensativo"
  | "celoso"
  | "molesto"
  | "enamorado";

export type ChibiPose =
  | "idle"
  | "wave"
  | "finger_heart"
  | "wink_pose"
  | "shy_hold"
  | "toast";

export type HairStyleId = string;
export type OutfitId = string;
export type EyeStyleId = string;
export type MouthStyleId = string;
export type BlushStyleId = "ninguno" | "suave" | "intenso" | "pecas" | "corazon";
export type FaceMarkId =
  | "ninguno"
  | "curita"
  | "lunar"
  | "pecas_nariz"
  | "estrellita"
  | "corazoncito";
export type AccessoryId = string;

export type PlayerGender = "mujer" | "hombre";
export type PlayerPronoun = "ella" | "él";
export type SexualOrientation = "hetero" | "gay" | "lesbiana" | "libre";
export type DatePreference = "chicas" | "chicos" | "mixto";
export type DateDifficulty = "facil" | "media" | "dificil";
export type DateStatus = "active" | "expired" | "broken";
export type GiftTier = "lujoso" | "lindo" | "raro" | "tonto" | "desagradable";

export interface ChibiAppearance {
  skinTone: string;
  hairStyle: HairStyleId;
  hairColor: string;
  eyeStyle: EyeStyleId;
  eyeColor: string;
  mouthStyle?: MouthStyleId;
  blushStyle?: BlushStyleId;
  blushColor?: string;
  faceMark?: FaceMarkId;
  outfit: OutfitId;
  accessory: AccessoryId;
  baseMood: EmotionalState;
}

export interface DialogueOption {
  text: string;
  tone: "dulce" | "coqueto" | "sincero" | "broma" | "atrevido";
  hint: string;
}

export interface DialogueEntry {
  id: string;
  speaker: "player" | "character" | "narrator";
  text: string;
  note?: string;
  pursuitAction?: string;
  timestamp: string;
}

export interface DateInvitePayload {
  location: string;
  timeLabel: string;
  accepted?: boolean;
}

export interface ReceivedGiftRecord {
  id: string;
  name: string;
  tier: GiftTier;
  description: string;
  fromCharacterId: string;
  fromCharacterName: string;
  receivedAt: string;
}

export interface PhoneMessage {
  id: string;
  sender: "player" | "character";
  text: string;
  timestamp: string;
  dateInvite?: DateInvitePayload;
  receivedGiftName?: string;
  receivedGiftTier?: GiftTier;
}

export interface SocialPost {
  id: string;
  handle: string;
  location: string;
  caption: string;
  likes: number;
  timeAgo: string;
  moodTheme: string;
  clueText: string;
  imageUrl?: string;
}

export interface SpecialInteraction {
  id: string;
  minCompatibility: number;
  title: string;
  description: string;
  promptText: string;
}

export interface CharacterProfile {
  id: string;
  order: number;
  gender: "chico" | "chica";
  country: string;
  difficulty: DateDifficulty;
  busyProbability: number;
  personalityTrait: string;
  isToxicOrDangerous?: boolean;
  seductionStyle?: string;
  occupation: string;
  currentLocation: string;
  name: string;
  koreanName: string;
  handle: string;
  role: string;
  tagline: string;
  personality: string;
  speechStyle: string;
  textingStyle: string;
  mbti: string;
  birthday: string;
  favoriteFood: string;
  likes: string[];
  dislikes: string[];
  favoriteGiftIds: string[];
  rewardTokens: number;
  accentColor: string;
  appearance: ChibiAppearance;
  openingLine: string;
  openingNote: string;
  initialOptions: DialogueOption[];
  chapters: {
    chapter: number;
    minCompatibility: number;
    title: string;
    scenarioName: string;
    backdropUrl: string;
    summary: string;
  }[];
  specialInteractions: SpecialInteraction[];
  socialBio: string;
  followers: string;
  socialPosts: SocialPost[];
  initialSecrets: string[];
}

export interface CharacterProgress {
  unlocked: boolean;
  conquered: boolean;
  skipped?: boolean;
  compatibility: number;
  playerAttraction: number;
  npcConfessing?: boolean;
  patience: number;
  mood: EmotionalState;
  contactAdded: boolean;
  isTimedDate: boolean;
  dateSecondsLeft: number;
  dateStatus: DateStatus;
  claimedMilestones: number[];
  discoveredSecrets: string[];
  usedSpecialIds: string[];
  dialogueHistory: DialogueEntry[];
  currentOptions: DialogueOption[];
  phoneHistory: PhoneMessage[];
  phoneSuggestions: string[];
  breakupCount: number;
}

export interface GiftItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  baseAffinity: number;
  color: string;
  emojiLabel: string;
}

export interface WardrobeItem {
  id: string;
  category: "outfit" | "hair" | "accessory" | "eye" | "mouth" | "blush";
  section?: "chicas" | "chicos" | "unisex";
  value: string;
  name: string;
  price: number;
  charmNote: string;
  attractiveness: number;
}

export interface RandomEventChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  outcomeText: string;
  affectionDelta: number;
  patienceDelta: number;
  resultingMood: EmotionalState;
}

export interface RandomEvent {
  id: string;
  type: "positive" | "negative";
  title: string;
  description: string;
  rewardGiftId?: string;
  affectionDelta?: number;
  patienceDelta?: number;
  resultingMood?: EmotionalState;
  choices?: RandomEventChoice[];
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardTokens: number;
  rewardGiftId?: string;
  rewardWardrobeId?: string;
  rewardLabel: string;
}

export interface PhotoRecord {
  id: string;
  characterId: string;
  characterName: string;
  characterSnapshot?: ChibiAppearance;
  backdropName: string;
  backdropUrl: string;
  playerPose: ChibiPose;
  characterPose: ChibiPose;
  playerMood: EmotionalState;
  characterMood: EmotionalState;
  caption: string;
  takenAt: string;
  playerSnapshot: ChibiAppearance;
}

export interface ConquestCelebrationData {
  conqueredCharacterId: string;
  conqueredCharacterName: string;
  rewardTokens: number;
  conqueredByNpcProposal?: boolean;
  nextCharacterId?: string;
  nextCharacterName?: string;
}

export type ActiveRoom = "office" | "bedroom";
export type ActiveModal =
  | null
  | "camera"
  | "inventory"
  | "phone"
  | "notebook"
  | "roster"
  | "achievements";

export interface GameSaveState {
  playerName: string;
  playerGender: PlayerGender;
  playerPronoun: PlayerPronoun;
  orientation: SexualOrientation;
  datePreference: DatePreference;
  tokens: number;
  activeRoom: ActiveRoom;
  activeCharacterId: string;
  favoriteCharacterId: string | null;
  homePartnerId: string | null;
  playerAppearance: ChibiAppearance;
  unlockedWardrobeIds: string[];
  inventory: Record<string, number>;
  receivedGifts: ReceivedGiftRecord[];
  characterProgress: Record<string, CharacterProgress>;
  photos: PhotoRecord[];
  soundEnabled: boolean;
  unlockedAchievementIds: string[];
  totalRelationshipsCompleted: number;
  resolvedNegativeEvents: number;
  totalGiftsGiven: number;
  totalPhoneMessages: number;
  activeRandomEvent: RandomEvent | null;
}
