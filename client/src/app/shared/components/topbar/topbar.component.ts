import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * Topbar component with user info and logout using PrimeNG Toolbar
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, AvatarModule, MenuModule],
  template: `
    <p-toolbar styleClass="topbar">
      <ng-template pTemplate="start">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-calendar text-600"></i>
          <span class="text-600 text-sm">{{ currentDate | date:'fullDate':'':'de-DE' }}</span>
        </div>
      </ng-template>
      
      <ng-template pTemplate="end">
        <div class="flex align-items-center gap-3">
          @if (currentUser$ | async; as user) {
            <div class="user-info">
              <p-avatar
                [label]="user.displayName.charAt(0).toUpperCase()"
                styleClass="mr-2"
                [style]="{'background-color': 'var(--primary-color)', 'color': '#ffffff'}"
                shape="circle"
              />
              <div>
                <div class="user-name">{{ user.displayName }}</div>
                <div class="user-role">{{ user.username }}</div>
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
            />
          }
        </div>
      </ng-template>
    </p-toolbar>
  `,
  styles: []
})
export class TopbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  currentUser$ = this.authService.currentUser$;
  currentDate = new Date();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
