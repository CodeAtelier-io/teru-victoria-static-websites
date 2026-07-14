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
    this.applyFavicon(config.images.logo);
  }

  /** Points the browser-tab icon at the active brand's logo. */
  private applyFavicon(href: string): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  /**
   * Writes the brand's accent colours onto :root as CSS custom properties.
   * Only accents are brand-driven; neutral colours come from the light/dark
   * theme (see styles.scss + ThemeService).
   */
  private applyTheme(config: BrandConfig): void {
    const root = document.documentElement;
    const { theme } = config;
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-2', theme.accent2);
    root.style.setProperty('--color-accent-dark', theme.accentDark);
    // Reusable brand gradient built from the two accents.
    root.style.setProperty(
      '--gradient-brand',
      `linear-gradient(120deg, ${theme.accent}, ${theme.accent2})`,
    );
    root.setAttribute('data-brand', config.brand);
  }
}
