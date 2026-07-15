import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'app.theme';

/**
 * Light / dark theme controller. The initial theme is applied by a tiny inline
 * script in index.html (before first paint, to avoid a flash); this service
 * keeps it in sync, persists the user's choice and drives the toggle UI.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>('light');
  readonly theme = this._theme.asReadonly();

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial =
      stored ??
      (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.apply(initial, false);
  }

  toggle(): void {
    this.apply(this._theme() === 'dark' ? 'light' : 'dark', true);
  }

  set(theme: Theme): void {
    this.apply(theme, true);
  }

  private apply(theme: Theme, animate: boolean): void {
    const root = document.documentElement;

    // Briefly enable colour transitions so the switch eases instead of snapping.
    if (animate) {
      root.classList.add('theme-anim');
      window.setTimeout(() => root.classList.remove('theme-anim'), 750);
    }

    root.setAttribute('data-theme', theme);
    this._theme.set(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
