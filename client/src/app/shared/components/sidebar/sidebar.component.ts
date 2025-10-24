import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Sidebar navigation component with menu items
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">ME Management</h2>
      </div>
      
      <nav class="mt-4">
        <a 
          routerLink="/dashboard" 
          routerLinkActive="bg-gray-700" 
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <i class="pi pi-home mr-3"></i>
          <span>Dashboard</span>
        </a>
        
        <a 
          routerLink="/customers" 
          routerLinkActive="bg-gray-700"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <i class="pi pi-users mr-3"></i>
          <span>Kunden</span>
        </a>
        
        <a 
          routerLink="/invoices" 
          routerLinkActive="bg-gray-700"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <i class="pi pi-file mr-3"></i>
          <span>Rechnungen</span>
        </a>
        
        <a 
          routerLink="/offers" 
          routerLinkActive="bg-gray-700"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <i class="pi pi-book mr-3"></i>
          <span>Angebote</span>
        </a>
        
        <a 
          routerLink="/settings" 
          routerLinkActive="bg-gray-700"
          class="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <i class="pi pi-cog mr-3"></i>
          <span>Einstellungen</span>
        </a>
      </nav>
    </div>
  `,
  styles: []
})
export class SidebarComponent {}
