import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ContractService } from '../../core/services/contract.service';
import { AuthService } from '../../core/services/auth.service';
import { Contract } from '../../core/models/contract.model';

/**
 * Contracts (Angebote) list component
 * Displays all contracts with modern PrimeNG table
 */
@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CardModule,
    ToastModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="contracts-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <div class="header-content">
              <i class="pi pi-file-edit"></i>
              <div>
                <h2>Angebote</h2>
                <p class="subtitle" *ngIf="contracts.length > 0">{{ contracts.length }} Angebote gefunden</p>
              </div>
            </div>
            <div class="header-actions">
              <button pButton label="Neu erstellen" icon="pi pi-plus" (click)="navigateToCreate()" 
                      class="p-button-primary" [style]="{'margin-right': '1rem'}"></button>
              <button pButton icon="pi pi-refresh" (click)="loadContracts()" 
                      class="p-button-text" label="Aktualisieren"></button>
            </div>
          </div>
        </ng-template>

        <div class="search-container">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search"></i>
            <input pInputText type="text" [(ngModel)]="searchText" (input)="onSearch($event)" 
                   placeholder="Suche nach Kunde, Angebotsnr..." class="w-full" />
          </span>
        </div>

        <p-table [value]="filteredContracts" [paginator]="true" [rows]="10" 
                 [rowsPerPageOptions]="[10, 25, 50, 100]"
                 [loading]="loading" 
                 styleClass="p-datatable-striped"
                 [tableStyle]="{'min-width': '75rem'}"
                 (onRowSelect)="onRowClick($event.data)">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="contractId">
                <i class="pi pi-hashtag"></i> Angebotsnr <p-sortIcon field="contractId"></p-sortIcon>
              </th>
              <th pSortableColumn="customer.fullName">
                <i class="pi pi-user"></i> Kunde <p-sortIcon field="customer.fullName"></p-sortIcon>
              </th>
              <th pSortableColumn="createdAt">
                <i class="pi pi-calendar"></i> Erstellt am <p-sortIcon field="createdAt"></p-sortIcon>
              </th>
              <th>
                <i class="pi pi-list"></i> Positionen
              </th>
              <th pSortableColumn="accepted">
                <i class="pi pi-check-circle"></i> Status <p-sortIcon field="accepted"></p-sortIcon>
              </th>
              <th style="width: 10rem">
                <i class="pi pi-cog"></i> Aktionen
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-contract>
            <tr [pSelectableRow]="contract" (click)="viewDetails(contract.contractId)" class="cursor-pointer">
              <td>
                <p-tag [value]="'#' + contract.contractId" severity="info"></p-tag>
              </td>
              <td>
                <div class="customer-info">
                  <i class="pi pi-user text-primary mr-2"></i>
                  <span class="font-semibold">{{ contract.customer?.fullName || 'Unbekannt' }}</span>
                </div>
              </td>
              <td>
                <i class="pi pi-calendar mr-2 text-500"></i>
                {{ contract.createdAt | date: 'dd.MM.yyyy' }}
              </td>
              <td>
                <p-tag [value]="(contract.positionCount) + ' Pos.'" severity="secondary"></p-tag>
              </td>
              <td>
                <p-tag *ngIf="contract.accepted" value="Akzeptiert" severity="success" icon="pi pi-check"></p-tag>
                <p-tag *ngIf="!contract.accepted" value="Offen" severity="warn" icon="pi pi-clock"></p-tag>
              </td>
              <td>
                <div class="action-buttons">
                  <button pButton icon="pi pi-eye" class="p-button-text p-button-sm" 
                          (click)="viewDetails(contract.contractId); $event.stopPropagation()"
                          pTooltip="Details anzeigen" tooltipPosition="top"></button>
                  <button *ngIf="canEdit" pButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-warning" 
                          (click)="editContract(contract); $event.stopPropagation()"
                          pTooltip="Bearbeiten" tooltipPosition="top"></button>
                  <button *ngIf="canDelete" pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                          (click)="deleteContract(contract); $event.stopPropagation()"
                          pTooltip="Löschen" tooltipPosition="top"></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-5">
                <div class="empty-state">
                  <i class="pi pi-file-edit"></i>
                  <p>Keine Angebote gefunden</p>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="loadingbody">
            <tr>
              <td colspan="6" class="text-center p-5">
                <p-progressSpinner [style]="{ width: '50px', height: '50px' }"></p-progressSpinner>
                <p class="mt-3">Lade Angebote...</p>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
      
      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .contracts-container {
      padding: 2rem;
      animation: fadeIn 0.3s ease-in;
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

    .search-container {
      padding: 1rem 1.5rem;
    }

    .customer-info {
      display: flex;
      align-items: center;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    :host ::ng-deep {
      .p-datatable .p-datatable-thead > tr > th {
        background-color: var(--surface-50);
        font-weight: 600;
      }

      .p-datatable .p-datatable-tbody > tr:hover {
        background-color: var(--primary-50) !important;
        cursor: pointer;
      }

      .cursor-pointer {
        cursor: pointer;
      }

      .p-tag {
        font-weight: 600;
      }
    }

    .empty-state {
      text-align: center;
      color: var(--text-color-secondary);
    }

    .empty-state i {
      font-size: 6rem;
      opacity: 0.3;
      display: block;
      margin-bottom: 1rem;
    }
  `]
})
export class ContractsComponent implements OnInit {
  private readonly contractService = inject(ContractService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  contracts: Contract[] = [];
  filteredContracts: Contract[] = [];
  loading = false;
  searchText = '';

  get canEdit(): boolean {
    return this.authService.canEdit();
  }

  get canDelete(): boolean {
    return this.authService.canDelete();
  }

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.loading = true;
    this.contractService.getSummary().subscribe({
      next: (data) => {
        this.contracts = data;
        this.filteredContracts = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Fehler', 
          detail: 'Angebote konnten nicht geladen werden' 
        });
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const query = this.searchText.toLowerCase();
    this.filteredContracts = this.contracts.filter(contract =>
      contract.contractId.toString().includes(query) ||
      (contract.customer?.fullName?.toLowerCase().includes(query) ?? false)
    );
  }

  onRowClick(contract: any) {
    if (contract) {
      this.viewDetails((contract as Contract).contractId);
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/contracts', id]);
  }

  editContract(contract: Contract) {
    // Navigate to edit page
    this.router.navigate(['/contracts', contract.contractId, 'edit']);
  }

  navigateToCreate() {
    this.router.navigate(['/contracts/create']);
  }

  deleteContract(contract: Contract) {
    if (!this.canDelete) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Keine Berechtigung', 
        detail: 'Nur Administratoren können Angebote löschen' 
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Möchten Sie das Angebot #${contract.contractId} wirklich löschen?`,
      header: 'Löschen bestätigen',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja, löschen',
      rejectLabel: 'Abbrechen',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.contractService.delete(contract.contractId).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Erfolg', 
              detail: 'Angebot wurde gelöscht' 
            });
            this.loadContracts();
          },
          error: (error) => {
            console.error('Error deleting contract:', error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Fehler', 
              detail: 'Angebot konnte nicht gelöscht werden' 
            });
          }
        });
      }
    });
  }
}
