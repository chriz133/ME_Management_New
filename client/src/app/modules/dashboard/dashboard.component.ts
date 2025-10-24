import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { CustomerService } from '../../core/services/customer.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { ContractService } from '../../core/services/contract.service';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CardModule, 
    ButtonModule, 
    DividerModule, 
    SkeletonModule
  ],
  template: `
    <div class="dashboard p-4">
      <div class="page-header mb-4">
        <div>
          <h1 class="page-title m-0 mb-2">
            <i class="pi pi-home mr-2"></i>Dashboard
          </h1>
          <p class="page-subtitle text-600 m-0">Übersicht über Ihre Geschäftsaktivitäten aus firmaDB</p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-blue-50 border-round p-3 shadow-1">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label text-600 text-sm">Kunden</span>
                <div class="stat-value text-blue-600 text-4xl font-bold my-2">
                  <span *ngIf="!loading.customers">{{stats.customers}}</span>
                  <p-skeleton *ngIf="loading.customers" width="4rem" height="2.5rem"></p-skeleton>
                </div>
                <span class="stat-info text-blue-500 text-xs">
                  <i class="pi pi-check-circle mr-1"></i>Gesamt
                </span>
              </div>
              <div class="stat-icon bg-blue-500 text-white p-3 border-round">
                <i class="pi pi-users text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-green-50 border-round p-3 shadow-1">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label text-600 text-sm">Rechnungen</span>
                <div class="stat-value text-green-600 text-4xl font-bold my-2">
                  <span *ngIf="!loading.invoices">{{stats.invoices}}</span>
                  <p-skeleton *ngIf="loading.invoices" width="4rem" height="2.5rem"></p-skeleton>
                </div>
                <span class="stat-info text-green-500 text-xs">
                  <i class="pi pi-check-circle mr-1"></i>Alle Rechnungen
                </span>
              </div>
              <div class="stat-icon bg-green-500 text-white p-3 border-round">
                <i class="pi pi-file-edit text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-orange-50 border-round p-3 shadow-1">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label text-600 text-sm">Verträge</span>
                <div class="stat-value text-orange-600 text-4xl font-bold my-2">
                  <span *ngIf="!loading.contracts">{{stats.contracts}}</span>
                  <p-skeleton *ngIf="loading.contracts" width="4rem" height="2.5rem"></p-skeleton>
                </div>
                <span class="stat-info text-orange-500 text-xs">
                  <i class="pi pi-check-circle mr-1"></i>Aktive Verträge
                </span>
              </div>
              <div class="stat-icon bg-orange-500 text-white p-3 border-round">
                <i class="pi pi-file-check text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-cyan-50 border-round p-3 shadow-1">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label text-600 text-sm">Transaktionen</span>
                <div class="stat-value text-cyan-600 text-4xl font-bold my-2">
                  <span *ngIf="!loading.transactions">{{stats.transactions}}</span>
                  <p-skeleton *ngIf="loading.transactions" width="4rem" height="2.5rem"></p-skeleton>
                </div>
                <span class="stat-info text-cyan-500 text-xs">
                  <i class="pi pi-check-circle mr-1"></i>Finanztransaktionen
                </span>
              </div>
              <div class="stat-icon bg-cyan-500 text-white p-3 border-round">
                <i class="pi pi-dollar text-2xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid mt-4">
        <div class="col-12 lg:col-8">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-3">
                <h3 class="m-0 text-xl font-semibold">
                  <i class="pi pi-chart-line mr-2 text-primary"></i>Willkommen im ME Management System
                </h3>
              </div>
            </ng-template>
            <div class="welcome-content">
              <div class="text-center py-5">
                <div class="welcome-icon mb-4">
                  <i class="pi pi-building text-6xl text-primary"></i>
                </div>
                <h2 class="text-2xl font-bold text-900 mb-3">Geschäftsverwaltungssystem</h2>
                <p class="text-600 line-height-3 mb-4 mx-auto" style="max-width: 600px;">
                  Verwalten Sie Ihre Rechnungen, Verträge und Kunden effizient und professionell.
                  Das System ist verbunden mit der firmaDB Datenbank und zeigt alle aktuellen Geschäftsdaten an.
                </p>
                <div class="flex gap-3 justify-content-center flex-wrap">
                  <p-button
                    label="Kunden anzeigen"
                    icon="pi pi-users"
                    routerLink="/customers"
                    severity="primary"
                  />
                  <p-button
                    label="Rechnungen anzeigen"
                    icon="pi pi-file-edit"
                    routerLink="/invoices"
                    severity="success"
                    [outlined]="true"
                  />
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 lg:col-4">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-3">
                <h3 class="m-0 text-xl font-semibold">
                  <i class="pi pi-bolt mr-2 text-primary"></i>Schnellzugriff
                </h3>
              </div>
            </ng-template>
            <div class="quick-actions">
              <div class="action-item cursor-pointer p-3 border-round hover:bg-primary-50 transition-colors transition-duration-150" routerLink="/customers">
                <div class="flex align-items-center gap-3">
                  <div class="action-icon bg-blue-500 text-white p-3 border-round">
                    <i class="pi pi-users text-xl"></i>
                  </div>
                  <div class="action-content flex-1">
                    <div class="action-title font-semibold text-900">Kunden</div>
                    <div class="action-desc text-600 text-sm">{{stats.customers}} Kunden verwalten</div>
                  </div>
                  <i class="pi pi-chevron-right text-400"></i>
                </div>
              </div>

              <p-divider />

              <div class="action-item cursor-pointer p-3 border-round hover:bg-primary-50 transition-colors transition-duration-150" routerLink="/invoices">
                <div class="flex align-items-center gap-3">
                  <div class="action-icon bg-green-500 text-white p-3 border-round">
                    <i class="pi pi-file-edit text-xl"></i>
                  </div>
                  <div class="action-content flex-1">
                    <div class="action-title font-semibold text-900">Rechnungen</div>
                    <div class="action-desc text-600 text-sm">{{stats.invoices}} Rechnungen ansehen</div>
                  </div>
                  <i class="pi pi-chevron-right text-400"></i>
                </div>
              </div>

              <p-divider />

              <div class="action-item cursor-pointer p-3 border-round hover:bg-primary-50 transition-colors transition-duration-150" routerLink="/settings">
                <div class="flex align-items-center gap-3">
                  <div class="action-icon bg-cyan-500 text-white p-3 border-round">
                    <i class="pi pi-cog text-xl"></i>
                  </div>
                  <div class="action-content flex-1">
                    <div class="action-title font-semibold text-900">Einstellungen</div>
                    <div class="action-desc text-600 text-sm">System konfigurieren</div>
                  </div>
                  <i class="pi pi-chevron-right text-400"></i>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid mt-4">
        <div class="col-12">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-3">
                <h3 class="m-0 text-xl font-semibold">
                  <i class="pi pi-info-circle mr-2 text-primary"></i>Systemstatus
                </h3>
              </div>
            </ng-template>
            <div class="grid">
              <div class="col-12 md:col-4">
                <div class="text-center p-3">
                  <i class="pi pi-database text-5xl text-blue-500 mb-3"></i>
                  <h4 class="text-lg font-semibold mb-2">Datenbank</h4>
                  <p class="text-600 m-0">Verbunden mit firmaDB @ 192.168.0.88</p>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="text-center p-3">
                  <i class="pi pi-check-circle text-5xl text-green-500 mb-3"></i>
                  <h4 class="text-lg font-semibold mb-2">Status</h4>
                  <p class="text-600 m-0">System läuft einwandfrei</p>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="text-center p-3">
                  <i class="pi pi-shield text-5xl text-orange-500 mb-3"></i>
                  <h4 class="text-lg font-semibold mb-2">Sicherheit</h4>
                  <p class="text-600 m-0">Alle Daten verschlüsselt</p>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }

    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .action-item {
      cursor: pointer;
    }

    .welcome-icon i {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    :host ::ng-deep {
      .p-card .p-card-header {
        border-bottom: 1px solid var(--surface-border);
      }

      .p-card .p-card-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly contractService = inject(ContractService);
  private readonly transactionService = inject(TransactionService);

  stats = {
    customers: 0,
    invoices: 0,
    contracts: 0,
    transactions: 0
  };

  loading = {
    customers: true,
    invoices: true,
    contracts: true,
    transactions: true
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load customers count
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.stats.customers = data.length;
        this.loading.customers = false;
      },
      error: () => {
        this.loading.customers = false;
      }
    });

    // Load invoices count
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.stats.invoices = data.length;
        this.loading.invoices = false;
      },
      error: () => {
        this.loading.invoices = false;
      }
    });

    // Load contracts count
    this.contractService.getAll().subscribe({
      next: (data) => {
        this.stats.contracts = data.length;
        this.loading.contracts = false;
      },
      error: () => {
        this.loading.contracts = false;
      }
    });

    // Load transactions count
    this.transactionService.getAll().subscribe({
      next: (data) => {
        this.stats.transactions = data.length;
        this.loading.transactions = false;
      },
      error: () => {
        this.loading.transactions = false;
      }
    });
  }
}
