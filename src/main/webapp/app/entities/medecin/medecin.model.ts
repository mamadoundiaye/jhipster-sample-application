import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IMedecin {
  id?: number;
  matricule?: string | null;
  nom?: string | null;
  consultation?: IConsultation | null;
}

export class Medecin implements IMedecin {
  constructor(
    public id?: number,
    public matricule?: string | null,
    public nom?: string | null,
    public consultation?: IConsultation | null
  ) {}
}

export function getMedecinIdentifier(medecin: IMedecin): number | undefined {
  return medecin.id;
}
