import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { I18nService } from '../../core/i18n.service';

@Component({
  selector: 'app-products',
  imports: [],
  template: `
    <section id="products" class="section">
      <div class="container">
        <div class="products__head">
          <span class="section__eyebrow">{{ i18n.t('products.eyebrow') }}</span>
          <h2 class="section__title">{{ i18n.t('products.title') }}</h2>
          <p class="section__lead">{{ i18n.t('products.lead') }}</p>
        </div>

        <div class="products__grid">
          @for (product of config.brand.products; track product.nameKey) {
            <article class="product">
              <div class="product__media">
                <img [src]="product.image" [alt]="i18n.t(product.nameKey)" loading="lazy" />
              </div>
              <div class="product__body">
                <h3 class="product__title">{{ i18n.t(product.nameKey) }}</h3>
                <p>{{ i18n.t(product.descKey) }}</p>
                <a class="product__link" href="#contacts">{{ i18n.t('products.viewMore') }} →</a>
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
        margin-bottom: 44px;
      }
      .products__grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 26px;
      }
      .product {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--color-line);
        border-radius: 12px;
        overflow: hidden;
        background: var(--color-white);
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease;
      }
      .product:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
      }
      .product__media {
        aspect-ratio: 16 / 9;
        overflow: hidden;
      }
      .product__media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .product__body {
        padding: 26px 28px 30px;
      }
      .product__title {
        font-size: 1.35rem;
        margin-bottom: 10px;
      }
      .product__link {
        display: inline-block;
        margin-top: 8px;
        font-weight: 700;
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
