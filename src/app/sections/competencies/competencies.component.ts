import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';
import { ScrollDirective } from '../../core/directives/scroll.directive';

interface Competency {
  title: string;
  text: string;
}

/**
 * Competencies as two continuously-scrolling marquee rows (top drifts left,
 * bottom drifts right), pausing on hover — a lively "always moving" strip
 * rather than a static grid. Each row renders the list twice so the CSS
 * translateX(-50%) loops seamlessly.
 */
@Component({
  selector: 'app-competencies',
  imports: [ScrollDirective, NgTemplateOutlet],
  templateUrl: './competencies.component.html',
  styleUrl: './competencies.component.scss',
})
export class CompetenciesComponent {
  readonly i18n = inject(I18nService);

  items(): Competency[] {
    const value = this.i18n.t<Competency[]>('competencies.items');
    return Array.isArray(value) ? value : [];
  }

  /** Item count, for mapping duplicated cards back to their icon. */
  get count(): number {
    return this.items().length || 1;
  }

  /** The list rendered twice, so the marquee loops seamlessly. */
  cards(): Competency[] {
    const items = this.items();
    return [...items, ...items];
  }
}
