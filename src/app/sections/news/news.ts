import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';

interface NewsItem {
  date: string;
  title: string;
  excerpt: string;
}

@Component({
  selector: 'app-news',
  imports: [],
  template: `
    <section id="news" class="section section--surface">
      <div class="container">
        <div class="news__head">
          <span class="section__eyebrow">{{ i18n.t('news.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('news.title') }}</h2>
        </div>
        <div class="news__grid">
          @for (item of items(); track item.title) {
            <article class="news-card">
              <time class="news-card__date">{{ item.date }}</time>
              <h3 class="news-card__title">{{ item.title }}</h3>
              <p>{{ item.excerpt }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .news__head {
        margin-bottom: 40px;
      }
      .news__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }
      .news-card {
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        padding: 28px 26px;
        border-top: 3px solid var(--color-accent);
      }
      .news-card__date {
        display: block;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: 12px;
      }
      .news-card__title {
        font-size: 1.15rem;
        margin-bottom: 10px;
      }
      @media (max-width: 900px) {
        .news__grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class News {
  readonly i18n = inject(I18nService);

  items(): NewsItem[] {
    const value = this.i18n.t<NewsItem[]>('news.items');
    return Array.isArray(value) ? value : [];
  }
}
