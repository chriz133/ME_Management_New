import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    SkeletonModule
  ],
  template: `
    <div class="transactions-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-money-bill"></i> Transaktionen</h2>
            <div class="header-actions">
              <p-button
                label="Neu erstellen"
                icon="pi pi-plus"
                (onClick)="navigateToCreate()" />
            </div>
          </div>
        </ng-template>

        <div class="table-controls">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              [(ngModel)]="searchText"
              (input)="dt.filterGlobal(searchText, 'contains')"
              placeholder="Suchen..." />
          </span>
        </div>

        <p-table
          #dt
          [value]="transactions"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [globalFilterFields]="['description', 'type', 'medium']"
          styleClass="p-datatable-striped"
          [rowHover]="true">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="transactionId">ID <p-sortIcon field="transactionId"></p-sortIcon></th>
              <th pSortableColumn="date">Datum <p-sortIcon field="date"></p-sortIcon></th>
              <th pSortableColumn="amount">Betrag <p-sortIcon field="amount"></p-sortIcon></th>
              <th pSortableColumn="type">Typ <p-sortIcon field="type"></p-sortIcon></th>
              <th pSortableColumn="medium">Zahlungsmittel <p-sortIcon field="medium"></p-sortIcon></th>
              <th>Beschreibung</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-transaction>
            <tr>
              <td>{{ transaction.transactionId }}</td>
              <td>{{ transaction.date | date:'dd.MM.yyyy' }}</td>
              <td>{{ transaction.amount | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>
                <p-tag
                  [value]="transaction.type || 'N/A'"
                  [severity]="transaction.type === 'income' ? 'success' : 'danger'" />
              </td>
              <td>{{ transaction.medium || '-' }}</td>
              <td>{{ transaction.description || '-' }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center">Keine Transaktionen gefunden</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 2rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .card-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .table-controls {
      margin-bottom: 1rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly transactionService = inject(TransactionService);

  transactions: Transaction[] = [];
  loading = false;
  searchText = '';

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/transactions/create']);
  }
}
