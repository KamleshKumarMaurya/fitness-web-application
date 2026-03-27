import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'activity',
    canActivate: [authGuard],
    children: [
      {
        path: 'add',
        loadComponent: () => import('./activity/add-activity/add-activity.component').then(m => m.AddActivityComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./activity/activity-list/activity-list.component').then(m => m.ActivityListComponent)
      }
    ]
  },
  {
    path: 'ai',
    canActivate: [authGuard],
    children: [
      {
        path: 'recommendation/:id',
        loadComponent: () => import('./ai/recommendation/recommendation.component').then(m => m.RecommendationComponent)
      }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
