import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CustomersComponent } from './modules/customers/customers.component';
import { InvoicesComponent } from './modules/invoices/invoices.component';
import { SettingsComponent } from './modules/settings/settings.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
