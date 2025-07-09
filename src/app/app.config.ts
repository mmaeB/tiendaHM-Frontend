import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { JwtModule } from "@auth0/angular-jwt";
import { ServerErrorsInterceptor } from './interceptor/server-error.interceptor';

// Recuperar el valor del acces token
export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom( // como se va a propagar
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:9090"], // hacia que peticiones se propagara los tokens, no colocar http, solo se coloca el dominio
          disallowedRoutes: ["http://localhost:9090/login/forget"], // rutas no obligatorias para usar token
        },
      }),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    }
  ]
};
