import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatabaseInfo, PdfSettings } from '../models/system.model';
import { environment } from '../../../environments/environment';

/**
 * Service for system information operations
 */
@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/system`;

  /**
   * Get database connection information
   */
  getDatabaseInfo(): Observable<DatabaseInfo> {
    return this.http.get<DatabaseInfo>(`${this.apiUrl}/database-info`);
  }

  /**
   * Get PDF save path settings
   */
  getPdfSettings(): Observable<PdfSettings> {
    return this.http.get<PdfSettings>(`${this.apiUrl}/pdf-settings`);
  }
}
