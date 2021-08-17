import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MedicamentService } from '../service/medicament.service';

import { MedicamentComponent } from './medicament.component';

describe('Component Tests', () => {
  describe('Medicament Management Component', () => {
    let comp: MedicamentComponent;
    let fixture: ComponentFixture<MedicamentComponent>;
    let service: MedicamentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedicamentComponent],
      })
        .overrideTemplate(MedicamentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicamentComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(MedicamentService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.medicaments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
