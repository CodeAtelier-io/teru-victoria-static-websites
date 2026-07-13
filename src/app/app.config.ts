import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './core/config.service';
import { I18nService } from './core/i18n.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Load the active brand + its translations before the app renders, so the
    // first paint is already themed and localised.
    provideAppInitializer(async () => {
      const config = inject(ConfigService);
      const i18n = inject(I18nService);
      await config.load();
      await i18n.init();
    }),
  ],
};
