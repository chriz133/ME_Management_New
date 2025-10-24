import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offer, OfferCreateUpdate } from '../models/offer.model';
import { environment } from '../../../environments/environment';

/**
 * Service for offer CRUD operations and PDF generation
 */
@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/offers`;

  getAll(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  getByCustomerId(customerId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  create(offer: OfferCreateUpdate): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  update(id: number, offer: OfferCreateUpdate): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Download offer PDF
   */
  downloadPdf(id: number, offerNumber: string): void {
    this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Angebot_${offerNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
