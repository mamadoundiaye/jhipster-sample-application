import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medecin',
        data: { pageTitle: 'jhipsterSampleApplicationApp.medecin.home.title' },
        loadChildren: () => import('./medecin/medecin.module').then(m => m.MedecinModule),
      },
      {
        path: 'consultation',
        data: { pageTitle: 'jhipsterSampleApplicationApp.consultation.home.title' },
        loadChildren: () => import('./consultation/consultation.module').then(m => m.ConsultationModule),
      },
      {
        path: 'medicament',
        data: { pageTitle: 'jhipsterSampleApplicationApp.medicament.home.title' },
        loadChildren: () => import('./medicament/medicament.module').then(m => m.MedicamentModule),
      },
      {
        path: 'patient',
        data: { pageTitle: 'jhipsterSampleApplicationApp.patient.home.title' },
        loadChildren: () => import('./patient/patient.module').then(m => m.PatientModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
