import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

/**
 * Login screen component.
 * Provides username/password authentication and redirects to dashboard on success.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule
  ],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md">
        <p-card>
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">ME Management</h1>
            <p class="text-gray-600">Internes Geschäftsverwaltungssystem</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="flex flex-col gap-4">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                  Benutzername
                </label>
                <input
                  pInputText
                  id="username"
                  formControlName="username"
                  class="w-full"
                  placeholder="Benutzername eingeben"
                  [class.ng-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                />
                @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                  <small class="text-red-500">Benutzername ist erforderlich</small>
                }
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Passwort
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
                  <small class="text-red-500">Passwort ist erforderlich</small>
                }
              </div>

              <p-button
                label="Anmelden"
                icon="pi pi-sign-in"
                [loading]="loading"
                [disabled]="loginForm.invalid"
                styleClass="w-full"
                type="submit"
              />
            </div>
          </form>

          <div class="mt-4 text-center text-sm text-gray-600">
            <p>Standard-Anmeldedaten:</p>
            <p>Benutzername: <strong>admin</strong></p>
            <p>Passwort: <strong>admin</strong></p>
          </div>
        </p-card>
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
