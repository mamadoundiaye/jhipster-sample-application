import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedecinDetailComponent } from './medecin-detail.component';

describe('Component Tests', () => {
  describe('Medecin Management Detail Component', () => {
    let comp: MedecinDetailComponent;
    let fixture: ComponentFixture<MedecinDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MedecinDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ medecin: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MedecinDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedecinDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medecin on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medecin).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
