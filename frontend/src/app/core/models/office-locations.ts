/**
 * Mock office-network data for the interactive locations map.
 *
 * Generates a deterministic set of ~200 offices scattered across real
 * Bulgarian cities, so the map, the filters and the "offices" key figure all
 * tell a consistent story without a backend. Deterministic (fixed seed) so the
 * same points render on every load.
 */

export interface Office {
  id: number;
  /** Filterable office code, e.g. "SOF-014". */
  code: string;
  /** City the office sits in (Bulgarian name). */
  city: string;
  /** Street line, e.g. "ул. Витоша 42". */
  street: string;
  lat: number;
  lng: number;
}

interface CitySeed {
  name: string;
  code: string;
  lat: number;
  lng: number;
  /** Relative share of offices — bigger cities get more. */
  weight: number;
  /** Coordinate jitter radius (degrees) around the city centre. */
  spread: number;
}

const CITIES: readonly CitySeed[] = [
  { name: 'София', code: 'SOF', lat: 42.6977, lng: 23.3219, weight: 34, spread: 0.11 },
  { name: 'Пловдив', code: 'PDV', lat: 42.1354, lng: 24.7453, weight: 16, spread: 0.07 },
  { name: 'Варна', code: 'VAR', lat: 43.2141, lng: 27.9147, weight: 15, spread: 0.07 },
  { name: 'Бургас', code: 'BGS', lat: 42.5048, lng: 27.4626, weight: 12, spread: 0.06 },
  { name: 'Русе', code: 'RSE', lat: 43.8356, lng: 25.9657, weight: 8, spread: 0.05 },
  { name: 'Стара Загора', code: 'SZG', lat: 42.4258, lng: 25.6345, weight: 8, spread: 0.05 },
  { name: 'Плевен', code: 'PLN', lat: 43.417, lng: 24.6067, weight: 7, spread: 0.05 },
  { name: 'Сливен', code: 'SLV', lat: 42.6858, lng: 26.3292, weight: 6, spread: 0.045 },
  { name: 'Добрич', code: 'DOB', lat: 43.5726, lng: 27.8273, weight: 6, spread: 0.045 },
  { name: 'Шумен', code: 'SHU', lat: 43.2712, lng: 26.9361, weight: 5, spread: 0.04 },
  { name: 'Перник', code: 'PER', lat: 42.605, lng: 23.0378, weight: 5, spread: 0.04 },
  { name: 'Хасково', code: 'HKV', lat: 41.9344, lng: 25.5554, weight: 5, spread: 0.04 },
  { name: 'Ямбол', code: 'JAM', lat: 42.4841, lng: 26.5036, weight: 5, spread: 0.04 },
  { name: 'Пазарджик', code: 'PAZ', lat: 42.1928, lng: 24.3336, weight: 5, spread: 0.04 },
  { name: 'Благоевград', code: 'BLG', lat: 42.0208, lng: 23.0942, weight: 5, spread: 0.04 },
  { name: 'Велико Търново', code: 'VTR', lat: 43.0757, lng: 25.6172, weight: 5, spread: 0.04 },
  { name: 'Враца', code: 'VRC', lat: 43.2102, lng: 23.5528, weight: 4, spread: 0.035 },
  { name: 'Габрово', code: 'GAB', lat: 42.8742, lng: 25.3342, weight: 4, spread: 0.035 },
  { name: 'Видин', code: 'VID', lat: 43.9908, lng: 22.8814, weight: 3, spread: 0.03 },
  { name: 'Монтана', code: 'MON', lat: 43.4125, lng: 23.2257, weight: 3, spread: 0.03 },
  { name: 'Кърджали', code: 'KRZ', lat: 41.65, lng: 25.3667, weight: 3, spread: 0.03 },
  { name: 'Кюстендил', code: 'KNL', lat: 42.2833, lng: 22.6914, weight: 3, spread: 0.03 },
  { name: 'Търговище', code: 'TGV', lat: 43.2513, lng: 26.572, weight: 3, spread: 0.03 },
  { name: 'Ловеч', code: 'LOV', lat: 43.1367, lng: 24.715, weight: 3, spread: 0.03 },
  { name: 'Силистра', code: 'SLS', lat: 44.117, lng: 27.2606, weight: 3, spread: 0.03 },
  { name: 'Разград', code: 'RAZ', lat: 43.5271, lng: 26.524, weight: 3, spread: 0.03 },
  { name: 'Дупница', code: 'DUP', lat: 42.2667, lng: 23.1167, weight: 2, spread: 0.025 },
  { name: 'Казанлък', code: 'KAZ', lat: 42.6167, lng: 25.4, weight: 3, spread: 0.03 },
  { name: 'Асеновград', code: 'ASN', lat: 42.01, lng: 24.8767, weight: 2, spread: 0.025 },
  { name: 'Свищов', code: 'SVI', lat: 43.6167, lng: 25.35, weight: 2, spread: 0.025 },
];

const STREETS: readonly string[] = [
  'ул. Витоша',
  'бул. България',
  'ул. Раковски',
  'ул. Граф Игнатиев',
  'бул. Цар Освободител',
  'ул. Александровска',
  'ул. Марица',
  'бул. Мария Луиза',
  'ул. Пирин',
  'ул. Родопи',
  'ул. Дунав',
  'ул. Тракия',
  'ул. Струма',
  'ул. Иван Вазов',
  'ул. Христо Ботев',
  'ул. Васил Левски',
  'ул. Стефан Стамболов',
  'бул. Черни връх',
  'ул. Цар Симеон',
  'ул. Гладстон',
  'ул. Патриарх Евтимий',
  'бул. Витоша',
  'ул. Оборище',
  'ул. Шипка',
];

/** Small, fast, seedable PRNG (mulberry32) — keeps the dataset reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build the list of mock offices. Stable for a given `count`. */
export function generateOffices(count = 200): Office[] {
  const rand = mulberry32(0x76c74a11);
  const totalWeight = CITIES.reduce((sum, c) => sum + c.weight, 0);

  const offices: Office[] = [];
  const seqByCity = new Map<string, number>();

  for (let i = 0; i < count; i++) {
    // Weighted pick of a host city.
    let ticket = rand() * totalWeight;
    let city = CITIES[CITIES.length - 1];
    for (const c of CITIES) {
      ticket -= c.weight;
      if (ticket <= 0) {
        city = c;
        break;
      }
    }

    const seq = (seqByCity.get(city.code) ?? 0) + 1;
    seqByCity.set(city.code, seq);

    // Gaussian-ish jitter (sum of two uniforms) clusters points near the centre.
    const jitter = (s: number) => (rand() + rand() - 1) * s;
    const street = STREETS[Math.floor(rand() * STREETS.length)];
    const streetNo = 1 + Math.floor(rand() * 148);

    offices.push({
      id: i,
      code: `${city.code}-${String(seq).padStart(3, '0')}`,
      city: city.name,
      street: `${street} ${streetNo}`,
      lat: +(city.lat + jitter(city.spread)).toFixed(5),
      lng: +(city.lng + jitter(city.spread * 1.25)).toFixed(5),
    });
  }

  return offices;
}

/** Sorted unique city names, for the city filter dropdown. */
export function officeCities(offices: Office[]): string[] {
  return [...new Set(offices.map((o) => o.city))].sort((a, b) => a.localeCompare(b, 'bg'));
}

/** Approximate bounding box of Bulgaria — the map's "show everything" view. */
export const BULGARIA_BOUNDS: [[number, number], [number, number]] = [
  [41.2, 22.3],
  [44.25, 28.7],
];
