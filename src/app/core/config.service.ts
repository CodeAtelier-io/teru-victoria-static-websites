import { Injectable, signal } from '@angular/core';
import { BrandConfig } from './brand-config.model';

/**
 * Loads the active brand configuration once at startup (before bootstrap, via
 * an app initializer) and applies its theme to the document root as CSS custom
 * properties. One build serves every brand; swapping `assets/config.json`
 * switches the brand without rebuilding.
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly _config = signal<BrandConfig | null>(null);

  /** The active brand config. Guaranteed non-null after `load()` resolves. */
  readonly config = this._config.asReadonly();

  get brand(): BrandConfig {
    const value = this._config();
    if (!value) {
      throw new Error('ConfigService.brand read before load() completed.');
    }
    return value;
  }

  async load(): Promise<void> {
    const response = await fetch('config.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to load config.json (${response.status}).`);
    }
    const config = (await response.json()) as BrandConfig;
    this._config.set(config);
    this.applyTheme(config);
    document.title = config.name;
  }

  /** Writes brand theme values onto :root so components read them via CSS vars. */
  private applyTheme(config: BrandConfig): void {
    const root = document.documentElement;
    const { theme } = config;
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-dark', theme.accentDark);
    root.style.setProperty('--color-ink', theme.ink);
    root.style.setProperty('--color-muted', theme.muted);
    root.style.setProperty('--color-surface', theme.surface);
    root.setAttribute('data-brand', config.brand);
  }
}
