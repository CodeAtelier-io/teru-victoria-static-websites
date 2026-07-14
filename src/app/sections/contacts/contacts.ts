import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';
import { Locations } from '../locations/locations';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, RevealDirective, Locations],
  template: `
    <section id="contacts" class="section">
      <div class="container contacts__grid">
        <div class="contacts__info" appReveal revealFrom="left">
          <div class="contacts__brand">
            <span class="contacts__logo">
              <img [src]="config.brand.images.logo" [alt]="i18n.brandName()" />
            </span>
            <span class="contacts__brand-name">{{ i18n.brandName() }}</span>
          </div>
          <span class="eyebrow">{{ i18n.t('contacts.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('contacts.title') }}</h2>
          <p class="section__lead">{{ i18n.t('contacts.lead') }}</p>

          <ul class="contacts__list">
            <li>
              <span class="contacts__ico">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                  stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span>
                <span class="contacts__label">{{ i18n.t('contacts.addressLabel') }}</span>
                <span class="contacts__val">{{ config.brand.contact.address }}</span>
              </span>
            </li>
            <li>
              <span class="contacts__ico">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                  stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 5c0 8.3 6.7 15 15 15l-.5-3.5-4 .5-3.5-4 .5-4L8 5H4z" />
                </svg>
              </span>
              <span>
                <span class="contacts__label">{{ i18n.t('contacts.phoneLabel') }}</span>
                <a class="contacts__val" [href]="'tel:' + config.brand.contact.phone">
                  {{ config.brand.contact.phone }}
                </a>
              </span>
            </li>
            <li>
              <span class="contacts__ico">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                  stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>
              <span>
                <span class="contacts__label">{{ i18n.t('contacts.emailLabel') }}</span>
                <a class="contacts__val" [href]="'mailto:' + config.brand.contact.email">
                  {{ config.brand.contact.email }}
                </a>
              </span>
            </li>
          </ul>
        </div>

        <form class="contacts__form" appReveal revealFrom="right" [revealDelay]="120" (ngSubmit)="submit()">
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
        <div class="contacts__offices">
          <h3 class="contacts__offices-title">{{ i18n.t('locations.title') }}</h3>
          <p class="section__lead">{{ i18n.t('locations.lead') }}</p>
        </div>
        <app-locations />
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
      .contacts__brand {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 22px;
      }
      .contacts__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 13px;
        background: #fff;
        border: 1px solid var(--color-line);
        box-shadow: var(--shadow-sm);
        overflow: hidden;
        flex: none;
      }
      .contacts__logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 4px;
      }
      .contacts__brand-name {
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--color-ink);
      }
      .contacts__list {
        list-style: none;
        padding: 0;
        margin: 30px 0 0;
        display: grid;
        gap: 22px;
      }
      .contacts__list li {
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }
      .contacts__ico {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        flex: none;
        border-radius: 13px;
        color: var(--color-accent);
        background: color-mix(in srgb, var(--color-accent) 12%, transparent);
      }
      .contacts__label {
        display: block;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-muted);
        margin-bottom: 2px;
      }
      .contacts__val {
        font-size: 1.08rem;
        font-weight: 600;
        color: var(--color-ink);
      }
      a.contacts__val:hover {
        color: var(--color-accent);
      }
      .contacts__form {
        display: grid;
        gap: 18px;
        background: var(--color-white);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        padding: 36px;
        box-shadow: var(--shadow-md);
      }
      .contacts__form label {
        display: grid;
        gap: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-ink);
      }
      .contacts__form input,
      .contacts__form textarea {
        font-family: inherit;
        font-size: 0.98rem;
        padding: 14px 16px;
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        background: var(--color-surface);
        color: var(--color-ink);
        resize: vertical;
        transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s var(--ease);
      }
      .contacts__form input:focus,
      .contacts__form textarea:focus {
        outline: none;
        background: var(--color-white);
        border-color: var(--color-accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 16%, transparent);
      }
      .contacts__form .btn {
        margin-top: 4px;
      }
      .contacts__offices {
        max-width: 720px;
        margin: 64px 0 26px;
      }
      .contacts__offices-title {
        font-size: 1.7rem;
        margin-bottom: 8px;
      }
      @media (max-width: 860px) {
        .contacts__grid {
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .contacts__offices {
          margin-top: 48px;
        }
      }
    `,
  ],
})
export class Contacts {
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
