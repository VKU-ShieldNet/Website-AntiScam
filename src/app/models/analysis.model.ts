// URL Analysis Models
export interface UrlAnalysisResponse {
  conclusion: string;
  risk_level: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  explanation: string;
  advice: string;
  is_safe: boolean;
  tools_used: string[];
  cache_hit: boolean;
}

// Text Analysis Models
export interface TextAnalysisResponse {
  label: string;
  is_safe: boolean;
  evidence: string[];
  recommendation: string[];
  score?: number; // Optional - only if API provides it
}

// Common Analysis Response (for UI)
export interface AnalysisResult {
  status: 'safe' | 'warning' | 'danger';
  score?: number; // Optional - only show if API provides it
  details: string;
  is_safe: boolean;
  threats?: string[];
  recommendations?: string[];
  timestamp: string;
  websiteData?: WebsiteAnalysisResponse; // Raw website scan data for detailed display
}

// Analysis Type
export type AnalysisType = 'url' | 'text' | 'image';

// Loading States
export interface LoadingState {
  isLoading: boolean;
  stage: string;
  progress?: number;
}

// Website Scan Models (New API)
export interface WebsiteAnalysisResponse {
  url: string;
  is_safe: boolean;
  risk_score: number;
  checks: WebsiteChecks;
  gemini_analysis: string;
  analysis_time_ms: number;
}

export interface WebsiteChecks {
  ssl: SSLCheck;
  domain_age: DomainAgeCheck;
  suspicious_keywords: KeywordCheck;
}

export interface SSLCheck {
  valid: boolean;
  issuer?: string;
  expires?: string;
  days_until_expiry?: number;
  error?: string;
}

export interface DomainAgeCheck {
  age_days?: number;
  is_new: boolean;
  is_very_new?: boolean;
  estimated?: boolean;
  error?: string;
}

export interface KeywordCheck {
  found: string[];
  count: number;
  risk_level: string;
}

// Website Preview Models
export interface WebsitePreviewResponse {
  url: string;
  screenshot_base64?: string;
  title?: string;
  meta_description?: string;
  visible_text?: string;
  preview_method: string;
  status: string;
  error?: string;
}
