import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice } from '../../../core/models/invoice.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    DividerModule,
    SkeletonModule
  ],
  template: `
    <div class="invoice-detail p-4">
      <div class="mb-4 flex gap-2">
        <p-button
          icon="pi pi-arrow-left"
          label="Zurück"
          [text]="true"
          (onClick)="goBack()"
        />
        <p-button
          icon="pi pi-eye"
          label="PDF Ansehen"
          severity="info"
          (onClick)="viewPdf()"
          [disabled]="!invoice"
        />
        <p-button
          icon="pi pi-download"
          label="PDF Herunterladen"
          severity="success"
          (onClick)="downloadPdf()"
          [disabled]="!invoice"
        />
      </div>

      <p-card *ngIf="!loading && invoice">
        <ng-template pTemplate="header">
          <div class="p-4">
            <div class="flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h2 class="m-0 mb-2 text-2xl font-bold">
                  <i class="pi pi-file-edit mr-2 text-primary"></i>
                  Rechnung #{{invoice.invoiceId}}
                </h2>
                <div class="flex gap-2">
                  <p-tag [value]="getTypeLabel(invoice.type)" [severity]="getTypeSeverity(invoice.type)" />
                  <p-tag [value]="'Erstellt: ' + (invoice.createdAt | date:'dd.MM.yyyy')" severity="secondary" />
                </div>
              </div>
              <div class="text-right">
                <div class="text-600 text-sm mb-1">Gesamtbetrag</div>
                <div class="text-3xl font-bold text-primary">
                  {{invoice.totalAmount | currency:'EUR':'symbol':'1.2-2':'de'}}
                </div>
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Customer Info -->
        <div class="mb-4">
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-user mr-2"></i>Kundeninformationen
          </h3>
          <div class="grid" *ngIf="invoice.customer">
            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-semibold text-600">Kunde:</label>
                <div class="mt-1">{{invoice.customer.fullName}}</div>
              </div>
              <div class="mb-3">
                <label class="font-semibold text-600">Adresse:</label>
                <div class="mt-1">{{invoice.customer.address}} {{invoice.customer.nr}}</div>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-semibold text-600">PLZ / Ort:</label>
                <div class="mt-1">{{invoice.customer.plz}} {{invoice.customer.city}}</div>
              </div>
              <div class="mb-3">
                <label class="font-semibold text-600">UID:</label>
                <div class="mt-1 font-mono">{{invoice.customer.uid || '-'}}</div>
              </div>
            </div>
          </div>
          <div *ngIf="!invoice.customer" class="text-600">
            Keine Kundeninformation verfügbar
          </div>
        </div>

        <p-divider />

        <!-- Invoice Details -->
        <div class="mb-4">
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-calendar mr-2"></i>Rechnungsdetails
          </h3>
          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <div class="mb-3">
                <label class="font-semibold text-600">Erstellt am:</label>
                <div class="mt-1">{{invoice.createdAt | date:'dd.MM.yyyy'}}</div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <div class="mb-3">
                <label class="font-semibold text-600">Startdatum:</label>
                <div class="mt-1">{{invoice.startedAt | date:'dd.MM.yyyy'}}</div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <div class="mb-3">
                <label class="font-semibold text-600">Enddatum:</label>
                <div class="mt-1">{{invoice.finishedAt | date:'dd.MM.yyyy'}}</div>
              </div>
            </div>
            <div class="col-12 md:col-6 lg:col-3">
              <div class="mb-3">
                <label class="font-semibold text-600">Typ:</label>
                <div class="mt-1">
                  <p-tag [value]="getTypeLabel(invoice.type)" [severity]="getTypeSeverity(invoice.type)" />
                </div>
              </div>
            </div>
          </div>

          <div class="grid mt-3">
            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-semibold text-600">Anzahlung:</label>
                <div class="mt-1 text-lg font-semibold">
                  {{invoice.depositAmount | currency:'EUR':'symbol':'1.2-2':'de'}}
                </div>
              </div>
            </div>
            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-semibold text-600">Anzahlung bezahlt am:</label>
                <div class="mt-1">{{invoice.depositPaidOn | date:'dd.MM.yyyy'}}</div>
              </div>
            </div>
          </div>
        </div>

        <p-divider />

        <!-- Positions -->
        <div>
          <h3 class="text-xl font-semibold mb-3">
            <i class="pi pi-list mr-2"></i>Positionen ({{invoice.positions?.length || 0}})
          </h3>
          <p-table
            [value]="invoice.positions || []"
            styleClass="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 80px;">Pos</th>
                <th>Bezeichnung</th>
                <th class="text-center">Anzahl</th>
                <th class="text-center">Einheit</th>
                <th class="text-right">Einzelpreis</th>
                <th class="text-right">Gesamtpreis</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-position let-rowIndex="rowIndex">
              <tr>
                <td><p-tag [value]="(rowIndex + 1).toString()" severity="secondary" /></td>
                <td>
                  <div class="font-semibold">{{position.position?.text || '-'}}</div>
                </td>
                <td class="text-center font-semibold">{{position.amount}}</td>
                <td class="text-center">{{position.position?.unit || '-'}}</td>
                <td class="text-right">
                  {{position.position?.price | currency:'EUR':'symbol':'1.2-2':'de'}}
                </td>
                <td class="text-right font-bold">
                  {{position.lineTotal | currency:'EUR':'symbol':'1.2-2':'de'}}
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center py-4">
                  Keine Positionen vorhanden
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="footer">
              <tr>
                <td colspan="5" class="text-right font-bold text-lg">Gesamtsumme:</td>
                <td class="text-right font-bold text-lg text-primary">
                  {{invoice.totalAmount | currency:'EUR':'symbol':'1.2-2':'de'}}
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </p-card>

      <div *ngIf="loading" class="text-center py-5">
        <p-skeleton width="100%" height="600px" />
      </div>

      <div *ngIf="!loading && !invoice" class="text-center py-5">
        <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-3"></i>
        <h3>Rechnung nicht gefunden</h3>
        <p-button label="Zurück" icon="pi pi-arrow-left" (onClick)="goBack()" />
      </div>
    </div>
  `,
  styles: [`
    .invoice-detail {
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

    :host ::ng-deep {
      .p-datatable .p-datatable-footer {
        background-color: var(--surface-50);
        font-weight: 600;
      }
    }
  `]
})
export class InvoiceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly invoiceService = inject(InvoiceService);
  private readonly toastService = inject(ToastService);

  invoice: Invoice | null = null;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInvoice(+id);
    }
  }

  loadInvoice(id: number): void {
    this.loading = true;
    this.invoiceService.getById(id).subscribe({
      next: (data) => {
        this.invoice = data;
        this.loading = false;
      },
      error: () => {
        this.toastService.error('Fehler', 'Rechnung konnte nicht geladen werden');
        this.loading = false;
      }
    });
  }

  getTypeLabel(type?: string): string {
    return type === 'D' ? 'Dienstleistung' : type === 'B' ? 'Bauleistung' : 'Unbekannt';
  }

  getTypeSeverity(type?: string): 'success' | 'info' | 'warn' {
    return type === 'D' ? 'success' : type === 'B' ? 'info' : 'warn';
  }

  goBack(): void {
    this.router.navigate(['/invoices']);
  }

  async viewPdf(): Promise<void> {
    if (!this.invoice) return;
    
    try {
      this.invoiceService.generatePdf(this.invoice.invoiceId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          this.toastService.success('PDF', 'PDF wird in neuem Tab angezeigt');
          
          // Clean up the URL after a short delay
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        },
        error: (error) => {
          console.error('Error viewing PDF:', error);
          this.toastService.error('Fehler', 'PDF konnte nicht angezeigt werden');
        }
      });
    } catch (error) {
      console.error('Error viewing PDF:', error);
      this.toastService.error('Fehler', 'PDF konnte nicht angezeigt werden');
    }
  }

  async downloadPdf(): Promise<void> {
    if (!this.invoice) return;
    
    try {
      this.invoiceService.generatePdf(this.invoice.invoiceId).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Create filename
          const customerName = `${this.invoice!.customer?.surname}_${this.invoice!.customer?.firstname}`.replace(/ /g, '_');
          const date = new Date(this.invoice!.createdAt).toISOString().split('T')[0];
          a.download = `${this.invoice!.invoiceId.toString().padStart(5, '0')}_Rechnung_${customerName}_${date}.pdf`;
          
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          this.toastService.success('PDF', 'PDF wurde erfolgreich heruntergeladen');
        },
        error: (error) => {
          console.error('Error downloading PDF:', error);
          this.toastService.error('Fehler', 'PDF konnte nicht heruntergeladen werden');
        }
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      this.toastService.error('Fehler', 'PDF konnte nicht heruntergeladen werden');
    }
  }
}
