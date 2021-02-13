import {Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Outcome, OutcomeStaking, Pool, PoolBtcOut, PoolEthOut, PoolLtcOut, PoolUsdtOut} from '../interface/Dex';
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
  dfiProBlockLtc = 2;
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
  // LTC Pool
  ltcInLtcPoolKey = 'ltcInLtcPoolKey';
  ltc = 10;
  dfiInLtcPool = 1000;
  dfiInLtcPoolKey = 'dfiInLtcPoolKey';

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

  poolLtcOut: PoolLtcOut = new PoolLtcOut();
  poolLtc: Pool;
  anteilAmPoolLtc: number;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();

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
          this.poolLtc = dex.pools.find(x => x.poolPairId === '10');
          this.berechnePoolOutBtc();
          this.berechnePoolOutEth();
          this.berechnePoolOutUsdt();
          this.berechnePoolOutLtc();
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
    this.berechnePool('BTC', this.poolBtc, this.poolBtcOut, this.dfiProBlockBtc);
  }

  berechnePoolOutEth(): void {
    this.berechnePool('ETH', this.poolEth, this.poolEthOut, this.dfiProBlockEth);
  }

  berechnePoolOutUsdt(): void {
    this.berechnePool('USDT', this.poolUsdt, this.poolUsdtOut, this.dfiProBlockUsdt);
  }

  berechnePoolOutLtc(): void {
    this.berechnePool('LTC', this.poolLtc, this.poolLtcOut, this.dfiProBlockLtc);
  }

  private berechnePool(poolName: string, pool: Pool, outcome: Outcome, dfiProBlock: number): void {
    const reserveANumber = +pool?.reserveA;
    const reserveBNumber = +pool?.reserveB;

    if (poolName === 'BTC') {
      this.anteilAmPoolBtc = this.berechneAnteilAmPool(this.btc, this.dfiInBtcPool, reserveBNumber, reserveANumber, outcome, dfiProBlock);
    }
    if (poolName === 'ETH') {
      this.anteilAmPoolEth = this.berechneAnteilAmPool(this.eth, this.dfiInEthPool, reserveBNumber, reserveANumber, outcome, dfiProBlock);
    }
    if (poolName === 'USDT') {
      this.anteilAmPoolUsdt =
        this.berechneAnteilAmPool(this.usdt, this.dfiInUsdtPool, reserveBNumber, reserveANumber, outcome, dfiProBlock);
    }
    if (poolName === 'LTC') {
      this.anteilAmPoolLtc =
        this.berechneAnteilAmPool(this.ltc, this.dfiInLtcPool, reserveBNumber, reserveANumber, outcome, dfiProBlock);
    }

    outcome.dfiPerHour = outcome.dfiPerMin * 60;
    outcome.dfiPerDay = outcome.dfiPerHour * 24;
    outcome.dfiPerWeek = outcome.dfiPerDay * 7;
    outcome.dfiPerMonth = outcome.dfiPerDay * 30;
    outcome.dfiPerYear = outcome.dfiPerDay * 365;
  }

  private berechneAnteilAmPool(poolCoin: number, dfInPool: number, reserveBNumber: number, reserveANumber: number, outcome: Outcome, dfiProBlock: number): number {
    const anteileDFI = dfInPool / reserveBNumber * 100;
    const anteile = poolCoin / reserveANumber * 100;
    const anteilAmPool = (anteile + anteileDFI) / 2;
    outcome.dfiPerMin = this.getDfiPerMin(dfiProBlock) * anteilAmPool / 100;
    return anteilAmPool;
  }

  private getDfiPerMin(dfiProBlock: number): number {
    return dfiProBlock / this.blocktimeInS * 60;
  }

  berechnePoolOut(): void {
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMin + this.poolEthOut.dfiPerMin + this.poolUsdtOut.dfiPerMin + this.poolLtcOut.dfiPerMin;
    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour + this.poolUsdtOut.dfiPerHour + this.poolLtcOut.dfiPerHour;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolUsdtOut.dfiPerDay + this.poolLtcOut.dfiPerDay;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek + this.poolUsdtOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth + this.poolUsdtOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth;
    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear + this.poolUsdtOut.dfiPerYear + this.poolLtcOut.dfiPerYear;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking;
    this.stakingOut.dfiPerHour = this.stakingOut.dfiPerDay / 24;
    this.stakingOut.dfiPerMin = this.stakingOut.dfiPerHour / 60;
    this.stakingOut.dfiPerWeek = this.stakingOut.dfiPerDay * 7;
    this.stakingOut.dfiPerMonth = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking;
    this.stakingOut.dfiPerYear = this.dfiInStaking * (1 + this.stakingApy / 100);
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
    // LTC POOL
    if (localStorage.getItem(this.ltcInLtcPoolKey) !== null) {
      this.ltc = +localStorage.getItem(this.ltcInLtcPoolKey);
    }
    if (localStorage.getItem(this.dfiInLtcPoolKey) !== null) {
      this.dfiInLtcPool = +localStorage.getItem(this.dfiInLtcPoolKey);
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

  onChangeLtcLtcPool(newValue): void {
    localStorage.setItem(this.ltcInLtcPoolKey, newValue);
    this.berechnePoolOutLtc();
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

  onChangeDfiLtcPool(newValue): void {
    localStorage.setItem(this.dfiInLtcPoolKey, newValue);
    this.berechnePoolOutLtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  buildDataForChart(): void {

    const allValue = this.getAllValuesUsdPrice();

    const dataBtc = new Data();
    dataBtc.value = this.getBtcValueUsd();
    dataBtc.name = 'BTC';

    const dataEth = new Data();
    dataEth.name = 'ETH';
    dataEth.value = this.getEthValueUsd();

    const dataUsdt = new Data();
    dataUsdt.name = 'USDT';
    dataUsdt.value = this.getUsdtValueUsd();

    const dataLtc = new Data();
    dataLtc.name = 'LTC';
    dataLtc.value = this.getLtcValueUsd();

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd();

    this.chartOptions = {
      series: [
        +dataBtc.value.toFixed(1),
        +dataEth.value.toFixed(1),
        +dataUsdt.value.toFixed(1),
        +dataLtc.value.toFixed(1),
        +dataDfi.value.toFixed(1)],

      labels: ['BTC ' + this.getAnteilPortfolioForChart(dataBtc, allValue) + '%',
        'ETH ' + this.getAnteilPortfolioForChart(dataEth, allValue) + '%',
        'USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue)  + '%',
        'LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue)  + '%',
        'DFI ' + this.getAnteilPortfolioForChart(dataDfi, allValue)  + '%'],
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
        // tslint:disable-next-line:only-arrow-functions typedef
        formatter(val, opts) {
       return '55';

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

  private getAnteilPortfolioForChart(dataEth: Data, allValue: number) {
    return (dataEth.value / allValue * 100).toFixed(1);
  }

  onChangeFiat(newValue: string): void {
    this.fiat = newValue;
    localStorage.setItem(this.fiatKey, newValue);
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getLtcValueUsd() + this.getDfiValueUsd();
  }

  getBtcValueUsd(): number {
    return this.btc * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return this.eth * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return this.usdt * this.poolUsdt?.priceA;
  }

  getLtcValueUsd(): number {
    return this.ltc * this.poolLtc?.priceA;
  }

  getDfiCount(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool + this.dfiInStaking + this.dfiInWallet;
  }

  getDfiCountIncome(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool  + this.dfiInLtcPool + this.dfiInStaking;
  }

  getDfiCountInLM(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool;
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getDfiIncomePerMin(): number {
    return this.stakingOut.dfiPerMin + this.poolOut.dfiPerMin;
  }

  getDfiIncomeValuePerMinUsd(): number {
    return this.getDfiIncomePerMin() * this.poolBtc?.priceB;
  }

  getDfiIncomePerHour(): number {
    return this.stakingOut.dfiPerHour + this.poolOut.dfiPerHour;
  }

  getDfiIncomeValuePerHourUsd(): number {
    return this.getDfiIncomePerHour() * this.poolBtc?.priceB;
  }

  getDfiIncomePerDay(): number {
    return this.stakingOut.dfiPerDay + this.poolOut.dfiPerDay;
  }

  getDfiIncomeValuePerDayUsd(): number {
    return this.getDfiIncomePerDay() * this.poolBtc?.priceB;
  }

  getDfiIncomePerWeek(): number {
    return this.stakingOut.dfiPerWeek + this.poolOut.dfiPerWeek;
  }

  getDfiIncomeValuePerWeekUsd(): number {
    return this.getDfiIncomePerWeek() * this.poolBtc?.priceB;
  }

  getDfiIncomePerMonth(): number {
    return this.stakingOut.dfiPerMonth + this.poolOut.dfiPerMonth;
  }

  getDfiIncomeValuePerMonthUsd(): number {
    return this.getDfiIncomePerMonth() * this.poolBtc?.priceB;
  }

  getDfiIncomePerYear(): number {
    return this.stakingOut.dfiPerYear + this.poolOut.dfiPerYear;
  }

  getDfiIncomeValuePerYearUsd(): number {
    return this.getDfiIncomePerYear() * this.poolBtc?.priceB;
  }

}
