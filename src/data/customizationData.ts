import { BlushStyleId, FaceMarkId, WardrobeItem } from "../types/game";

export interface HairSpec {
  id: string;
  name: string;
  section: "chicas" | "chicos";
  price: number;
  attractiveness: number;
  charmNote: string;
  fluffy: boolean;
  crown: "classic" | "fluffy_cloud" | "high_volume" | "sleek" | "spiky" | "braided_crown";
  bangs:
    | "comma"
    | "curtain_64"
    | "straight_thick"
    | "messy_spiky"
    | "hime"
    | "side_sweep"
    | "wavy_part"
    | "wispy_air"
    | "braids_front";
  back:
    | "short_taper"
    | "mullet"
    | "fluffy_bob"
    | "flipped_bob"
    | "wavy_shoulder"
    | "long_waves"
    | "long_straight"
    | "side_ponytail"
    | "twin_tails"
    | "twin_buns"
    | "high_bun"
    | "braided_locs"
    | "side_braid"
    | "shaggy_wolf";
  hairOrnament?: "pom_white" | "ribbon_pink" | "star_gold" | "none";
}

export interface OutfitSpec {
  id: string;
  name: string;
  section: "chicas" | "chicos";
  price: number;
  attractiveness: number;
  charmNote: string;
  silhouette:
    | "baggy_street"
    | "oversized_open"
    | "wide_cargo"
    | "formal_suit"
    | "vest_layer"
    | "jersey"
    | "hoodie_wide"
    | "cardigan_skirt"
    | "pleated_plaid"
    | "peplum_baggy"
    | "coquette_lace"
    | "sailor"
    | "hanbok"
    | "trench_wide";
  top: string;
  topShade: string;
  inner: string;
  bottom: string;
  shoe: string;
  accent: string;
  isSkirt?: boolean;
  hasTie?: boolean;
  hasScarf?: boolean;
  hasBelt?: boolean;
  ribbonSocks?: boolean;
  duckSlippers?: boolean;
  jerseyNumber?: boolean;
}

export interface EyeSpec {
  id: string;
  name: string;
  category: "dulces" | "intensos" | "coquetos" | "idolo";
  price: number;
  attractiveness: number;
  charmNote: string;
  shape: "round" | "almond" | "sharp" | "sleepy" | "cat" | "puppy" | "crescent" | "wide";
  lash: "soft" | "winged" | "thick" | "lower" | "minimal";
  shine: "single" | "double" | "star" | "heart" | "moist";
  aegyosal?: boolean;
  heavyLid?: boolean;
}

export interface MouthSpec {
  id: string;
  name: string;
  category: "dulces" | "coquetos" | "actitud" | "expresivos";
  price: number;
  attractiveness: number;
  charmNote: string;
  shape:
    | "dot"
    | "smile"
    | "smirk"
    | "cat"
    | "pout"
    | "open_happy"
    | "wavy"
    | "straight"
    | "fang"
    | "heart"
    | "rose"
    | "bite"
    | "whistle"
    | "open_soft";
  lipColor: string;
  wide?: boolean;
  gloss?: boolean;
}

export const SKIN_TONES = [
  { id: "porcelain", name: "Porcelana", hex: "#FDE7DC" },
  { id: "milk_ivory", name: "Marfil Claro", hex: "#FFF0E8" },
  { id: "peach", name: "Durazno", hex: "#FAD6C3" },
  { id: "warm_sand", name: "Arena Tibia", hex: "#F0C3A4" },
  { id: "honey", name: "Miel Dorada", hex: "#E3AD88" },
  { id: "caramel", name: "Caramelo", hex: "#C88A66" },
  { id: "cocoa", name: "Cacao Rico", hex: "#8A5643" },
  { id: "espresso_deep", name: "Ébano Cálido", hex: "#623B2D" },
];

export const HAIR_COLORS = [
  { id: "ink", name: "Negro Tinta", hex: "#282432" },
  { id: "charcoal", name: "Carbón Suave", hex: "#3A373E" },
  { id: "espresso", name: "Castaño Café", hex: "#5C4038" },
  { id: "chestnut", name: "Castaño Miel", hex: "#7A523F" },
  { id: "caramel_copper", name: "Cobrizo", hex: "#A86444" },
  { id: "burgundy", name: "Vino Cereza", hex: "#6E2934" },
  { id: "butter_blonde", name: "Rubio Mantequilla", hex: "#F2DDA4" },
  { id: "champagne", name: "Rubio Miel", hex: "#E8C688" },
  { id: "ash_silver", name: "Plata Ceniza", hex: "#C8CCD8" },
  { id: "snow_white", name: "Blanco Nieve", hex: "#EDEFF5" },
  { id: "sakura", name: "Rosa Sakura", hex: "#F09FB7" },
  { id: "cherry_red", name: "Rojo Carmesí", hex: "#B53852" },
  { id: "lavender", name: "Lavanda", hex: "#B59DE8" },
  { id: "mint", name: "Menta Pastel", hex: "#8FD6C2" },
  { id: "sky_pastel", name: "Celeste Pastel", hex: "#8ABAE8" },
  { id: "midnight", name: "Azul Noche", hex: "#384B78" },
];

export const EYE_COLORS = [
  { id: "charcoal_eye", name: "Carbón", hex: "#2E303A" },
  { id: "chocolate", name: "Chocolate", hex: "#4D3229" },
  { id: "amber", name: "Ámbar", hex: "#A8682B" },
  { id: "honey_gold", name: "Dorado Miel", hex: "#D49B35" },
  { id: "hazel", name: "Avellana", hex: "#8D6846" },
  { id: "smoky_grey", name: "Gris Humo", hex: "#6F7887" },
  { id: "slate", name: "Gris Acero", hex: "#4D5D75" },
  { id: "sapphire", name: "Azul Zafiro", hex: "#2F5EA8" },
  { id: "ice_blue", name: "Azul Hielo", hex: "#73A6DC" },
  { id: "emerald", name: "Jade", hex: "#3A7D6B" },
  { id: "olive_green", name: "Verde Musgo", hex: "#688753" },
  { id: "violet", name: "Violeta", hex: "#7654A8" },
  { id: "rose", name: "Rosa Rubí", hex: "#C44569" },
  { id: "turquoise", name: "Turquesa", hex: "#3B9B9E" },
];

export const BLUSH_STYLES: { id: BlushStyleId; name: string; desc: string }[] = [
  { id: "suave", name: "Rubor Suave", desc: "Toque natural rosado en las mejillas." },
  { id: "intenso", name: "Sonrojo Manhwa", desc: "Mejillas encendidas con brillo suave." },
  { id: "pecas", name: "Pecas & Rubor", desc: "Rubor juvenil acompañado de pecas tiernas." },
  { id: "corazon", name: "Destello Pixel", desc: "Rubor con píxel de brillo luminoso." },
  { id: "ninguno", name: "Natural Limpio", desc: "Sin colorete base (solo al sonrojarse)." },
];

export const BLUSH_COLORS = [
  { id: "petal", name: "Rosa Pétalo", hex: "#F69AB3" },
  { id: "peach", name: "Melocotón", hex: "#F7A98B" },
  { id: "cherry", name: "Cereza Tibia", hex: "#E86F8E" },
  { id: "coral", name: "Coral Dulce", hex: "#F28B7D" },
  { id: "lilac", name: "Lila Suave", hex: "#D99FE8" },
];

export const FACE_MARKS: { id: FaceMarkId; name: string; desc: string }[] = [
  { id: "ninguno", name: "Piel Limpia", desc: "Sin marcas faciales adicionales." },
  { id: "curita", name: "Curita Tierna", desc: "Pequeña curita beige en la mejilla." },
  { id: "lunar", name: "Lunar Bajo el Ojo", desc: "Lunar elegante estilo idol coreano." },
  { id: "pecas_nariz", name: "Pecas en Puente Nasal", desc: "Pequitas suaves cruzando la nariz." },
  { id: "estrellita", name: "Pegatina Estrella", desc: "Mini estrellita dorada en la mejilla." },
  { id: "corazoncito", name: "Sello Corazón", desc: "Pequeño corazón rosado en la mejilla." },
];

