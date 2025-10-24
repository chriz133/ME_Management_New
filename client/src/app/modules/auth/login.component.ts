import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

/**
 * Login screen component.
 * Professional login page with PrimeNG components.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    CheckboxModule,
    DividerModule
  ],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-brand">
          <div class="brand-icon">
            <i class="pi pi-building"></i>
          </div>
          <h1>ME Management</h1>
          <p>Geschäftsverwaltungssystem</p>
        </div>

        <p-panel header="Anmelden">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="field">
              <label for="username" class="block mb-2 font-semibold">
                <i class="pi pi-user mr-2"></i>Benutzername
              </label>
              <input
                pInputText
                id="username"
                formControlName="username"
                placeholder="Benutzername eingeben"
                class="w-full"
                [class.ng-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <small class="p-error block mt-1">
                  <i class="pi pi-exclamation-circle mr-1"></i>Benutzername ist erforderlich
                </small>
              }
            </div>

            <div class="field">
              <label for="password" class="block mb-2 font-semibold">
                <i class="pi pi-lock mr-2"></i>Passwort
              </label>
              <p-password
                formControlName="password"
                inputId="password"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
                inputStyleClass="w-full"
                placeholder="Passwort eingeben"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <small class="p-error block mt-1">
                  <i class="pi pi-exclamation-circle mr-1"></i>Passwort ist erforderlich
                </small>
              }
            </div>

            <p-button
              label="Anmelden"
              icon="pi pi-sign-in"
              [loading]="loading"
              [disabled]="loginForm.invalid"
              styleClass="w-full"
              severity="primary"
              type="submit"
            />
          </form>

          <p-divider />

          <div class="demo-credentials">
            <div class="flex align-items-center gap-2 mb-2">
              <i class="pi pi-info-circle text-primary"></i>
              <span class="font-semibold">Demo-Zugangsdaten</span>
            </div>
            <div class="credentials-grid">
              <div>
                <span class="text-sm text-600">Benutzername:</span>
                <div class="font-bold text-primary">admin</div>
              </div>
              <div>
                <span class="text-sm text-600">Passwort:</span>
                <div class="font-bold text-primary">admin</div>
              </div>
            </div>
          </div>
        </p-panel>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  loginForm: FormGroup;
  loading = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.toastService.success(`Willkommen, ${response.displayName}!`);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toastService.error('Anmeldung fehlgeschlagen', 'Benutzername oder Passwort ungültig');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
