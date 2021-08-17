import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedecin, getMedecinIdentifier } from '../medecin.model';

export type EntityResponseType = HttpResponse<IMedecin>;
export type EntityArrayResponseType = HttpResponse<IMedecin[]>;

@Injectable({ providedIn: 'root' })
export class MedecinService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/medecins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(medecin: IMedecin): Observable<EntityResponseType> {
    return this.http.post<IMedecin>(this.resourceUrl, medecin, { observe: 'response' });
  }

  update(medecin: IMedecin): Observable<EntityResponseType> {
    return this.http.put<IMedecin>(`${this.resourceUrl}/${getMedecinIdentifier(medecin) as number}`, medecin, { observe: 'response' });
  }

  partialUpdate(medecin: IMedecin): Observable<EntityResponseType> {
    return this.http.patch<IMedecin>(`${this.resourceUrl}/${getMedecinIdentifier(medecin) as number}`, medecin, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedecin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedecin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedecinToCollectionIfMissing(medecinCollection: IMedecin[], ...medecinsToCheck: (IMedecin | null | undefined)[]): IMedecin[] {
    const medecins: IMedecin[] = medecinsToCheck.filter(isPresent);
    if (medecins.length > 0) {
      const medecinCollectionIdentifiers = medecinCollection.map(medecinItem => getMedecinIdentifier(medecinItem)!);
      const medecinsToAdd = medecins.filter(medecinItem => {
        const medecinIdentifier = getMedecinIdentifier(medecinItem);
        if (medecinIdentifier == null || medecinCollectionIdentifiers.includes(medecinIdentifier)) {
          return false;
        }
        medecinCollectionIdentifiers.push(medecinIdentifier);
        return true;
      });
      return [...medecinsToAdd, ...medecinCollection];
    }
    return medecinCollection;
  }
}
