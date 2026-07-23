import { Component, inject } from '@angular/core';
import { ConfigService } from '../../core/services/config.service';
import { HeroComponent } from '../../sections/hero/hero.component';
import { AboutComponent } from '../../sections/about/about.component';
import { MissionComponent } from '../../sections/mission/mission.component';
import { CompetenciesComponent } from '../../sections/competencies/competencies.component';
import { ProductsComponent } from '../../sections/products/products.component';
import { ShowcaseComponent } from '../../sections/showcase/showcase.component';
import { KeyFiguresComponent } from '../../sections/key-figures/key-figures.component';
import { NewsComponent } from '../../sections/news/news.component';
import { ContactsComponent } from '../../sections/contacts/contacts.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, AboutComponent, MissionComponent, CompetenciesComponent, ProductsComponent, ShowcaseComponent, KeyFiguresComponent, NewsComponent, ContactsComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly config = inject(ConfigService);
  get features() {
    return this.config.brand.features;
  }
}
