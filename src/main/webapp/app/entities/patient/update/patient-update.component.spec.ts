jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PatientService } from '../service/patient.service';
import { IPatient, Patient } from '../patient.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { PatientUpdateComponent } from './patient-update.component';

describe('Component Tests', () => {
  describe('Patient Management Update Component', () => {
    let comp: PatientUpdateComponent;
    let fixture: ComponentFixture<PatientUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let patientService: PatientService;
    let consultationService: ConsultationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PatientUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PatientUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PatientUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      patientService = TestBed.inject(PatientService);
      consultationService = TestBed.inject(ConsultationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Consultation query and add missing value', () => {
        const patient: IPatient = { id: 456 };
        const consultation: IConsultation = { id: 80182 };
        patient.consultation = consultation;

        const consultationCollection: IConsultation[] = [{ id: 41494 }];
        jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
        const additionalConsultations = [consultation];
        const expectedCollection: IConsultation[] = [...additionalConsultations, ...consultationCollection];
        jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        expect(consultationService.query).toHaveBeenCalled();
        expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(
          consultationCollection,
          ...additionalConsultations
        );
        expect(comp.consultationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const patient: IPatient = { id: 456 };
        const consultation: IConsultation = { id: 76632 };
        patient.consultation = consultation;

        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(patient));
        expect(comp.consultationsSharedCollection).toContain(consultation);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patient>>();
        const patient = { id: 123 };
        jest.spyOn(patientService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patient }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(patientService.update).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patient>>();
        const patient = new Patient();
        jest.spyOn(patientService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: patient }));
        saveSubject.complete();

        // THEN
        expect(patientService.create).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Patient>>();
        const patient = { id: 123 };
        jest.spyOn(patientService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ patient });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(patientService.update).toHaveBeenCalledWith(patient);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackConsultationById', () => {
        it('Should return tracked Consultation primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConsultationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
