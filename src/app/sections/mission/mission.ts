import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-mission',
  imports: [RevealDirective],
  template: `
    <section id="mission" class="section mission">
      <div class="mission__bg" aria-hidden="true"></div>
      <div class="container mission__inner" appReveal>
        <span class="eyebrow eyebrow--dark">{{ i18n.t('mission.eyebrow') }}</span>
        <h2 class="mission__title">{{ i18n.t('mission.title') }}</h2>
        <p class="mission__lead">{{ i18n.t('mission.lead') }}</p>
      </div>
    </section>
  `,
  styles: [
    `
      .mission {
        position: relative;
        overflow: hidden;
        background: var(--color-night);
        color: #fff;
        text-align: center;
      }
      .mission__bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: radial-gradient(
          ellipse 60% 80% at 50% 0%,
          color-mix(in srgb, var(--color-accent) 22%, transparent),
          transparent 70%
        );
      }
      .mission__inner {
        position: relative;
        max-width: 900px;
      }
      .eyebrow--dark {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.16);
      }
      .mission__title {
        color: #fff;
        margin-bottom: 22px;
        font-size: clamp(2rem, 4.4vw, 3.1rem);
      }
      .mission__lead {
        color: rgba(255, 255, 255, 0.74);
        font-size: clamp(1.12rem, 1.9vw, 1.4rem);
        line-height: 1.55;
        margin: 0 auto;
        max-width: 760px;
      }
    `,
  ],
})
export class Mission {
  readonly i18n = inject(I18nService);
}
