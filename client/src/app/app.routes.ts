import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { CustomersComponent } from './modules/customers/customers.component';
import { CustomerDetailComponent } from './modules/customers/customer-detail/customer-detail.component';
import { CustomerCreateComponent } from './modules/customers/customer-create/customer-create.component';
import { InvoicesComponent } from './modules/invoices/invoices.component';
import { InvoiceDetailComponent } from './modules/invoices/invoice-detail/invoice-detail.component';
import { InvoiceCreateComponent } from './modules/invoices/invoice-create/invoice-create.component';
import { ContractsComponent } from './modules/contracts/contracts.component';
import { ContractDetailComponent } from './modules/contracts/contract-detail/contract-detail.component';
import { ContractCreateComponent } from './modules/contracts/contract-create/contract-create.component';
import { TransactionsComponent } from './modules/transactions/transactions.component';
import { TransactionCreateComponent } from './modules/transactions/transaction-create.component';
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
        path: 'customers/create',
        component: CustomerCreateComponent
      },
      {
        path: 'customers/:id',
        component: CustomerDetailComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent
      },
      {
        path: 'invoices/create',
        component: InvoiceCreateComponent
      },
      {
        path: 'invoices/:id',
        component: InvoiceDetailComponent
      },
      {
        path: 'contracts',
        component: ContractsComponent
      },
      {
        path: 'contracts/create',
        component: ContractCreateComponent
      },
      {
        path: 'contracts/:id',
        component: ContractDetailComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'transactions/create',
        component: TransactionCreateComponent
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
