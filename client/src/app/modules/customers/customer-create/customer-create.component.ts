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
      <p-card header="Neuen Kunden erstellen">
        <div class="form-grid">
          <div class="form-field">
            <label for="firstname">Vorname *</label>
            <input 
              pInputText 
              id="firstname" 
              [(ngModel)]="customer.firstname" 
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="surname">Nachname *</label>
            <input 
              pInputText 
              id="surname" 
              [(ngModel)]="customer.surname" 
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="address">Adresse</label>
            <input 
              pInputText 
              id="address" 
              [(ngModel)]="customer.address" 
              [style]="{'width': '100%'}" />
          </div>

          <div class="form-field">
            <label for="nr">Hausnummer</label>
            <p-inputNumber 
              id="nr" 
              [(ngModel)]="customer.nr" 
              [style]="{'width': '100%'}" 
              [useGrouping]="false" />
          </div>

          <div class="form-field">
            <label for="plz">PLZ *</label>
            <p-inputNumber 
              id="plz" 
              [(ngModel)]="customer.plz" 
              [style]="{'width': '100%'}" 
              [useGrouping]="false"
              required />
          </div>

          <div class="form-field">
            <label for="city">Stadt *</label>
            <input 
              pInputText 
              id="city" 
              [(ngModel)]="customer.city" 
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="uid">UID</label>
            <input 
              pInputText 
              id="uid" 
              [(ngModel)]="customer.uid" 
              [style]="{'width': '100%'}" />
          </div>
        </div>

        <div class="button-group">
          <p-button 
            label="Abbrechen" 
            icon="pi pi-times" 
            severity="secondary" 
            (onClick)="cancel()" />
          <p-button 
            label="Speichern" 
            icon="pi pi-check" 
            (onClick)="save()" 
            [disabled]="!isValid()" />
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .customer-create-container {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-weight: 600;
      color: var(--text-color);
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
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
