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
    <div class="container mx-auto max-w-7xl">
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p class="text-gray-600">Übersicht über Ihre Geschäftsaktivitäten</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Kunden Card -->
        <div class="stat-card rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
            <div class="w-full h-full rounded-full" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
          </div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="stat-card-icon">
                <i class="pi pi-users text-2xl text-white"></i>
              </div>
            </div>
            <div class="text-gray-600 text-sm font-medium mb-1">Kunden</div>
            <div class="text-3xl font-bold text-gray-800 mb-2">-</div>
            <div class="text-xs text-gray-500"><i class="pi pi-arrow-up text-green-500 mr-1"></i>Alle Kunden anzeigen</div>
          </div>
        </div>
        
        <!-- Rechnungen Card -->
        <div class="stat-card rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
            <div class="w-full h-full rounded-full" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
          </div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="stat-card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <i class="pi pi-file text-2xl text-white"></i>
              </div>
            </div>
            <div class="text-gray-600 text-sm font-medium mb-1">Rechnungen</div>
            <div class="text-3xl font-bold text-gray-800 mb-2">-</div>
            <div class="text-xs text-gray-500"><i class="pi pi-arrow-up text-green-500 mr-1"></i>Alle Rechnungen anzeigen</div>
          </div>
        </div>
        
        <!-- Angebote Card -->
        <div class="stat-card rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
            <div class="w-full h-full rounded-full" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
          </div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="stat-card-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <i class="pi pi-book text-2xl text-white"></i>
              </div>
            </div>
            <div class="text-gray-600 text-sm font-medium mb-1">Angebote</div>
            <div class="text-3xl font-bold text-gray-800 mb-2">-</div>
            <div class="text-xs text-gray-500"><i class="pi pi-arrow-up text-green-500 mr-1"></i>Alle Angebote anzeigen</div>
          </div>
        </div>
        
        <!-- Offene Rechnungen Card -->
        <div class="stat-card rounded-2xl p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
            <div class="w-full h-full rounded-full" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);"></div>
          </div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="stat-card-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                <i class="pi pi-dollar text-2xl text-white"></i>
              </div>
            </div>
            <div class="text-gray-600 text-sm font-medium mb-1">Offene Rechnungen</div>
            <div class="text-3xl font-bold text-gray-800 mb-2">-</div>
            <div class="text-xs text-gray-500"><i class="pi pi-arrow-right text-orange-500 mr-1"></i>Details anzeigen</div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <p-card styleClass="h-full">
          <div class="text-center py-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <i class="pi pi-chart-line text-4xl text-white"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-3">Willkommen im ME Management System</h2>
            <p class="text-gray-600 max-w-md mx-auto">Internes Geschäftsverwaltungssystem für Rechnungen, Angebote und Kundenverwaltung</p>
          </div>
        </p-card>

        <p-card styleClass="h-full">
          <h3 class="text-xl font-bold text-gray-800 mb-4"><i class="pi pi-bolt mr-2 text-yellow-500"></i>Schnellaktionen</h3>
          <div class="flex flex-col gap-3">
            <button class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-200">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="pi pi-user-plus text-white"></i>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Neuer Kunde</div>
                <div class="text-xs text-gray-500">Kunden hinzufügen</div>
              </div>
            </button>
            
            <button class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-200">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <i class="pi pi-file-plus text-white"></i>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Neue Rechnung</div>
                <div class="text-xs text-gray-500">Rechnung erstellen</div>
              </div>
            </button>
            
            <button class="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-all text-left border border-gray-200">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <i class="pi pi-book text-white"></i>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Neues Angebot</div>
                <div class="text-xs text-gray-500">Angebot erstellen</div>
              </div>
            </button>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
