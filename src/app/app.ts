import { Component } from '@angular/core';
import { About } from './components/about/about';
import { Differentials } from './components/differentials/differentials';
import { Footer } from './components/footer/footer';
import { Hero } from './components/hero/hero';
import { Instagram } from './components/instagram/instagram';
import { Nav } from './components/nav/nav';
import { Services } from './components/services/services';

@Component({
  selector: 'app-root',
  imports: [Nav, Hero, Services, About, Differentials, Instagram, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
