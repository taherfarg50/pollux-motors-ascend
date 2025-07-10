/**
 * Car Image Utilities for Pollux Motors
 * Auto-updated mapping based on actual folders
 * Generated on: 2025-06-30 16:39:54
 */

/**
 * Get normalized car name for lookup
 */
function normalizeCarName(carName: string): string {
  return carName
    .toUpperCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Map of car names to their folder names in public/media/cars
 */
const carFolderMap: Record<string, string> = {
  'ACADIA': 'acadia',
  'ALPHARD 2024': 'alphard_2024',
  'AUDI Q3': 'audi_q3_for_delivery_deliverd_30_may_2025',
  'BMW X6M 2023': 'bmw_x6m_2023',
  'BMW X6 M COMPETITION': 'bmw_x6_m_competition_petrol_2024',
  'BYD BY SONG': 'byd_by_song',
  'BYD BY SONG LLL': 'byd_by_song_lll',
  'BYD DOLPHIN': 'byd_dolphin',
  'CADILLAC ESCALADE': 'cadillac_escalade_600_petrol_2023',
  'LAND CRUISER HYBRID': 'canadian_land_cruiser_hybrid_1958_trim_2024',
  'CHERY ARRIZO 6 PRO': 'chery_arrizo_6_pro_15l_2024_model_zero_kilometer_gcc_specification_export_price',
  'TOYOTA COROLLA': 'toyota_corolla_15l_petrol_2025',
  'COSTER 42L DSL 25': 'coster_42l_dsl_25',
  'DODGE RAM 1500': 'dodge_ram_1500_crew_limited_cab_4x4_petrol_2025',
  'EXR DESIEL 2023': 'exr_desiel_2023',
  'G63 2022': 'g63_2022',
  'GXR 35L PTR TT 2022 WHITE': 'gxr_35l_ptr_tt_2022_white',
  'G 63 BRAUBS 800 2022 USED': 'g_63_braubs_800_2022_used',
  'HILUX 24L DSL AT 2024': 'hilux_24l_dsl_at_2024',
  'HILUX 24L DSL MT 4X2 23': 'hilux_24l_dsl_mt_4x2_23',
  'HILUX 24L DSL MT DIF 25': 'hilux_24l_dsl_mt_dif_25',
  'HILUX ADV': 'hilux_adv',
  'HILUX DC 24L DSL 4X4 MT GCC 24': 'hilux_dc_24l_dsl_4x4_mt_gcc_24',
  'HILUX DC 24L DSL 4X4 MT GCC 25': 'hilux_dc_24l_dsl_4x4_mt_gcc_25',
  'HILUX GR 28L DSL 24': 'hilux_gr_28l_dsl_24',
  'HILUX عماني': 'hilux_عماني',
  'HONDA E:NS1': 'honda_e_ns1_2023',
  'HYUNDAI CRETA': 'hyundai_creta_15l_mid_2024at_ptr',
  'HYUNDAI ELENTRA': 'hyundai_elentra_2025',
  'HYUNDAI H-100': 'hyundai_h_100',
  'HYUNDAI TUCSON': 'hyundai_tucson_16l_petrol_2023',
  'ISUZU 4 TON': 'isuzu_4_ton_2024',
  'ISUZU D-MAX': 'isuzu_d_max_pickup_truck_2024_model_fully_loaded_30_cc_engine_price_109000_dirhams',
  'ISUZU D MAX SINGLE CABIN 25 MADE IN INDIA': 'isuzu_d_max_single_cabin_25_made_in_india',
  'JETOUR T2': 'jetour_t2',
  'KIA': 'kia',
  'KIA KX1': 'kia_kx1_petrol_2025',
  'KIA PICNTO': 'kia_picnto',
  'KIA SONET': 'kia_sonet_15l_petrol_2025',
  'KIA SPORTAGE 15L DESIEL 2025': 'kia_sportage_15l_desiel_2025',
  'KIA SPORTAGE': 'kia_sportage_2025_white',
  'L200 SPORTERO 2024': 'l200_sportero_2024',
  'LAMBORGHINI URUS': 'lamborghini_urus_graphite_capsule',
  'LAND': 'land',
  'LAND ROVER DEFENDER': 'land_rover_defender_40l_v8_petrol_2023',
  'LC 79 DC 40L PTR V6 GCC 25': 'lc_79_dc_40l_ptr_v6_gcc_25',
  'LC 79 DC 45L DSL V8 GCC GRAY 24': 'lc_79_dc_45l_dsl_v8_gcc_gray_24',
  'LC 79 DC 45L DSL V8 GCC SILVER 24': 'lc_79_dc_45l_dsl_v8_gcc_silver_24',
  'LC GXR G DSL BLACK 24': 'lc_gxr_g_dsl_black_24',
  'TOYOTA LAND CRUISER': 'lc_gxr_g_dsl_white_2024',
  'LC GXR V DSL BLACK 24': 'lc_gxr_v_dsl_black_24',
  'LC GXR V DSL WHITE 24': 'lc_gxr_v_dsl_white_24',
  'LEXUS 600 MODEL 24SIGNATURE': 'lexus_600_model_24signature',
  'LEXUS LX600': 'lexus_lx600_petrol_2024',
  'LEXUS LX600 VIP 35L 4WD SUV 2024 MANGANESE LUSTER': 'lexus_lx600_vip_35l_4wd_suv_2024_manganese_luster',
  'LEXUS RX350': 'lxues_rx350_petrol_2024',
  'MERCEDES A200': 'mercedes_a200_15l_petrol_2024',
  'MERCEDES CLA 200 PETROL 2024 BLACK': 'mercedes_cla_200_petrol_2024_black',
  'MERCEDES CLA 200': 'mercedes_cla_200_petrol_2024_silver',
  'MERCEDES G63': 'mercedes_g63_petrol_2022',
  'MERCEDES S580': 'mercedes_s580_40l_petrol_2024',
  'MG ZS': 'mg_zs_2024',
  'NISSAN KICKS': 'nissan_kicks_s_petrol_2024',
  'PEUGEOT 2008': 'peugeot_2008_12l_2022_white',
  'PEUGEOT 3008 16L 2022 RED': 'peugeot_3008_16l_2022_red',
  'PEUGEOT 3008': 'peugeot_3008_16l_2022_silver',
  'PEUGEOT 3008 GT 16L 2022 BLUE': 'peugeot_3008_gt_16l_2022_blue',
  'PORSCHE 911': 'porsche_911',
  'RAM LIMIDIED 25': 'ram_limidied_25',
  'ROLLS ROYS': 'rolls_roys',
  'ROLLS ROYCE CULLINAN': 'rolls_roys_cullinan_petrol_2024',
  'SKODA KODIAQ 15 L 2024 MODEL FULL OPTION ZERO KILOMETER EUROPE SPECIFICATION PRICE FOR EXPORT': 'skoda_kodiaq_15_l_2024_model_full_option_zero_kilometer_europe_specification_price_for_export',
  'SPORTAGE 16 2024': 'sportage_16_2024',
  'SUZUKI SWIFT': 'swift_glx_2025',
  'TOYOTA COASTER 42L DIESEL 23 SEATS 2024 MODEL PRICE FOR EXPORT': 'toyota_coaster_42l_diesel_23_seats_2024_model_price_for_export',
  'TOYOTA COROLLA 16L PETROL 2024': 'toyota_corolla_16l_petrol_2024',
  'TOYOTA HARDTOP LC76 45L DIESEL MANUAL MODEL 2024': 'toyota_hardtop_lc76_45l_diesel_manual_model_2024',
  'TOYOTA HICE 28L DIESEL': 'toyota_hice_28l_diesel',
  'TOYOTA HILUX 24L DIESLA MT WITH DIFF LOCK 2024 MODEL': 'toyota_hilux_24l_diesla_mt_with_diff_lock_2024_model',
  'TOYOTA HILUX 27L PTR 2025': 'toyota_hilux_27l_ptr_2025',
  'TOYOTA HILUX ADVENTURE 28L DIESEL 2023': 'toyota_hilux_adventure_28l_diesel_2023',
  'TOYOTA HILUX ADVENTURE 28L DIESEL MANUAL 2023': 'toyota_hilux_adventure_28l_diesel_manual_2023',
  'TOYOTA HILUX': 'toyota_hilux_dlx_24l_4wd_at_diesel_pickup_2024',
  'TOYOTA HILUX GR 28L DIESEL 4WD PICKUP 2024': 'toyota_hilux_gr_28l_diesel_4wd_pickup_2024',
  'TOYOTA LAND CRUISER DC 42L V6 DEISEL 2022': 'toyota_land_cruiser_dc_42l_v6_deisel_2022',
  'TOYOTA LAND CRUISER EXR 33L DEISEL 2022': 'toyota_land_cruiser_exr_33l_deisel_2022',
  'TOYOTA LAND CRUISER GR 33L DIESEL 2024': 'toyota_land_cruiser_gr_33l_diesel_2024',
  'TOYOTA LAND CRUISER VXR 40L PETROL 2024': 'toyota_land_cruiser_vxr_40l_petrol_2024',
  'TOYOTA LAND CRUISER VX 40L PETROL 2022 GOLD': 'toyota_land_cruiser_vx_40l_petrol_2022_gold',
  'TOYOTA LC79 SC DSL 28L AT 2024': 'toyota_lc79_sc_dsl_28l_at_2024',
  'TOYOTA PRADO 250 TXL 28L DIESEL 2024': 'toyota_prado_250_txl_28l_diesel_2024',
  'TOYOTA PRADO': 'toyota_prado_txl_27l_2023',
  'TOYOTA PRADO VX 27L PETROL 2023': 'toyota_prado_vx_27l_petrol_2023',
  'TOYOTA RAIZE 10L PETROL 2023 WHITE': 'toyota_raize_10l_petrol_2023_white',
  'TOYOTA RIZE 12L PETROL 2023': 'toyota_rize_12l_petrol_2023',
  'TOYOTA RUSH 15L PETROL 2023': 'toyota_rush_15l_petrol_2023',
  'TOYOTA RUSH 2023': 'toyota_rush_2023',
  'TOYOTA SEQUOIA LIMITED WHITE 2024': 'toyota_sequoia_limited_white_2024',
  'TOYOTA TUNDRA TRD PRO 2024': 'toyota_tundra_trd_pro_2024',
  'TOYTOA RIZE 10L PETROL 2023': 'toytoa_rize_10l_petrol_2023',
  'TUCSON 16 2024': 'tucson_16_2024',
  'TUCSON 20L DIESEL 2023': 'tucson_20l_diesel_2023',
  'TUNDRA 2025': 'tundra_2025',
  'VOLKSWAGEN T.ROC': 'volkswagen_troc_20l_petrol_2024'
};

/**
 * Detect the correct image extension for a folder using car data
 */
function detectImageExtension(folderName: string): string {
  // Find car data for this folder
  const carData = CAR_DATA;
  for (const [carName, data] of Object.entries(carData)) {
    if (data.folder === folderName) {
      return data.first_image_ext;
    }
  }
  
  // Fallback to common extensions by folder patterns
  const extensionMap: Record<string, string> = {
    'acadia': 'jpg',
    'bmw': 'jpeg',
    'mercedes': 'jpeg', 
    'toyota': 'jpeg',
    'lexus': 'jpeg',
    'rolls_roys': 'png',
    'lamborghini': 'png',
    'g63': 'png',
    'byd': 'png'
  };
  
  const lowerFolder = folderName.toLowerCase();
  
  for (const [pattern, ext] of Object.entries(extensionMap)) {
    if (lowerFolder.includes(pattern)) {
      return ext;
    }
  }
  
  // Default to jpg
  return 'jpg';
}

/**
 * Get the folder name for a car
 */
export function getCarFolder(carName: string): string | null {
  const normalized = normalizeCarName(carName);
  
  // Direct match
  if (carFolderMap[normalized]) {
    return carFolderMap[normalized];
  }
  
  // Partial match
  for (const [key, folder] of Object.entries(carFolderMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return folder;
    }
  }
  
  // Fuzzy match for common car names
  const variations = [
    normalized.replace(/\s+/g, ''),  // Remove spaces
    normalized.replace(/-/g, ' '),    // Replace dashes
    normalized.split(' ')[0],         // First word only
  ];
  
  for (const variation of variations) {
    for (const [key, folder] of Object.entries(carFolderMap)) {
      if (key.includes(variation) || variation.includes(key)) {
        return folder;
      }
    }
  }
  
  return null;
}

/**
 * Get hero image for a car (first image)
 */
export function getCarHeroImage(carName: string): string {
  const folder = getCarFolder(carName);
  
  if (!folder) {
    return '/media/images/placeholder-car.svg';
  }
  
  const ext = detectImageExtension(folder);
  
  // Try multiple naming patterns (images usually start from 0 or 1)
  const possibleNames = [
    `0.${ext}`,     // Start from 0
    `1.${ext}`,     // Or start from 1
    `0.jpg`,          // Common fallbacks
    `1.jpg`,
    `0.jpeg`,
    `1.jpeg`,
    `0.png`,
    `1.png`
  ];
  
  // Return the first possible image
  return `/media/cars/${folder}/${possibleNames[0]}`;
}

/**
 * Generate gallery URLs for a car
 */
export function generateCarGalleryUrls(carName: string, maxImages: number = 10): string[] {
  const folder = getCarFolder(carName);
  
  if (!folder) {
    return ['/media/images/placeholder-car.svg'];
  }
  
  const ext = detectImageExtension(folder);
  const gallery: string[] = [];
  
  // Generate URLs starting from 0
  for (let i = 0; i < maxImages; i++) {
    gallery.push(`/media/cars/${folder}/${i}.${ext}`);
  }
  
  // Add fallback images with different extensions
  if (gallery.length < 3) {
    const fallbackExts = ['jpg', 'jpeg', 'png'];
    for (const fallbackExt of fallbackExts) {
      if (fallbackExt !== ext) {
        for (let i = 0; i < 3; i++) {
          gallery.push(`/media/cars/${folder}/${i}.${fallbackExt}`);
        }
      }
    }
  }
  
  return gallery;
}

/**
 * Get car images based on context
 */
export function getCarImages(carName: string, context: 'hero' | 'featured' | 'listing' | 'detail' | 'similar' = 'listing'): string[] {
  const imageCountMap = {
    hero: 1,
    featured: 8,
    listing: 6,
    detail: 15,
    similar: 4
  };
  
  const maxImages = imageCountMap[context];
  return generateCarGalleryUrls(carName, maxImages);
}

/**
 * Check if a car has images available
 */
export function hasCarImages(carName: string): boolean {
  return getCarFolder(carName) !== null;
}

/**
 * Get all available car names
 */
export function getAvailableCarNames(): string[] {
  return Object.keys(carFolderMap);
}

/**
 * Get folder statistics
 */
export function getCarFolderStats(): {
  totalFolders: number;
  totalImages: number;
  averageImagesPerCar: number;
} {
  const totalFolders = Object.keys(carFolderMap).length;
  const totalImages = Object.values(CAR_DATA).reduce((sum: number, car: { image_count: number }) => sum + car.image_count, 0);
  const averageImagesPerCar = Math.round(totalImages / totalFolders);
  
  return {
    totalFolders,
    totalImages,
    averageImagesPerCar
  };
}

/**
 * Validate if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Export car folder mapping for debugging
export const CAR_FOLDERS = carFolderMap;

// Car data with image counts (for reference)
export const CAR_DATA: Record<string, {
  folder: string;
  image_count: number;
  first_image_ext: string;
  sample_images: string[];
}> = {
  "ACADIA": {
    "folder": "acadia",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpeg"
    ]
  },
  "ALPHARD 2024": {
    "folder": "alphard_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpg"
    ]
  },
  "AUDI Q3": {
    "folder": "audi_q3_for_delivery_deliverd_30_may_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "BMW X6M 2023": {
    "folder": "bmw_x6m_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "BMW X6 M COMPETITION": {
    "folder": "bmw_x6_m_competition_petrol_2024",
    "image_count": 10,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "BYD BY SONG": {
    "folder": "byd_by_song",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.jpg"
    ]
  },
  "BYD BY SONG LLL": {
    "folder": "byd_by_song_lll",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.jpg"
    ]
  },
  "BYD DOLPHIN": {
    "folder": "byd_dolphin",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.jpg"
    ]
  },
  "CADILLAC ESCALADE": {
    "folder": "cadillac_escalade_600_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LAND CRUISER HYBRID": {
    "folder": "canadian_land_cruiser_hybrid_1958_trim_2024",
    "image_count": 4,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "CHERY ARRIZO 6 PRO": {
    "folder": "chery_arrizo_6_pro_15l_2024_model_zero_kilometer_gcc_specification_export_price",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA COROLLA": {
    "folder": "toyota_corolla_15l_petrol_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "COSTER 42L DSL 25": {
    "folder": "coster_42l_dsl_25",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "DODGE RAM 1500": {
    "folder": "dodge_ram_1500_crew_limited_cab_4x4_petrol_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "EXR DESIEL 2023": {
    "folder": "exr_desiel_2023",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "G63 2022": {
    "folder": "g63_2022",
    "image_count": 10,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "GXR 35L PTR TT 2022 WHITE": {
    "folder": "gxr_35l_ptr_tt_2022_white",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "G 63 BRAUBS 800 2022 USED": {
    "folder": "g_63_braubs_800_2022_used",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.jpeg"
    ]
  },
  "HILUX 24L DSL AT 2024": {
    "folder": "hilux_24l_dsl_at_2024",
    "image_count": 4,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "3.png"
    ]
  },
  "HILUX 24L DSL MT 4X2 23": {
    "folder": "hilux_24l_dsl_mt_4x2_23",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "HILUX 24L DSL MT DIF 25": {
    "folder": "hilux_24l_dsl_mt_dif_25",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "HILUX ADV": {
    "folder": "hilux_adv",
    "image_count": 14,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "HILUX DC 24L DSL 4X4 MT GCC 24": {
    "folder": "hilux_dc_24l_dsl_4x4_mt_gcc_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "HILUX DC 24L DSL 4X4 MT GCC 25": {
    "folder": "hilux_dc_24l_dsl_4x4_mt_gcc_25",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "HILUX GR 28L DSL 24": {
    "folder": "hilux_gr_28l_dsl_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "HILUX عماني": {
    "folder": "hilux_عماني",
    "image_count": 16,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "HONDA E:NS1": {
    "folder": "honda_e_ns1_2023",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "HYUNDAI CRETA": {
    "folder": "hyundai_creta_15l_mid_2024at_ptr",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "HYUNDAI ELENTRA": {
    "folder": "hyundai_elentra_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "HYUNDAI H-100": {
    "folder": "hyundai_h_100",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "HYUNDAI TUCSON": {
    "folder": "hyundai_tucson_16l_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "ISUZU 4 TON": {
    "folder": "isuzu_4_ton_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "ISUZU D-MAX": {
    "folder": "isuzu_d_max_pickup_truck_2024_model_fully_loaded_30_cc_engine_price_109000_dirhams",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "ISUZU D MAX SINGLE CABIN 25 MADE IN INDIA": {
    "folder": "isuzu_d_max_single_cabin_25_made_in_india",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "JETOUR T2": {
    "folder": "jetour_t2",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "KIA": {
    "folder": "kia",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "KIA KX1": {
    "folder": "kia_kx1_petrol_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "KIA PICNTO": {
    "folder": "kia_picnto",
    "image_count": 8,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "KIA SONET": {
    "folder": "kia_sonet_15l_petrol_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "KIA SPORTAGE 15L DESIEL 2025": {
    "folder": "kia_sportage_15l_desiel_2025",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "KIA SPORTAGE": {
    "folder": "kia_sportage_2025_white",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "L200 SPORTERO 2024": {
    "folder": "l200_sportero_2024",
    "image_count": 16,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "LAMBORGHINI URUS": {
    "folder": "lamborghini_urus_graphite_capsule",
    "image_count": 6,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "LAND": {
    "folder": "land",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "LAND ROVER DEFENDER": {
    "folder": "land_rover_defender_40l_v8_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC 79 DC 40L PTR V6 GCC 25": {
    "folder": "lc_79_dc_40l_ptr_v6_gcc_25",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC 79 DC 45L DSL V8 GCC GRAY 24": {
    "folder": "lc_79_dc_45l_dsl_v8_gcc_gray_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC 79 DC 45L DSL V8 GCC SILVER 24": {
    "folder": "lc_79_dc_45l_dsl_v8_gcc_silver_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC GXR G DSL BLACK 24": {
    "folder": "lc_gxr_g_dsl_black_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA LAND CRUISER": {
    "folder": "lc_gxr_g_dsl_white_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC GXR V DSL BLACK 24": {
    "folder": "lc_gxr_v_dsl_black_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LC GXR V DSL WHITE 24": {
    "folder": "lc_gxr_v_dsl_white_24",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LEXUS 600 MODEL 24SIGNATURE": {
    "folder": "lexus_600_model_24signature",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LEXUS LX600": {
    "folder": "lexus_lx600_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "LEXUS LX600 VIP 35L 4WD SUV 2024 MANGANESE LUSTER": {
    "folder": "lexus_lx600_vip_35l_4wd_suv_2024_manganese_luster",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "LEXUS RX350": {
    "folder": "lxues_rx350_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "MERCEDES A200": {
    "folder": "mercedes_a200_15l_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpeg"
    ]
  },
  "MERCEDES CLA 200 PETROL 2024 BLACK": {
    "folder": "mercedes_cla_200_petrol_2024_black",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "MERCEDES CLA 200": {
    "folder": "mercedes_cla_200_petrol_2024_silver",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "MERCEDES G63": {
    "folder": "mercedes_g63_petrol_2022",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.png"
    ]
  },
  "MERCEDES S580": {
    "folder": "mercedes_s580_40l_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "MG ZS": {
    "folder": "mg_zs_2024",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.jpeg"
    ]
  },
  "NISSAN KICKS": {
    "folder": "nissan_kicks_s_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "PEUGEOT 2008": {
    "folder": "peugeot_2008_12l_2022_white",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "PEUGEOT 3008 16L 2022 RED": {
    "folder": "peugeot_3008_16l_2022_red",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "PEUGEOT 3008": {
    "folder": "peugeot_3008_16l_2022_silver",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "PEUGEOT 3008 GT 16L 2022 BLUE": {
    "folder": "peugeot_3008_gt_16l_2022_blue",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "PORSCHE 911": {
    "folder": "porsche_911",
    "image_count": 6,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "RAM LIMIDIED 25": {
    "folder": "ram_limidied_25",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "ROLLS ROYS": {
    "folder": "rolls_roys",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "ROLLS ROYCE CULLINAN": {
    "folder": "rolls_roys_cullinan_petrol_2024",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "SKODA KODIAQ 15 L 2024 MODEL FULL OPTION ZERO KILOMETER EUROPE SPECIFICATION PRICE FOR EXPORT": {
    "folder": "skoda_kodiaq_15_l_2024_model_full_option_zero_kilometer_europe_specification_price_for_export",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "SPORTAGE 16 2024": {
    "folder": "sportage_16_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "SUZUKI SWIFT": {
    "folder": "swift_glx_2025",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "TOYOTA COASTER 42L DIESEL 23 SEATS 2024 MODEL PRICE FOR EXPORT": {
    "folder": "toyota_coaster_42l_diesel_23_seats_2024_model_price_for_export",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA COROLLA 16L PETROL 2024": {
    "folder": "toyota_corolla_16l_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA HARDTOP LC76 45L DIESEL MANUAL MODEL 2024": {
    "folder": "toyota_hardtop_lc76_45l_diesel_manual_model_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA HICE 28L DIESEL": {
    "folder": "toyota_hice_28l_diesel",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpg"
    ]
  },
  "TOYOTA HILUX 24L DIESLA MT WITH DIFF LOCK 2024 MODEL": {
    "folder": "toyota_hilux_24l_diesla_mt_with_diff_lock_2024_model",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA HILUX 27L PTR 2025": {
    "folder": "toyota_hilux_27l_ptr_2025",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA HILUX ADVENTURE 28L DIESEL 2023": {
    "folder": "toyota_hilux_adventure_28l_diesel_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA HILUX ADVENTURE 28L DIESEL MANUAL 2023": {
    "folder": "toyota_hilux_adventure_28l_diesel_manual_2023",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA HILUX": {
    "folder": "toyota_hilux_dlx_24l_4wd_at_diesel_pickup_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA HILUX GR 28L DIESEL 4WD PICKUP 2024": {
    "folder": "toyota_hilux_gr_28l_diesel_4wd_pickup_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA LAND CRUISER DC 42L V6 DEISEL 2022": {
    "folder": "toyota_land_cruiser_dc_42l_v6_deisel_2022",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA LAND CRUISER EXR 33L DEISEL 2022": {
    "folder": "toyota_land_cruiser_exr_33l_deisel_2022",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA LAND CRUISER GR 33L DIESEL 2024": {
    "folder": "toyota_land_cruiser_gr_33l_diesel_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA LAND CRUISER VXR 40L PETROL 2024": {
    "folder": "toyota_land_cruiser_vxr_40l_petrol_2024",
    "image_count": 18,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "TOYOTA LAND CRUISER VX 40L PETROL 2022 GOLD": {
    "folder": "toyota_land_cruiser_vx_40l_petrol_2022_gold",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA LC79 SC DSL 28L AT 2024": {
    "folder": "toyota_lc79_sc_dsl_28l_at_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA PRADO 250 TXL 28L DIESEL 2024": {
    "folder": "toyota_prado_250_txl_28l_diesel_2024",
    "image_count": 10,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA PRADO": {
    "folder": "toyota_prado_txl_27l_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA PRADO VX 27L PETROL 2023": {
    "folder": "toyota_prado_vx_27l_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA RAIZE 10L PETROL 2023 WHITE": {
    "folder": "toyota_raize_10l_petrol_2023_white",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA RIZE 12L PETROL 2023": {
    "folder": "toyota_rize_12l_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TOYOTA RUSH 15L PETROL 2023": {
    "folder": "toyota_rush_15l_petrol_2023",
    "image_count": 20,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "TOYOTA RUSH 2023": {
    "folder": "toyota_rush_2023",
    "image_count": 12,
    "first_image_ext": "png",
    "sample_images": [
      "0.png",
      "0.png",
      "1.png"
    ]
  },
  "TOYOTA SEQUOIA LIMITED WHITE 2024": {
    "folder": "toyota_sequoia_limited_white_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYOTA TUNDRA TRD PRO 2024": {
    "folder": "toyota_tundra_trd_pro_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "TOYTOA RIZE 10L PETROL 2023": {
    "folder": "toytoa_rize_10l_petrol_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TUCSON 16 2024": {
    "folder": "tucson_16_2024",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TUCSON 20L DIESEL 2023": {
    "folder": "tucson_20l_diesel_2023",
    "image_count": 20,
    "first_image_ext": "jpeg",
    "sample_images": [
      "0.jpeg",
      "0.jpeg",
      "1.jpeg"
    ]
  },
  "TUNDRA 2025": {
    "folder": "tundra_2025",
    "image_count": 12,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  },
  "VOLKSWAGEN T.ROC": {
    "folder": "volkswagen_troc_20l_petrol_2024",
    "image_count": 20,
    "first_image_ext": "jpg",
    "sample_images": [
      "0.jpg",
      "0.jpg",
      "1.jpg"
    ]
  }
};
