import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';
import { CountUpDirective } from '../../core/count-up.directive';

@Component({
  selector: 'app-key-figures',
  imports: [RevealDirective, CountUpDirective],
  template: `
    <section id="figures" class="section figures">
      <div class="figures__bg" aria-hidden="true">
        <span class="figures__orb figures__orb--1"></span>
        <span class="figures__orb figures__orb--2"></span>
      </div>
      <div class="container">
        <div class="figures__head" appReveal>
          <span class="eyebrow eyebrow--dark">{{ i18n.t('figures.eyebrow') }}</span>
          <h2 class="figures__title">{{ i18n.t('figures.title') }}</h2>
        </div>
        <div class="figures__grid">
          @for (figure of config.brand.keyFigures; track figure.labelKey; let i = $index) {
            <div class="figure" appReveal [revealDelay]="i * 90">
              <span class="figure__value" [appCountUp]="figure.value"></span>
              <span class="figure__label">{{ i18n.t(figure.labelKey) }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .figures {
        position: relative;
        overflow: hidden;
        background: var(--color-night);
        color: #fff;
      }
      .figures__bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .figures__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        opacity: 0.22;
      }
      .figures__orb--1 {
        width: 360px;
        height: 360px;
        top: -120px;
        left: 8%;
        background: radial-gradient(circle, var(--color-accent), transparent 68%);
        animation: float-slow 12s ease-in-out infinite;
      }
      .figures__orb--2 {
        width: 340px;
        height: 340px;
        bottom: -140px;
        right: 6%;
        background: radial-gradient(circle, var(--color-accent-2), transparent 68%);
        animation: float-slower 14s ease-in-out infinite;
      }
      .figures__head {
        position: relative;
        text-align: center;
        margin-bottom: 52px;
      }
      .eyebrow--dark {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.18);
      }
      .figures__title {
        color: #fff;
      }
      .figures__grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .figure {
        text-align: center;
        padding: 34px 18px;
        border-radius: var(--radius-lg);
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: transform 0.3s var(--ease), background 0.3s var(--ease);
      }
      .figure:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.09);
      }
      .figure__value {
        display: block;
        font-size: clamp(2.2rem, 4vw, 3.1rem);
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1;
        background: linear-gradient(120deg, #fff, rgba(255, 255, 255, 0.7));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .figure__label {
        display: block;
        margin-top: 12px;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.66);
      }
      @media (max-width: 760px) {
        .figures__grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class KeyFigures {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
