import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    MessageModule
  ],
  template: `
    <div class="customer-create-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-user-plus"></i> Neuen Kunden erstellen</h2>
            <p class="subtitle">Erfassen Sie hier die Kundendaten</p>
          </div>
        </ng-template>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-user"></i>
            <h3>Persönliche Informationen</h3>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label for="firstname">
                <i class="pi pi-user"></i>
                Vorname *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-user"></i>
                <input 
                  pInputText 
                  id="firstname" 
                  [(ngModel)]="customer.firstname" 
                  [style]="{'width': '100%'}"
                  placeholder="z.B. Max"
                  required />
              </span>
            </div>

            <div class="form-field">
              <label for="surname">
                <i class="pi pi-user"></i>
                Nachname *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-user"></i>
                <input 
                  pInputText 
                  id="surname" 
                  [(ngModel)]="customer.surname" 
                  [style]="{'width': '100%'}"
                  placeholder="z.B. Mustermann"
                  required />
              </span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-map-marker"></i>
            <h3>Adressinformationen</h3>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label for="address">
                <i class="pi pi-home"></i>
                Straße
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-home"></i>
                <input 
                  pInputText 
                  id="address" 
                  [(ngModel)]="customer.address" 
                  [style]="{'width': '100%'}"
                  placeholder="z.B. Hauptstraße" />
              </span>
            </div>

            <div class="form-field">
              <label for="nr">
                <i class="pi pi-hashtag"></i>
                Hausnummer
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-hashtag"></i>
                <p-inputNumber 
                  id="nr" 
                  [(ngModel)]="customer.nr" 
                  [style]="{'width': '100%'}" 
                  [useGrouping]="false"
                  placeholder="z.B. 123" />
              </span>
            </div>

            <div class="form-field">
              <label for="plz">
                <i class="pi pi-map"></i>
                Postleitzahl *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-map"></i>
                <p-inputNumber 
                  id="plz" 
                  [(ngModel)]="customer.plz" 
                  [style]="{'width': '100%'}" 
                  [useGrouping]="false"
                  placeholder="z.B. 1010"
                  required />
              </span>
            </div>

            <div class="form-field">
              <label for="city">
                <i class="pi pi-building"></i>
                Stadt *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-building"></i>
                <input 
                  pInputText 
                  id="city" 
                  [(ngModel)]="customer.city" 
                  [style]="{'width': '100%'}"
                  placeholder="z.B. Wien"
                  required />
              </span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-id-card"></i>
            <h3>Zusatzinformationen</h3>
          </div>
          <div class="form-grid">
            <div class="form-field full-width">
              <label for="uid">
                <i class="pi pi-id-card"></i>
                Umsatzsteuer-Identifikationsnummer (UID)
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-id-card"></i>
                <input 
                  pInputText 
                  id="uid" 
                  [(ngModel)]="customer.uid" 
                  [style]="{'width': '100%'}"
                  placeholder="z.B. ATU12345678" />
              </span>
              <small class="field-hint">Optional - für Firmenkunden relevant</small>
            </div>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <div class="button-group">
            <p-button 
              label="Abbrechen" 
              icon="pi pi-times" 
              severity="secondary" 
              [outlined]="true"
              (onClick)="cancel()" />
            <p-button 
              label="Kunde speichern" 
              icon="pi pi-check" 
              (onClick)="save()" 
              [disabled]="!isValid()" />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .customer-create-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .card-header {
      padding: 1.5rem;
    }

    .card-header h2 {
      margin: 0;
      color: var(--primary-color);
      font-size: 1.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .subtitle {
      margin: 0.5rem 0 0 0;
      color: var(--text-color-secondary);
      font-size: 0.95rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: var(--surface-50);
      border-radius: 8px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--surface-200);
    }

    .section-header i {
      color: var(--primary-color);
      font-size: 1.25rem;
    }

    .section-header h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-field label i {
      color: var(--primary-color);
    }

    .field-hint {
      color: var(--text-color-secondary);
      font-size: 0.85rem;
      margin-top: 0.25rem;
      font-style: italic;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 1rem;
    }

    :host ::ng-deep {
      .p-inputtext {
        padding-left: 2.5rem;
      }
      
      .p-inputnumber-input {
        padding-left: 2.5rem;
      }

      .p-input-icon-left > i:first-of-type {
        left: 0.75rem;
        color: var(--text-color-secondary);
      }
    }
  `]
})
export class CustomerCreateComponent {
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly toastService = inject(ToastService);

  customer: any = {
    firstname: '',
    surname: '',
    address: '',
    nr: null,
    plz: null,
    city: '',
    uid: ''
  };

  isValid(): boolean {
    return !!(this.customer.firstname && this.customer.surname && this.customer.plz && this.customer.city);
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    this.customerService.create(this.customer).subscribe({
      next: (result) => {
        this.toastService.success('Kunde erfolgreich erstellt');
        this.router.navigate(['/customers', result.customerId]);
      },
      error: (error) => {
        this.toastService.error('Fehler beim Erstellen des Kunden');
        console.error(error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
