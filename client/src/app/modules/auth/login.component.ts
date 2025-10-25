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
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-page::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: moveBackground 20s linear infinite;
    }

    @keyframes moveBackground {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    .login-container {
      width: 100%;
      max-width: 440px;
      animation: slideUp 0.5s ease-out;
      position: relative;
      z-index: 1;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-brand {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .brand-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .brand-icon:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
    }

    .brand-icon i {
      font-size: 2.5rem;
      color: white;
    }

    .login-brand h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .login-brand p {
      font-size: 1rem;
      margin: 0;
      opacity: 0.95;
      font-weight: 400;
    }

    :host ::ng-deep .p-panel {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      overflow: hidden;
    }

    :host ::ng-deep .p-panel-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      border-bottom: none;
      font-size: 1.5rem;
      font-weight: 600;
      text-align: center;
    }

    :host ::ng-deep .p-panel-content {
      padding: 2rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field label {
      font-weight: 600;
      color: #374151;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
    }

    .field label i {
      color: #667eea;
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-password input {
      border-radius: 10px;
      border: 2px solid #e5e7eb;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    :host ::ng-deep .p-inputtext:hover,
    :host ::ng-deep .p-password input:hover {
      border-color: #d1d5db;
    }

    :host ::ng-deep .p-inputtext:focus,
    :host ::ng-deep .p-password input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }

    :host ::ng-deep .p-password-input {
      width: 100%;
    }

    :host ::ng-deep .p-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s ease;
      margin-top: 0.5rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    :host ::ng-deep .p-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    :host ::ng-deep .p-button:active:not(:disabled) {
      transform: translateY(0);
    }

    :host ::ng-deep .p-button:disabled {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
      cursor: not-allowed;
      box-shadow: none;
    }

    :host ::ng-deep .p-divider {
      margin: 1.5rem 0;
    }

    :host ::ng-deep .p-divider::before {
      border-top-color: #e5e7eb;
    }

    .demo-credentials {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid #d1d5db;
    }

    .demo-credentials .flex {
      margin-bottom: 1rem;
    }

    .demo-credentials .pi-info-circle {
      font-size: 1.25rem;
      color: #667eea;
    }

    .credentials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 0.75rem;
    }

    .credentials-grid > div {
      background: white;
      padding: 0.875rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
    }

    .credentials-grid > div:hover {
      border-color: #667eea;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
      transform: translateY(-2px);
    }

    .credentials-grid .text-sm {
      font-size: 0.75rem;
      color: #6b7280;
      display: block;
      margin-bottom: 0.25rem;
    }

    .credentials-grid .font-bold {
      font-size: 1rem;
      font-weight: 700;
      color: #667eea;
      font-family: 'Courier New', monospace;
    }

    :host ::ng-deep .p-error {
      color: #ef4444;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
    }

    :host ::ng-deep .ng-invalid.ng-touched {
      border-color: #ef4444 !important;
    }

    :host ::ng-deep .ng-invalid.ng-touched:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    /* Responsive Design */
    @media (max-width: 480px) {
      .login-brand h1 {
        font-size: 1.5rem;
      }

      .brand-icon {
        width: 60px;
        height: 60px;
      }

      .brand-icon i {
        font-size: 2rem;
      }

      :host ::ng-deep .p-panel-content {
        padding: 1.5rem;
      }

      .credentials-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
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
