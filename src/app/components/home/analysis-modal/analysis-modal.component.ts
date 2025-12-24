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
        if (!this.analysisResult) return 'fas fa-search';
        const icons: Record<string, string> = {
            safe: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            danger: 'fas fa-times-circle'
        };
        return icons[this.analysisResult.status] || 'fas fa-search';
    }

    getStatusLabel(): string {
        if (!this.analysisResult) return 'Analyzing...';
        const labels: Record<string, string> = { safe: 'Safe', warning: 'Warning', danger: 'Dangerous' };
        return labels[this.analysisResult.status] || 'Unknown';
    }

    convertMarkdownToHtml(text: string): string {
        if (!text) return '';

        // Convert markdown to HTML
        let html = text
            // Bold: **text** or __text__
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<strong>$1</strong>')
            // Italic: *text* or _text_
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            // Code: `text`
            .replace(/`(.+?)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n/g, '<br>');

        return html;
    }
}
