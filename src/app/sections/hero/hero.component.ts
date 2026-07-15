import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';
import { ScrollDirective } from '../../core/directives/scroll.directive';
import { SceneDirective } from '../../core/directives/scene.directive';

/**
 * Full-bleed cinematic hero: the brand image fills the screen and slowly zooms
 * as you scroll, with the headline overlaid and a frosted-glass "approval"
 * panel floating over it (parallaxes with the cursor). Always reads as a dark
 * immersive banner regardless of the app theme, fading into the page below.
 */
@Component({
  selector: 'app-hero',
  imports: [RevealDirective, TiltDirective, ScrollDirective, SceneDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
