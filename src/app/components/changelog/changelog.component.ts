import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '@environments/environment';
import {Changelog} from '@interfaces/Changelog';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {
  isOpen = false;

  logs: Changelog;

  constructor(private modalService: NgbModal) { }

  env = environment;

  ngOnInit(): void {

    this.logs = new Changelog();
  }

  handleOpen(): void{
    this.isOpen = !this.isOpen;
  }

}
