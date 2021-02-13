import {Component, Input, OnInit} from '@angular/core';
import {Outcome, Pool} from '../../interface/Dex';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.css']
})
export class EarningComponent implements OnInit {

  @Input()
  out: Outcome;

  @Input()
  poolBtc: Pool;

  @Input()
  usdToEur: number;

  @Input()
  usdToChf: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  // get income of pool
  getOutcomeOfPoolPerMinUsd(out: Outcome): number {
    return out.dfiPerMin * this.poolBtc?.priceB;
  }

  getOutcomeOfPoolPerHourUsd(out: Outcome): number {
    return out.dfiPerHour * this.poolBtc?.priceB;
  }

  getOutcomeOfPoolPerDayUsd(out: Outcome): number {
    return out.dfiPerDay * this.poolBtc?.priceB;
  }

  getOutcomeOfPoolPerWeekUsd(out: Outcome): number {
    return out.dfiPerWeek * this.poolBtc?.priceB;
  }

  getOutcomeOfPoolPerMonthUsd(out: Outcome): number {
    return out.dfiPerMonth * this.poolBtc?.priceB;
  }

  getOutcomeOfPoolPerYearUsd(out: Outcome): number {
    return out.dfiPerYear * this.poolBtc?.priceB;
  }

}
