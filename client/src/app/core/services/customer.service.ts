import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Contract } from '../models/contract.model';
import { Invoice } from '../models/invoice.model';
import { environment } from '../../../environments/environment';

/**
 * Service for customer operations
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  getCustomerContracts(id: number): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/${id}/contracts`);
  }

  getCustomerInvoices(id: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/${id}/invoices`);
  }
}
