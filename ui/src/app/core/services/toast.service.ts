import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(toast: Toast) {
    const defaultDuration = toast.duration ?? 3000;
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x !== toast));
    }, defaultDuration);
  }

  success(message: string) {
    this.show({ message, type: 'success' });
  }

  error(message: string) {
    this.show({ message, type: 'error' });
  }
}
