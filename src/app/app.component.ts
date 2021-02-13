import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Pool, PoolBtcOut, PoolEthOut, PoolOut, PoolUsdtOut, StakingOut} from '../interface/Dex';
import {ChartOptions, Data} from '../interface/Data';
import {ChartComponent} from 'ng-apexcharts';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  title = 'defichain-income';
  env = environment;

  // fixed variables
  dfiProBlockBtc = 80;
  dfiProBlockEth = 15;
  dfiProBlockUsdt = 5;
  blocktimeInS = 37;
  usdToEur = 0.82;
  usdToChf = 0.89;
  fiat = 'USD';
  fiatKey = 'fiatKey';

  // User Infos
  // BTC Pool
  btcInBtcPoolKey = 'btcInBtcPoolKey';
  btc = 2.17;
  dfiInBtcPoolKey = 'dfiInBtcPoolKey';
  dfiInBtcPool = 28282.49;
  // ETH Pool
  ethInEthPoolKey = 'ethInEthPoolKey';
  eth = 14.34;
  dfiInEthPool = 7070.63;
  dfiInEthPoolKey = 'dfiInEthPoolKey';
  // USDT Pool
  usdtInUsdtPoolKey = 'usdtInUsdtPoolKey';
  usdt = 3000;
  dfiInUsdtPool = 1000;
  dfiInUsdtPoolKey = 'dfiInUsdtPoolKey';

  // Staking infos
  dfiInStakingKey = 'dfiInStaking';
  dfiInStaking = 11050;
  stakingApy = 37;

  // Wallet
  dfiInWallet = 0;
  dfiInWalletKey = 'dfiInWalletKey';

  dex: DexInfo;

  poolBtc: Pool;
  poolBtcOut: PoolBtcOut = new PoolBtcOut();
  anteilAmPoolBtc: number;

  poolEthOut: PoolEthOut = new PoolEthOut();
  poolEth: Pool;
  anteilAmPoolEth: number;

  poolUsdtOut: PoolUsdtOut = new PoolUsdtOut();
  poolUsdt: Pool;
  anteilAmPoolUsdt: number;

  poolOut: PoolOut = new PoolOut();
  stakingOut: StakingOut = new StakingOut();

  constructor(private dexService: Dex) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(this.fiatKey) !== null) {
      this.fiat = localStorage.getItem(this.fiatKey);
    }
    this.loadLocalStorage();
    this.loadDex();
    setInterval(() => {
      console.log('Refresh ...');
      this.loadDex();
    }, 60000);
  }

  loadDex(): void {
    this
      .dexService
      .getDex()
      .subscribe(
        dex => {
          this.dex = dex;
          this.poolBtc = dex.pools.find(x => x.poolPairId === '5');
          this.poolEth = dex.pools.find(x => x.poolPairId === '4');
          this.poolUsdt = dex.pools.find(x => x.poolPairId === '6');
          this.berechnePoolOutBtc();
          this.berechnePoolOutEth();
          this.berechnePoolOutUsdt();
          this.berechnePoolOut();
          this.berechneStakingOut();
          this.buildDataForChart();
        },
        err => {
          console.error(err);
        });
  }

  getPool(id: string): Pool {
    return this.dex.pools.find(x => x.poolPairId === id);
  }

  berechnePoolOutBtc(): void {
    const reserveANumber = +this.poolBtc?.reserveA;
    const reserveBNumber = +this.poolBtc?.reserveB;
    const anteileBTC = this.btc / reserveANumber * 100;
    const anteileDFI = this.dfiInBtcPool / reserveBNumber * 100;
    this.anteilAmPoolBtc = (anteileBTC + anteileDFI) / 2;
    this.poolBtcOut.dfiPerMinBtc = this.dfiProBlockBtc / this.blocktimeInS * 60 * this.anteilAmPoolBtc / 100;
    this.poolBtcOut.dfiPerHourBtc = this.poolBtcOut.dfiPerMinBtc * 60;
    this.poolBtcOut.dfiPerDayBtc = this.poolBtcOut.dfiPerHourBtc * 24;
    this.poolBtcOut.dfiPerWeekBtc = this.poolBtcOut.dfiPerDayBtc * 7;
    this.poolBtcOut.dfiPerMonthBtc = this.poolBtcOut.dfiPerDayBtc * 30;
  }

  berechnePoolOutEth(): void {
    const reserveANumber = +this.poolEth?.reserveA;
    const reserveBNumber = +this.poolEth?.reserveB;
    const anteileETH = this.eth / reserveANumber * 100;
    const anteileDFI = this.dfiInEthPool / reserveBNumber * 100;
    this.anteilAmPoolEth = (anteileETH + anteileDFI) / 2;
    this.poolEthOut.dfiPerMinEth = this.dfiProBlockEth / this.blocktimeInS * 60 * this.anteilAmPoolEth / 100;
    this.poolEthOut.dfiPerHourEth = this.poolEthOut.dfiPerMinEth * 60;
    this.poolEthOut.dfiPerDayEth = this.poolEthOut.dfiPerHourEth * 24;
    this.poolEthOut.dfiPerWeekEth = this.poolEthOut.dfiPerDayEth * 7;
    this.poolEthOut.dfiPerMonthEth = this.poolEthOut.dfiPerDayEth * 30;
  }

  berechnePoolOutUsdt(): void {
    const reserveANumber = +this.poolUsdt?.reserveA;
    const reserveBNumber = +this.poolUsdt?.reserveB;
    const anteileUSDT = this.usdt / reserveANumber * 100;
    const anteileDFI = this.dfiInUsdtPool / reserveBNumber * 100;
    this.anteilAmPoolUsdt = (anteileUSDT + anteileDFI) / 2;
    this.poolUsdtOut.dfiPerMinUsdt = this.dfiProBlockUsdt / this.blocktimeInS * 60 * this.anteilAmPoolUsdt / 100;
    this.poolUsdtOut.dfiPerHourUsdt = this.poolUsdtOut.dfiPerMinUsdt * 60;
    this.poolUsdtOut.dfiPerDayUsdt = this.poolUsdtOut.dfiPerHourUsdt * 24;
    this.poolUsdtOut.dfiPerWeekUsdt = this.poolUsdtOut.dfiPerDayUsdt * 7;
    this.poolUsdtOut.dfiPerMonthUsdt = this.poolUsdtOut.dfiPerDayUsdt * 30;
  }

  berechnePoolOut(): void {
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMinBtc + this.poolEthOut.dfiPerMinEth + this.poolUsdtOut.dfiPerMinUsdt;
    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHourBtc + this.poolEthOut.dfiPerHourEth + this.poolUsdtOut.dfiPerHourUsdt;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDayBtc + this.poolEthOut.dfiPerDayEth + this.poolUsdtOut.dfiPerDayUsdt;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeekBtc + this.poolEthOut.dfiPerWeekEth + this.poolUsdtOut.dfiPerWeekUsdt;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonthBtc + this.poolEthOut.dfiPerMonthEth + this.poolUsdtOut.dfiPerMonthUsdt;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking;
    this.stakingOut.dfiPerHour = this.stakingOut.dfiPerDay / 24;
    this.stakingOut.dfiPerMin = this.stakingOut.dfiPerHour / 60;
    this.stakingOut.dfiPerWeek = this.stakingOut.dfiPerDay * 7;
    this.stakingOut.dfiPerMonth = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking;
  }

  loadLocalStorage(): void {
    // Staking
    if (localStorage.getItem(this.dfiInStakingKey) !== null) {
      this.dfiInStaking = +localStorage.getItem(this.dfiInStakingKey);
    }
    // BTC POOL
    if (localStorage.getItem(this.btcInBtcPoolKey) !== null) {
      this.btc = +localStorage.getItem(this.btcInBtcPoolKey);
    }
    if (localStorage.getItem(this.dfiInBtcPoolKey) !== null) {
      this.dfiInBtcPool = +localStorage.getItem(this.dfiInBtcPoolKey);
    }
    // ETH POOL
    if (localStorage.getItem(this.ethInEthPoolKey) !== null) {
      this.eth = +localStorage.getItem(this.ethInEthPoolKey);
    }
    if (localStorage.getItem(this.dfiInEthPoolKey) !== null) {
      this.dfiInEthPool = +localStorage.getItem(this.dfiInEthPoolKey);
    }
    // USDT POOL
    if (localStorage.getItem(this.usdtInUsdtPoolKey) !== null) {
      this.usdt = +localStorage.getItem(this.usdtInUsdtPoolKey);
    }
    if (localStorage.getItem(this.dfiInUsdtPoolKey) !== null) {
      this.dfiInUsdtPool = +localStorage.getItem(this.dfiInUsdtPoolKey);
    }
    // WALLET
    if (localStorage.getItem(this.dfiInWalletKey) !== null) {
      this.dfiInWallet = +localStorage.getItem(this.dfiInWalletKey);
    }

  }

  onChangeDfiStaking(newValue): void {
    localStorage.setItem(this.dfiInStakingKey, newValue);
    this.berechneStakingOut();
    this.buildDataForChart();
  }

  onChangeDfiWallet(newValue): void {
    localStorage.setItem(this.dfiInWalletKey, newValue);
    this.buildDataForChart();
  }

  onChangeBtcBtcPool(newValue): void {
    localStorage.setItem(this.btcInBtcPoolKey, newValue);
    this.berechnePoolOutBtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiBtcPool(newValue): void {
    localStorage.setItem(this.dfiInBtcPoolKey, newValue);
    this.berechnePoolOutBtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeEthEthPool(newValue): void {
    localStorage.setItem(this.ethInEthPoolKey, newValue);
    this.berechnePoolOutEth();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeUsdtUsdtPool(newValue): void {
    localStorage.setItem(this.usdtInUsdtPoolKey, newValue);
    this.berechnePoolOutUsdt();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiEthPool(newValue): void {
    localStorage.setItem(this.dfiInEthPoolKey, newValue);
    this.berechnePoolOutEth();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiUsdtPool(newValue): void {
    localStorage.setItem(this.dfiInUsdtPoolKey, newValue);
    this.berechnePoolOutUsdt();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  buildDataForChart(): void {

    const allValue = this.btc * this.poolBtc?.priceA + this.eth
      * this.poolEth?.priceA + this.usdt * this.poolUsdt?.priceA
      + (this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInStaking) * this.poolBtc?.priceB;

    const dataBtc = new Data();
    dataBtc.value = this.btc * this.poolBtc?.priceA;
    dataBtc.name = 'BTC';

    const dataEth = new Data();
    dataEth.name = 'ETH';
    dataEth.value = this.eth * this.poolEth?.priceA;

    const dataUsdt = new Data();
    dataUsdt.name = 'USDT';
    dataUsdt.value = this.usdt * this.poolUsdt?.priceA;

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = (this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInStaking + this.dfiInWallet)
      * this.poolBtc?.priceB;

    this.chartOptions = {
      series: [+(dataBtc.value / allValue * 100).toFixed(1),
        +(dataEth.value / allValue * 100).toFixed(1),
        +(dataUsdt.value / allValue * 100).toFixed(1),
        +(dataDfi.value / allValue * 100).toFixed(1)],
      labels: ['BTC %', 'ETH %', 'USDT %', 'DFI %'],
      chart: {
        width: 320,
        type: 'donut'
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'gradient'
      },
      legend: {
        formatter: function(val, opts) {
          if (opts.seriesIndex === 1) {
            return 'BTC ';
          }
          if (opts.seriesIndex === 2) {
            return 'ETH ' + (dataEth.value / allValue * 100).toFixed(1) + '%';
          }
          if (opts.seriesIndex === 3) {
            return 'USDT ' + (dataUsdt.value / allValue * 100).toFixed(1) + '%';
          }
          if (opts.seriesIndex === 4) {
            return 'DFI ' + (dataDfi.value / allValue * 100).toFixed(1) + '%';
          }

        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  onChangeFiat(newValue: string): void {
    this.fiat = newValue;
    localStorage.setItem(this.fiatKey, newValue);
  }
}
