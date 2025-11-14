import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../core/models/invoice.model';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    CardModule, 
    TagModule, 
    TooltipModule,
    InputTextModule
  ],
  template: `
    <div class="invoices-page p-4">
      <div class="page-header mb-4">
        <div class="flex justify-content-between align-items-center">
          <div>
            <h1 class="page-title m-0 mb-2">
              <i class="pi pi-file-edit mr-2"></i>Rechnungen
            </h1>
            <p class="page-subtitle text-600 m-0">Überblick über alle Rechnungen aus firmaDB</p>
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
              (onClick)="loadInvoices()"
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
                  <i class="pi pi-list mr-2"></i>Rechnungsliste
                </h3>
                <p class="text-600 m-0 text-sm">{{invoices.length}} Rechnungen gefunden</p>
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
          [value]="invoices"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [rowHover]="true"
          [globalFilterFields]="['invoiceId', 'customer.fullName', 'type']"
          dataKey="invoiceId"
          styleClass="p-datatable-sm p-datatable-striped"
          responsiveLayout="scroll"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="invoiceId" style="width: 80px;">
                <div class="flex align-items-center">
                  ID 
                  <p-sortIcon field="invoiceId"/>
                </div>
              </th>
              <th pSortableColumn="createdAt">
                <div class="flex align-items-center">
                  Erstellt 
                  <p-sortIcon field="createdAt"/>
                </div>
              </th>
              <th>Kunde</th>
              <th>Zeitraum</th>
              <th>Typ</th>
              <th>Anzahlung</th>
              <th class="text-right">Betrag</th>
              <th class="text-center" style="width: 150px;">Aktionen</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-invoice>
            <tr>
              <td>
                <p-tag [value]="invoice.invoiceId.toString()" severity="info" [rounded]="true" />
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-calendar text-600"></i>
                  <span>{{ invoice.createdAt | date:'dd.MM.yyyy' }}</span>
                </div>
              </td>
              <td>
                <div *ngIf="invoice.customer" class="flex align-items-center gap-2">
                  <i class="pi pi-user text-primary"></i>
                  <span class="font-semibold">{{ invoice.customer.fullName }}</span>
                </div>
                <span *ngIf="!invoice.customer" class="text-400">Kein Kunde</span>
              </td>
              <td>
                <div class="flex flex-column gap-1">
                  <span class="text-sm">
                    <i class="pi pi-arrow-right text-green-500 text-xs"></i>
                    {{ invoice.startedAt | date:'dd.MM.yyyy' }}
                  </span>
                  <span class="text-sm">
                    <i class="pi pi-arrow-left text-red-500 text-xs"></i>
                    {{ invoice.finishedAt | date:'dd.MM.yyyy' }}
                  </span>
                </div>
              </td>
              <td>
                <p-tag 
                  [value]="getTypeLabel(invoice.type)" 
                  [severity]="getTypeSeverity(invoice.type)" 
                  [rounded]="true"
                />
              </td>
              <td>
                <div class="flex flex-column gap-1">
                  <span class="text-sm font-semibold">{{ invoice.depositAmount | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
                  <span class="text-xs text-600">{{ invoice.depositPaidOn | date:'dd.MM.yyyy' }}</span>
                </div>
              </td>
              <td class="text-right">
                <div class="flex flex-column align-items-end">
                  <span class="font-bold text-lg text-primary">{{ invoice.totalAmount | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
                  <span class="text-xs text-600">{{invoice.positions?.length || 0}} Positionen</span>
                </div>
              </td>
              <td class="text-center">
                <p-button
                  icon="pi pi-eye"
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  (onClick)="viewInvoice(invoice)"
                  pTooltip="Details anzeigen"
                  tooltipPosition="left"
                />
                <p-button
                  *ngIf="canEdit"
                  icon="pi pi-pencil"
                  [rounded]="true"
                  [text]="true"
                  severity="warn"
                  (onClick)="editInvoice(invoice); $event.stopPropagation()"
                  pTooltip="Bearbeiten"
                  tooltipPosition="top"
                />
                <p-button
                  *ngIf="canDelete"
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (onClick)="deleteInvoice(invoice); $event.stopPropagation()"
                  pTooltip="Löschen"
                  tooltipPosition="right"
                />
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8">
                <div class="flex flex-column align-items-center justify-content-center py-5">
                  <i class="pi pi-file-edit text-6xl text-400 mb-3"></i>
                  <h3 class="text-900 font-semibold mb-2">Keine Rechnungen gefunden</h3>
                  <p class="text-600 m-0">
                    Es wurden keine Rechnungen in der Datenbank gefunden.
                  </p>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="loadingbody">
            <tr>
              <td colspan="8">
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
    .invoices-page {
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
export class InvoicesComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly confirmationService = inject(ConfirmationService);

  invoices: Invoice[] = [];
  loading = true;

  get canEdit(): boolean {
    return this.authService.canEdit();
  }

  get canDelete(): boolean {
    return this.authService.canDelete();
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getSummary().subscribe({
      next: (data: Invoice[]) => {
        this.invoices = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Fehler', 'Rechnungen konnten nicht geladen werden');
        this.loading = false;
      }
    });
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoices', invoice.invoiceId]);
  }

  getTypeLabel(type?: string): string {
    return type === 'D' ? 'Dienstleistung' : type === 'B' ? 'Bauleistung' : 'Unbekannt';
  }

  getTypeSeverity(type?: string): 'success' | 'info' | 'warn' {
    return type === 'D' ? 'success' : type === 'B' ? 'info' : 'warn';
  }

  navigateToCreate(): void {
    this.router.navigate(['/invoices/create']);
  }

  editInvoice(invoice: Invoice): void {
    // Navigate to the edit page
    this.router.navigate(['/invoices', invoice.invoiceId, 'edit']);
  }

  deleteInvoice(invoice: Invoice): void {
    if (!this.canDelete) {
      this.toastService.error('Keine Berechtigung', 'Nur Administratoren können Rechnungen löschen');
      return;
    }

    this.confirmationService.confirm({
      message: `Möchten Sie die Rechnung #${invoice.invoiceId} wirklich löschen?`,
      header: 'Löschen bestätigen',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja, löschen',
      rejectLabel: 'Abbrechen',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.invoiceService.delete(invoice.invoiceId).subscribe({
          next: () => {
            this.toastService.success('Erfolg', 'Rechnung wurde gelöscht');
            this.loadInvoices();
          },
          error: () => {
            this.toastService.error('Fehler', 'Rechnung konnte nicht gelöscht werden');
          }
        });
      }
    });
  }
}
