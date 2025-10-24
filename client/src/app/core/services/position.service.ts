import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position.model';
import { environment } from '../../../environments/environment';

/**
 * Service for position operations
 * Positions are created dynamically when creating contracts/invoices
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/positions`;

  /**
   * Get all positions (for selection in contracts/invoices)
   */
  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }

  /**
   * Get position by ID
   */
  getById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.apiUrl}/${id}`);
  }
}
