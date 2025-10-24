import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, TooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'ME Management';
}
