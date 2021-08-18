import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';

@Component({
  templateUrl: './medecin-delete-dialog.component.html',
})
export class MedecinDeleteDialogComponent {
  medecin?: IMedecin;

  constructor(protected medecinService: MedecinService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medecinService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
