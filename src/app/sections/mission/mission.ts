import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-mission',
  imports: [],
  template: `
    <section id="mission" class="section mission">
      <div class="container mission__inner">
        <span class="section__eyebrow mission__eyebrow">{{ i18n.t('mission.eyebrow') }}</span>
        <h2 class="mission__title">{{ i18n.t('mission.title') }}</h2>
        <p class="mission__lead">{{ i18n.t('mission.lead') }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .mission {
        background: var(--color-ink);
        color: var(--color-white);
        text-align: center;
      }
      .mission__inner {
        max-width: 860px;
      }
      .mission__eyebrow {
        color: var(--color-accent);
      }
      .mission__title {
        color: var(--color-white);
        margin-bottom: 20px;
      }
      .mission__lead {
        color: rgba(255, 255, 255, 0.82);
        font-size: 1.25rem;
        line-height: 1.6;
      }
    `,
  ],
})
export class Mission {
  readonly i18n = inject(I18nService);
}
