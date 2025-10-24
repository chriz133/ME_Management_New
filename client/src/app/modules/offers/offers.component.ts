import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { OfferService } from '../../core/services/offer.service';
import { Offer } from '../../core/models/offer.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * Offers list component with PDF download
 */
@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TagModule],
  template: `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Angebote</h1>
        <p-button label="Neues Angebot" icon="pi pi-plus" (onClick)="createOffer()" />
      </div>
      
      <p-card>
        <p-table 
          [value]="offers" 
          [loading]="loading"
          [paginator]="true" 
          [rows]="10"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Angebotsnr.</th>
              <th>Titel</th>
              <th>Kunde</th>
              <th>Datum</th>
              <th>Gültig bis</th>
              <th>Brutto</th>
              <th>Status</th>
              <th>Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-offer>
            <tr>
              <td>{{ offer.offerNumber }}</td>
              <td>{{ offer.title }}</td>
              <td>{{ offer.customerName }}</td>
              <td>{{ offer.offerDate | date:'dd.MM.yyyy' }}</td>
              <td>{{ offer.validUntil | date:'dd.MM.yyyy' }}</td>
              <td>{{ offer.grossTotal | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>
                <p-tag [value]="offer.status" [severity]="getStatusSeverity(offer.status)" />
              </td>
              <td>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-file-pdf" 
                    [text]="true" 
                    [rounded]="true"
                    severity="danger"
                    pTooltip="PDF herunterladen"
                    (onClick)="downloadPdf(offer)"
                  />
                  <p-button 
                    icon="pi pi-pencil" 
                    [text]="true" 
                    [rounded]="true"
                    severity="info"
                    pTooltip="Bearbeiten"
                    (onClick)="editOffer(offer)"
                  />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center">Keine Angebote gefunden</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: []
})
export class OffersComponent implements OnInit {
  private readonly offerService = inject(OfferService);
  private readonly toastService = inject(ToastService);

  offers: Offer[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.getAll().subscribe({
      next: (data) => {
        this.offers = data;
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden der Angebote');
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'Draft': 'secondary',
      'Sent': 'info',
      'Accepted': 'success',
      'Rejected': 'danger',
      'Expired': 'warn'
    };
    return map[status] || 'secondary';
  }

  downloadPdf(offer: Offer): void {
    this.offerService.downloadPdf(offer.id, offer.offerNumber);
    this.toastService.success('PDF wird heruntergeladen...');
  }

  createOffer(): void {
    this.toastService.info('Erstellen-Dialog noch nicht implementiert');
  }

  editOffer(offer: Offer): void {
    this.toastService.info('Bearbeiten-Dialog noch nicht implementiert');
  }
}
