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
    <div class="flex items-center justify-center min-h-screen" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="w-full max-w-md px-4">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" 
               style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%); backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
            <i class="pi pi-building text-4xl text-white"></i>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2" style="text-shadow: 0 2px 10px rgba(0,0,0,0.2);">ME Management</h1>
          <p class="text-white text-lg opacity-90">Internes Geschäftsverwaltungssystem</p>
        </div>

        <p-card styleClass="shadow-2xl">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="flex flex-col gap-5">
              <div>
                <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="pi pi-user mr-2"></i>Benutzername
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
                  <small class="text-red-500 mt-1 block"><i class="pi pi-exclamation-circle mr-1"></i>Benutzername ist erforderlich</small>
                }
              </div>

              <div>
                <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
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
                  <small class="text-red-500 mt-1 block"><i class="pi pi-exclamation-circle mr-1"></i>Passwort ist erforderlich</small>
                }
              </div>

              <p-button
                label="Anmelden"
                icon="pi pi-sign-in"
                [loading]="loading"
                [disabled]="loginForm.invalid"
                styleClass="w-full"
                [style]="{'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'border': 'none', 'padding': '0.875rem'}"
                type="submit"
              />
            </div>
          </form>

          <div class="mt-6 p-4 rounded-lg text-center text-sm" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.2);">
            <p class="text-gray-700 font-medium mb-2"><i class="pi pi-info-circle mr-2"></i>Standard-Anmeldedaten</p>
            <div class="flex justify-center gap-6 text-gray-600">
              <div>
                <span class="text-xs opacity-75">Benutzername:</span>
                <div class="font-bold text-purple-700">admin</div>
              </div>
              <div>
                <span class="text-xs opacity-75">Passwort:</span>
                <div class="font-bold text-purple-700">admin</div>
              </div>
            </div>
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
