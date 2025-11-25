import { createWorker, Worker } from 'tesseract.js';

export class OCRUtil {
  private static worker: Worker | null = null;

  /**
   * Perform OCR on an image file
   */
  static async extractText(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const worker = await createWorker('vie', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      return text.trim();
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Không thể đọc văn bản từ hình ảnh');
    }
  }

  /**
   * Validate if file is an image
   */
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Get supported file types
   */
  static getSupportedTypes(): string {
    return 'image/png, image/jpeg, image/jpg, image/webp';
  }
}
