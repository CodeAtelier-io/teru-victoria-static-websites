import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule],
  template: `
    <section id="contacts" class="section">
      <div class="container contacts__grid">
        <div class="contacts__info">
          <span class="section__eyebrow">{{ i18n.t('contacts.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('contacts.title') }}</h2>
          <p class="section__lead">{{ i18n.t('contacts.lead') }}</p>

          <ul class="contacts__list">
            <li>
              <span class="contacts__label">{{ i18n.t('contacts.addressLabel') }}</span>
              <span>{{ config.brand.contact.address }}</span>
            </li>
            <li>
              <span class="contacts__label">{{ i18n.t('contacts.phoneLabel') }}</span>
              <a [href]="'tel:' + config.brand.contact.phone">{{ config.brand.contact.phone }}</a>
            </li>
            <li>
              <span class="contacts__label">{{ i18n.t('contacts.emailLabel') }}</span>
              <a [href]="'mailto:' + config.brand.contact.email">{{ config.brand.contact.email }}</a>
            </li>
          </ul>
        </div>

        <form class="contacts__form" (ngSubmit)="submit()">
          <label>
            {{ i18n.t('contacts.form.name') }}
            <input type="text" name="name" [(ngModel)]="name" required />
          </label>
          <label>
            {{ i18n.t('contacts.form.email') }}
            <input type="email" name="email" [(ngModel)]="email" required />
          </label>
          <label>
            {{ i18n.t('contacts.form.message') }}
            <textarea name="message" rows="4" [(ngModel)]="message" required></textarea>
          </label>
          <button type="submit" class="btn btn--primary">{{ i18n.t('contacts.form.send') }}</button>
        </form>
      </div>

      <div class="container">
        <div class="contacts__map">
          <iframe
            title="{{ config.brand.name }} — {{ i18n.t('contacts.mapTitle') }}"
            [src]="mapUrl()"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .contacts__grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 56px;
        align-items: start;
      }
      .contacts__list {
        list-style: none;
        padding: 0;
        margin: 26px 0 0;
        display: grid;
        gap: 20px;
      }
      .contacts__list li {
        display: grid;
        gap: 4px;
      }
      .contacts__label {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-muted);
      }
      .contacts__list a,
      .contacts__list span:not(.contacts__label) {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--color-ink);
      }
      .contacts__list a:hover {
        color: var(--color-accent);
      }
      .contacts__form {
        display: grid;
        gap: 16px;
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: 12px;
        padding: 32px;
      }
      .contacts__form label {
        display: grid;
        gap: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-ink);
      }
      .contacts__form input,
      .contacts__form textarea {
        font-family: inherit;
        font-size: 0.95rem;
        padding: 12px 14px;
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        background: var(--color-white);
        color: var(--color-ink);
        resize: vertical;
      }
      .contacts__form input:focus,
      .contacts__form textarea:focus {
        outline: none;
        border-color: var(--color-accent);
      }
      .contacts__form .btn {
        justify-content: center;
      }
      .contacts__map {
        margin-top: 48px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-sm);
        line-height: 0;
      }
      .contacts__map iframe {
        width: 100%;
        height: 420px;
        border: 0;
      }
      @media (max-width: 860px) {
        .contacts__grid {
          grid-template-columns: 1fr;
          gap: 36px;
        }
        .contacts__map iframe {
          height: 320px;
        }
      }
    `,
  ],
})
export class Contacts {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);

  /** Keyless Google Maps embed centred on the brand's location. */
  readonly mapUrl = computed<SafeResourceUrl>(() => {
    const contact = this.config.brand.contact;
    const query = encodeURIComponent(contact.mapQuery ?? contact.address);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${query}&output=embed`,
    );
  });

  name = '';
  email = '';
  message = '';

  submit(): void {
    const subject = encodeURIComponent(`${this.i18n.t('contacts.form.subject')} — ${this.name}`);
    const body = encodeURIComponent(`${this.message}\n\n${this.name} <${this.email}>`);
    window.location.href = `mailto:${this.config.brand.contact.email}?subject=${subject}&body=${body}`;
  }
}
