import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Activity, Clock, Flame, ChevronRight, ArrowLeft, Plus, Search, Filter } from 'lucide-angular';
import { ActivityService, Activity as ActivityModel } from '../../core/services/activity.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './activity-list.component.html',
  animations: [
    trigger('listAnimation', [
      transition(':enter', [
        query('.group', [
          style({ opacity: 0, scale: 0.9, y: 30 }),
          stagger(100, [
            animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, scale: 1, y: 0 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ActivityListComponent implements OnInit {
  activityService = inject(ActivityService);

  readonly Activity = Activity;
  readonly Clock = Clock;
  readonly Flame = Flame;
  readonly ChevronRight = ChevronRight;
  readonly ArrowLeft = ArrowLeft;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Filter = Filter;

  ngOnInit() {
    this.activityService.getActivities().subscribe();
  }
}
