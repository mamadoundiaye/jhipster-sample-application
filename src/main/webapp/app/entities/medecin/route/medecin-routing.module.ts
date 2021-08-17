import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedecinComponent } from '../list/medecin.component';
import { MedecinDetailComponent } from '../detail/medecin-detail.component';
import { MedecinUpdateComponent } from '../update/medecin-update.component';
import { MedecinRoutingResolveService } from './medecin-routing-resolve.service';

const medecinRoute: Routes = [
  {
    path: '',
    component: MedecinComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedecinDetailComponent,
    resolve: {
      medecin: MedecinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedecinUpdateComponent,
    resolve: {
      medecin: MedecinRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medecinRoute)],
  exports: [RouterModule],
})
export class MedecinRoutingModule {}
