import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMedecin, Medecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

@Component({
  selector: 'jhi-medecin-update',
  templateUrl: './medecin-update.component.html',
})
export class MedecinUpdateComponent implements OnInit {
  isSaving = false;

  consultationsSharedCollection: IConsultation[] = [];

  editForm = this.fb.group({
    id: [],
    matricule: [],
    nom: [],
    consultation: [],
  });

  constructor(
    protected medecinService: MedecinService,
    protected consultationService: ConsultationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecin }) => {
      this.updateForm(medecin);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medecin = this.createFromForm();
    if (medecin.id !== undefined) {
      this.subscribeToSaveResponse(this.medecinService.update(medecin));
    } else {
      this.subscribeToSaveResponse(this.medecinService.create(medecin));
    }
  }

  trackConsultationById(index: number, item: IConsultation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedecin>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(medecin: IMedecin): void {
    this.editForm.patchValue({
      id: medecin.id,
      matricule: medecin.matricule,
      nom: medecin.nom,
      consultation: medecin.consultation,
    });

    this.consultationsSharedCollection = this.consultationService.addConsultationToCollectionIfMissing(
      this.consultationsSharedCollection,
      medecin.consultation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consultationService
      .query()
      .pipe(map((res: HttpResponse<IConsultation[]>) => res.body ?? []))
      .pipe(
        map((consultations: IConsultation[]) =>
          this.consultationService.addConsultationToCollectionIfMissing(consultations, this.editForm.get('consultation')!.value)
        )
      )
      .subscribe((consultations: IConsultation[]) => (this.consultationsSharedCollection = consultations));
  }

  protected createFromForm(): IMedecin {
    return {
      ...new Medecin(),
      id: this.editForm.get(['id'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      consultation: this.editForm.get(['consultation'])!.value,
    };
  }
}
