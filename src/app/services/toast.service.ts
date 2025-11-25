import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private nextId = 1;

  getToasts(): Toast[] {
    return this.toasts;
  }

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type
    };

    this.toasts.push(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }
}
