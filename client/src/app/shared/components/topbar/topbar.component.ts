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
      <div class="flex-1">
        <div class="text-sm text-gray-500">
          <i class="pi pi-calendar mr-2"></i>{{ currentDate | date:'fullDate':'':'de-DE' }}
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        @if (currentUser$ | async; as user) {
          <div class="flex items-center gap-3 px-4 py-2 rounded-xl" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              {{ user.displayName.charAt(0).toUpperCase() }}
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold text-gray-800">{{ user.displayName }}</div>
              <div class="text-xs text-gray-500">{{ user.username }}</div>
            </div>
          </div>
          <p-button 
            icon="pi pi-sign-out" 
            [text]="true" 
            [rounded]="true"
            severity="danger"
            (onClick)="logout()"
            pTooltip="Abmelden"
            tooltipPosition="bottom"
            styleClass="hover:bg-red-50"
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
  currentDate = new Date();

  logout(): void {
    this.authService.logout();
  }
}
