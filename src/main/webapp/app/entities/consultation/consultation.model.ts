import * as dayjs from 'dayjs';
import { IMedicament } from 'app/entities/medicament/medicament.model';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { IPatient } from 'app/entities/patient/patient.model';

export interface IConsultation {
  id?: number;
  nO?: number | null;
  date?: dayjs.Dayjs | null;
  medicaments?: IMedicament[] | null;
  medecins?: IMedecin[] | null;
  patients?: IPatient[] | null;
}

export class Consultation implements IConsultation {
  constructor(
    public id?: number,
    public nO?: number | null,
    public date?: dayjs.Dayjs | null,
    public medicaments?: IMedicament[] | null,
    public medecins?: IMedecin[] | null,
    public patients?: IPatient[] | null
  ) {}
}

export function getConsultationIdentifier(consultation: IConsultation): number | undefined {
  return consultation.id;
}
