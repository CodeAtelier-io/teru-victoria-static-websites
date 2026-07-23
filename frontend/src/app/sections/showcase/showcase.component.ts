import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { ScrollDirective } from '../../core/directives/scroll.directive';

/**
 * Full-bleed cinematic "moment" — a dark stage with big 3D brand cards flying
 * across a tilted plane over a darkened photographic backdrop, with a large
 * centred headline and CTA. Cards drift at different speeds as you scroll
 * (parallax via the shared ScrollEngine), in the spirit of Revolut's hero
 * card sections. Always dark, regardless of the app's light/dark theme.
 *
 * Each card is two nested layers so transforms never collide: an outer wrapper
 * owns the scroll parallax (translate), the inner card owns its static 3D
 * rotation.
 */
@Component({
  selector: 'app-showcase',
  imports: [ScrollDirective],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
