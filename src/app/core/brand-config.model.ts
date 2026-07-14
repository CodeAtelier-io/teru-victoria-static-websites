/**
 * Runtime brand configuration.
 *
 * One Angular build serves multiple white-label brands (Victoria 111, Teru
 * Credit). The active brand is loaded at startup from `assets/config.json`
 * (see {@link ConfigService}); text content lives in the i18n overlays.
 */
export type Lang = 'en' | 'bg';

export interface BrandTheme {
  /**
   * Brand accent identity — the same in light and dark mode. Neutral colours
   * (background, text, surfaces) are owned by the light/dark theme, not by the
   * brand, so both brands share one consistent, accessible neutral scale.
   */
  accent: string;
  /** Secondary accent — paired with `accent` to build gradients. */
  accent2: string;
  /** Darker accent for hover / active states. */
  accentDark: string;
}

export interface BrandContact {
  address: string;
  phone: string;
  email: string;
  /**
   * Optional Google Maps query used for the embedded map. Accepts an address
   * or "lat,lng" coordinates. Falls back to {@link BrandContact.address} when
   * omitted.
   */
  mapQuery?: string;
}

export interface BrandKeyFigure {
  /** Displayed value, e.g. "255 000+". */
  value: string;
  /** i18n key for the label under the figure. */
  labelKey: string;
}

export interface BrandProduct {
  /** i18n key for the product name. */
  nameKey: string;
  /** i18n key for the product description. */
  descKey: string;
  /** Image path relative to the app base. */
  image: string;
}

export interface BrandFeatures {
  showMission: boolean;
  showCompetencies: boolean;
  showProducts: boolean;
  showKeyFigures: boolean;
  showNews: boolean;
}

export interface BrandConfig {
  /** Brand slug, matches the i18n overlay folder. */
  brand: string;
  /** Display name, e.g. "Victoria 111". */
  name: string;
  /** Legal entity name shown in the footer. */
  legalName: string;
  defaultLang: Lang;
  theme: BrandTheme;
  contact: BrandContact;
  features: BrandFeatures;
  keyFigures: BrandKeyFigure[];
  products: BrandProduct[];
  images: {
    /** Brand logo mark (also used as the favicon). */
    logo: string;
    hero: string;
    about: string;
  };
}
