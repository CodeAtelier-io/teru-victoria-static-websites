import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

interface NewsItem {
  date: string;
  title: string;
  excerpt: string;
}

@Component({
  selector: 'app-news',
  imports: [RevealDirective],
  template: `
    <section id="news" class="section section--surface">
      <div class="container">
        <div class="news__head" appReveal>
          <span class="eyebrow">{{ i18n.t('news.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('news.title') }}</h2>
        </div>
        <div class="news__grid">
          @for (item of items(); track item.title; let i = $index) {
            <article class="news-card" appReveal [revealDelay]="i * 100">
              <time class="news-card__date">{{ item.date }}</time>
              <h3 class="news-card__title">{{ item.title }}</h3>
              <p>{{ item.excerpt }}</p>
              <span class="news-card__more">{{ i18n.t('news.readMore') }} →</span>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .news__head {
        margin-bottom: 44px;
      }
      .news__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }
      .news-card {
        position: relative;
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        padding: 30px 28px;
        overflow: hidden;
        transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
      }
      .news-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--gradient-brand);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.35s var(--ease);
      }
      .news-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
      }
      .news-card:hover::before {
        transform: scaleX(1);
      }
      .news-card__date {
        display: inline-block;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: 14px;
      }
      .news-card__title {
        font-size: 1.2rem;
        margin-bottom: 10px;
      }
      .news-card__more {
        display: inline-block;
        margin-top: 6px;
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--color-accent);
        opacity: 0;
        transform: translateX(-4px);
        transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
      }
      .news-card:hover .news-card__more {
        opacity: 1;
        transform: translateX(0);
      }
      @media (max-width: 900px) {
        .news__grid {
          grid-template-columns: 1fr;
        }
        .news-card__more {
          opacity: 1;
          transform: none;
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
