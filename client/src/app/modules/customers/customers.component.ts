import { Router } from "@angular/router";
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    CardModule, 
    ToolbarModule, 
    TooltipModule, 
    TagModule,
    InputTextModule
  ],
  template: `
    <div class="customers-page p-4">
      <div class="page-header mb-4">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="page-title m-0 mb-2">
              <i class="pi pi-users mr-2"></i>Kunden
            </h1>
            <p class="page-subtitle text-600 m-0">Verwalten Sie Ihre Kundendatenbank aus firmaDB</p>
          </div>
          <div class="flex gap-2">
            <p-button 
              label="Neu erstellen"
              icon="pi pi-plus" 
              (onClick)="navigateToCreate()"
            />
            <p-button 
              icon="pi pi-refresh" 
              [rounded]="true"
              [outlined]="true"
              (onClick)="loadCustomers()"
              pTooltip="Aktualisieren"
            />
          </div>
        </div>
      </div>

      <p-card>
        <ng-template pTemplate="header">
          <div class="p-3">
            <div class="flex justify-content-between align-items-center">
              <div>
                <h3 class="m-0 mb-1">
                  <i class="pi pi-list mr-2"></i>Kundenliste
                </h3>
                <p class="text-600 m-0 text-sm">{{customers.length}} Kunden gefunden</p>
              </div>
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input 
                  pInputText 
                  type="text" 
                  (input)="dt.filterGlobal($any($event.target).value, 'contains')" 
                  placeholder="Suchen..." 
                  class="p-inputtext-sm"
                />
              </span>
            </div>
          </div>
        </ng-template>

        <p-table
          #dt
          [value]="customers"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [rowHover]="true"
          [globalFilterFields]="['fullName', 'city', 'uid']"
          dataKey="customerId"
          styleClass="p-datatable-sm p-datatable-striped"
          responsiveLayout="scroll"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="customerId" style="width: 80px;">
                <div class="flex align-items-center">
                  ID 
                  <p-sortIcon field="customerId"/>
                </div>
              </th>
              <th pSortableColumn="fullName">
                <div class="flex align-items-center">
                  Name 
                  <p-sortIcon field="fullName"/>
                </div>
              </th>
              <th>Adresse</th>
              <th pSortableColumn="city">
                <div class="flex align-items-center">
                  Ort 
                  <p-sortIcon field="city"/>
                </div>
              </th>
              <th>PLZ</th>
              <th>UID</th>
              <th class="text-center" style="width: 100px;">Aktionen</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-customer>
            <tr>
              <td>
                <p-tag [value]="customer.customerId.toString()" severity="info" [rounded]="true" />
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-user text-primary"></i>
                  <span class="font-semibold">{{ customer.fullName }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-home text-600"></i>
                  <span>{{ customer.address }} {{ customer.nr }}</span>
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-map-marker text-600"></i>
                  <span>{{ customer.city }}</span>
                </div>
              </td>
              <td>
                <p-tag [value]="customer.plz?.toString() || 'N/A'" severity="secondary" />
              </td>
              <td>
                <span class="text-sm font-mono">{{ customer.uid || '-' }}</span>
              </td>
              <td class="text-center">
                <p-button
                  icon="pi pi-eye"
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  (onClick)="viewCustomer(customer)"
                  pTooltip="Details anzeigen"
                  tooltipPosition="left"
                />
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7">
                <div class="flex flex-column align-items-center justify-content-center py-5">
                  <i class="pi pi-users text-6xl text-400 mb-3"></i>
                  <h3 class="text-900 font-semibold mb-2">Keine Kunden gefunden</h3>
                  <p class="text-600 m-0">
                    Es wurden keine Kunden in der Datenbank gefunden.
                  </p>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="loadingbody">
            <tr>
              <td colspan="7">
                <div class="flex align-items-center justify-content-center py-4">
                  <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
                  <span class="ml-3 text-lg">Lade Daten...</span>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .customers-page {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .page-subtitle {
      font-size: 0.95rem;
    }

    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background-color: var(--surface-50);
        font-weight: 600;
        padding: 1rem;
      }

      .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.75rem 1rem;
      }

      .p-datatable .p-datatable-tbody > tr:hover {
        background-color: var(--primary-50);
      }

      .p-card .p-card-body {
        padding: 0;
      }

      .p-card .p-card-content {
        padding: 0;
      }
    }
  `]
})
export class CustomersComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

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
        this.toastService.success('Erfolg', `${data.length} Kunden geladen`);
      },
      error: () => {
        this.toastService.error('Fehler', 'Kunden konnten nicht geladen werden');
        this.loading = false;
      }
    });
  }

  viewCustomer(customer: Customer): void {
    this.router.navigate(["/customers", customer.customerId]);
    this.toastService.info('Info', `Kunde: ${customer.fullName}`);
  }

  navigateToCreate(): void {
    this.router.navigate(['/customers/create']);
  }
}
