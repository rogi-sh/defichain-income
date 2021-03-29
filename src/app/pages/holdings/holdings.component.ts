import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../environments/environment';

@Component({
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  env = environment;

  ngOnInit(): void {
  }

  open(content): void{
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

    }, (reason) => {

    });
  }

}
