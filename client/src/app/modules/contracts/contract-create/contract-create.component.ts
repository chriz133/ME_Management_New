import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CustomerService } from '../../../core/services/customer.service';
import { ContractService } from '../../../core/services/contract.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../core/models/customer.model';

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
    InputTextModule,
    TableModule,
    TooltipModule
  ],
  template: `
    <div class="contract-create-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-file-edit"></i> {{ isEditMode ? 'Angebot bearbeiten' : 'Neues Angebot erstellen' }}</h2>
          </div>
        </ng-template>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-user"></i>
            <h3>Kundeninformationen</h3>
          </div>
          <div class="form-grid">
            <div class="form-field full-width">
              <label for="customer">Kunde auswählen *</label>
              <p-select
                id="customer"
                [options]="customers"
                [(ngModel)]="contract.customerId"
                optionLabel="fullName"
                optionValue="customerId"
                placeholder="Bitte einen Kunden auswählen..."
                [style]="{'width': '100%'}"
                [panelStyle]="{'min-width': '100%'}"
                [filter]="true"
                filterBy="fullName"
                [showClear]="true"
                required />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="section-header">
            <i class="pi pi-list"></i>
            <h3>Positionen</h3>
          </div>
          
          @if (contract.positions.length === 0) {
            <div class="empty-state">
              <i class="pi pi-inbox"></i>
              <p>Noch keine Positionen hinzugefügt</p>
              <small>Klicken Sie auf "Position hinzufügen" um zu beginnen</small>
            </div>
          } @else {
            <p-table [value]="contract.positions" [tableStyle]="{ 'min-width': '50rem' }" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 30%">Bezeichnung</th>
                  <th style="width: 15%">Anzahl</th>
                  <th style="width: 15%">Einheit</th>
                  <th style="width: 15%">Einzelpreis</th>
                  <th style="width: 15%">Gesamtpreis</th>
                  <th style="width: 10%">Funktionen</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
                <tr>
                  <td>
                    <input
                      type="text"
                      pInputText
                      [(ngModel)]="item.text"
                      placeholder="Leistungsbeschreibung eingeben..."
                      style="width: 100%;" />
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
                    <p-select
                      [(ngModel)]="item.unit"
                      [options]="unitOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Einheit..."
                      [style]="{'width': '100%'}"
                      [panelStyle]="{'min-width': '100%'}"
                      appendTo="body"
                      [showClear]="true" />
                  </td>
                  <td>
                    <p-inputNumber
                      [(ngModel)]="item.price"
                      mode="currency"
                      currency="EUR"
                      locale="de-DE"
                      [min]="0"
                      [minFractionDigits]="2"
                      [style]="{'width': '100%'}" />
                  </td>
                  <td>
                    <strong class="total-display">{{ calculateLineTotal(item) | currency:'EUR':'symbol':'1.2-2':'de' }}</strong>
                  </td>
                  <td>
                    <p-button
                      icon="pi pi-trash"
                      severity="danger"
                      [text]="true"
                      [rounded]="true"
                      (onClick)="removePosition(rowIndex)"
                      pTooltip="Position entfernen"
                      tooltipPosition="top" />
                  </td>
                </tr>
              </ng-template>
            </p-table>
          }

          <div class="add-position-section">
            <p-button
              label="Position hinzufügen"
              icon="pi pi-plus"
              severity="secondary"
              [outlined]="true"
              (onClick)="addPosition()" />
          </div>

          @if (contract.positions.length > 0) {
            <div class="total-section">
              <div class="total-label">Gesamtsumme:</div>
              <div class="total-amount">{{ calculateTotal() | currency:'EUR':'symbol':'1.2-2':'de' }}</div>
            </div>
          }
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
              [label]="isEditMode ? 'Änderungen speichern' : 'Angebot speichern'"
              icon="pi pi-check"
              (onClick)="save()"
              [disabled]="!isValid()" />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [`
    .contract-create-container {
      padding: 2rem;
      max-width: 1400px;
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

    .form-section {
      margin-bottom: 2.5rem;
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
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      border: 1px solid var(--surface-300);
    }

    .checkbox-label {
      margin: 0;
      font-weight: normal;
      color: var(--text-color);
      cursor: pointer;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: white;
      border: 2px dashed var(--surface-300);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .empty-state i {
      font-size: 3rem;
      color: var(--surface-400);
      margin-bottom: 1rem;
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
      color: var(--text-color);
      font-weight: 500;
    }

    .empty-state small {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    .price-display {
      color: var(--text-color-secondary);
      font-size: 0.95rem;
    }

    .total-display {
      color: var(--primary-color);
      font-size: 1.05rem;
    }

    .add-position-section {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-200);
    }

    .total-section {
      margin-top: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .total-label {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
    }

    .total-amount {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding: 1rem;
    }

    :host ::ng-deep {
      .p-select-dropdown {
        z-index: 1100 !important;
      }
      
      .p-select-overlay {
        z-index: 1100 !important;
      }
    }
  `]
})
export class ContractCreateComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);
  private readonly contractService = inject(ContractService);
  private readonly toastService = inject(ToastService);

  isEditMode = false;
  contractId: number | null = null;
  loading = false;

  unitOptions = [
    { label: 'Pauschal', value: 'Pauschal' },
    { label: 'm³', value: 'm³' },
    { label: 'Tage', value: 'Tage' },
    { label: 'Stück', value: 'Stück' },
    { label: 'Tonnen', value: 'Tonnen' },
    { label: 'lfm', value: 'lfm' },
    { label: 'Stunden', value: 'Stunden' }
  ];

  customers: Customer[] = [];

  contract: any = {
    customerId: null,
    accepted: false,
    positions: []
  };

  ngOnInit(): void {
    this.loadCustomers();
    
    // Check if we're in edit mode by looking for an ID in the route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contractId = +params['id'];
        this.loadContract();
      }
    });
  }

  loadContract(): void {
    if (!this.contractId) return;
    
    this.loading = true;
    this.contractService.getById(this.contractId).subscribe({
      next: (data) => {
        this.contract = {
          customerId: data.customerId,
          accepted: data.accepted,
          positions: data.positions?.map((p: any) => ({
            text: p.position?.text || '',
            price: p.position?.price || 0,
            unit: p.position?.unit || 'Pauschal',
            amount: p.amount || 1
          })) || []
        };
        this.loading = false;
      },
      error: (error) => {
        this.toastService.error('Fehler beim Laden des Angebots');
        console.error(error);
        this.loading = false;
        this.router.navigate(['/contracts']);
      }
    });
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

  addPosition(): void {
    this.contract.positions.push({
      text: '',
      price: 0,
      unit: 'Pauschal',
      amount: 1
    });
  }

  removePosition(index: number): void {
    this.contract.positions.splice(index, 1);
  }

  calculateLineTotal(item: any): number {
    return (item.price || 0) * (item.amount || 0);
  }

  calculateTotal(): number {
    return this.contract.positions.reduce((sum: number, item: any) => {
      return sum + this.calculateLineTotal(item);
    }, 0);
  }

  isValid(): boolean {
    return !!(this.contract.customerId && this.contract.positions.length > 0 &&
      this.contract.positions.every((p: any) => p.text && p.price > 0 && p.unit));
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    // Transform data to match backend DTO expectations (PascalCase with inline position data)
    const requestData = {
      CustomerId: this.contract.customerId,
      Accepted: this.contract.accepted,
      Positions: this.contract.positions.map((p: any) => ({
        Text: p.text,
        Price: p.price,
        Unit: p.unit,
        Amount: p.amount
      }))
    };

    if (this.isEditMode && this.contractId) {
      // Update existing contract
      console.log('Updating contract with data:', requestData);
      this.contractService.update(this.contractId, requestData).subscribe({
        next: (result) => {
          this.toastService.success('Angebot erfolgreich aktualisiert');
          this.router.navigate(['/contracts', this.contractId]);
        },
        error: (error) => {
          this.toastService.error('Fehler beim Aktualisieren des Angebots');
          console.error('Contract update error:', error);
        }
      });
    } else {
      // Create new contract
      console.log('Creating contract with data:', requestData);
      this.contractService.create(requestData).subscribe({
        next: (result) => {
          this.toastService.success('Angebot erfolgreich erstellt');
          this.router.navigate(['/contracts', result.contractId]);
        },
        error: (error) => {
          this.toastService.error('Fehler beim Erstellen des Angebots');
          console.error('Contract creation error:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/contracts']);
  }
}
