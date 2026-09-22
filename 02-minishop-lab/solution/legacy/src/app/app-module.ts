import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { MaterialModule } from './material-module';
import { App } from './app';
import { Header } from './pages/layout/header/header';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { NotFound } from './pages/not-found/not-found';

@NgModule({
  declarations: [App, Header, Home, About, NotFound],
  imports: [BrowserModule, AppRoutingModule, MaterialModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Sans cette ligne : "No provider for HttpClient".
    provideHttpClient(),
  ],
  bootstrap: [App],
})
export class AppModule {}
