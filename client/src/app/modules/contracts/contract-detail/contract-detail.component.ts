import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContractService } from '../../../core/services/contract.service';
import { Contract } from '../../../core/models/contract.model';
import { PdfService } from '../../../core/services/pdf.service';

/**
 * Contract detail component
 * Displays full contract information with customer and positions
 */
@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="contract-detail-container" [@fadeIn]>
      <div class="back-button-container">
        <button pButton label="Zurück zu Angeboten" icon="pi pi-arrow-left" 
                class="p-button-text" (click)="goBack()"></button>
        <button pButton label="PDF Ansehen" icon="pi pi-eye" 
                class="p-button-info" (click)="viewPdf()" 
                [disabled]="!contract" style="margin-left: 1rem;"></button>
        <button pButton label="PDF Herunterladen" icon="pi pi-download" 
                class="p-button-success" (click)="downloadPdf()" 
                [disabled]="!contract" style="margin-left: 0.5rem;"></button>
      </div>

      <p-card *ngIf="loading">
        <div class="loading-skeleton">
          <p-skeleton width="100%" height="2rem" styleClass="mb-3"></p-skeleton>
          <p-skeleton width="70%" height="1.5rem" styleClass="mb-2"></p-skeleton>
          <p-skeleton width="50%" height="1.5rem"></p-skeleton>
        </div>
      </p-card>

      <div *ngIf="!loading && contract" class="detail-content">
        <!-- Contract Header -->
        <p-card styleClass="mb-3">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div class="header-content">
                <i class="pi pi-file-edit"></i>
                <div>
                  <h2>Angebot #{{ contract.contractId }}</h2>
                  <p class="subtitle">Erstellt am {{ contract.createdAt | date: 'dd.MM.yyyy' }}</p>
                </div>
              </div>
              <div class="header-actions">
                <button pButton label="Rechnung erstellen" icon="pi pi-file-invoice" 
                        class="p-button-success" (click)="createInvoiceFromContract()" 
                        [style]="{'margin-right': '1rem'}"></button>
                <p-tag *ngIf="contract.accepted" value="Akzeptiert" severity="success" icon="pi pi-check" [style]="{'font-size': '1rem'}"></p-tag>
                <p-tag *ngIf="!contract.accepted" value="Offen" severity="warn" icon="pi pi-clock" [style]="{'font-size': '1rem'}"></p-tag>
              </div>
            </div>
          </ng-template>

          <!-- Customer Information -->
          <div class="section">
            <h3><i class="pi pi-user mr-2"></i>Kundeninformationen</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">{{ contract.customer?.fullName || 'Unbekannt' }}</span>
              </div>
              <div class="info-item">
                <span class="label">PLZ:</span>
                <span class="value">{{ contract.customer?.plz || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Stadt:</span>
                <span class="value">{{ contract.customer?.city || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Adresse:</span>
                <span class="value">{{ contract.customer?.address || '-' }} {{ contract.customer?.nr || '' }}</span>
              </div>
              <div class="info-item" *ngIf="contract.customer && contract.customer.uid">
                <span class="label">UID:</span>
                <span class="value">{{ contract.customer.uid }}</span>
              </div>
            </div>
          </div>
        </p-card>

        <!-- Positions -->
        <p-card>
          <ng-template pTemplate="header">
            <div class="positions-header">
              <h3><i class="pi pi-list mr-2"></i>Positionen</h3>
              <p-tag [value]="(contract.positions?.length || 0) + ' Position(en)'" severity="info"></p-tag>
            </div>
          </ng-template>

          <p-table [value]="contract.positions || []" 
                   styleClass="p-datatable-striped"
                   [tableStyle]="{'min-width': '50rem'}">
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 50%">Bezeichnung</th>
                <th>Anzahl</th>
                <th>Einheit</th>
                <th class="text-right">Einzelpreis</th>
                <th class="text-right">Gesamtpreis</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-pos>
              <tr>
                <td>{{ pos.position?.text || '-' }}</td>
                <td>{{ pos.amount }}</td>
                <td>{{ pos.position?.unit || '-' }}</td>
                <td class="text-right">{{ pos.position?.price || 0 | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}</td>
                <td class="text-right font-semibold">{{ (pos.amount * (pos.position?.price || 0)) | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="summary">
              <div class="total-section">
                <div class="total-row">
                  <span class="total-label">Gesamtsumme:</span>
                  <span class="total-value">{{ calculateTotal() | currency: 'EUR' : 'symbol' : '1.2-2' : 'de' }}</span>
                </div>
              </div>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center p-4">
                  <p class="text-color-secondary">Keine Positionen vorhanden</p>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>

      <p-card *ngIf="!loading && !contract">
        <div class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          <p>Angebot nicht gefunden</p>
        </div>
      </p-card>

      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .contract-detail-container {
      padding: 2rem;
      animation: fadeIn 0.3s ease-in;
    }

    .back-button-container {
      margin-bottom: 1rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-content i {
      font-size: 2rem;
      color: var(--primary-color);
    }

    .header-content h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .subtitle {
      margin: 0.25rem 0 0 0;
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    .section {
      padding: 1.5rem;
    }

    .section h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      font-weight: 500;
    }

    .value {
      font-size: 1rem;
      color: var(--text-color);
      font-weight: 600;
    }

    .positions-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .positions-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
    }

    .total-section {
      padding: 1rem;
      border-top: 2px solid var(--surface-border);
    }

    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 2rem;
    }

    .total-label {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .total-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-skeleton {
      padding: 2rem;
    }

    .error-message {
      text-align: center;
      padding: 3rem;
      color: var(--text-color-secondary);
    }

    .error-message i {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    :host ::ng-deep {
      .text-right {
        text-align: right;
      }
    }
  `],
  animations: []
})
export class ContractDetailComponent implements OnInit {
  private readonly contractService = inject(ContractService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly pdfService = inject(PdfService);

  contract: Contract | null = null;
  loading = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContract(+id);
    }
  }

  loadContract(id: number) {
    this.loading = true;
    this.contractService.getById(id).subscribe({
      next: (data) => {
        this.contract = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contract:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Fehler', 
          detail: 'Angebot konnte nicht geladen werden' 
        });
        this.loading = false;
      }
    });
  }

  calculateTotal(): number {
    if (!this.contract?.positions) return 0;
    return this.contract.positions.reduce((sum, pos) => {
      const price = pos.position?.price || 0;
      return sum + (pos.amount * price);
    }, 0);
  }

  goBack() {
    this.router.navigate(['/contracts']);
  }

  createInvoiceFromContract() {
    if (this.contract) {
      this.router.navigate(['/invoices/create'], { 
        queryParams: { contractId: this.contract.contractId } 
      });
    }
  }

  async viewPdf(): Promise<void> {
    if (!this.contract) return;
    
    try {
      await this.pdfService.viewContractPdf(this.contract);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'PDF', 
        detail: 'PDF wird in neuem Tab angezeigt' 
      });
    } catch (error) {
      console.error('Error viewing PDF:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Fehler', 
        detail: 'PDF konnte nicht angezeigt werden' 
      });
    }
  }

  async downloadPdf(): Promise<void> {
    if (!this.contract) return;
    
    try {
      await this.pdfService.generateContractPdf(this.contract);
      this.messageService.add({ 
        severity: 'success', 
        summary: 'PDF', 
        detail: 'PDF wurde erfolgreich heruntergeladen' 
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Fehler', 
        detail: 'PDF konnte nicht heruntergeladen werden' 
      });
    }
  }
}
