import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalysisResult, WebsiteAnalysisResponse } from '../../../models/analysis.model';

@Component({
    selector: 'app-analysis-modal',
    templateUrl: './analysis-modal.component.html',
    styleUrls: ['./analysis-modal.component.css']
})
export class AnalysisModalComponent {
    @Input() analysisResult!: AnalysisResult;
    @Input() urlInput: string = '';
    @Input() websiteData: WebsiteAnalysisResponse | null = null;
    @Input() ocrText: string = '';

    constructor(public activeModal: NgbActiveModal) { }

    getStatusIcon(): string {
        if (!this.analysisResult) return '🔍';
        const icons: Record<string, string> = { safe: '✅', warning: '⚠️', danger: '🚨' };
        return icons[this.analysisResult.status] || '🔍';
    }

    getStatusLabel(): string {
        if (!this.analysisResult) return 'Analyzing...';
        const labels: Record<string, string> = { safe: 'Safe', warning: 'Warning', danger: 'Dangerous' };
        return labels[this.analysisResult.status] || 'Unknown';
    }
}
