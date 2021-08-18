import { IConsultation } from 'app/entities/consultation/consultation.model';

export interface IPatient {
  id?: number;
  noss?: string | null;
  nom?: string | null;
  consultations?: IConsultation[] | null;
}

export class Patient implements IPatient {
  constructor(public id?: number, public noss?: string | null, public nom?: string | null, public consultations?: IConsultation[] | null) {}
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
