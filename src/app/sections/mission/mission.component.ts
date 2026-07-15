import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { SceneDirective } from '../../core/directives/scene.directive';

@Component({
  selector: 'app-mission',
  imports: [RevealDirective, SceneDirective],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss',
})
export class MissionComponent {
  readonly i18n = inject(I18nService);
}
