import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';

/**
 * Sidebar navigation component with PrimeNG menu
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuModule, DividerModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="app-logo">
          <i class="pi pi-building"></i>
        </div>
        <div>
          <h2 class="app-title">ME Management</h2>
          <p class="app-subtitle">Business Suite</p>
        </div>
      </div>
      
      <p-menu [model]="menuItems" styleClass="sidebar-menu w-full border-none" />
    </div>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Navigation',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            command: () => this.router.navigate(['/dashboard'])
          },
          {
            label: 'Kunden',
            icon: 'pi pi-users',
            command: () => this.router.navigate(['/customers'])
          },
          {
            label: 'Rechnungen',
            icon: 'pi pi-file-edit',
            command: () => this.router.navigate(['/invoices'])
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'System',
        items: [
          {
            label: 'Einstellungen',
            icon: 'pi pi-cog',
            command: () => this.router.navigate(['/settings'])
          }
        ]
      }
    ];
  }
}
