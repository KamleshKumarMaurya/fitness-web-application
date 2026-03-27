import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from './auth.service';

export interface Activity {
  id?: string;
  activityType: string;
  duration: number;
  caloriesBurned: number;
  startTime: string;
  additionalMetrics?: {
    distanceKm?: number;
    averageHeartRate?: number;
    steps?: number;
  };
  userId?: string;
  createdAt?: string;
}

export interface ActivitiesResponse {
  data: Activity[];
  status: string;
  message: string;
  httpStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly ACTIVITY_URL = 'http://localhost:8080/api/activity-service/api/activities';

  activities = signal<Activity[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  trackActivity(activity: Activity): Observable<any> {
    const user = this.authService.currentUser();
    if (user) {
      activity.userId = user.id;
    }
    return this.http.post(`${this.ACTIVITY_URL}/track`, activity).pipe(
      tap(() => this.getActivities().subscribe())
    );
  }

  getActivities(): Observable<Activity[]> {
    const user = this.authService.currentUser();
    const userId = user?.id || '';
    return this.http.get<ActivitiesResponse>(`${this.ACTIVITY_URL}/${userId}`).pipe(
      map((res: ActivitiesResponse) => res.data),
      tap(data => this.activities.set(data))
    );
  }
}
