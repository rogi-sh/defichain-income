import {Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Outcome, OutcomeStaking, Pool, PoolBtcOut, PoolDogeOut, PoolEthOut, PoolLtcOut, PoolUsdtOut} from '../interface/Dex';
import {ChartOptions, Data, Wallet} from '../interface/Data';
import {ChartComponent} from 'ng-apexcharts';
import {environment} from '../environments/environment';
import {forkJoin} from 'rxjs';

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

  wallet: Wallet;

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
  btc = 0;
  dfiInBtcPool = 0;

  // ETH Pool
  eth = 0;
  dfiInEthPool = 0;

  // USDT Pool
  usdt = 0;
  dfiInUsdtPool = 0;

  // LTC Pool
  ltc = 0;
  dfiInLtcPool = 0;

  // DOGE Pool
  doge = 0;
  dfiInDogePool = 0;

  // Staking infos
  dfiInStakingKey = 'dfiInStaking';
  dfiInStaking = 0;
  stakingApy = 37;

  adresses = new Array<string>();
  adress = '';
  adressesKey = 'adressesKey';

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
    if (localStorage.getItem(this.adressesKey) !== null) {
      this.adresses = JSON.parse(localStorage.getItem(this.adressesKey));
    }
    this.loadLocalStorage();
    this.loadAllAccounts();
    this.loadDex();
    setInterval(() => {
      console.log('Refresh ...');
      this.loadLocalStorage();
      this.loadAllAccounts();
      this.loadDex();
    }, 1800000);
  }

  loadDex(): void {

    forkJoin([
      this.dexService.getDex(),
      this.dexService.getPoolDetail('5'),
      this.dexService.getPoolDetail('4'),
      this.dexService.getPoolDetail('6'),
      this.dexService.getPoolDetail('10'),
      this.dexService.getPoolDetail('8')
      ]

    ).subscribe((([dex, poolBtc, poolEth, poolUsdt, poolLtc, poolDoge]: [DexInfo, Pool, Pool, Pool, Pool, Pool]) => {
      this.dex = dex;
      this.poolBtc = dex.pools.find(x => x.poolPairId === '5');
      this.poolEth = dex.pools.find(x => x.poolPairId === '4');
      this.poolUsdt = dex.pools.find(x => x.poolPairId === '6');
      this.poolLtc = dex.pools.find(x => x.poolPairId === '10');
      this.poolDoge = dex.pools.find(x => x.poolPairId === '8');

      this.poolBtc.totalLiquidityLpToken = +poolBtc.totalLiquidityLpToken;
      this.berechnePoolOutBtc();

      this.poolEth.totalLiquidityLpToken = +poolEth.totalLiquidityLpToken;
      this.berechnePoolOutEth();

      this.poolUsdt.totalLiquidityLpToken = +poolUsdt.totalLiquidityLpToken;
      this.berechnePoolOutUsdt();

      this.poolLtc.totalLiquidityLpToken = +poolLtc.totalLiquidityLpToken;
      this.berechnePoolOutLtc();

      this.poolDoge.totalLiquidityLpToken = +poolDoge.totalLiquidityLpToken;
      this.berechnePoolOutDoge();

      this.berechneStakingOut();
      this.berechnePoolOut();
      this.buildDataForChart();
    }));

  }

  loadAllAccounts(): void {
    this.wallet = new Wallet();
    this.dfiInWallet = 0;
    for (let ad of this.adresses) {
      this.loadAccountDetails(ad);
    }

  }

  loadAccountDetails(adress: string): void {
    this.dexService.getAdressDetail(adress).subscribe(
      balances => {
        for (let b of balances) {
          this.addToWallet(b);
        }
      },
      err => {
        console.error(err);
      });
  }

  addToWallet(walletItem: string) {
    const splitted = walletItem.split('@');
    switch (splitted[1]) {
      case 'DFI': {
        this.dfiInWallet += +splitted[0];
        this.wallet.dfi += +splitted[0];
        break;
      }
      case 'BTC': {
        this.wallet.btc += +splitted[0];
        break;
      }
      case 'ETH': {
        this.wallet.eth += +splitted[0];
        break;
      }
      case 'LTC': {
        this.wallet.ltc += +splitted[0];
        break;
      }
      case 'DOGE': {
        this.wallet.doge += +splitted[0];
        break;
      }
      case 'USDT': {
        this.wallet.usdt += +splitted[0];
        break;
      }
      case 'BTC-DFI': {
        this.wallet.btcdfi += +splitted[0];
        break;
      }
      case 'ETH-DFI': {
        this.wallet.ethdfi += +splitted[0];
        break;
      }
      case 'LTC-DFI': {
        this.wallet.ltcdfi += +splitted[0];
        break;
      }
      case 'DOGE-DFI': {
        this.wallet.dogedfi += +splitted[0];
        break;
      }
      case 'USDT-DFI': {
        this.wallet.usdtdfi += +splitted[0];
        break;
      }
      default: {
        break;
      }
    }
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

    if (poolName === 'BTC') {
      this.anteilAmPoolBtc = this.berechneAnteilAmPool(this.wallet.btcdfi, pool, outcome, dfiProBlock);
      this.btc = this.anteilAmPoolBtc * +pool.reserveA / 100;
      this.dfiInBtcPool = this.anteilAmPoolBtc * +pool.reserveB / 100;
    }
    if (poolName === 'ETH') {
      this.anteilAmPoolEth = this.berechneAnteilAmPool(this.wallet.ethdfi, pool, outcome, dfiProBlock);
      this.eth = this.anteilAmPoolEth * +pool.reserveA / 100;
      this.dfiInEthPool = this.anteilAmPoolEth * +pool.reserveB / 100;
    }
    if (poolName === 'USDT') {
      this.anteilAmPoolUsdt = this.berechneAnteilAmPool(this.wallet.usdtdfi, pool, outcome, dfiProBlock);
      this.usdt = this.anteilAmPoolUsdt * +pool.reserveA / 100;
      this.dfiInUsdtPool = this.anteilAmPoolUsdt * +pool.reserveB / 100;
    }
    if (poolName === 'LTC') {
      this.anteilAmPoolLtc = this.berechneAnteilAmPool(this.wallet.ltcdfi, pool, outcome, dfiProBlock);
      this.ltc = this.anteilAmPoolLtc * +pool.reserveA / 100;
      this.dfiInLtcPool = this.anteilAmPoolLtc * +pool.reserveB / 100;
    }
    if (poolName === 'DOGE') {
      this.anteilAmPoolDoge = this.berechneAnteilAmPool(this.wallet.dogedfi, pool, outcome, dfiProBlock);
      this.doge = this.anteilAmPoolDoge * +pool.reserveA / 100;
      this.dfiInDogePool = this.anteilAmPoolDoge * +pool.reserveB / 100;
    }

    outcome.dfiPerHour = outcome.dfiPerMin * 60;
    outcome.dfiPerDay = outcome.dfiPerHour * 24;
    outcome.dfiPerWeek = outcome.dfiPerDay * 7;
    outcome.dfiPerMonth = outcome.dfiPerDay * 30;
    outcome.dfiPerYear = outcome.dfiPerDay * 365;
  }

  private berechneAnteilAmPool(lpToken: number, pool: Pool, outcome: Outcome, dfiProBlock: number): number {
    const anteilAmPool = lpToken / pool.totalLiquidityLpToken * 100;
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
    const apyPerDay = Math.pow(1 + this.stakingApy / 100, 1 / 365) - 1;
    this.stakingNeededForAimReturnDay = newValue / apyPerDay * (100 + apyPerDay) * (1 / (1 + apyPerDay / 100)) / 100;
  }

  onChangeAimReturnHour(newValue): void {
    const apyPerHour = Math.pow(1 + this.stakingApy / 100, 1 / 8760) - 1;
    this.stakingNeededForAimReturnHour = newValue / apyPerHour * (100 + apyPerHour) * (1 / (1 + apyPerHour / 100)) / 100;
  }

  onChangeAimReturnMin(newValue): void {
    const apyPerMin = Math.pow(1 + this.stakingApy / 100, 1 / 525600) - 1;
    this.stakingNeededForAimReturnMin = newValue / apyPerMin * (100 + apyPerMin) * (1 / (1 + apyPerMin / 100)) / 100;
  }

  onChangeAimReturnMonth(newValue): void {
    const apyPermonth = Math.pow(1 + this.stakingApy / 100, 1 / 12) - 1;
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
    this.anteilNeededForAimReturnDayPool = newValue / 60 / 24 * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnDayPool = +pool.reserveB * this.anteilNeededForAimReturnDayPool / 100;
    this.btcNeededForAimReturnDayPool = +pool.reserveA * this.anteilNeededForAimReturnDayPool / 100;
  }

  onChangeAimReturnMonthPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMMonth = newValue;
    this.anteilNeededForAimReturnMonthPool = newValue / 60 / 24 / 30 * 100 / this.getDfiPerMin(dfiPerBlock);
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
        'USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue) + '%',
        'LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue) + '%',
        'DOGE ' + this.getAnteilPortfolioForChart(dataDoge, allValue) + '%',
        'DFI ' + this.getAnteilPortfolioForChart(dataDfi, allValue) + '%'],
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
    return (this.btc + this.wallet.btc) * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.eth + this.wallet.eth) * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.usdt + this.wallet.usdt) * this.poolUsdt?.priceA;
  }

  getLtcValueUsd(): number {
    return (this.ltc + this.wallet.ltc) * this.poolLtc?.priceA;
  }

  getDogeValueUsd(): number {
    return (this.doge + this.wallet.doge) * this.poolDoge?.priceA;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool
      + this.dfiInDogePool + this.dfiInStaking + this.dfiInWallet;
  }

  getDfiCountIncome(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool + this.dfiInDogePool + this.dfiInStaking;
  }

  getDfiCountLM(): number {
    return this.dfiInEthPool + this.dfiInBtcPool + this.dfiInUsdtPool + this.dfiInLtcPool + this.dfiInDogePool;
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
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd() + this.getUsdtValueUsd() + this.getDogeValueUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
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

  addAdress(): void {
    this.adresses.push(this.adress);
    localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
    this.adress = '';
    this.loadAllAccounts();
  }

  deleteAdress(adress: string): void {
    const index = this.adresses.indexOf(adress, 0);
    if (index > -1) {
      this.adresses.splice(index, 1);
      localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
      this.loadAllAccounts();
    }

  }

}
