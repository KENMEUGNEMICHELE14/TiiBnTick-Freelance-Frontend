/**
 * Données géographiques de l'Afrique Centrale
 * Pays, Régions/Provinces et Villes
 * TiiBnTick — Un système Yowyob
 */

export interface CityList {
  cities: string[];
}

export interface RegionMap {
  [regionKey: string]: {
    name: string;
    cities: string[];
  };
}

export interface CountryData {
  name: string;
  dialCode: string;
  flag: string;
  phoneDigits: number; // number of digits after country code
  defaultRegion: string;
  defaultCity: string;
  regions: RegionMap;
}

export interface CountriesMap {
  [countryKey: string]: CountryData;
}

export const CENTRAL_AFRICA_COUNTRIES: CountriesMap = {
  cameroun: {
    name: 'Cameroun',
    dialCode: '+237',
    flag: '🇨🇲',
    phoneDigits: 9,
    defaultRegion: 'centre',
    defaultCity: 'Yaoundé',
    regions: {
      centre: {
        name: 'Centre',
        cities: ['Yaoundé', 'Mbalmayo', 'Akonolinga', 'Bafia', 'Ntui', 'Mfou', 'Obala', 'Okola', 'Soa', 'Biyem-Assi', 'Essos', 'Nkolmesseng', 'Ekounou'],
      },
      littoral: {
        name: 'Littoral',
        cities: ['Douala', 'Edéa', 'Nkongsamba', 'Yabassi', 'Loum', 'Manjo', 'Mbanga', 'Mouanko', 'Bonabéri', 'Bassa', 'Akwa', 'Deïdo'],
      },
      ouest: {
        name: 'Ouest',
        cities: ['Bafoussam', 'Dschang', 'Bandjoun', 'Mbouda', 'Bangangté', 'Foumban', 'Kékem', 'Bafang', 'Foumbot'],
      },
      'nord-ouest': {
        name: 'Nord-Ouest',
        cities: ['Bamenda', 'Kumbo', 'Wum', 'Ndop', 'Mbengwi', 'Bali', 'Bafut', 'Nkambe', 'Santa'],
      },
      'sud-ouest': {
        name: 'Sud-Ouest',
        cities: ['Buéa', 'Limbe', 'Kumba', 'Mamfe', 'Tiko', 'Idenau', 'Fontem', 'Mundemba', 'Tombel'],
      },
      adamaoua: {
        name: 'Adamaoua',
        cities: ['Ngaoundéré', 'Meiganga', 'Tibati', 'Tignère', 'Banyo', 'Kontcha', 'Nganha'],
      },
      nord: {
        name: 'Nord',
        cities: ['Garoua', 'Guider', 'Figuil', 'Poli', 'Rey-Bouba', 'Tcholliré', 'Lagdo', 'Pitoa'],
      },
      'extreme-nord': {
        name: 'Extrême-Nord',
        cities: ['Maroua', 'Mokolo', 'Kousséri', 'Yagoua', 'Mora', 'Waza', 'Kaélé', 'Meri', 'Mindif', 'Tokombéré'],
      },
      est: {
        name: 'Est',
        cities: ['Bertoua', 'Batouri', 'Abong-Mbang', 'Yokadouma', 'Kenzou', 'Garoua-Boulaï', 'Nanga-Eboko', 'Belabo'],
      },
      sud: {
        name: 'Sud',
        cities: ['Ebolowa', 'Sangmélima', 'Kribi', 'Ambam', 'Lolodorf', 'Campo', 'Mvangane', 'Djoum', 'Meyomessala'],
      },
    },
  },

  gabon: {
    name: 'Gabon',
    dialCode: '+241',
    flag: '🇬🇦',
    phoneDigits: 8,
    defaultRegion: 'estuaire',
    defaultCity: 'Libreville',
    regions: {
      estuaire: {
        name: 'Estuaire',
        cities: ['Libreville', 'Owendo', 'Ntoum', 'Kango', 'Cocobeach'],
      },
      'haut-ogooue': {
        name: 'Haut-Ogooué',
        cities: ['Franceville', 'Moanda', 'Mounana', 'Okondja', 'Lékoni'],
      },
      'moyen-ogooue': {
        name: 'Moyen-Ogooué',
        cities: ['Lambaréné', 'Ndjolé', 'Bifoun'],
      },
      ngounié: {
        name: 'Ngounié',
        cities: ['Mouila', 'Fougamou', 'Ndendé', 'Mimongo'],
      },
      nyanga: {
        name: 'Nyanga',
        cities: ['Tchibanga', 'Moabi', 'Mayumba', 'Ndindi'],
      },
      'ogooue-ivindo': {
        name: 'Ogooué-Ivindo',
        cities: ['Makokou', 'Booué', 'Mékambo', 'Lopé'],
      },
      'ogooue-lolo': {
        name: 'Ogooué-Lolo',
        cities: ['Koulamoutou', 'Lastoursville'],
      },
      'ogooue-maritime': {
        name: 'Ogooué-Maritime',
        cities: ['Port-Gentil', 'Omboué', 'Gamba'],
      },
      'woleu-ntem': {
        name: 'Woleu-Ntem',
        cities: ['Oyem', 'Bitam', 'Mitzic', 'Minvoul'],
      },
    },
  },

  congo: {
    name: 'Congo (Brazzaville)',
    dialCode: '+242',
    flag: '🇨🇬',
    phoneDigits: 9,
    defaultRegion: 'brazzaville',
    defaultCity: 'Brazzaville',
    regions: {
      brazzaville: {
        name: 'Brazzaville',
        cities: ['Brazzaville', 'Bacongo', 'Makélékélé', 'Ouenzé', 'Poto-Poto', 'Moungali'],
      },
      'pointe-noire': {
        name: 'Pointe-Noire',
        cities: ['Pointe-Noire', 'Loandjili', 'Tié-Tié', 'Mongo-Poukou', 'Mvou-Mvou'],
      },
      pool: {
        name: 'Pool',
        cities: ['Kinkala', 'Boko', 'Kibangou', 'Kindamba'],
      },
      bouenza: {
        name: 'Bouenza',
        cities: ['Madingou', 'Nkayi', 'Loudima', 'Mfouati'],
      },
      cuvette: {
        name: 'Cuvette',
        cities: ['Owando', 'Makoua', 'Boundji', 'Fort-Rousset'],
      },
      kouilou: {
        name: 'Kouilou',
        cities: ['Dolisie', 'Hinda', 'Kayes', 'Mvouti'],
      },
      niari: {
        name: 'Niari',
        cities: ['Dolisie', 'Mossendjo', 'Kibangou', 'Divénié'],
      },
      plateaux: {
        name: 'Plateaux',
        cities: ['Djambala', 'Lékana', 'Abala', 'Gamboma'],
      },
      sangha: {
        name: 'Sangha',
        cities: ['Ouesso', 'Pokola', 'Sembe', 'Souanké'],
      },
      likouala: {
        name: 'Likouala',
        cities: ['Impfondo', 'Dongou', 'Betou', 'Enyellé'],
      },
    },
  },

  tchad: {
    name: 'Tchad',
    dialCode: '+235',
    flag: '🇹🇩',
    phoneDigits: 8,
    defaultRegion: 'ndjamena',
    defaultCity: "N'Djamena",
    regions: {
      ndjamena: {
        name: "N'Djamena",
        cities: ["N'Djamena", 'Farcha', 'Chagoua', 'Moursal', 'Toukra', 'Goudji'],
      },
      'chari-baguirmi': {
        name: 'Chari-Baguirmi',
        cities: ['Massenya', 'Bousso', 'Mandélia', 'Douguia'],
      },
      'logone-occidental': {
        name: 'Logone Occidental',
        cities: ['Moundou', 'Krim-Krim', 'Bénoye', 'Doba'],
      },
      'logone-oriental': {
        name: 'Logone Oriental',
        cities: ['Doba', 'Baibokoum', 'Beinamar', 'Goré'],
      },
      'mayo-kebbi-ouest': {
        name: 'Mayo-Kebbi Ouest',
        cities: ['Pala', 'Léré', 'Fianga', 'Gounou-Gaya'],
      },
      'mayo-kebbi-est': {
        name: 'Mayo-Kebbi Est',
        cities: ["Bongor", 'Guelendeng', 'Gounou-Gaya'],
      },
      ouaddai: {
        name: 'Ouaddaï',
        cities: ["Abéché", 'Adré', 'Biltine', 'Goz Béïda'],
      },
      'batha': {
        name: 'Batha',
        cities: ['Ati', 'Oum Hadjer', 'Mangalmé'],
      },
      'kanem': {
        name: 'Kanem',
        cities: ['Mao', 'Moussoro', 'Nokou'],
      },
      lac: {
        name: 'Lac',
        cities: ['Bol', 'Bagasola', 'Liwa'],
      },
    },
  },

  rca: {
    name: 'République Centrafricaine',
    dialCode: '+236',
    flag: '🇨🇫',
    phoneDigits: 8,
    defaultRegion: 'bangui',
    defaultCity: 'Bangui',
    regions: {
      bangui: {
        name: 'Bangui',
        cities: ['Bangui', 'Bangui 1', 'Bangui 2', 'Bangui 3', 'Bangui 4', 'Bangui 5', 'Bangui 6', 'Bangui 7', 'Bangui 8'],
      },
      'ombella-mpoko': {
        name: "Ombella-M'Poko",
        cities: ["Bimbo", 'Damara', 'Boali', 'Yaloke', 'Bossembélé'],
      },
      lobaye: {
        name: 'Lobaye',
        cities: ["M'Baïki", 'Mbaïki', 'Boda', 'Mongoumba', 'Boganda'],
      },
      'mambere-kadei': {
        name: 'Mambéré-Kadéï',
        cities: ['Berbérati', 'Gamboula', 'Nola', 'Carnot'],
      },
      nana: {
        name: 'Nana-Mambéré',
        cities: ['Bouar', 'Baboua', 'Garoua-Boulaï', 'Abba'],
      },
      ouham: {
        name: 'Ouham',
        cities: ['Bossangoa', 'Batangafo', 'Bouca', 'Nana-Barya'],
      },
      vakaga: {
        name: 'Vakaga',
        cities: ['Birao', 'Gordil', 'Tiringoulou'],
      },
    },
  },

  guinee_equatoriale: {
    name: 'Guinée Équatoriale',
    dialCode: '+240',
    flag: '🇬🇶',
    phoneDigits: 9,
    defaultRegion: 'bioko-norte',
    defaultCity: 'Malabo',
    regions: {
      'bioko-norte': {
        name: 'Bioko Norte',
        cities: ['Malabo', 'Rebola', 'Basupú', 'Punta Europa'],
      },
      'bioko-sur': {
        name: 'Bioko Sur',
        cities: ['Luba', 'Riaba', 'Moka'],
      },
      litoral: {
        name: 'Litoral',
        cities: ['Bata', 'Mbini', 'Cogo', 'Niefang'],
      },
      'centro-sur': {
        name: 'Centro Sur',
        cities: ['Evinayong', 'Acurenam', 'Nsork'],
      },
      'kie-ntem': {
        name: 'Kié-Ntem',
        cities: ['Ebebiyín', 'Mongomo', 'Nsork'],
      },
      'wele-nzas': {
        name: 'Wele-Nzas',
        cities: ['Añisoc', 'Mongomo', 'Ayene', 'Akonibe'],
      },
    },
  },

  rdc: {
    name: 'RDC (Congo-Kinshasa)',
    dialCode: '+243',
    flag: '🇨🇩',
    phoneDigits: 9,
    defaultRegion: 'kinshasa',
    defaultCity: 'Kinshasa',
    regions: {
      kinshasa: {
        name: 'Kinshasa',
        cities: ['Kinshasa', 'Gombe', 'Limete', 'Ngaliema', 'Kalamu', 'Lemba', 'Kintambo', 'Barumbu', 'Kasa-Vubu', 'Maluku'],
      },
      'kongo-central': {
        name: 'Kongo-Central',
        cities: ['Matadi', 'Boma', 'Mbanza-Ngungu', 'Songololo', 'Lukula'],
      },
      'haut-katanga': {
        name: 'Haut-Katanga',
        cities: ['Lubumbashi', 'Likasi', 'Kipushi', 'Kasenga', 'Sakania'],
      },
      'nord-kivu': {
        name: 'Nord-Kivu',
        cities: ['Goma', 'Beni', 'Butembo', 'Rutshuru', 'Masisi'],
      },
      'sud-kivu': {
        name: 'Sud-Kivu',
        cities: ['Bukavu', 'Uvira', 'Shabunda', 'Fizi', 'Mwenga'],
      },
      ituri: {
        name: 'Ituri',
        cities: ['Bunia', 'Mahagi', 'Djugu', 'Irumu', 'Mambasa'],
      },
      kasai: {
        name: 'Kasaï',
        cities: ['Tshikapa', 'Ilebo', 'Mweka', 'Dekese'],
      },
      lomami: {
        name: 'Lomami',
        cities: ['Kabinda', 'Kamiji', 'Kole', 'Lubao'],
      },
      tanganyika: {
        name: 'Tanganyika',
        cities: ['Kalemie', 'Kongolo', 'Manono', 'Moba'],
      },
      equateur: {
        name: 'Équateur',
        cities: ['Mbandaka', 'Basankusu', 'Bikoro', 'Ingende'],
      },
      tshopo: {
        name: 'Tshopo',
        cities: ['Kisangani', 'Ubundu', 'Isangi', 'Banalia'],
      },
      maniema: {
        name: 'Maniema',
        cities: ['Kindu', 'Kibombo', 'Kasongo', 'Kalima'],
      },
    },
  },
};

