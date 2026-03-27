import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, Sparkles, Utensils, Lightbulb, ArrowLeft, Activity, Star, CheckCircle, TrendingUp, Info, ChevronLeft, ChevronRight } from 'lucide-angular';
import { AiService, Recommendation } from '../../core/services/ai.service';
import { ActivityService, Activity as ActivityModel } from '../../core/services/activity.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './recommendation.component.html',
  styles: [`:host { display: block; }`],
  animations: [
    trigger('staggerFade', []) // Placeholder if needed
  ]
})
export class RecommendationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private aiService = inject(AiService);
  private activityService = inject(ActivityService);

  readonly Sparkles = Sparkles;
  readonly Utensils = Utensils;
  readonly Lightbulb = Lightbulb;
  readonly ArrowLeft = ArrowLeft;
  readonly Activity = Activity;
  readonly Star = Star;
  readonly CheckCircle = CheckCircle;
  readonly TrendingUp = TrendingUp;
  readonly Info = Info;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  recommendation = signal<Recommendation | null>(null);
  activity = signal<ActivityModel | null>(null);
  loading = signal(true);
  showMore = signal(false);

  // Carousel indices
  currSugIdx = signal(0);
  currImpIdx = signal(0);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.fetchData(id);
      }
    });
  }

  nextSug() {
    const total = this.recommendation()?.suggestions?.length || 0;
    if (total > 0) this.currSugIdx.set((this.currSugIdx() + 1) % total);
  }

  prevSug() {
    const total = this.recommendation()?.suggestions?.length || 0;
    if (total > 0) this.currSugIdx.set((this.currSugIdx() - 1 + total) % total);
  }

  nextImp() {
    const total = this.recommendation()?.improvements?.length || 0;
    if (total > 0) this.currImpIdx.set((this.currImpIdx() + 1) % total);
  }

  prevImp() {
    const total = this.recommendation()?.improvements?.length || 0;
    if (total > 0) this.currImpIdx.set((this.currImpIdx() - 1 + total) % total);
  }

  fetchData(id: string) {
    this.loading.set(true);

    // Find activity in signal or fetch if needed
    const existing = this.activityService.activities().find(a => a.id === id);
    if (existing) {
      this.activity.set(existing);
    }

    this.aiService.getRecommendation(id).subscribe({
      next: (res) => {
        this.recommendation.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        // Updated mock fallback
        this.recommendation.set({
          activityId: id,
          activityType: "WORKOUT",
          recommendation: "Overall: Analysis shows a balanced heart rate and consistent duration. Good work!",
          improvements: [
            "Focus on maintaining core stability during high intensity intervals",
            "Try to reduce resting periods by 10% each week"
          ],
          suggestions: [
            "Incorporate dynamic stretching for 10 minutes post-workout",
            "Increase protein intake within 30 minutes of sessions"
          ],
          safety: [
            "Always stay hydrated before and after sessions",
            "Monitor joint discomfort and rest if necessary"
          ]
        });
      }
    });
  }
}
