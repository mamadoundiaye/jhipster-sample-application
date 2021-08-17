jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedecinService } from '../service/medecin.service';
import { IMedecin, Medecin } from '../medecin.model';
import { IConsultation } from 'app/entities/consultation/consultation.model';
import { ConsultationService } from 'app/entities/consultation/service/consultation.service';

import { MedecinUpdateComponent } from './medecin-update.component';

describe('Component Tests', () => {
  describe('Medecin Management Update Component', () => {
    let comp: MedecinUpdateComponent;
    let fixture: ComponentFixture<MedecinUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medecinService: MedecinService;
    let consultationService: ConsultationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedecinUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedecinUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedecinUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medecinService = TestBed.inject(MedecinService);
      consultationService = TestBed.inject(ConsultationService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Consultation query and add missing value', () => {
        const medecin: IMedecin = { id: 456 };
        const consultation: IConsultation = { id: 64530 };
        medecin.consultation = consultation;

        const consultationCollection: IConsultation[] = [{ id: 33289 }];
        jest.spyOn(consultationService, 'query').mockReturnValue(of(new HttpResponse({ body: consultationCollection })));
        const additionalConsultations = [consultation];
        const expectedCollection: IConsultation[] = [...additionalConsultations, ...consultationCollection];
        jest.spyOn(consultationService, 'addConsultationToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        expect(consultationService.query).toHaveBeenCalled();
        expect(consultationService.addConsultationToCollectionIfMissing).toHaveBeenCalledWith(
          consultationCollection,
          ...additionalConsultations
        );
        expect(comp.consultationsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const medecin: IMedecin = { id: 456 };
        const consultation: IConsultation = { id: 81184 };
        medecin.consultation = consultation;

        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medecin));
        expect(comp.consultationsSharedCollection).toContain(consultation);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecin>>();
        const medecin = { id: 123 };
        jest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecin }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medecinService.update).toHaveBeenCalledWith(medecin);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecin>>();
        const medecin = new Medecin();
        jest.spyOn(medecinService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medecin }));
        saveSubject.complete();

        // THEN
        expect(medecinService.create).toHaveBeenCalledWith(medecin);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medecin>>();
        const medecin = { id: 123 };
        jest.spyOn(medecinService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medecinService.update).toHaveBeenCalledWith(medecin);
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
