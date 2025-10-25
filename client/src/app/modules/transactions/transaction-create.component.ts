import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { TransactionService } from '../../core/services/transaction.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-transaction-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    DatePicker,
    Select
  ],
  template: `
    <div class="transaction-create-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-money-bill"></i> Neue Transaktion erfassen</h2>
            <p class="subtitle">Erfassen Sie eine neue Ein- oder Ausgabe</p>
          </div>
        </ng-template>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-money-bill"></i>
            <h3>Transaktionsdaten</h3>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label for="amount">
                <i class="pi pi-euro"></i>
                Betrag (EUR) *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-euro"></i>
                <p-inputNumber
                  id="amount"
                  [(ngModel)]="transaction.amount"
                  [style]="{'width': '100%'}"
                  [minFractionDigits]="2"
                  [maxFractionDigits]="2"
                  mode="currency"
                  currency="EUR"
                  locale="de-DE"
                  placeholder="0,00"
                  required />
              </span>
            </div>

            <div class="form-field">
              <label for="date">
                <i class="pi pi-calendar"></i>
                Datum *
              </label>
              <span class="p-input-icon-left" style="width: 100%">
                <i class="pi pi-calendar"></i>
                <p-datePicker
                  id="date"
                  [(ngModel)]="transaction.date"
                  [style]="{'width': '100%'}"
                  dateFormat="dd.mm.yy"
                  [showIcon]="true"
                  placeholder="Datum auswählen..."
                  required />
              </span>
            </div>

            <div class="form-field">
              <label for="type">
                <i class="pi pi-tag"></i>
                Typ *
              </label>
              <p-select
                id="type"
                [options]="typeOptions"
                [(ngModel)]="transaction.type"
                optionLabel="label"
                optionValue="value"
                placeholder="Typ auswählen..."
                [style]="{'width': '100%'}"
                [panelStyle]="{'min-width': '100%'}"
                required />
            </div>

            <div class="form-field">
              <label for="medium">
                <i class="pi pi-wallet"></i>
                Zahlungsmittel *
              </label>
              <p-select
                id="medium"
                [options]="mediumOptions"
                [(ngModel)]="transaction.medium"
                optionLabel="label"
                optionValue="value"
                placeholder="Zahlungsmittel auswählen..."
                [style]="{'width': '100%'}"
                [panelStyle]="{'min-width': '100%'}"
                required />
            </div>
          </div>

          <div class="form-field full-width">
            <label for="description">
              <i class="pi pi-file-edit"></i>
              Beschreibung *
            </label>
            <textarea 
              id="description" 
              [(ngModel)]="transaction.description" 
              rows="4" 
              class="p-textarea"
              [style]="{'width': '100%'}"
              placeholder="Geben Sie hier eine Beschreibung ein..."
              required></textarea>
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
              label="Transaktion speichern"
              icon="pi pi-check"
              (onClick)="save()"
              [disabled]="!isValid()" />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .transaction-create-container {
      padding: 2rem;
      max-width: 1000px;
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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

    .p-textarea {
      font-family: inherit;
      font-size: 1rem;
      color: var(--text-color);
      background: white;
      padding: 0.75rem;
      border: 1px solid var(--surface-400);
      border-radius: 6px;
      transition: border-color 0.2s;
      resize: vertical;
    }

    .p-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(var(--primary-color-rgb), 0.2);
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

      .p-select-dropdown {
        z-index: 1100 !important;
      }
      
      .p-select-overlay {
        z-index: 1100 !important;
      }
    }
  `]
})
export class TransactionCreateComponent {
  private readonly router = inject(Router);
  private readonly transactionService = inject(TransactionService);
  private readonly toastService = inject(ToastService);

  typeOptions = [
    { label: 'Einnahme', value: 'income' },
    { label: 'Ausgabe', value: 'expense' }
  ];

  mediumOptions = [
    { label: 'Bargeld', value: 'cash' },
    { label: 'Überweisung', value: 'bank_transfer' },
    { label: 'Karte', value: 'card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Sonstiges', value: 'other' }
  ];

  transaction: any = {
    amount: 0,
    date: new Date(),
    type: null,
    medium: null,
    description: ''
  };

  isValid(): boolean {
    return !!(this.transaction.amount && this.transaction.date);
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    this.transactionService.create(this.transaction).subscribe({
      next: (result) => {
        this.toastService.success('Transaktion erfolgreich erstellt');
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        this.toastService.error('Fehler beim Erstellen der Transaktion');
        console.error(error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }
}
