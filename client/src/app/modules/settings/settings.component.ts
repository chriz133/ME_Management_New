import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

/**
 * Settings component - placeholder for future settings
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-6">Einstellungen</h1>
      
      <p-card>
        <div class="text-center py-8">
          <i class="pi pi-cog text-6xl text-gray-300 mb-4"></i>
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Einstellungen</h2>
          <p class="text-gray-500">Einstellungsseite wird bald verfügbar sein</p>
        </div>
      </p-card>
    </div>
  `,
  styles: []
})
export class SettingsComponent {}
