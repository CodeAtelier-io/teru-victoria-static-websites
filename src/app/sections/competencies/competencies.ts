import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

interface Competency {
  title: string;
  text: string;
}

@Component({
  selector: 'app-competencies',
  imports: [RevealDirective],
  template: `
    <section id="competencies" class="section section--surface comp">
      <div class="container">
        <div class="comp__head" appReveal>
          <span class="eyebrow">{{ i18n.t('competencies.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('competencies.title') }}</h2>
          <p class="section__lead">{{ i18n.t('competencies.lead') }}</p>
        </div>

        <div class="comp__grid">
          @for (item of items(); track item.title; let i = $index) {
            <article class="comp__card" appReveal [revealDelay]="i * 90">
              <span class="comp__icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
                  stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  @switch (i) {
                    @case (0) {
                      <circle cx="9" cy="8" r="3" />
                      <path d="M2.5 20c0-3.3 3-5 6.5-5s6.5 1.7 6.5 5" />
                      <path d="M16 5.6a3 3 0 0 1 0 5.4" />
                      <path d="M18 14.6c2.4.6 3.8 2 3.8 5" />
                    }
                    @case (1) {
                      <rect x="5" y="5" width="14" height="14" rx="3" />
                      <rect x="9" y="9" width="6" height="6" rx="1" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    }
                    @case (2) {
                      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    }
                    @case (3) {
                      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
                    }
                    @case (4) {
                      <circle cx="6" cy="12" r="2.5" />
                      <circle cx="18" cy="6" r="2.5" />
                      <circle cx="18" cy="18" r="2.5" />
                      <path d="M8.2 10.9l7.6-3.6M8.2 13.1l7.6 3.6" />
                    }
                    @case (5) {
                      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
                      <path d="M19 14l.8 2.1L22 17l-2.2.9L19 20l-.8-2.1L16 17l2.2-.9L19 14z" />
                    }
                  }
                </svg>
              </span>
              <h3 class="comp__card-title">{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .comp__head {
        max-width: 720px;
        margin-bottom: 52px;
      }
      .comp__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .comp__card {
        position: relative;
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        padding: 32px 28px;
        transition:
          transform 0.3s var(--ease),
          box-shadow 0.3s var(--ease),
          border-color 0.3s var(--ease);
      }
      .comp__card:hover {
        transform: translateY(-6px);
        box-shadow: var(--shadow-md);
        border-color: color-mix(in srgb, var(--color-accent) 32%, var(--color-line));
      }
      .comp__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 54px;
        height: 54px;
        border-radius: 15px;
        color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 11%, transparent);
        margin-bottom: 20px;
        transition: background 0.3s var(--ease);
      }
      .comp__card:hover .comp__icon {
        background: color-mix(in srgb, var(--color-accent) 16%, transparent);
      }
      .comp__card-title {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }
      .comp__card p {
        margin: 0;
        font-size: 0.96rem;
      }
      @media (max-width: 900px) {
        .comp__grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (max-width: 560px) {
        .comp__grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Competencies {
  readonly i18n = inject(I18nService);

  items(): Competency[] {
    const value = this.i18n.t<Competency[]>('competencies.items');
    return Array.isArray(value) ? value : [];
  }
}
