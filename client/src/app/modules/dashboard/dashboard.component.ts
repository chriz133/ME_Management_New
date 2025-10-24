import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

/**
 * Dashboard component - main landing page after login
 * Professional dashboard with PrimeNG components
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, DividerModule],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title">
            <i class="pi pi-home mr-3"></i>Dashboard
          </h1>
          <p class="page-subtitle">Übersicht über Ihre Geschäftsaktivitäten</p>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-blue-100">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label">Kunden</span>
                <div class="stat-value text-blue-600">-</div>
                <span class="stat-info text-blue-500">
                  <i class="pi pi-arrow-up mr-1"></i>Gesamt
                </span>
              </div>
              <div class="stat-icon bg-blue-500">
                <i class="pi pi-users"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-green-100">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label">Rechnungen</span>
                <div class="stat-value text-green-600">-</div>
                <span class="stat-info text-green-500">
                  <i class="pi pi-arrow-up mr-1"></i>Alle Rechnungen
                </span>
              </div>
              <div class="stat-icon bg-green-500">
                <i class="pi pi-file"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-orange-100">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label">Angebote</span>
                <div class="stat-value text-orange-600">-</div>
                <span class="stat-info text-orange-500">
                  <i class="pi pi-arrow-up mr-1"></i>Aktive Angebote
                </span>
              </div>
              <div class="stat-icon bg-orange-500">
                <i class="pi pi-book"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="stat-card bg-cyan-100">
            <div class="flex justify-content-between align-items-start">
              <div>
                <span class="stat-label">Offen</span>
                <div class="stat-value text-cyan-600">-</div>
                <span class="stat-info text-cyan-500">
                  <i class="pi pi-arrow-right mr-1"></i>Ausstehend
                </span>
              </div>
              <div class="stat-icon bg-cyan-500">
                <i class="pi pi-dollar"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid mt-4">
        <div class="col-12 lg:col-8">
          <p-card>
            <ng-template pTemplate="header">
              <div class="px-3 pt-3">
                <h3 class="card-title">
                  <i class="pi pi-chart-line mr-2"></i>Willkommen im ME Management System
                </h3>
              </div>
            </ng-template>
            <div class="welcome-content">
              <div class="text-center py-5">
                <div class="welcome-icon mb-4">
                  <i class="pi pi-building"></i>
                </div>
                <h2 class="text-2xl font-bold text-900 mb-3">Geschäftsverwaltungssystem</h2>
                <p class="text-600 line-height-3 mb-4">
                  Verwalten Sie Ihre Rechnungen, Angebote und Kunden effizient und professionell.
                  Nutzen Sie die Navigationselemente zur Linken, um zu den verschiedenen Bereichen zu gelangen.
                </p>
                <div class="flex gap-3 justify-content-center flex-wrap">
                  <p-button
                    label="Neue Rechnung"
                    icon="pi pi-plus"
                    routerLink="/invoices"
                    severity="primary"
                  />
                  <p-button
                    label="Neues Angebot"
                    icon="pi pi-plus"
                    routerLink="/offers"
                    severity="success"
                    [outlined]="true"
                  />
                  <p-button
                    label="Neuer Kunde"
                    icon="pi pi-plus"
                    routerLink="/customers"
                    severity="info"
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
              <div class="px-3 pt-3">
                <h3 class="card-title">
                  <i class="pi pi-bolt mr-2"></i>Schnellaktionen
                </h3>
              </div>
            </ng-template>
            <div class="quick-actions">
              <div class="action-item" routerLink="/customers">
                <div class="action-icon bg-blue-500">
                  <i class="pi pi-user-plus"></i>
                </div>
                <div class="action-content">
                  <div class="action-title">Neuer Kunde</div>
                  <div class="action-desc">Kunden hinzufügen</div>
                </div>
                <i class="pi pi-chevron-right text-400"></i>
              </div>

              <p-divider />

              <div class="action-item" routerLink="/invoices">
                <div class="action-icon bg-green-500">
                  <i class="pi pi-file-plus"></i>
                </div>
                <div class="action-content">
                  <div class="action-title">Neue Rechnung</div>
                  <div class="action-desc">Rechnung erstellen</div>
                </div>
                <i class="pi pi-chevron-right text-400"></i>
              </div>

              <p-divider />

              <div class="action-item" routerLink="/offers">
                <div class="action-icon bg-orange-500">
                  <i class="pi pi-book"></i>
                </div>
                <div class="action-content">
                  <div class="action-title">Neues Angebot</div>
                  <div class="action-desc">Angebot erstellen</div>
                </div>
                <i class="pi pi-chevron-right text-400"></i>
              </div>

              <p-divider />

              <div class="action-item" routerLink="/invoices">
                <div class="action-icon bg-cyan-500">
                  <i class="pi pi-download"></i>
                </div>
                <div class="action-content">
                  <div class="action-title">PDF Export</div>
                  <div class="action-desc">Dokumente exportieren</div>
                </div>
                <i class="pi pi-chevron-right text-400"></i>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}
