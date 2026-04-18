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
  AuthInterceptor
} from '@vcb/shared-libs';

function initializeTranslations(): Promise<void> {
  return inject(TranslationService).initialize();
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
    provideAppInitializer(() => initializeTranslations()),
    
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
