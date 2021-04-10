import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
})
export class IconComponent implements OnInit {
  @Input()
  name: string;

  constructor() { }

  ngOnInit(): void {

  }

}
