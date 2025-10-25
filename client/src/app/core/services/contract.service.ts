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

  update(id: number, accepted: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { Accepted: accepted });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  convertToInvoice(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/convert-to-invoice`);
  }
}
