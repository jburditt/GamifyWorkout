import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/feature/pages/form.component";

export class FeatureRoutes {
  public static HOME = '';
  public static FORM = 'form';
}

export default [
  {
    path: FeatureRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: FeatureRoutes.FORM,
    component: FormPageComponent,
  }
] satisfies Route[];
