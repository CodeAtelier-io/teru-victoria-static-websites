import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';

@Component({
  selector: 'app-key-figures',
  imports: [RevealDirective, CountUpDirective, TiltDirective],
  templateUrl: './key-figures.component.html',
  styleUrl: './key-figures.component.scss',
})
export class KeyFiguresComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
