import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Activity, Flame, Clock, Plus, ArrowRight, User, LogOut, Moon, Sun, ChevronRight, TrendingUp } from 'lucide-angular';
import { AuthService } from '../core/services/auth.service';
import { ActivityService, Activity as ActivityModel } from '../core/services/activity.service';
import { ThemeService } from '../core/services/theme.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  animations: [
    trigger('staggerFade', [
      transition(':enter', [
        query('.group', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        query('.group', [
          style({ opacity: 0, x: -20 }),
          stagger(80, [
            animate('400ms ease-out', style({ opacity: 1, x: 0 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  activityService = inject(ActivityService);
  themeService = inject(ThemeService);

  readonly Activity = Activity;
  readonly Flame = Flame;
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly ArrowRight = ArrowRight;
  readonly User = User;
  readonly LogOut = LogOut;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly ChevronRight = ChevronRight;
  readonly TrendingUp = TrendingUp;

  totalActivities = signal(0);
  totalCalories = signal(0);
  totalMinutes = signal(0);

  ngOnInit() {
    this.activityService.getActivities().subscribe(activities => {
      this.totalActivities.set(activities.length);
      this.totalCalories.set(activities.reduce((acc, curr) => acc + curr.caloriesBurned, 0));
      this.totalMinutes.set(activities.reduce((acc, curr) => acc + curr.duration, 0));
    });
  }
}
