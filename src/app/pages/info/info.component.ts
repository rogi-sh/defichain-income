import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-page',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  @Input()
  trackGit: Function;

  @Input()
  trackGraphQL: Function;

  constructor() { }

  ngOnInit(): void {
  }
}
