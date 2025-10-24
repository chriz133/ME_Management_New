import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position.model';
import { environment } from '../../../environments/environment';

/**
 * Service for position operations
 */
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/positions`;

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }

  getById(id: number): Observable<Position> {
    return this.http.get<Position>(`${this.apiUrl}/${id}`);
  }

  create(position: Partial<Position>): Observable<Position> {
    return this.http.post<Position>(this.apiUrl, position);
  }
}
