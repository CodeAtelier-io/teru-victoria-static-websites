import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../core/services/config.service';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { LocationsComponent } from '../locations/locations.component';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, RevealDirective, LocationsComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);

  name = '';
  email = '';
  message = '';

  submit(): void {
    const subject = encodeURIComponent(`${this.i18n.t('contacts.form.subject')} — ${this.name}`);
    const body = encodeURIComponent(`${this.message}\n\n${this.name} <${this.email}>`);
    window.location.href = `mailto:${this.config.brand.contact.email}?subject=${subject}&body=${body}`;
  }
}
