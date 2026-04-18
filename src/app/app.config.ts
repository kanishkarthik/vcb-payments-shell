import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { PAYMENTS_ROUTES } from './app.routes';
import { TranslationService, TRANSLATION_CONFIG } from '@vcb/shared-libs';

function initializeTranslations(): Promise<void> {
  return inject(TranslationService).initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(PAYMENTS_ROUTES, withEnabledBlockingInitialNavigation()),

    // Shared i18n library - uses absolute URL so it works standalone or as a remote
    {
      provide: TRANSLATION_CONFIG,
      useValue: {
        baseUrl: 'http://localhost:4201/assets/i18n/',
        supportedLanguages: ['en', 'vi'],
        defaultLanguage: 'en',
        debug: false
      }
    },
    TranslationService,
    provideAppInitializer(() => initializeTranslations())
  ]
};
