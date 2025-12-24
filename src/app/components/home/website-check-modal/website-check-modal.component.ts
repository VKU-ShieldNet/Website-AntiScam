import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewService } from '../../../services/preview.service';
import { AnalysisService } from '../../../services/analysis.service';
import { WebsitePreviewResponse, AnalysisResult } from '../../../models/analysis.model';

interface ProviderResult {
    name: string;
    result: string;
    status: 'safe' | 'warning' | 'danger' | 'loading' | 'error';
}

@Component({
    selector: 'app-website-check-modal',
    templateUrl: './website-check-modal.component.html',
    styleUrls: ['./website-check-modal.component.css']
})
export class WebsiteCheckModalComponent implements OnInit {
    @Input() url: string = '';

    // Loading states for each column
    aiAnalysisLoading = true;
    providerReportLoading = true;
    screenshotLoading = true;

    // Data for each column
    analysisResult: AnalysisResult | null = null;
    previewData: WebsitePreviewResponse | null = null;
    providerResults: ProviderResult[] = [];

    // Error states
    aiAnalysisError: string | null = null;
    screenshotError: string | null = null;

    constructor(
        public activeModal: NgbActiveModal,
        private previewService: PreviewService,
        private analysisService: AnalysisService
    ) { }

    ngOnInit(): void {
        this.initializeProviders();
        this.loadAllData();
    }

    private initializeProviders(): void {
        // Initialize provider results with loading state
        this.providerResults = [
            { name: 'VirusTotal', result: '', status: 'loading' },
            { name: 'Google Safe Browsing', result: '', status: 'loading' }
        ];
    }

    private loadAllData(): void {
        // Load all three sections in parallel
        this.loadAIAnalysis();
        this.loadScreenshot();
        this.loadProviderReports();
    }

    private loadAIAnalysis(): void {
        this.aiAnalysisLoading = true;
        this.analysisService.analyzeUrl(this.url).subscribe({
            next: (result) => {
                this.analysisResult = result;
                this.aiAnalysisLoading = false;
            },
            error: (error) => {
                console.error('AI Analysis error:', error);
                this.aiAnalysisError = 'Unable to load AI analysis';
                this.aiAnalysisLoading = false;
            }
        });
    }

    private loadScreenshot(): void {
        this.screenshotLoading = true;
        this.previewService.previewWebsite(this.url).subscribe({
            next: (preview) => {
                this.previewData = preview;
                this.screenshotLoading = false;
                this.screenshotError = null;
            },
            error: (error) => {
                console.error('Screenshot error:', error);
                this.screenshotLoading = false;
                this.screenshotError = 'Unable to load screenshot';
            }
        });
    }

    private loadProviderReports(): void {
        // Simulate provider results from the main analysis
        // In a real implementation, these would come from separate API calls
        this.providerReportLoading = true;

        // Use the main analysis result to populate provider data
        this.analysisService.analyzeUrl(this.url).subscribe({
            next: (result) => {
                this.updateProviderResults(result);
                this.providerReportLoading = false;
            },
            error: (error) => {
                console.error('Provider report error:', error);
                this.providerResults.forEach(p => {
                    p.status = 'error';
                    p.result = 'unavailable';
                });
                this.providerReportLoading = false;
            }
        });
    }

    private updateProviderResults(result: AnalysisResult): void {
        // Update provider results based on analysis
        const status = result.is_safe ? 'safe' : 'danger';
        const resultText = result.is_safe ? 'Safe' : 'Dangerous';

        this.providerResults = [
            { name: 'VirusTotal', result: resultText, status },
            { name: 'Google Safe Browsing', result: resultText, status }
        ];
    }

    getRiskScore(): number {
        return this.analysisResult?.score || 0;
    }

    getRiskScoreDisplay(): string {
        const score = this.getRiskScore();
        return `${Math.round(score)}/100`;
    }

    getGeminiAnalysis(): string {
        return this.analysisResult?.details || '';
    }

    getProviderStatusClass(status: string): string {
        const classes: Record<string, string> = {
            safe: 'status-safe',
            warning: 'status-warning',
            danger: 'status-danger',
            loading: 'status-loading',
            error: 'status-error'
        };
        return classes[status] || '';
    }

    getScreenshotSrc(): string {
        if (!this.previewData?.screenshot_base64) return '';
        return `data:image/png;base64,${this.previewData.screenshot_base64}`;
    }
}
