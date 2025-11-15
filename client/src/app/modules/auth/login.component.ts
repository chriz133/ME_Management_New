import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ImageModule } from 'primeng/image';


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
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ImageModule
  ],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-left">
          <div class="brand-icon">
            <p-image src="assets/images/logo_v1.png" alt="Image" width="250" class="colorized" />
          </div>
          <p class="brand-subtitle">Geschäftsverwaltungssystem</p>
        </div>

        <div class="login-right">
          <h2 class="login-title">Anmelden</h2>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-field">
              <label for="username">
                <i class="pi pi-user"></i>
                Benutzername
              </label>
              <input
                pInputText
                id="username"
                formControlName="username"
                placeholder="Benutzername eingeben"
                [class.ng-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <small class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  Benutzername ist erforderlich
                </small>
              }
            </div>

            <div class="form-field">
              <label for="password">
                <i class="pi pi-lock"></i>
                Passwort
              </label>
              <p-password
                formControlName="password"
                inputId="password"
                [feedback]="false"
                [toggleMask]="true"
                placeholder="Passwort eingeben"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <small class="error-message">
                  <i class="pi pi-exclamation-circle"></i>
                  Passwort ist erforderlich
                </small>
              }
            </div>

            <p-button
              label="Anmelden"
              icon="pi pi-sign-in"
              [loading]="loading"
              [disabled]="loginForm.invalid"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-card {
      width: 100%;
      max-width: 1000px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      animation: slideIn 0.4s ease-out;
      display: grid;
      grid-template-columns: 400px 1fr;
      min-height: 500px;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-left {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
    }

    .brand-icon {
      width: 300px;
      height: 150px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
    }

    .brand-icon i {
      font-size: 3rem;
      color: white;
    }

    .colorized {
      filter: invert(85%) sepia(10%) saturate(1000%) hue-rotate(200deg);
    }

    .brand-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 0.75rem 0;
      color: white;
    }

    .brand-subtitle {
      font-size: 1.125rem;
      margin: 0;
      color: rgba(230, 230, 230, 0.95);
      font-weight: 400;
      line-height: 1.6;
    }

    .login-right {
      padding: 3rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .login-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 2rem 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .form-field label i {
      color: #667eea;
      font-size: 1rem;
    }

    :host ::ng-deep .form-field input[type="text"],
    :host ::ng-deep .form-field .p-password input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    :host ::ng-deep .form-field input[type="text"]:hover,
    :host ::ng-deep .form-field .p-password input:hover {
      border-color: #cbd5e1;
    }

    :host ::ng-deep .form-field input[type="text"]:focus,
    :host ::ng-deep .form-field .p-password input:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    :host ::ng-deep .form-field .p-password {
      width: 100%;
    }

    :host ::ng-deep .form-field .p-password .p-inputtext {
      width: 100%;
    }

    :host ::ng-deep .form-field input.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    :host ::ng-deep .login-form .p-button {
      width: 100%;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .login-form .p-button:hover:enabled {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    :host ::ng-deep .login-form .p-button:active:enabled {
      transform: translateY(0);
    }

    :host ::ng-deep .login-form .p-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .login-card {
        grid-template-columns: 1fr;
        max-width: 480px;
      }

      .login-left {
        padding: 2.5rem 2rem;
      }

      .brand-icon {
        width: 80px;
        height: 80px;
        margin-bottom: 1.5rem;
      }

      .brand-icon i {
        font-size: 2.5rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .brand-subtitle {
        font-size: 1rem;
      }

      .login-right {
        padding: 2.5rem 2rem;
      }
    }

    @media (max-width: 640px) {
      .login-wrapper {
        padding: 1rem;
      }

      .login-left {
        padding: 2rem 1.5rem;
      }

      .login-right {
        padding: 2rem 1.5rem;
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
