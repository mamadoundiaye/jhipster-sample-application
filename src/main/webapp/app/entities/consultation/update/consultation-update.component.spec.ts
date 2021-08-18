jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConsultationService } from '../service/consultation.service';
import { IConsultation, Consultation } from '../consultation.model';
import { IMedicament } from 'app/entities/medicament/medicament.model';
import { MedicamentService } from 'app/entities/medicament/service/medicament.service';

import { ConsultationUpdateComponent } from './consultation-update.component';

describe('Component Tests', () => {
  describe('Consultation Management Update Component', () => {
    let comp: ConsultationUpdateComponent;
    let fixture: ComponentFixture<ConsultationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let consultationService: ConsultationService;
    let medicamentService: MedicamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConsultationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      consultationService = TestBed.inject(ConsultationService);
      medicamentService = TestBed.inject(MedicamentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Medicament query and add missing value', () => {
        const consultation: IConsultation = { id: 456 };
        const medicaments: IMedicament[] = [{ id: 65696 }];
        consultation.medicaments = medicaments;

        const medicamentCollection: IMedicament[] = [{ id: 80140 }];
        jest.spyOn(medicamentService, 'query').mockReturnValue(of(new HttpResponse({ body: medicamentCollection })));
        const additionalMedicaments = [...medicaments];
        const expectedCollection: IMedicament[] = [...additionalMedicaments, ...medicamentCollection];
        jest.spyOn(medicamentService, 'addMedicamentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        expect(medicamentService.query).toHaveBeenCalled();
        expect(medicamentService.addMedicamentToCollectionIfMissing).toHaveBeenCalledWith(medicamentCollection, ...additionalMedicaments);
        expect(comp.medicamentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const consultation: IConsultation = { id: 456 };
        const medicaments: IMedicament = { id: 14855 };
        consultation.medicaments = [medicaments];

        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(consultation));
        expect(comp.medicamentsSharedCollection).toContain(medicaments);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = { id: 123 };
        jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(consultationService.update).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = new Consultation();
        jest.spyOn(consultationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consultation }));
        saveSubject.complete();

        // THEN
        expect(consultationService.create).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Consultation>>();
        const consultation = { id: 123 };
        jest.spyOn(consultationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ consultation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(consultationService.update).toHaveBeenCalledWith(consultation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMedicamentById', () => {
        it('Should return tracked Medicament primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMedicamentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedMedicament', () => {
        it('Should return option if no Medicament is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedMedicament(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Medicament for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedMedicament(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Medicament is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedMedicament(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
