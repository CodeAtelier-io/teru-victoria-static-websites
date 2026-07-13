import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-key-figures',
  imports: [],
  template: `
    <section id="figures" class="section figures">
      <div class="container">
        <div class="figures__head">
          <span class="section__eyebrow figures__eyebrow">{{ i18n.t('figures.eyebrow') }}</span>
          <h2 class="figures__title">{{ i18n.t('figures.title') }}</h2>
        </div>
        <div class="figures__grid">
          @for (figure of config.brand.keyFigures; track figure.labelKey) {
            <div class="figure">
              <span class="figure__value">{{ figure.value }}</span>
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
        background:
          linear-gradient(
            120deg,
            var(--color-accent),
            var(--color-accent-dark)
          );
        color: var(--color-white);
      }
      .figures__head {
        text-align: center;
        margin-bottom: 44px;
      }
      .figures__eyebrow {
        color: rgba(255, 255, 255, 0.85);
      }
      .figures__title {
        color: var(--color-white);
      }
      .figures__grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 22px;
      }
      .figure {
        text-align: center;
        padding: 20px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
      }
      .figure__value {
        display: block;
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 800;
        line-height: 1.1;
      }
      .figure__label {
        display: block;
        margin-top: 8px;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.88);
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
