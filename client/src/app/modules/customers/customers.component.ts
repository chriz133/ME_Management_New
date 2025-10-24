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
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Kunden</h1>
        <p-button label="Neuer Kunde" icon="pi pi-plus" (onClick)="createCustomer()" />
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
              <th>Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-customer>
            <tr>
              <td>{{ customer.id }}</td>
              <td>{{ customer.name }}</td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.city }}</td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-pencil" 
                    [text]="true" 
                    [rounded]="true"
                    severity="info"
                    pTooltip="Bearbeiten"
                    (onClick)="editCustomer(customer)"
                  />
                  <p-button 
                    icon="pi pi-trash" 
                    [text]="true" 
                    [rounded]="true"
                    severity="danger"
                    pTooltip="Löschen"
                    (onClick)="deleteCustomer(customer)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center">Keine Kunden gefunden</td>
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
