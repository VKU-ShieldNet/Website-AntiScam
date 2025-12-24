import { Component } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { ToastService } from '../../services/toast.service';
import { AnalysisResult, LoadingState, AnalysisType, WebsiteAnalysisResponse } from '../../models/analysis.model';
import { OCRUtil } from '../../utils/ocr.util';
import { LOADING_MESSAGES, LOADING_CYCLE_DURATION } from '../../constants/loading-stages.constant';
import { VALIDATION_MESSAGES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/toast-messages.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalysisModalComponent } from './analysis-modal/analysis-modal.component';
import { WebsiteCheckModalComponent } from './website-check-modal/website-check-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Form inputs
  urlInput = '';
  messageInput = '';
  selectedFile: File | null = null;
  deepScanEnabled = false;

  // UI state
  activeTab: AnalysisType = 'url';
  loadingState: LoadingState = {
    isLoading: false,
    stage: '',
    progress: 0
  };

  // Analysis result
  analysisResult: AnalysisResult | null = null;
  ocrExtractedText: string = '';
  private loadingInterval: any = null;

  constructor(
    private analysisService: AnalysisService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) { }

  async analyzeUrl(): Promise<void> {
    if (!this.validateUrlInput()) return;

    // Open the new website check modal immediately
    this.openWebsiteCheckModal();
  }

  private validateUrlInput(): boolean {
    if (!this.urlInput.trim()) {
      this.showToast(VALIDATION_MESSAGES.URL_EMPTY, 'warning');
      return false;
    }
    return true;
  }

  async analyzeText(): Promise<void> {
    if (!this.validateTextInput()) return;

    await this.executeAnalysis(
      () => this.analysisService.analyzeText(this.messageInput)
    );
  }

  private validateTextInput(): boolean {
    if (!this.messageInput.trim()) {
      this.showToast(VALIDATION_MESSAGES.TEXT_EMPTY, 'warning');
      return false;
    }
    return true;
  }

  async analyzeFile(): Promise<void> {
    if (!this.validateFileInput()) return;

    if (!OCRUtil.isImageFile(this.selectedFile!)) {
      this.showToast(VALIDATION_MESSAGES.IMAGE_ONLY, 'warning');
      return;
    }

    await this.analyzeImageWithOCR();
  }

  private validateFileInput(): boolean {
    if (!this.selectedFile) {
      this.showToast(VALIDATION_MESSAGES.FILE_EMPTY, 'warning');
      return false;
    }
    return true;
  }

  private async analyzeImageWithOCR(): Promise<void> {
    try {
      this.loadingState = { isLoading: true, stage: '🔍 Recognizing text...', progress: 0 };

      // Perform OCR
      const extractedText = await OCRUtil.extractText(
        this.selectedFile!,
        (progress) => {
          this.loadingState.progress = progress;
          this.loadingState.stage = `🔍 Recognizing text... ${progress}%`;
        }
      );

      if (!extractedText) {
        throw new Error(VALIDATION_MESSAGES.OCR_EXTRACT_FAILED);
      }

      // Store OCR text for display in modal
      this.ocrExtractedText = extractedText;

      // Analyze extracted text with loading
      await this.executeAnalysis(
        () => this.analysisService.analyzeText(extractedText)
      );

    } catch (error) {
      this.handleError(error, 'OCR');
    }
  }

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  private async executeAnalysis(apiCall: () => any): Promise<void> {
    try {
      // Start loading and cycle through messages
      this.startLoadingCycle();

      // Call API and wait for response
      const result = await apiCall().toPromise();

      // Stop loading and show result
      this.stopLoadingCycle();
      this.handleSuccess(result);

    } catch (error) {
      this.stopLoadingCycle();
      this.handleError(error, 'analysis');
    }
  }

  private startLoadingCycle(): void {
    this.loadingState.isLoading = true;

    // Set initial random message
    this.loadingState.stage = this.getRandomLoadingMessage();

    // Cycle through random messages
    this.loadingInterval = setInterval(() => {
      this.loadingState.stage = this.getRandomLoadingMessage();
    }, LOADING_CYCLE_DURATION);
  }

  private getRandomLoadingMessage(): string {
    const randomIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
    return LOADING_MESSAGES[randomIndex];
  }

  private stopLoadingCycle(): void {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
    this.loadingState.isLoading = false;
  }

  cancelAnalysis(): void {
    this.stopLoadingCycle();
    this.showToast('Analysis cancelled', 'info');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleSuccess(result: AnalysisResult): void {
    this.analysisResult = result;
    console.log('Analysis Result:', this.analysisResult);
    this.loadingState.isLoading = false;

    const statusMessage = this.getSuccessMessage(result.status);
    this.showToast(statusMessage, result.status === 'safe' ? 'success' : 'info');

    // Open ng-bootstrap modal
    this.openResultModal();
  }

  private openResultModal(): void {
    const modalRef = this.modalService.open(AnalysisModalComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      scrollable: true,
      windowClass: 'analysis-modal-window'
    });
    modalRef.componentInstance.analysisResult = this.analysisResult;
    modalRef.componentInstance.urlInput = this.urlInput;
    modalRef.componentInstance.websiteData = this.analysisResult?.websiteData || null;
    modalRef.componentInstance.ocrText = this.ocrExtractedText;
  }

  private openWebsiteCheckModal(): void {
    const modalRef = this.modalService.open(WebsiteCheckModalComponent, {
      centered: true,
      size: 'xl',
      backdrop: 'static',
      scrollable: true,
      windowClass: 'website-check-modal-window'
    });
    modalRef.componentInstance.url = this.urlInput;
  }

  private getSuccessMessage(status: string): string {
    const messages: Record<string, string> = {
      safe: SUCCESS_MESSAGES.SAFE,
      warning: SUCCESS_MESSAGES.WARNING,
      danger: SUCCESS_MESSAGES.DANGER
    };
    return messages[status] || 'Analysis complete';
  }

  private handleError(error: any, context: string): void {
    console.error(`${context} Error:`, error);
    this.loadingState.isLoading = false;

    const errorMessage = this.getErrorMessage(error, context);
    this.showToast(errorMessage, 'error');
  }

  private getErrorMessage(error: any, context: string): string {
    if (context === 'OCR') {
      return ERROR_MESSAGES.OCR_ERROR;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.status === 0) {
      return ERROR_MESSAGES.CONNECTION_FAILED;
    }

    if (error?.status === 500) {
      return ERROR_MESSAGES.SERVER_ERROR;
    }

    return ERROR_MESSAGES.GENERIC_ERROR;
  }

  getStatusIcon(): string {
    if (!this.analysisResult) return '🔍';
    const icons = { safe: '✅', warning: '⚠️', danger: '🚨' };
    return icons[this.analysisResult.status] || '🔍';
  }

  getStatusLabel(): string {
    if (!this.analysisResult) return 'Analyzing...';
    const labels = { safe: 'Safe', warning: 'Warning', danger: 'Dangerous' };
    return labels[this.analysisResult.status] || 'Unknown';
  }


  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.toastService.show(message, type);
  }


  get isLoading(): boolean {
    return this.loadingState.isLoading;
  }

  get loadingStage(): string {
    return this.loadingState.stage;
  }

  startAnalysis(): void {
    this.analyzeUrl();
  }

  analyzeMessage(): void {
    this.analyzeText();
  }
}
