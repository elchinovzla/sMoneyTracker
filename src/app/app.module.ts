import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NotifierModule } from 'angular-notifier';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorComponent } from './error/error.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { MaterialModule } from './material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from './layout/components/components.module';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ErrorComponent, RecoverPasswordComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    NotifierModule,
    NgbModule,
    ComponentsModule,
    FormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [RecoverPasswordComponent],
  entryComponents: [ErrorComponent, RecoverPasswordComponent],
})
export class AppModule {}
