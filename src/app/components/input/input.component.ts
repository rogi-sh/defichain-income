import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input()
  type: 'text' | 'number' = 'text';

  @Input()
  value: string | number = null;

  @Input()
  label: string;

  @Input()
  name: string;
  
  @Input()
  required: boolean = false;

  @Input()
  handleInput: Function;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }
}
