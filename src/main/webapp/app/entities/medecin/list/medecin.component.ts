import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedecin } from '../medecin.model';
import { MedecinService } from '../service/medecin.service';
import { MedecinDeleteDialogComponent } from '../delete/medecin-delete-dialog.component';

@Component({
  selector: 'jhi-medecin',
  templateUrl: './medecin.component.html',
})
export class MedecinComponent implements OnInit {
  medecins?: IMedecin[];
  isLoading = false;

  constructor(protected medecinService: MedecinService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medecinService.query().subscribe(
      (res: HttpResponse<IMedecin[]>) => {
        this.isLoading = false;
        this.medecins = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedecin): number {
    return item.id!;
  }

  delete(medecin: IMedecin): void {
    const modalRef = this.modalService.open(MedecinDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medecin = medecin;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
