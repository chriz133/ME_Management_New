import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * Customers list component with CRUD operations using PrimeNG components
 */
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, ToolbarModule, TooltipModule],
  template: `
    <div class="customers-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="pi pi-users mr-3"></i>Kunden
          </h1>
          <p class="page-subtitle">Verwalten Sie Ihre Kundendatenbank</p>
        </div>
      </div>

      <p-card>
        <ng-template pTemplate="header">
          <div class="table-header">
            <div class="flex justify-content-between align-items-center">
              <div>
                <h3 class="table-title">
                  <i class="pi pi-list mr-2"></i>Kundenliste
                </h3>
                <p class="table-subtitle">Alle registrierten Kunden im System</p>
              </div>
              <p-button
                label="Neuer Kunde"
                icon="pi pi-plus"
                (onClick)="createCustomer()"
                severity="primary"
              />
            </div>
          </div>
        </ng-template>

        <p-table
          [value]="customers"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
          [rowsPerPageOptions]="[10, 25, 50]"
          [rowHover]="true"
          dataKey="id"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">ID <p-sortIcon field="id"/></th>
              <th pSortableColumn="name">Name <p-sortIcon field="name"/></th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Ort</th>
              <th class="text-center" style="width: 180px;">Aktionen</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-customer>
            <tr>
              <td>
                <span class="font-bold text-primary">{{customer.id}}</span>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-user text-600"></i>
                  <span class="font-semibold">{{ customer.name }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-envelope text-600"></i>
                  <span>{{ customer.email }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-phone text-600"></i>
                  <span>{{ customer.phone }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-map-marker text-600"></i>
                  <span>{{ customer.city }}</span>
                </div>
              </td>
              <td class="text-center">
                <div class="flex gap-2 justify-content-center">
                  <p-button
                    icon="pi pi-pencil"
                    [rounded]="true"
                    [text]="true"
                    severity="success"
                    (onClick)="editCustomer(customer)"
                    pTooltip="Bearbeiten"
                  />
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    (onClick)="deleteCustomer(customer)"
                    pTooltip="Löschen"
                  />
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6">
                <div class="p-empty-state">
                  <div class="p-empty-state-icon">
                    <i class="pi pi-users"></i>
                  </div>
                  <h3 class="p-empty-state-title">Keine Kunden gefunden</h3>
                  <p class="p-empty-state-message">
                    Beginnen Sie damit, Ihren ersten Kunden hinzuzufügen.
                  </p>
                  <p-button
                    label="Neuer Kunde"
                    icon="pi pi-plus"
                    (onClick)="createCustomer()"
                    severity="primary"
                    styleClass="mt-3"
                  />
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
  loading = true;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Fehler', 'Kunden konnten nicht geladen werden');
        this.loading = false;
      }
    });
  }

  createCustomer(): void {
    this.toastService.info('Info', 'Kunde erstellen - Funktion noch nicht implementiert');
  }

  editCustomer(customer: Customer): void {
    this.toastService.info('Info', `Kunde ${customer.name} bearbeiten - Funktion noch nicht implementiert`);
  }

  deleteCustomer(customer: Customer): void {
    this.toastService.info('Info', `Kunde ${customer.name} löschen - Funktion noch nicht implementiert`);
  }
}
