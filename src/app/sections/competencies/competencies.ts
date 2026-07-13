import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';

interface Competency {
  title: string;
  text: string;
}

@Component({
  selector: 'app-competencies',
  imports: [],
  template: `
    <section id="competencies" class="section section--surface">
      <div class="container">
        <div class="comp__head">
          <span class="section__eyebrow">{{ i18n.t('competencies.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('competencies.title') }}</h2>
          <p class="section__lead">{{ i18n.t('competencies.lead') }}</p>
        </div>

        <div class="comp__grid">
          @for (item of items(); track item.title; let i = $index) {
            <article class="comp__card">
              <span class="comp__num">{{ (i + 1).toString().padStart(2, '0') }}</span>
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
        margin-bottom: 44px;
      }
      .comp__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }
      .comp__card {
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        padding: 30px 26px;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          border-color 0.15s ease;
      }
      .comp__card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: transparent;
      }
      .comp__num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--color-accent) 14%, transparent);
        color: var(--color-accent);
        font-weight: 800;
        font-size: 1.1rem;
        margin-bottom: 18px;
      }
      .comp__card-title {
        font-size: 1.15rem;
        margin-bottom: 8px;
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
