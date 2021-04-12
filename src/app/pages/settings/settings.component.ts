import { Component, Input, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  @Input()
  onChangeRefreshS: () => void;

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
  register: () => void;

  @Input()
  login: () => void;

  @Input()
  loggedInAuthInput: string;

  @Input()
  loggedInAuth: string;

  @Input()
  autoLoadData: boolean;

  @Input()
  saveToggleAutoLoad: () => void;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
}
