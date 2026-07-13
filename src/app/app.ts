import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { Home } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Home],
  template: `
    <app-header />
    <main>
      <app-home />
    </main>
    <app-footer />
  `,
  styles: [
    `
      main {
        display: block;
      }
    `,
  ],
})
export class App {}
