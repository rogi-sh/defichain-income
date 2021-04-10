import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input()
  type: 'text' | 'number' = 'text';

  @Input() inputModel: string;
  @Output() inputModelChange = new EventEmitter<string>();
  
  @Input()
  handleChange: Function;

  @Input()
  label: string = '';

  @Input()
  name: string = '';
  
  @Input()
  required: boolean = false;

  @Input()
  min?: number = null;

  @Input()
  max?: number = null;

  @Input()
  step?: number = null;

  constructor() {}

  ngOnInit(): void {}
}
