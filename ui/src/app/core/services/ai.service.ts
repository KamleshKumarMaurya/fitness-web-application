import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recommendation {
  activityId: string;
  activityType: string;
  recommendation: string;
  improvements: string[];
  safety: string[];
  suggestions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly AI_URL = 'http://localhost:8080/api/ai-service/recommendations';

  constructor(private http: HttpClient) {}

  getRecommendation(activityId: string): Observable<Recommendation> {
    return this.http.get<Recommendation>(`${this.AI_URL}/activity/${activityId}`);
  }
}
