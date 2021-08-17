import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMedecin, Medecin } from '../medecin.model';

import { MedecinService } from './medecin.service';

describe('Service Tests', () => {
  describe('Medecin Service', () => {
    let service: MedecinService;
    let httpMock: HttpTestingController;
    let elemDefault: IMedecin;
    let expectedResult: IMedecin | IMedecin[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MedecinService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        matricule: 'AAAAAAA',
        nom: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Medecin', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Medecin()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Medecin', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            matricule: 'BBBBBB',
            nom: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Medecin', () => {
        const patchObject = Object.assign(
          {
            matricule: 'BBBBBB',
          },
          new Medecin()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Medecin', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            matricule: 'BBBBBB',
            nom: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Medecin', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMedecinToCollectionIfMissing', () => {
        it('should add a Medecin to an empty array', () => {
          const medecin: IMedecin = { id: 123 };
          expectedResult = service.addMedecinToCollectionIfMissing([], medecin);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecin);
        });

        it('should not add a Medecin to an array that contains it', () => {
          const medecin: IMedecin = { id: 123 };
          const medecinCollection: IMedecin[] = [
            {
              ...medecin,
            },
            { id: 456 },
          ];
          expectedResult = service.addMedecinToCollectionIfMissing(medecinCollection, medecin);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Medecin to an array that doesn't contain it", () => {
          const medecin: IMedecin = { id: 123 };
          const medecinCollection: IMedecin[] = [{ id: 456 }];
          expectedResult = service.addMedecinToCollectionIfMissing(medecinCollection, medecin);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecin);
        });

        it('should add only unique Medecin to an array', () => {
          const medecinArray: IMedecin[] = [{ id: 123 }, { id: 456 }, { id: 42417 }];
          const medecinCollection: IMedecin[] = [{ id: 123 }];
          expectedResult = service.addMedecinToCollectionIfMissing(medecinCollection, ...medecinArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const medecin: IMedecin = { id: 123 };
          const medecin2: IMedecin = { id: 456 };
          expectedResult = service.addMedecinToCollectionIfMissing([], medecin, medecin2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medecin);
          expect(expectedResult).toContain(medecin2);
        });

        it('should accept null and undefined values', () => {
          const medecin: IMedecin = { id: 123 };
          expectedResult = service.addMedecinToCollectionIfMissing([], null, medecin, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medecin);
        });

        it('should return initial array if no Medecin is added', () => {
          const medecinCollection: IMedecin[] = [{ id: 123 }];
          expectedResult = service.addMedecinToCollectionIfMissing(medecinCollection, undefined, null);
          expect(expectedResult).toEqual(medecinCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
