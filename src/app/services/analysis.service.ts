import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalysisRequest {
  url?: string;
  message?: string;
  deepScan?: boolean;
}

export interface AnalysisResponse {
  status: 'safe' | 'warning' | 'danger';
  score: number;
  details: string;
  threats?: string[];
  recommendations?: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Analyze a URL for potential threats
   */
  analyzeUrl(url: string, deepScan: boolean = false): Observable<AnalysisResponse> {
    const payload: AnalysisRequest = { url, deepScan };
    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze/url`, payload);
  }

  /**
   * Analyze a text message for scam content
   */
  analyzeMessage(message: string): Observable<AnalysisResponse> {
    const payload: AnalysisRequest = { message };
    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze/message`, payload);
  }

  /**
   * Analyze a file (image, PDF, etc.) for malicious content
   */
  analyzeFile(file: File): Observable<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<AnalysisResponse>(`${this.apiUrl}/analyze/file`, formData);
  }
}
