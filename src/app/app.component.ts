import {Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Outcome, OutcomeStaking, Pool, PoolBtcOut, PoolDogeOut, PoolEthOut, PoolLtcOut, PoolUsdtOut} from '../interface/Dex';
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
  dfiProBlockDoge = 1;
  blocktimeInS = 37;
  usdToEur = 0.82;
  usdToChf = 0.89;
  usdToGbp = 0.72;
  fiat = 'USD';
  details = 'Staking';
  fiatKey = 'fiatKey';
  detailsKey = 'detailsKey';

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

  // DOGE Pool
  dogeInDogePoolKey = 'dogeInDogePoolKey';
  doge = 10;
  dfiInDogePool = 1000;
  dfiInDogePoolKey = 'dfiInDogePoolKey';

  // Staking infos
  dfiInStakingKey = 'dfiInStaking';
  dfiInStaking = 11050;
  stakingApy = 37;


  // staking target return
  stakingNeededForAimReturnMin = 0;
  aimReturnMin = 0;

  stakingNeededForAimReturnHour = 0;
  aimReturnHour = 0;

  stakingNeededForAimReturnDay = 0;
  aimReturnDay = 0;

  stakingNeededForAimReturnMonth = 0;
  aimReturnMonth = 0;

  // lm  pool target return
  poolLmCalculationTargetReturn = 'BTC';
  dfiNeededForAimReturnMinPool = 0;
  btcNeededForAimReturnMinPool = 0;
  anteilNeededForAimReturnMinPool = 0;
  aimReturnMinPool = 0;
  targetReturnLMMin = 0;

  dfiNeededForAimReturnHourPool = 0;
  btcNeededForAimReturnHourPool = 0;
  anteilNeededForAimReturnHourPool = 0;
  aimReturnHourPool = 0;
  targetReturnLMHour = 0;

  dfiNeededForAimReturnDayPool = 0;
  btcNeededForAimReturnDayPool = 0;
  anteilNeededForAimReturnDayPool = 0;
  aimReturnDayPool = 0;
  targetReturnLMDay = 0;

  dfiNeededForAimReturnMonthPool = 0;
  btcNeededForAimReturnMonthPool = 0;
  anteilNeededForAimReturnMonthPool = 0;
  aimReturnMonthPool = 0;
  targetReturnLMMonth = 0;

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

  poolDoge: Pool;
  poolDogeOut: PoolDogeOut = new PoolDogeOut();
  anteilAmPoolDoge: number;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();

  constructor(private dexService: Dex) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(this.fiatKey) !== null) {
      this.fiat = localStorage.getItem(this.fiatKey);
    }
    if (localStorage.getItem(this.detailsKey) !== null) {
      this.details = localStorage.getItem(this.detailsKey);
    }
    this.loadLocalStorage();
    this.loadDex();
    setInterval(() => {
      console.log('Refresh ...');
      this.loadLocalStorage();
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
          this.poolDoge = dex.pools.find(x => x.poolPairId === '8');
          this.berechnePoolOutBtc();
          this.berechnePoolOutEth();
          this.berechnePoolOutUsdt();
          this.berechnePoolOutLtc();
          this.berechnePoolOutDoge();
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

  berechnePoolOutDoge(): void {
    this.berechnePool('DOGE', this.poolDoge, this.poolDogeOut, this.dfiProBlockDoge);
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

    if (poolName === 'DOGE') {
      this.anteilAmPoolDoge =
        this.berechneAnteilAmPool(this.ltc, this.dfiInDogePool, reserveBNumber, reserveANumber, outcome, dfiProBlock);
    }

    outcome.dfiPerHour = outcome.dfiPerMin * 60;
    outcome.dfiPerDay = outcome.dfiPerHour * 24;
    outcome.dfiPerWeek = outcome.dfiPerDay * 7;
    outcome.dfiPerMonth = outcome.dfiPerDay * 30;
    outcome.dfiPerYear = outcome.dfiPerDay * 365;
  }

  private berechneAnteilAmPool(poolCoin: number, dfInPool: number, reserveBNumber: number, reserveANumber: number,
                               outcome: Outcome, dfiProBlock: number): number {
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
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMin + this.poolEthOut.dfiPerMin
      + this.poolUsdtOut.dfiPerMin + this.poolLtcOut.dfiPerMin + this.poolDogeOut.dfiPerMin;
    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolLtcOut.dfiPerHour + this.poolDogeOut.dfiPerHour;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolDogeOut.dfiPerDay;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek + this.poolDogeOut.dfiPerWeek;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth + this.poolDogeOut.dfiPerMonth;
    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolLtcOut.dfiPerYear + this.poolDogeOut.dfiPerYear;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking;
    this.stakingOut.dfiPerHour = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 8760) - this.dfiInStaking;
    this.stakingOut.dfiPerMin = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 525600) - this.dfiInStaking;
    this.stakingOut.dfiPerWeek = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 52.1429) - this.dfiInStaking;
    this.stakingOut.dfiPerMonth = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking;
    this.stakingOut.dfiPerYear = this.dfiInStaking * (1 + this.stakingApy / 100) - this.dfiInStaking;
  }

  isLocalStorageNotEmpty(key: string): boolean {
    return localStorage.getItem(key) !== 'null';
  }

  loadLocalStorage(): void {
    // Staking
    if (this.isLocalStorageNotEmpty(this.dfiInStakingKey)) {
      this.dfiInStaking = +localStorage.getItem(this.dfiInStakingKey);
    } else {
      this.dfiInStaking = 0;
    }
    // BTC POOL
    if (this.isLocalStorageNotEmpty(this.btcInBtcPoolKey)) {
      this.btc = +localStorage.getItem(this.btcInBtcPoolKey);
    } else {
      this.btc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.dfiInBtcPoolKey)) {
      this.dfiInBtcPool = +localStorage.getItem(this.dfiInBtcPoolKey);
    } else {
      this.dfiInBtcPool = 0;
    }
    // ETH POOL
    if (this.isLocalStorageNotEmpty(this.ethInEthPoolKey)) {
      this.eth = +localStorage.getItem(this.ethInEthPoolKey);
    } else {
      this.eth = 0;
    }
    if (this.isLocalStorageNotEmpty(this.dfiInEthPoolKey)) {
      this.dfiInEthPool = +localStorage.getItem(this.dfiInEthPoolKey);
    } else {
      this.dfiInEthPool = 0;
    }
    // USDT POOL
    if (this.isLocalStorageNotEmpty(this.usdtInUsdtPoolKey)) {
      this.usdt = +localStorage.getItem(this.usdtInUsdtPoolKey);
    } else {
      this.usdt = 0;
    }
    if (this.isLocalStorageNotEmpty(this.dfiInUsdtPoolKey)) {
      this.dfiInUsdtPool = +localStorage.getItem(this.dfiInUsdtPoolKey);
    } else {
      this.dfiInUsdtPool = 0;
    }
    // LTC POOL
    if (this.isLocalStorageNotEmpty(this.ltcInLtcPoolKey)) {
      this.ltc = +localStorage.getItem(this.ltcInLtcPoolKey);
    } else {
      this.ltc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.dfiInLtcPoolKey)) {
      this.dfiInLtcPool = +localStorage.getItem(this.dfiInLtcPoolKey);
    } else {
      this.dfiInLtcPool = 0;
    }
    // DOGE POOL
    if (this.isLocalStorageNotEmpty(this.dogeInDogePoolKey)) {
      this.doge = +localStorage.getItem(this.dogeInDogePoolKey);
    } else {
      this.doge = 0;
    }
    if (this.isLocalStorageNotEmpty(this.dfiInDogePoolKey)) {
      this.dfiInDogePool = +localStorage.getItem(this.dfiInDogePoolKey);
    } else {
      this.dfiInDogePool = 0;
    }
    // WALLET
    if (this.isLocalStorageNotEmpty(this.dfiInWalletKey)) {
      this.dfiInWallet = +localStorage.getItem(this.dfiInWalletKey);
    } else {
      this.dfiInWallet = 0;
    }

  }

  onChangeDfiStaking(newValue): void {
    this.dfiInStaking = newValue !== null ? newValue : 0;
    localStorage.setItem(this.dfiInStakingKey, newValue !== null ? newValue : 0);
    this.berechneStakingOut();
    this.buildDataForChart();
  }

  onChangeDfiWallet(newValue): void {
    this.dfiInWallet = newValue !== null ? newValue : 0;
    localStorage.setItem(this.dfiInWalletKey, newValue !== null ? newValue : 0);
    this.buildDataForChart();
  }

  onChangeAimReturnDay(newValue): void {
    const apyPerDay =  Math.pow(1 + this.stakingApy / 100, 1 / 365) - 1;
    this.stakingNeededForAimReturnDay = newValue / apyPerDay * (100 + apyPerDay) * (1 / (1 + apyPerDay / 100)) / 100;
  }

  onChangeAimReturnHour(newValue): void {
    const apyPerHour =  Math.pow(1 + this.stakingApy / 100, 1 / 8760) - 1;
    this.stakingNeededForAimReturnHour = newValue / apyPerHour * (100 + apyPerHour) * (1 / (1 + apyPerHour / 100)) / 100;
  }

  onChangeAimReturnMin(newValue): void {
    const apyPerMin =  Math.pow(1 + this.stakingApy / 100, 1 / 525600) - 1;
    this.stakingNeededForAimReturnMin = newValue / apyPerMin * (100 + apyPerMin) * (1 / (1 + apyPerMin / 100)) / 100;
  }

  onChangeAimReturnMonth(newValue): void {
    const apyPermonth =  Math.pow(1 + this.stakingApy / 100, 1 / 12) - 1;
    this.stakingNeededForAimReturnMonth = newValue / apyPermonth * (100 + apyPermonth) * (1 / (1 + apyPermonth / 100)) / 100;
  }

  onChangeAimReturnMinPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMMin = newValue;
    this.anteilNeededForAimReturnMinPool = newValue * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnMinPool = +pool.reserveB * this.anteilNeededForAimReturnMinPool / 100;
    this.btcNeededForAimReturnMinPool = +pool.reserveA * this.anteilNeededForAimReturnMinPool / 100;
  }


  onChangeAimReturnHourPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMHour = newValue;
    this.anteilNeededForAimReturnHourPool = newValue * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnHourPool = +pool.reserveB * this.anteilNeededForAimReturnHourPool / 100;
    this.btcNeededForAimReturnHourPool = +pool.reserveA * this.anteilNeededForAimReturnHourPool / 100;
  }

  onChangeAimReturnDayPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMDay = newValue;
    this.anteilNeededForAimReturnDayPool = newValue / 60 / 24  * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnDayPool = +pool.reserveB * this.anteilNeededForAimReturnDayPool / 100;
    this.btcNeededForAimReturnDayPool = +pool.reserveA * this.anteilNeededForAimReturnDayPool / 100;
  }

  onChangeAimReturnMonthPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMMonth = newValue;
    this.anteilNeededForAimReturnMonthPool = newValue / 60 / 24 / 30  * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnMonthPool = +pool.reserveB * this.anteilNeededForAimReturnMonthPool / 100;
    this.btcNeededForAimReturnMonthPool = +pool.reserveA * this.anteilNeededForAimReturnMonthPool / 100;
  }

  private getCorrectPoolAndReward(): any {
    let pool = null;
    let dfiPerBlock = null;
    if (this.poolLmCalculationTargetReturn === 'BTC') {
      pool = this.poolBtc;
      dfiPerBlock = this.dfiProBlockBtc;
    } else if (this.poolLmCalculationTargetReturn === 'ETH') {
      pool = this.poolEth;
      dfiPerBlock = this.dfiProBlockEth;
    } else if (this.poolLmCalculationTargetReturn === 'LTC') {
      pool = this.poolLtc;
      dfiPerBlock = this.dfiProBlockLtc;
    } else if (this.poolLmCalculationTargetReturn === 'DOGE') {
      pool = this.poolDoge;
      dfiPerBlock = this.dfiProBlockDoge;
    } else {
      pool = this.poolUsdt;
      dfiPerBlock = this.dfiProBlockUsdt;

    }
    return {pool, dfiPerBlock};
  }

  onChangeBtcBtcPool(newValue): void {
    this.btc = newValue;
    localStorage.setItem(this.btcInBtcPoolKey, newValue);
    this.berechnePoolOutBtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeEthEthPool(newValue): void {
    this.eth = newValue;
    localStorage.setItem(this.ethInEthPoolKey, newValue);
    this.berechnePoolOutEth();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeUsdtUsdtPool(newValue): void {
    this.usdt = newValue;
    localStorage.setItem(this.usdtInUsdtPoolKey, newValue);
    this.berechnePoolOutUsdt();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeLtcLtcPool(newValue): void {
    this.ltc = newValue;
    localStorage.setItem(this.ltcInLtcPoolKey, newValue);
    this.berechnePoolOutLtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDogeDogePool(newValue): void {
    this.doge = newValue;
    localStorage.setItem(this.dogeInDogePoolKey, newValue);
    this.berechnePoolOutDoge();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  // DFI in POOLS
  onChangeDfiBtcPool(newValue): void {
    this.dfiInBtcPool = newValue;
    localStorage.setItem(this.dfiInBtcPoolKey, newValue);
    this.berechnePoolOutBtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiEthPool(newValue): void {
    this.dfiInEthPool = newValue;
    localStorage.setItem(this.dfiInEthPoolKey, newValue);
    this.berechnePoolOutEth();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiUsdtPool(newValue): void {
    this.dfiInUsdtPool = newValue;
    localStorage.setItem(this.dfiInUsdtPoolKey, newValue);
    this.berechnePoolOutUsdt();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiLtcPool(newValue): void {
    this.dfiInLtcPool = newValue;
    localStorage.setItem(this.dfiInLtcPoolKey, newValue);
    this.berechnePoolOutLtc();
    this.berechnePoolOut();
    this.buildDataForChart();
  }

  onChangeDfiDogePool(newValue): void {
    this.dfiInDogePool = newValue;
    localStorage.setItem(this.dfiInDogePoolKey, newValue);
    this.berechnePoolOutDoge();
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

    const dataDoge = new Data();
    dataDoge.name = 'DOGE';
    dataDoge.value = this.getDogeValueUsd();

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd();

    this.chartOptions = {
      series: [
        +dataBtc.value.toFixed(1),
        +dataEth.value.toFixed(1),
        +dataUsdt.value.toFixed(1),
        +dataLtc.value.toFixed(1),
        +dataDoge.value.toFixed(1),
        +dataDfi.value.toFixed(1)],

      labels: ['BTC ' + this.getAnteilPortfolioForChart(dataBtc, allValue) + '%',
        'ETH ' + this.getAnteilPortfolioForChart(dataEth, allValue) + '%',
        'USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue)  + '%',
        'LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue)  + '%',
        'DOGE ' + this.getAnteilPortfolioForChart(dataDoge, allValue)  + '%',
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

  private getAnteilPortfolioForChart(data: Data, allValue: number): string {
    return (data.value / allValue * 100).toFixed(1);
  }

  onChangeFiat(newValue: string): void {
    this.fiat = newValue;
    localStorage.setItem(this.fiatKey, newValue);
  }

  onChangeLmCalculationTargetPool(newValue: string): void {
    this.poolLmCalculationTargetReturn = newValue;
    this.onChangeAimReturnMinPool(this.targetReturnLMMin);
    this.onChangeAimReturnHourPool(this.targetReturnLMHour);
    this.onChangeAimReturnDayPool(this.targetReturnLMDay);
    this.onChangeAimReturnMonthPool(this.targetReturnLMMonth);
  }

  onChangeDetails(newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getDfiValueUsd();
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

  getDogeValueUsd(): number {
    return this.doge * this.poolDoge?.priceA;
  }

  getDfiCount(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool + this.dfiInDogePool + this.dfiInStaking + this.dfiInWallet;
  }

  getDfiCountIncome(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool  + this.dfiInLtcPool + this.dfiInDogePool + this.dfiInStaking;
  }

  getDfiCountLM(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool  + this.dfiInLtcPool + this.dfiInDogePool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getDfiCountWalletUsd(): number {
    return this.dfiInWallet * this.poolBtc?.priceB;
  }

  getAnteilWalletOfAllValue(): number {
    return this.getDfiCountWalletUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd() + this.getUsdtValueUsd() + this.getDogeValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd() + this.getUsdtValueUsd() + this.getDogeValueUsd() ;
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking *  this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool + this.dfiInDogePool;
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

  getAnteilStakingOfIncome(): number {
     return this.stakingOut.dfiPerYear / (this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear) * 100;
  }

  getAnteilLMOfIncome(): number {
    return this.poolOut.dfiPerYear / (this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear) * 100;
  }

  getAllPoolDfIncome(): number {
    return this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolUsdtOut.dfiPerDay + this.poolDogeOut.dfiPerDay;
  }

  getAnteilBTCPoolAnGesamtLM(): number {
    return this.poolBtcOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

  getAnteilETHPoolAnGesamtLM(): number {
    return this.poolEthOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

  getAnteilLTCPoolAnGesamtLM(): number {
    return this.poolLtcOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

  getAnteilUSDTPoolAnGesamtLM(): number {
    return this.poolUsdtOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

  getAnteilDogePoolAnGesamtLM(): number {
    return this.poolDogeOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

}
