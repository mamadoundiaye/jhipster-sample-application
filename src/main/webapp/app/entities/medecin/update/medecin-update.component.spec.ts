jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedecinService } from '../service/medecin.service';
import { IMedecin, Medecin } from '../medecin.model';

import { MedecinUpdateComponent } from './medecin-update.component';

describe('Component Tests', () => {
  describe('Medecin Management Update Component', () => {
    let comp: MedecinUpdateComponent;
    let fixture: ComponentFixture<MedecinUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medecinService: MedecinService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const medecin: IMedecin = { id: 456 };

        activatedRoute.data = of({ medecin });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medecin));
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
  });
});
