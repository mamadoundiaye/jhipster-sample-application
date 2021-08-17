import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IMedicament {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  consultations?: IConsultation[] | null;
}

export class Medicament implements IMedicament {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public consultations?: IConsultation[] | null
  ) {}
}

export function getMedicamentIdentifier(medicament: IMedicament): number | undefined {
  return medicament.id;
}
