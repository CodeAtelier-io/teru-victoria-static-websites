import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/config.service';
import { Hero } from '../../sections/hero/hero';
import { About } from '../../sections/about/about';
import { Mission } from '../../sections/mission/mission';
import { Competencies } from '../../sections/competencies/competencies';
import { Products } from '../../sections/products/products';
import { KeyFigures } from '../../sections/key-figures/key-figures';
import { News } from '../../sections/news/news';
import { Contacts } from '../../sections/contacts/contacts';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Mission, Competencies, Products, KeyFigures, News, Contacts],
  template: `
    <app-hero />
    <app-about />
    @if (features.showMission) {
      <app-mission />
    }
    @if (features.showCompetencies) {
      <app-competencies />
    }
    @if (features.showProducts) {
      <app-products />
    }
    @if (features.showKeyFigures) {
      <app-key-figures />
    }
    @if (features.showNews) {
      <app-news />
    }
    <app-contacts />
  `,
})
export class Home {
  private readonly config = inject(ConfigService);
  get features() {
    return this.config.brand.features;
  }
}
