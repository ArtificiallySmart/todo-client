import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [OverviewComponent],
})
export class App {}
