import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MatomoTracker} from 'ngx-matomo-v9';
declare const TradingView: any;

@Component({
  selector: 'app-dfi-statistics',
  templateUrl: './dfi-statistics.component.html',
  styleUrls: ['./dfi-statistics.component.css']
})
export class DfiStatisticsComponent implements OnInit, AfterViewInit {
  @Input()
  lang: string

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

    this.generateChart();
  }

  getPair(): string {
    switch (this.coinpaprikaCurrency) {

      case 'USD':  {
        return 'BITTREX:DFIUSD';
      }
      case 'EUR':  {
        return 'BITTREX:DFIUSD/KRAKEN:EURUSD';
      }
      case 'CHF':  {
        return 'BITTREX:DFIUSD/CHFUSD';
      }
      case 'GBP':  {
        return 'BITTREX:DFIUSD/GBPUSD';
      }
      case 'BTC':  {
        return 'BITTREX:DFIUSDT/BTCUSDT';
      }
      case 'USDT':  {
        return 'BITTREX:DFIUSDT';
      }
      case 'LTC':  {
        return 'BITTREX:DFIUSDT/BITTREX:LTCUSDT';
      }
      case 'ETH':  {
        return 'BITTREX:DFIUSDT/BITTREX:ETHUSDT';
      }
      case 'BCH':  {
        return 'BITTREX:DFIUSDT/BITTREX:BCHUSDT';
      }
      case 'DOGE':  {
        return 'BITTREX:DFIUSDT/BITTREX:DOGEUSDT';
      }
    }
  }

  ngAfterViewInit(): void {
    this.generateChart();
  }

  private generateChart(): void {
    // tslint:disable-next-line:no-unused-expression
    new TradingView.widget(
      {
        width: '100%',
        height: '100%',
        symbol: this.getPair(),
        interval: '30',
        timezone: 'Europe/Berlin',
        theme: localStorage.getItem('theme') || 'light',
        style: '1',
        locale: this.lang,
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        withdateranges: true,
        allow_symbol_change: true,
        container_id: 'tradingview_59a11'
      }
    );
  }
}
