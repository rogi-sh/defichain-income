import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MatomoTracker} from 'ngx-matomo-v9';
import { ActivatedRoute } from '@angular/router';
import { Pool } from '@interfaces/Dex';
declare const TradingView: any;

@Component({
  selector: 'app-dfi-statistics',
  templateUrl: './dfi-statistics.component.html',
})
export class DfiStatisticsComponent implements OnInit, AfterViewInit {

  @Input()
  lang: string;

  // Stocks
  @Input()
  stocksPools!: Array<Pool>;

  coinpaprikaCurrency = 'USD';
  coinpaprikaCurrencyKey = 'coinpaprikaCurrencyKey';

  constructor(private matomoTracker: MatomoTracker,
              private route: ActivatedRoute) { }

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

  getToken(): Array<Pool> {
    return this.stocksPools.filter(a => a.tokenASymbol !== 'DUSD' && a.tokenASymbol !== 'csETH');
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
        return 'KUCOIN:DFIBTC';
      }
      case 'USDT':  {
        return 'KUCOIN:DFIUSDT';
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
      case 'Bitcoin': {
        return 'BINANCE:BTCUSDT';
      }
      case 'Ethereum': {
        return 'BINANCE:ETHUSDT';
      }
      case 'Litecoin': {
        return 'BINANCE:LTCUSDT';
      }
      case 'BitcoinCash': {
        return 'BINANCE:BCHUSDT';
      }
      case 'Doge': {
        return 'BINANCE:DOGEUSDT';
      }
      case 'Solana': {
        return 'BINANCE:SOLUSDT';
      }
      case 'Polygon': {
        return 'BINANCE:MATICUSDT';
      }
      case 'Polkadot': {
        return 'BINANCE:DOTUSDT';
      }
      case 'Sui': {
        return 'BINANCE:SUIUSDT';
      }
      case 'CryptoFranc': {
        return 'XCHFUSDT';
      }
      default:  {
        return this.coinpaprikaCurrency;
      }
    }
  }

  ngAfterViewInit(): void {
    this.generateChart();
  }

  getSelectedLanguage(): string {
    switch (this.lang) {
      case 'de':
        return 'de_DE';
      default:
        return this.lang;
    }
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
        locale: this.getSelectedLanguage(),
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        withdateranges: true,
        allow_symbol_change: true,
        container_id: 'tradingview_59a11'
      }
    );
  }
}
