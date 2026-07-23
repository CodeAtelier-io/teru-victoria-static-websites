import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { ScrollDirective } from '../../core/directives/scroll.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';

/**
 * Products presented as full-width, alternating "story" rows — a big image on
 * one side, copy on the other, sides flipping every row. As you scroll, the
 * image drifts (parallax) and zooms down to rest while the copy rises in, for
 * Revolut-style scroll-told sections instead of a static card grid.
 */
@Component({
  selector: 'app-products',
  imports: [ScrollDirective, TiltDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
