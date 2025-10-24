import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { PositionService } from '../../core/services/position.service';
import { Position } from '../../core/models/position.model';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule
  ],
  template: `
    <div class="positions-container">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-header">
            <h2><i class="pi pi-list"></i> Positionen</h2>
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
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-position>
            <tr>
              <td>{{ position.positionId }}</td>
              <td>{{ position.text }}</td>
              <td>{{ position.price | currency:'EUR':'symbol':'1.2-2':'de' }}</td>
              <td>{{ position.unit }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="text-center">Keine Positionen gefunden</td>
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

    .text-center {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class PositionsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly positionService = inject(PositionService);

  positions: Position[] = [];
  loading = false;
  searchText = '';

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

  navigateToCreate(): void {
    this.router.navigate(['/positions/create']);
  }
}
