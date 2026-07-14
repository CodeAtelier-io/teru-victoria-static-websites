import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-products',
  imports: [RevealDirective],
  template: `
    <section id="products" class="section">
      <div class="container">
        <div class="products__head" appReveal>
          <span class="eyebrow">{{ i18n.t('products.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('products.title') }}</h2>
          <p class="section__lead">{{ i18n.t('products.lead') }}</p>
        </div>

        <div class="products__grid">
          @for (product of config.brand.products; track product.nameKey; let i = $index) {
            <article class="product" appReveal [revealDelay]="i * 120">
              <div class="product__media">
                <img [src]="product.image" [alt]="i18n.t(product.nameKey)" loading="lazy" />
              </div>
              <div class="product__body">
                <h3 class="product__title">{{ i18n.t(product.nameKey) }}</h3>
                <p>{{ i18n.t(product.descKey) }}</p>
                <a class="product__link" href="#contacts">
                  {{ i18n.t('products.viewMore') }}
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .products__head {
        max-width: 720px;
        margin-bottom: 52px;
      }
      .products__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }
      .product {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: var(--color-white);
        box-shadow: var(--shadow-sm);
        transition:
          transform 0.3s var(--ease),
          box-shadow 0.3s var(--ease);
      }
      .product:hover {
        transform: translateY(-6px);
        box-shadow: var(--shadow-lg);
      }
      .product__media {
        position: relative;
        aspect-ratio: 16 / 9;
        overflow: hidden;
      }
      .product__media::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 55%, rgba(10, 11, 22, 0.35));
      }
      .product__media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s var(--ease);
      }
      .product:hover .product__media img {
        transform: scale(1.06);
      }
      .product__body {
        padding: 28px 30px 32px;
      }
      .product__title {
        font-size: 1.45rem;
        margin-bottom: 10px;
      }
      .product__body p {
        margin-bottom: 18px;
      }
      .product__link {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-weight: 700;
        color: var(--color-accent);
      }
      .product__link svg {
        transition: transform 0.25s var(--ease);
      }
      .product__link:hover svg {
        transform: translateX(4px);
      }
      @media (max-width: 760px) {
        .products__grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Products {
  readonly config = inject(ConfigService);
  readonly i18n = inject(I18nService);
}
