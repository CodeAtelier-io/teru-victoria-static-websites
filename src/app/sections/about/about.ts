import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-about',
  imports: [],
  template: `
    <section id="about" class="section">
      <div class="container about__grid">
        <div class="about__media">
          <img [src]="config.brand.images.about" [alt]="i18n.t('about.title')" loading="lazy" />
        </div>
        <div class="about__content">
          <span class="section__eyebrow">{{ i18n.t('about.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('about.title') }}</h2>
          <p>{{ i18n.t('about.p1') }}</p>
          <p>{{ i18n.t('about.p2') }}</p>
          <ul class="about__list">
            @for (item of i18n.t('about.points'); track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .about__grid {
        display: grid;
        grid-template-columns: 0.95fr 1.05fr;
        gap: 56px;
        align-items: center;
      }
      .about__media img {
        width: 100%;
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        object-fit: cover;
        aspect-ratio: 5 / 4;
      }
      .about__list {
        list-style: none;
        padding: 0;
        margin: 22px 0 0;
        display: grid;
        gap: 12px;
      }
      .about__list li {
        position: relative;
        padding-left: 30px;
        color: var(--color-ink);
        font-weight: 600;
      }
      .about__list li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--color-accent);
        box-shadow: inset 0 0 0 4px var(--color-white);
      }
      @media (max-width: 900px) {
        .about__grid {
          grid-template-columns: 1fr;
          gap: 32px;
        }
        .about__media {
          order: -1;
        }
      }
    `,
  ],
})
export class About {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
