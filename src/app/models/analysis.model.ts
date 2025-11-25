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
}

// Analysis Type
export type AnalysisType = 'url' | 'text' | 'image';

// Loading States
export interface LoadingState {
  isLoading: boolean;
  stage: string;
  progress?: number;
}
