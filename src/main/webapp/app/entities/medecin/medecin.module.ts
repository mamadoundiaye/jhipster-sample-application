import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MedecinComponent } from './list/medecin.component';
import { MedecinDetailComponent } from './detail/medecin-detail.component';
import { MedecinUpdateComponent } from './update/medecin-update.component';
import { MedecinDeleteDialogComponent } from './delete/medecin-delete-dialog.component';
import { MedecinRoutingModule } from './route/medecin-routing.module';

@NgModule({
  imports: [SharedModule, MedecinRoutingModule],
  declarations: [MedecinComponent, MedecinDetailComponent, MedecinUpdateComponent, MedecinDeleteDialogComponent],
  entryComponents: [MedecinDeleteDialogComponent],
})
export class MedecinModule {}
