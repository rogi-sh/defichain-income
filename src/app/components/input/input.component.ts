import {Component, OnChanges, OnInit, } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnChanges {
  public value: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(value): void {
    this.value = value
  }
}
