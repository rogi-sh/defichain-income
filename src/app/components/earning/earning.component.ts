import {Component, Input, OnInit} from '@angular/core';
import {Outcome, Pool} from '@interfaces/Dex';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.component.html',
  styleUrls: ['./earning.component.css']
})
export class EarningComponent implements OnInit {

  @Input()
  out: Outcome;

  @Input()
  pool: Pool;

  @Input()
  fiat: string;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  showReducedByFees: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  // get income of pool
  getOutcomeOfPoolPerMinUsd(out: Outcome): number {
    return out?.dfiPerMin * this.pool?.priceB;
  }

  getOutcomeOfPoolPerHourUsd(out: Outcome): number {
    return out?.dfiPerHour * this.pool?.priceB;
  }

  getOutcomeOfPoolPerDayUsd(out: Outcome): number {
    return out?.dfiPerDay * this.pool?.priceB;
  }

  getOutcomeOfPoolPerWeekUsd(out: Outcome): number {
    return out?.dfiPerWeek * this.pool?.priceB;
  }

  getOutcomeOfPoolPerMonthUsd(out: Outcome): number {
    return out?.dfiPerMonth * this.pool?.priceB;
  }

  getOutcomeOfPoolPerMonthDfi(out: Outcome, cost: number): number {
    return out?.dfiPerMonth * (1-cost);
  }

  getOutcomeOfPoolPerYearUsd(out: Outcome): number {
    return out?.dfiPerYear * this.pool?.priceB;
  }

}
