import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
  readonly year = new Date().getFullYear();
}
