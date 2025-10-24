import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../core/models/invoice.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TagModule, TooltipModule],
  template: `
    <div class="invoices-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="pi pi-file-edit mr-3"></i>Rechnungen
          </h1>
          <p class="page-subtitle">Überblick über alle Rechnungen aus firmaDB</p>
        </div>
      </div>

      <p-card>
        <p-table
          [value]="invoices"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [rowHover]="true"
          dataKey="invoiceId"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="invoiceId">ID <p-sortIcon field="invoiceId"/></th>
              <th pSortableColumn="createdAt">Erstellt <p-sortIcon field="createdAt"/></th>
              <th>Kunde</th>
              <th>Startdatum</th>
              <th>Enddatum</th>
              <th>Typ</th>
              <th class="text-right">Betrag</th>
              <th class="text-center">Aktionen</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-invoice>
            <tr>
              <td><span class="font-bold text-primary">{{invoice.invoiceId}}</span></td>
              <td>{{ invoice.createdAt | date:'dd.MM.yyyy' }}</td>
              <td>
                <div *ngIf="invoice.customer" class="flex align-items-center gap-2">
                  <i class="pi pi-user text-600"></i>
                  <span>{{ invoice.customer.fullName }}</span>
                </div>
              </td>
              <td>{{ invoice.startedAt | date:'dd.MM.yyyy' }}</td>
              <td>{{ invoice.finishedAt | date:'dd.MM.yyyy' }}</td>
              <td>
                <p-tag [value]="invoice.type" [severity]="invoice.type === 'D' ? 'success' : 'info'" />
              </td>
              <td class="text-right">
                <span class="font-bold">{{ invoice.totalAmount | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
              </td>
              <td class="text-center">
                <p-button
                  icon="pi pi-eye"
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  (onClick)="viewInvoice(invoice)"
                  pTooltip="Details anzeigen"
                />
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8">
                <div class="p-empty-state">
                  <div class="p-empty-state-icon">
                    <i class="pi pi-file-edit"></i>
                  </div>
                  <h3 class="p-empty-state-title">Keine Rechnungen gefunden</h3>
                  <p class="p-empty-state-message">
                    Es sind keine Rechnungen in der Datenbank vorhanden.
                  </p>
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
export class InvoicesComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly toastService = inject(ToastService);

  invoices: Invoice[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAll().subscribe({
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
    this.toastService.info('Info', `Rechnung ${invoice.invoiceId} Details`);
  }
}
