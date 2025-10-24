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
    <div class="container mx-auto max-w-7xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
            Rechnungen
          </h1>
          <p class="text-gray-600">Verwalten Sie Ihre Rechnungen und laden Sie PDFs herunter</p>
        </div>
        <p-button 
          label="Neue Rechnung" 
          icon="pi pi-plus" 
          (onClick)="createInvoice()"
          [style]="{'background': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 'border': 'none', 'padding': '0.75rem 1.5rem'}"
        />
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
              <th class="text-center">Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-invoice>
            <tr>
              <td><span class="font-semibold text-pink-700">{{ invoice.invoiceNumber }}</span></td>
              <td><span class="font-medium">{{ invoice.customerName }}</span></td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-gray-400 text-sm"></i>
                  <span>{{ invoice.invoiceDate | date:'dd.MM.yyyy' }}</span>
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <i class="pi pi-clock text-gray-400 text-sm"></i>
                  <span>{{ invoice.dueDate | date:'dd.MM.yyyy' }}</span>
                </div>
              </td>
              <td>
                <span class="font-medium text-gray-700">{{ invoice.netTotal | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
              </td>
              <td>
                <span class="font-bold text-gray-900">{{ invoice.grossTotal | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
              </td>
              <td>
                <p-tag [value]="invoice.status" [severity]="getStatusSeverity(invoice.status)" />
              </td>
              <td>
                <div class="flex gap-2 justify-center">
                  <p-button 
                    icon="pi pi-file-pdf" 
                    [text]="true" 
                    [rounded]="true"
                    severity="danger"
                    pTooltip="PDF herunterladen"
                    tooltipPosition="top"
                    (onClick)="downloadPdf(invoice)"
                  />
                  <p-button 
                    icon="pi pi-pencil" 
                    [text]="true" 
                    [rounded]="true"
                    severity="info"
                    pTooltip="Bearbeiten"
                    tooltipPosition="top"
                    (onClick)="editInvoice(invoice)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-12">
                <div class="flex flex-col items-center gap-4">
                  <i class="pi pi-file text-6xl text-gray-300"></i>
                  <div>
                    <p class="text-lg font-semibold text-gray-700 mb-2">Keine Rechnungen gefunden</p>
                    <p class="text-sm text-gray-500">Erstellen Sie Ihre erste Rechnung</p>
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

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'Draft': 'secondary',
      'Sent': 'info',
      'Paid': 'success',
      'Overdue': 'danger',
      'Cancelled': 'warn'
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
