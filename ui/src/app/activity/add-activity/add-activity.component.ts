import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Activity, Clock, Flame, Calendar, MapPin, Heart, Footprints, ArrowLeft, Check, Sparkles, ChevronRight, Lightbulb } from 'lucide-angular';
import { ActivityService, Activity as ActivityModel } from '../../core/services/activity.service';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './add-activity.component.html',
  styles: [`
    :host { display: block; }
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      filter: invert(0.5);
    }
    .dark input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      filter: invert(0.8);
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  `]
})
export class AddActivityComponent {
  private fb = inject(FormBuilder);
  private activityService = inject(ActivityService);
  private router = inject(Router);
  private toast = inject(ToastService);
  themeService = inject(ThemeService);

  readonly Activity = Activity;
  readonly Clock = Clock;
  readonly Flame = Flame;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Heart = Heart;
  readonly Footprints = Footprints;
  readonly ArrowLeft = ArrowLeft;
  readonly Check = Check;
  readonly Sparkles = Sparkles;
  readonly ChevronRight = ChevronRight;
  readonly Lightbulb = Lightbulb;

  loading = signal(false);
  activityTypes = ['RUNNING', 'CYCLING', 'SWIMMING', 'YOGA', 'WEIGHTLIFTING', 'HIKING', 'DANCING', 'PILATES', 'CROSSFIT', 'OTHER'];

  activityForm: FormGroup = this.fb.group({
    activityType: ['', [Validators.required]],
    duration: [null, [Validators.required, Validators.min(1)]],
    caloriesBurned: [null, [Validators.required, Validators.min(0)]],
    startTime: [new Date().toISOString().slice(0, 16), [Validators.required]],
    distance: [null],
    heartRate: [null],
    steps: [null]
  });

  selectType(type: string) {
    this.activityForm.get('activityType')?.setValue(type);
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this.loading.set(true);
      const formValue = this.activityForm.value;
      const activityData = {
        activityType: formValue.activityType,
        duration: formValue.duration,
        caloriesBurned: formValue.caloriesBurned,
        startTime: formValue.startTime,
        additionalMetrics: {
          distanceKm: formValue.distance,
          averageHeartRate: formValue.heartRate,
          steps: formValue.steps
        }
      };

      this.activityService.trackActivity(activityData as any).subscribe({
        next: () => {
          this.toast.success('Activity tracked successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.toast.error(err.error?.message || 'Failed to track activity');
          this.loading.set(false);
        }
      });
    }
  }
}
