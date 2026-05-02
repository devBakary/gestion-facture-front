import { Routes } from '@angular/router';
import { SidebarComponent } from './page/sidebar/sidebar.component';
import { HomeComponent } from './page/home/home.component';
import { FacturesComponent } from './page/factures/factures.component';
import { DetailFactureComponent } from './page/detail-facture/detail-facture.component';
import { AddFacturesComponent } from './page/add-factures/add-factures.component';
import { LoginComponent } from './page/login/login.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/sidebar/dash",
    pathMatch: 'full'
  },
  {
    path: "nav",
    component: SidebarComponent,
    children: [
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "factures",
        component: FacturesComponent
      },
      {
        path: "detail/:id",
        component: DetailFactureComponent
      },
      {
        path: "add-facture",
        component: AddFacturesComponent
      },

    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
          { path: '**', redirectTo: '/nav/home' }

];