/**
 * Countries list sorted for display
 */
export const COUNTRIES_LIST = Object.entries(CENTRAL_AFRICA_COUNTRIES).map(([key, data]) => ({
  key,
  name: data.name,
  dialCode: data.dialCode,
  flag: data.flag,
  phoneDigits: data.phoneDigits,
}));

/**
 * All dial codes including additional countries (for phone input)
 */
export const ALL_DIAL_CODES = [
  { key: 'cameroun', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲', phoneDigits: 9 },
  { key: 'gabon', name: 'Gabon', dialCode: '+241', flag: '🇬🇦', phoneDigits: 8 },
  { key: 'congo', name: 'Congo (Brazzaville)', dialCode: '+242', flag: '🇨🇬', phoneDigits: 9 },
  { key: 'tchad', name: 'Tchad', dialCode: '+235', flag: '🇹🇩', phoneDigits: 8 },
  { key: 'rca', name: 'Rép. Centrafricaine', dialCode: '+236', flag: '🇨🇫', phoneDigits: 8 },
  { key: 'guinee_equatoriale', name: 'Guinée Équatoriale', dialCode: '+240', flag: '🇬🇶', phoneDigits: 9 },
  { key: 'rdc', name: 'RDC (Congo-Kinshasa)', dialCode: '+243', flag: '🇨🇩', phoneDigits: 9 },
  { key: 'nigeria', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', phoneDigits: 10 },
  { key: 'senegal', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳', phoneDigits: 9 },
  { key: 'cote_ivoire', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮', phoneDigits: 10 },
  { key: 'ghana', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', phoneDigits: 9 },
  { key: 'france', name: 'France', dialCode: '+33', flag: '🇫🇷', phoneDigits: 9 },
  { key: 'usa', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸', phoneDigits: 10 },
  { key: 'belgique', name: 'Belgique', dialCode: '+32', flag: '🇧🇪', phoneDigits: 9 },
  { key: 'suisse', name: 'Suisse', dialCode: '+41', flag: '🇨🇭', phoneDigits: 9 },
  { key: 'uk', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧', phoneDigits: 10 },
  { key: 'maroc', name: 'Maroc', dialCode: '+212', flag: '🇲🇦', phoneDigits: 9 },
  { key: 'tunisie', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳', phoneDigits: 8 },
];

/**
 * Get default country from browser language or timezone (basic heuristic)
 */
export function guessDefaultCountry(): string {
  if (typeof window === 'undefined') return 'cameroun';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Douala') || tz.includes('Yaoundé') || tz.includes('Africa/Douala')) return 'cameroun';
    if (tz.includes('Libreville') || tz.includes('Africa/Libreville')) return 'gabon';
    if (tz.includes('Brazzaville') || tz.includes('Africa/Brazzaville')) return 'congo';
    if (tz.includes('Ndjamena') || tz.includes('Africa/Ndjamena')) return 'tchad';
    if (tz.includes('Bangui') || tz.includes('Africa/Bangui')) return 'rca';
    if (tz.includes('Malabo') || tz.includes('Africa/Malabo')) return 'guinee_equatoriale';
    if (tz.includes('Kinshasa') || tz.includes('Africa/Kinshasa')) return 'rdc';
    if (tz.includes('Lagos') || tz.includes('Africa/Lagos')) return 'nigeria';
  } catch {}
  return 'cameroun';
}

/**
 * Map Nominatim country name to our internal country key
 */
export function mapCountryNameToKey(countryName: string): string {
  const name = (countryName || '').toLowerCase();
  if (name.includes('cameroun') || name.includes('cameroon')) return 'cameroun';
  if (name.includes('gabon')) return 'gabon';
  if (name.includes('congo') && (name.includes('brazzaville') || name.includes('republic'))) return 'congo';
  if (name.includes('tchad') || name.includes('chad')) return 'tchad';
  if (name.includes('centrafric') || name.includes('central african')) return 'rca';
  if (name.includes('guinée équatoriale') || name.includes('equatorial guinea')) return 'guinee_equatoriale';
  if (name.includes('démocratique') || name.includes('kinshasa') || name.includes('democratic republic')) return 'rdc';
  if (name.includes('nigeria')) return 'nigeria';
  return '';
}

/**
 * Map Nominatim state/region name to our internal region key
 */
export function mapRegionNameToKey(countryKey: string, regionName: string): string {
  const country = CENTRAL_AFRICA_COUNTRIES[countryKey];
  if (!country) return '';
  const rname = (regionName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [key, region] of Object.entries(country.regions)) {
    const rkey = region.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (rkey.includes(rname) || rname.includes(rkey) || key.includes(rname) || rname.includes(key)) {
      return key;
    }
  }
  return '';
}
