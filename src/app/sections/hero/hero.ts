import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-hero',
  imports: [RevealDirective],
  template: `
    <section id="top" class="hero">
      <div class="hero__bg" aria-hidden="true">
        <span class="hero__glow"></span>
        <span class="hero__grid-lines"></span>
      </div>

      <div class="container hero__grid">
        <div class="hero__content">
          <h1 class="hero__title" appReveal>
            {{ i18n.t('hero.titleLead') }}
            <span class="grad-text">{{ i18n.t('hero.titleAccent') }}</span>
          </h1>
          <p class="hero__lead" appReveal [revealDelay]="160">{{ i18n.t('hero.lead') }}</p>
          <div class="hero__actions" appReveal [revealDelay]="240">
            <a class="btn btn--primary" href="#products">{{ i18n.t('hero.ctaPrimary') }}</a>
            <a class="btn btn--ghost" href="#about">{{ i18n.t('hero.ctaSecondary') }}</a>
          </div>
          <div class="hero__trust" appReveal [revealDelay]="320">
            <div class="hero__avatars" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
            <span>{{ i18n.t('hero.trust') }}</span>
          </div>
        </div>

        <div class="hero__media" appReveal revealFrom="scale" [revealDelay]="200">
          <div class="hero__card">
            <img [src]="config.brand.images.hero" [alt]="i18n.brandName()" loading="eager" />
          </div>
          <div class="chip chip--tl">
            <span class="chip__dot"></span>
            {{ i18n.t('hero.chipApproved') }}
          </div>
          <div class="chip chip--br">
            <strong>{{ config.brand.keyFigures[0].value }}</strong>
            {{ i18n.t(config.brand.keyFigures[0].labelKey) }}
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        position: relative;
        overflow: hidden;
        background: var(--color-bg);
        color: var(--color-ink);
        padding-top: calc(var(--header-h) + clamp(40px, 7vw, 88px));
        padding-bottom: clamp(64px, 9vw, 120px);
      }
      .hero__bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .hero__glow {
        position: absolute;
        width: 620px;
        height: 620px;
        top: -220px;
        right: -160px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--color-accent), transparent 62%);
        opacity: 0.1;
        filter: blur(30px);
        animation: float-slow 14s ease-in-out infinite;
      }
      .hero__grid-lines {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(20, 22, 34, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20, 22, 34, 0.035) 1px, transparent 1px);
        background-size: 56px 56px;
        mask-image: radial-gradient(ellipse 70% 55% at 60% 35%, #000 30%, transparent 75%);
        -webkit-mask-image: radial-gradient(ellipse 70% 55% at 60% 35%, #000 30%, transparent 75%);
      }
      .hero__grid {
        position: relative;
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        align-items: center;
        gap: 56px;
      }
      .hero__title {
        margin-bottom: 22px;
      }
      .hero__lead {
        font-size: 1.14rem;
        color: var(--color-muted);
        max-width: 500px;
        margin-bottom: 32px;
      }
      .hero__actions {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }
      .hero__trust {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-top: 32px;
        font-size: 0.9rem;
        color: var(--color-muted);
      }
      .hero__avatars {
        display: flex;
      }
      .hero__avatars span {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 2px solid var(--color-bg);
        margin-left: -11px;
        background: color-mix(in srgb, var(--color-accent) 82%, #fff);
      }
      .hero__avatars span:first-child {
        margin-left: 0;
      }
      .hero__avatars span:nth-child(2) {
        background: color-mix(in srgb, var(--color-accent) 55%, #fff);
      }
      .hero__avatars span:nth-child(3) {
        background: color-mix(in srgb, var(--color-accent) 35%, #fff);
      }
      .hero__avatars span:nth-child(4) {
        background: color-mix(in srgb, var(--color-ink) 12%, #fff);
      }

      .hero__media {
        position: relative;
      }
      .hero__card {
        position: relative;
        border-radius: var(--radius-xl);
        padding: 10px;
        background: var(--color-white);
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-lg);
      }
      .hero__card img {
        width: 100%;
        border-radius: calc(var(--radius-xl) - 10px);
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }
      .chip {
        position: absolute;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 12px 16px;
        border-radius: 14px;
        background: var(--color-white);
        color: var(--color-ink);
        font-size: 0.86rem;
        font-weight: 600;
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-md);
      }
      .chip strong {
        font-size: 1.15rem;
        font-weight: 800;
        margin-right: 4px;
        color: var(--color-ink);
      }
      .chip--br {
        color: var(--color-muted);
      }
      .chip__dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 4px color-mix(in srgb, #22c55e 22%, transparent);
      }
      .chip--tl {
        top: 26px;
        left: -22px;
        animation: float-slow 6s ease-in-out infinite;
      }
      .chip--br {
        bottom: 26px;
        right: -18px;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.25;
        animation: float-slower 7s ease-in-out infinite;
      }

      @media (max-width: 900px) {
        .hero__grid {
          grid-template-columns: 1fr;
          gap: 48px;
        }
        .hero__media {
          order: -1;
          margin-inline: 8px;
        }
        .chip--tl {
          left: 6px;
        }
        .chip--br {
          right: 6px;
        }
      }
    `,
  ],
})
export class Hero {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
