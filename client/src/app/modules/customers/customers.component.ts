import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * Customers list component with CRUD operations
 */
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule],
  template: `
    <div class="container mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Kunden
          </h1>
          <p class="text-gray-600">Verwalten Sie Ihre Kundendatenbank</p>
        </div>
        <p-button 
          label="Neuer Kunde" 
          icon="pi pi-plus" 
          (onClick)="createCustomer()"
          [style]="{'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'border': 'none', 'padding': '0.75rem 1.5rem'}"
        />
      </div>
      
      <p-card>
        <p-table 
          [value]="customers" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
          [rowsPerPageOptions]="[10, 25, 50]"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">ID <p-sortIcon field="id"/></th>
              <th pSortableColumn="name">Name <p-sortIcon field="name"/></th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Ort</th>
              <th class="text-center">Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-customer>
            <tr>
              <td><span class="font-semibold text-purple-700">#{{ customer.id }}</span></td>
              <td><span class="font-medium">{{ customer.name }}</span></td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-envelope text-gray-400 text-sm"></i>
                  <span class="text-gray-600">{{ customer.email }}</span>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-phone text-gray-400 text-sm"></i>
                  <span class="text-gray-600">{{ customer.phone }}</span>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-map-marker text-gray-400 text-sm"></i>
                  <span class="text-gray-600">{{ customer.city }}</span>
                </div>
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <p-button 
                    icon="pi pi-pencil" 
                    [text]="true" 
                    [rounded]="true"
                    severity="info"
                    pTooltip="Bearbeiten"
                    tooltipPosition="top"
                    (onClick)="editCustomer(customer)"
                  />
                  <p-button 
                    icon="pi pi-trash" 
                    [text]="true" 
                    [rounded]="true"
                    severity="danger"
                    pTooltip="Löschen"
                    tooltipPosition="top"
                    (onClick)="deleteCustomer(customer)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center py-12">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-users text-6xl text-gray-300"></i>
                  <div>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Keine Kunden gefunden</p>
                    <p class="text-sm text-gray-500">Fügen Sie Ihren ersten Kunden hinzu</p>
                  </div>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: []
})
export class CustomersComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);

  customers: Customer[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden der Kunden');
        this.loading = false;
      }
    });
  }

  createCustomer(): void {
    this.toastService.info('Erstellen-Dialog noch nicht implementiert');
  }

  editCustomer(customer: Customer): void {
    this.toastService.info('Bearbeiten-Dialog noch nicht implementiert');
  }

  deleteCustomer(customer: Customer): void {
    this.toastService.info('Löschen noch nicht implementiert');
  }
}
