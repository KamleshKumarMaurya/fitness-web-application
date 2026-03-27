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
  template: `
    <div class="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-500 font-sans tracking-tight pb-32 relative overflow-x-hidden">
      <!-- Background Decorative Elements -->
      <div class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div class="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full"></div>
        <div class="absolute bottom-0 -left-[10%] w-[40%] h-[60%] bg-secondary/10 blur-[150px] rounded-full"></div>
      </div>

      <nav class="sticky top-0 z-50 glass">
        <div class="max-w-5xl mx-auto px-8 h-20 flex justify-between items-center relative z-10">
          <a routerLink="/activity/list" class="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-black uppercase text-xs tracking-widest hover:text-primary transition-all">
            <lucide-angular [img]="ArrowLeft" class="w-4 h-4"></lucide-angular>
            <span>Timeline</span>
          </a>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">AI <span class="text-primary italic">Analysis</span></h1>
          <div class="w-10"></div>
        </div>
      </nav>

      <main class="max-w-5xl mx-auto px-8 mt-20 relative z-10">
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-48">
             <div class="relative w-32 h-32 mb-10">
               <div class="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
               <div class="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
               <lucide-angular [img]="Sparkles" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-pulse"></lucide-angular>
             </div>
             <p class="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Processing Biological Data...</p>
          </div>
        } @else if (recommendation()) {
          <div class="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <!-- Header Card Overhaul -->
            <section class="group bg-slate-900 border border-white/5 p-12 rounded-[4rem] text-white shadow-3xl relative overflow-hidden transition-all duration-700 hover:shadow-primary/10">
               <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
               <div class="relative z-10">
                 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div class="flex items-center gap-6">
                      <div class="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-3xl shadow-primary/40 group-hover:rotate-6 transition-transform">
                         <lucide-angular [img]="Activity" class="w-10 h-10 text-white"></lucide-angular>
                      </div>
                      <div>
                        <h2 class="text-4xl font-black tracking-tighter uppercase italic leading-none">{{ recommendation()?.activityType }} REPORT</h2>
                        <p class="text-primary font-black text-[10px] tracking-[0.3em] uppercase mt-3 flex items-center gap-2">
                           <span class="w-3 h-3 rounded-full bg-primary/20 animate-ping"></span>
                           Core Insight #{{ recommendation()?.activityId?.slice(-6) }}
                        </p>
                      </div>
                   </div>
                   <div class="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                      <p class="text-[10px] font-black uppercase tracking-widest text-white/40">Status</p>
                      <p class="text-sm font-black text-success uppercase italic tracking-widest">Optimized Analysis</p>
                   </div>
                 </div>
                 
                 <div class="relative">
                    <div class="bg-slate-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-inner transition-all duration-500 overflow-hidden"
                         [class.max-h-[300px]]="!showMore()"
                         [class.max-h-[2000px]]="showMore()">
                        <p class="text-white/90 font-medium leading-[1.8] text-lg lg:text-xl whitespace-pre-line italic relative">
                           {{ recommendation()?.recommendation }}
                           @if(!showMore()) {
                             <div class="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-slate-900/90 to-transparent pointer-events-none"></div>
                           }
                        </p>
                    </div>
                    
                    <button (click)="showMore.set(!showMore())" 
                            class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-8 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 border-b-4 border-slate-200 hover:border-primary-600 cursor-pointer">
                        <span>{{ showMore() ? 'Collapse Analysis' : 'Read Full Report' }}</span>
                        <lucide-angular [img]="TrendingUp" class="w-3 h-3" [class.rotate-180]="showMore()" class="transition-transform"></lucide-angular>
                    </button>
                 </div>
               </div>
            </section>

            <!-- Detailed Metrics Grid (Carousel Mode) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
               <!-- Victory Points (Success Strategies) -->
               <div class="bg-slate-50 dark:bg-slate-900/60 p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl card-hover relative overflow-hidden flex flex-col">
                  <div class="flex items-center gap-5 mb-12">
                    <div class="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-sm">
                      <lucide-angular [img]="TrendingUp" class="w-8 h-8"></lucide-angular>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Victory Points</h3>
                        <p class="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest leading-none">Growth Strategies</p>
                    </div>
                    <div class="text-[10px] font-black text-emerald-500/40">{{ currSugIdx() + 1 }} / {{ recommendation()?.suggestions?.length }}</div>
                  </div>

                  <div class="flex-1 flex flex-col justify-center ">
                    @if (recommendation()?.suggestions?.[currSugIdx()]) {
                      <div class="group bg-white dark:bg-slate-800/80 p-8 rounded-[2rem] text-slate-700 dark:text-slate-200 text-base font-bold border-l-8 border-emerald-500 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in duration-500">
                        <p class="leading-relaxed whitespace-pre-line">{{ recommendation()?.suggestions?.[currSugIdx()] }}</p>
                      </div>
                    }
                  </div>

                  <div class="mt-10 flex items-center justify-center gap-4">
                    <button (click)="prevSug()" class="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-90 cursor-pointer">
                      <lucide-angular [img]="ChevronLeft" class="w-5 h-5"></lucide-angular>
                    </button>
                    <div class="flex gap-2">
                       @for (s of recommendation()?.suggestions; track $index) {
                         <div class="w-2 h-2 rounded-full transition-all duration-300" [class]="currSugIdx() === $index ? 'bg-emerald-500 w-6' : 'bg-slate-200 dark:bg-white/10'"></div>
                       }
                    </div>
                    <button (click)="nextSug()" class="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-90 cursor-pointer">
                      <lucide-angular [img]="ChevronRight" class="w-5 h-5"></lucide-angular>
                    </button>
                  </div>
               </div>

               <!-- Refinement Path (Optimization Points) -->
               <div class="bg-slate-50 dark:bg-slate-900/60 p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl card-hover relative overflow-hidden flex flex-col">
                  <div class="flex items-center gap-5 mb-12">
                    <div class="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm">
                      <lucide-angular [img]="Sparkles" class="w-8 h-8"></lucide-angular>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Refinement Path</h3>
                        <p class="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest leading-none">Performance Tweak</p>
                    </div>
                    <div class="text-[10px] font-black text-blue-500/40">{{ currImpIdx() + 1 }} / {{ recommendation()?.improvements?.length }}</div>
                  </div>

                  <div class="flex-1 flex flex-col justify-center ">
                    @if (recommendation()?.improvements?.[currImpIdx()]) {
                      <div class="group bg-white dark:bg-slate-800/80 p-8 rounded-[2rem] text-slate-700 dark:text-slate-200 text-base font-bold border-l-8 border-blue-500 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in zoom-in duration-500">
                        <p class="leading-relaxed whitespace-pre-line">{{ recommendation()?.improvements?.[currImpIdx()] }}</p>
                      </div>
                    }
                  </div>

                  <div class="mt-10 flex items-center justify-center gap-4">
                    <button (click)="prevImp()" class="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-lg hover:bg-blue-500 hover:text-white transition-all active:scale-90 cursor-pointer">
                      <lucide-angular [img]="ChevronLeft" class="w-5 h-5"></lucide-angular>
                    </button>
                    <div class="flex gap-2">
                       @for (s of recommendation()?.improvements; track $index) {
                         <div class="w-2 h-2 rounded-full transition-all duration-300" [class]="currImpIdx() === $index ? 'bg-blue-500 w-6' : 'bg-slate-200 dark:bg-white/10'"></div>
                       }
                    </div>
                    <button (click)="nextImp()" class="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center shadow-lg hover:bg-blue-500 hover:text-white transition-all active:scale-90 cursor-pointer">
                      <lucide-angular [img]="ChevronRight" class="w-5 h-5"></lucide-angular>
                    </button>
                  </div>
               </div>
            </div>

            <!-- Guardians Safety (Warning/Safety Guidelines) -->
            <section class="bg-rose-500/5 backdrop-blur-md p-12 rounded-[4.5rem] border border-rose-500/10 shadow-3xl overflow-hidden relative">
               <div class="flex items-center gap-6 mb-12 relative z-10">
                  <div class="w-18 h-18 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-rose-600/30">
                    <lucide-angular [img]="Info" class="w-10 h-10"></lucide-angular>
                  </div>
                  <div>
                    <h3 class="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">Guardians <span class="text-rose-600 italic">Safety</span></h3>
                    <p class="text-[11px] font-black uppercase text-rose-500 mt-3 tracking-widest">Biometric Protection protocols</p>
                  </div>
               </div>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 @for (tip of recommendation()?.safety; track tip) {
                   <div class="group flex items-start gap-6 p-8 bg-white dark:bg-slate-900/80 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-rose-500/5 hover:-translate-y-2 transition-all duration-500">
                      <div class="mt-1">
                        <lucide-angular [img]="CheckCircle" class="w-6 h-6 text-rose-600 group-hover:scale-125 transition-transform"></lucide-angular>
                      </div>
                      <p class="text-slate-700 dark:text-slate-200 font-black text-sm leading-relaxed italic uppercase tracking-tight">{{ tip }}</p>
                   </div>
                 }
               </div>
            </section>
          </div>
        } @else {
          <div class="text-center py-48 glass rounded-[5rem] border-4 border-dashed border-slate-200 dark:border-white/5 animate-in zoom-in duration-700">
             <div class="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 ring-8 ring-slate-50 dark:ring-white/5">
                <lucide-angular [img]="Info" class="w-10 h-10 text-slate-400"></lucide-angular>
             </div>
             <h4 class="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Insights Locked</h4>
             <p class="text-slate-500 font-medium mt-4 max-w-sm mx-auto">Upload more activity data to allow the AI to generate deep physiological insights.</p>
             <a routerLink="/dashboard" class="mt-12 inline-flex border-2 border-slate-900 dark:border-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all cursor-pointer">
                Return Home
             </a>
          </div>
        }
      </main>
    </div>
  `,
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
