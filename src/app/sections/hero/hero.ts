import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-hero',
  imports: [],
  template: `
    <section id="top" class="hero">
      <div class="container hero__grid">
        <div class="hero__content">
          <span class="hero__eyebrow">{{ i18n.t('hero.eyebrow') }}</span>
          <h1 class="hero__title">{{ i18n.t('hero.title') }}</h1>
          <p class="hero__lead">{{ i18n.t('hero.lead') }}</p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="#products">{{ i18n.t('hero.ctaPrimary') }}</a>
            <a class="btn btn--ghost" href="#about">{{ i18n.t('hero.ctaSecondary') }}</a>
          </div>
        </div>
        <div class="hero__media">
          <img [src]="config.brand.images.hero" [alt]="config.brand.name" loading="eager" />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        padding-top: calc(var(--header-h) + clamp(40px, 7vw, 90px));
        padding-bottom: clamp(50px, 8vw, 100px);
        background:
          radial-gradient(
            circle at 85% 15%,
            color-mix(in srgb, var(--color-accent) 12%, transparent),
            transparent 45%
          ),
          var(--color-surface);
      }
      .hero__grid {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        align-items: center;
        gap: 56px;
      }
      .hero__eyebrow {
        display: inline-block;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        font-size: 0.82rem;
        color: var(--color-accent);
        margin-bottom: 16px;
      }
      .hero__title {
        margin-bottom: 20px;
      }
      .hero__lead {
        font-size: 1.12rem;
        max-width: 520px;
        margin-bottom: 30px;
      }
      .hero__actions {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }
      .hero__media img {
        width: 100%;
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        object-fit: cover;
        aspect-ratio: 4 / 3;
      }
      @media (max-width: 900px) {
        .hero__grid {
          grid-template-columns: 1fr;
          gap: 36px;
        }
        .hero__media {
          order: -1;
        }
      }
    `,
  ],
})
export class Hero {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
