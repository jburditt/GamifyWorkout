import { Route } from "@angular/router";
import { FormPageComponent } from "@app/modules/user/pages/form.component";
import { SearchPageComponent } from "./pages/search.component";

export class UserRoutes {
  public static HOME = '';
  public static SEARCH = 'search';
  public static EDIT = ':id';
}

export default [
  {
    path: UserRoutes.HOME,
    component: FormPageComponent,
  },
  {
    path: UserRoutes.SEARCH,
    component: SearchPageComponent,
  },
  {
    path: UserRoutes.EDIT,
    component: FormPageComponent,
  }
] satisfies Route[];
