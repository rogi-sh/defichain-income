import { Component, Input, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-settings-page",
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  @Input()
  onChangeRefreshS: Function;

  @Input()
  sCountdown: number;
  
  @Input()
  sCountdownShow: number;
  
  @Input()
  loggedIn: boolean;
  
  @Input()
  errorBackend: string;
  
  @Input()
  successBackend: string;
  
  @Input()
  register: Function;
  
  @Input()
  login: Function;
  
  @Input()
  loggedInAuthInput: string;
  
  @Input()
  loggedInAuth: string;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
}
