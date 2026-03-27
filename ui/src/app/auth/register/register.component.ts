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
  templateUrl: './register.component.html',
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
