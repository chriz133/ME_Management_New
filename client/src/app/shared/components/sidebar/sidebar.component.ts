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
      <div class="p-6 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <i class="pi pi-building text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-lg font-bold">ME Management</h2>
            <p class="text-xs text-gray-400">Business Suite</p>
          </div>
        </div>
      </div>
      
      <nav class="mt-6 px-3">
        <a 
          routerLink="/dashboard" 
          routerLinkActive="active"
          #dashboardLink="routerLinkActive"
          [class.active]="dashboardLink.isActive"
          class="sidebar-link flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all rounded-xl"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" 
               [style.background]="dashboardLink.isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'">
            <i class="pi pi-home"></i>
          </div>
          <span class="font-medium">Dashboard</span>
        </a>
        
        <a 
          routerLink="/customers" 
          routerLinkActive="active"
          #customersLink="routerLinkActive"
          [class.active]="customersLink.isActive"
          class="sidebar-link flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all rounded-xl"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" 
               [style.background]="customersLink.isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'">
            <i class="pi pi-users"></i>
          </div>
          <span class="font-medium">Kunden</span>
        </a>
        
        <a 
          routerLink="/invoices" 
          routerLinkActive="active"
          #invoicesLink="routerLinkActive"
          [class.active]="invoicesLink.isActive"
          class="sidebar-link flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all rounded-xl"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" 
               [style.background]="invoicesLink.isActive ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'transparent'">
            <i class="pi pi-file"></i>
          </div>
          <span class="font-medium">Rechnungen</span>
        </a>
        
        <a 
          routerLink="/offers" 
          routerLinkActive="active"
          #offersLink="routerLinkActive"
          [class.active]="offersLink.isActive"
          class="sidebar-link flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all rounded-xl"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" 
               [style.background]="offersLink.isActive ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'transparent'">
            <i class="pi pi-book"></i>
          </div>
          <span class="font-medium">Angebote</span>
        </a>
        
        <div class="my-4 border-t border-gray-700"></div>
        
        <a 
          routerLink="/settings" 
          routerLinkActive="active"
          #settingsLink="routerLinkActive"
          [class.active]="settingsLink.isActive"
          class="sidebar-link flex items-center px-4 py-3 mb-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-all rounded-xl"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" 
               [style.background]="settingsLink.isActive ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 'transparent'">
            <i class="pi pi-cog"></i>
          </div>
          <span class="font-medium">Einstellungen</span>
        </a>
      </nav>
    </div>
  `,
  styles: []
})
export class SidebarComponent {}
