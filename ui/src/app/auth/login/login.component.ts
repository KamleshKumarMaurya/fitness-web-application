import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LogIn, Mail, Lock } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './login.component.html',
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly LogIn = LogIn;
  readonly Mail = Mail;
  readonly Lock = Lock;

  loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.toast.success('Successfully logged in!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Invalid email or password');
          this.loading.set(false);
        }
      });
    }
  }
}
