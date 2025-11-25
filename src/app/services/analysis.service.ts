import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  UrlAnalysisResponse,
  TextAnalysisResponse,
  AnalysisResult
} from '../models/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly API_BASE_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  /**
   * Analyze URL for security threats
   */
  analyzeUrl(url: string, forceRefresh: boolean = false): Observable<AnalysisResult> {
    const payload = { url, force_refresh: forceRefresh };
    return this.http
      .post<UrlAnalysisResponse>(`${this.API_BASE_URL}/model/analyze`, payload)
      .pipe(map(response => this.mapUrlResponse(response)));
  }

  /**
   * Analyze text content for scam/phishing
   */
  analyzeText(text: string): Observable<AnalysisResult> {
    const payload = { text };
    return this.http
      .post<TextAnalysisResponse>(`${this.API_BASE_URL}/text/analyze`, payload)
      .pipe(map(response => this.mapTextResponse(response)));
  }

  /**
   * Map URL API response to common AnalysisResult format
   */
  private mapUrlResponse(response: UrlAnalysisResponse): AnalysisResult {
    // Map risk_level to status
    const statusMap: Record<string, 'safe' | 'warning' | 'danger'> = {
      safe: 'safe',
      suspicious: 'warning',
      dangerous: 'danger'
    };

    return {
      status: statusMap[response.risk_level] || 'warning',
      score: response.score, // Use API score directly
      details: response.conclusion,
      is_safe: response.is_safe,
      threats: response.is_safe ? [] : (response.explanation ? [response.explanation] : []),
      recommendations: response.is_safe ? ['Website này được xác nhận là an toàn'] : [response.advice],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Map Text API response to common AnalysisResult format
   */
  private mapTextResponse(response: TextAnalysisResponse): AnalysisResult {
    const label = response.label.toLowerCase();

    // Determine status and is_safe from label
    let status: 'safe' | 'warning' | 'danger' = 'warning';
    let is_safe = false;

    if (label.includes('safe') || label.includes('legitimate')) {
      status = 'safe';
      is_safe = true;
    } else if (label.includes('scam') || label.includes('phishing') || label.includes('fraud')) {
      status = 'danger';
      is_safe = false;
    }

    return {
      status,
      score: response.score, // Use API score if provided, undefined otherwise
      details: response.label,
      is_safe,
      threats: is_safe ? [] : response.evidence,
      recommendations: response.recommendation,
      timestamp: new Date().toISOString()
    };
  }

}
