import {Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Outcome, OutcomeStaking, Pool, PoolBtcOut, PoolDogeOut, PoolEthOut, PoolLtcOut, PoolUsdtOut} from '../interface/Dex';
import {ChartOptions, Data, Wallet} from '../interface/Data';
import {ChartComponent} from 'ng-apexcharts';
import {environment} from '../environments/environment';
import {forkJoin} from 'rxjs';
import {CountdownComponent} from 'ngx-countdown';
// @ts-ignore
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild('cd', {static: true})
  private countdown: CountdownComponent;


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

  sCountdown = 300;
  sCountdownShow = 300;
  sCountdownKey = 'sCountdownKey';
  timer: Timer;

  autoLoadData = true;
  autoLoadDataKey = 'autoLoadDataKey';

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
    if (localStorage.getItem(this.sCountdownKey) !== null) {
      this.sCountdown = JSON.parse(localStorage.getItem(this.sCountdownKey));
      this.sCountdownShow = this.sCountdown;
    }
    if (localStorage.getItem(this.autoLoadDataKey) !== null) {
      this.autoLoadData = JSON.parse(localStorage.getItem(this.autoLoadDataKey));
    }
    // Staking
    if (this.isLocalStorageNotEmpty(this.dfiInStakingKey)) {
      this.dfiInStaking = +localStorage.getItem(this.dfiInStakingKey);
    } else {
      this.dfiInStaking = 0;
    }

    this.wallet = new Wallet();

    if (this.autoLoadData) {
      this.loadAllAccounts();
      this.loadDex();
    } else {
      this.loadLocalStorageForManuel();
      this.loadDexManuel();
    }

    this.countdown?.begin();
    this.timer = setInterval(() => {
      this.refresh();
    }, this.sCountdown * 1000);
  }

  private refresh(): void {
    if (this.autoLoadData) {
      console.log('Refresh autofunds ...');
      this.loadAllAccounts();
      this.loadDex();
    } else {
      console.log('Refresh manuel funds ...');
      this.wallet = new Wallet();
      this.loadLocalStorageForManuel();
      this.loadDexManuel();
    }
    this.countdown?.restart();
  }


  onChangeRefreshS(): void {
    localStorage.setItem(this.sCountdownKey, JSON.stringify(this.sCountdown));
    this.sCountdownShow = this.sCountdown;
    this.countdown?.restart();
    clearInterval(this.timer[Symbol.toPrimitive]);
    this.timer = setInterval(() => {
      this.refresh();
    }, this.sCountdown * 1000);
  }

  saveToggleAutoLoad(): void {
    localStorage.setItem(this.autoLoadDataKey, JSON.stringify(this.autoLoadData));
    this.refresh();
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
        }
      ),
      err => {
        this.loadDex();
        console.error('Fehler beim Load Dex Data' + err.toString());
      });

  }

  loadDexManuel(): void {
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

  loadAllAccounts(): void {
    // Wallet
    this.wallet = new Wallet();
    for (const ad of this.adresses) {
      this.loadAccountDetails(ad);
    }

  }

  loadAccountDetails(adress: string): void {
    this.dexService.getAdressDetail(adress).subscribe(
      balances => {
        for (const b of balances) {
          this.addToWallet(b);
        }
      },
      err => {
        console.error(err);
      });
  }

  addToWallet(walletItem: string): void {
    const splitted = walletItem.split('@');
    switch (splitted[1]) {
      case 'DFI': {
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
      if (this.autoLoadData) {
        this.anteilAmPoolBtc = this.berechneAnteilAmPool(this.wallet.btcdfi, pool, outcome, dfiProBlock);
        this.wallet.btcInBtcPool = this.anteilAmPoolBtc * +pool.reserveA / 100;
        this.wallet.dfiInBtcPool = this.anteilAmPoolBtc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolBtc =
          this.berechneAnteilAmPoolManuel(this.wallet.btcInBtcPool, this.wallet.dfiInBtcPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'ETH') {
      if (this.autoLoadData) {
        this.anteilAmPoolEth = this.berechneAnteilAmPool(this.wallet.ethdfi, pool, outcome, dfiProBlock);
        this.wallet.ethInEthPool = this.anteilAmPoolEth * +pool.reserveA / 100;
        this.wallet.dfiInEthPool = this.anteilAmPoolEth * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolEth =
          this.berechneAnteilAmPoolManuel(this.wallet.ethInEthPool, this.wallet.dfiInEthPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'USDT') {
      if (this.autoLoadData) {
        this.anteilAmPoolUsdt = this.berechneAnteilAmPool(this.wallet.usdtdfi, pool, outcome, dfiProBlock);
        this.wallet.usdtInUsdtPool = this.anteilAmPoolUsdt * +pool.reserveA / 100;
        this.wallet.dfiInUsdtPool = this.anteilAmPoolUsdt * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsdt =
          this.berechneAnteilAmPoolManuel(this.wallet.usdtInUsdtPool, this.wallet.dfiInUsdtPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'LTC') {
      if (this.autoLoadData) {
        this.anteilAmPoolLtc = this.berechneAnteilAmPool(this.wallet.ltcdfi, pool, outcome, dfiProBlock);
        this.wallet.ltcInLtcPool = this.anteilAmPoolLtc * +pool.reserveA / 100;
        this.wallet.dfiInLtcPool = this.anteilAmPoolLtc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolLtc =
          this.berechneAnteilAmPoolManuel(this.wallet.ltcInLtcPool, this.wallet.dfiInLtcPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'DOGE') {
      if (this.autoLoadData) {
        this.anteilAmPoolDoge = this.berechneAnteilAmPool(this.wallet.dogedfi, pool, outcome, dfiProBlock);
        this.wallet.dogeInDogePool = this.anteilAmPoolDoge * +pool.reserveA / 100;
        this.wallet.dfiInDogePool = this.anteilAmPoolDoge * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolDoge =
          this.berechneAnteilAmPoolManuel(this.wallet.dogeInDogePool, this.wallet.dfiInDogePool, pool, outcome, dfiProBlock);
      }

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

  private berechneAnteilAmPoolManuel(poolCoin: number, dfInPool: number, pool: Pool, outcome: Outcome, dfiProBlock: number): number {
    const anteileDFI = dfInPool / +pool.reserveB * 100;
    const anteile = poolCoin / +pool.reserveA * 100;
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

  loadLocalStorageForManuel(): void {
    // BTC POOL
    if (this.isLocalStorageNotEmpty(this.wallet.btcInBtcPoolKey)) {
      this.wallet.btcInBtcPool = +localStorage.getItem(this.wallet.btcInBtcPoolKey);
    } else {
      this.wallet.btcInBtcPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.btcKey)) {
      this.wallet.btc = +localStorage.getItem(this.wallet.btcKey);
    } else {
      this.wallet.btc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInBtcPoolKey)) {
      this.wallet.dfiInBtcPool = +localStorage.getItem(this.wallet.dfiInBtcPoolKey);
    } else {
      this.wallet.dfiInBtcPool = 0;
    }
    // ETH POOL
    if (this.isLocalStorageNotEmpty(this.wallet.ethInEthPoolKey)) {
      this.wallet.ethInEthPool = +localStorage.getItem(this.wallet.ethInEthPoolKey);
    } else {
      this.wallet.ethInEthPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.ethKey)) {
      this.wallet.eth = +localStorage.getItem(this.wallet.ethKey);
    } else {
      this.wallet.eth = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInEthPoolKey)) {
      this.wallet.dfiInEthPool = +localStorage.getItem(this.wallet.dfiInEthPoolKey);
    } else {
      this.wallet.dfiInEthPool = 0;
    }
    // USDT POOL
    if (this.isLocalStorageNotEmpty(this.wallet.usdtInUsdtPoolKey)) {
      this.wallet.usdtInUsdtPool = +localStorage.getItem(this.wallet.usdtInUsdtPoolKey);
    } else {
      this.wallet.usdtInUsdtPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdtKey)) {
      this.wallet.usdt = +localStorage.getItem(this.wallet.usdtKey);
    } else {
      this.wallet.usdt = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInUsdtPoolKey)) {
      this.wallet.dfiInUsdtPool = +localStorage.getItem(this.wallet.dfiInUsdtPoolKey);
    } else {
      this.wallet.dfiInUsdtPool = 0;
    }
    // LTC POOL
    if (this.isLocalStorageNotEmpty(this.wallet.ltcInLtcPoolKey)) {
      this.wallet.ltcInLtcPool = +localStorage.getItem(this.wallet.ltcInLtcPoolKey);
    } else {
      this.wallet.ltcInLtcPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.ltcKey)) {
      this.wallet.ltc = +localStorage.getItem(this.wallet.ltcKey);
    } else {
      this.wallet.ltc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInLtcPoolKey)) {
      this.wallet.dfiInLtcPool = +localStorage.getItem(this.wallet.dfiInLtcPoolKey);
    } else {
      this.wallet.dfiInLtcPool = 0;
    }
    // DOGE POOL
    if (this.isLocalStorageNotEmpty(this.wallet.dogeInDogePoolKey)) {
      this.wallet.dogeInDogePool = +localStorage.getItem(this.wallet.dogeInDogePoolKey);
    } else {
      this.wallet.dogeInDogePool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dogeKey)) {
      this.wallet.doge = +localStorage.getItem(this.wallet.dogeKey);
    } else {
      this.wallet.doge = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInDogePoolKey)) {
      this.wallet.dfiInDogePool = +localStorage.getItem(this.wallet.dfiInDogePoolKey);
    } else {
      this.wallet.dfiInDogePool = 0;
    }
    // WALLET
    if (this.isLocalStorageNotEmpty(this.wallet.dfiKey)) {
      this.wallet.dfi = +localStorage.getItem(this.wallet.dfiKey);
    } else {
      this.wallet.dfi = 0;
    }

  }

  onChangeDfiStaking(): void {
    localStorage.setItem(this.dfiInStakingKey, JSON.stringify(this.dfiInStaking ));
    this.berechneStakingOut();
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
    return (this.wallet.btcInBtcPool + this.wallet.btc) * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet.ethInEthPool + this.wallet.eth) * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.wallet.usdtInUsdtPool + this.wallet.usdt) * this.poolUsdt?.priceA;
  }

  getLtcValueUsd(): number {
    return (this.wallet.ltcInLtcPool + this.wallet.ltc) * this.poolLtc?.priceA;
  }

  getDogeValueUsd(): number {
    return (this.wallet.dogeInDogePool + this.wallet.doge) * this.poolDoge?.priceA;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.dfiInStaking;
  }

  getDfiCountIncome(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.dfiInStaking;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getDfiCountWalletUsd(): number {
    return this.wallet?.dfi * this.poolBtc?.priceB;
  }

  getAnteilWalletOfAllValue(): number {
    return this.getDfiCountWalletUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool;
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
    return this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolUsdtOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay;
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

  // ============= ONCHANGE INPUT =================
  onChangeDfiWallet(): void {
    if (this.checkInputNumber(this.wallet.dfi)) {
      localStorage.setItem(this.wallet.dfiKey, JSON.stringify(this.wallet.dfi));
      this.buildDataForChart();
    }
  }

  onChangeBtcBtcPool(): void {
    if (this.checkInputNumber(this.wallet.btcInBtcPool )) {
      localStorage.setItem(this.wallet.btcInBtcPoolKey, JSON.stringify(this.wallet.btcInBtcPool));
      this.berechnePoolOutBtc();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeBtcWallet(): void {
    if (this.checkInputNumber(this.wallet.btc )) {
      localStorage.setItem(this.wallet.btcKey, JSON.stringify(this.wallet.btc));
      this.buildDataForChart();
    }
  }

  onChangeEthEthPool(): void {
    if (this.checkInputNumber(this.wallet.ethInEthPool )) {
      localStorage.setItem(this.wallet.ethInEthPoolKey, JSON.stringify(this.wallet.ethInEthPool));
      this.berechnePoolOutEth();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeEthWallet(): void {
    if (this.checkInputNumber(this.wallet.eth )) {
      localStorage.setItem(this.wallet.ethKey, JSON.stringify(this.wallet.eth));
      this.buildDataForChart();
    }
  }

  onChangeUsdtUsdtPool(): void {
    if (this.checkInputNumber(this.wallet.usdtInUsdtPool )) {
      localStorage.setItem(this.wallet.usdtInUsdtPoolKey, JSON.stringify(this.wallet.usdtInUsdtPool));
      this.berechnePoolOutUsdt();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeUsdtWallet(): void {
    if (this.checkInputNumber(this.wallet.usdt )) {
      localStorage.setItem(this.wallet.usdtKey, JSON.stringify(this.wallet.usdt));
      this.buildDataForChart();
    }
  }

  onChangeLtcLtcPool(): void {
    if (this.checkInputNumber(this.wallet.ltc )) {
      localStorage.setItem(this.wallet.ltcInLtcPoolKey, JSON.stringify(this.wallet.ltc));
      this.berechnePoolOutLtc();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeLtcWallet(): void {
    if (this.checkInputNumber(this.wallet.ltc)) {
      localStorage.setItem(this.wallet.ltcKey, JSON.stringify(this.wallet.ltc ));
      this.buildDataForChart();
    }
  }

  onChangeDogeDogePool(): void {
    if (this.checkInputNumber(this.wallet.doge )) {
      localStorage.setItem(this.wallet.dogeInDogePoolKey, JSON.stringify(this.wallet.doge));
      this.berechnePoolOutDoge();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeDogeWallet(): void {
    if (this.checkInputNumber(this.wallet.doge )) {
      localStorage.setItem(this.wallet.dogeKey, JSON.stringify(this.wallet.doge));
      this.buildDataForChart();
    }
  }

  // DFI in POOLS
  onChangeDfiBtcPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInBtcPool )) {
      localStorage.setItem(this.wallet.dfiInBtcPoolKey, JSON.stringify(this.wallet.dfiInBtcPool));
      this.berechnePoolOutBtc();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeDfiEthPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInEthPool)) {
      localStorage.setItem(this.wallet.dfiInEthPoolKey, JSON.stringify(this.wallet.dfiInEthPool));
      this.berechnePoolOutEth();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeDfiUsdtPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInUsdtPool )) {
      localStorage.setItem(this.wallet.dfiInUsdtPoolKey, JSON.stringify(this.wallet.dfiInUsdtPool));
      this.berechnePoolOutUsdt();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeDfiLtcPool(): void {
    if ( this.checkInputNumber(this.wallet.dfiInLtcPool)) {
      localStorage.setItem(this.wallet.dfiInLtcPoolKey, JSON.stringify( this.wallet.dfiInLtcPool));
      this.berechnePoolOutLtc();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  onChangeDfiDogePool(): void {
    if (this.checkInputNumber(this.wallet.dfiInDogePool)) {
      localStorage.setItem(this.wallet.dfiInDogePoolKey, JSON.stringify(this.wallet.dfiInDogePool));
      this.berechnePoolOutDoge();
      this.berechnePoolOut();
      this.buildDataForChart();
    }
  }

  checkInputNumber(value: number): boolean {
    return value !== null && value >= 0;
  }
}
