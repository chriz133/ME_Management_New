import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Topbar component with user info and logout
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  template: `
    <div class="topbar flex items-center justify-between">
      <div class="flex-1"></div>
      
      <div class="flex items-center gap-3">
        @if (currentUser$ | async; as user) {
          <div class="text-right">
            <div class="text-sm font-medium text-gray-700">{{ user.displayName }}</div>
            <div class="text-xs text-gray-500">{{ user.username }}</div>
          </div>
          <p-button 
            icon="pi pi-sign-out" 
            [text]="true" 
            [rounded]="true"
            severity="danger"
            (onClick)="logout()"
            pTooltip="Abmelden"
            tooltipPosition="bottom"
          />
        }
      </div>
    </div>
  `,
  styles: []
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  
  currentUser$ = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
  }
}
