import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice } from '../../core/models/invoice.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * Invoices list component with PDF download
 */
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TagModule],
  template: `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Rechnungen</h1>
        <p-button label="Neue Rechnung" icon="pi pi-plus" (onClick)="createInvoice()" />
      </div>
      
      <p-card>
        <p-table 
          [value]="invoices" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Rechnungsnr.</th>
              <th>Kunde</th>
              <th>Datum</th>
              <th>Fälligkeitsdatum</th>
              <th>Netto</th>
              <th>Brutto</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-invoice>
            <tr>
              <td>{{ invoice.invoiceNumber }}</td>
              <td>{{ invoice.customerName }}</td>
              <td>{{ invoice.invoiceDate | date:'dd.MM.yyyy' }}</td>
              <td>{{ invoice.dueDate | date:'dd.MM.yyyy' }}</td>
              <td>{{ invoice.netTotal | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>{{ invoice.grossTotal | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>
                <p-tag [value]="invoice.status" [severity]="getStatusSeverity(invoice.status)" />
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-file-pdf" 
                    [text]="true" 
                    [rounded]="true"
                    severity="danger"
                    pTooltip="PDF herunterladen"
                    (onClick)="downloadPdf(invoice)"
                  />
                  <p-button 
                    icon="pi pi-pencil" 
                    [text]="true" 
                    [rounded]="true"
                    severity="info"
                    pTooltip="Bearbeiten"
                    (onClick)="editInvoice(invoice)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center">Keine Rechnungen gefunden</td>
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
  loading = false;

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden der Rechnungen');
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): string {
    const map: Record<string, string> = {
      'Draft': 'secondary',
      'Sent': 'info',
      'Paid': 'success',
      'Overdue': 'danger',
      'Cancelled': 'warning'
    };
    return map[status] || 'secondary';
  }

  downloadPdf(invoice: Invoice): void {
    this.invoiceService.downloadPdf(invoice.id, invoice.invoiceNumber);
    this.toastService.success('PDF wird heruntergeladen...');
  }

  createInvoice(): void {
    this.toastService.info('Erstellen-Dialog noch nicht implementiert');
  }

  editInvoice(invoice: Invoice): void {
    this.toastService.info('Bearbeiten-Dialog noch nicht implementiert');
  }
}
