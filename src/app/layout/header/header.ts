import { Component, HostListener, inject, signal } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { ThemeService } from '../../core/theme.service';
import { Lang } from '../../core/brand-config.model';

interface NavItem {
  fragment: string;
  labelKey: string;
  enabled: boolean;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly progress = signal(0);

  get navItems(): NavItem[] {
    const f = this.config.brand.features;
    return [
      { fragment: 'about', labelKey: 'nav.about', enabled: true },
      { fragment: 'mission', labelKey: 'nav.mission', enabled: f.showMission },
      { fragment: 'competencies', labelKey: 'nav.competencies', enabled: f.showCompetencies },
      { fragment: 'products', labelKey: 'nav.products', enabled: f.showProducts },
      { fragment: 'figures', labelKey: 'nav.figures', enabled: f.showKeyFigures },
      { fragment: 'news', labelKey: 'nav.news', enabled: f.showNews },
      { fragment: 'contacts', labelKey: 'nav.contacts', enabled: true },
    ].filter((item) => item.enabled);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    this.progress.set(max > 0 ? Math.min((doc.scrollTop / max) * 100, 100) : 0);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  switchLang(lang: Lang): void {
    void this.i18n.use(lang);
  }
}
