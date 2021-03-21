import { Component, OnInit } from '@angular/core';
import {MatomoTracker} from 'ngx-matomo';

@Component({
  selector: 'app-dfi-statistics',
  templateUrl: './dfi-statistics.component.html',
  styleUrls: ['./dfi-statistics.component.css']
})
export class DfiStatisticsComponent implements OnInit {

  coinpaprikaCurrency = 'USD';
  coinpaprikaCurrencyKey = 'coinpaprikaCurrencyKey';

  constructor(private matomoTracker: MatomoTracker) { }

  ngOnInit(): void {
    if (localStorage.getItem(this.coinpaprikaCurrencyKey) !== null) {
      this.coinpaprikaCurrency = localStorage.getItem(this.coinpaprikaCurrencyKey);
    }
  }

  onChangeCPCurrency(newValue: string): void {
    this.coinpaprikaCurrency = newValue;
    this.matomoTracker.trackEvent('Klick', 'Change CP Currency', newValue);

    localStorage.setItem(this.coinpaprikaCurrencyKey, newValue);
    // for coinpaprika
    window.location.reload();
  }

}
