import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { CustomerService } from '../../../core/services/customer.service';
import { PositionService } from '../../../core/services/position.service';
import { ContractService } from '../../../core/services/contract.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../core/models/customer.model';
import { Position } from '../../../core/models/position.model';

@Component({
  selector: 'app-contract-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    Select,
    ButtonModule,
    InputNumberModule,
    CheckboxModule,
    TableModule
  ],
  template: `
    <div class="contract-create-container">
      <p-card header="Neues Angebot erstellen">
        <div class="form-section">
          <h3>Kundeninformationen</h3>
          <div class="form-field">
            <label for="customer">Kunde *</label>
            <p-select
              id="customer"
              [options]="customers"
              [(ngModel)]="contract.customerId"
              optionLabel="fullName"
              optionValue="customerId"
              placeholder="Kunde auswählen"
              [style]="{'width': '100%'}"
              [filter]="true"
              filterBy="fullName"
              required />
          </div>

          <div class="form-field">
            <p-checkbox
              [(ngModel)]="contract.accepted"
              [binary]="true"
              inputId="accepted"
              label="Akzeptiert" />
          </div>
        </div>

        <div class="form-section">
          <h3>Positionen</h3>
          <p-table [value]="contract.positions" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
              <tr>
                <th>Position</th>
                <th style="width: 200px">Menge</th>
                <th style="width: 150px">Preis</th>
                <th style="width: 150px">Gesamt</th>
                <th style="width: 100px">Aktionen</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
              <tr>
                <td>
                  <p-select
                    [options]="positions"
                    [(ngModel)]="item.positionId"
                    optionLabel="text"
                    optionValue="positionId"
                    placeholder="Position auswählen"
                    [style]="{'width': '100%'}"
                    [filter]="true"
                    filterBy="text"
                    (onChange)="onPositionChange(item)" />
                </td>
                <td>
                  <p-inputNumber
                    [(ngModel)]="item.amount"
                    [min]="0"
                    [minFractionDigits]="2"
                    [maxFractionDigits]="2"
                    [style]="{'width': '100%'}" />
                </td>
                <td>
                  <span>{{ getPositionPrice(item.positionId) | currency:'EUR':'symbol':'1.2-2':'de' }}</span>
                </td>
                <td>
                  <strong>{{ calculateLineTotal(item) | currency:'EUR':'symbol':'1.2-2':'de' }}</strong>
                </td>
                <td>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    [text]="true"
                    (onClick)="removePosition(rowIndex)" />
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center">Keine Positionen hinzugefügt</td>
              </tr>
            </ng-template>
          </p-table>

          <div class="add-position-button">
            <p-button
              label="Position hinzufügen"
              icon="pi pi-plus"
              severity="secondary"
              (onClick)="addPosition()" />
          </div>

          <div class="total-section">
            <h3>Gesamtsumme: {{ calculateTotal() | currency:'EUR':'symbol':'1.2-2':'de' }}</h3>
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
    .contract-create-container {
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
    }

    .form-section h3 {
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .add-position-button {
      margin-top: 1rem;
    }

    .total-section {
      margin-top: 2rem;
      padding: 1rem;
      background-color: var(--surface-50);
      border-radius: 6px;
      text-align: right;
    }

    .total-section h3 {
      margin: 0;
      color: var(--primary-color);
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class ContractCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly positionService = inject(PositionService);
  private readonly contractService = inject(ContractService);
  private readonly toastService = inject(ToastService);

  customers: Customer[] = [];
  positions: Position[] = [];

  contract: any = {
    customerId: null,
    accepted: false,
    positions: []
  };

  ngOnInit(): void {
    this.loadCustomers();
    this.loadPositions();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden der Kunden');
        console.error(error);
      }
    });
  }

  loadPositions(): void {
    this.positionService.getAll().subscribe({
      next: (data) => {
        this.positions = data;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden der Positionen');
        console.error(error);
      }
    });
  }

  addPosition(): void {
    this.contract.positions.push({
      positionId: null,
      amount: 1
    });
  }

  removePosition(index: number): void {
    this.contract.positions.splice(index, 1);
  }

  onPositionChange(item: any): void {
    // Trigger change detection
  }

  getPositionPrice(positionId: number): number {
    const position = this.positions.find(p => p.positionId === positionId);
    return position ? position.price : 0;
  }

  calculateLineTotal(item: any): number {
    const price = this.getPositionPrice(item.positionId);
    return price * (item.amount || 0);
  }

  calculateTotal(): number {
    return this.contract.positions.reduce((sum: number, item: any) => {
      return sum + this.calculateLineTotal(item);
    }, 0);
  }

  isValid(): boolean {
    return !!(this.contract.customerId && this.contract.positions.length > 0);
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    this.contractService.create(this.contract).subscribe({
      next: (result) => {
        this.toastService.success('Angebot erfolgreich erstellt');
        this.router.navigate(['/contracts', result.contractId]);
      },
      error: (error) => {
        this.toastService.error('Fehler beim Erstellen des Angebots');
        console.error(error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/contracts']);
  }
}
