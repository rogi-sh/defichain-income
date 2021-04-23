import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '@services/data.service';
import {USD} from '@interfaces/Data';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html'
})
export class PriceComponent implements OnInit {

  @Input()
  usdPrice!: number;

  @Input()
  fiat!: string;

  usd: USD;

  constructor(private dataService: DataService) {

    this.usd = this.dataService.getUsdCur();

  }

  ngOnInit(): void {

  }

}
