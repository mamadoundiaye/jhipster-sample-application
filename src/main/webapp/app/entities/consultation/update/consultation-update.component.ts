import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConsultation, Consultation } from '../consultation.model';
import { ConsultationService } from '../service/consultation.service';
import { IMedicament } from 'app/entities/medicament/medicament.model';
import { MedicamentService } from 'app/entities/medicament/service/medicament.service';

@Component({
  selector: 'jhi-consultation-update',
  templateUrl: './consultation-update.component.html',
})
export class ConsultationUpdateComponent implements OnInit {
  isSaving = false;

  medicamentsSharedCollection: IMedicament[] = [];

  editForm = this.fb.group({
    id: [],
    nO: [],
    date: [],
    medicaments: [],
  });

  constructor(
    protected consultationService: ConsultationService,
    protected medicamentService: MedicamentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consultation }) => {
      this.updateForm(consultation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consultation = this.createFromForm();
    if (consultation.id !== undefined) {
      this.subscribeToSaveResponse(this.consultationService.update(consultation));
    } else {
      this.subscribeToSaveResponse(this.consultationService.create(consultation));
    }
  }

  trackMedicamentById(index: number, item: IMedicament): number {
    return item.id!;
  }

  getSelectedMedicament(option: IMedicament, selectedVals?: IMedicament[]): IMedicament {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsultation>>): void {
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

  protected updateForm(consultation: IConsultation): void {
    this.editForm.patchValue({
      id: consultation.id,
      nO: consultation.nO,
      date: consultation.date,
      medicaments: consultation.medicaments,
    });

    this.medicamentsSharedCollection = this.medicamentService.addMedicamentToCollectionIfMissing(
      this.medicamentsSharedCollection,
      ...(consultation.medicaments ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.medicamentService
      .query()
      .pipe(map((res: HttpResponse<IMedicament[]>) => res.body ?? []))
      .pipe(
        map((medicaments: IMedicament[]) =>
          this.medicamentService.addMedicamentToCollectionIfMissing(medicaments, ...(this.editForm.get('medicaments')!.value ?? []))
        )
      )
      .subscribe((medicaments: IMedicament[]) => (this.medicamentsSharedCollection = medicaments));
  }

  protected createFromForm(): IConsultation {
    return {
      ...new Consultation(),
      id: this.editForm.get(['id'])!.value,
      nO: this.editForm.get(['nO'])!.value,
      date: this.editForm.get(['date'])!.value,
      medicaments: this.editForm.get(['medicaments'])!.value,
    };
  }
}
