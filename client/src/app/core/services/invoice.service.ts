import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, InvoiceCreateUpdate } from '../models/invoice.model';
import { environment } from '../../../environments/environment';

/**
 * Service for invoice CRUD operations and PDF generation
 */
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/invoices`;

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  getByCustomerId(customerId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  create(invoice: InvoiceCreateUpdate): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  update(id: number, invoice: InvoiceCreateUpdate): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Download invoice PDF
   */
  downloadPdf(id: number, invoiceNumber: string): void {
    this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rechnung_${invoiceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
