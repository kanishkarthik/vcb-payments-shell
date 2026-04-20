import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PAYMENTS_ROUTES } from './app.routes';
import {
  TranslationService,
  TRANSLATION_CONFIG,
  AuthenticationService,
  TokenService,
  ErrorHandlingService,
  AuthInterceptor,
  RuntimeConfigService
} from '@vcb/shared-libs';

async function initializeApp(): Promise<void> {
  const configService = inject(RuntimeConfigService);
  const translationService = inject(TranslationService);
  // Standalone mode: load this shell's own app-config.json (has bkt/dft/ops).
  // When embedded in digital-shell this bootstrap never runs — the host resolver
  // calls mergeConfig instead before activating any sub-routes.
  await configService.load();
  await translationService.initialize();
}

/**
 * Initialize authentication state on app startup.
 * Checks for existing tokens and restores user session.
 */
function initializeAuthentication(): void {
  const authService = inject(AuthenticationService);
  // Authentication service initializes its own state in constructor
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(PAYMENTS_ROUTES, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    // Shared i18n library - reads baseUrl from runtime config (loaded before this is used)
    {
      provide: TRANSLATION_CONFIG,
      useFactory: (configService: RuntimeConfigService) => ({
        baseUrl: configService.get('i18nBaseUrl'),
        supportedLanguages: ['en', 'vi'],
        defaultLanguage: 'en',
        debug: false
      }),
      deps: [RuntimeConfigService]
    },
    TranslationService,
    provideAppInitializer(() => initializeApp()),

    // Authentication & Security
    AuthenticationService,
    TokenService,
    ErrorHandlingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // App Initialization
    provideAppInitializer(() => initializeAuthentication())
  ]
};
