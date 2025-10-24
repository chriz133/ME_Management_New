import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Service for displaying toast notifications.
 * Wraps PrimeNG MessageService for consistent notification handling.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  success(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Erfolg',
      detail: message,
      life: 3000
    });
  }

  error(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Fehler',
      detail: message,
      life: 5000
    });
  }

  info(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: message,
      life: 3000
    });
  }

  warn(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warnung',
      detail: message,
      life: 4000
    });
  }
}
