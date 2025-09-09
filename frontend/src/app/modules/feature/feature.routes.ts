import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/feature/pages/form.component";
import { NgRxStoreComponent } from "@app/modules/feature/pages/ngrx-store.component";

export class FeatureRoutes {
  public static HOME = '';
  public static FORM = 'form';
  public static NGRX_STORE = 'ngrx-store';
}

export default [
  {
    path: FeatureRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: FeatureRoutes.FORM,
    component: FormPageComponent,
  },
  {
    path: FeatureRoutes.NGRX_STORE,
    component: NgRxStoreComponent,
  }
] satisfies Route[];
