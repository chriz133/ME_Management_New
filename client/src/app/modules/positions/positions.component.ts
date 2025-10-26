import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { PositionService } from '../../core/services/position.service';
import { Position } from '../../core/models/position.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    TooltipModule
  ],
  template: `
    <div class="positions-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-list"></i> Positionen (Katalog)</h2>
            <div class="header-actions">
              <p-button
                label="Aktualisieren"
                icon="pi pi-refresh"
                (onClick)="loadPositions()" />
            </div>
          </div>
        </ng-template>

        <div class="info-message">
          <i class="pi pi-info-circle"></i>
          <span>Positionen werden dynamisch bei der Erstellung von Angeboten und Rechnungen erstellt.</span>
        </div>

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
          [value]="positions"
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50, 100]"
          [globalFilterFields]="['text', 'unit']"
          styleClass="p-datatable-striped"
          [rowHover]="true">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="positionId">ID <p-sortIcon field="positionId"></p-sortIcon></th>
              <th pSortableColumn="text">Beschreibung <p-sortIcon field="text"></p-sortIcon></th>
              <th pSortableColumn="price">Preis <p-sortIcon field="price"></p-sortIcon></th>
              <th pSortableColumn="unit">Einheit <p-sortIcon field="unit"></p-sortIcon></th>
              <th class="text-center" style="width: 150px;">Aktionen</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-position>
            <tr>
              <td>{{ position.positionId }}</td>
              <td>{{ position.text }}</td>
              <td>{{ position.price | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>{{ position.unit }}</td>
              <td class="text-center">
                <p-button
                  *ngIf="canEdit"
                  icon="pi pi-pencil"
                  [rounded]="true"
                  [text]="true"
                  severity="warn"
                  (onClick)="editPosition(position); $event.stopPropagation()"
                  pTooltip="Bearbeiten"
                  tooltipPosition="top"
                />
                <p-button
                  *ngIf="canDelete"
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (onClick)="deletePosition(position); $event.stopPropagation()"
                  pTooltip="Löschen"
                  tooltipPosition="right"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center">Keine Positionen gefunden</td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .positions-container {
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

    .info-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      background-color: var(--blue-50);
      border-left: 4px solid var(--blue-500);
      border-radius: 4px;
      color: var(--blue-900);
    }

    .info-message i {
      font-size: 1.2rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class PositionsComponent implements OnInit {
  private readonly positionService = inject(PositionService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly confirmationService = inject(ConfirmationService);

  positions: Position[] = [];
  loading = false;
  searchText = '';

  get canEdit(): boolean {
    return this.authService.canEdit();
  }

  get canDelete(): boolean {
    return this.authService.canDelete();
  }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.loading = true;
    this.positionService.getAll().subscribe({
      next: (data) => {
        this.positions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  editPosition(position: Position): void {
    // For now, show a placeholder message
    // In a full implementation, you'd have a proper edit dialog or form
    this.toastService.info('Info', 'Bearbeitungsfunktion in Entwicklung');
  }

  deletePosition(position: Position): void {
    if (!this.canDelete) {
      this.toastService.error('Keine Berechtigung', 'Nur Administratoren können Positionen löschen');
      return;
    }

    this.confirmationService.confirm({
      message: `Möchten Sie die Position "${position.text}" wirklich löschen?`,
      header: 'Löschen bestätigen',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja, löschen',
      rejectLabel: 'Abbrechen',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.positionService.delete(position.positionId).subscribe({
          next: () => {
            this.toastService.success('Erfolg', 'Position wurde gelöscht');
            this.loadPositions();
          },
          error: (error) => {
            console.error(error);
            this.toastService.error('Fehler', 'Position konnte nicht gelöscht werden');
          }
        });
      }
    });
  }
}
