import { Component, HostListener, inject, signal } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';
import { Lang } from '../../core/models/brand-config.model';

interface NavItem {
  fragment: string;
  labelKey: string;
  enabled: boolean;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
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
