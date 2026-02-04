import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      loadComponent: () => import('@app/modules/home.component').then(m => m.HomePageComponent)
    },
    {
      path: 'inventory',
      //canActivate: [authGuard],
      loadChildren: () => import('@app/modules/inventory/inventory.routes')
    },
    {
      path: 'schedule',
      loadChildren: () => import('@app/modules/schedule/schedule.routes')
    }
  ],
}];
