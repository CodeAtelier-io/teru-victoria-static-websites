import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  template: `
    <section id="about" class="section">
      <div class="container about__grid">
        <div class="about__media" appReveal revealFrom="left">
          <div class="about__frame">
            <img [src]="config.brand.images.about" [alt]="i18n.t('about.title')" loading="lazy" />
          </div>
          <div class="about__logo">
            <img [src]="config.brand.images.logo" [alt]="i18n.brandName()" />
          </div>
          <div class="about__badge">
            <span class="about__badge-num">{{ config.brand.keyFigures[1].value }}</span>
            <span class="about__badge-label">{{ i18n.t(config.brand.keyFigures[1].labelKey) }}</span>
          </div>
        </div>

        <div class="about__content" appReveal revealFrom="right" [revealDelay]="120">
          <span class="eyebrow">{{ i18n.t('about.eyebrow') }}</span>
          <h2 class="section__title">
            {{ i18n.t('about.titleLead') }} <span class="grad-text">{{ i18n.brandName() }}</span>?
          </h2>
          <p>{{ i18n.t('about.p1') }}</p>
          <p>{{ i18n.t('about.p2') }}</p>
          <ul class="about__list">
            @for (item of points(); track item) {
              <li>
                <span class="about__check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      stroke-width="2.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                {{ item }}
              </li>
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
        grid-template-columns: 1fr 1.05fr;
        gap: 64px;
        align-items: center;
      }
      .about__media {
        position: relative;
      }
      .about__frame {
        position: relative;
        border-radius: var(--radius-xl);
        padding: 10px;
        background: var(--gradient-brand);
        box-shadow: var(--shadow-lg);
      }
      .about__frame img {
        width: 100%;
        border-radius: calc(var(--radius-xl) - 10px);
        aspect-ratio: 5 / 4;
        object-fit: cover;
      }
      .about__logo {
        position: absolute;
        top: -22px;
        left: -22px;
        width: 84px;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        background: #fff;
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-lg);
        animation: float-slow 7s ease-in-out infinite;
      }
      .about__logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 9px;
      }
      .about__badge {
        position: absolute;
        right: -20px;
        bottom: -24px;
        display: flex;
        flex-direction: column;
        padding: 18px 22px;
        border-radius: 18px;
        background: var(--color-white);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--color-line);
      }
      .about__badge-num {
        font-size: 1.7rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        background: var(--gradient-brand);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .about__badge-label {
        font-size: 0.82rem;
        color: var(--color-muted);
        font-weight: 500;
      }
      .about__list {
        list-style: none;
        padding: 0;
        margin: 26px 0 0;
        display: grid;
        gap: 14px;
      }
      .about__list li {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--color-ink);
        font-weight: 600;
      }
      .about__check {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        flex: none;
        border-radius: 8px;
        background: color-mix(in srgb, var(--color-accent) 14%, transparent);
        color: var(--color-accent);
      }
      @media (max-width: 900px) {
        .about__grid {
          grid-template-columns: 1fr;
          gap: 52px;
        }
        .about__media {
          order: -1;
          margin-right: 20px;
        }
        .about__logo {
          width: 66px;
          height: 66px;
          top: -14px;
          left: -8px;
        }
      }
    `,
  ],
})
export class About {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);

  points(): string[] {
    const value = this.i18n.t<string[]>('about.points');
    return Array.isArray(value) ? value : [];
  }
}