// =====================================================================
// 54 HAIRSTYLES (27 Chicos + 27 Chicas — con estilos esponjosos y K-pop)
// =====================================================================
const RAW_HAIR_BOYS: Omit<HairSpec, "section">[] = [
  { id: "two_block_pulcro", name: "Two-Block Ejecutivo 6:4", price: 0, attractiveness: 4, charmNote: "Raya 6:4 pulcra estilo protagonista de drama.", fluffy: false, crown: "classic", bangs: "curtain_64", back: "short_taper" },
  { id: "kpop_comma", name: "Coma Esponjosa K-Pop", price: 0, attractiveness: 5, charmNote: "Mechón curvo voluminoso que enmarca los ojos.", fluffy: true, crown: "fluffy_cloud", bangs: "comma", back: "short_taper" },
  { id: "flequillo_nerd", name: "Tazón Esponjoso Nerd", price: 0, attractiveness: 3, charmNote: "Flequillo denso y suave estilo universitario tierno.", fluffy: true, crown: "fluffy_cloud", bangs: "straight_thick", back: "short_taper" },
  { id: "wolf_cut", name: "Wolf Cut Capas Esponjosas", price: 0, attractiveness: 4, charmNote: "Capas rebeldes con nuca estilizada de Seúl.", fluffy: true, crown: "fluffy_cloud", bangs: "messy_spiky", back: "shaggy_wolf" },
  { id: "rizos_cortos", name: "Nube de Rizos Esponjosos", price: 0, attractiveness: 5, charmNote: "Rizos cortos llenos de volumen como algodón.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "fluffy_bob" },
  { id: "messy_bangs", name: "Flequillo Aireado Despeinado", price: 0, attractiveness: 4, charmNote: "Natural y juvenil recién salido de cafetería.", fluffy: true, crown: "classic", bangs: "wispy_air", back: "short_taper" },
  { id: "undercut_seul", name: "Undercut Limpio Seúl", price: 0, attractiveness: 5, charmNote: "Sienes pulidas con volumen superior elegante.", fluffy: false, crown: "sleek", bangs: "side_sweep", back: "short_taper" },
  { id: "boy_fluffy_curtain", name: "Cortina Esponjosa 5:5", price: 0, attractiveness: 6, charmNote: "Raya al medio esponjosa con ondas suaves en sienes.", fluffy: true, crown: "fluffy_cloud", bangs: "curtain_64", back: "wavy_shoulder" },
  { id: "boy_spiky_fluff", name: "Puntas Esponjosas Rebeldes", price: 0, attractiveness: 5, charmNote: "Textura picada con gran volumen superior de DJ.", fluffy: true, crown: "spiky", bangs: "messy_spiky", back: "shaggy_wolf" },
  { id: "corte_principe", name: "Corte Príncipe Desfilado", price: 30, attractiveness: 5, charmNote: "Flequillo partido simétrico de actor principal.", fluffy: true, crown: "high_volume", bangs: "curtain_64", back: "short_taper" },
  { id: "mullet_kpop", name: "Mullet Urbano Hongdae", price: 35, attractiveness: 5, charmNote: "Parte trasera larga con laterales desenfadados.", fluffy: true, crown: "fluffy_cloud", bangs: "comma", back: "mullet" },
  { id: "despeinado_idolo", name: "Semi-Largo Actor Bohemio", price: 40, attractiveness: 6, charmNote: "Ondas largas sueltas sobre el cuello.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "wavy_shoulder" },
  { id: "boy_pompadour_comma", name: "Pompadour Coma Nocturno", price: 45, attractiveness: 7, charmNote: "Frente semi-despejada con un mechón sensual.", fluffy: true, crown: "high_volume", bangs: "comma", back: "short_taper" },
  { id: "boy_cotton_bowl", name: "Corte Algodón Suave", price: 30, attractiveness: 5, charmNote: "Redondeado extra esponjoso muy tierno.", fluffy: true, crown: "fluffy_cloud", bangs: "straight_thick", back: "fluffy_bob" },
  { id: "boy_skater_long", name: "Skater Largo Desordenado", price: 35, attractiveness: 5, charmNote: "Melena media con mechones cayendo sobre la frente.", fluffy: true, crown: "fluffy_cloud", bangs: "messy_spiky", back: "wavy_shoulder" },
  { id: "boy_ceo_slick", name: "Ejecutivo Peinado Hacia Atrás", price: 50, attractiveness: 7, charmNote: "Estilo heredero frío y calculador.", fluffy: false, crown: "sleek", bangs: "side_sweep", back: "short_taper" },
  { id: "boy_fluffy_shag", name: "Shag Japonés Esponjoso", price: 40, attractiveness: 6, charmNote: "Capas ligeras alrededor de orejas y nuca.", fluffy: true, crown: "fluffy_cloud", bangs: "wispy_air", back: "shaggy_wolf" },
  { id: "boy_dancer_part", name: "Raya Lateral Idol Escenario", price: 45, attractiveness: 6, charmNote: "Volumen lateral perfecto para brillar en fotos.", fluffy: true, crown: "high_volume", bangs: "side_sweep", back: "short_taper" },
  { id: "boy_curly_mullet", name: "Mullet Rizado Esponjoso", price: 55, attractiveness: 7, charmNote: "Rizos esponjosos arriba con caída mullet moderna.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "mullet" },
  { id: "boy_braids_short", name: "Trenzas Urbanas Cortas", price: 50, attractiveness: 7, charmNote: "Trenzas pegadas con caída definida en las sienes.", fluffy: false, crown: "braided_crown", bangs: "braids_front", back: "braided_locs" },
  { id: "boy_manbun_half", name: "Semi-Recogido Artista", price: 60, attractiveness: 7, charmNote: "Moño alto atrás dejando mechones sueltos.", fluffy: true, crown: "high_volume", bangs: "curtain_64", back: "high_bun" },
  { id: "boy_poodle_perm", name: "Permanente Esponjosa Seúl", price: 45, attractiveness: 6, charmNote: "Permanente suave muy popular entre chicos dulces.", fluffy: true, crown: "fluffy_cloud", bangs: "straight_thick", back: "fluffy_bob" },
  { id: "boy_wind_swept", name: "Viento Costero Italiano", price: 50, attractiveness: 6, charmNote: "Cabello barrido hacia un lado con aire libre.", fluffy: true, crown: "high_volume", bangs: "side_sweep", back: "wavy_shoulder" },
  { id: "boy_gamer_fluff", name: "Corte Gamer Esponjoso", price: 35, attractiveness: 5, charmNote: "Flequillo espeso que casi roza los ojos.", fluffy: true, crown: "fluffy_cloud", bangs: "wispy_air", back: "fluffy_bob" },
  { id: "boy_spiky_crown", name: "Púas Suaves Anime", price: 40, attractiveness: 6, charmNote: "Mechones puntiagudos suaves con mucho estilo.", fluffy: true, crown: "spiky", bangs: "comma", back: "short_taper" },
  { id: "boy_soft_prince_long", name: "Príncipe Melena Larga", price: 65, attractiveness: 8, charmNote: "Cabello largo sedoso de nobleza romántica.", fluffy: true, crown: "high_volume", bangs: "wavy_part", back: "long_waves" },
  { id: "boy_street_beanie_cut", name: "Capas Callejeras Anchas", price: 35, attractiveness: 5, charmNote: "Volumen lateral ancho ideal para gorras.", fluffy: true, crown: "fluffy_cloud", bangs: "curtain_64", back: "short_taper" },
];

const RAW_HAIR_GIRLS: Omit<HairSpec, "section">[] = [
  { id: "media_melena", name: "Media Melena Puntas Suaves", price: 0, attractiveness: 4, charmNote: "Raya lateral elegante que enmarca el rostro.", fluffy: false, crown: "classic", bangs: "side_sweep", back: "flipped_bob" },
  { id: "soft_bob", name: "Bob Suave Esponjoso", price: 0, attractiveness: 4, charmNote: "Bob redondeado con volumen tierno en las puntas.", fluffy: true, crown: "fluffy_cloud", bangs: "straight_thick", back: "fluffy_bob" },
  { id: "hime_cut", name: "Corte Hime Imperial", price: 0, attractiveness: 5, charmNote: "Mechones escalonados junto a las mejillas.", fluffy: false, crown: "sleek", bangs: "hime", back: "long_straight" },
  { id: "long_waves", name: "Ondas Largas Esponjosas", price: 0, attractiveness: 5, charmNote: "Melena larga ondulada digna de protagonista.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "long_waves" },
  { id: "largo_flequillo", name: "Melena Larga con Flequillo", price: 0, attractiveness: 4, charmNote: "Flequillo recto dulce que resalta la mirada.", fluffy: true, crown: "classic", bangs: "straight_thick", back: "long_straight" },
  { id: "bob_ondulado", name: "Bob Ondulado Romántico", price: 0, attractiveness: 5, charmNote: "Ondas esponjosas por encima de los hombros.", fluffy: true, crown: "fluffy_cloud", bangs: "curtain_64", back: "wavy_shoulder" },
  { id: "twin_tails", name: "Coletas Altas Juveniles", price: 0, attractiveness: 5, charmNote: "Dos coletas simétricas llenas de alegría.", fluffy: true, crown: "classic", bangs: "wispy_air", back: "twin_tails", hairOrnament: "ribbon_pink" },
  { id: "girl_braided_locs", name: "Bob de Trenzas Locs", price: 0, attractiveness: 6, charmNote: "Trenzas definidas con puntas esponjosas y raya al medio.", fluffy: true, crown: "braided_crown", bangs: "braids_front", back: "braided_locs" },
  { id: "girl_pom_ponytail", name: "Coleta Lateral con Pompones", price: 0, attractiveness: 6, charmNote: "Coleta alta a un lado atada con dos bolitas suaves.", fluffy: true, crown: "classic", bangs: "side_sweep", back: "side_ponytail", hairOrnament: "pom_white" },
  { id: "girl_flipped_star_bob", name: "Bob Puntas Afuera & Estrella", price: 0, attractiveness: 6, charmNote: "Bob negro esponjoso con puntas hacia afuera y broche.", fluffy: true, crown: "fluffy_cloud", bangs: "wispy_air", back: "flipped_bob", hairOrnament: "star_gold" },
  { id: "romantic_bun", name: "Moño Alto Romántico", price: 30, attractiveness: 5, charmNote: "Recogido limpio con mechones suaves cayendo.", fluffy: false, crown: "classic", bangs: "wispy_air", back: "high_bun" },
  { id: "monos_dobles", name: "Moños Dobles Esponjosos", price: 35, attractiveness: 6, charmNote: "Dos moñitos altos súper tiernos y coquetos.", fluffy: true, crown: "fluffy_cloud", bangs: "straight_thick", back: "twin_buns" },
  { id: "trenza_lateral", name: "Trenza Lateral Delicada", price: 40, attractiveness: 5, charmNote: "Trenza sobre un hombro con lazo romántico.", fluffy: false, crown: "classic", bangs: "side_sweep", back: "side_braid", hairOrnament: "ribbon_pink" },
  { id: "girl_fluffy_cloud_long", name: "Melena Nube Extra Esponjosa", price: 45, attractiveness: 7, charmNote: "Cabello enorme y suave lleno de ondas voluminosas.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "long_waves" },
  { id: "girl_butterfly_cut", name: "Corte Mariposa en Capas", price: 45, attractiveness: 6, charmNote: "Capas aireadas alrededor del rostro y hombros.", fluffy: true, crown: "high_volume", bangs: "curtain_64", back: "wavy_shoulder" },
  { id: "girl_half_up_ribbon", name: "Semi-Recogido con Lazo", price: 40, attractiveness: 6, charmNote: "Mitad arriba con lazo delicado y caída larga.", fluffy: true, crown: "high_volume", bangs: "wispy_air", back: "long_waves", hairOrnament: "ribbon_pink" },
  { id: "girl_wolf_long", name: "Wolf Cut Femenino Largo", price: 45, attractiveness: 6, charmNote: "Capas atrevidas con flequillo desfilado.", fluffy: true, crown: "fluffy_cloud", bangs: "messy_spiky", back: "shaggy_wolf" },
  { id: "girl_sleek_idol", name: "Lacio Espejo K-Pop", price: 50, attractiveness: 7, charmNote: "Melena ultra lisa con brillo de escenario.", fluffy: false, crown: "sleek", bangs: "curtain_64", back: "long_straight" },
  { id: "girl_curly_afro_puff", name: "Rizos Volumen Natural", price: 40, attractiveness: 7, charmNote: "Corona amplia de rizos esponjosos y vivos.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "fluffy_bob" },
  { id: "girl_double_buns_long", name: "Moños + Melena Larga", price: 55, attractiveness: 7, charmNote: "Dos moñitos altos combinados con ondas sueltas.", fluffy: true, crown: "fluffy_cloud", bangs: "wispy_air", back: "twin_buns" },
  { id: "girl_paris_bob", name: "Bob Francés Corto", price: 35, attractiveness: 6, charmNote: "A la altura de la mandíbula con flequillo ligero.", fluffy: true, crown: "classic", bangs: "wispy_air", back: "fluffy_bob" },
  { id: "girl_braided_twintails", name: "Coletas Largas Trenzadas", price: 50, attractiveness: 6, charmNote: "Dos trenzas largas adornadas con listones.", fluffy: false, crown: "classic", bangs: "straight_thick", back: "twin_tails", hairOrnament: "ribbon_pink" },
  { id: "girl_hime_wavy", name: "Hime Ondulado Pastel", price: 60, attractiveness: 8, charmNote: "Mechones frontales rectos con ondas largas esponjosas.", fluffy: true, crown: "fluffy_cloud", bangs: "hime", back: "long_waves" },
  { id: "girl_side_pony_waves", name: "Coleta Alta Ondulada", price: 50, attractiveness: 6, charmNote: "Coleta lateral vaporosa con brillo idol.", fluffy: true, crown: "high_volume", bangs: "comma", back: "side_ponytail", hairOrnament: "pom_white" },
  { id: "girl_cotton_candy_curls", name: "Rizos Algodón de Azúcar", price: 55, attractiveness: 7, charmNote: "Ondas esponjosas de muñeca pixelada.", fluffy: true, crown: "fluffy_cloud", bangs: "wavy_part", back: "long_waves" },
  { id: "girl_short_pixie_fluff", name: "Pixie Esponjoso Coqueto", price: 30, attractiveness: 5, charmNote: "Corto, voluminoso y lleno de chispa.", fluffy: true, crown: "fluffy_cloud", bangs: "comma", back: "short_taper" },
  { id: "girl_siren_waves", name: "Ondas Sirena Nocturnas", price: 70, attractiveness: 8, charmNote: "Melena larga espesa de gran glamour.", fluffy: true, crown: "high_volume", bangs: "side_sweep", back: "long_waves" },
];

export const HAIR_SPECS: HairSpec[] = [
  ...RAW_HAIR_BOYS.map((h) => ({ ...h, section: "chicos" as const })),
  ...RAW_HAIR_GIRLS.map((h) => ({ ...h, section: "chicas" as const })),
];
export const HAIR_SPEC_MAP: Record<string, HairSpec> = Object.fromEntries(
  HAIR_SPECS.map((h) => [h.id, h])
);

// =====================================================================
// 54 OUTFITS (27 Chicos + 27 Chicas — con moda ancha, baggy y oversize)
// =====================================================================
const RAW_OUTFIT_BOYS: Omit<OutfitSpec, "section">[] = [
  { id: "office_blazer", name: "Blazer Ejecutivo Seúl", price: 0, attractiveness: 4, charmNote: "Traje entallado oscuro con corbata carmesí.", silhouette: "formal_suit", top: "#3A405A", topShade: "#292E42", inner: "#FFFFFF", bottom: "#2A2E3D", shoe: "#2D2229", accent: "#E14D7A", hasTie: true },
  { id: "boy_suit_noir_pin", name: "Traje Negro Cruzado & Pin", price: 0, attractiveness: 7, charmNote: "Traje negro impecable con cuello blanco y pin rojo.", silhouette: "formal_suit", top: "#26262C", topShade: "#18181D", inner: "#FFFFFF", bottom: "#232329", shoe: "#1B1B20", accent: "#C93B4B", hasTie: true },
  { id: "boy_cream_vest_jeans", name: "Chaleco Crema & Jeans Cielo", price: 0, attractiveness: 6, charmNote: "Chaleco tejido en V sobre camiseta blanca y jeans rectos.", silhouette: "vest_layer", top: "#F5F1E3", topShade: "#DCD4BE", inner: "#FFFFFF", bottom: "#9BC2CC", shoe: "#FFFFFF", accent: "#2D3342" },
  { id: "boy_jersey_06", name: "Jersey #06 & Denim Ancho", price: 0, attractiveness: 6, charmNote: "Camiseta deportiva roja 06 sobre playera y jeans anchos.", silhouette: "jersey", top: "#A6323B", topShade: "#7E2229", inner: "#F7F7F9", bottom: "#3D5863", shoe: "#23252C", accent: "#F2C14E", jerseyNumber: true },
  { id: "boy_oversized_ice_tie", name: "Camisa Azul Abierta & Corbata", price: 0, attractiveness: 6, charmNote: "Camisa celeste ancha abierta con corbata negra suelta.", silhouette: "oversized_open", top: "#DCEEF8", topShade: "#B7D8EC", inner: "#FFFFFF", bottom: "#2E3038", shoe: "#23252B", accent: "#23252B", hasTie: true },
  { id: "boy_cropped_cargo", name: "Chaqueta Corta & Cargo Anchos", price: 0, attractiveness: 7, charmNote: "Chaqueta oscura abierta con pantalones cargo grises anchos.", silhouette: "wide_cargo", top: "#2E3036", topShade: "#1E2026", inner: "#F5EDE3", bottom: "#5F636E", shoe: "#26282E", accent: "#9CA3AF", hasBelt: true },
  { id: "boy_hoodie_plaid", name: "Zip Hoodie Negro & Pantalón Cuadros", price: 0, attractiveness: 6, charmNote: "Sudadera abierta con camiseta blanca y pantalón ancho a cuadros.", silhouette: "baggy_street", top: "#292B30", topShade: "#191B20", inner: "#FFFFFF", bottom: "#494D58", shoe: "#4E3427", accent: "#7B8294" },
  { id: "hoodie_urbano", name: "Hoodie Blanco Ancho Hongdae", price: 0, attractiveness: 4, charmNote: "Sudadera oversize blanca con pants rayados.", silhouette: "hoodie_wide", top: "#F4F6F9", topShade: "#D8DFE8", inner: "#FFFFFF", bottom: "#2C2E38", shoe: "#FFFFFF", accent: "#9CA3AF" },
  { id: "chaqueta_varsity", name: "Varsity Universitaria Seúl", price: 0, attractiveness: 5, charmNote: "Chaqueta beisbolera ancha con mangas crema.", silhouette: "baggy_street", top: "#2E3A59", topShade: "#202A42", inner: "#F6F2EA", bottom: "#262830", shoe: "#FFFFFF", accent: "#F6C453" },
  { id: "streetwear_cargo", name: "Streetwear Cargo Verde Oliva", price: 35, attractiveness: 6, charmNote: "Chaqueta cropped negra y pantalones cargo holgados.", silhouette: "wide_cargo", top: "#26232B", topShade: "#17141C", inner: "#F6F2EA", bottom: "#6B735C", shoe: "#FFFFFF", accent: "#E14D7A", hasBelt: true },
  { id: "camisa_cafe", name: "Camisa Lino Café Latte", price: 30, attractiveness: 5, charmNote: "Camisa holgada en tonos tierra cálidos.", silhouette: "oversized_open", top: "#EFE4D8", topShade: "#D9C5B2", inner: "#FFFDFB", bottom: "#544137", shoe: "#3D2D25", accent: "#A37E65" },
  { id: "trench_seul", name: "Gabardina Otoño Ancha", price: 55, attractiveness: 7, charmNote: "Gabardina larga camel con pantalón recto.", silhouette: "trench_wide", top: "#D6BC9B", topShade: "#BA9B76", inner: "#F7F3ED", bottom: "#363A45", shoe: "#4B3A2E", accent: "#8C6D4F", hasScarf: true, hasBelt: true },
  { id: "idol_jacket", name: "Chaqueta Idol Lavanda Nocturna", price: 60, attractiveness: 7, charmNote: "Corte de escenario con detalles metálicos.", silhouette: "baggy_street", top: "#2F293B", topShade: "#1F1A29", inner: "#E9DFFC", bottom: "#231F28", shoe: "#FFFFFF", accent: "#B59DE8", hasBelt: true },
  { id: "chaebol_coat", name: "Abrigo Chaebol Borgoña", price: 75, attractiveness: 8, charmNote: "Abrigo largo de cachemir digno de drama.", silhouette: "trench_wide", top: "#8C4A5E", topShade: "#6F3647", inner: "#FFFFFF", bottom: "#2D2229", shoe: "#2D2229", accent: "#F6C453", hasBelt: true },
  { id: "boy_baggy_sage", name: "Hoodie Salvia Oversize & Baggy", price: 40, attractiveness: 6, charmNote: "Sudadera verde salvia extra ancha y jeans claros.", silhouette: "hoodie_wide", top: "#A7C4B5", topShade: "#85A695", inner: "#FFFFFF", bottom: "#8CA7C2", shoe: "#FFFFFF", accent: "#5F7D6D" },
  { id: "boy_leather_wide", name: "Cazadora Cuero & Cargo Negro", price: 65, attractiveness: 8, charmNote: "Chaqueta biker ancha con cadenas y cargo oscuro.", silhouette: "wide_cargo", top: "#222126", topShade: "#121116", inner: "#E8E8ED", bottom: "#2E3038", shoe: "#1B1B20", accent: "#D1D5DB", hasBelt: true },
  { id: "boy_denim_baggy_set", name: "Denim Completo Oversize Azul", price: 50, attractiveness: 6, charmNote: "Chaqueta mezclilla ancha sobre sudadera gris.", silhouette: "oversized_open", top: "#5D83A8", topShade: "#45688A", inner: "#E5E7EB", bottom: "#4B6B8C", shoe: "#FFFFFF", accent: "#F6C453" },
  { id: "boy_navy_vest_preppy", name: "Chaleco Azul Marino & Corbata", price: 45, attractiveness: 6, charmNote: "Look universitario limpio con pantalón ancho beige.", silhouette: "vest_layer", top: "#2E3F63", topShade: "#1F2C47", inner: "#FFFFFF", bottom: "#DFD3BC", shoe: "#3D2B24", accent: "#E14D7A", hasTie: true },
  { id: "boy_linen_resort", name: "Lino Italiano Marfil & Oliva", price: 60, attractiveness: 7, charmNote: "Camisa abierta fresca de terraza mediterránea.", silhouette: "oversized_open", top: "#F5F2EA", topShade: "#DDD8CA", inner: "#FFFDFB", bottom: "#737D5E", shoe: "#5C4033", accent: "#C9A875" },
  { id: "boy_jersey_blue", name: "Jersey Baloncesto Azul #23", price: 45, attractiveness: 6, charmNote: "Camiseta deportiva ancha azul rey con cargo blanco.", silhouette: "jersey", top: "#2E5AA8", topShade: "#20407C", inner: "#FFFFFF", bottom: "#EAECEF", shoe: "#23252C", accent: "#F6C453", jerseyNumber: true },
  { id: "boy_tokyo_techwear", name: "Parka Techwear Tokio Ancha", price: 85, attractiveness: 8, charmNote: "Cortavientos ancho con correas y cargo ancho.", silhouette: "wide_cargo", top: "#282C36", topShade: "#181A21", inner: "#3B4252", bottom: "#23252E", shoe: "#191A20", accent: "#38BDF8", hasBelt: true },
  { id: "boy_pastel_mint_hoodie", name: "Sudadera Menta Ancha & Beige", price: 40, attractiveness: 6, charmNote: "Tono menta suave con pantalones amplios crema.", silhouette: "hoodie_wide", top: "#B8E3D4", topShade: "#8FC5B2", inner: "#FFFFFF", bottom: "#DFD5C5", shoe: "#FFFFFF", accent: "#5A8F7C" },
  { id: "boy_wine_blazer", name: "Blazer Vino & Cuello Alto", price: 70, attractiveness: 8, charmNote: "Elegancia nocturna de galería parisina.", silhouette: "formal_suit", top: "#69283B", topShade: "#4B1B29", inner: "#232026", bottom: "#232026", shoe: "#1A181D", accent: "#F6C453" },
  { id: "boy_knit_cardigan_boy", name: "Cárdigan Grueso & Baggy Café", price: 50, attractiveness: 6, charmNote: "Punto grueso acogedor con pantalón holgado.", silhouette: "oversized_open", top: "#D9C3A8", topShade: "#BCA284", inner: "#FFFFFF", bottom: "#5C493E", shoe: "#FFFFFF", accent: "#7A5B47" },
  { id: "boy_ivory_prince", name: "Sastre Blanco Príncipe Seúl", price: 90, attractiveness: 9, charmNote: "Traje marfil de gala con broche dorado.", silhouette: "formal_suit", top: "#F8F6F2", topShade: "#DFDBD2", inner: "#FFFFFF", bottom: "#EFECE6", shoe: "#362C33", accent: "#E6C16C", hasBelt: true },
  { id: "boy_flannel_baggy", name: "Sobrecamisa Cuadros Roja & Baggy", price: 45, attractiveness: 6, charmNote: "Franela ancha abierta sobre camiseta y denim suelto.", silhouette: "baggy_street", top: "#9C3B44", topShade: "#752A31", inner: "#FFFFFF", bottom: "#4B637D", shoe: "#2D2229", accent: "#231F28" },
  { id: "boy_hanbok_modern", name: "Hanbok Masculino Moderno", price: 85, attractiveness: 8, charmNote: "Capa tradicional estilizada en azul pizarra y crema.", silhouette: "hanbok", top: "#425878", topShade: "#2E3F59", inner: "#FAF6EF", bottom: "#2D3442", shoe: "#23252B", accent: "#E6C16C" },
];

const RAW_OUTFIT_GIRLS: Omit<OutfitSpec, "section">[] = [
  { id: "bufanda_crema", name: "Cárdigan Invierno & Falda Azul", price: 0, attractiveness: 5, charmNote: "Chaqueta crema abotonada, bufanda y falda marina.", silhouette: "cardigan_skirt", top: "#F5EEDF", topShade: "#DED2BA", inner: "#FFFFFF", bottom: "#2B3B54", shoe: "#EFECE6", accent: "#C4B08A", isSkirt: true, hasScarf: true },
  { id: "pastel_sweater", name: "Suéter Lavanda Cozy", price: 0, attractiveness: 3, charmNote: "Suéter ancho lavanda pastel súper tierno.", silhouette: "hoodie_wide", top: "#D6C6F0", topShade: "#B59DE8", inner: "#FFFFFF", bottom: "#3D435C", shoe: "#FFFFFF", accent: "#9F84D6" },
  { id: "girl_brown_vest_plaid", name: "Chaleco Café & Falda a Cuadros", price: 0, attractiveness: 6, charmNote: "Chaleco tejido marrón, blusa blanca y falda tartán.", silhouette: "pleated_plaid", top: "#A67653", topShade: "#855A3B", inner: "#FFFFFF", bottom: "#966B4A", shoe: "#262328", accent: "#F5E9DC", isSkirt: true },
  { id: "girl_pink_jacket_bunny", name: "Chaqueta Rosa Ancha & Falda", price: 0, attractiveness: 7, charmNote: "Chaqueta pastel rosa con lazo marino y falda plisada.", silhouette: "cardigan_skirt", top: "#F9D6E3", topShade: "#E6B4C7", inner: "#FFFFFF", bottom: "#2B3554", shoe: "#23252C", accent: "#2B3554", isSkirt: true },
  { id: "girl_black_peterpan_baggy", name: "Blusa Negra & Jeans Baggy", price: 0, attractiveness: 6, charmNote: "Top negro con cuello bebé blanco y jeans anchos.", silhouette: "peplum_baggy", top: "#28292E", topShade: "#1A1B1F", inner: "#FFFDF8", bottom: "#5B7FA1", shoe: "#1F1F24", accent: "#EAE4D3" },
  { id: "girl_cream_ribbon_skirt", name: "Cárdigan Crema & Lazos Rosas", price: 0, attractiveness: 7, charmNote: "Cárdigan cuello rosa encaje, falda blanca y calcetas con lazos.", silhouette: "coquette_lace", top: "#F6F0DC", topShade: "#DFD5BA", inner: "#F7C8D8", bottom: "#FFFFFF", shoe: "#FFFFFF", accent: "#F49FB8", isSkirt: true, ribbonSocks: true },
  { id: "pijama_patito", name: "Top Limón & Pantuflas Patito", price: 0, attractiveness: 5, charmNote: "Conjunto amarillo mantequilla y pantuflas de patito.", silhouette: "cardigan_skirt", top: "#F9EAA8", topShade: "#E6D07C", inner: "#FFFDFB", bottom: "#FFFFFF", shoe: "#FFFFFF", accent: "#F5B82E", isSkirt: true, duckSlippers: true },
  { id: "sakura_dress", name: "Vestido Pétalo Sakura", price: 0, attractiveness: 5, charmNote: "Silueta rosada luminosa con encaje blanco.", silhouette: "coquette_lace", top: "#FAD2E0", topShade: "#E8A7BE", inner: "#FFFFFF", bottom: "#FAD2E0", shoe: "#E14D7A", accent: "#E14D7A", isSkirt: true },
  { id: "uniforme_preppy", name: "Conjunto Preppy Academia", price: 0, attractiveness: 6, charmNote: "Cárdigan crema con corbata y falda oscura.", silhouette: "pleated_plaid", top: "#F5ECD8", topShade: "#DDD0B6", inner: "#FFFFFF", bottom: "#292B36", shoe: "#2D2229", accent: "#E14D7A", isSkirt: true, hasTie: true },
  { id: "vestido_coquette", name: "Vestido Coquette Encaje", price: 45, attractiveness: 7, charmNote: "Encaje pixelado con lazo carmesí romántico.", silhouette: "coquette_lace", top: "#FADCE6", topShade: "#E6B6C7", inner: "#FFFFFF", bottom: "#FADCE6", shoe: "#D95D85", accent: "#D95D85", isSkirt: true, ribbonSocks: true },
  { id: "conjunto_marino", name: "Conjunto Marinero K-Pop", price: 45, attractiveness: 6, charmNote: "Cuello marinero azul marino con lazo.", silhouette: "sailor", top: "#FFFDFB", topShade: "#E5E2DC", inner: "#2B3F66", bottom: "#2B3F66", shoe: "#2B3F66", accent: "#E14D7A", isSkirt: true },
  { id: "artist_cardigan", name: "Cárdigan Bohemio Crema", price: 35, attractiveness: 5, charmNote: "Tejido suave holgado estilo galería de arte.", silhouette: "oversized_open", top: "#EBD9C8", topShade: "#D5BDA7", inner: "#FFFFFF", bottom: "#6D5A52", shoe: "#4A3A33", accent: "#A88B73" },
  { id: "chaleco_denim", name: "Blusa Marfil & Jeans Clásicos", price: 35, attractiveness: 5, charmNote: "Estilo casual luminoso de cafetería.", silhouette: "peplum_baggy", top: "#F7F0D4", topShade: "#E4D8B0", inner: "#FFFFFF", bottom: "#4B739E", shoe: "#2D2229", accent: "#231F28" },
  { id: "sueter_fresa", name: "Suéter Fresa Oversize", price: 40, attractiveness: 6, charmNote: "Suéter ancho color fresa con pantalón crema holgado.", silhouette: "hoodie_wide", top: "#F49FB8", topShade: "#DF7C9A", inner: "#FFFFFF", bottom: "#F8F3EE", shoe: "#F49FB8", accent: "#FFFFFF" },
  { id: "abrigo_cuadros", name: "Abrigo Tartán Otoñal", price: 55, attractiveness: 7, charmNote: "Cuadros cálidos con bufanda larga.", silhouette: "trench_wide", top: "#B88C6B", topShade: "#996E4F", inner: "#FFFFFF", bottom: "#2E282A", shoe: "#3D2B24", accent: "#5A3928", hasScarf: true },
  { id: "hanbok_moderno", name: "Hanbok Moderno Pastel", price: 75, attractiveness: 8, charmNote: "Fusión coreana contemporánea en rosa y celeste.", silhouette: "hanbok", top: "#F4D5DF", topShade: "#E0B2C2", inner: "#FFFFFF", bottom: "#7D93B8", shoe: "#FFFDFB", accent: "#E14D7A", isSkirt: true },
  { id: "sastre_blanco", name: "Traje Sastre Marfil Femenino", price: 65, attractiveness: 7, charmNote: "Conjunto elegante con cinturón dorado.", silhouette: "formal_suit", top: "#F8F6F2", topShade: "#DFDBD2", inner: "#FFFFFF", bottom: "#EFECE6", shoe: "#362C33", accent: "#E6C16C", hasBelt: true },
  { id: "vestido_gala", name: "Vestido Gala Estrellas de Seúl", price: 110, attractiveness: 9, charmNote: "Gala nocturna azul medianoche con broches dorados.", silhouette: "coquette_lace", top: "#322A46", topShade: "#221C32", inner: "#F6C453", bottom: "#322A46", shoe: "#F6C453", accent: "#F6C453", isSkirt: true },
  { id: "girl_baggy_lavender_cargo", name: "Crop Lavanda & Cargo Anchos", price: 45, attractiveness: 7, charmNote: "Top corto morado suave con pantalones cargo beige anchos.", silhouette: "wide_cargo", top: "#C7B2F0", topShade: "#A58CD9", inner: "#FFFFFF", bottom: "#DFD5C5", shoe: "#FFFFFF", accent: "#7E5EC2", hasBelt: true },
  { id: "girl_y2k_denim_wide", name: "Chaqueta Y2K & Jeans Extra Anchos", price: 55, attractiveness: 7, charmNote: "Estilo estrella Y2K con mezclilla desgastada holgada.", silhouette: "baggy_street", top: "#F29BC0", topShade: "#D677A0", inner: "#FFFFFF", bottom: "#6385A8", shoe: "#FFFFFF", accent: "#F6C453" },
  { id: "girl_oversized_mint_shirt", name: "Camisa Menta Ancha & Short", price: 40, attractiveness: 6, charmNote: "Camisa de novio verde menta súper cómoda.", silhouette: "oversized_open", top: "#B8EAD8", topShade: "#8FCBB6", inner: "#FFFFFF", bottom: "#323A4F", shoe: "#FFFFFF", accent: "#5EA68E", isSkirt: true },
  { id: "girl_goth_lolita_soft", name: "Vestido Negro Cuello Encaje", price: 65, attractiveness: 8, charmNote: "Vestido negro elegante con encaje marfil y calcetas.", silhouette: "coquette_lace", top: "#29262E", topShade: "#1A181E", inner: "#FFFDFB", bottom: "#29262E", shoe: "#1B191F", accent: "#E14D7A", isSkirt: true, ribbonSocks: true },
  { id: "girl_honey_sweater_wide", name: "Suéter Miel Oversize & Jeans", price: 45, attractiveness: 6, charmNote: "Suéter tejido amplio dorado con pantalones anchos.", silhouette: "hoodie_wide", top: "#F2CE85", topShade: "#D9B062", inner: "#FFFFFF", bottom: "#4F6B8C", shoe: "#FFFFFF", accent: "#9E7836" },
  { id: "girl_paris_trench_dress", name: "Trench Parisiense & Boina", price: 70, attractiveness: 8, charmNote: "Gabardina crema chic sobre vestido negro.", silhouette: "trench_wide", top: "#E8DCC8", topShade: "#CCBFA8", inner: "#28252E", bottom: "#28252E", shoe: "#382C2E", accent: "#C93B6B", isSkirt: true, hasBelt: true },
  { id: "girl_sky_sailor_pastel", name: "Conjunto Marinero Celeste", price: 50, attractiveness: 6, charmNote: "Cuello azul cielo con lazo blanco y falda plisada.", silhouette: "sailor", top: "#FFFFFF", topShade: "#E6ECF5", inner: "#7FA9DB", bottom: "#6B96CC", shoe: "#384B6E", accent: "#F49FB8", isSkirt: true },
  { id: "girl_cherry_cardigan_baggy", name: "Cárdigan Cereza & Baggy Crudo", price: 55, attractiveness: 7, charmNote: "Cárdigan corto rojo cereza y pantalón ancho crema.", silhouette: "peplum_baggy", top: "#C44569", topShade: "#9E3150", inner: "#FFFFFF", bottom: "#EFEAE0", shoe: "#C44569", accent: "#F7C8D8" },
  { id: "girl_idol_stage_pink", name: "Traje Escenario Idol Rosa", price: 80, attractiveness: 9, charmNote: "Chaqueta brillante rosa y falda plisada de debut.", silhouette: "cardigan_skirt", top: "#F279A1", topShade: "#D45982", inner: "#FFFFFF", bottom: "#262230", shoe: "#FFFFFF", accent: "#F6C453", isSkirt: true, ribbonSocks: true },
];

export const OUTFIT_SPECS: OutfitSpec[] = [
  ...RAW_OUTFIT_BOYS.map((o) => ({ ...o, section: "chicos" as const })),
  ...RAW_OUTFIT_GIRLS.map((o) => ({ ...o, section: "chicas" as const })),
];
export const OUTFIT_SPEC_MAP: Record<string, OutfitSpec> = Object.fromEntries(
  OUTFIT_SPECS.map((o) => [o.id, o])
);

// =====================================================================
// 52 EYE STYLES (4 colecciones × 13 variantes nítidas pixel-art)
// =====================================================================
const BASE_EYE_PRESETS: EyeSpec[] = [
  // Dulces (13)
  { id: "starry", name: "Estrella Manhwa", category: "dulces", price: 0, attractiveness: 2, charmNote: "Brillo estelar cálido en la mirada.", shape: "round", lash: "soft", shine: "double", aegyosal: true },
  { id: "sweet", name: "Ojos Dulces Miel", category: "dulces", price: 0, attractiveness: 2, charmNote: "Iris grande y suave lleno de ternura.", shape: "round", lash: "soft", shine: "single" },
  { id: "puppy", name: "Perrito Caído Tierno", category: "dulces", price: 0, attractiveness: 3, charmNote: "Comisura ligeramente caída imposible de ignorar.", shape: "puppy", lash: "soft", shine: "double", aegyosal: true },
  { id: "eye_puppy_watery", name: "Perrito Cristalino", category: "dulces", price: 0, attractiveness: 4, charmNote: "Grandes y acuosos con doble destello.", shape: "puppy", lash: "lower", shine: "moist", aegyosal: true },
  { id: "eye_honey_shine", name: "Brillo Caramelo", category: "dulces", price: 0, attractiveness: 3, charmNote: "Pupila tibia con reflejo doble luminoso.", shape: "wide", lash: "soft", shine: "double" },
  { id: "eye_crescent_joy", name: "Sonrisa Feliz ^_^", category: "dulces", price: 0, attractiveness: 4, charmNote: "Ojos cerrados sonriendo con pura dulzura.", shape: "crescent", lash: "soft", shine: "single" },
  { id: "eye_dreamy_pastel", name: "Nube Soñadora", category: "dulces", price: 20, attractiveness: 3, charmNote: "Párpado suave y mirada romántica.", shape: "round", lash: "minimal", shine: "moist", heavyLid: true },
  { id: "eye_angel_aegyosal", name: "Ángel Aegyosal", category: "dulces", price: 25, attractiveness: 4, charmNote: "Bolsa inferior tierna al estilo Seúl.", shape: "wide", lash: "lower", shine: "double", aegyosal: true },
  { id: "eye_button_cute", name: "Botón Suave", category: "dulces", price: 20, attractiveness: 3, charmNote: "Redondos, inocentes y expresivos.", shape: "round", lash: "minimal", shine: "single" },
  { id: "eye_deer_doe", name: "Mirada de Ciervo", category: "dulces", price: 30, attractiveness: 4, charmNote: "Amplios y serenos con pestañas suaves.", shape: "wide", lash: "thick", shine: "double", aegyosal: true },
  { id: "eye_warm_bambi", name: "Bambi Dorado", category: "dulces", price: 35, attractiveness: 5, charmNote: "Pestañas largas con brillo estelar.", shape: "puppy", lash: "thick", shine: "star", aegyosal: true },
  { id: "eye_soft_petal", name: "Pétalo Caído", category: "dulces", price: 25, attractiveness: 3, charmNote: "Tímidos y encantadores al mirar.", shape: "puppy", lash: "minimal", shine: "single" },
  { id: "eye_sugar_glint", name: "Azúcar Glass", category: "dulces", price: 40, attractiveness: 5, charmNote: "Destello húmedo de protagonista.", shape: "wide", lash: "lower", shine: "moist" },

  // Intensos (13)
  { id: "sharp", name: "Mirada Afilada CEO", category: "intensos", price: 0, attractiveness: 3, charmNote: "Firme, elegante y difícil de leer.", shape: "sharp", lash: "minimal", shine: "single" },
  { id: "eye_sleepy_smoky", name: "Soñoliento Ahumado", category: "intensos", price: 0, attractiveness: 5, charmNote: "Párpado caído sensual con gris ahumado.", shape: "sleepy", lash: "minimal", shine: "double", heavyLid: true },
  { id: "eye_cool_charcoal", name: "Mirada Fría Carbón", category: "intensos", price: 0, attractiveness: 4, charmNote: "Seria y profunda de chico misterioso.", shape: "sharp", lash: "minimal", shine: "double", heavyLid: true },
  { id: "almond", name: "Almendra Serena", category: "intensos", price: 0, attractiveness: 3, charmNote: "Equilibrada y madura estilo manhwa.", shape: "almond", lash: "soft", shine: "single", aegyosal: true },
  { id: "eye_fox_slit", name: "Zorro Astuto", category: "intensos", price: 25, attractiveness: 5, charmNote: "Estrechos con esquina superior elevada.", shape: "cat", lash: "minimal", shine: "single", heavyLid: true },
  { id: "eye_half_lidded_noir", name: "Noir Entrecerrados", category: "intensos", price: 30, attractiveness: 5, charmNote: "Aura peligrosa de villano irresistible.", shape: "sleepy", lash: "thick", shine: "single", heavyLid: true },
  { id: "eye_wolf_gaze", name: "Lobo Nocturno", category: "intensos", price: 35, attractiveness: 5, charmNote: "Pupila intensa con delineado inferior.", shape: "sharp", lash: "lower", shine: "double" },
  { id: "eye_aristocrat", name: "Aristócrata Frío", category: "intensos", price: 40, attractiveness: 5, charmNote: "Líneas limpias de heredero intocable.", shape: "almond", lash: "minimal", shine: "single", heavyLid: true },
  { id: "eye_tired_cool", name: "Cansado Chic", category: "intensos", price: 25, attractiveness: 4, charmNote: "Ojeras sutiles que dan aire de músico indie.", shape: "sleepy", lash: "minimal", shine: "moist", aegyosal: true, heavyLid: true },
  { id: "eye_blade_liner", name: "Delineado Cuchilla", category: "intensos", price: 45, attractiveness: 6, charmNote: "Extremo rasgado muy llamativo.", shape: "sharp", lash: "winged", shine: "single" },
  { id: "eye_raven_depth", name: "Cuervo Profundo", category: "intensos", price: 35, attractiveness: 5, charmNote: "Oscuridad brillante bajo ceja recta.", shape: "almond", lash: "thick", shine: "double" },
  { id: "eye_mafia_boss", name: "Jefe Implacable", category: "intensos", price: 50, attractiveness: 6, charmNote: "Imponente y magnético desde el primer vistazo.", shape: "sleepy", lash: "minimal", shine: "star", heavyLid: true },
  { id: "eye_storm_slate", name: "Tormenta Pizarra", category: "intensos", price: 30, attractiveness: 4, charmNote: "Serenos pero cargados de tensión romántica.", shape: "sharp", lash: "soft", shine: "moist" },

  // Coquetos (13)
  { id: "cat", name: "Felinos Coquetos", category: "coquetos", price: 0, attractiveness: 4, charmNote: "Rabillo felino que seduce al instante.", shape: "cat", lash: "winged", shine: "double" },
  { id: "dreamy", name: "Soñadores Pastel", category: "coquetos", price: 0, attractiveness: 3, charmNote: "Reflejo cálido ideal para citas románticas.", shape: "almond", lash: "soft", shine: "double", heavyLid: true },
  { id: "eye_siren_lash", name: "Sirena Pestaña Larga", category: "coquetos", price: 25, attractiveness: 5, charmNote: "Pestañas elevadas con mirada entornada.", shape: "cat", lash: "thick", shine: "moist", heavyLid: true },
  { id: "eye_flirt_wink_shine", name: "Destello Pícaro", category: "coquetos", price: 30, attractiveness: 5, charmNote: "Chispa juguetona en la esquina del ojo.", shape: "cat", lash: "winged", shine: "star" },
  { id: "eye_heart_glint", name: "Corazón Enamorado", category: "coquetos", price: 40, attractiveness: 6, charmNote: "Reflejo rosado en forma de corazón.", shape: "wide", lash: "winged", shine: "heart", aegyosal: true },
  { id: "eye_kpop_baddie", name: "Baddie de Seúl", category: "coquetos", price: 35, attractiveness: 5, charmNote: "Delineado alado marcado y párpado suave.", shape: "cat", lash: "winged", shine: "double", heavyLid: true },
  { id: "eye_paris_chic", name: "Chic Parisiense", category: "coquetos", price: 30, attractiveness: 5, charmNote: "Pestañas inferiores delicadas y seguras.", shape: "almond", lash: "lower", shine: "double" },
  { id: "eye_velvet_tease", name: "Terciopelo Provocador", category: "coquetos", price: 45, attractiveness: 6, charmNote: "Párpados entornados con brillo húmedo.", shape: "sleepy", lash: "winged", shine: "moist", heavyLid: true },
  { id: "eye_sweet_vixen", name: "Zorrita Dulce", category: "coquetos", price: 35, attractiveness: 5, charmNote: "Mezcla irresistible entre ternura y picardía.", shape: "cat", lash: "soft", shine: "double", aegyosal: true },
  { id: "eye_charm_droop", name: "Caído Seductor", category: "coquetos", price: 30, attractiveness: 4, charmNote: "Línea inferior curvada muy magnética.", shape: "puppy", lash: "winged", shine: "double" },
  { id: "eye_crescent_tease", name: "Arco Pícaro", category: "coquetos", price: 25, attractiveness: 4, charmNote: "Ojos entrecerrados sonriendo con malicia dulce.", shape: "crescent", lash: "winged", shine: "single" },
  { id: "eye_rose_liner", name: "Delineado Ruborizado", category: "coquetos", price: 35, attractiveness: 5, charmNote: "Aegyosal cálido y pestañas aladas.", shape: "almond", lash: "winged", shine: "moist", aegyosal: true },
  { id: "eye_midnight_allure", name: "Encanto de Medianoche", category: "coquetos", price: 50, attractiveness: 6, charmNote: "Brillo estelar dentro de ojo felino.", shape: "cat", lash: "thick", shine: "star" },

  // Ídolo (13)
  { id: "idol", name: "Brillo Idol Escenario", category: "idolo", price: 0, attractiveness: 5, charmNote: "Pupilas estelares dignas de debut K-pop.", shape: "wide", lash: "thick", shine: "star", aegyosal: true },
  { id: "eye_starlight_debut", name: "Estrella Debut", category: "idolo", price: 30, attractiveness: 6, charmNote: "Destello dorado bajo la pupila.", shape: "wide", lash: "winged", shine: "star", aegyosal: true },
  { id: "eye_visual_center", name: "Centro Visual", category: "idolo", price: 45, attractiveness: 7, charmNote: "Equilibrio perfecto de ojos grandes y definidos.", shape: "almond", lash: "thick", shine: "double", aegyosal: true },
  { id: "eye_sparkle_prism", name: "Prisma Luminoso", category: "idolo", price: 40, attractiveness: 6, charmNote: "Triple punto de luz en iris cristalino.", shape: "round", lash: "lower", shine: "star" },
  { id: "eye_stage_heart", name: "Corazón de Fanmeeting", category: "idolo", price: 50, attractiveness: 7, charmNote: "Reflejo corazón brillante al mirar a cámara.", shape: "wide", lash: "thick", shine: "heart", aegyosal: true },
  { id: "eye_encore_tear", name: "Lágrima de Encore", category: "idolo", price: 45, attractiveness: 6, charmNote: "Brillo inferior húmedo súper emotivo.", shape: "puppy", lash: "lower", shine: "moist", aegyosal: true },
  { id: "eye_boygroup_ace", name: "Ace de Boygroup", category: "idolo", price: 40, attractiveness: 6, charmNote: "Ojo alargado con brillo en esquina interna.", shape: "sharp", lash: "thick", shine: "star" },
  { id: "eye_fairy_ending", name: "Ending Fairy", category: "idolo", price: 55, attractiveness: 7, charmNote: "La toma final perfecta de programa musical.", shape: "cat", lash: "thick", shine: "star", aegyosal: true },
  { id: "eye_neon_gaze", name: "Reflejo Neón Tokio", category: "idolo", price: 40, attractiveness: 6, charmNote: "Contraste nítido que resalta en fotos nocturnas.", shape: "almond", lash: "winged", shine: "star" },
  { id: "eye_moon_crescent", name: "Luna Creciente", category: "idolo", price: 35, attractiveness: 5, charmNote: "Arco feliz con pestañas marcadas.", shape: "crescent", lash: "thick", shine: "star" },
  { id: "eye_prince_idol", name: "Príncipe Escénico", category: "idolo", price: 45, attractiveness: 6, charmNote: "Párpado sutil con estrella interior.", shape: "sleepy", lash: "soft", shine: "star" },
  { id: "eye_candy_pop", name: "Caramelo Pop", category: "idolo", price: 35, attractiveness: 5, charmNote: "Redondos, alegres y llenos de chispa.", shape: "round", lash: "winged", shine: "heart" },
  { id: "eye_supernova", name: "Supernova Manhwa", category: "idolo", price: 65, attractiveness: 8, charmNote: "Mirada legendaria que cautiva al instante.", shape: "wide", lash: "winged", shine: "star", aegyosal: true },
];

export const EYE_SPECS: EyeSpec[] = BASE_EYE_PRESETS;
export const EYE_SPEC_MAP: Record<string, EyeSpec> = Object.fromEntries(
  EYE_SPECS.map((e) => [e.id, e])
);

// =====================================================================
// 52 MOUTH STYLES (4 colecciones × 13 variantes nítidas pixel-art)
// =====================================================================
export const MOUTH_SPECS: MouthSpec[] = [
  // Dulces (13)
  { id: "smile_soft", name: "Sonrisa Suave", category: "dulces", price: 0, attractiveness: 2, charmNote: "Pequeña línea rosada amable.", shape: "smile", lipColor: "#E88B9E" },
  { id: "mouth_dot_cute", name: "Puntito Minimal", category: "dulces", price: 0, attractiveness: 1, charmNote: "Boca pequeña discreta estilo pixel clásico.", shape: "dot", lipColor: "#DDA0A7" },
  { id: "mouth_rosebud", name: "Capullo de Rosa", category: "dulces", price: 0, attractiveness: 3, charmNote: "Labios tintados suaves en el centro.", shape: "rose", lipColor: "#E16B8C", gloss: true },
  { id: "mouth_cat_soft", name: "Boquita de Gatito :3", category: "dulces", price: 0, attractiveness: 3, charmNote: "Curva adorable en forma de w.", shape: "cat", lipColor: "#D97592" },
  { id: "mouth_open_happy", name: "Risa Alegre", category: "dulces", price: 0, attractiveness: 3, charmNote: "Sonrisa abierta llena de energía.", shape: "open_happy", lipColor: "#E6708A" },
  { id: "mouth_petal_tint", name: "Tinte Pétalo Coreano", category: "dulces", price: 20, attractiveness: 3, charmNote: "Degradado suave tipo tint coreano.", shape: "rose", lipColor: "#F08DA8", gloss: true },
  { id: "mouth_sweet_peach", name: "Sonrisa Melocotón", category: "dulces", price: 20, attractiveness: 3, charmNote: "Curva tibia color durazno.", shape: "smile", lipColor: "#EB9682", wide: true },
  { id: "mouth_shy_o", name: "Asombro Tierno 'o'", category: "dulces", price: 20, attractiveness: 2, charmNote: "Pequeña abertura tímida.", shape: "open_soft", lipColor: "#E88B9E" },
  { id: "mouth_milk_pout", name: "Puchero Suave", category: "dulces", price: 25, attractiveness: 3, charmNote: "Labio inferior levemente salido.", shape: "pout", lipColor: "#E8879D", gloss: true },
  { id: "mouth_wavy_shy", name: "Temblor Tímido ~", category: "dulces", price: 20, attractiveness: 2, charmNote: "Boquita nerviosa cuando se sonroja.", shape: "wavy", lipColor: "#D48894" },
  { id: "mouth_angel_smile", name: "Sonrisa Angelical", category: "dulces", price: 30, attractiveness: 4, charmNote: "Brillo suave con comisuras arriba.", shape: "smile", lipColor: "#EB7D9B", gloss: true, wide: true },
  { id: "mouth_strawberry_tint", name: "Gloss de Fresa", category: "dulces", price: 35, attractiveness: 4, charmNote: "Tono fresa jugoso muy dulce.", shape: "rose", lipColor: "#D95276", gloss: true },
  { id: "mouth_happy_kitty", name: "Gatito Feliz :D", category: "dulces", price: 30, attractiveness: 4, charmNote: "Gesto juguetón que contagia alegría.", shape: "cat", lipColor: "#E86B92", wide: true },

  // Coquetos (13)
  { id: "mouth_smirk_soft", name: "Media Sonrisa Coqueta", category: "coquetos", price: 0, attractiveness: 3, charmNote: "Una comisura levantada con picardía.", shape: "smirk", lipColor: "#D9758B" },
  { id: "mouth_heart_lips", name: "Labios Corazón", category: "coquetos", price: 0, attractiveness: 4, charmNote: "Forma de corazón brillante en tono cereza.", shape: "heart", lipColor: "#DF587E", gloss: true },
  { id: "mouth_bite_lip", name: "Mordiendo el Labio", category: "coquetos", price: 25, attractiveness: 5, charmNote: "Gesto coqueto e irresistible.", shape: "bite", lipColor: "#D65B7A", gloss: true },
  { id: "mouth_gloss_cherry", name: "Labios Cereza Gloss", category: "coquetos", price: 30, attractiveness: 5, charmNote: "Acabado brillante de pasarela.", shape: "heart", lipColor: "#C43B62", gloss: true },
  { id: "mouth_whistle_flirt", name: "Silbido Pícaro", category: "coquetos", price: 25, attractiveness: 3, charmNote: "Gesto travieso como quien no quiere la cosa.", shape: "whistle", lipColor: "#E07D96" },
  { id: "mouth_smirk_gloss", name: "Sonrisa Ladina con Gloss", category: "coquetos", price: 35, attractiveness: 5, charmNote: "Seguridad atractiva con tinte suave.", shape: "smirk", lipColor: "#CE5578", gloss: true },
  { id: "mouth_kiss_pout", name: "Puchero Beso", category: "coquetos", price: 35, attractiveness: 5, charmNote: "Labios fruncidos pidiendo atención.", shape: "pout", lipColor: "#DB5379", gloss: true },
  { id: "mouth_velvet_rose", name: "Terciopelo Vino", category: "coquetos", price: 40, attractiveness: 5, charmNote: "Labios aterciopelados tono vino rosado.", shape: "heart", lipColor: "#9E3B56", gloss: true },
  { id: "mouth_teasing_cat", name: "Gatito Travieso", category: "coquetos", price: 30, attractiveness: 4, charmNote: "Curva felina con sonrisa ladina.", shape: "cat", lipColor: "#C95D7E", wide: true },
  { id: "mouth_coral_kiss", name: "Coral Seductor", category: "coquetos", price: 30, attractiveness: 4, charmNote: "Tono coral luminoso con comisura arriba.", shape: "smile", lipColor: "#E66E67", gloss: true },
  { id: "mouth_plum_tint", name: "Ciruela Nocturna", category: "coquetos", price: 45, attractiveness: 6, charmNote: "Color ciruela sofisticado de cita nocturna.", shape: "rose", lipColor: "#8E3356", gloss: true },
  { id: "mouth_chuckle", name: "Risita Cómplice", category: "coquetos", price: 30, attractiveness: 4, charmNote: "Risa breve mirando de reojo.", shape: "open_soft", lipColor: "#D96686", wide: true },
  { id: "mouth_muse_lips", name: "Labios Musa", category: "coquetos", price: 50, attractiveness: 6, charmNote: "Volumen equilibrado y brillo natural.", shape: "heart", lipColor: "#E06D8B", gloss: true, wide: true },

  // Actitud (13)
  { id: "mouth_cool_line", name: "Línea Seria Chic", category: "actitud", price: 0, attractiveness: 3, charmNote: "Expresión serena de modelo editorial.", shape: "straight", lipColor: "#C98D93" },
  { id: "mouth_vamp_fang", name: "Colmillo Coqueto", category: "actitud", price: 0, attractiveness: 4, charmNote: "Pequeño colmillo blanco que asoma al sonreír.", shape: "fang", lipColor: "#D9758B" },
  { id: "mouth_smug_idol", name: "Mueca Confiada", category: "actitud", price: 25, attractiveness: 4, charmNote: "Sonrisa ladeada de quien sabe que gusta.", shape: "smirk", lipColor: "#C9808A", wide: true },
  { id: "mouth_stoic_ceo", name: "Recta Imperturbable", category: "actitud", price: 20, attractiveness: 3, charmNote: "Frialdad elegante de chaebol.", shape: "straight", lipColor: "#B87D84" },
  { id: "mouth_grumpy_cute", name: "Enojito Tierno", category: "actitud", price: 25, attractiveness: 3, charmNote: "Puchero molesto pero adorable.", shape: "wavy", lipColor: "#C47782" },
  { id: "mouth_badboy_fang", name: "Colmillo Rebelde", category: "actitud", price: 35, attractiveness: 5, charmNote: "Sonrisa atrevida de chico peligroso.", shape: "fang", lipColor: "#BA5E72", wide: true },
  { id: "mouth_poker_face", name: "Poker Face", category: "actitud", price: 20, attractiveness: 2, charmNote: "Neutral y minimalista al extremo.", shape: "dot", lipColor: "#B37A80" },
  { id: "mouth_side_scoff", name: "Risa Irónica", category: "actitud", price: 30, attractiveness: 4, charmNote: "Ligero gesto burlón lleno de carisma.", shape: "smirk", lipColor: "#B56E78" },
  { id: "mouth_dark_cherry", name: "Cereza Oscura Gótica", category: "actitud", price: 40, attractiveness: 5, charmNote: "Labios oscuros intensos.", shape: "straight", lipColor: "#78283B", gloss: true },
  { id: "mouth_tsundere_pout", name: "Puchero Tsundere", category: "actitud", price: 30, attractiveness: 4, charmNote: "Finge que no le importa pero sí le importa.", shape: "pout", lipColor: "#D17D8C" },
  { id: "mouth_chill_dude", name: "Relajado Urbano", category: "actitud", price: 25, attractiveness: 3, charmNote: "Trazo tranquilo natural de streetwear.", shape: "straight", lipColor: "#D19498", wide: true },
  { id: "mouth_dangerous_grin", name: "Sonrisa Peligrosa", category: "actitud", price: 45, attractiveness: 6, charmNote: "Casi un reto en forma de sonrisa.", shape: "fang", lipColor: "#A63E55", gloss: true, wide: true },
  { id: "mouth_unimpressed", name: "Sin Impresionarse", category: "actitud", price: 20, attractiveness: 2, charmNote: "Línea corta plana de humor seco.", shape: "straight", lipColor: "#A8747B" },

  // Expresivos (13)
  { id: "mouth_bright_laugh", name: "Carcajada Radiante", category: "expresivos", price: 0, attractiveness: 4, charmNote: "Risa abierta llena de vida.", shape: "open_happy", lipColor: "#E86888", wide: true },
  { id: "mouth_surprised_wow", name: "Sorpresa 'O'", category: "expresivos", price: 20, attractiveness: 3, charmNote: "Expresión sorprendida y espontánea.", shape: "open_soft", lipColor: "#DF728D" },
  { id: "mouth_singing_idol", name: "Cantando en Vivo", category: "expresivos", price: 35, attractiveness: 4, charmNote: "Boca abierta dulce como en concierto.", shape: "open_happy", lipColor: "#DB6082" },
  { id: "mouth_bubble_pout", name: "Mejillas Infladas", category: "expresivos", price: 25, attractiveness: 3, charmNote: "Gesto juguetón de enfado fingido.", shape: "whistle", lipColor: "#E37B96" },
  { id: "mouth_wavy_dramatic", name: "Onda Dramática", category: "expresivos", price: 20, attractiveness: 2, charmNote: "Ideal para reacciones cómicas de manhwa.", shape: "wavy", lipColor: "#C97589", wide: true },
  { id: "mouth_sparkle_grin", name: "Sonrisa Estelar Ancha", category: "expresivos", price: 35, attractiveness: 5, charmNote: "Sonrisa grande y contagiosa.", shape: "smile", lipColor: "#EA6F90", wide: true, gloss: true },
  { id: "mouth_playful_blep", name: "Lengüita Traviesa", category: "expresivos", price: 40, attractiveness: 5, charmNote: "Pequeño toque rosado juguetón.", shape: "bite", lipColor: "#F2799D", gloss: true },
  { id: "mouth_warm_hum", name: "Tarareo Suave", category: "expresivos", price: 25, attractiveness: 3, charmNote: "Curva suave como quien tararea una balada.", shape: "cat", lipColor: "#E08498" },
  { id: "mouth_excited_cat", name: "Gatito Emocionado", category: "expresivos", price: 35, attractiveness: 4, charmNote: "Doble onda feliz de máxima ilusión.", shape: "cat", lipColor: "#EB6A94", wide: true, gloss: true },
  { id: "mouth_shy_sigh", name: "Suspiro Romántico", category: "expresivos", price: 30, attractiveness: 4, charmNote: "Labios entreabiertos en pleno flechazo.", shape: "open_soft", lipColor: "#E3688A", gloss: true },
  { id: "mouth_mocha_smile", name: "Sonrisa Café Tibio", category: "expresivos", price: 25, attractiveness: 3, charmNote: "Tono cálido natural muy acogedor.", shape: "smile", lipColor: "#C97C75", wide: true },
  { id: "mouth_crimson_smile", name: "Sonrisa Carmesí", category: "expresivos", price: 45, attractiveness: 5, charmNote: "Rojo vibrante seguro y luminoso.", shape: "open_happy", lipColor: "#C93B5B", gloss: true, wide: true },
  { id: "mouth_idol_wink_smile", name: "Sonrisa Finale", category: "expresivos", price: 50, attractiveness: 6, charmNote: "El gesto perfecto de cierre en escenario.", shape: "heart", lipColor: "#EC6E94", gloss: true, wide: true },
];

export const MOUTH_SPEC_MAP: Record<string, MouthSpec> = Object.fromEntries(
  MOUTH_SPECS.map((m) => [m.id, m])
);

// =====================================================================
// 20 ACCESSORIES (incluyendo todos los detalles de las 10 fotos)
// =====================================================================
export const ACCESSORY_SPECS: WardrobeItem[] = [
  { id: "acc_none", category: "accessory", section: "unisex", value: "none", name: "Sin Accesorio", price: 0, charmNote: "Apariencia limpia y natural sin adornos.", attractiveness: 0 },
  { id: "acc_round_glasses", category: "accessory", section: "unisex", value: "round_glasses", name: "Lentes Redondos", price: 0, charmNote: "Montura fina intelectual y adorable.", attractiveness: 3 },
  { id: "acc_diadema_perlas", category: "accessory", section: "chicas", value: "diadema_perlas", name: "Diadema Blanca & Aretes Perla", price: 0, charmNote: "Diadema pulcra con pendientes nacarados.", attractiveness: 5 },
  { id: "acc_gorra_negra", category: "accessory", section: "chicos", value: "gorra_negra", name: "Gorra Negra Urbana", price: 0, charmNote: "Gorra negra minimalista con detalle blanco lateral.", attractiveness: 5 },
  { id: "acc_boina_crema", category: "accessory", section: "unisex", value: "boina_crema", name: "Boina Crema Artista", price: 0, charmNote: "Boina esponjosa color crema de estudio en Hongdae.", attractiveness: 5 },
  { id: "acc_pastel_headphones", category: "accessory", section: "unisex", value: "pastel_headphones", name: "Audífonos Blancos Anchos", price: 0, charmNote: "Diadema acolchada amplia de productor musical.", attractiveness: 5 },
  { id: "acc_brote_verde", category: "accessory", section: "unisex", value: "brote_verde", name: "Brotecito Verde & Osito", price: 0, charmNote: "Hoja verde flotante + osito de peluche en mano.", attractiveness: 5 },
  { id: "acc_conejito_blanco", category: "accessory", section: "chicas", value: "conejito_blanco", name: "Conejito Blanco de Peluche", price: 0, charmNote: "Tierno conejito blanco con corazón rosado.", attractiveness: 6 },
  { id: "acc_arete_cruz", category: "accessory", section: "chicos", value: "arete_cruz", name: "Arete de Cruz Negra", price: 25, charmNote: "Pendiente colgante oscuro de estilo streetwear.", attractiveness: 5 },
  { id: "acc_aretes_plata", category: "accessory", section: "chicos", value: "aretes_plata", name: "Aretes Colgantes de Plata", price: 30, charmNote: "Pendientes dobles plateados de estrella K-pop.", attractiveness: 5 },
  { id: "acc_boina_negra", category: "accessory", section: "unisex", value: "boina_negra", name: "Boina Negra París", price: 30, charmNote: "Elegancia francesa de taller artístico.", attractiveness: 5 },
  { id: "acc_star_pin", category: "accessory", section: "chicas", value: "star_pin", name: "Broche Estrella Amarilla", price: 25, charmNote: "Pasador dorado vibrante en el flequillo.", attractiveness: 4 },
  { id: "acc_broche_corazon", category: "accessory", section: "chicas", value: "broche_corazon", name: "Broche Corazón Rosa", price: 25, charmNote: "Pasador romántico de corazón en el flequillo.", attractiveness: 4 },
  { id: "acc_cherry_ribbon", category: "accessory", section: "chicas", value: "cherry_ribbon", name: "Cinta de Cerezo", price: 25, charmNote: "Lazo rosado delicado que ilumina cualquier peinado.", attractiveness: 4 },
  { id: "acc_osito_peluche", category: "accessory", section: "unisex", value: "osito_peluche", name: "Osito de Peluche", price: 35, charmNote: "Tierno osito café colgando de tu mano.", attractiveness: 6 },
  { id: "acc_bufanda_otono", category: "accessory", section: "unisex", value: "bufanda_otono", name: "Bufanda Otoño Beige", price: 30, charmNote: "Bufanda tejida tibia de drama coreano.", attractiveness: 4 },
  { id: "acc_lentes_rect", category: "accessory", section: "chicos", value: "lentes_rect", name: "Lentes Rectangulares K-Pop", price: 35, charmNote: "Montura fina rectangular de estilo editorial.", attractiveness: 5 },
  { id: "acc_choker_negro", category: "accessory", section: "unisex", value: "choker_negro", name: "Choker Urbano Plata", price: 40, charmNote: "Gargantilla negra con dije plateado central.", attractiveness: 5 },
  { id: "acc_artist_beret", category: "accessory", section: "chicas", value: "artist_beret", name: "Boina Rosa Pétalo", price: 35, charmNote: "Aire romántico parisino-seulense.", attractiveness: 4 },
  { id: "acc_broche_estrella", category: "accessory", section: "unisex", value: "broche_estrella", name: "Broche Destello Doble", price: 35, charmNote: "Brillo sutil dorado en el cabello.", attractiveness: 4 },
];

// Unified flat WARDROBE_ITEMS array (54 Outfits + 54 Hairs + 52 Eyes + 52 Mouths + 20 Accessories = 232 items)
export const WARDROBE_ITEMS: WardrobeItem[] = [
  ...OUTFIT_SPECS.map((o) => ({
    id: `outfit_${o.id}`,
    category: "outfit" as const,
    section: o.section,
    value: o.id,
    name: o.name,
    price: o.price,
    charmNote: o.charmNote,
    attractiveness: o.attractiveness,
  })),
  ...HAIR_SPECS.map((h) => ({
    id: `hair_${h.id}`,
    category: "hair" as const,
    section: h.section,
    value: h.id,
    name: h.name,
    price: h.price,
    charmNote: h.charmNote,
    attractiveness: h.attractiveness,
  })),
  ...EYE_SPECS.map((e) => ({
    id: `eye_${e.id}`,
    category: "eye" as const,
    section: "unisex" as const,
    value: e.id,
    name: e.name,
    price: e.price,
    charmNote: e.charmNote,
    attractiveness: e.attractiveness,
  })),
  ...MOUTH_SPECS.map((m) => ({
    id: `mouth_${m.id}`,
    category: "mouth" as const,
    section: "unisex" as const,
    value: m.id,
    name: m.name,
    price: m.price,
    charmNote: m.charmNote,
    attractiveness: m.attractiveness,
  })),
  ...ACCESSORY_SPECS,
];
