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
}
