import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html'
})
export class PriceComponent implements OnInit {

  @Input()
  usdPrice!: number;

  @Input()
  fiat!: string;

  usdToEur = 0.832245;
  usdToChf = 0.9171;
  usdToGbp = 0.722715;
  usdToAud = 1.29799;
  usdToRub = 75.5359;
  usdToJpy = 107.939;
  usdToCad = 1.25031;
  usdToCny = 6.4913;
  usdToSgd = 1.3296;

  constructor() { }

  ngOnInit(): void {
  }

}
