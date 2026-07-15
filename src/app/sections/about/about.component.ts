import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';
import { ScrollDirective } from '../../core/directives/scroll.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, TiltDirective, ScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);

  points(): string[] {
    const value = this.i18n.t<string[]>('about.points');
    return Array.isArray(value) ? value : [];
  }
}
