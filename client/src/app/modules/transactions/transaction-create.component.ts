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
      <p-card header="Neue Transaktion erstellen">
        <div class="form-grid">
          <div class="form-field">
            <label for="amount">Betrag (EUR) *</label>
            <p-inputNumber
              id="amount"
              [(ngModel)]="transaction.amount"
              mode="currency"
              currency="EUR"
              locale="de-DE"
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="date">Datum *</label>
            <p-datePicker
              id="date"
              [(ngModel)]="transaction.date"
              [showIcon]="true"
              dateFormat="dd.mm.yy"
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="type">Typ</label>
            <p-select
              id="type"
              [options]="typeOptions"
              [(ngModel)]="transaction.type"
              optionLabel="label"
              optionValue="value"
              placeholder="Typ auswählen"
              [style]="{'width': '100%'}" />
          </div>

          <div class="form-field">
            <label for="medium">Zahlungsmittel</label>
            <p-select
              id="medium"
              [options]="mediumOptions"
              [(ngModel)]="transaction.medium"
              optionLabel="label"
              optionValue="value"
              placeholder="Zahlungsmittel auswählen"
              [style]="{'width': '100%'}" />
          </div>

          <div class="form-field" style="grid-column: 1 / -1;">
            <label for="description">Beschreibung</label>
            <textarea
              class="p-textarea"
              id="description"
              [(ngModel)]="transaction.description"
              style="width: 100%; min-height: 120px;"
              placeholder="Beschreibung eingeben"></textarea>
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
    .transaction-create-container {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
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
