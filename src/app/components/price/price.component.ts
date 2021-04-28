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

  service: DataService;

  usd: USD;

  constructor(private dataService: DataService) {
      this.service = dataService;
  }

  async ngOnInit(): Promise<void> {
    this.usd = await this.dataService.getUsdCur();
  }

}
