import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  UrlAnalysisResponse,
  TextAnalysisResponse,
  AnalysisResult,
  WebsiteAnalysisResponse
} from '../models/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly API_BASE_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  /**
   * Analyze URL for security threats using new website scan API
   */
  analyzeUrl(url: string, forceRefresh: boolean = false): Observable<AnalysisResult> {
    const payload = { url };
    return this.http
      .post<WebsiteAnalysisResponse>(`${this.API_BASE_URL}/scan/website`, payload)
      .pipe(map(response => this.mapWebsiteResponse(response)));
  }

  /**
   * Analyze text content for scam/phishing
   */
  analyzeText(text: string): Observable<AnalysisResult> {
    const payload = { text };
    return this.http
      .post<TextAnalysisResponse>(`${this.API_BASE_URL}/scan/text`, payload)
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
    // Use is_safe directly from API
    const is_safe = response.is_safe;

    // Determine status from is_safe and label
    let status: 'safe' | 'warning' | 'danger' = 'warning';
    const label = response.label.toLowerCase();

    if (is_safe) {
      status = 'safe';
    } else if (label.includes('scam') || label.includes('phishing') || label.includes('fraud')) {
      status = 'danger';
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

  /**
   * Map Website Scan API response to common AnalysisResult format
   */
  private mapWebsiteResponse(response: WebsiteAnalysisResponse): AnalysisResult {
    // Determine status based on risk score
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (response.risk_score >= 70) {
      status = 'danger';
    } else if (response.risk_score >= 40) {
      status = 'warning';
    }

    // Build threats array from checks
    const threats: string[] = [];
    if (!response.checks.ssl.valid) {
      threats.push(`🔒 SSL không hợp lệ: ${response.checks.ssl.error || 'Chứng chỉ không an toàn'}`);
    }
    if (response.checks.domain_age.is_new) {
      const ageText = response.checks.domain_age.age_days
        ? `${response.checks.domain_age.age_days} ngày`
        : 'rất mới';
      threats.push(`⏰ Tên miền mới đăng ký: ${ageText}`);
    }
    if (response.checks.suspicious_keywords.count > 0) {
      threats.push(`⚠️ Phát hiện ${response.checks.suspicious_keywords.count} từ khóa đáng ngờ: ${response.checks.suspicious_keywords.found.join(', ')}`);
    }

    // Build recommendations
    const recommendations: string[] = [];
    if (response.is_safe) {
      recommendations.push('✅ Website này có vẻ an toàn');
      if (response.checks.ssl.valid) {
        recommendations.push('🔒 Chứng chỉ SSL hợp lệ');
      }
    } else {
      recommendations.push('⚠️ Hãy cẩn thận khi truy cập website này');
      recommendations.push('🚫 Không nhập thông tin cá nhân hoặc tài chính');
      if (!response.checks.ssl.valid) {
        recommendations.push('🔒 Tránh nhập mật khẩu trên website không có SSL');
      }
    }

    return {
      status,
      score: response.risk_score,
      details: response.gemini_analysis,
      is_safe: response.is_safe,
      threats: threats.length > 0 ? threats : undefined,
      recommendations,
      timestamp: new Date().toISOString(),
      websiteData: response // Include raw data for detailed display
    };
  }

}
