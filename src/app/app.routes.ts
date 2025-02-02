import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.page').then( m => m.LandingPage)
  },
  {
    path: 'resetpassword',
    loadComponent: () => import('./pages/resetpassword/resetpassword.page').then( m => m.ResetpasswordPage)
  },
  { 
    path: 'new-entry', 
    loadComponent: () => import('./pages/new-entry/new-entry.page').then( m => m.NewEntryPage) 
  },
  {
    path: 'userprofile',
    loadComponent: () => import('./pages/userprofile/userprofile.page').then( m => m.UserprofilePage)
  },
  {
    path: 'entries',
    loadComponent: () => import('./pages/entries/entries.page').then( m => m.EntriesPage)
  },
  {
    path: 'entries',
    loadComponent: () => import('./pages/entries/entries.page').then( m => m.EntriesPage)
  },
  {
    path: 'tracking',
    loadComponent: () => import('./pages/tracking/tracking.page').then( m => m.TrackingPage)
  },
  {
    path: 'edittracking',
    loadComponent: () => import('./pages/edittracking/edittracking.page').then( m => m.EdittrackingPage)
  }

];
