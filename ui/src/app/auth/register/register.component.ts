import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Mail, Lock, CheckCircle2 } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950 font-sans">
      <!-- Full Page Cinematic Background -->
      <div class="absolute inset-0 z-0 select-none pointer-events-none">
        <img src="fitness-bg.png" 
             alt="Fitness background" class="w-full h-full object-cover opacity-40 scale-105 animate-pulse duration-[12s]">
        <div class="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black"></div>
      </div>

      <div class="w-full max-w-[500px] bg-black/70 backdrop-blur-2xl p-12 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-white/5 animate-in fade-in zoom-in duration-1000 relative z-10">
        <div class="text-center mb-12">
          <div class="w-20 h-20 rounded-full border-[5px] border-yellow-400 p-1 mx-auto mb-6 shadow-2xl shadow-yellow-400/20 group cursor-pointer hover:scale-110 transition-all duration-500">
             <div class="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-black">
                <lucide-angular [img]="User" class="w-8 h-8 group-hover:rotate-12 transition-transform duration-500"></lucide-angular>
             </div>
          </div>
          <h1 class="text-4xl font-light text-white mb-2 tracking-tighter uppercase italic">Create Account</h1>
          <p class="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Join the performance elite</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-2 group/field">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/field:text-yellow-400 transition-colors">First Name</label>
              <input type="text" formControlName="firstName" placeholder="First"
                     class="w-full bg-transparent border-0 border-b-2 border-slate-800 py-3 text-base text-white placeholder-slate-700/50 focus:outline-none focus:border-yellow-400 focus:ring-0 transition-all appearance-none rounded-none font-medium">
            </div>
            <div class="space-y-2 group/field">
              <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/field:text-yellow-400 transition-colors">Last Name</label>
              <input type="text" formControlName="lastName" placeholder="Last"
                     class="w-full bg-transparent border-0 border-b-2 border-slate-800 py-3 text-base text-white placeholder-slate-700/50 focus:outline-none focus:border-yellow-400 focus:ring-0 transition-all appearance-none rounded-none font-medium">
            </div>
          </div>

          <div class="space-y-2 group/field">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/field:text-yellow-400 transition-colors">Email Information</label>
            <input type="email" formControlName="email" placeholder="kamlesh@gmail.com"
                   class="w-full bg-transparent border-0 border-b-2 border-slate-800 py-3 text-base text-white placeholder-slate-700/50 focus:outline-none focus:border-yellow-400 focus:ring-0 transition-all appearance-none rounded-none font-medium">
          </div>

          <div class="space-y-2 group/field">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/field:text-yellow-400 transition-colors">Secure Password</label>
            <input type="password" formControlName="password" placeholder="••••••••"
                   class="w-full bg-transparent border-0 border-b-2 border-slate-800 py-3 text-base text-white placeholder-slate-700/50 focus:outline-none focus:border-yellow-400 focus:ring-0 transition-all appearance-none rounded-none font-medium tracking-[0.2rem]">
          </div>

          <div class="space-y-2 group/field">
            <label class="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within/field:text-yellow-400 transition-colors">Access Level</label>
            <div class="relative group">
              <select formControlName="role" 
                      class="w-full bg-transparent border-0 border-b-2 border-slate-800 py-3 text-xs text-white focus:outline-none focus:border-yellow-400 transition-all appearance-none cursor-pointer uppercase font-black tracking-widest">
                <option value="USER" class="text-slate-900">Registered User</option>
                <option value="ADMIN" class="text-slate-900">Platform Admin</option>
              </select>
              <div class="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-yellow-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="pt-8">
            <button type="submit" [disabled]="registerForm.invalid || loading()"
                    class="w-full h-16 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-[0.3em] rounded-sm shadow-2xl shadow-yellow-400/20 transition-all duration-500 active:scale-[0.98] disabled:opacity-30 disabled:grayscale cursor-pointer group flex items-center justify-center">
              @if (!loading()) {
                <span class="text-sm italic">Initialize Account</span>
              } @else {
                <div class="flex items-center gap-3">
                   <div class="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                   <span class="text-sm italic">Processing...</span>
                </div>
              }
            </button>
          </div>
        </form>

        <p class="text-center mt-10 text-[11px] text-slate-500 font-bold tracking-wide">
          Already verified? 
          <a routerLink="/auth/login" class="text-white hover:text-yellow-400 border-b-2 border-white/5 hover:border-yellow-400 pb-1 ml-2 transition-all italic">Sign in here</a>
        </p>

        <!-- Social Footer -->
        <div class="mt-10 pt-8 border-t border-white/5 text-center flex flex-col items-center">
           <span class="text-[16px] font-black text-white/20 select-none lowercase tracking-tighter italic">facebook.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: white !important;
      -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly CheckCircle2 = CheckCircle2;

  loading = signal(false);

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['USER', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.toast.success('Registration successful. Please login.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Registration failed');
          this.loading.set(false);
        }
      });
    }
  }
}
