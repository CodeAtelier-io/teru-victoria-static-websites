import { Injectable, computed, inject, signal } from '@angular/core';
import { ConfigService } from './config.service';
import { Lang } from '../models/brand-config.model';

type Dict = Record<string, unknown>;

const STORAGE_KEY = 'app.lang';
const SUPPORTED: Lang[] = ['en', 'bg'];

/**
 * Lightweight i18n. Loads a base dictionary plus a per-brand overlay for the
 * active language and deep-merges them, so brand-specific copy overrides the
 * shared base while everything else stays common across brands.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly config = inject(ConfigService);

  private readonly _lang = signal<Lang>('en');
  /** Dictionaries keyed by language, populated as languages are loaded. */
  private readonly _dicts = signal<Partial<Record<Lang, Dict>>>({});

  readonly lang = this._lang.asReadonly();
  readonly available = SUPPORTED;

  /** Reactive view of the active dictionary; recomputes on lang/dict changes. */
  private readonly active = computed<Dict>(() => this._dicts()[this._lang()] ?? {});

  async init(): Promise<void> {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    const initial = SUPPORTED.includes(stored as Lang)
      ? (stored as Lang)
      : this.config.brand.defaultLang;
    await this.use(initial);
  }

  async use(lang: Lang): Promise<void> {
    if (!SUPPORTED.includes(lang)) return;
    if (!this._dicts()[lang]) {
      const dict = await this.loadLang(lang);
      this._dicts.update((d) => ({ ...d, [lang]: dict }));
    }
    this._lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.title = this.brandName();
  }

  /** The brand's display name in the active language (e.g. "Виктория 111"). */
  brandName(): string {
    const value = this.resolve(this.active(), 'brand.name');
    return typeof value === 'string' ? value : this.config.brand.name;
  }

  /**
   * Resolve a dotted key to its translated value. Returns strings with
   * `{{param}}` placeholders interpolated; returns arrays/objects untouched
   * (used for lists such as competencies or news items).
   */
  t<T = string>(key: string, params?: Record<string, string>): T {
    const raw = this.resolve(this.active(), key);
    if (raw === undefined) return key as unknown as T;
    if (typeof raw === 'string') {
      return this.interpolate(raw, params) as unknown as T;
    }
    return raw as T;
  }

  private async loadLang(lang: Lang): Promise<Dict> {
    const brand = this.config.brand.brand;
    const [base, overlay] = await Promise.all([
      this.fetchJson(`i18n/${lang}.json`),
      this.fetchJson(`i18n/${brand}/${lang}.json`),
    ]);
    return this.deepMerge(base, overlay);
  }

  private async fetchJson(url: string): Promise<Dict> {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      return res.ok ? ((await res.json()) as Dict) : {};
    } catch {
      return {};
    }
  }

  private resolve(dict: Dict, key: string): unknown {
    return key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Dict)[part];
      }
      return undefined;
    }, dict);
  }

  private interpolate(text: string, params?: Record<string, string>): string {
    const merged: Record<string, string> = { brandName: this.brandName(), ...params };
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) =>
      name in merged ? merged[name] : `{{${name}}}`,
    );
  }

  private deepMerge(base: Dict, overlay: Dict): Dict {
    // Only ever called with plain objects (arrays/primitives are replaced
    // wholesale below), so a shallow clone of the base is the correct start.
    const out: Dict = { ...base };
    for (const [key, value] of Object.entries(overlay)) {
      const existing = out[key];
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        existing &&
        typeof existing === 'object' &&
        !Array.isArray(existing)
      ) {
        out[key] = this.deepMerge(existing as Dict, value as Dict);
      } else {
        out[key] = value;
      }
    }
    return out;
  }
}
