import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';

interface NewsItem {
  date: string;
  title: string;
  excerpt: string;
}

@Component({
  selector: 'app-news',
  imports: [RevealDirective, TiltDirective],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  readonly i18n = inject(I18nService);

  items(): NewsItem[] {
    const value = this.i18n.t<NewsItem[]>('news.items');
    return Array.isArray(value) ? value : [];
  }
}
