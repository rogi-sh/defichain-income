import { Component, OnInit } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent implements OnInit {
  details = 'Calc';
  detailsKey = 'detailsKey';

  constructor(private matomoTracker: MatomoTracker) { }
  ngOnInit (): void {
  }

  onChangeDetails (newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
    this.matomoTracker.trackEvent('Klick', 'Change Details', newValue);
  }
}
