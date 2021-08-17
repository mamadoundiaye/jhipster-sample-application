jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedicamentService } from '../service/medicament.service';
import { IMedicament, Medicament } from '../medicament.model';

import { MedicamentUpdateComponent } from './medicament-update.component';

describe('Component Tests', () => {
  describe('Medicament Management Update Component', () => {
    let comp: MedicamentUpdateComponent;
    let fixture: ComponentFixture<MedicamentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medicamentService: MedicamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedicamentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedicamentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicamentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medicamentService = TestBed.inject(MedicamentService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const medicament: IMedicament = { id: 456 };

        activatedRoute.data = of({ medicament });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medicament));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medicament>>();
        const medicament = { id: 123 };
        jest.spyOn(medicamentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicament });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medicament }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medicamentService.update).toHaveBeenCalledWith(medicament);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medicament>>();
        const medicament = new Medicament();
        jest.spyOn(medicamentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicament });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medicament }));
        saveSubject.complete();

        // THEN
        expect(medicamentService.create).toHaveBeenCalledWith(medicament);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Medicament>>();
        const medicament = { id: 123 };
        jest.spyOn(medicamentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ medicament });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medicamentService.update).toHaveBeenCalledWith(medicament);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
