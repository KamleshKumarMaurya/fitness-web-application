import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast) {
        <div [@toastAnimation]
             class="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
             [ngClass]="{
               'bg-green-500/90 text-white': toast.type === 'success',
               'bg-red-500/90 text-white': toast.type === 'error',
               'bg-blue-500/90 text-white': toast.type === 'info'
             }">
          <span class="flex-1 font-medium">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
