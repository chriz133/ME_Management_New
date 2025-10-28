import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from '../models/contract.model';
import { environment } from '../../../environments/environment';

/**
 * Service for contract operations
 */
@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/contracts`;

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  create(contract: any): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract);
  }

  convertToInvoice(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/convert-to-invoice`);
  }

  /**
   * Generate and download PDF for a contract
   * @param id Contract ID
   * @returns Observable of Blob containing the PDF
   */
  generatePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }
}
