import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

/**
 * Dashboard component - main landing page after login
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <p-card>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-1">Kunden</div>
              <div class="text-2xl font-bold">-</div>
            </div>
            <i class="pi pi-users text-4xl text-blue-500"></i>
          </div>
        </p-card>
        
        <p-card>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-1">Rechnungen</div>
              <div class="text-2xl font-bold">-</div>
            </div>
            <i class="pi pi-file text-4xl text-green-500"></i>
          </div>
        </p-card>
        
        <p-card>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-1">Angebote</div>
              <div class="text-2xl font-bold">-</div>
            </div>
            <i class="pi pi-book text-4xl text-purple-500"></i>
          </div>
        </p-card>
        
        <p-card>
          <div class="flex items-center justify-between">
            <div>
              <div class="text-gray-500 text-sm mb-1">Offene Rechnungen</div>
              <div class="text-2xl font-bold">-</div>
            </div>
            <i class="pi pi-dollar text-4xl text-orange-500"></i>
          </div>
        </p-card>
      </div>
      
      <div class="mt-6">
        <p-card>
          <div class="text-center py-8">
            <i class="pi pi-chart-line text-6xl text-gray-300 mb-4"></i>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">Willkommen im ME Management System</h2>
            <p class="text-gray-500">Internes Geschäftsverwaltungssystem für Rechnungen, Angebote und Kundenverwaltung</p>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
