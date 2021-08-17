import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedecin } from '../medecin.model';

@Component({
  selector: 'jhi-medecin-detail',
  templateUrl: './medecin-detail.component.html',
})
export class MedecinDetailComponent implements OnInit {
  medecin: IMedecin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medecin }) => {
      this.medecin = medecin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
