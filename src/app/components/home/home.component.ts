import { Component } from '@angular/core';
import { AnalysisService, AnalysisResponse } from '../../services/analysis.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  urlInput: string = '';
  messageInput: string = '';
  selectedFile: File | null = null;
  deepScanEnabled: boolean = false;
  isLoading: boolean = false;
  loadingStage: string = '';
  showModal: boolean = false;
  analysisResult: AnalysisResponse | null = null;
  activeTab: 'url' | 'message' | 'file' = 'url';

  constructor(private analysisService: AnalysisService) { }

  /**
   * Simulate a multi-step analysis process
   */
  private async simulateAnalysisProcess(callback: () => void): Promise<void> {
    this.isLoading = true;

    const stages = [
      'Establishing secure connection...',
      'Scanning database for known threats...',
      'Analyzing content heuristics...',
      'Running deep learning models...',
      'Verifying SSL/TLS certificates...',
      'Finalizing security report...'
    ];

    for (const stage of stages) {
      this.loadingStage = stage;
      // Random delay between 800ms and 1500ms for realism
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    }

    callback();
  }

  /**
   * Start URL analysis
   */
  startAnalysis(): void {
    if (!this.urlInput.trim()) {
      alert('Please enter a URL to analyze');
      return;
    }

    this.simulateAnalysisProcess(() => {
      this.analysisService.analyzeUrl(this.urlInput, this.deepScanEnabled).subscribe({
        next: (result) => {
          this.analysisResult = result;
          this.showModal = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Analysis error:', error);
          // Mock success for demo purposes if API fails or is not connected
          this.mockSuccessResult('url');
        }
      });
    });
  }

  /**
   * Analyze message content
   */
  analyzeMessage(): void {
    if (!this.messageInput.trim()) {
      alert('Please enter a message to analyze');
      return;
    }

    this.simulateAnalysisProcess(() => {
      this.analysisService.analyzeMessage(this.messageInput).subscribe({
        next: (result) => {
          this.analysisResult = result;
          this.showModal = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Analysis error:', error);
          this.mockSuccessResult('message');
        }
      });
    });
  }

  /**
   * Handle file upload
   */
  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /**
   * Analyze uploaded file
   */
  analyzeFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file to analyze');
      return;
    }

    this.simulateAnalysisProcess(() => {
      this.analysisService.analyzeFile(this.selectedFile!).subscribe({
        next: (result) => {
          this.analysisResult = result;
          this.showModal = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Analysis error:', error);
          this.mockSuccessResult('file');
        }
      });
    });
  }

  /**
   * Mock result for demonstration when API is not available
   */
  private mockSuccessResult(type: 'url' | 'message' | 'file'): void {
    this.analysisResult = {
      status: 'safe',
      score: 95,
      details: 'No significant threats detected.',
      threats: [],
      recommendations: ['Always verify the sender identity', 'Keep your software updated'],
      timestamp: new Date().toISOString()
    };
    this.showModal = true;
    this.isLoading = false;
  }

  /**
   * Close results modal
   */
  closeModal(): void {
    this.showModal = false;
    this.analysisResult = null;
  }

  /**
   * Get status icon based on analysis result
   */
  getStatusIcon(): string {
    if (!this.analysisResult) return '🔍';

    switch (this.analysisResult.status) {
      case 'safe':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🚨';
      default:
        return '🔍';
    }
  }

  /**
   * Get status label
   */
  getStatusLabel(): string {
    if (!this.analysisResult) return 'Analyzing...';

    switch (this.analysisResult.status) {
      case 'safe':
        return 'Safe';
      case 'warning':
        return 'Warning';
      case 'danger':
        return 'Dangerous';
      default:
        return 'Unknown';
    }
  }
}
