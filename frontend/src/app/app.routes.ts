import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      loadComponent: () => import('@app/modules/home.component').then(m => m.HomePageComponent)
    },
    {
      path: 'admin',
      //canActivate: [authGuard],
      loadChildren: () => import('@app/modules/admin/admin.routes')
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
