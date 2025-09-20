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
      path: 'user',
      loadChildren: () => import('@app/modules/user/user.routes')
    },
    {
      path: 'feature',
      loadChildren: () => import('@app/modules/feature/feature.routes')
    }
  ],
}];
