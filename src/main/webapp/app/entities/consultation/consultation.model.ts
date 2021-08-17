import * as dayjs from 'dayjs';
import { IMedecin } from 'app/entities/medecin/medecin.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IMedicament } from 'app/entities/medicament/medicament.model';

export interface IConsultation {
  id?: number;
  nO?: number | null;
  date?: dayjs.Dayjs | null;
  medecins?: IMedecin[] | null;
  patients?: IPatient[] | null;
  medicaments?: IMedicament[] | null;
}

export class Consultation implements IConsultation {
  constructor(
    public id?: number,
    public nO?: number | null,
    public date?: dayjs.Dayjs | null,
    public medecins?: IMedecin[] | null,
    public patients?: IPatient[] | null,
    public medicaments?: IMedicament[] | null
  ) {}
}

export function getConsultationIdentifier(consultation: IConsultation): number | undefined {
  return consultation.id;
}
