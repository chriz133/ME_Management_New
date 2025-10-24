import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { Invoice } from '../../../core/models/invoice.model';
import { Contract } from '../../../core/models/contract.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    DividerModule,
    SkeletonModule,
    AccordionModule
  ],
  template: `
    <div class="customer-detail p-4">
      <div class="mb-4">
        <p-button
          icon="pi pi-arrow-left"
          label="Zurück"
          [text]="true"
          (onClick)="goBack()"
        />
      </div>

      <p-card *ngIf="!loading && customer">
        <ng-template pTemplate="header">
          <div class="p-4">
            <div class="flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h2 class="m-0 mb-2 text-2xl font-bold">
                  <i class="pi pi-user mr-2 text-primary"></i>
                  {{customer.fullName}}
                </h2>
                <p-tag [value]="'ID: ' + customer.customerId" severity="info" />
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Overview Section -->
        <div class="mb-4">
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-info-circle mr-2"></i>Übersicht
          </h3>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h4 class="text-lg font-semibold mb-3">Kontaktinformationen</h4>
              <div class="flex flex-column gap-3">
                <div>
                  <label class="font-semibold text-600">Name:</label>
                  <div class="mt-1">{{customer.fullName}}</div>
                </div>
                <div>
                  <label class="font-semibold text-600">Vorname:</label>
                  <div class="mt-1">{{customer.firstname}}</div>
                </div>
                <div>
                  <label class="font-semibold text-600">Nachname:</label>
                  <div class="mt-1">{{customer.surname}}</div>
                </div>
                <div>
                  <label class="font-semibold text-600">UID:</label>
                  <div class="mt-1 font-mono">{{customer.uid || '-'}}</div>
                </div>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <h4 class="text-lg font-semibold mb-3">Adresse</h4>
              <div class="flex flex-column gap-3">
                <div>
                  <label class="font-semibold text-600">Straße & Nr:</label>
                  <div class="mt-1">{{customer.address}} {{customer.nr}}</div>
                </div>
                <div>
                  <label class="font-semibold text-600">PLZ:</label>
                  <div class="mt-1">{{customer.plz}}</div>
                </div>
                <div>
                  <label class="font-semibold text-600">Ort:</label>
                  <div class="mt-1">{{customer.city}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p-divider />

        <!-- Invoices Section -->
        <div class="mb-4">
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-file-edit mr-2"></i>Rechnungen ({{invoices.length}})
          </h3>
          <div *ngIf="loadingInvoices" class="text-center py-4">
            <i class="pi pi-spin pi-spinner text-3xl"></i>
          </div>
          
          <p-table
            *ngIf="!loadingInvoices"
            [value]="invoices"
            [paginator]="true"
            [rows]="10"
            styleClass="p-datatable-sm p-datatable-striped"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Erstellt</th>
                <th>Zeitraum</th>
                <th>Typ</th>
                <th class="text-right">Betrag</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-invoice>
              <tr>
                <td><p-tag [value]="invoice.invoiceId.toString()" /></td>
                <td>{{invoice.createdAt | date:'dd.MM.yyyy'}}</td>
                <td>
                  <div class="text-sm">
                    {{invoice.startedAt | date:'dd.MM.yyyy'}} - {{invoice.finishedAt | date:'dd.MM.yyyy'}}
                  </div>
                </td>
                <td>
                  <p-tag [value]="invoice.type" [severity]="invoice.type === 'D' ? 'success' : 'info'" />
                </td>
                <td class="text-right font-bold">
                  {{invoice.totalAmount | currency:'EUR':'symbol':'1.2-2':'de'}}
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center py-4">
                  Keine Rechnungen gefunden
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <p-divider />

        <!-- Contracts Section -->
        <div>
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-file-check mr-2"></i>Verträge ({{contracts.length}})
          </h3>
          <div *ngIf="loadingContracts" class="text-center py-4">
            <i class="pi pi-spin pi-spinner text-3xl"></i>
          </div>
          
          <p-table
            *ngIf="!loadingContracts"
            [value]="contracts"
            [paginator]="true"
            [rows]="10"
            styleClass="p-datatable-sm p-datatable-striped"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Erstellt</th>
                <th>Status</th>
                <th>Positionen</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-contract>
              <tr>
                <td><p-tag [value]="contract.contractId.toString()" /></td>
                <td>{{contract.createdAt | date:'dd.MM.yyyy'}}</td>
                <td>
                  <p-tag 
                    [value]="contract.accepted ? 'Akzeptiert' : 'Offen'" 
                    [severity]="contract.accepted ? 'success' : 'warn'" 
                  />
                </td>
                <td>{{contract.positions?.length || 0}} Positionen</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center py-4">
                  Keine Verträge gefunden
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <div *ngIf="loading" class="text-center py-5">
        <p-skeleton width="100%" height="400px" />
      </div>

      <div *ngIf="!loading && !customer" class="text-center py-5">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
        <h3>Kunde nicht gefunden</h3>
        <p-button label="Zurück" icon="pi pi-arrow-left" (onClick)="goBack()" />
      </div>
    </div>
  `,
  styles: [`
    .customer-detail {
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
  `]
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);

  customer: Customer | null = null;
  invoices: Invoice[] = [];
  contracts: Contract[] = [];
  loading = true;
  loadingInvoices = true;
  loadingContracts = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.loading = true;
    this.customerService.getById(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.loading = false;
        this.loadInvoices(id);
        this.loadContracts(id);
      },
      error: () => {
        this.toastService.error('Fehler', 'Kunde konnte nicht geladen werden');
        this.loading = false;
      }
    });
  }

  loadInvoices(customerId: number): void {
    this.customerService.getCustomerInvoices(customerId).subscribe({
      next: (data) => {
        this.invoices = data;
        this.loadingInvoices = false;
      },
      error: () => {
        this.loadingInvoices = false;
      }
    });
  }

  loadContracts(customerId: number): void {
    this.customerService.getCustomerContracts(customerId).subscribe({
      next: (data) => {
        this.contracts = data;
        this.loadingContracts = false;
      },
      error: () => {
        this.loadingContracts = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
