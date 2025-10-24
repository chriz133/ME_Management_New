import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PositionService } from '../../core/services/position.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-position-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputNumberModule
  ],
  template: `
    <div class="position-create-container">
      <p-card header="Neue Position erstellen">
        <div class="form-grid">
          <div class="form-field">
            <label for="text">Beschreibung *</label>
            <textarea
              pInputTextarea
              id="text"
              [(ngModel)]="position.text"
              [rows]="5"
              [style]="{'width': '100%'}"
              required></textarea>
          </div>

          <div class="form-field">
            <label for="price">Preis (EUR) *</label>
            <p-inputNumber
              id="price"
              [(ngModel)]="position.price"
              mode="currency"
              currency="EUR"
              locale="de-DE"
              [style]="{'width': '100%'}"
              required />
          </div>

          <div class="form-field">
            <label for="unit">Einheit *</label>
            <input
              pInputText
              id="unit"
              [(ngModel)]="position.unit"
              [style]="{'width': '100%'}"
              placeholder="z.B. Stk., m², m, etc."
              required />
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
    .position-create-container {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
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
export class PositionCreateComponent {
  private readonly router = inject(Router);
  private readonly positionService = inject(PositionService);
  private readonly toastService = inject(ToastService);

  position: any = {
    text: '',
    price: 0,
    unit: ''
  };

  isValid(): boolean {
    return !!(this.position.text && this.position.price && this.position.unit);
  }

  save(): void {
    if (!this.isValid()) {
      return;
    }

    this.positionService.create(this.position).subscribe({
      next: (result) => {
        this.toastService.showSuccess('Position erfolgreich erstellt');
        this.router.navigate(['/positions']);
      },
      error: (error) => {
        this.toastService.showError('Fehler beim Erstellen der Position');
        console.error(error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
