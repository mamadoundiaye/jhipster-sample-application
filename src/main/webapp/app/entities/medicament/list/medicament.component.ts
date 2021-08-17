import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicament } from '../medicament.model';
import { MedicamentService } from '../service/medicament.service';
import { MedicamentDeleteDialogComponent } from '../delete/medicament-delete-dialog.component';

@Component({
  selector: 'jhi-medicament',
  templateUrl: './medicament.component.html',
})
export class MedicamentComponent implements OnInit {
  medicaments?: IMedicament[];
  isLoading = false;

  constructor(protected medicamentService: MedicamentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medicamentService.query().subscribe(
      (res: HttpResponse<IMedicament[]>) => {
        this.isLoading = false;
        this.medicaments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedicament): number {
    return item.id!;
  }

  delete(medicament: IMedicament): void {
    const modalRef = this.modalService.open(MedicamentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medicament = medicament;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
