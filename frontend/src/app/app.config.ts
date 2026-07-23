import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './core/services/config.service';
import { I18nService } from './core/services/i18n.service';
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // 'top' → always open at the top of the page instead of restoring the
      // previous scroll position on reload.
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' }),
    ),
    // Load the active brand + its translations before the app renders, so the
    // first paint is already themed and localised.
    provideAppInitializer(async () => {
      const config = inject(ConfigService);
      const i18n = inject(I18nService);
      const theme = inject(ThemeService);
      theme.init();
      await config.load();
      await i18n.init();
    }),
  ],
};
