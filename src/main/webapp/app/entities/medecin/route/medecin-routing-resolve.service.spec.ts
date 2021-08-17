jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMedecin, Medecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';

import { MedecinRoutingResolveService } from './medecin-routing-resolve.service';

describe('Service Tests', () => {
  describe('Medecin routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MedecinRoutingResolveService;
    let service: MedecinService;
    let resultMedecin: IMedecin | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MedecinRoutingResolveService);
      service = TestBed.inject(MedecinService);
      resultMedecin = undefined;
    });

    describe('resolve', () => {
      it('should return IMedecin returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedecin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMedecin).toEqual({ id: 123 });
      });

      it('should return new IMedecin if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedecin = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMedecin).toEqual(new Medecin());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Medecin })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedecin = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMedecin).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
