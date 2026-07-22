import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface Competency {
  title: string;
  text: string;
}

/**
 * Competencies as a clean, image-led card grid (Revolut "channels" style): each
 * card is a photo above a title and short description. The copy comes from the
 * shared i18n dictionary; the cover photos are shared assets paired by order.
 */
@Component({
  selector: 'app-competencies',
  imports: [RevealDirective],
  templateUrl: './competencies.component.html',
  styleUrl: './competencies.component.scss',
})
export class CompetenciesComponent {
  readonly i18n = inject(I18nService);

  /** Shared cover photos, paired with the competency items by order. */
  private readonly images = [
    'images/competencies/teamwork.jpg',
    'images/competencies/technology.jpg',
    'images/competencies/automation.jpg',
    'images/competencies/digital.jpg',
  ];

  items(): Array<Competency & { image: string }> {
    const value = this.i18n.t<Competency[]>('competencies.items');
    const list = Array.isArray(value) ? value : [];
    return list.map((item, i) => ({ ...item, image: this.images[i % this.images.length] }));
  }
}
