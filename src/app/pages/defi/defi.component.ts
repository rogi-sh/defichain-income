import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-defi-page',
  templateUrl: './defi.component.html',
})
export class DefiComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content): void{
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

    }, (reason) => {

    });
  }

}
