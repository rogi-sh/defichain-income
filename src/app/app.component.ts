import { Component, OnInit, ViewChild } from '@angular/core';
import { Dex } from '@services/dex.service';
import {Location} from '@angular/common';
import {
  AddressBalance,
  MasternodeOutcome,
  Outcome,
  OutcomeStaking,
  Pool,
  PoolAllOut,
  PoolBchOut,
  PoolBtcOut,
  PoolDogeOut,
  PoolEthOut,
  PoolLtcOut,
  PoolUsdtOut,
  PoolUsdcOut,
  Stats,
  Rewards,
  PoolUsdOut,
  PoolTslaOut,
  PoolQqqOut,
  PoolSpyOut,
  PoolPltrOut,
  PoolSlvOut,
  PoolAaplOut,
  PoolGldOut,
  PoolGmeOut,
  PoolGooglOut,
  PoolArkkOut,
  PoolBabaOut,
  PoolVnqOut,
  PoolUrthOut,
  PoolTltOut,
  PoolPdbcOut,
  Prices,
  PoolEemOut,
  PoolAmznOut,
  PoolNvdaOut,
  PoolCoinOut,
  PoolMsftOut,
  PoolNflxOut,
  PoolFbOut,
  PoolVooOut,
  PoolDisOut,
  PoolMchiOut,
  PoolMstrOut,
  PoolIntcOut,
  PoolPyplOut,
  PoolBrkbOut,
  PoolKoOut,
  PoolPgOut,
  PoolSapOut,
  PoolGsgOut,
  PoolUraOut,
  PoolCsOut,
  PoolPpltOut,
  PoolGovtOut,
  PoolXomOut,
  PoolTanOut,
  PoolUsdUsdcOut,
  PoolUsdUsdtOut,
  PoolJnjOut, PoolAddyyOut, PoolGsOut, PoolDaxOut,
} from '@interfaces/Dex';
import {CountdownComponent} from 'ngx-countdown';
import {
  AddressVaults,
  ChartOptions6, HoldingValue,
  Newsletter, PoolIncomeValue, PoolPairOcean, PoolPairsOcean,
  UserHistory,
  Vault,
  Wallet,
  WalletDto,
} from '@interfaces/Data';
import { environment } from '@environments/environment';
import { filter, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo-v9';
import { Apollo } from 'apollo-angular';
import { DFX_STAKING, HISTORY_USER, LOGIN, REGISTER, UPDATE } from '@interfaces/Graphql';
import { DataService } from '@services/data.service';
import { StakingService } from '@services/staking.service';
import { Meta } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TokenAccount } from '@interfaces/Supernode';
import { firstValueFrom } from 'rxjs';
import { MamonAccountNode } from '@interfaces/Mamon';
import { DfxStaking, OceanStats } from '@interfaces/Staking';
import { Router, NavigationEnd } from '@angular/router';
import { ChartComponent } from 'ng-apexcharts';
import { IncomeComponent } from '@pages/income/income.component';
import { ValueComponent } from '@pages/value/value.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private dexService: Dex, private translate: TranslateService, private apollo: Apollo,
              private matomoInjector: MatomoInjector, private matomoTracker: MatomoTracker, private dataService: DataService,
              private stakingService: StakingService, private meta: Meta, private spinner: NgxSpinnerService,
              private toastr: ToastrService, private router: Router, private location: Location) {
    translate.addLangs(['en', 'de', 'ru', 'es', 'fr']);
    translate.setDefaultLang('de');

    this.translate = translate;
    const browserLang = translate.getBrowserLang();
    this.lang = translate.getLangs().indexOf(browserLang) > -1 ? browserLang : 'en';
    translate.use(this.lang);

    // setze matomo URL
    this.matomoInjector.init(environment.matomoUrl, environment.matomoId);

  }

  @ViewChild('cd', { static: false })
  private countdown: CountdownComponent;

  @ViewChild(IncomeComponent)
  private incomeComponent: IncomeComponent;

  @ViewChild(ValueComponent)
  private valueComponent: ValueComponent;

  @ViewChild('chart10', { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions6>;

  @ViewChild('chart11', { static: false }) chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions6>;

  title = 'defichain-income';
  lang = 'en';
  env = environment;
  currentPage = 'info';
  currentPageKey = 'currentPageKey';

  wallet: Wallet;
  walletDTO: WalletDto;
  newsletter: Newsletter;

  // fixed variables
  dfiProBlockBtc = 80;
  dfiProBlockEth = 15;
  dfiProBlockUsdt = 5;
  dfiProBlockUsdc = 1;
  dfiProBlockLtc = 2;
  dfiProBlockDoge = 0.1;
  dfiProBlockBch = 1;
  dfiProBlockUsd = 38.9;
  dfiProBlockUsdUsdc = 0.8;
  dfiProBlockUsdUsdt = 0.8;

  dfiProBlockTsla = 8.5;
  dfiProBlockQqq = 3.7;
  dfiProBlockSpy = 6.1;
  dfiProBlockPltr = 2;
  dfiProBlockSlv = 1.2;
  dfiProBlockAapl = 2.9;
  dfiProBlockGld = 0.8;
  dfiProBlockGme = 3.8;
  dfiProBlockGoogle = 1.8;
  dfiProBlockArkk = 1.7;
  dfiProBlockBaba = 2.6;
  dfiProBlockVnq = 0.75;
  dfiProBlockUrth = 0.62;
  dfiProBlockTlt = 1.12;
  dfiProBlockPdbc = 0.83;

  dfiProBlockEem = 0.75;
  dfiProBlockAmzn = 0.62;
  dfiProBlockNvda = 1.12;
  dfiProBlockCoin = 0.83;

  dfiProBlockMsft = 0.75;
  dfiProBlockFb = 0.62;
  dfiProBlockVoo = 1.12;
  dfiProBlockNflx = 0.83;

  dfiProBlockDis = 0.75;
  dfiProBlockMchi = 0.62;
  dfiProBlockMstr = 1.12;
  dfiProBlockIntc = 0.83;

  dfiProBlockPypl = 0;
  dfiProBlockBrkb = 0;
  dfiProBlockKo = 0;
  dfiProBlockPg = 0;

  dfiProBlockSap = 0;
  dfiProBlockCs = 0;
  dfiProBlockUra = 0;
  dfiProBlockGsg = 0;

  dfiProBlockPplt = 0;
  dfiProBlockXom = 0;
  dfiProBlockGovt = 0;
  dfiProBlockTan = 0;

  dfiProBlockJnj = 0;
  dfiProBlockAddyy = 0;
  dfiProBlockGs = 0;
  dfiProBlockDax = 0;

  dfiPorBlockStock = 77.8;

  rewards: Stats;

  blocktimeInS = 30;
  blocktimeInSSecond = 30;
  blocktimeFirstLastSecond = 30;
  fiat = 'USD';
  details = 'Staking';
  fiatKey = 'fiatKey';
  detailsKey = 'detailsKey';

  priceDFICEX = 0;

  pools: Array<Pool>;
  oceanStats: OceanStats;

  // Staking infos
  dfiInStaking = 0;
  dfiInDfxStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';

  stakingApyCake = 98;
  stakingApy = this.stakingApyCake;
  stakingApyMN = 77.6;
  masternodeCount = 7960;
  masternodeCountForAprCalc = 7960;
  masternodeCount5Freezer = 0;
  masternodeCount10Freezer = 0;
  masternodeCount0Freezer = 0;
  stakingApyKey = 'stakingApyKey';

  stakingDfx: DfxStaking;

  dfiBurned = 0;

  adresses = new Array<string>();
  adressesMasternodes = new Array<string>();
  adressesMasternodesFreezer5 = new Array<string>();
  adressesMasternodesFreezer10 = new Array<string>();
  adressBalances = new Array<AddressBalance>();
  newAddressesAdded = new Array<string>();
  showDialogAddressesAdded = false;
  showDialogAddressesNotAdded = false;
  addressesDto;
  addressesMasternodesDto;
  adressesMasternodesFreezer5Dto;
  adressesMasternodesFreezer10Dto;
  adress = '';
  adressesKey = 'adressesKey';
  adressesMasternodesKey = 'adressesMasternodesKey';
  masternodeAdress = false;
  isIncognitoModeOn = false;
  masternodeFreezer5 = false;
  masternodeFreezer10 = false;
  mamonKey: string;
  avgApr = 0;

  vaultsOfAllAddresses = new Array<AddressVaults>();

  correlationDays = 365;
  correlationDaysKey = 'correlationDaysKey';

  poolBtc: Pool;
  poolBtcOut: PoolBtcOut = new PoolBtcOut();
  anteilAmPoolBtc: number;

  poolEthOut: PoolEthOut = new PoolEthOut();
  poolEth: Pool;
  anteilAmPoolEth: number;

  poolUsdtOut: PoolUsdtOut = new PoolUsdtOut();
  poolUsdt: Pool;
  anteilAmPoolUsdt: number;

  poolUsdcOut: PoolUsdcOut = new PoolUsdcOut();
  poolUsdc: Pool;
  anteilAmPoolUsdc: number;

  poolLtcOut: PoolLtcOut = new PoolLtcOut();
  poolLtc: Pool;
  anteilAmPoolLtc: number;

  poolDoge: Pool;
  poolDogeOut: PoolDogeOut = new PoolDogeOut();
  anteilAmPoolDoge: number;

  poolBch: Pool;
  poolBchOut: PoolBchOut = new PoolBchOut();
  anteilAmPoolBch: number;

  poolUsd: Pool;
  poolUsdOut: PoolUsdOut = new PoolUsdOut();
  anteilAmPoolUsd: number;

  poolUsdUsdc: Pool;
  poolUsdUsdcOut: PoolUsdUsdcOut = new PoolUsdUsdcOut();
  anteilAmPoolUsdUsdc: number;

  poolUsdUsdt: Pool;
  poolUsdUsdtOut: PoolUsdUsdtOut = new PoolUsdUsdtOut();
  anteilAmPoolUsdUsdt: number;

  poolTsla: Pool;
  poolTslaOut: PoolTslaOut = new PoolTslaOut();
  anteilAmPoolTsla: number;

  poolQqq: Pool;
  poolQqqOut: PoolQqqOut = new PoolQqqOut();
  anteilAmPoolQqq: number;

  poolSpy: Pool;
  poolSpyOut: PoolSpyOut = new PoolSpyOut();
  anteilAmPoolSpy: number;

  poolPltr: Pool;
  poolPltrOut: PoolPltrOut = new PoolPltrOut();
  anteilAmPoolPltr: number;

  poolSlv: Pool;
  poolSlvOut: PoolSlvOut = new PoolSlvOut();
  anteilAmPoolSlv: number;

  poolAapl: Pool;
  poolAaplOut: PoolAaplOut = new PoolAaplOut();
  anteilAmPoolAapl: number;

  poolGld: Pool;
  poolGldOut: PoolGldOut = new PoolGldOut();
  anteilAmPoolGld: number;

  poolGme: Pool;
  poolGmeOut: PoolGmeOut = new PoolGmeOut();
  anteilAmPoolGme: number;

  poolGoogl: Pool;
  poolGooglOut: PoolGooglOut = new PoolGooglOut();
  anteilAmPoolGoogl: number;

  poolArkk: Pool;
  poolArkkOut: PoolArkkOut = new PoolArkkOut();
  anteilAmPoolArkk: number;

  poolBaba: Pool;
  poolBabaOut: PoolBabaOut = new PoolBabaOut();
  anteilAmPoolBaba: number;

  poolVnq: Pool;
  poolVnqOut: PoolVnqOut = new PoolVnqOut();
  anteilAmPoolVnq: number;

  poolUrth: Pool;
  poolUrthOut: PoolUrthOut = new PoolUrthOut();
  anteilAmPoolUrth: number;

  poolTlt: Pool;
  poolTltOut: PoolTltOut = new PoolTltOut();
  anteilAmPoolTlt: number;

  poolPdbc: Pool;
  poolPdbcOut: PoolPdbcOut = new PoolPdbcOut();
  anteilAmPoolPdbc: number;

  // new stocks 1.2.2022
  poolEem: Pool;
  poolEemOut: PoolEemOut = new PoolEemOut();
  anteilAmPoolEem: number;

  poolAmzn: Pool;
  poolAmznOut: PoolAmznOut = new PoolAmznOut();
  anteilAmPoolAmzn: number;

  poolNvda: Pool;
  poolNvdaOut: PoolNvdaOut = new PoolNvdaOut();
  anteilAmPoolNvda: number;

  poolCoin: Pool;
  poolCoinOut: PoolCoinOut = new PoolCoinOut();
  anteilAmPoolCoin: number;

  // new stocks 3.3.2022
  poolMsft: Pool;
  poolMsftOut: PoolMsftOut = new PoolMsftOut();
  anteilAmPoolMsft: number;

  poolNflx: Pool;
  poolNflxOut: PoolNflxOut = new PoolNflxOut();
  anteilAmPoolNflx: number;

  poolFb: Pool;
  poolFbOut: PoolFbOut = new PoolFbOut();
  anteilAmPoolFb: number;

  poolVoo: Pool;
  poolVooOut: PoolVooOut = new PoolVooOut();
  anteilAmPoolVoo: number;

  // new stocks 30.3.2022
  poolDis: Pool;
  poolDisOut: PoolDisOut = new PoolDisOut();
  anteilAmPoolDis: number;

  poolMchi: Pool;
  poolMchiOut: PoolMchiOut = new PoolMchiOut();
  anteilAmPoolMchi: number;

  poolMstr: Pool;
  poolMstrOut: PoolMstrOut = new PoolMstrOut();
  anteilAmPoolMstr: number;

  poolIntc: Pool;
  poolIntcOut: PoolIntcOut = new PoolIntcOut();
  anteilAmPoolIntc: number;

  // new stocks 28.4.2022
  poolPypl: Pool;
  poolPyplOut: PoolPyplOut = new PoolPyplOut();
  anteilAmPoolPypl: number;

  poolBrkb: Pool;
  poolBrkbOut: PoolBrkbOut = new PoolBrkbOut();
  anteilAmPoolBrkb: number;

  poolKo: Pool;
  poolKoOut: PoolKoOut = new PoolKoOut();
  anteilAmPoolKo: number;

  poolPg: Pool;
  poolPgOut: PoolPgOut = new PoolPgOut();
  anteilAmPoolPg: number;

  // new stocks 27.5.2022
  poolGsg: Pool;
  poolGsgOut: PoolGsgOut = new PoolGsgOut();
  anteilAmPoolGsg: number;

  poolSap: Pool;
  poolSapOut: PoolSapOut = new PoolSapOut();
  anteilAmPoolSap: number;

  poolUra: Pool;
  poolUraOut: PoolUraOut = new PoolUraOut();
  anteilAmPoolUra: number;

  poolCs: Pool;
  poolCsOut: PoolCsOut = new PoolCsOut();
  anteilAmPoolCs: number;

  // new stocks 27.6.2022
  poolPplt: Pool;
  poolPpltOut: PoolPpltOut = new PoolPpltOut();
  anteilAmPoolPplt: number;

  poolGovt: Pool;
  poolGovtOut: PoolGovtOut = new PoolGovtOut();
  anteilAmPoolGovt: number;

  poolTan: Pool;
  poolTanOut: PoolTanOut = new PoolTanOut();
  anteilAmPoolTan: number;

  poolXom: Pool;
  poolXomOut: PoolXomOut = new PoolXomOut();
  anteilAmPoolXom: number;

  // new stocks 27.7.2022
  poolJnj: Pool;
  poolJnjOut: PoolJnjOut = new PoolJnjOut();
  anteilAmPoolJnj: number;

  poolAddyy: Pool;
  poolAddyyOut: PoolAddyyOut = new PoolAddyyOut();
  anteilAmPoolAddyy: number;

  poolGs: Pool;
  poolGsOut: PoolGsOut = new PoolGsOut();
  anteilAmPoolGs: number;

  poolDax: Pool;
  poolDaxOut: PoolDaxOut = new PoolDaxOut();
  anteilAmPoolDax: number;

  cryptoPools: Array<Pool>;
  stocksPools: Array<Pool>;
  poolPairsOcean: PoolPairsOcean;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();
  poolAllOut: PoolAllOut = new PoolAllOut();
  poolMasternodeOut: MasternodeOutcome = new MasternodeOutcome();

  poolIncomeList = new Array<PoolIncomeValue>();

  sCountdown = 600;
  sCountdownShow = 600;
  sCountdownKey = 'sCountdownKey';
  timer: number;

  autoLoadData = true;
  autoLoadDataKey = 'autoLoadDataKey';

  showInputArea = true;
  showInputAreaKey = 'showInputAreaKey';

  showSettingsArea = true;
  showSettingsAreaKey = 'showSettingsAreaKey';

  apiOnline = true;

  loggedIn = false;
  loggedInAuth;
  loggedInAuthInput;
  loggedInKey = 'loggedInKey';
  errorBackend = null;
  successBackend = null;
  menu = false;

  dataLoaded = false;

  isInfoOpen = false;
  selectedTab = 'manual';
  isDarkModeOn = false;
  cakeApyLoadAuto = true;
  cakeApyLoadAutoKey = 'cakeApyLoadAutoKey';
  timestamp = null;
  freezerInTotolValue = false;

  oneTrackingAddress = null;
  authKeyOverUrl = null;

  userHistory: UserHistory = null;

  isValueChartOn = true;
  isValueChartOnKey = 'isValueChartOnKey';
  isIncomeChartOn = true;
  isIncomeChartOnKey = 'isIncomeChartOnKey';

  private setFromPoolPair(id: string): Pool {

    const pool = new Pool();
    const poolFromOcean = this.getPoolOcean(id);

    pool.id = poolFromOcean.id;
    pool.poolPairId = poolFromOcean.id;
    pool.apr = poolFromOcean.apr?.total * 100;
    pool.name = poolFromOcean.symbol;
    pool.symbol = poolFromOcean.symbol;
    pool.pair = poolFromOcean.symbol;
    pool.rewardPct = +poolFromOcean.rewardPct;
    pool.totalLiquidityLpToken = +poolFromOcean.totalLiquidity.token;
    pool.totalLiquidityUsd = +poolFromOcean.totalLiquidity.usd;
    pool.totalLiquidity = +poolFromOcean.totalLiquidity.token;
    pool.tokenASymbol = poolFromOcean.tokenA.symbol;
    pool.tokenBSymbol = poolFromOcean.tokenB.symbol;
    pool.reserveB = poolFromOcean.tokenB.reserve;
    pool.reserveA = poolFromOcean.tokenA.reserve;
    pool.volume24h = poolFromOcean.volume.h24;
    pool.feeA = +poolFromOcean.tokenA?.fee?.pct;
    pool.feeB = +poolFromOcean.tokenB?.fee?.pct;

    return pool;
  }

  updateDescription(description: string): void {
    this.translate.stream(description).subscribe((res: string) => {
      this.meta.updateTag({ name: 'description', content: res });
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.lang = language;
    this.matomoTracker.trackEvent('Klick', 'Change Lang', language);
  }

  isLangSet(lang: string): boolean {
    return this.lang === lang;
  }

  getArb(cex: number, dex: number): number {
    // round 1 digit
    return Math.round(dex / cex  * 1000 - 1000) / 10;
  }

  getDUSDPrice(): number {

    if (!this.poolUsd) {
      return 1;
    }

    const priceRateA = +this.poolUsd.reserveB / +this.poolUsd.reserveA;
    return this.getRound2(priceRateA * this.poolBtc?.priceB);
  }

  getDUSDFee(): number {
    if (!this.poolUsd) {
      return 0;
    }
    return this.getRound2(this.poolUsd?.feeA * 100);
  }

  getRound2(num: number): number {
    return Math.round((num) * 100) / 100;
  }

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: NavigationEnd) => {

      const url = this.router.url;

      // only one adress calculation
      const match = 'address/';
      if (url.toLowerCase().indexOf(match) >= 0) {
        const index = url.toLowerCase().indexOf(match);
        this.oneTrackingAddress = url.slice(index + match.length, url.length);
      }
      // authKey over url
      const matchAuthKey = 'authKey/';
      if (url.indexOf(matchAuthKey) >= 0) {
        const index = url.indexOf(matchAuthKey);
        this.authKeyOverUrl = url.slice(index + matchAuthKey.length, url.length);
        this.loggedInAuth = this.authKeyOverUrl;
        this.loggedIn = true;
        localStorage.setItem(this.loggedInKey, this.loggedInAuth);
      }

      this.handleSites(url);

      // remove adresses in localstorage
      localStorage.removeItem(this.adressesKey);
      localStorage.removeItem(this.adressesMasternodesKey);

      this.loadData();

      if (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isDarkModeOn = true;
      }

      this.toggleDarkMode();
    });

  }

  private handleSites(url: string): void {
    const matchValue = '/holdings';
    const matchIncome = '/income';
    const matchDashboard = '/dashboard';
    const matchDex = '/dex';
    const matchForecast = '/forecast';
    const matchHistory = '/history';
    const matchChart = '/chart';
    const matchCalculator = '/calculator';
    const matchInfo = '/info';
    const matchSettings = '/settings';
    const matchNewsletter = '/newsletter';

    if (url.indexOf(matchValue) >= 0) {
      this.handlePage('holdings');
    } else if (url.indexOf(matchIncome) >= 0) {
      this.handlePage('income');
    } else if (url.indexOf(matchDashboard) >= 0) {
      this.handlePage('dashboard');
    } else if (url.indexOf(matchDex) >= 0) {
      this.handlePage('dex');
    } else if (url.indexOf(matchForecast) >= 0) {
      this.handlePage('forecast');
    } else if (url.indexOf(matchHistory) >= 0) {
      this.handlePage('history');
    } else if (url.indexOf(matchChart) >= 0) {
      this.handlePage('defi');
    } else if (url.indexOf(matchCalculator) >= 0) {
      this.handlePage('calculator');
    } else if (url.indexOf(matchInfo) >= 0) {
      this.handlePage('info');
    } else if (url.indexOf(matchSettings) >= 0) {
      this.handlePage('settings');
    } else if (url.indexOf(matchNewsletter) >= 0) {
      this.handlePage('newsletter');
    }
  }

  async loadData(): Promise<void> {

    await this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 15 seconds */
      this.spinner.hide();
    }, 5000);

    this.updateDescription('meta-data.description');

    this.clearWallet();

    this.loadFromLocalStorage();

    await this.computeMeta();

    this.loadStackingCake();
    this.loadStackingDfx();

    this.loadStackingMasternode();
    this.loadHistoryUser();

    // only one adress over url
    if (this.oneTrackingAddress) {
      this.loadDataFromServerForOneAdress();
    // authKey over url
    } else if (this.authKeyOverUrl) {
      this.loadDataFromServerAndLoadAllStuffAuthKeyFromUrl();
    } else if (this.loggedIn) {
      this.loadDataFromServerAndLoadAllStuff();
    } else {
      this.loadAddressesAndDexData();
    }

    this.countdown?.begin();
    this.timer = setInterval(() => {
      this.refresh();
    }, this.sCountdown * 1000);

    this.timestamp = new Date().toLocaleTimeString();
  }

  loadHistoryUser(): void {
    this.apollo.query({
      query: HISTORY_USER,
      variables: {
        key: this.loggedInAuth
      }
    }).subscribe((result: any) => {
      if (result?.data?.userHistoryByKey) {
        this.userHistory = result?.data?.userHistoryByKey;
        if (this.isUserHistoryForValue()) {
          this.buildChartValue();
        }

        if (this.isUserHistoryForIncome()) {
          this.buildChartIncome();
        }

      } else {
        console.log('No Date for History User');
      }
    }, (error) => {
      console.log(error);
    });
  }

  isUserHistoryForValue(): boolean {
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      if (this.userHistory.values.some(v => v.totalValue > 0)) {
        return true;
      }
    }

    return false;
  }

  isUserHistoryForIncome(): boolean {
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      if (this.userHistory.values.some(v => v.totalValueIncomeDfi > 0)) {
        return true;
      }
    }

    return false;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }

  getUserHistoryTotalValues(): Array<number> {
    const numbers = new Array<number>();
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      this.userHistory.values.forEach(v => {
          numbers.push(Math.round(v.totalValue * this.dataService.getPrice(this.fiat) * 100) / 100);
      });
    }

    return numbers;
  }

  getUserHistoryTotalIncomeDfi(): Array<number> {
    const numbers = new Array<number>();
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      this.userHistory.values.forEach(v => {
          numbers.push(Math.round(v.totalValueIncomeDfi * 100) / 100);
      });
    }

    return numbers;
  }

  getUserHistoryTotalIncomeUsd(): Array<number> {
    const numbers = new Array<number>();
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      this.userHistory.values.forEach(v => {
          numbers.push(Math.round(v.totalValueIncomeUsd * this.dataService.getPrice(this.fiat) * 100) / 100);
      });
    }

    return numbers;
  }

  getUserHistoryDates(): Array<string> {
    const dates = new Array<string>();
    if (this.userHistory && this.userHistory.values && this.userHistory.values.length > 0) {
      this.userHistory.values.forEach(v => {
          const date = new Date(v.date);
          dates.push( date.toISOString());
      });
    }

    return dates;
  }

  async buildChartValue(): Promise<void> {
    this.chartOptions = {
      series: [
        {
          name: 'Value History',
          data: this.getUserHistoryTotalValues()
        }
      ],
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent',
        animations: {
          enabled: false
        }
      },
      theme: {
        mode: this.getTheme() === 'dark' ? 'dark' : 'light'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 4,
        curve: 'smooth',
        dashArray: [0, 8, 5],
        colors: ['#00f700']
      },
      title: {
        text: 'Total Value in ' + this.fiat,
        align: 'left'
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false,
          style: {
            colors: this.getTheme() === 'dark' ? '#f1f1f1' : '#000000'
          }
        },
        categories: this.getUserHistoryDates(),
        type: 'datetime'
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return 'Currency';
              }
            }
          }
        ],
        x: {
          format: 'd/M/yyyy H:m'
        }
      },
      grid: {
        borderColor: this.getTheme() === 'dark' ? '#f1f1f1' : '#808080'
      }
    };
  }

  async buildChartIncome(): Promise<void> {
    this.chartOptions2 = {
      series: [
        {
          name: 'Income History DFI per Month',
          data: this.getUserHistoryTotalIncomeDfi(),
          color: '#ff00af'
        },
        {
          name: 'Income History ' + this.fiat + ' per Month',
          data: this.getUserHistoryTotalIncomeUsd(),
          color: '#0BDA51'
        }
      ],
      theme: {
        mode: this.getTheme() === 'dark' ? 'dark' : 'light'
      },
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent',
        animations: {
          enabled: false
        }

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 4,
        curve: 'smooth',
        dashArray: [0, 8, 5],
        colors: ['#ff00af', '#0BDA51'],
      },
      title: {
        text: 'Total Income in DFI & ' + this.fiat,
        align: 'left'
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false,
          style: {
            colors: this.getTheme() === 'dark' ? '#f1f1f1' : '#000000'
          }
        },
        type: 'datetime',
        categories: this.getUserHistoryDates(),
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return 'DFI';
              }
            }
          },
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return 'Currency';
              }
            }
          }
        ],
        x: {
          format: 'd/M/yyyy H:m'
        }
      },
      grid: {
        borderColor: this.getTheme() === 'dark' ? '#f1f1f1' : '#808080'
      }
    };
  }

  callDefiView($event): void {
    localStorage.setItem('coinpaprikaCurrencyKey', $event);
    this.handlePage('defi');
  }

  handlePage(pageTag: string): void {
    this.currentPage = pageTag;
    this.menu = false;
    localStorage.setItem(this.currentPageKey, this.currentPage);
    const url = this.router.url;
    const includesAddress = url.includes('address/');
    const includesAuthKey = url.includes('authKey/');
    if (!includesAddress && !includesAuthKey) {
      this.location.replaceState(pageTag);
    }
  }

  loadAddressesAndDexData(): void {
    if (this.autoLoadData) {
      this.loadAllAccounts();
    } else {
      // if logged in not necessary because already loaded
      if (!this.loggedIn) {
        this.loadLocalStorageForManuel();
      }
      this.loadDexManual();
      this.dataLoaded = true;
    }
  }

  private loadFromLocalStorage(): void {
    if (localStorage.getItem(this.loggedInKey) !== null) {
      this.loggedInAuth = localStorage.getItem(this.loggedInKey);
      this.loggedIn = true;
    }
    if (localStorage.getItem(this.fiatKey) !== null) {
      this.fiat = localStorage.getItem(this.fiatKey);
    }
    if (localStorage.getItem(this.detailsKey) !== null) {
      this.details = localStorage.getItem(this.detailsKey);
    }
    if (localStorage.getItem(this.sCountdownKey) !== null) {
      this.sCountdown = JSON.parse(localStorage.getItem(this.sCountdownKey));
      this.sCountdownShow = this.sCountdown;
    }
    if (localStorage.getItem(this.autoLoadDataKey) !== null) {
      this.autoLoadData = JSON.parse(localStorage.getItem(this.autoLoadDataKey));
    }
    if (localStorage.getItem(this.showInputAreaKey) !== null) {
      this.showInputArea = JSON.parse(localStorage.getItem(this.showInputAreaKey));
    }
    if (localStorage.getItem(this.showSettingsAreaKey) !== null) {
      this.showSettingsArea = JSON.parse(localStorage.getItem(this.showSettingsAreaKey));
    }
    if (this.isLocalStorageNotEmpty(this.stakingApyKey)) {
      this.stakingApy = JSON.parse(localStorage.getItem(this.stakingApyKey));
      this.stakingApyCake = this.stakingApy;
    }
    if (localStorage.getItem(this.currentPageKey) !== null) {
      this.currentPage = localStorage.getItem(this.currentPageKey);
    }
    if (localStorage.getItem('theme') !== null) {
      this.isDarkModeOn = localStorage.getItem('theme') === 'dark';
    }
    if (localStorage.getItem(this.isValueChartOnKey) !== null) {
      this.isValueChartOn =  JSON.parse(localStorage.getItem(this.isValueChartOnKey));
    }
    if (localStorage.getItem(this.isIncomeChartOnKey) !== null) {
      this.isIncomeChartOn =  JSON.parse(localStorage.getItem(this.isIncomeChartOnKey));
    }
    if (localStorage.getItem(this.cakeApyLoadAutoKey) !== null) {
      this.cakeApyLoadAuto = JSON.parse(localStorage.getItem(this.cakeApyLoadAutoKey));
    }
    if (localStorage.getItem(this.correlationDaysKey) !== null) {
      this.correlationDays = JSON.parse(localStorage.getItem(this.correlationDaysKey));
    }
    if (localStorage.getItem('freezerInValue') !== null) {
      this.freezerInTotolValue = JSON.parse(localStorage.getItem('freezerInValue'));
    }

  }

  reload(): void {
    window.location.reload();
  }

  /*
   * Careful not change to window.location.reload();!!!
   */
  async refresh(): Promise<void> {
    this.dataLoaded = false;
    await this.computeMeta();
    if (this.autoLoadData) {
      // only clear when not manual
      this.clearWallet();
      this.loadAllAccounts();
      this.loadHistoryUser();
    } else {
      // if logged in not necessary because already loaded
      if (!this.loggedIn) {
        this.loadLocalStorageForManuel();
      }
      this.loadDexManual();

    }
    this.sCountdownShow = this.sCountdown;
    this.countdown?.restart();

    this.timestamp = new Date().toLocaleTimeString();
  }

  register(): void {
    this.apollo.mutate({
      mutation: REGISTER,
      variables: {
        addresses: this.adresses,
        addressesMasternodes: this.adressesMasternodes,
        adressesMasternodesFreezer5: this.adressesMasternodesFreezer5,
        adressesMasternodesFreezer10: this.adressesMasternodesFreezer10,
        dfiInStaking: this.dfiInStaking,
        dfiInDfxStaking: this.dfiInDfxStaking,
        totalValue: this.getAllValuesUsdPriceWithputLoan(),
        totalValueIncomeDfi: this.poolOut.dfiPerMonth,
        totalValueIncomeUsd: this.poolOut.dfiPerMonth * this.poolBtc?.priceB,
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        usdc: this.wallet.usdc,
        bch: this.wallet.bch,

        usd: this.wallet.usd,
        tsla: this.wallet.tsla,
        qqq : this.wallet.qqq,
        spy : this.wallet.spy,
        pltr : this.wallet.pltr,
        slv : this.wallet.slv,
        aapl : this.wallet.aapl,
        gld : this.wallet.gld,
        gme : this.wallet.gme,
        googl : this.wallet.googl,
        arkk : this.wallet.arkk,
        baba : this.wallet.baba,
        vnq : this.wallet.vnq,
        urth : this.wallet.urth,
        tlt : this.wallet.tlt,
        pdbc : this.wallet.pdbc,

        amzn : this.wallet.amzn,
        nvda : this.wallet.nvda,
        coin : this.wallet.coin,
        eem : this.wallet.eem,

        msft : this.wallet.msft,
        nflx : this.wallet.nflx,
        fb : this.wallet.fb,
        voo : this.wallet.voo,

        dis  : this.wallet.dis,
        mchi  : this.wallet.mchi,
        mstr : this.wallet.mstr,
        intc  : this.wallet.intc,

        pypl  : this.wallet.pypl,
        brkb  : this.wallet.brkb,
        ko : this.wallet.ko,
        pg  : this.wallet.pg,

        sap  : this.wallet.sap,
        ura  : this.wallet.ura,
        cs : this.wallet.cs,
        gsg  : this.wallet.gsg,

        pplt  : this.wallet.pplt,
        govt  : this.wallet.govt,
        tan : this.wallet.tan,
        xom  : this.wallet.xom,

        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        usdcdfi: this.wallet.usdcdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
        usddfi: this.wallet.usddfi,
        tslausd: this.wallet.tslausd,
        qqqusd: this.wallet.qqqusd,
        spyusd: this.wallet.spyusd,
        pltrusd  : this.wallet.pltrusd,
        slvusd  : this.wallet.slvusd,
        aaplusd  : this.wallet.aaplusd,
        gldusd  : this.wallet.gldusd,
        gmeusd  : this.wallet.gmeusd,
        googlusd  : this.wallet.googlusd,
        arkkusd  : this.wallet.arkkusd,
        babausd  : this.wallet.babausd,
        vnqusd  : this.wallet.vnqusd,
        urthusd  : this.wallet.urthusd,
        tltusd  : this.wallet.tltusd,
        pdbcusd  : this.wallet.pdbcusd,
        amznusd  : this.wallet.amznusd,
        nvdausd  : this.wallet.nvdausd,
        coinusd  : this.wallet.coinusd,
        eemusd  : this.wallet.eemusd,

        msftusd  : this.wallet.msftusd,
        fbusd  : this.wallet.fbusd,
        nflxusd  : this.wallet.nflxusd,
        voousd  : this.wallet.voousd,

        disusd  : this.wallet.disusd,
        mchiusd  : this.wallet.mchiusd,
        mstrusd  : this.wallet.mstrusd,
        intcusd  : this.wallet.intcusd,

        pyplusd  : this.wallet.pyplusd,
        brkbusd  : this.wallet.brkbusd,
        kousd  : this.wallet.kousd,
        pgusd  : this.wallet.pgusd,

        sapusd  : this.wallet.sapusd,
        urausd  : this.wallet.urausd,
        csusd  : this.wallet.csusd,
        gsgusd  : this.wallet.gsgusd,

        ppltusd  : this.wallet.ppltusd,
        govtusd  : this.wallet.govtusd,
        tanusd  : this.wallet.tanusd,
        xomusd  : this.wallet.xomusd,

        btcInBtcPool: this.wallet.btcInBtcPool,
        dfiInBtcPool: this.wallet.dfiInBtcPool,
        ethInEthPool: this.wallet.ethInEthPool,
        dfiInEthPool: this.wallet.dfiInEthPool,
        usdtInUsdtPool: this.wallet.usdtInUsdtPool,
        dfiInUsdtPool: this.wallet.dfiInUsdtPool,
        usdcInUsdcPool: this.wallet.usdcInUsdcPool,
        dfiInUsdcPool: this.wallet.dfiInUsdcPool,
        ltcInLtcPool: this.wallet.ltcInLtcPool,
        dfiInLtcPool: this.wallet.dfiInLtcPool,
        dogeInDogePool: this.wallet.dogeInDogePool,
        dfiInDogePool: this.wallet.dfiInDogePool,
        bchInBchPool: this.wallet.bchInBchPool,
        dfiInBchPool: this.wallet.dfiInBchPool,
        usdInUsdPool: this.wallet.usdInUsdPool,
        dfiInUsdPool: this.wallet.dfiInUsdPool,
        tslaInTslaPool: this.wallet.tslaInTslaPool,
        usdInTslaPool: this.wallet.usdInTslaPool,
        spyInSpyPool : this.wallet.spyInSpyPool,
        usdInSpyPool : this.wallet.usdInSpyPool,
        qqqInQqqPool : this.wallet.qqqInQqqPool,
        usdInQqqPool : this.wallet.usdInQqqPool,
        pltrInPltrPool : this.wallet.pltrInPltrPool,
        usdInPltrPool : this.wallet.usdInPltrPool,
        slvInSlvPool : this.wallet.slvInSlvPool,
        usdInSlvPool : this.wallet.usdInSlvPool,
        aaplInAaplPool : this.wallet.aaplInAaplPool,
        usdInAaplPool : this.wallet.usdInAaplPool,
        gldInGldPool : this.wallet.gldInGldPool,
        usdInGldPool : this.wallet.usdInGldPool,
        gmeInGmePool : this.wallet.gmeInGmePool,
        usdInGmePool : this.wallet.usdInGmePool,
        googlInGooglPool : this.wallet.googlInGooglPool,
        usdInGooglPool : this.wallet.usdInGooglPool,
        arkkInArkkPool : this.wallet.arkkInArkkPool,
        usdInArkkPool : this.wallet.usdInArkkPool,
        babaInBabaPool : this.wallet.babaInBabaPool,
        usdInBabaPool : this.wallet.usdInBabaPool,
        vnqInVnqPool : this.wallet.vnqInVnqPool,
        usdInVnqPool : this.wallet.usdInVnqPool,
        urthInUrthPool : this.wallet.urthInUrthPool,
        usdInUrthPool : this.wallet.usdInUrthPool,
        tltInTltPool : this.wallet.tltInTltPool,
        usdInTltPool : this.wallet.usdInTltPool,
        pdbcInPdbcPool : this.wallet.pdbcInPdbcPool,
        usdInPdbcPool : this.wallet.usdInPdbcPool,

        amznInAmznPool : this.wallet.amznInAmznPool,
        usdInAmznPool : this.wallet.usdInAmznPool,
        nvdaInNvdaPool : this.wallet.nvdaInNvdaPool,
        usdInNvdaPool : this.wallet.usdInNvdaPool,
        coinInCoinPool : this.wallet.coinInCoinPool,
        usdInCoinPool : this.wallet.usdInCoinPool,
        eemInEemPool : this.wallet.eemInEemPool,
        usdInEemPool : this.wallet.usdInEemPool,

        msftInMsftPool : this.wallet.msftInMsftPool,
        usdInMsftPool : this.wallet.usdInMsftPool,
        fbInFbPool : this.wallet.fbInFbPool,
        usdInFbPool : this.wallet.usdInFbPool,
        nflxInNflxPool : this.wallet.nflxInNflxPool,
        usdInNflxPool : this.wallet.usdInNflxPool,
        vooInVooPool : this.wallet.vooInVooPool,
        usdInVooPool : this.wallet.usdInVooPool,

        disInDisPool : this.wallet.disInDisPool,
        usdInDisPool : this.wallet.usdInDisPool,
        mchiInMchiPool : this.wallet.mchiInMchiPool,
        usdInMchiPool : this.wallet.usdInMchiPool,
        mstrInMstrPool : this.wallet.mstrInMstrPool,
        usdInMstrPool : this.wallet.usdInMstrPool,
        intcInIntcPool : this.wallet.intcInIntcPool,
        usdInIntcPool : this.wallet.usdInIntcPool,

        pyplInPyplPool : this.wallet.pyplInPyplPool,
        usdInPyplPool : this.wallet.usdInPyplPool,
        brkbInBrkbPool : this.wallet.brkbInBrkbPool,
        usdInBrkbPool : this.wallet.usdInBrkbPool,
        koInKoPool : this.wallet.koInKoPool,
        usdInKoPool : this.wallet.usdInKoPool,
        pgInPgPool : this.wallet.pgInPgPool,
        usdInPgPool : this.wallet.usdInPgPool,

        sapInSapPool : this.wallet.sapInSapPool,
        usdInSapPool : this.wallet.usdInSapPool,
        uraInUraPool : this.wallet.uraInUraPool,
        usdInUraPool : this.wallet.usdInUraPool,
        csInCsPool : this.wallet.csInCsPool,
        usdInCsPool : this.wallet.usdInCsPool,
        gsgInGsgPool : this.wallet.gsgInGsgPool,
        usdInGsgPool : this.wallet.usdInGsgPool,

        ppltInPpltPool : this.wallet.ppltInPpltPool,
        usdInPpltPool : this.wallet.usdInPpltPool,
        govtInGovtPool : this.wallet.govtInGovtPool,
        usdInGovtPool : this.wallet.usdInGovtPool,
        tanInTanPool : this.wallet.tanInTanPool,
        usdInTanPool : this.wallet.usdInTanPool,
        xomInXomPool : this.wallet.xomInXomPool,
        usdInXomPool : this.wallet.usdInXomPool

      },
    }).subscribe((result: any) => {
      if (result?.data?.addUser) {
        this.loggedInAuth = result?.data?.addUser?.key;
        this.loggedIn = true;
        localStorage.setItem(this.loggedInKey, this.loggedInAuth);
        this.successBackend = 'OK';
        setInterval(() => {
          this.successBackend = null;
        }, 3000);
      }
    }, (error) => {
      console.log('there was an error sending mutation register', error);
      this.errorBackend = error.message;
      setInterval(() => {
        this.errorBackend = null;
      }, 3000);
    });

  }

  clearAddresses(): void {
    this.adresses = [];
    this.adressesMasternodes = [];
    this.adressesMasternodesFreezer5 = [];
    this.adressesMasternodesFreezer10 = [];

    this.update();

    localStorage.removeItem(this.adressesKey);
    localStorage.removeItem(this.adressesMasternodesKey);

  }

  getShortOfAddress(id: string): string {
    const first = id.slice(0, 8);
    const last = id.slice(id.length - 8, id.length);

    return first + '...' + last;
  }

  update(): void {

    if (!this.loggedInAuth || this.loggedInAuth.length === 0) {
      return;
    }

    this.apollo.mutate({
      mutation: UPDATE,
      variables: {
        key: this.loggedInAuth,
        addresses: this.adresses,
        addressesMasternodes: this.adressesMasternodes,
        adressesMasternodesFreezer5: this.adressesMasternodesFreezer5,
        adressesMasternodesFreezer10: this.adressesMasternodesFreezer10,
        dfiInStaking: this.dfiInStaking,
        dfiInDfxStaking: this.dfiInDfxStaking,
        totalValue: this.getAllValuesUsdPriceWithputLoan(),
        totalValueIncomeDfi: this.poolAllOut.dfiPerMonth,
        totalValueIncomeUsd: this.poolAllOut.dfiPerMonth * this.poolBtc?.priceB,
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        usdc: this.wallet.usdc,
        bch: this.wallet.bch,
        usd: this.wallet.usd,
        tsla: this.wallet.tsla,
        qqq : this.wallet.qqq,
        spy : this.wallet.spy,
        pltr : this.wallet.pltr,
        slv : this.wallet.slv,
        aapl : this.wallet.aapl,
        gld : this.wallet.gld,
        gme : this.wallet.gme,
        googl : this.wallet.googl,
        arkk : this.wallet.arkk,
        baba : this.wallet.baba,
        vnq : this.wallet.vnq,
        urth : this.wallet.urth,
        tlt : this.wallet.tlt,
        pdbc : this.wallet.pdbc,

        amzn : this.wallet.amzn,
        nvda : this.wallet.nvda,
        coin : this.wallet.coin,
        eem : this.wallet.eem,

        msft : this.wallet.msft,
        nflx : this.wallet.nflx,
        fb : this.wallet.fb,
        voo : this.wallet.voo,

        dis  : this.wallet.dis,
        mchi  : this.wallet.mchi,
        mstr : this.wallet.mstr,
        intc  : this.wallet.intc,

        pypl  : this.wallet.pypl,
        brkb  : this.wallet.brkb,
        ko : this.wallet.ko,
        pg  : this.wallet.pg,

        sap  : this.wallet.sap,
        ura  : this.wallet.ura,
        cs : this.wallet.cs,
        gsg  : this.wallet.gsg,

        pplt  : this.wallet.pplt,
        govt  : this.wallet.govt,
        tan : this.wallet.tan,
        xom  : this.wallet.xom,

        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        usdcdfi: this.wallet.usdcdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
        usddfi: this.wallet.usddfi,
        tslausd: this.wallet.tslausd,
        qqqusd: this.wallet.qqqusd,
        spyusd: this.wallet.spyusd,
        pltrusd  : this.wallet.pltrusd,
        slvusd  : this.wallet.slvusd,
        aaplusd  : this.wallet.aaplusd,
        gldusd  : this.wallet.gldusd,
        gmeusd  : this.wallet.gmeusd,
        googlusd  : this.wallet.googlusd,
        arkkusd  : this.wallet.arkkusd,
        babausd  : this.wallet.babausd,
        vnqusd  : this.wallet.vnqusd,
        urthusd  : this.wallet.urthusd,
        tltusd  : this.wallet.tltusd,
        pdbcusd  : this.wallet.pdbcusd,

        amznusd  : this.wallet.amznusd,
        nvdausd  : this.wallet.nvdausd,
        coinusd  : this.wallet.coinusd,
        eemusd  : this.wallet.eemusd,

        msftusd  : this.wallet.msftusd,
        fbusd  : this.wallet.fbusd,
        nflxusd  : this.wallet.nflxusd,
        voousd  : this.wallet.voousd,

        disusd  : this.wallet.disusd,
        mchiusd  : this.wallet.mchiusd,
        mstrusd  : this.wallet.mstrusd,
        intcusd  : this.wallet.intcusd,

        pyplusd  : this.wallet.pyplusd,
        brkbusd  : this.wallet.brkbusd,
        kousd  : this.wallet.kousd,
        pgusd  : this.wallet.pgusd,

        sapusd  : this.wallet.sapusd,
        urausd  : this.wallet.urausd,
        csusd  : this.wallet.csusd,
        gsgusd  : this.wallet.gsgusd,

        ppltusd  : this.wallet.ppltusd,
        govtusd  : this.wallet.govtusd,
        tanusd  : this.wallet.tanusd,
        xomusd  : this.wallet.xomusd,

        btcInBtcPool: this.wallet.btcInBtcPool,
        dfiInBtcPool: this.wallet.dfiInBtcPool,
        ethInEthPool: this.wallet.ethInEthPool,
        dfiInEthPool: this.wallet.dfiInEthPool,
        usdtInUsdtPool: this.wallet.usdtInUsdtPool,
        dfiInUsdtPool: this.wallet.dfiInUsdtPool,
        usdcInUsdcPool: this.wallet.usdcInUsdcPool,
        dfiInUsdcPool: this.wallet.dfiInUsdcPool,
        ltcInLtcPool: this.wallet.ltcInLtcPool,
        dfiInLtcPool: this.wallet.dfiInLtcPool,
        dogeInDogePool: this.wallet.dogeInDogePool,
        dfiInDogePool: this.wallet.dfiInDogePool,
        bchInBchPool: this.wallet.bchInBchPool,
        dfiInBchPool: this.wallet.dfiInBchPool,
        usdInUsdPool: this.wallet.usdInUsdPool,
        dfiInUsdPool: this.wallet.dfiInUsdPool,
        tslaInTslaPool: this.wallet.tslaInTslaPool,
        usdInTslaPool: this.wallet.usdInTslaPool,
        spyInSpyPool : this.wallet.spyInSpyPool,
        usdInSpyPool : this.wallet.usdInSpyPool,
        qqqInQqqPool : this.wallet.qqqInQqqPool,
        usdInQqqPool : this.wallet.usdInQqqPool,
        pltrInPltrPool : this.wallet.pltrInPltrPool,
        usdInPltrPool : this.wallet.usdInPltrPool,
        slvInSlvPool : this.wallet.slvInSlvPool,
        usdInSlvPool : this.wallet.usdInSlvPool,
        aaplInAaplPool : this.wallet.aaplInAaplPool,
        usdInAaplPool : this.wallet.usdInAaplPool,
        gldInGldPool : this.wallet.gldInGldPool,
        usdInGldPool : this.wallet.usdInGldPool,
        gmeInGmePool : this.wallet.gmeInGmePool,
        usdInGmePool : this.wallet.usdInGmePool,
        googlInGooglPool : this.wallet.googlInGooglPool,
        usdInGooglPool : this.wallet.usdInGooglPool,
        arkkInArkkPool : this.wallet.arkkInArkkPool,
        usdInArkkPool : this.wallet.usdInArkkPool,
        babaInBabaPool : this.wallet.babaInBabaPool,
        usdInBabaPool : this.wallet.usdInBabaPool,
        vnqInVnqPool : this.wallet.vnqInVnqPool,
        usdInVnqPool : this.wallet.usdInVnqPool,
        urthInUrthPool : this.wallet.urthInUrthPool,
        usdInUrthPool : this.wallet.usdInUrthPool,
        tltInTltPool : this.wallet.tltInTltPool,
        usdInTltPool : this.wallet.usdInTltPool,
        pdbcInPdbcPool : this.wallet.pdbcInPdbcPool,
        usdInPdbcPool : this.wallet.usdInPdbcPool,

        amznInAmznPool : this.wallet.amznInAmznPool,
        usdInAmznPool : this.wallet.usdInAmznPool,
        nvdaInNvdaPool : this.wallet.nvdaInNvdaPool,
        usdInNvdaPool : this.wallet.usdInNvdaPool,
        coinInCoinPool : this.wallet.coinInCoinPool,
        usdInCoinPool : this.wallet.usdInCoinPool,
        eemInEemPool : this.wallet.eemInEemPool,
        usdInEemPool : this.wallet.usdInEemPool,

        msftInMsftPool : this.wallet.msftInMsftPool,
        usdInMsftPool : this.wallet.usdInMsftPool,
        fbInFbPool : this.wallet.fbInFbPool,
        usdInFbPool : this.wallet.usdInFbPool,
        nflxInNflxPool : this.wallet.nflxInNflxPool,
        usdInNflxPool : this.wallet.usdInNflxPool,
        vooInVooPool : this.wallet.vooInVooPool,
        usdInVooPool : this.wallet.usdInVooPool,

        disInDisPool : this.wallet.disInDisPool,
        usdInDisPool : this.wallet.usdInDisPool,
        mchiInMchiPool : this.wallet.mchiInMchiPool,
        usdInMchiPool : this.wallet.usdInMchiPool,
        mstrInMstrPool : this.wallet.mstrInMstrPool,
        usdInMstrPool : this.wallet.usdInMstrPool,
        intcInIntcPool : this.wallet.intcInIntcPool,
        usdInIntcPool : this.wallet.usdInIntcPool,

        pyplInPyplPool : this.wallet.pyplInPyplPool,
        usdInPyplPool : this.wallet.usdInPyplPool,
        brkbInBrkbPool : this.wallet.brkbInBrkbPool,
        usdInBrkbPool : this.wallet.usdInBrkbPool,
        koInKoPool : this.wallet.koInKoPool,
        usdInKoPool : this.wallet.usdInKoPool,
        pgInPgPool : this.wallet.pgInPgPool,
        usdInPgPool : this.wallet.usdInPgPool,

        sapInSapPool : this.wallet.sapInSapPool,
        usdInSapPool : this.wallet.usdInSapPool,
        uraInUraPool : this.wallet.uraInUraPool,
        usdInUraPool : this.wallet.usdInUraPool,
        csInCsPool : this.wallet.csInCsPool,
        usdInCsPool : this.wallet.usdInCsPool,
        gsgInGsgPool : this.wallet.gsgInGsgPool,
        usdInGsgPool : this.wallet.usdInGsgPool,

        ppltInPpltPool : this.wallet.ppltInPpltPool,
        usdInPpltPool : this.wallet.usdInPpltPool,
        govtInGovtPool : this.wallet.govtInGovtPool,
        usdInGovtPool : this.wallet.usdInGovtPool,
        tanInTanPool : this.wallet.tanInTanPool,
        usdInTanPool : this.wallet.usdInTanPool,
        xomInXomPool : this.wallet.xomInXomPool,
        usdInXomPool : this.wallet.usdInXomPool

      },
    }).subscribe((result: any) => {
      if (result?.data?.updateUser) {
        this.successBackend = 'User updated';
        setInterval(() => {
          this.successBackend = null;
        }, 5000);
      }
    }, (error) => {
      console.log('there was an error sending mutation update', error);
      this.errorBackend = error.message;
      setInterval(() => {
        this.errorBackend = null;
      }, 5000);
    });

    localStorage.removeItem(this.adressesKey);
    localStorage.removeItem(this.adressesMasternodesKey);

  }

  logout(): void {
    this.loggedInAuth = '';
    this.loggedIn = false;
    localStorage.removeItem(this.loggedInKey);
    this.wallet = new Wallet();
    this.dfiInStaking = 0;
    this.adresses = [];
    localStorage.removeItem(this.adressesKey);
    localStorage.removeItem(this.adressesMasternodesKey);
  }

  toggleMenu(): void {
    this.menu = !this.menu;
  }

  loadDataFromServerForOneAdress(): void {
    this.loggedIn = true;
    this.loggedInAuth = 'ADDRESS';
    localStorage.setItem(this.loggedInKey, this.loggedInAuth);

    this.addressesDto = new Array(this.oneTrackingAddress);
    this.adresses = this.addressesDto.slice();

    this.loadAddressesAndDexData();

    if (!this.currentPage) {
      this.handlePage('dashboard');
    }

    this.successBackend = 'Data Loaded!';
    setInterval(() => {
      this.successBackend = null;
    }, 5000);

  }

  loadDataFromServerAndLoadAllStuffAuthKeyFromUrl(): void {
      this.apollo.query({
        query: LOGIN,
        variables: {
          key: this.authKeyOverUrl,
        },
      }).subscribe((result: any) => {
        if (result?.data?.userByKey) {

          this.parseWallet(result);
          this.parseAddresses(result);
          this.loadAddressesAndDexData();
          this.newsletter = result?.data?.userByKey.newsletter;

          this.successBackend = 'Data Loaded!';
          setInterval(() => {
            this.successBackend = null;
          }, 5000);

        } else {
          this.errorBackend = 'No users found';
          this.logout();
          setInterval(() => {
            this.errorBackend = null;
          }, 5000);
        }
      }, (error) => {
        this.errorBackend = error.message;
        setInterval(() => {
          this.errorBackend = null;
        }, 5000);
      });
    }

  private parseAddresses(result: any): void {
    this.addressesDto = new Array(...result?.data?.userByKey?.addresses);
    this.adresses = this.addressesDto.slice();

    this.addressesMasternodesDto = new Array(...result?.data?.userByKey?.addressesMasternodes);
    this.adressesMasternodes = this.addressesMasternodesDto.slice();

    this.adressesMasternodesFreezer5Dto = new Array(...result?.data?.userByKey?.adressesMasternodesFreezer5);
    this.adressesMasternodesFreezer5 = this.adressesMasternodesFreezer5Dto.slice();

    this.adressesMasternodesFreezer10Dto = new Array(...result?.data?.userByKey?.adressesMasternodesFreezer10);
    this.adressesMasternodesFreezer10 = this.adressesMasternodesFreezer10Dto.slice();
  }

  private parseWallet(result: any): void {
    this.walletDTO = result?.data?.userByKey.wallet;
    this.dfiInStaking = this.walletDTO.dfiInStaking;
    this.dfiInDfxStaking = this.walletDTO.dfiInDfxStaking;
    if (!this.autoLoadData) {
      this.wallet = this.copyValues(this.walletDTO);
    }
  }

  loadDataFromServerAndLoadAllStuff(): void {
    if (this.loggedInAuthInput || this.loggedInAuth) {
      this.apollo.query({
        query: LOGIN,
        variables: {
          key: this.loggedInAuthInput ? this.loggedInAuthInput : this.loggedInAuth,
        },
      }).subscribe((result: any) => {
        if (result?.data?.userByKey) {
          this.loggedInAuth = this.loggedInAuthInput ? this.loggedInAuthInput : this.loggedInAuth;
          this.loggedIn = true;
          localStorage.setItem(this.loggedInKey, this.loggedInAuth);

          this.parseWallet(result);
          this.parseAddresses(result);
          this.loadAddressesAndDexData();
          this.newsletter = result?.data?.userByKey.newsletter;

          this.successBackend = 'Data Loaded!';
          setInterval(() => {
            this.successBackend = null;
          }, 5000);

        } else {
          this.errorBackend = 'No users found';
          this.logout();
          setInterval(() => {
            this.errorBackend = null;
          }, 5000);
        }
      }, (error) => {
        this.errorBackend = error.message;
        setInterval(() => {
          this.errorBackend = null;
        }, 5000);
      });
    }
  }

  login(): void {
    this.dataLoaded = false;
    this.loadDataFromServerAndLoadAllStuff();
  }


  onChangeRefreshS(): void {
    localStorage.setItem(this.sCountdownKey, JSON.stringify(this.sCountdown));
    this.sCountdownShow = this.sCountdown;
    this.countdown?.restart();
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.refresh();
    }, this.sCountdown * 1000);
    window.location.reload();
  }

  saveToggleAutoLoad(): void {
    localStorage.setItem(this.autoLoadDataKey, JSON.stringify(this.autoLoadData));
    this.matomoTracker.trackEvent('Klick', 'Change Input Type', JSON.stringify(this.autoLoadData));
    this.refresh();
  }

  saveToggleSettingsLoad(): void {
    localStorage.setItem(this.showSettingsAreaKey, JSON.stringify(this.showSettingsArea));
    this.matomoTracker.trackEvent('Klick', 'Change Show Settings', JSON.stringify(this.showSettingsArea));
  }

  saveInputStaking(): void {
    localStorage.setItem(this.stakingApyKey, JSON.stringify(this.stakingApy));
    this.berechneStakingOut();
    this.berechnePoolOut();
    this.berechneAllOut();
    this.buildDataForChartIncome();

  }

  saveToggleInputShow(): void {
    localStorage.setItem(this.showInputAreaKey, JSON.stringify(this.showInputArea));
    this.matomoTracker.trackEvent('Klick', 'Change Show Input', JSON.stringify(this.showSettingsArea));
  }

  async computeMeta(): Promise<void> {

    // Stats
    this.rewards = new Stats();

    try {
      const promiseStats = await this.dexService.getStats().toPromise();
      this.apiOnline = true;

      this.setStats(promiseStats);

      this.poolPairsOcean = await this.dexService.getPoolPairsOcean().toPromise();
      this.extractPools();
      const prices = await this.dexService.getPrices().toPromise();
      this.computePrices(prices);

      // if fixed blocktime to 30 s
      this.blocktimeInS = 30;
      this.blocktimeInSSecond = 30;
      this.blocktimeFirstLastSecond = 30;

    } catch (err) {
      console.error('Api down?' + err.message);
      this.apiOnline = false;
    }

  }

  private setStats(promiseStats: OceanStats): void {
    this.rewards = new Stats();
    this.rewards.blockHeight = promiseStats?.data?.count?.blocks;
    this.rewards.rewards = new Rewards();
    this.rewards.rewards.community = promiseStats?.data?.emission?.community;
    this.rewards.rewards.anchor = promiseStats?.data?.emission.anchor;
    this.rewards.rewards.liquidity = promiseStats?.data?.emission.dex;
    this.rewards.rewards.minter = promiseStats?.data?.emission.masternode;
    this.rewards.rewards.total = promiseStats?.data?.emission.total;
    this.rewards.rewards.liquidityStocks = promiseStats?.data?.emission.total * 0.2468;
    this.dfiPorBlockStock = promiseStats?.data?.emission.total * 0.2468;
    this.oceanStats = promiseStats;
  }

  loadDex(): void {
    this.parsePoolsAndComputeOutcome();
  }

  private parsePoolsAndComputeOutcome(): void {

    this.loadDfxStaking();

    this.cryptoPools = new Array<Pool>();
    this.stocksPools = new Array<Pool>();

    this.createCryptoPoolsArray();
    this.createStockArray();

    this.computeRewardsPerBlockInPools();

    this.berechnePoolOutBtc();
    this.berechnePoolOutEth();
    this.berechnePoolOutBch();
    this.berechnePoolOutLtc();
    this.berechnePoolOutUsdt();
    this.berechnePoolOutUsdc();
    this.berechnePoolOutDoge();

    if (this.poolUsd) {
      this.berechnePoolOutUsd();
    }
    if (this.poolUsdUsdc) {
      this.berechnePoolOutUsdUsdc();
    }
    if (this.poolUsdUsdt) {
      this.berechnePoolOutUsdUsdt();
    }
    if (this.poolTsla) {
      this.berechnePoolOutTsla();
    }
    if (this.poolQqq) {
      this.berechnePoolOutQqq();
    }
    if (this.poolSpy) {
      this.berechnePoolOutSpy();
    }
    if (this.poolPltr) {
      this.berechnePoolOutPltr();
    }
    if (this.poolSlv) {
      this.berechnePoolOutSlv();
    }
    if (this.poolAapl) {
      this.berechnePoolOutAapl();
    }
    if (this.poolGld) {
      this.berechnePoolOutGld();
    }
    if (this.poolGme) {
      this.berechnePoolOutGme();
    }
    if (this.poolGoogl) {
      this.berechnePoolOutGoogl();
    }
    if (this.poolArkk) {
      this.berechnePoolOutArkk();
    }
    if (this.poolBaba) {
      this.berechnePoolOutBaba();
    }
    if (this.poolVnq) {
      this.berechnePoolOutVnq();
    }
    if (this.poolUrth) {
      this.berechnePoolOutUrth();
    }
    if (this.poolTlt) {
      this.berechnePoolOutTlt();
    }
    if (this.poolPdbc) {
      this.berechnePoolOutPdbc();
    }
    // 1.2.2022
    if (this.poolAmzn) {
      this.berechnePoolOutAmzn();
    }
    if (this.poolNvda) {
      this.berechnePoolOutNvda();
    }
    if (this.poolCoin) {
      this.berechnePoolOutCoin();
    }
    if (this.poolEem) {
      this.berechnePoolOutEem();
    }
    // 3.3.2022
    if (this.poolMsft) {
      this.berechnePoolOutMsft();
    }
    if (this.poolFb) {
      this.berechnePoolOutFb();
    }
    if (this.poolVoo) {
      this.berechnePoolOutVoo();
    }
    if (this.poolNflx) {
      this.berechnePoolOutNflx();
    }

    // 30.3.2022
    if (this.poolDis) {
      this.berechnePoolOutDis();
    }
    if (this.poolMchi) {
      this.berechnePoolOutMchi();
    }
    if (this.poolMstr) {
      this.berechnePoolOutMstr();
    }
    if (this.poolIntc) {
      this.berechnePoolOutIntc();
    }

    // 28.4.2022
    if (this.poolPypl) {
      this.berechnePoolOutPypl();
    }
    if (this.poolBrkb) {
      this.berechnePoolOutBrkb();
    }
    if (this.poolKo) {
      this.berechnePoolOutKo();
    }
    if (this.poolPg) {
      this.berechnePoolOutPg();
    }

    // 28.5.2022
    if (this.poolSap) {
      this.berechnePoolOutSap();
    }
    if (this.poolUra) {
      this.berechnePoolOutUra();
    }
    if (this.poolCs) {
      this.berechnePoolOutCs();
    }
    if (this.poolGsg) {
      this.berechnePoolOutGsg();
    }

    // 28.6.2022
    if (this.poolPplt) {
      this.berechnePoolOutPplt();
    }
    if (this.poolGovt) {
      this.berechnePoolOutGovt();
    }
    if (this.poolTan) {
      this.berechnePoolOutTan();
    }
    if (this.poolXom) {
      this.berechnePoolOutXom();
    }

    // 28.7.2022
    if (this.poolJnj) {
      this.berechnePoolOutJnj();
    }
    if (this.poolAddyy) {
      this.berechnePoolOutAddyy();
    }
    if (this.poolGs) {
      this.berechnePoolOutGs();
    }
    if (this.poolDax) {
      this.berechnePoolOutDax();
    }

    this.berechneStakingOut();
    this.berechneMNOut();
    this.berechnePoolOut();
    this.berechneAllOut();


    this.createIncomePools();
    this.dataService.setBtcUsd(this.poolBtc.priceA);
    this.dataService.setEthUsd(this.poolEth.priceA);
    this.dataService.setDfiUsd(this.poolBtc.priceB);
    this.dataLoaded = true;
    this.avgApr = this.getAPRAverage();
    if (this.apiOnline) {
      this.update();
    }
    this.spinner.hide();
  }

  private computePrices(prices: Prices): void {
    this.priceDFICEX = +prices.data.find(p => p.price.token === 'DFI')?.price?.aggregated?.amount;
    this.poolBtc.priceA = +prices.data.find(p => p.price.token === 'BTC')?.price?.aggregated?.amount;
    // compute correct price of dfi from btc pool
    this.poolBtc.priceB = this.poolBtc.totalLiquidityUsd / +this.poolBtc.reserveB / 2;
    this.poolEth.priceA = +prices.data.find(p => p.price.token === 'ETH')?.price?.aggregated?.amount;
    this.poolEth.priceB = this.poolEth.totalLiquidityUsd / +this.poolEth.reserveB / 2;
    this.poolLtc.priceA = +prices.data.find(p => p.price.token === 'LTC')?.price?.aggregated?.amount;
    this.poolLtc.priceB = this.poolLtc.totalLiquidityUsd / +this.poolLtc.reserveB / 2;
    this.poolDoge.priceA = +prices.data.find(p => p.price.token === 'DOGE')?.price?.aggregated?.amount;
    this.poolDoge.priceB = this.poolDoge.totalLiquidityUsd / +this.poolDoge.reserveB / 2;
    this.poolUsdt.priceA = +prices.data.find(p => p.price.token === 'USDT')?.price?.aggregated?.amount;
    this.poolUsdt.priceB = this.poolUsdt.totalLiquidityUsd / +this.poolUsdt.reserveB / 2;
    this.poolUsdc.priceA = +prices.data.find(p => p.price.token === 'USDC')?.price?.aggregated?.amount;
    this.poolUsdc.priceB = this.poolUsdc.totalLiquidityUsd / +this.poolUsdc.reserveB / 2;
    this.poolBch.priceA = +prices.data.find(p => p.price.token === 'BCH')?.price?.aggregated?.amount;
    this.poolBch.priceB = this.poolBch.totalLiquidityUsd / +this.poolBch.reserveB / 2;
  }

  private extractPools(): void {
    this.poolBtc = this.setFromPoolPair('5');
    this.poolEth = this.setFromPoolPair('4');
    this.poolUsdt = this.setFromPoolPair('6');
    this.poolUsdc = this.setFromPoolPair('14');
    this.poolLtc = this.setFromPoolPair('10');
    this.poolDoge = this.setFromPoolPair('8');
    this.poolBch = this.setFromPoolPair('12');
    this.poolUsd = this.setFromPoolPair('17');
    this.poolUsdUsdc = this.setFromPoolPair('102');
    this.poolUsdUsdt = this.setFromPoolPair('101');

    this.poolTsla = this.setFromPoolPair('114');
    this.poolQqq = this.setFromPoolPair('39');
    this.poolSpy = this.setFromPoolPair('38');
    this.poolPltr = this.setFromPoolPair('35');
    this.poolSlv = this.setFromPoolPair('46');
    this.poolAapl = this.setFromPoolPair('36');
    this.poolGld = this.setFromPoolPair('43');
    this.poolGme = this.setFromPoolPair('104');
    this.poolGoogl = this.setFromPoolPair('100');
    this.poolArkk = this.setFromPoolPair('42');
    this.poolBaba = this.setFromPoolPair('33');
    this.poolVnq = this.setFromPoolPair('41');
    this.poolUrth = this.setFromPoolPair('44');
    this.poolTlt = this.setFromPoolPair('45');
    this.poolPdbc = this.setFromPoolPair('40');
    // 1.2.2022
    this.poolAmzn = this.setFromPoolPair('90');
    this.poolEem = this.setFromPoolPair('53');
    this.poolNvda = this.setFromPoolPair('55');
    this.poolCoin = this.setFromPoolPair('56');
    // 3.3.2022
    this.poolMsft = this.setFromPoolPair('61');
    this.poolFb = this.setFromPoolPair('64');
    this.poolNflx = this.setFromPoolPair('62');
    this.poolVoo = this.setFromPoolPair('63');
    // 30.3.2022
    this.poolDis = this.setFromPoolPair('69');
    this.poolMchi = this.setFromPoolPair('70');
    this.poolMstr = this.setFromPoolPair('71');
    this.poolIntc = this.setFromPoolPair('72');
    // 28.4.2022
    this.poolPypl = this.setFromPoolPair('77');
    this.poolBrkb = this.setFromPoolPair('78');
    this.poolKo = this.setFromPoolPair('80');
    this.poolPg = this.setFromPoolPair('79');
    // 28.5.2022
    this.poolSap = this.setFromPoolPair('85');
    this.poolCs = this.setFromPoolPair('88');
    this.poolGsg = this.setFromPoolPair('86');
    this.poolUra = this.setFromPoolPair('87');
    // 28.6.2022
    this.poolPplt = this.setFromPoolPair('95');
    this.poolGovt = this.setFromPoolPair('98');
    this.poolTan = this.setFromPoolPair('96');
    this.poolXom = this.setFromPoolPair('97');

    // 28.7.2022
    this.poolJnj = this.setFromPoolPair('110');
    this.poolAddyy = this.setFromPoolPair('111');
    this.poolGs = this.setFromPoolPair('112');
    this.poolDax = this.setFromPoolPair('109');

    this.pools = this.addAllPools();
  }

  private addAllPools(): Array<Pool> {

    const pools = new Array<Pool>();

    pools.push(this.poolBtc);
    pools.push(this.poolEth);
    pools.push(this.poolLtc);
    pools.push(this.poolBch);
    pools.push(this.poolLtc);
    pools.push(this.poolDoge);
    pools.push(this.poolUsdt);
    pools.push(this.poolUsdc);
    pools.push(this.poolUsd);
    pools.push(this.poolUsdUsdc);
    pools.push(this.poolUsdUsdt);
    pools.push(this.poolTsla);
    pools.push(this.poolQqq);
    pools.push(this.poolSpy);
    pools.push(this.poolPltr);
    pools.push(this.poolSlv);
    pools.push(this.poolAapl);
    pools.push(this.poolGld);
    pools.push(this.poolGme);
    pools.push(this.poolGoogl);
    pools.push(this.poolArkk);
    pools.push(this.poolBaba);
    pools.push(this.poolVnq);
    pools.push(this.poolUrth);
    pools.push(this.poolTlt);
    pools.push(this.poolPdbc);
    // 1.2.2022
    pools.push(this.poolEem);
    pools.push(this.poolAmzn);
    pools.push(this.poolNvda);
    pools.push(this.poolCoin);
    // 3.3.2022
    pools.push(this.poolFb);
    pools.push(this.poolMsft);
    pools.push(this.poolNflx);
    pools.push(this.poolVoo);
    // 30.3.2022
    pools.push(this.poolDis);
    pools.push(this.poolMchi);
    pools.push(this.poolMstr);
    pools.push(this.poolIntc);
    // 28.4.2022
    pools.push(this.poolPypl);
    pools.push(this.poolBrkb);
    pools.push(this.poolKo);
    pools.push(this.poolPg);

    // 28.5.2022
    pools.push(this.poolSap);
    pools.push(this.poolCs);
    pools.push(this.poolGsg);
    pools.push(this.poolUra);

    // 28.6.2022
    pools.push(this.poolXom);
    pools.push(this.poolGovt);
    pools.push(this.poolTan);
    pools.push(this.poolPplt);

    // 28.7.2022
    pools.push(this.poolJnj);
    pools.push(this.poolAddyy);
    pools.push(this.poolGs);
    pools.push(this.poolDax);

    return pools;
  }

  private createStockArray(): void {

    this.stocksPools.push(this.poolUsd);
    this.stocksPools.push(this.poolTsla);
    this.stocksPools.push(this.poolQqq);
    this.stocksPools.push(this.poolSpy);
    this.stocksPools.push(this.poolPltr);
    this.stocksPools.push(this.poolSlv);
    this.stocksPools.push(this.poolAapl);
    this.stocksPools.push(this.poolGld);
    this.stocksPools.push(this.poolGme);
    this.stocksPools.push(this.poolGoogl);
    this.stocksPools.push(this.poolArkk);
    this.stocksPools.push(this.poolBaba);
    this.stocksPools.push(this.poolVnq);
    this.stocksPools.push(this.poolUrth);
    this.stocksPools.push(this.poolTlt);
    this.stocksPools.push(this.poolPdbc);
    // 1.2.2022
    this.stocksPools.push(this.poolEem);
    this.stocksPools.push(this.poolAmzn);
    this.stocksPools.push(this.poolNvda);
    this.stocksPools.push(this.poolCoin);
    // 3.3.2022
    this.stocksPools.push(this.poolMsft);
    this.stocksPools.push(this.poolFb);
    this.stocksPools.push(this.poolNflx);
    this.stocksPools.push(this.poolVoo);
    // 30.3.2022
    this.stocksPools.push(this.poolDis);
    this.stocksPools.push(this.poolMchi);
    this.stocksPools.push(this.poolMstr);
    this.stocksPools.push(this.poolIntc);
    // 28.4.2022
    this.stocksPools.push(this.poolPypl);
    this.stocksPools.push(this.poolBrkb);
    this.stocksPools.push(this.poolKo);
    this.stocksPools.push(this.poolPg);

    // 28.5.2022
    this.stocksPools.push(this.poolSap);
    this.stocksPools.push(this.poolCs);
    this.stocksPools.push(this.poolGsg);
    this.stocksPools.push(this.poolUra);

    // 28.6.2022
    this.stocksPools.push(this.poolXom);
    this.stocksPools.push(this.poolGovt);
    this.stocksPools.push(this.poolTan);
    this.stocksPools.push(this.poolPplt);

    // 28.7.2022
    this.stocksPools.push(this.poolJnj);
    this.stocksPools.push(this.poolAddyy);
    this.stocksPools.push(this.poolGs);
    this.stocksPools.push(this.poolDax);
  }

  private createCryptoPoolsArray(): void {
    this.cryptoPools.push(this.poolBtc);
    this.cryptoPools.push(this.poolEth);
    this.cryptoPools.push(this.poolLtc);
    this.cryptoPools.push(this.poolBch);
    this.cryptoPools.push(this.poolDoge);
    this.cryptoPools.push(this.poolUsdt);
    this.cryptoPools.push(this.poolUsdc);
    this.cryptoPools.push(this.poolUsdUsdc);
    this.cryptoPools.push(this.poolUsdUsdt);
  }

  private computeRewardsPerBlockInPools(): void {

    // CRYPTO
    this.dfiProBlockBtc = this.poolBtc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockBtc += this.getCommission(this.poolBtc);

    this.dfiProBlockEth = this.poolEth.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockEth += this.getCommission(this.poolEth);

    this.dfiProBlockLtc = this.poolLtc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockLtc += this.getCommission(this.poolLtc);

    this.dfiProBlockUsdt = this.poolUsdt.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockUsdt += this.getCommission(this.poolUsdt);

    this.dfiProBlockUsdc = this.poolUsdc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockUsdc += this.getCommission(this.poolUsdc);

    this.dfiProBlockDoge = this.poolDoge.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockDoge += this.getCommission(this.poolDoge);

    this.dfiProBlockBch = this.poolBch.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockBch += this.getCommission(this.poolBch);

    this.dfiProBlockUsdUsdc = 0.09 * this.dfiPorBlockStock;
    this.dfiProBlockUsdUsdc += this.getCommission(this.poolUsdUsdc);

    this.dfiProBlockUsdUsdt = 0.09 * this.dfiPorBlockStock;
    this.dfiProBlockUsdUsdt += this.getCommission(this.poolUsdUsdt);

    // STOCKS
    this.dfiProBlockUsd = 0.32 * this.dfiPorBlockStock;
    this.dfiProBlockUsd += this.getCommission(this.poolUsd);

    this.dfiProBlockTsla = 0.0499 * this.dfiPorBlockStock;
    this.dfiProBlockTsla += this.getCommission(this.poolTsla);

    this.dfiProBlockQqq = 0.035 * this.dfiPorBlockStock;
    this.dfiProBlockQqq += this.getCommission(this.poolQqq);

    this.dfiProBlockSpy = 0.0545 * this.dfiPorBlockStock;
    this.dfiProBlockSpy += this.getCommission(this.poolSpy);

    this.dfiProBlockAapl = 0.0241 * this.dfiPorBlockStock;
    this.dfiProBlockAapl += this.getCommission(this.poolAapl);

    this.dfiProBlockPltr = 0.0119 * this.dfiPorBlockStock;
    this.dfiProBlockPltr += this.getCommission(this.poolPltr);

    this.dfiProBlockSlv = 0.0048 * this.dfiPorBlockStock;
    this.dfiProBlockSlv += this.getCommission(this.poolSlv);

    this.dfiProBlockGld = 0.004 * this.dfiPorBlockStock;
    this.dfiProBlockGld += this.getCommission(this.poolGld);

    this.dfiProBlockGme = 0.0145 * this.dfiPorBlockStock;
    this.dfiProBlockGme += this.getCommission(this.poolGme);

    this.dfiProBlockGoogle = 0.0118 * this.dfiPorBlockStock;
    this.dfiProBlockGoogle += this.getCommission(this.poolGoogl);

    this.dfiProBlockArkk = 0.0105 * this.dfiPorBlockStock;
    this.dfiProBlockArkk += this.getCommission(this.poolArkk);

    this.dfiProBlockBaba = 0.0126 * this.dfiPorBlockStock;
    this.dfiProBlockBaba += this.getCommission(this.poolBaba);

    this.dfiProBlockVnq = 0.0035 * this.dfiPorBlockStock;
    this.dfiProBlockVnq += this.getCommission(this.poolVnq);

    this.dfiProBlockUrth = 0.0023 * this.dfiPorBlockStock;
    this.dfiProBlockUrth += this.getCommission(this.poolUrth);

    this.dfiProBlockTlt = 0.006 * this.dfiPorBlockStock;
    this.dfiProBlockTlt += this.getCommission(this.poolTlt);

    this.dfiProBlockPdbc = 0.004 * this.dfiPorBlockStock;
    this.dfiProBlockPdbc += this.getCommission(this.poolPdbc);

    // STOCKS 1.2.2022
    this.dfiProBlockAmzn = 0.0201 * this.dfiPorBlockStock;
    this.dfiProBlockAmzn += this.getCommission(this.poolAmzn);

    this.dfiProBlockNvda = 0.0241 * this.dfiPorBlockStock;
    this.dfiProBlockNvda += this.getCommission(this.poolNvda);

    this.dfiProBlockCoin = 0.0204 * this.dfiPorBlockStock;
    this.dfiProBlockCoin += this.getCommission(this.poolCoin);

    this.dfiProBlockEem = 0.0066 * this.dfiPorBlockStock;
    this.dfiProBlockEem += this.getCommission(this.poolEem);

    // STOCKS 3.3.2022
    this.dfiProBlockMsft = 0.0164 * this.dfiPorBlockStock;
    this.dfiProBlockMsft += this.getCommission(this.poolMsft);

    this.dfiProBlockNflx = 0.0113 * this.dfiPorBlockStock;
    this.dfiProBlockNflx += this.getCommission(this.poolNflx);

    this.dfiProBlockVoo = 0.006 * this.dfiPorBlockStock;
    this.dfiProBlockVoo += this.getCommission(this.poolVoo);

    this.dfiProBlockFb = 0.0148 * this.dfiPorBlockStock;
    this.dfiProBlockFb += this.getCommission(this.poolFb);

    // STOCKS 30.3.2022
    this.dfiProBlockDis = this.getRewardIsOn(this.poolDis) ? 0.0072 * this.dfiPorBlockStock : 0;
    this.dfiProBlockDis += this.getCommission(this.poolDis);

    this.dfiProBlockMchi = this.getRewardIsOn(this.poolMchi) ? 0.0047 * this.dfiPorBlockStock : 0;
    this.dfiProBlockMchi += this.getCommission(this.poolMchi);

    this.dfiProBlockMstr = this.getRewardIsOn(this.poolMstr) ? 0.0171 * this.dfiPorBlockStock : 0;
    this.dfiProBlockMstr += this.getCommission(this.poolMstr);

    this.dfiProBlockIntc = this.getRewardIsOn(this.poolIntc) ? 0.0086 * this.dfiPorBlockStock : 0;
    this.dfiProBlockIntc += this.getCommission(this.poolIntc);

    // STOCKS 28.4.2022
    this.dfiProBlockPypl = this.getRewardIsOn(this.poolPypl) ? 0.0116 * this.dfiPorBlockStock : 0;
    this.dfiProBlockPypl += this.getCommission(this.poolPypl);

    this.dfiProBlockBrkb = this.getRewardIsOn(this.poolBrkb) ? 0.0051 * this.dfiPorBlockStock : 0;
    this.dfiProBlockBrkb += this.getCommission(this.poolBrkb);

    this.dfiProBlockKo = this.getRewardIsOn(this.poolKo) ? 0.0042 * this.dfiPorBlockStock : 0;
    this.dfiProBlockKo += this.getCommission(this.poolKo);

    this.dfiProBlockPg = this.getRewardIsOn(this.poolPg) ? 0.0049 * this.dfiPorBlockStock : 0;
    this.dfiProBlockPg += this.getCommission(this.poolPg);

    // STOCKS 28.5.2022
    this.dfiProBlockSap = this.getRewardIsOn(this.poolSap) ? 0.0042 * this.dfiPorBlockStock : 0;
    this.dfiProBlockSap += this.getCommission(this.poolSap);

    this.dfiProBlockUra = this.getRewardIsOn(this.poolUra) ? 0.007 * this.dfiPorBlockStock : 0;
    this.dfiProBlockUra += this.getCommission(this.poolUra);

    this.dfiProBlockCs = this.getRewardIsOn(this.poolCs) ? 0.0067 * this.dfiPorBlockStock : 0;
    this.dfiProBlockCs += this.getCommission(this.poolCs);

    this.dfiProBlockGsg = this.getRewardIsOn(this.poolGsg) ? 0.0043 * this.dfiPorBlockStock : 0;
    this.dfiProBlockGsg += this.getCommission(this.poolGsg);

    // STOCKS 28.6.2022
    this.dfiProBlockGovt = this.getRewardIsOn(this.poolGovt) ? 0.0023 * this.dfiPorBlockStock : 0;
    this.dfiProBlockGovt += this.getCommission(this.poolGovt);

    this.dfiProBlockPplt = this.getRewardIsOn(this.poolPplt) ? 0.0058 * this.dfiPorBlockStock : 0;
    this.dfiProBlockPplt += this.getCommission(this.poolPplt);

    this.dfiProBlockXom = this.getRewardIsOn(this.poolXom) ? 0.0092 * this.dfiPorBlockStock : 0;
    this.dfiProBlockXom += this.getCommission(this.poolXom);

    this.dfiProBlockTan = this.getRewardIsOn(this.poolTan) ? 0.0066 * this.dfiPorBlockStock : 0;
    this.dfiProBlockTan += this.getCommission(this.poolTan);

    // STOCKS 28.7.2022
    this.dfiProBlockJnj = this.getRewardIsOn(this.poolJnj) ? 0.0046 * this.dfiPorBlockStock : 0;
    this.dfiProBlockJnj += this.getCommission(this.poolJnj);

    this.dfiProBlockGs = this.getRewardIsOn(this.poolGs) ? 0.0057 * this.dfiPorBlockStock : 0;
    this.dfiProBlockGs += this.getCommission(this.poolGs);

    this.dfiProBlockAddyy = this.getRewardIsOn(this.poolAddyy) ? 0.0058 * this.dfiPorBlockStock : 0;
    this.dfiProBlockAddyy += this.getCommission(this.poolAddyy);

    this.dfiProBlockDax = this.getRewardIsOn(this.poolDax) ? 0.0053 * this.dfiPorBlockStock : 0;
    this.dfiProBlockDax += this.getCommission(this.poolDax);
  }

  getIncomePools(): Array<PoolIncomeValue> {
    return this.poolIncomeList.sort((a, b) => (a.poolOut.dfiPerMonth > b.poolOut.dfiPerMonth) ? -1
      : ((b.poolOut.dfiPerMonth > a.poolOut.dfiPerMonth) ? 1 : 0));
  }

  createIncomePools(): void {

    this.poolIncomeList = new Array<PoolIncomeValue>();

    // CRYPTO
    if (this.anteilAmPoolBtc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolBtc,
        this.poolBtc, this.poolBtcOut, this.dfiProBlockBtc));
    }
    if (this.anteilAmPoolEth > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolEth,
        this.poolEth, this.poolEthOut, this.dfiProBlockEth));
    }
    if (this.anteilAmPoolUsdt > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsdt,
        this.poolUsdt, this.poolUsdtOut, this.dfiProBlockUsdt));
    }
    if (this.anteilAmPoolUsdUsdt > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsdUsdt,
        this.poolUsdUsdt, this.poolUsdUsdtOut, this.dfiProBlockUsdUsdt));
    }
    if (this.anteilAmPoolUsdc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsdc,
        this.poolUsdc, this.poolUsdcOut, this.dfiProBlockUsdc));
    }
    if (this.anteilAmPoolUsdUsdc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsdUsdc,
        this.poolUsdUsdc, this.poolUsdUsdcOut, this.dfiProBlockUsdUsdc));
    }
    if (this.anteilAmPoolUsd > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsd,
        this.poolUsd, this.poolUsdOut, this.dfiProBlockUsd));
    }
    if (this.anteilAmPoolLtc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolLtc,
        this.poolLtc, this.poolLtcOut, this.dfiProBlockLtc));
    }
    if (this.anteilAmPoolDoge > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolDoge,
        this.poolDoge, this.poolDogeOut, this.dfiProBlockDoge));
    }
    if (this.anteilAmPoolBch > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolBch,
        this.poolBch, this.poolBchOut, this.dfiProBlockBch));
    }
    // STOCKS
    if (this.anteilAmPoolTsla > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolTsla,
        this.poolTsla, this.poolTslaOut, this.dfiProBlockTsla));
    }
    if (this.anteilAmPoolSpy > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolSpy,
        this.poolSpy, this.poolSpyOut, this.dfiProBlockSpy));
    }
    if (this.anteilAmPoolQqq > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolQqq,
        this.poolQqq, this.poolQqqOut, this.dfiProBlockQqq));
    }
    if (this.anteilAmPoolPltr > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolPltr,
        this.poolPltr, this.poolPltrOut, this.dfiProBlockPltr));
    }
    if (this.anteilAmPoolSlv > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolSlv,
        this.poolSlv, this.poolSlvOut, this.dfiProBlockSlv));
    }
    if (this.anteilAmPoolAapl > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolAapl,
        this.poolAapl, this.poolAaplOut, this.dfiProBlockAapl));
    }
    if (this.anteilAmPoolGld > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGld,
        this.poolGld, this.poolGldOut, this.dfiProBlockGld));
    }
    if (this.anteilAmPoolGme > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGme,
        this.poolGme, this.poolGmeOut, this.dfiProBlockGme));
    }
    if (this.anteilAmPoolGoogl > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGoogl,
        this.poolGoogl, this.poolGooglOut, this.dfiProBlockGoogle));
    }
    if (this.anteilAmPoolArkk > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolArkk,
        this.poolArkk, this.poolArkkOut, this.dfiProBlockArkk));
    }
    if (this.anteilAmPoolBaba > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolBaba,
        this.poolBaba, this.poolBabaOut, this.dfiProBlockBaba));
    }
    if (this.anteilAmPoolVnq > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolVnq,
        this.poolVnq, this.poolVnqOut, this.dfiProBlockVnq));
    }
    if (this.anteilAmPoolUrth > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUrth,
        this.poolUrth, this.poolUrthOut, this.dfiProBlockUrth));
    }
    if (this.anteilAmPoolTlt > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolTlt,
        this.poolTlt, this.poolTltOut, this.dfiProBlockTlt));
    }
    if (this.anteilAmPoolPdbc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolPdbc,
        this.poolPdbc, this.poolPdbcOut, this.dfiProBlockPdbc));
    }
    if (this.anteilAmPoolAmzn > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolAmzn,
        this.poolAmzn, this.poolAmznOut, this.dfiProBlockAmzn));
    }
    if (this.anteilAmPoolNvda > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolNvda,
        this.poolNvda, this.poolNvdaOut, this.dfiProBlockNvda));
    }
    if (this.anteilAmPoolCoin > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolCoin,
        this.poolCoin, this.poolCoinOut, this.dfiProBlockCoin));
    }
    if (this.anteilAmPoolEem > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolEem,
        this.poolEem, this.poolEemOut, this.dfiProBlockEem));
    }
    if (this.anteilAmPoolMsft > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolMsft,
        this.poolMsft, this.poolMsftOut, this.dfiProBlockMsft));
    }
    if (this.anteilAmPoolNflx > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolNflx,
        this.poolNflx, this.poolNflxOut, this.dfiProBlockNflx));
    }
    if (this.anteilAmPoolFb > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolFb,
        this.poolFb, this.poolFbOut, this.dfiProBlockFb));
    }
    if (this.anteilAmPoolVoo > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolVoo,
        this.poolVoo, this.poolVooOut, this.dfiProBlockVoo));
    }
    if (this.anteilAmPoolDis > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolDis,
        this.poolDis, this.poolDisOut, this.dfiProBlockDis));
    }
    if (this.anteilAmPoolMchi > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolMchi,
        this.poolMchi, this.poolMchiOut, this.dfiProBlockMchi));
    }
    if (this.anteilAmPoolMstr > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolMstr,
        this.poolMstr, this.poolMstrOut, this.dfiProBlockMstr));
    }
    if (this.anteilAmPoolIntc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolIntc,
        this.poolIntc, this.poolIntcOut, this.dfiProBlockIntc));
    }
    // 28.4.2022
    if (this.anteilAmPoolPypl > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolPypl,
        this.poolPypl, this.poolPyplOut, this.dfiProBlockPypl));
    }
    if (this.anteilAmPoolBrkb > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolBrkb,
        this.poolBrkb, this.poolBrkbOut, this.dfiProBlockBrkb));
    }
    if (this.anteilAmPoolKo > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolKo,
        this.poolKo, this.poolKoOut, this.dfiProBlockKo));
    }
    if (this.anteilAmPoolPg > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolPg,
        this.poolPg, this.poolPgOut, this.dfiProBlockPg));
    }

    // 28.5.2022
    if (this.anteilAmPoolSap > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolSap,
        this.poolSap, this.poolSapOut, this.dfiProBlockSap));
    }
    if (this.anteilAmPoolUra > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUra,
        this.poolUra, this.poolUraOut, this.dfiProBlockUra));
    }
    if (this.anteilAmPoolCs > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolCs,
        this.poolCs, this.poolCsOut, this.dfiProBlockCs));
    }
    if (this.anteilAmPoolGsg > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGsg,
        this.poolGsg, this.poolGsgOut, this.dfiProBlockGsg));
    }

    // 28.´6.2022
    if (this.anteilAmPoolPplt > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolPplt,
        this.poolPplt, this.poolPpltOut, this.dfiProBlockPplt));
    }
    if (this.anteilAmPoolXom > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolXom,
        this.poolXom, this.poolXomOut, this.dfiProBlockXom));
    }
    if (this.anteilAmPoolGovt > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGovt,
        this.poolGovt, this.poolGovtOut, this.dfiProBlockGovt));
    }
    if (this.anteilAmPoolTan > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolTan,
        this.poolTan, this.poolTanOut, this.dfiProBlockTan));
    }

    // 28.´7.2022
    if (this.anteilAmPoolJnj > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolJnj,
        this.poolJnj, this.poolJnjOut, this.dfiProBlockJnj));
    }
    if (this.anteilAmPoolGs > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolGs,
        this.poolGs, this.poolGsOut, this.dfiProBlockGs));
    }
    if (this.anteilAmPoolAddyy > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolAddyy,
        this.poolAddyy, this.poolAddyyOut, this.dfiProBlockAddyy));
    }
    if (this.anteilAmPoolDax > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolDax,
        this.poolDax, this.poolDaxOut, this.dfiProBlockDax));
    }
  }

  getCommission(pool: Pool): number {
    let commission = 0;

    if (pool === undefined || pool === null) {
      return commission;
    }
    // commission computed on 24h volume and converted in dfi per block
    const poolVolumen24 = this.poolPairsOcean?.data.find(p => p.id === pool.id)?.volume.h24;
    const dfiPriceDex = this.poolBtc.priceB;
    commission = poolVolumen24 * 0.002 / dfiPriceDex / 2880;

    return commission;
  }

  getRewardIsOn(pool: Pool): boolean {
    return this.poolPairsOcean?.data.find(p => p.id === pool.id)?.apr.reward > 0;

  }

  loadDexManual(): void {
    this.parsePoolsAndComputeOutcome();
  }

  loadAllAccounts(): void {
    this.adressBalances = new Array<AddressBalance>();
    this.vaultsOfAllAddresses = new Array<AddressVaults>();
    const requestArray = [];

    // TOKENS
    // normal adresses tokens
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAdressTokens(ad));
    }

    // vaults
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAddressVaults(ad));
    }

    // minter adresses tokens
    for (const adM of this.adressesMasternodes) {
      requestArray.push(this.dataService.getAdressTokens(adM));
    }

    // COINS
    // normal adresses coins
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAdressBalance(ad));
    }

    // minter adresses coins
    for (const adM of this.adressesMasternodes) {
      requestArray.push(this.dataService.getAdressBalance(adM));
    }

    // if adresses exist
    if (requestArray.length > 0) {
      forkJoin(requestArray).subscribe(results => {
          results.forEach((values, i) => {
            // normal address
            if (i <= this.adresses?.length - 1) {
               this.addTokensToWallet(values.data as Array<TokenAccount>, this.getAddressForIteration(i), false,
                 false, false);
            // vaults address
            } else if (i > this.adresses?.length - 1 && i <= this.adresses?.length * 2 - 1) {
               if ((values as AddressVaults)?.data?.length > 0) {
                 this.vaultsOfAllAddresses.push(values as AddressVaults);
               }
            // minter address
            } else if (i > (this.adresses?.length * 2) - 1
              && i <= (this.adresses?.length * 2 + this.adressesMasternodes.length) - 1) {
               const adress = this.getMasternodeAddressForIteration(i);
               this.addTokensToWallet(values.data as Array<TokenAccount>, adress, true, this.isFrozen5(adress),
                 this.isFrozen10(adress));
            // normal address coins
            } else if (i > (this.adresses?.length * 2 + this.adressesMasternodes.length) - 1
               && i <= (this.adresses?.length * 3 + this.adressesMasternodes.length) - 1) {
                const adress = this.adresses[i - (this.adresses?.length * 2 + this.adressesMasternodes.length)];
                this.wallet.dfi += +values.data;
                this.getAddressBalance(adress).dfiCoins = +values.data;
              // minter address coins
            } else {
               const adress = this.adressesMasternodes[i - (this.adresses?.length * 3 + this.adressesMasternodes.length)];
               this.wallet.dfiInMasternodes += +values.data;
               this.getAddressBalance(adress).dfiCoins = +values.data;
             }
          });

          this.loadDex();
          this.loadStackingMasternode();

        },
        err => {
          console.error('Fehler beim Load Accounts: ' + JSON.stringify(err.message));
          this.apiOnline = false;

        });
    } else {
      this.loadDex();
      this.loadStackingMasternode();
    }
  }

  isFrozen5(adress): boolean {
    return this.adressesMasternodesFreezer5.indexOf(adress) > -1;
  }

  isFrozen10(adress): boolean {
    return this.adressesMasternodesFreezer10.indexOf(adress) > -1;
  }

  isMasternode(adress): boolean {
    return this.adressesMasternodes.indexOf(adress) > -1;
  }

  loadStackingCake(): void {

    if (!this.cakeApyLoadAuto) {
      return;
    }

    this.stakingService
      .getStaking().subscribe(
      cake => {
        this.stakingApyCake = +cake.staking.find(s => s.id === 'DFI').apy * 100;
        this.stakingApy = Math.round(this.stakingApyCake * 100) / 100;
        this.berechneStakingOut();
        this.berechneAllOut();
      },
      err => {
        console.error('Fehler beim get staking from cake: ' + JSON.stringify(err.message));
      });
  }

  loadStackingDfx(): void {

    this.stakingService
      .getStakingDFX().subscribe(
      dfx => {
        this.stakingDfx = dfx;
      },
      err => {
        console.error('Fehler beim get staking from dfx: ' + JSON.stringify(err.message));
      });
  }


  async loadDfxStaking(): Promise<void> {
    this.apollo.query({
      query: DFX_STAKING,
      variables: {
        addresses: this.adresses
      }
    }).subscribe((result: any) => {
        this.wallet.dfiInDfxStaking = result?.data?.getDfxStakingAmounts;
        this.dfiInDfxStaking = result?.data?.getDfxStakingAmounts;
        this.berechneStakingOut();
        this.berechneAllOut();
    }, (error) => {
      console.log(error);
    });
  }

  loadStackingMasternode(): void {

     this.masternodeCount5Freezer = this.oceanStats.data.masternodes.locked.find(p => p.weeks === 260).count;
     this.masternodeCount10Freezer = this.oceanStats.data.masternodes.locked.find(p => p.weeks === 520).count;
     this.masternodeCount0Freezer = this.oceanStats.data.masternodes.locked.find(p => p.weeks === 0).count;
     this.masternodeCount = this.masternodeCount5Freezer + this.masternodeCount10Freezer + this.masternodeCount0Freezer;
     this.masternodeCountForAprCalc = this.masternodeCount5Freezer * 1.5 + this.masternodeCount10Freezer * 2
          + this.masternodeCount0Freezer;
     this.dfiBurned = this.oceanStats.data.burned.total;
     this.berechneMNOut();
     this.berechneAllOut();

  }

  getAddressForIteration(i: number): string {
    return this.adresses[i];
  }

  getMasternodeAddressForIteration(i: number): string {
    return this.adressesMasternodes[i - this.adresses?.length * 2];
  }

  addTokenFromVaults(vaultsOfAddress: AddressVaults, address: string): void {

    if (!this.getAddressBalance(address)) {
      const aB = new AddressBalance();
      aB.address = address;
      aB.masternode = false;
      aB.freezed5 = false;
      aB.freezed10 = false;
      this.adressBalances.push(aB);
    }

    vaultsOfAddress.data.forEach(vault => {
      vault.collateralAmounts.forEach(col => {
      switch (col.symbolKey) {
        case 'DFI': {
          this.wallet.dfi += +col.amount;
          this.getAddressBalance(address).dfiTokens += +col.amount;
          break;
        }
        case 'BTC': {
          this.wallet.btc += +col.amount;
          this.getAddressBalance(address).btcToken += +col.amount;
          break;
        }
        case 'USDT': {
          this.wallet.usdt += +col.amount;
          this.getAddressBalance(address).usdtToken += +col.amount;
          break;
        }
        case 'USDC': {
          this.wallet.usdc += +col.amount;
          this.getAddressBalance(address).usdcToken += +col.amount;
          break;
        }
        case 'DUSD': {
          this.wallet.usd += +col.amount;
          this.getAddressBalance(address).usdToken += +col.amount;
          break;
        }
        case 'ETH': {
          this.wallet.eth += +col.amount;
          this.getAddressBalance(address).ethToken += +col.amount;
          break;
        }
        default: {
          break;
        }
      }
      });
    });
  }

  addTokensToWallet(accounts: Array<TokenAccount>, address: string, masternode: boolean, freezed5: boolean,
                    freezed10: boolean): void {

    if (!this.getAddressBalance(address)) {
      const aB = new AddressBalance();
      aB.address = address;
      aB.masternode = masternode;
      aB.freezed5 = freezed5;
      aB.freezed10 = freezed10;
      this.adressBalances.push(aB);
    }

    accounts.forEach(account => {

      if (account.symbolKey !== 'BTC' && +account.amount < 0.0001) {
        return;
      }

      switch (account.symbolKey) {
        case 'DFI': {
          this.wallet.dfi += +account.amount;
          this.getAddressBalance(address).dfiTokens = +account.amount;
          break;
        }
        case 'BTC': {
          this.wallet.btc += +account.amount;
          this.getAddressBalance(address).btcToken = +account.amount;
          break;
        }
        case 'BCH': {
          this.wallet.bch += +account.amount;
          this.getAddressBalance(address).bchToken = +account.amount;
          break;
        }
        case 'ETH': {
          this.wallet.eth += +account.amount;
          this.getAddressBalance(address).ethToken = +account.amount;
          break;
        }
        case 'LTC': {
          this.wallet.ltc += +account.amount;
          this.getAddressBalance(address).ltcToken = +account.amount;
          break;
        }
        case 'DOGE': {
          this.wallet.doge += +account.amount;
          this.getAddressBalance(address).dogeToken = +account.amount;
          break;
        }
        case 'USDT': {
          this.wallet.usdt += +account.amount;
          this.getAddressBalance(address).usdtToken = +account.amount;
          break;
        }
        case 'USDC': {
          this.wallet.usdc += +account.amount;
          this.getAddressBalance(address).usdcToken = +account.amount;
          break;
        }
        case 'DUSD': {
          this.wallet.usd += +account.amount;
          this.getAddressBalance(address).usdToken = +account.amount;
          break;
        }
        case 'TSLA': {
          this.wallet.tsla += +account.amount;
          this.getAddressBalance(address).tslaToken = +account.amount;
          break;
        }
        case 'QQQ': {
          this.wallet.qqq += +account.amount;
          this.getAddressBalance(address).qqqToken = +account.amount;
          break;
        }
        case 'SPY': {
          this.wallet.spy += +account.amount;
          this.getAddressBalance(address).spyToken = +account.amount;
          break;
        }
        case 'PLTR': {
          this.wallet.pltr += +account.amount;
          this.getAddressBalance(address).pltrToken = +account.amount;
          break;
        }
        case 'SLV': {
          this.wallet.slv += +account.amount;
          this.getAddressBalance(address).slvToken = +account.amount;
          break;
        }
        case 'AAPL': {
          this.wallet.aapl += +account.amount;
          this.getAddressBalance(address).aaplToken = +account.amount;
          break;
        }
        case 'GLD': {
          this.wallet.gld += +account.amount;
          this.getAddressBalance(address).gldToken = +account.amount;
          break;
        }
        case 'GME': {
          this.wallet.gme += +account.amount;
          this.getAddressBalance(address).gmeToken = +account.amount;
          break;
        }
        case 'GOOGL': {
          this.wallet.googl += +account.amount;
          this.getAddressBalance(address).googlToken = +account.amount;
          break;
        }
        case 'ARKK': {
          this.wallet.arkk += +account.amount;
          this.getAddressBalance(address).arkkToken = +account.amount;
          break;
        }
        case 'BABA': {
          this.wallet.baba += +account.amount;
          this.getAddressBalance(address).babaToken = +account.amount;
          break;
        }
        case 'VNQ': {
          this.wallet.vnq += +account.amount;
          this.getAddressBalance(address).vnqToken = +account.amount;
          break;
        }
        case 'URTH': {
          this.wallet.urth += +account.amount;
          this.getAddressBalance(address).urthToken = +account.amount;
          break;
        }
        case 'TLT': {
          this.wallet.tlt += +account.amount;
          this.getAddressBalance(address).tltToken = +account.amount;
          break;
        }
        case 'PDBC': {
          this.wallet.pdbc += +account.amount;
          this.getAddressBalance(address).pdbcToken = +account.amount;
          break;
        }
        case 'AMZN': {
          this.wallet.amzn += +account.amount;
          this.getAddressBalance(address).amznToken = +account.amount;
          break;
        }
        case 'COIN': {
          this.wallet.coin += +account.amount;
          this.getAddressBalance(address).coinToken = +account.amount;
          break;
        }
        case 'NVDA': {
          this.wallet.nvda += +account.amount;
          this.getAddressBalance(address).nvdaToken = +account.amount;
          break;
        }
        case 'EEM': {
          this.wallet.eem += +account.amount;
          this.getAddressBalance(address).eemToken = +account.amount;
          break;
        }
        case 'MSFT': {
          this.wallet.msft += +account.amount;
          this.getAddressBalance(address).msftToken = +account.amount;
          break;
        }
        case 'FB': {
          this.wallet.fb += +account.amount;
          this.getAddressBalance(address).fbToken = +account.amount;
          break;
        }
        case 'VOO': {
          this.wallet.voo += +account.amount;
          this.getAddressBalance(address).vooToken = +account.amount;
          break;
        }
        case 'NFLX': {
          this.wallet.nflx += +account.amount;
          this.getAddressBalance(address).nflxToken = +account.amount;
          break;
        }
        case 'DIS': {
          this.wallet.dis += +account.amount;
          this.getAddressBalance(address).disToken = +account.amount;
          break;
        }
        case 'MCHI': {
          this.wallet.mchi += +account.amount;
          this.getAddressBalance(address).mchiToken = +account.amount;
          break;
        }
        case 'MSTR': {
          this.wallet.mstr += +account.amount;
          this.getAddressBalance(address).mstrToken = +account.amount;
          break;
        }
        case 'INTC': {
          this.wallet.intc += +account.amount;
          this.getAddressBalance(address).intcToken = +account.amount;
          break;
        }
        case 'PYPL': {
          this.wallet.pypl += +account.amount;
          this.getAddressBalance(address).pyplToken = +account.amount;
          break;
        }
        case 'BRK.B': {
          this.wallet.brkb += +account.amount;
          this.getAddressBalance(address).brkbToken = +account.amount;
          break;
        }
        case 'KO': {
          this.wallet.ko += +account.amount;
          this.getAddressBalance(address).koToken = +account.amount;
          break;
        }
        case 'PG': {
          this.wallet.pg += +account.amount;
          this.getAddressBalance(address).pgToken = +account.amount;
          break;
        }
        case 'SAP': {
          this.wallet.sap += +account.amount;
          this.getAddressBalance(address).sapToken = +account.amount;
          break;
        }
        case 'URA': {
          this.wallet.ura += +account.amount;
          this.getAddressBalance(address).uraToken = +account.amount;
          break;
        }
        case 'GSG': {
          this.wallet.gsg += +account.amount;
          this.getAddressBalance(address).gsgToken = +account.amount;
          break;
        }
        case 'CS': {
          this.wallet.cs += +account.amount;
          this.getAddressBalance(address).csToken = +account.amount;
          break;
        }
        case 'PPLT': {
          this.wallet.pplt += +account.amount;
          this.getAddressBalance(address).ppltToken = +account.amount;
          break;
        }
        case 'GOVT': {
          this.wallet.govt += +account.amount;
          this.getAddressBalance(address).govtToken = +account.amount;
          break;
        }
        case 'XOM': {
          this.wallet.xom += +account.amount;
          this.getAddressBalance(address).xomToken = +account.amount;
          break;
        }
        case 'TAN': {
          this.wallet.tan += +account.amount;
          this.getAddressBalance(address).tanToken = +account.amount;
          break;
        }
        case 'JNJ': {
          this.wallet.jnj += +account.amount;
          this.getAddressBalance(address).jnjToken = +account.amount;
          break;
        }
        case 'GS': {
          this.wallet.gs += +account.amount;
          this.getAddressBalance(address).gsToken = +account.amount;
          break;
        }
        case 'ADDYY': {
          this.wallet.addyy += +account.amount;
          this.getAddressBalance(address).addyyToken = +account.amount;
          break;
        }
        case 'DAX': {
          this.wallet.dax += +account.amount;
          this.getAddressBalance(address).daxToken = +account.amount;
          break;
        }
        case 'BTC-DFI': {
          this.wallet.btcdfi += +account.amount;
          this.getAddressBalance(address).btcdfiToken = +account.amount;
          break;
        }
        case 'BCH-DFI': {
          this.wallet.bchdfi += +account.amount;
          this.getAddressBalance(address).bchdfiToken = +account.amount;
          break;
        }
        case 'ETH-DFI': {
          this.wallet.ethdfi += +account.amount;
          this.getAddressBalance(address).ethdfiToken = +account.amount;
          break;
        }
        case 'LTC-DFI': {
          this.wallet.ltcdfi += +account.amount;
          this.getAddressBalance(address).ltcdfiToken = +account.amount;
          break;
        }
        case 'DOGE-DFI': {
          this.wallet.dogedfi += +account.amount;
          this.getAddressBalance(address).dogedfiToken = +account.amount;
          break;
        }
        case 'USDT-DFI': {
          this.wallet.usdtdfi += +account.amount;
          this.getAddressBalance(address).usdtdfiToken = +account.amount;
          break;
        }
        case 'USDT-DUSD': {
          this.wallet.usdtdusd += +account.amount;
          this.getAddressBalance(address).usdtdusdToken = +account.amount;
          break;
        }
        case 'USDC-DFI': {
          this.wallet.usdcdfi += +account.amount;
          this.getAddressBalance(address).usdcdfiToken = +account.amount;
          break;
        }
        case 'USDC-DUSD': {
          this.wallet.usdcdusd += +account.amount;
          this.getAddressBalance(address).usdcdusdToken = +account.amount;
          break;
        }
        case 'DUSD-DFI': {
          this.wallet.usddfi += +account.amount;
          this.getAddressBalance(address).usddfiToken = +account.amount;
          break;
        }
        case 'TSLA-DUSD': {
          this.wallet.tslausd += +account.amount;
          this.getAddressBalance(address).tslausdToken = +account.amount;
          break;
        }
        case 'QQQ-DUSD': {
          this.wallet.qqqusd += +account.amount;
          this.getAddressBalance(address).qqqusdToken = +account.amount;
          break;
        }
        case 'SPY-DUSD': {
          this.wallet.spyusd += +account.amount;
          this.getAddressBalance(address).spyusdToken = +account.amount;
          break;
        }
        case 'PLTR-DUSD': {
          this.wallet.pltrusd += +account.amount;
          this.getAddressBalance(address).pltrusdToken = +account.amount;
          break;
        }
        case 'SLV-DUSD': {
          this.wallet.slvusd += +account.amount;
          this.getAddressBalance(address).slvusdToken = +account.amount;
          break;
        }
        case 'AAPL-DUSD': {
          this.wallet.aaplusd += +account.amount;
          this.getAddressBalance(address).aaplusdToken = +account.amount;
          break;
        }
        case 'GLD-DUSD': {
          this.wallet.gldusd += +account.amount;
          this.getAddressBalance(address).gldusdToken = +account.amount;
          break;
        }
        case 'GME-DUSD': {
          this.wallet.gmeusd += +account.amount;
          this.getAddressBalance(address).gmeusdToken = +account.amount;
          break;
        }
        case 'GOOGL-DUSD': {
          this.wallet.googlusd += +account.amount;
          this.getAddressBalance(address).googlToken = +account.amount;
          break;
        }
        case 'ARKK-DUSD': {
          this.wallet.arkkusd += +account.amount;
          this.getAddressBalance(address).arkkusdToken = +account.amount;
          break;
        }
        case 'BABA-DUSD': {
          this.wallet.babausd += +account.amount;
          this.getAddressBalance(address).babausdToken = +account.amount;
          break;
        }
        case 'VNQ-DUSD': {
          this.wallet.vnqusd += +account.amount;
          this.getAddressBalance(address).vnqusdToken = +account.amount;
          break;
        }
        case 'URTH-DUSD': {
          this.wallet.urthusd += +account.amount;
          this.getAddressBalance(address).urthusdToken = +account.amount;
          break;
        }
        case 'TLT-DUSD': {
          this.wallet.tltusd += +account.amount;
          this.getAddressBalance(address).tltusdToken = +account.amount;
          break;
        }
        case 'PDBC-DUSD': {
          this.wallet.pdbcusd += +account.amount;
          this.getAddressBalance(address).pdbcusdToken = +account.amount;
          break;
        }
        case 'AMZN-DUSD': {
          this.wallet.amznusd += +account.amount;
          this.getAddressBalance(address).amznusdToken = +account.amount;
          break;
        }
        case 'NVDA-DUSD': {
          this.wallet.nvdausd += +account.amount;
          this.getAddressBalance(address).nvdausdToken = +account.amount;
          break;
        }
        case 'COIN-DUSD': {
          this.wallet.coinusd += +account.amount;
          this.getAddressBalance(address).coinusdToken = +account.amount;
          break;
        }
        case 'EEM-DUSD': {
          this.wallet.eemusd += +account.amount;
          this.getAddressBalance(address).eemusdToken = +account.amount;
          break;
        }
        case 'MSFT-DUSD': {
          this.wallet.msftusd += +account.amount;
          this.getAddressBalance(address).msftusdToken = +account.amount;
          break;
        }
        case 'VOO-DUSD': {
          this.wallet.voousd += +account.amount;
          this.getAddressBalance(address).voousdToken = +account.amount;
          break;
        }
        case 'NFLX-DUSD': {
          this.wallet.nflxusd += +account.amount;
          this.getAddressBalance(address).nflxusdToken = +account.amount;
          break;
        }
        case 'FB-DUSD': {
          this.wallet.fbusd += +account.amount;
          this.getAddressBalance(address).fbusdToken = +account.amount;
          break;
        }
        case 'DIS-DUSD': {
          this.wallet.disusd += +account.amount;
          this.getAddressBalance(address).disusdToken = +account.amount;
          break;
        }
        case 'MCHI-DUSD': {
          this.wallet.mchiusd += +account.amount;
          this.getAddressBalance(address).mchiusdToken = +account.amount;
          break;
        }
        case 'MSTR-DUSD': {
          this.wallet.mstrusd += +account.amount;
          this.getAddressBalance(address).mstrusdToken = +account.amount;
          break;
        }
        case 'INTC-DUSD': {
          this.wallet.intcusd += +account.amount;
          this.getAddressBalance(address).intcusdToken = +account.amount;
          break;
        }
        case 'PYPL-DUSD': {
          this.wallet.pyplusd += +account.amount;
          this.getAddressBalance(address).pyplusdToken = +account.amount;
          break;
        }
        case 'BRK.B-DUSD': {
          this.wallet.brkbusd += +account.amount;
          this.getAddressBalance(address).brkbusdToken = +account.amount;
          break;
        }
        case 'KO-DUSD': {
          this.wallet.kousd += +account.amount;
          this.getAddressBalance(address).kousdToken = +account.amount;
          break;
        }
        case 'PG-DUSD': {
          this.wallet.pgusd += +account.amount;
          this.getAddressBalance(address).pgusdToken = +account.amount;
          break;
        }
        case 'SAP-DUSD': {
          this.wallet.sapusd += +account.amount;
          this.getAddressBalance(address).sapusdToken = +account.amount;
          break;
        }
        case 'URA-DUSD': {
          this.wallet.urausd += +account.amount;
          this.getAddressBalance(address).urausdToken = +account.amount;
          break;
        }
        case 'GSG-DUSD': {
          this.wallet.gsgusd += +account.amount;
          this.getAddressBalance(address).gsgusdToken = +account.amount;
          break;
        }
        case 'CS-DUSD': {
          this.wallet.csusd += +account.amount;
          this.getAddressBalance(address).csusdToken = +account.amount;
          break;
        }
        case 'PPLT-DUSD': {
          this.wallet.ppltusd += +account.amount;
          this.getAddressBalance(address).ppltusdToken = +account.amount;
          break;
        }
        case 'GOVT-DUSD': {
          this.wallet.govtusd += +account.amount;
          this.getAddressBalance(address).govtusdToken = +account.amount;
          break;
        }
        case 'TAN-DUSD': {
          this.wallet.tanusd += +account.amount;
          this.getAddressBalance(address).tanusdToken = +account.amount;
          break;
        }
        case 'XOM-DUSD': {
          this.wallet.xomusd += +account.amount;
          this.getAddressBalance(address).xomusdToken = +account.amount;
          break;
        }
        case 'JNJ-DUSD': {
          this.wallet.jnjusd += +account.amount;
          this.getAddressBalance(address).jnjusdToken = +account.amount;
          break;
        }
        case 'GS-DUSD': {
          this.wallet.gsusd += +account.amount;
          this.getAddressBalance(address).gsusdToken = +account.amount;
          break;
        }
        case 'DAX-DUSD': {
          this.wallet.daxusd += +account.amount;
          this.getAddressBalance(address).daxusdToken = +account.amount;
          break;
        }
        case 'ADDYY-DUSD': {
          this.wallet.addyyusd += +account.amount;
          this.getAddressBalance(address).addyyusdToken = +account.amount;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  getAddressBalance(address: string): AddressBalance {
    return this.adressBalances.find(a => a.address === address);
  }

  getPool(id: string): Pool {
    return this.pools.find(x => x.poolPairId === id);
  }

  getPoolOcean(id: string): PoolPairOcean {
    return this.poolPairsOcean.data.find(x => x.id === id);
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

  berechnePoolOutUsdc(): void {
    this.berechnePool('USDC', this.poolUsdc, this.poolUsdcOut, this.dfiProBlockUsdc);
  }

  berechnePoolOutLtc(): void {
    this.berechnePool('LTC', this.poolLtc, this.poolLtcOut, this.dfiProBlockLtc);
  }

  berechnePoolOutDoge(): void {
    this.berechnePool('DOGE', this.poolDoge, this.poolDogeOut, this.dfiProBlockDoge);
  }

  berechnePoolOutBch(): void {
    this.berechnePool('BCH', this.poolBch, this.poolBchOut, this.dfiProBlockBch);
  }

  berechnePoolOutUsd(): void {
    this.berechnePool('USD', this.poolUsd, this.poolUsdOut, this.dfiProBlockUsd);
  }

  berechnePoolOutUsdUsdc(): void {
    this.berechnePool('USD-DUSDC', this.poolUsdUsdc, this.poolUsdUsdcOut, this.dfiProBlockUsdUsdc);
  }

  berechnePoolOutUsdUsdt(): void {
    this.berechnePool('USD-DUSDT', this.poolUsdUsdt, this.poolUsdUsdtOut, this.dfiProBlockUsdUsdt);
  }

  berechnePoolOutTsla(): void {
    this.berechnePool('TSLA', this.poolTsla, this.poolTslaOut, this.dfiProBlockTsla);
  }

  berechnePoolOutSpy(): void {
    this.berechnePool('SPY', this.poolSpy, this.poolSpyOut, this.dfiProBlockSpy);
  }

  berechnePoolOutQqq(): void {
    this.berechnePool('QQQ', this.poolQqq, this.poolQqqOut, this.dfiProBlockQqq);
  }

  berechnePoolOutPltr(): void {
    this.berechnePool('PLTR', this.poolPltr, this.poolPltrOut, this.dfiProBlockPltr);
  }

  berechnePoolOutSlv(): void {
    this.berechnePool('SLV', this.poolSlv, this.poolSlvOut, this.dfiProBlockSlv);
  }

  berechnePoolOutAapl(): void {
    this.berechnePool('AAPL', this.poolAapl, this.poolAaplOut, this.dfiProBlockAapl);
  }

  berechnePoolOutGld(): void {
    this.berechnePool('GLD', this.poolGld, this.poolGldOut, this.dfiProBlockGld);
  }

  berechnePoolOutGme(): void {
    this.berechnePool('GME', this.poolGme, this.poolGmeOut, this.dfiProBlockGme);
  }

  berechnePoolOutGoogl(): void {
    this.berechnePool('GOOGL', this.poolGoogl, this.poolGooglOut, this.dfiProBlockGoogle);
  }

  berechnePoolOutArkk(): void {
    this.berechnePool('ARKK', this.poolArkk, this.poolArkkOut, this.dfiProBlockArkk);
  }

  berechnePoolOutBaba(): void {
    this.berechnePool('BABA', this.poolBaba, this.poolBabaOut, this.dfiProBlockBaba);
  }

  berechnePoolOutVnq(): void {
    this.berechnePool('VNQ', this.poolVnq, this.poolVnqOut, this.dfiProBlockVnq);
  }

  berechnePoolOutUrth(): void {
    this.berechnePool('URTH', this.poolUrth, this.poolUrthOut, this.dfiProBlockUrth);
  }

  berechnePoolOutTlt(): void {
    this.berechnePool('TLT', this.poolTlt, this.poolTltOut, this.dfiProBlockTlt);
  }

  berechnePoolOutPdbc(): void {
    this.berechnePool('PDBC', this.poolPdbc, this.poolPdbcOut, this.dfiProBlockPdbc);
  }

  berechnePoolOutAmzn(): void {
    this.berechnePool('AMZN', this.poolAmzn, this.poolAmznOut, this.dfiProBlockAmzn);
  }

  berechnePoolOutNvda(): void {
    this.berechnePool('NVDA', this.poolNvda, this.poolNvdaOut, this.dfiProBlockNvda);
  }

  berechnePoolOutCoin(): void {
    this.berechnePool('COIN', this.poolCoin, this.poolCoinOut, this.dfiProBlockCoin);
  }

  berechnePoolOutEem(): void {
    this.berechnePool('EEM', this.poolEem, this.poolEemOut, this.dfiProBlockEem);
  }

  berechnePoolOutMsft(): void {
    this.berechnePool('MSFT', this.poolMsft, this.poolMsftOut, this.dfiProBlockMsft);
  }

  berechnePoolOutFb(): void {
    this.berechnePool('FB', this.poolFb, this.poolFbOut, this.dfiProBlockFb);
  }

  berechnePoolOutVoo(): void {
    this.berechnePool('VOO', this.poolVoo, this.poolVooOut, this.dfiProBlockVoo);
  }

  berechnePoolOutNflx(): void {
    this.berechnePool('NFLX', this.poolNflx, this.poolNflxOut, this.dfiProBlockNflx);
  }

  berechnePoolOutDis(): void {
    this.berechnePool('DIS', this.poolDis, this.poolDisOut, this.dfiProBlockDis);
  }

  berechnePoolOutMchi(): void {
    this.berechnePool('MCHI', this.poolMchi, this.poolMchiOut, this.dfiProBlockMchi);
  }

  berechnePoolOutMstr(): void {
    this.berechnePool('MSTR', this.poolMstr, this.poolMstrOut, this.dfiProBlockMstr);
  }

  berechnePoolOutIntc(): void {
    this.berechnePool('INTC', this.poolIntc, this.poolIntcOut, this.dfiProBlockIntc);
  }

  berechnePoolOutPypl(): void {
    this.berechnePool('PYPL', this.poolPypl, this.poolPyplOut, this.dfiProBlockPypl);
  }

  berechnePoolOutBrkb(): void {
    this.berechnePool('BRK.B', this.poolBrkb, this.poolBrkbOut, this.dfiProBlockBrkb);
  }

  berechnePoolOutKo(): void {
    this.berechnePool('KO', this.poolKo, this.poolKoOut, this.dfiProBlockKo);
  }

  berechnePoolOutPg(): void {
    this.berechnePool('PG', this.poolPg, this.poolPgOut, this.dfiProBlockPg);
  }

  berechnePoolOutSap(): void {
    this.berechnePool('SAP', this.poolSap, this.poolSapOut, this.dfiProBlockSap);
  }

  berechnePoolOutUra(): void {
    this.berechnePool('URA', this.poolUra, this.poolUraOut, this.dfiProBlockUra);
  }

  berechnePoolOutCs(): void {
    this.berechnePool('CS', this.poolCs, this.poolCsOut, this.dfiProBlockCs);
  }

  berechnePoolOutGsg(): void {
    this.berechnePool('GSG', this.poolGsg, this.poolGsgOut, this.dfiProBlockGsg);
  }

  berechnePoolOutXom(): void {
    this.berechnePool('XOM', this.poolXom, this.poolXomOut, this.dfiProBlockXom);
  }

  berechnePoolOutPplt(): void {
    this.berechnePool('PPLT', this.poolPplt, this.poolPpltOut, this.dfiProBlockPplt);
  }

  berechnePoolOutTan(): void {
    this.berechnePool('TAN', this.poolTan, this.poolTanOut, this.dfiProBlockTan);
  }

  berechnePoolOutGovt(): void {
    this.berechnePool('GOVT', this.poolGovt, this.poolGovtOut, this.dfiProBlockGovt);
  }

  berechnePoolOutJnj(): void {
    this.berechnePool('JNJ', this.poolJnj, this.poolJnjOut, this.dfiProBlockJnj);
  }

  berechnePoolOutDax(): void {
    this.berechnePool('DAX', this.poolDax, this.poolDaxOut, this.dfiProBlockDax);
  }

  berechnePoolOutAddyy(): void {
    this.berechnePool('ADDYY', this.poolAddyy, this.poolAddyyOut, this.dfiProBlockAddyy);
  }

  berechnePoolOutGs(): void {
    this.berechnePool('GS', this.poolGs, this.poolGsOut, this.dfiProBlockGs);
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
    if (poolName === 'USDC') {
      if (this.autoLoadData) {
        this.anteilAmPoolUsdc = this.berechneAnteilAmPool(this.wallet.usdcdfi, pool, outcome, dfiProBlock);
        this.wallet.usdcInUsdcPool = this.anteilAmPoolUsdc * +pool.reserveA / 100;
        this.wallet.dfiInUsdcPool = this.anteilAmPoolUsdc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsdc =
          this.berechneAnteilAmPoolManuel(this.wallet.usdcInUsdcPool, this.wallet.dfiInUsdcPool, pool, outcome, dfiProBlock);
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
    if (poolName === 'BCH') {
      if (this.autoLoadData) {
        this.anteilAmPoolBch = this.berechneAnteilAmPool(this.wallet.bchdfi, pool, outcome, dfiProBlock);
        this.wallet.bchInBchPool = this.anteilAmPoolBch * +pool.reserveA / 100;
        this.wallet.dfiInBchPool = this.anteilAmPoolBch * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolBch =
          this.berechneAnteilAmPoolManuel(this.wallet.bchInBchPool, this.wallet.dfiInBchPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'USD' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolUsd = this.berechneAnteilAmPool(this.wallet.usddfi, pool, outcome, dfiProBlock);
        this.wallet.usdInUsdPool = this.anteilAmPoolUsd * +pool.reserveA / 100;
        this.wallet.dfiInUsdPool = this.anteilAmPoolUsd * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsd =
          this.berechneAnteilAmPoolManuel(this.wallet.usdInUsdPool, this.wallet.dfiInUsdPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'USD-DUSDC' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolUsdUsdc = this.berechneAnteilAmPool(this.wallet.usdcdusd, pool, outcome, dfiProBlock);
        this.wallet.usdcInUsdcDusdPool = this.anteilAmPoolUsdUsdc * +pool.reserveA / 100;
        this.wallet.dusdInUsdcDusdPool = this.anteilAmPoolUsdUsdc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsdUsdc =
          this.berechneAnteilAmPoolManuel(this.wallet.usdcInUsdcDusdPool, this.wallet.dusdInUsdcDusdPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'USD-DUSDT' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolUsdUsdt = this.berechneAnteilAmPool(this.wallet.usdtdusd, pool, outcome, dfiProBlock);
        this.wallet.usdtInUsdtDusdPool = this.anteilAmPoolUsdUsdt * +pool.reserveA / 100;
        this.wallet.dusdInUsdtDusdPool = this.anteilAmPoolUsdUsdt * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsdUsdt =
          this.berechneAnteilAmPoolManuel(this.wallet.usdcInUsdcDusdPool, this.wallet.dusdInUsdcDusdPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'TSLA' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolTsla = this.berechneAnteilAmPool(this.wallet.tslausd, pool, outcome, dfiProBlock);
        this.wallet.tslaInTslaPool = this.anteilAmPoolTsla * +pool.reserveA / 100;
        this.wallet.usdInTslaPool = this.anteilAmPoolTsla * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolTsla =
          this.berechneAnteilAmPoolManuel(this.wallet.tslaInTslaPool, this.wallet.usdInTslaPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'SPY' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolSpy = this.berechneAnteilAmPool(this.wallet.spyusd, pool, outcome, dfiProBlock);
        this.wallet.spyInSpyPool = this.anteilAmPoolSpy * +pool.reserveA / 100;
        this.wallet.usdInSpyPool = this.anteilAmPoolSpy * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolSpy =
          this.berechneAnteilAmPoolManuel(this.wallet.spyInSpyPool, this.wallet.usdInSpyPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'QQQ' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolQqq = this.berechneAnteilAmPool(this.wallet.qqqusd, pool, outcome, dfiProBlock);
        this.wallet.qqqInQqqPool = this.anteilAmPoolQqq * +pool.reserveA / 100;
        this.wallet.usdInQqqPool = this.anteilAmPoolQqq * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolQqq =
          this.berechneAnteilAmPoolManuel(this.wallet.qqqInQqqPool, this.wallet.usdInQqqPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'PLTR' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolPltr = this.berechneAnteilAmPool(this.wallet.pltrusd, pool, outcome, dfiProBlock);
        this.wallet.pltrInPltrPool = this.anteilAmPoolPltr * +pool.reserveA / 100;
        this.wallet.usdInPltrPool = this.anteilAmPoolPltr * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolPltr =
          this.berechneAnteilAmPoolManuel(this.wallet.pltrInPltrPool, this.wallet.usdInPltrPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'SLV' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolSlv = this.berechneAnteilAmPool(this.wallet.slvusd, pool, outcome, dfiProBlock);
        this.wallet.slvInSlvPool = this.anteilAmPoolSlv * +pool.reserveA / 100;
        this.wallet.usdInSlvPool = this.anteilAmPoolSlv * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolSlv =
          this.berechneAnteilAmPoolManuel(this.wallet.slvInSlvPool, this.wallet.usdInSlvPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'AAPL' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolAapl = this.berechneAnteilAmPool(this.wallet.aaplusd, pool, outcome, dfiProBlock);
        this.wallet.aaplInAaplPool = this.anteilAmPoolAapl * +pool.reserveA / 100;
        this.wallet.usdInAaplPool = this.anteilAmPoolAapl * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolAapl =
          this.berechneAnteilAmPoolManuel(this.wallet.aaplInAaplPool, this.wallet.usdInAaplPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'GLD' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGld = this.berechneAnteilAmPool(this.wallet.gldusd, pool, outcome, dfiProBlock);
        this.wallet.gldInGldPool = this.anteilAmPoolGld * +pool.reserveA / 100;
        this.wallet.usdInGldPool = this.anteilAmPoolGld * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGld =
          this.berechneAnteilAmPoolManuel(this.wallet.gldInGldPool, this.wallet.usdInGldPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'GME' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGme = this.berechneAnteilAmPool(this.wallet.gmeusd, pool, outcome, dfiProBlock);
        this.wallet.gmeInGmePool = this.anteilAmPoolGme * +pool.reserveA / 100;
        this.wallet.usdInGmePool = this.anteilAmPoolGme * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGme =
          this.berechneAnteilAmPoolManuel(this.wallet.gmeInGmePool, this.wallet.usdInGmePool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'GOOGL' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGoogl = this.berechneAnteilAmPool(this.wallet.googlusd, pool, outcome, dfiProBlock);
        this.wallet.googlInGooglPool = this.anteilAmPoolGoogl * +pool.reserveA / 100;
        this.wallet.usdInGooglPool = this.anteilAmPoolGoogl * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGoogl =
          this.berechneAnteilAmPoolManuel(this.wallet.googlInGooglPool, this.wallet.usdInGooglPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'ARKK' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolArkk = this.berechneAnteilAmPool(this.wallet.arkkusd, pool, outcome, dfiProBlock);
        this.wallet.arkkInArkkPool = this.anteilAmPoolArkk * +pool.reserveA / 100;
        this.wallet.usdInArkkPool = this.anteilAmPoolArkk * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolArkk =
          this.berechneAnteilAmPoolManuel(this.wallet.arkkInArkkPool, this.wallet.usdInArkkPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'BABA' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolBaba = this.berechneAnteilAmPool(this.wallet.babausd, pool, outcome, dfiProBlock);
        this.wallet.babaInBabaPool = this.anteilAmPoolBaba * +pool.reserveA / 100;
        this.wallet.usdInBabaPool = this.anteilAmPoolBaba * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolBaba =
          this.berechneAnteilAmPoolManuel(this.wallet.babaInBabaPool, this.wallet.usdInBabaPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'VNQ' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolVnq = this.berechneAnteilAmPool(this.wallet.vnqusd, pool, outcome, dfiProBlock);
        this.wallet.vnqInVnqPool = this.anteilAmPoolVnq * +pool.reserveA / 100;
        this.wallet.usdInVnqPool = this.anteilAmPoolVnq * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolVnq =
          this.berechneAnteilAmPoolManuel(this.wallet.vnqInVnqPool, this.wallet.usdInVnqPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'URTH' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolUrth = this.berechneAnteilAmPool(this.wallet.urthusd, pool, outcome, dfiProBlock);
        this.wallet.urthInUrthPool = this.anteilAmPoolUrth * +pool.reserveA / 100;
        this.wallet.usdInUrthPool = this.anteilAmPoolUrth * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUrth =
          this.berechneAnteilAmPoolManuel(this.wallet.urthInUrthPool, this.wallet.usdInUrthPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'TLT' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolTlt = this.berechneAnteilAmPool(this.wallet.tltusd, pool, outcome, dfiProBlock);
        this.wallet.tltInTltPool = this.anteilAmPoolTlt * +pool.reserveA / 100;
        this.wallet.usdInTltPool = this.anteilAmPoolTlt * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolTlt =
          this.berechneAnteilAmPoolManuel(this.wallet.tltInTltPool, this.wallet.usdInTltPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'PDBC' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolPdbc = this.berechneAnteilAmPool(this.wallet.pdbcusd, pool, outcome, dfiProBlock);
        this.wallet.pdbcInPdbcPool = this.anteilAmPoolPdbc * +pool.reserveA / 100;
        this.wallet.usdInPdbcPool = this.anteilAmPoolPdbc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolPdbc =
          this.berechneAnteilAmPoolManuel(this.wallet.pdbcInPdbcPool, this.wallet.usdInPdbcPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'AMZN' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolAmzn = this.berechneAnteilAmPool(this.wallet.amznusd, pool, outcome, dfiProBlock);
        this.wallet.amznInAmznPool = this.anteilAmPoolAmzn * +pool.reserveA / 100;
        this.wallet.usdInAmznPool = this.anteilAmPoolAmzn * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolAmzn =
          this.berechneAnteilAmPoolManuel(this.wallet.amznInAmznPool, this.wallet.usdInAmznPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'NVDA' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolNvda = this.berechneAnteilAmPool(this.wallet.nvdausd, pool, outcome, dfiProBlock);
        this.wallet.nvdaInNvdaPool = this.anteilAmPoolNvda * +pool.reserveA / 100;
        this.wallet.usdInNvdaPool = this.anteilAmPoolNvda * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolNvda =
          this.berechneAnteilAmPoolManuel(this.wallet.nvdaInNvdaPool, this.wallet.usdInNvdaPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'COIN' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolCoin = this.berechneAnteilAmPool(this.wallet.coinusd, pool, outcome, dfiProBlock);
        this.wallet.coinInCoinPool = this.anteilAmPoolCoin * +pool.reserveA / 100;
        this.wallet.usdInCoinPool = this.anteilAmPoolCoin * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolCoin =
          this.berechneAnteilAmPoolManuel(this.wallet.coinInCoinPool, this.wallet.usdInCoinPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'EEM' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolEem = this.berechneAnteilAmPool(this.wallet.eemusd, pool, outcome, dfiProBlock);
        this.wallet.eemInEemPool = this.anteilAmPoolEem * +pool.reserveA / 100;
        this.wallet.usdInEemPool = this.anteilAmPoolEem * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolEem =
          this.berechneAnteilAmPoolManuel(this.wallet.eemInEemPool, this.wallet.usdInEemPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'MSFT' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolMsft = this.berechneAnteilAmPool(this.wallet.msftusd, pool, outcome, dfiProBlock);
        this.wallet.msftInMsftPool = this.anteilAmPoolMsft * +pool.reserveA / 100;
        this.wallet.usdInMsftPool = this.anteilAmPoolMsft * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolMsft =
          this.berechneAnteilAmPoolManuel(this.wallet.msftInMsftPool, this.wallet.usdInMsftPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'FB' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolFb = this.berechneAnteilAmPool(this.wallet.fbusd, pool, outcome, dfiProBlock);
        this.wallet.fbInFbPool = this.anteilAmPoolFb * +pool.reserveA / 100;
        this.wallet.usdInFbPool = this.anteilAmPoolFb * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolFb =
          this.berechneAnteilAmPoolManuel(this.wallet.fbInFbPool, this.wallet.usdInFbPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'NFLX' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolNflx = this.berechneAnteilAmPool(this.wallet.nflxusd, pool, outcome, dfiProBlock);
        this.wallet.nflxInNflxPool = this.anteilAmPoolNflx * +pool.reserveA / 100;
        this.wallet.usdInNflxPool = this.anteilAmPoolNflx * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolNflx =
          this.berechneAnteilAmPoolManuel(this.wallet.nflxInNflxPool, this.wallet.usdInNflxPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'VOO' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolVoo = this.berechneAnteilAmPool(this.wallet.voousd, pool, outcome, dfiProBlock);
        this.wallet.vooInVooPool = this.anteilAmPoolVoo * +pool.reserveA / 100;
        this.wallet.usdInVooPool = this.anteilAmPoolVoo * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolVoo =
          this.berechneAnteilAmPoolManuel(this.wallet.vooInVooPool, this.wallet.usdInVooPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'DIS' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolDis = this.berechneAnteilAmPool(this.wallet.disusd, pool, outcome, dfiProBlock);
        this.wallet.disInDisPool = this.anteilAmPoolDis * +pool.reserveA / 100;
        this.wallet.usdInDisPool = this.anteilAmPoolDis * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolDis =
          this.berechneAnteilAmPoolManuel(this.wallet.disInDisPool, this.wallet.usdInDisPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'MCHI' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolMchi = this.berechneAnteilAmPool(this.wallet.mchiusd, pool, outcome, dfiProBlock);
        this.wallet.mchiInMchiPool = this.anteilAmPoolMchi * +pool.reserveA / 100;
        this.wallet.usdInMchiPool = this.anteilAmPoolMchi * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolMchi =
          this.berechneAnteilAmPoolManuel(this.wallet.mchiInMchiPool, this.wallet.usdInMchiPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'MSTR' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolMstr = this.berechneAnteilAmPool(this.wallet.mstrusd, pool, outcome, dfiProBlock);
        this.wallet.mstrInMstrPool = this.anteilAmPoolMstr * +pool.reserveA / 100;
        this.wallet.usdInMstrPool = this.anteilAmPoolMstr * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolMstr =
          this.berechneAnteilAmPoolManuel(this.wallet.mstrInMstrPool, this.wallet.usdInMstrPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'INTC' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolIntc = this.berechneAnteilAmPool(this.wallet.intcusd, pool, outcome, dfiProBlock);
        this.wallet.intcInIntcPool = this.anteilAmPoolIntc * +pool.reserveA / 100;
        this.wallet.usdInIntcPool = this.anteilAmPoolIntc * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolIntc =
          this.berechneAnteilAmPoolManuel(this.wallet.intcInIntcPool, this.wallet.usdInIntcPool, pool, outcome, dfiProBlock);
      }
    }
    if (poolName === 'PYPL' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolPypl = this.berechneAnteilAmPool(this.wallet.pyplusd, pool, outcome, dfiProBlock);
        this.wallet.pyplInPyplPool = this.anteilAmPoolPypl * +pool.reserveA / 100;
        this.wallet.usdInPyplPool = this.anteilAmPoolPypl * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolPypl =
          this.berechneAnteilAmPoolManuel(this.wallet.pyplInPyplPool, this.wallet.usdInPyplPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'BRK.B' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolBrkb = this.berechneAnteilAmPool(this.wallet.brkbusd, pool, outcome, dfiProBlock);
        this.wallet.brkbInBrkbPool = this.anteilAmPoolBrkb * +pool.reserveA / 100;
        this.wallet.usdInBrkbPool = this.anteilAmPoolBrkb * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolBrkb =
          this.berechneAnteilAmPoolManuel(this.wallet.brkbInBrkbPool, this.wallet.usdInBrkbPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'KO' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolKo = this.berechneAnteilAmPool(this.wallet.kousd, pool, outcome, dfiProBlock);
        this.wallet.koInKoPool = this.anteilAmPoolKo * +pool.reserveA / 100;
        this.wallet.usdInKoPool = this.anteilAmPoolKo * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolKo =
          this.berechneAnteilAmPoolManuel(this.wallet.koInKoPool, this.wallet.usdInKoPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'PG' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolPg = this.berechneAnteilAmPool(this.wallet.pgusd, pool, outcome, dfiProBlock);
        this.wallet.pgInPgPool = this.anteilAmPoolPg * +pool.reserveA / 100;
        this.wallet.usdInPgPool = this.anteilAmPoolPg * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolPg =
          this.berechneAnteilAmPoolManuel(this.wallet.pgInPgPool, this.wallet.usdInPgPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'SAP' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolSap = this.berechneAnteilAmPool(this.wallet.sapusd, pool, outcome, dfiProBlock);
        this.wallet.sapInSapPool = this.anteilAmPoolSap * +pool.reserveA / 100;
        this.wallet.usdInSapPool = this.anteilAmPoolSap * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolSap =
          this.berechneAnteilAmPoolManuel(this.wallet.sapInSapPool, this.wallet.usdInSapPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'URA' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolUra = this.berechneAnteilAmPool(this.wallet.urausd, pool, outcome, dfiProBlock);
        this.wallet.uraInUraPool = this.anteilAmPoolUra * +pool.reserveA / 100;
        this.wallet.usdInUraPool = this.anteilAmPoolUra * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUra =
          this.berechneAnteilAmPoolManuel(this.wallet.uraInUraPool, this.wallet.usdInUraPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'GSG' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGsg = this.berechneAnteilAmPool(this.wallet.gsgusd, pool, outcome, dfiProBlock);
        this.wallet.gsgInGsgPool = this.anteilAmPoolGsg * +pool.reserveA / 100;
        this.wallet.usdInGsgPool = this.anteilAmPoolGsg * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGsg =
          this.berechneAnteilAmPoolManuel(this.wallet.gsgInGsgPool, this.wallet.usdInGsgPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'CS' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolCs = this.berechneAnteilAmPool(this.wallet.csusd, pool, outcome, dfiProBlock);
        this.wallet.csInCsPool = this.anteilAmPoolCs * +pool.reserveA / 100;
        this.wallet.usdInCsPool = this.anteilAmPoolCs * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolCs =
          this.berechneAnteilAmPoolManuel(this.wallet.csInCsPool, this.wallet.usdInCsPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'PPLT' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolPplt = this.berechneAnteilAmPool(this.wallet.ppltusd, pool, outcome, dfiProBlock);
        this.wallet.ppltInPpltPool = this.anteilAmPoolPplt * +pool.reserveA / 100;
        this.wallet.usdInPpltPool = this.anteilAmPoolPplt * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolPplt =
          this.berechneAnteilAmPoolManuel(this.wallet.ppltInPpltPool, this.wallet.usdInPpltPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'XOM' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolXom = this.berechneAnteilAmPool(this.wallet.xomusd, pool, outcome, dfiProBlock);
        this.wallet.xomInXomPool = this.anteilAmPoolXom * +pool.reserveA / 100;
        this.wallet.usdInXomPool = this.anteilAmPoolXom * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolXom =
          this.berechneAnteilAmPoolManuel(this.wallet.xomInXomPool, this.wallet.usdInXomPool, pool, outcome, dfiProBlock);
      }
    }


    if (poolName === 'GOVT' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGovt = this.berechneAnteilAmPool(this.wallet.govtusd, pool, outcome, dfiProBlock);
        this.wallet.govtInGovtPool = this.anteilAmPoolGovt * +pool.reserveA / 100;
        this.wallet.usdInGovtPool = this.anteilAmPoolGovt * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGovt =
          this.berechneAnteilAmPoolManuel(this.wallet.govtInGovtPool, this.wallet.usdInGovtPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'TAN' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolTan = this.berechneAnteilAmPool(this.wallet.tanusd, pool, outcome, dfiProBlock);
        this.wallet.tanInTanPool = this.anteilAmPoolTan * +pool.reserveA / 100;
        this.wallet.usdInTanPool = this.anteilAmPoolTan * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolTan =
          this.berechneAnteilAmPoolManuel(this.wallet.tanInTanPool, this.wallet.usdInTanPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'JNJ' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolJnj = this.berechneAnteilAmPool(this.wallet.jnjusd, pool, outcome, dfiProBlock);
        this.wallet.jnjInJnjPool = this.anteilAmPoolJnj * +pool.reserveA / 100;
        this.wallet.usdInJnjPool = this.anteilAmPoolJnj * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolJnj =
          this.berechneAnteilAmPoolManuel(this.wallet.jnjInJnjPool, this.wallet.usdInJnjPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'ADDYY' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolAddyy = this.berechneAnteilAmPool(this.wallet.addyyusd, pool, outcome, dfiProBlock);
        this.wallet.addyyInAddyyPool = this.anteilAmPoolAddyy * +pool.reserveA / 100;
        this.wallet.usdInAddyyPool = this.anteilAmPoolAddyy * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolAddyy =
          this.berechneAnteilAmPoolManuel(this.wallet.addyyInAddyyPool, this.wallet.usdInAddyyPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'GS' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolGs = this.berechneAnteilAmPool(this.wallet.gsusd, pool, outcome, dfiProBlock);
        this.wallet.gsInGsPool = this.anteilAmPoolGs * +pool.reserveA / 100;
        this.wallet.usdInGsPool = this.anteilAmPoolGs * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolGs =
          this.berechneAnteilAmPoolManuel(this.wallet.gsInGsPool, this.wallet.usdInGsPool, pool, outcome, dfiProBlock);
      }
    }

    if (poolName === 'DAX' && pool) {
      if (this.autoLoadData) {
        this.anteilAmPoolDax = this.berechneAnteilAmPool(this.wallet.daxusd, pool, outcome, dfiProBlock);
        this.wallet.daxInDaxPool = this.anteilAmPoolDax * +pool.reserveA / 100;
        this.wallet.usdInDaxPool = this.anteilAmPoolDax * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolDax =
          this.berechneAnteilAmPoolManuel(this.wallet.daxInDaxPool, this.wallet.usdInDaxPool, pool, outcome, dfiProBlock);
      }
    }

    outcome.dfiPerHour = outcome.dfiPerMin * 60;
    outcome.dfiPerDay = outcome.dfiPerHour * 24;
    outcome.dfiPerWeek = outcome.dfiPerDay * 7;
    outcome.dfiPerMonth = outcome.dfiPerDay * 30;
    outcome.dfiPerYear = outcome.dfiPerDay * 365;
  }

  private berechneAnteilAmPool(lpToken: number, pool: Pool, outcome: Outcome, dfiProBlock: number): number {
    const anteilAmPool = pool ? (lpToken / pool?.totalLiquidityLpToken * 100) : 0;
    outcome.dfiPerMin = this.getDfiPerMin(dfiProBlock) * anteilAmPool / 100;
    return anteilAmPool;
  }

  private berechneAnteilAmPoolManuel(poolCoin: number, secondPairInPool: number, pool: Pool, outcome: Outcome,
                                     dfiProBlock: number): number {
    const anteileDFI = secondPairInPool / +pool.reserveB * 100;
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
      + this.poolUsdtOut.dfiPerMin + this.poolUsdcOut.dfiPerMin + this.poolUsdUsdtOut.dfiPerMin + this.poolUsdUsdcOut.dfiPerMin
      + this.poolLtcOut.dfiPerMin
      + this.poolDogeOut.dfiPerMin + this.poolBchOut.dfiPerMin + this.poolUsdOut?.dfiPerMin + this.poolTslaOut?.dfiPerMin
      + this.poolSpyOut?.dfiPerMin + this.poolQqqOut?.dfiPerMin + this.poolPltrOut?.dfiPerMin + this.poolSlvOut?.dfiPerMin
      + this.poolAaplOut?.dfiPerMin + this.poolGldOut?.dfiPerMin + this.poolGmeOut?.dfiPerMin + this.poolGooglOut?.dfiPerMin
      + this.poolArkkOut?.dfiPerMin + this.poolBabaOut?.dfiPerMin + this.poolVnqOut?.dfiPerMin + this.poolUrthOut?.dfiPerMin
      + this.poolTltOut?.dfiPerMin + this.poolPdbcOut?.dfiPerMin
      + this.poolAmznOut?.dfiPerMin + this.poolNvdaOut?.dfiPerMin + this.poolCoinOut?.dfiPerMin + this.poolEemOut?.dfiPerMin
      + this.poolMsftOut?.dfiPerMin + this.poolFbOut?.dfiPerMin + this.poolVooOut?.dfiPerMin + this.poolNflxOut?.dfiPerMin
      + this.poolDisOut?.dfiPerMin + this.poolMchiOut?.dfiPerMin + this.poolMstrOut?.dfiPerMin + this.poolIntcOut?.dfiPerMin
      + this.poolPyplOut?.dfiPerMin + this.poolBrkbOut?.dfiPerMin + this.poolKoOut?.dfiPerMin + this.poolPgOut?.dfiPerMin
      + this.poolSapOut?.dfiPerMin + this.poolUraOut?.dfiPerMin + this.poolCsOut?.dfiPerMin + this.poolGsgOut?.dfiPerMin
      + this.poolPpltOut?.dfiPerMin + this.poolGovtOut?.dfiPerMin + this.poolTanOut?.dfiPerMin + this.poolXomOut?.dfiPerMin
      + this.poolJnjOut?.dfiPerMin + this.poolAddyyOut?.dfiPerMin + this.poolGsOut?.dfiPerMin + this.poolDaxOut?.dfiPerMin;

    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolUsdcOut.dfiPerHour + this.poolUsdUsdtOut.dfiPerHour + this.poolUsdUsdcOut.dfiPerHour
      + this.poolLtcOut.dfiPerHour
      + this.poolDogeOut.dfiPerHour + this.poolBchOut.dfiPerHour + this.poolUsdOut.dfiPerHour + this.poolTslaOut.dfiPerHour
      + this.poolSpyOut?.dfiPerHour + this.poolQqqOut?.dfiPerHour + this.poolPltrOut?.dfiPerHour + this.poolSlvOut?.dfiPerHour
      + this.poolAaplOut?.dfiPerHour + this.poolGldOut?.dfiPerHour + this.poolGmeOut?.dfiPerHour + this.poolGooglOut?.dfiPerHour
      + this.poolArkkOut?.dfiPerHour + this.poolBabaOut?.dfiPerHour + this.poolVnqOut?.dfiPerHour + this.poolUrthOut?.dfiPerHour
      + this.poolTltOut?.dfiPerHour + this.poolPdbcOut?.dfiPerHour
      + this.poolAmznOut?.dfiPerHour + this.poolNvdaOut?.dfiPerHour + this.poolCoinOut?.dfiPerHour + this.poolEemOut?.dfiPerHour
      + this.poolMsftOut?.dfiPerHour + this.poolFbOut?.dfiPerHour + this.poolVooOut?.dfiPerHour + this.poolNflxOut?.dfiPerHour
      + this.poolDisOut?.dfiPerHour + this.poolMchiOut?.dfiPerHour + this.poolMstrOut?.dfiPerHour + this.poolIntcOut?.dfiPerHour
      + this.poolPyplOut?.dfiPerHour + this.poolBrkbOut?.dfiPerHour + this.poolKoOut?.dfiPerHour + this.poolPgOut?.dfiPerHour
      + this.poolSapOut?.dfiPerHour + this.poolUraOut?.dfiPerHour + this.poolCsOut?.dfiPerHour + this.poolGsgOut?.dfiPerHour
      + this.poolPpltOut?.dfiPerHour + this.poolGovtOut?.dfiPerHour + this.poolTanOut?.dfiPerHour + this.poolXomOut?.dfiPerHour
      + this.poolJnjOut?.dfiPerHour + this.poolAddyyOut?.dfiPerHour + this.poolGsOut?.dfiPerHour + this.poolDaxOut?.dfiPerHour;

    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolUsdcOut.dfiPerDay + this.poolUsdUsdtOut.dfiPerDay + this.poolUsdUsdcOut.dfiPerDay
      + this.poolLtcOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay + this.poolUsdOut.dfiPerDay + this.poolTslaOut.dfiPerDay
      + this.poolSpyOut?.dfiPerDay + this.poolQqqOut?.dfiPerDay + this.poolPltrOut?.dfiPerDay + this.poolSlvOut?.dfiPerDay
      + this.poolAaplOut?.dfiPerDay + this.poolGldOut?.dfiPerDay + this.poolGmeOut?.dfiPerDay + this.poolGooglOut?.dfiPerDay
      + this.poolArkkOut?.dfiPerDay + this.poolBabaOut?.dfiPerDay + this.poolVnqOut?.dfiPerDay + this.poolUrthOut?.dfiPerDay
      + this.poolTltOut?.dfiPerDay + this.poolPdbcOut?.dfiPerDay
      + this.poolAmznOut?.dfiPerDay + this.poolNvdaOut?.dfiPerDay + this.poolCoinOut?.dfiPerDay + this.poolEemOut?.dfiPerDay
      + this.poolMsftOut?.dfiPerDay + this.poolFbOut?.dfiPerDay + this.poolVooOut?.dfiPerDay + this.poolNflxOut?.dfiPerDay
      + this.poolDisOut?.dfiPerDay + this.poolMchiOut?.dfiPerDay + this.poolMstrOut?.dfiPerDay + this.poolIntcOut?.dfiPerDay
      + this.poolPyplOut?.dfiPerDay + this.poolBrkbOut?.dfiPerDay + this.poolKoOut?.dfiPerDay + this.poolPgOut?.dfiPerDay
      + this.poolSapOut?.dfiPerDay + this.poolUraOut?.dfiPerDay + this.poolCsOut?.dfiPerDay + this.poolGsgOut?.dfiPerDay
      + this.poolPpltOut?.dfiPerDay + this.poolGovtOut?.dfiPerDay + this.poolTanOut?.dfiPerDay + this.poolXomOut?.dfiPerDay
      + this.poolJnjOut?.dfiPerDay + this.poolAddyyOut?.dfiPerDay + this.poolGsOut?.dfiPerDay + this.poolDaxOut?.dfiPerDay;

    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolUsdcOut.dfiPerWeek + this.poolUsdUsdtOut.dfiPerWeek + this.poolUsdUsdcOut.dfiPerWeek
      + this.poolLtcOut.dfiPerWeek
      + this.poolDogeOut.dfiPerWeek + this.poolBchOut.dfiPerWeek + this.poolUsdOut.dfiPerWeek + this.poolTslaOut.dfiPerWeek
      + this.poolSpyOut?.dfiPerWeek + this.poolQqqOut?.dfiPerWeek + this.poolPltrOut?.dfiPerWeek + this.poolSlvOut?.dfiPerWeek
      + this.poolAaplOut?.dfiPerWeek + this.poolGldOut?.dfiPerWeek + this.poolGmeOut?.dfiPerWeek + this.poolGooglOut?.dfiPerWeek
      + this.poolArkkOut?.dfiPerWeek + this.poolBabaOut?.dfiPerWeek + this.poolVnqOut?.dfiPerWeek + this.poolUrthOut?.dfiPerWeek
      + this.poolTltOut?.dfiPerWeek + this.poolPdbcOut?.dfiPerWeek
      + this.poolAmznOut?.dfiPerWeek + this.poolNvdaOut?.dfiPerWeek + this.poolCoinOut?.dfiPerWeek + this.poolEemOut?.dfiPerWeek
      + this.poolMsftOut?.dfiPerWeek + this.poolFbOut?.dfiPerWeek + this.poolVooOut?.dfiPerWeek + this.poolNflxOut?.dfiPerWeek
      + this.poolDisOut?.dfiPerWeek + this.poolMchiOut?.dfiPerWeek + this.poolMstrOut?.dfiPerWeek + this.poolIntcOut?.dfiPerWeek
      + this.poolPyplOut?.dfiPerWeek + this.poolBrkbOut?.dfiPerWeek + this.poolKoOut?.dfiPerWeek + this.poolPgOut?.dfiPerWeek
      + this.poolSapOut?.dfiPerWeek + this.poolUraOut?.dfiPerWeek + this.poolCsOut?.dfiPerWeek + this.poolGsgOut?.dfiPerWeek
      + this.poolPpltOut?.dfiPerWeek + this.poolGovtOut?.dfiPerWeek + this.poolTanOut?.dfiPerWeek + this.poolXomOut?.dfiPerWeek
      + this.poolJnjOut?.dfiPerWeek + this.poolAddyyOut?.dfiPerWeek + this.poolGsOut?.dfiPerWeek + this.poolDaxOut?.dfiPerWeek;


    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolUsdcOut.dfiPerMonth + this.poolUsdUsdtOut.dfiPerMonth + this.poolUsdUsdcOut.dfiPerMonth
      + this.poolLtcOut.dfiPerMonth
      + this.poolDogeOut.dfiPerMonth + this.poolBchOut.dfiPerMonth + this.poolUsdOut.dfiPerMonth + this.poolTslaOut.dfiPerMonth
      + this.poolSpyOut?.dfiPerMonth + this.poolQqqOut?.dfiPerMonth + this.poolPltrOut?.dfiPerMonth + this.poolSlvOut?.dfiPerMonth
      + this.poolAaplOut?.dfiPerMonth + this.poolGldOut?.dfiPerMonth + this.poolGmeOut?.dfiPerMonth + this.poolGooglOut?.dfiPerMonth
      + this.poolArkkOut?.dfiPerMonth + this.poolBabaOut?.dfiPerMonth + this.poolVnqOut?.dfiPerMonth + this.poolUrthOut?.dfiPerMonth
      + this.poolTltOut?.dfiPerMonth + this.poolPdbcOut?.dfiPerMonth
      + this.poolAmznOut?.dfiPerMonth + this.poolNvdaOut?.dfiPerMonth + this.poolCoinOut?.dfiPerMonth + this.poolEemOut?.dfiPerMonth
      + this.poolMsftOut?.dfiPerMonth + this.poolFbOut?.dfiPerMonth + this.poolVooOut?.dfiPerMonth + this.poolNflxOut?.dfiPerMonth
      + this.poolDisOut?.dfiPerMonth + this.poolMchiOut?.dfiPerMonth + this.poolMstrOut?.dfiPerMonth + this.poolIntcOut?.dfiPerMonth
      + this.poolPyplOut?.dfiPerMonth + this.poolBrkbOut?.dfiPerMonth + this.poolKoOut?.dfiPerMonth + this.poolPgOut?.dfiPerMonth
      + this.poolSapOut?.dfiPerMonth + this.poolUraOut?.dfiPerMonth + this.poolCsOut?.dfiPerMonth + this.poolGsgOut?.dfiPerMonth
      + this.poolPpltOut?.dfiPerMonth + this.poolGovtOut?.dfiPerMonth + this.poolTanOut?.dfiPerMonth + this.poolXomOut?.dfiPerMonth
      + this.poolJnjOut?.dfiPerMonth + this.poolAddyyOut?.dfiPerMonth + this.poolGsOut?.dfiPerMonth + this.poolDaxOut?.dfiPerMonth;

    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolUsdcOut.dfiPerYear + this.poolUsdUsdtOut.dfiPerYear + this.poolUsdUsdcOut.dfiPerYear
      + this.poolLtcOut.dfiPerYear
      + this.poolDogeOut.dfiPerYear + this.poolBchOut.dfiPerYear + this.poolUsdOut.dfiPerYear + this.poolTslaOut.dfiPerYear
      + this.poolSpyOut?.dfiPerYear + this.poolQqqOut?.dfiPerYear + this.poolPltrOut?.dfiPerYear + this.poolSlvOut?.dfiPerYear
      + this.poolAaplOut?.dfiPerYear + this.poolGldOut?.dfiPerYear + this.poolGmeOut?.dfiPerYear + this.poolGooglOut?.dfiPerYear
      + this.poolArkkOut?.dfiPerYear + this.poolBabaOut?.dfiPerYear + this.poolVnqOut?.dfiPerYear + this.poolUrthOut?.dfiPerYear
      + this.poolTltOut?.dfiPerYear + this.poolPdbcOut?.dfiPerYear
      + this.poolAmznOut?.dfiPerYear + this.poolNvdaOut?.dfiPerYear + this.poolCoinOut?.dfiPerYear + this.poolEemOut?.dfiPerYear
      + this.poolMsftOut?.dfiPerYear + this.poolFbOut?.dfiPerYear + this.poolVooOut?.dfiPerYear + this.poolNflxOut?.dfiPerYear
      + this.poolDisOut?.dfiPerYear + this.poolMchiOut?.dfiPerYear + this.poolMstrOut?.dfiPerYear + this.poolIntcOut?.dfiPerYear
      + this.poolPyplOut?.dfiPerYear + this.poolBrkbOut?.dfiPerYear + this.poolKoOut?.dfiPerYear + this.poolPgOut?.dfiPerYear
      + this.poolSapOut?.dfiPerYear + this.poolUraOut?.dfiPerYear + this.poolCsOut?.dfiPerYear + this.poolGsgOut?.dfiPerYear
      + this.poolPpltOut?.dfiPerYear + this.poolGovtOut?.dfiPerYear + this.poolTanOut?.dfiPerYear + this.poolXomOut?.dfiPerYear
      + this.poolJnjOut?.dfiPerYear + this.poolAddyyOut?.dfiPerYear + this.poolGsOut?.dfiPerYear + this.poolDaxOut?.dfiPerYear;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = (this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking)
    + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr / 356);
    this.stakingOut.dfiPerHour = (this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 8760) - this.dfiInStaking)
      + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr / 8760);
    this.stakingOut.dfiPerMin = (this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 525600) - this.dfiInStaking)
      + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr / 525600);
    this.stakingOut.dfiPerWeek = (this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 52.1429) - this.dfiInStaking)
      + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr / 52.1429);
    this.stakingOut.dfiPerMonth = (this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking)
      + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr / 12);
    this.stakingOut.dfiPerYear = (this.dfiInStaking * (1 + this.stakingApy / 100) - this.dfiInStaking)
      + (this.dfiInDfxStaking * this.stakingDfx?.staking.yield.apr);
  }

  berechneAllOut(): void {
    this.poolAllOut.dfiPerDay = this.stakingOut.dfiPerDay + this.poolOut.dfiPerDay + this.poolMasternodeOut.dfiPerDay;
    this.poolAllOut.dfiPerHour = this.stakingOut.dfiPerHour + this.poolOut.dfiPerHour + this.poolMasternodeOut.dfiPerHour;
    this.poolAllOut.dfiPerMin = this.stakingOut.dfiPerMin + this.poolOut.dfiPerMin + this.poolMasternodeOut.dfiPerMin;
    this.poolAllOut.dfiPerWeek = this.stakingOut.dfiPerWeek + this.poolOut.dfiPerWeek + this.poolMasternodeOut.dfiPerWeek;
    this.poolAllOut.dfiPerMonth = this.stakingOut.dfiPerMonth + this.poolOut.dfiPerMonth + this.poolMasternodeOut.dfiPerMonth;
    this.poolAllOut.dfiPerYear = this.stakingOut.dfiPerYear + this.poolOut.dfiPerYear + this.poolMasternodeOut.dfiPerYear;
  }

  berechneMNOut(): void {
    this.stakingApyMN = 60 / this.blocktimeInS * this.rewards?.rewards?.minter / this.masternodeCountForAprCalc * 525600 / 20000 * 100;
    this.poolMasternodeOut.dfiPerYear = this.getRewardMnForYear();
    this.poolMasternodeOut.dfiPerMonth = this.poolMasternodeOut.dfiPerYear / 12;
    this.poolMasternodeOut.dfiPerWeek = this.poolMasternodeOut.dfiPerMonth / 4;
    this.poolMasternodeOut.dfiPerDay = this.poolMasternodeOut.dfiPerMonth / 30;
    this.poolMasternodeOut.dfiPerHour = this.poolMasternodeOut.dfiPerDay / 24;
    this.poolMasternodeOut.dfiPerMin = this.poolMasternodeOut.dfiPerHour / 60;
  }

  getRewardMnForYear(): number {
    let reward = 0;
    const countFreezer5 = this.adressesMasternodesFreezer5.length;
    const countFreezer10 = this.adressesMasternodesFreezer10.length;
    const countNormal = this.adressesMasternodes.length - countFreezer5 - countFreezer10;

    reward += countNormal * 20000 * this.stakingApyMN / 100;
    reward += countFreezer5 * 20000 * this.stakingApyMN / 100 * 1.5;
    reward += countFreezer10 * 20000 * this.stakingApyMN / 100 * 2;

    return reward;
  }

  isLocalStorageNotEmpty(key: string): boolean {
    return localStorage.getItem(key) !== null;
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
    // USDC POOL
    if (this.isLocalStorageNotEmpty(this.wallet.usdcInUsdcPoolKey)) {
      this.wallet.usdcInUsdcPool = +localStorage.getItem(this.wallet.usdcInUsdcPoolKey);
    } else {
      this.wallet.usdcInUsdcPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdcKey)) {
      this.wallet.usdc = +localStorage.getItem(this.wallet.usdcKey);
    } else {
      this.wallet.usdc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInUsdcPoolKey)) {
      this.wallet.dfiInUsdcPool = +localStorage.getItem(this.wallet.dfiInUsdcPoolKey);
    } else {
      this.wallet.dfiInUsdcPool = 0;
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
    // BCH POOL
    if (this.isLocalStorageNotEmpty(this.wallet.bchInBchPoolKey)) {
      this.wallet.bchInBchPool = +localStorage.getItem(this.wallet.bchInBchPoolKey);
    } else {
      this.wallet.bchInBchPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.bchKey)) {
      this.wallet.bch = +localStorage.getItem(this.wallet.bchKey);
    } else {
      this.wallet.bch = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInBchPoolKey)) {
      this.wallet.dfiInBchPool = +localStorage.getItem(this.wallet.dfiInBchPoolKey);
    } else {
      this.wallet.dfiInBchPool = 0;
    }
    // USD POOL
    if (this.isLocalStorageNotEmpty(this.wallet.usdInUsdPoolKey)) {
      this.wallet.usdInUsdPool = +localStorage.getItem(this.wallet.usdInUsdPoolKey);
    } else {
      this.wallet.usdInUsdPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdKey)) {
      this.wallet.usd = +localStorage.getItem(this.wallet.usdKey);
    } else {
      this.wallet.usd = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.dfiInUsdPoolKey)) {
      this.wallet.dfiInUsdPool = +localStorage.getItem(this.wallet.dfiInUsdPoolKey);
    } else {
      this.wallet.dfiInUsdPool = 0;
    }
    // TSLA POOL
    if (this.isLocalStorageNotEmpty(this.wallet.tslaInTslaPoolKey)) {
      this.wallet.tslaInTslaPool = +localStorage.getItem(this.wallet.tslaInTslaPoolKey);
    } else {
      this.wallet.tslaInTslaPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.tslaKey)) {
      this.wallet.tsla = +localStorage.getItem(this.wallet.tslaKey);
    } else {
      this.wallet.tsla = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInTslaPoolKey)) {
      this.wallet.usdInTslaPool = +localStorage.getItem(this.wallet.usdInTslaPoolKey);
    } else {
      this.wallet.usdInTslaPool = 0;
    }
    // SPY POOL
    if (this.isLocalStorageNotEmpty(this.wallet.spyInSpyPoolKey)) {
      this.wallet.spyInSpyPool = +localStorage.getItem(this.wallet.spyInSpyPoolKey);
    } else {
      this.wallet.spyInSpyPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.spyKey)) {
      this.wallet.spy = +localStorage.getItem(this.wallet.spyKey);
    } else {
      this.wallet.spy = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInSpyPoolKey)) {
      this.wallet.usdInSpyPool = +localStorage.getItem(this.wallet.usdInSpyPoolKey);
    } else {
      this.wallet.usdInSpyPool = 0;
    }
    // QQQ POOL
    if (this.isLocalStorageNotEmpty(this.wallet.qqqInQqqPoolKey)) {
      this.wallet.qqqInQqqPool = +localStorage.getItem(this.wallet.qqqInQqqPoolKey);
    } else {
      this.wallet.qqqInQqqPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.qqqKey)) {
      this.wallet.qqq = +localStorage.getItem(this.wallet.qqqKey);
    } else {
      this.wallet.qqq = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInQqqPoolKey)) {
      this.wallet.usdInQqqPool = +localStorage.getItem(this.wallet.usdInQqqPoolKey);
    } else {
      this.wallet.usdInQqqPool = 0;
    }
    // PLTR POOL
    if (this.isLocalStorageNotEmpty(this.wallet.pltrInPltrPoolKey)) {
      this.wallet.pltrInPltrPool = +localStorage.getItem(this.wallet.pltrInPltrPoolKey);
    } else {
      this.wallet.pltrInPltrPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.pltrKey)) {
      this.wallet.pltr = +localStorage.getItem(this.wallet.pltrKey);
    } else {
      this.wallet.pltr = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInPltrPoolKey)) {
      this.wallet.usdInPltrPool = +localStorage.getItem(this.wallet.usdInPltrPoolKey);
    } else {
      this.wallet.usdInPltrPool = 0;
    }
    // SLV POOL
    if (this.isLocalStorageNotEmpty(this.wallet.slvInSlvPoolKey)) {
      this.wallet.slvInSlvPool = +localStorage.getItem(this.wallet.slvInSlvPoolKey);
    } else {
      this.wallet.slvInSlvPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.slvKey)) {
      this.wallet.slv = +localStorage.getItem(this.wallet.slvKey);
    } else {
      this.wallet.slv = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInSlvPoolKey)) {
      this.wallet.usdInSlvPool = +localStorage.getItem(this.wallet.usdInSlvPoolKey);
    } else {
      this.wallet.usdInSlvPool = 0;
    }
    // AAPL POOL
    if (this.isLocalStorageNotEmpty(this.wallet.aaplInAaplPoolKey)) {
      this.wallet.aaplInAaplPool = +localStorage.getItem(this.wallet.aaplInAaplPoolKey);
    } else {
      this.wallet.aaplInAaplPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.aaplKey)) {
      this.wallet.aapl = +localStorage.getItem(this.wallet.aaplKey);
    } else {
      this.wallet.aapl = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInAaplPoolKey)) {
      this.wallet.usdInAaplPool = +localStorage.getItem(this.wallet.usdInAaplPoolKey);
    } else {
      this.wallet.usdInAaplPool = 0;
    }
    // GLD POOL
    if (this.isLocalStorageNotEmpty(this.wallet.gldInGldPoolKey)) {
      this.wallet.gldInGldPool = +localStorage.getItem(this.wallet.gldInGldPoolKey);
    } else {
      this.wallet.gldInGldPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.gldKey)) {
      this.wallet.gld = +localStorage.getItem(this.wallet.gldKey);
    } else {
      this.wallet.gld = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInGldPoolKey)) {
      this.wallet.usdInGldPool = +localStorage.getItem(this.wallet.usdInGldPoolKey);
    } else {
      this.wallet.usdInGldPool = 0;
    }
    // GME POOL
    if (this.isLocalStorageNotEmpty(this.wallet.gmeInGmePoolKey)) {
      this.wallet.gmeInGmePool = +localStorage.getItem(this.wallet.gmeInGmePoolKey);
    } else {
      this.wallet.gmeInGmePool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.gmeKey)) {
      this.wallet.gme = +localStorage.getItem(this.wallet.gmeKey);
    } else {
      this.wallet.gme = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInGmePoolKey)) {
      this.wallet.usdInGmePool = +localStorage.getItem(this.wallet.usdInGmePoolKey);
    } else {
      this.wallet.usdInGmePool = 0;
    }
    // GOOGL POOL
    if (this.isLocalStorageNotEmpty(this.wallet.googlInGooglPoolKey)) {
      this.wallet.googlInGooglPool = +localStorage.getItem(this.wallet.googlInGooglPoolKey);
    } else {
      this.wallet.googlInGooglPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.googlKey)) {
      this.wallet.googl = +localStorage.getItem(this.wallet.googlKey);
    } else {
      this.wallet.googl = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInGooglPoolKey)) {
      this.wallet.usdInGooglPool = +localStorage.getItem(this.wallet.usdInGooglPoolKey);
    } else {
      this.wallet.usdInGooglPool = 0;
    }
    // ARKK POOL
    if (this.isLocalStorageNotEmpty(this.wallet.arkkInArkkPoolKey)) {
      this.wallet.arkkInArkkPool = +localStorage.getItem(this.wallet.arkkInArkkPoolKey);
    } else {
      this.wallet.arkkInArkkPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.arkkKey)) {
      this.wallet.arkk = +localStorage.getItem(this.wallet.arkkKey);
    } else {
      this.wallet.arkk = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInArkkPoolKey)) {
      this.wallet.usdInArkkPool = +localStorage.getItem(this.wallet.usdInArkkPoolKey);
    } else {
      this.wallet.usdInArkkPool = 0;
    }
    // BABA POOL
    if (this.isLocalStorageNotEmpty(this.wallet.babaInBabaPoolKey)) {
      this.wallet.babaInBabaPool = +localStorage.getItem(this.wallet.babaInBabaPoolKey);
    } else {
      this.wallet.babaInBabaPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.babaKey)) {
      this.wallet.baba = +localStorage.getItem(this.wallet.babaKey);
    } else {
      this.wallet.baba = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInBabaPoolKey)) {
      this.wallet.usdInBabaPool = +localStorage.getItem(this.wallet.usdInBabaPoolKey);
    } else {
      this.wallet.usdInBabaPool = 0;
    }
    // VNQ POOL
    if (this.isLocalStorageNotEmpty(this.wallet.vnqInVnqPoolKey)) {
      this.wallet.vnqInVnqPool = +localStorage.getItem(this.wallet.vnqInVnqPoolKey);
    } else {
      this.wallet.vnqInVnqPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.vnqKey)) {
      this.wallet.vnq = +localStorage.getItem(this.wallet.vnqKey);
    } else {
      this.wallet.vnq = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInVnqPoolKey)) {
      this.wallet.usdInVnqPool = +localStorage.getItem(this.wallet.usdInVnqPoolKey);
    } else {
      this.wallet.usdInVnqPool = 0;
    }
    // URTH POOL
    if (this.isLocalStorageNotEmpty(this.wallet.urthInUrthPoolKey)) {
      this.wallet.urthInUrthPool = +localStorage.getItem(this.wallet.urthInUrthPoolKey);
    } else {
      this.wallet.urthInUrthPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.urthKey)) {
      this.wallet.urth = +localStorage.getItem(this.wallet.urthKey);
    } else {
      this.wallet.urth = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInUrthPoolKey)) {
      this.wallet.usdInUrthPool = +localStorage.getItem(this.wallet.usdInUrthPoolKey);
    } else {
      this.wallet.usdInUrthPool = 0;
    }
    // TLT POOL
    if (this.isLocalStorageNotEmpty(this.wallet.tltInTltPoolKey)) {
      this.wallet.tltInTltPool = +localStorage.getItem(this.wallet.tltInTltPoolKey);
    } else {
      this.wallet.tltInTltPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.tltKey)) {
      this.wallet.tlt = +localStorage.getItem(this.wallet.tltKey);
    } else {
      this.wallet.tlt = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInTltPoolKey)) {
      this.wallet.usdInTltPool = +localStorage.getItem(this.wallet.usdInTltPoolKey);
    } else {
      this.wallet.usdInTltPool = 0;
    }
    // PDBC POOL
    if (this.isLocalStorageNotEmpty(this.wallet.pdbcInPdbcPoolKey)) {
      this.wallet.pdbcInPdbcPool = +localStorage.getItem(this.wallet.pdbcInPdbcPoolKey);
    } else {
      this.wallet.pdbcInPdbcPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.pdbcKey)) {
      this.wallet.pdbc = +localStorage.getItem(this.wallet.pdbcKey);
    } else {
      this.wallet.pdbc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInPdbcPoolKey)) {
      this.wallet.usdInPltrPool = +localStorage.getItem(this.wallet.usdInPdbcPoolKey);
    } else {
      this.wallet.usdInPltrPool = 0;
    }
    // AMZN POOL
    if (this.isLocalStorageNotEmpty(this.wallet.amznInAmznPoolKey)) {
      this.wallet.amznInAmznPool = +localStorage.getItem(this.wallet.amznInAmznPoolKey);
    } else {
      this.wallet.amznInAmznPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.amznKey)) {
      this.wallet.amzn = +localStorage.getItem(this.wallet.amznKey);
    } else {
      this.wallet.amzn = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInAmznPoolKey)) {
      this.wallet.usdInAmznPool = +localStorage.getItem(this.wallet.usdInAmznPoolKey);
    } else {
      this.wallet.usdInAmznPool = 0;
    }
    // COIN POOL
    if (this.isLocalStorageNotEmpty(this.wallet.coinInCoinPoolKey)) {
      this.wallet.coinInCoinPool = +localStorage.getItem(this.wallet.coinInCoinPoolKey);
    } else {
      this.wallet.coinInCoinPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.coinKey)) {
      this.wallet.coin = +localStorage.getItem(this.wallet.coinKey);
    } else {
      this.wallet.coin = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInCoinPoolKey)) {
      this.wallet.usdInCoinPool = +localStorage.getItem(this.wallet.usdInCoinPoolKey);
    } else {
      this.wallet.usdInCoinPool = 0;
    }
    // NVDA POOL
    if (this.isLocalStorageNotEmpty(this.wallet.nvdaInNvdaPoolKey)) {
      this.wallet.nvdaInNvdaPool = +localStorage.getItem(this.wallet.nvdaInNvdaPoolKey);
    } else {
      this.wallet.nvdaInNvdaPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.nvdaKey)) {
      this.wallet.nvda = +localStorage.getItem(this.wallet.nvdaKey);
    } else {
      this.wallet.nvda = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInNvdaPoolKey)) {
      this.wallet.usdInNvdaPool = +localStorage.getItem(this.wallet.usdInNvdaPoolKey);
    } else {
      this.wallet.usdInNvdaPool = 0;
    }
    // EEM POOL
    if (this.isLocalStorageNotEmpty(this.wallet.eemInEemPoolKey)) {
      this.wallet.eemInEemPool = +localStorage.getItem(this.wallet.eemInEemPoolKey);
    } else {
      this.wallet.eemInEemPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.eemKey)) {
      this.wallet.eem = +localStorage.getItem(this.wallet.eemKey);
    } else {
      this.wallet.eem = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInEemPoolKey)) {
      this.wallet.usdInEemPool = +localStorage.getItem(this.wallet.usdInEemPoolKey);
    } else {
      this.wallet.usdInEemPool = 0;
    }
    // MSFT POOL
    if (this.isLocalStorageNotEmpty(this.wallet.msftInMsftPoolKey)) {
      this.wallet.msftInMsftPool = +localStorage.getItem(this.wallet.msftInMsftPoolKey);
    } else {
      this.wallet.msftInMsftPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.msftKey)) {
      this.wallet.msft = +localStorage.getItem(this.wallet.msftKey);
    } else {
      this.wallet.msft = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInMsftPoolKey)) {
      this.wallet.usdInMsftPool = +localStorage.getItem(this.wallet.usdInMsftPoolKey);
    } else {
      this.wallet.usdInMsftPool = 0;
    }
    // FB POOL
    if (this.isLocalStorageNotEmpty(this.wallet.fbInFbPoolKey)) {
      this.wallet.fbInFbPool = +localStorage.getItem(this.wallet.fbInFbPoolKey);
    } else {
      this.wallet.fbInFbPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.fbKey)) {
      this.wallet.fb = +localStorage.getItem(this.wallet.fbKey);
    } else {
      this.wallet.fb = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInFbPoolKey)) {
      this.wallet.usdInFbPool = +localStorage.getItem(this.wallet.usdInFbPoolKey);
    } else {
      this.wallet.usdInFbPool = 0;
    }
    // NFLX POOL
    if (this.isLocalStorageNotEmpty(this.wallet.nflxInNflxPoolKey)) {
      this.wallet.nflxInNflxPool = +localStorage.getItem(this.wallet.nflxInNflxPoolKey);
    } else {
      this.wallet.nflxInNflxPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.nflxKey)) {
      this.wallet.nflx = +localStorage.getItem(this.wallet.nflxKey);
    } else {
      this.wallet.nflx = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInNflxPoolKey)) {
      this.wallet.usdInNflxPool = +localStorage.getItem(this.wallet.usdInNflxPoolKey);
    } else {
      this.wallet.usdInNflxPool = 0;
    }
    // VOO POOL
    if (this.isLocalStorageNotEmpty(this.wallet.vooInVooPoolKey)) {
      this.wallet.vooInVooPool = +localStorage.getItem(this.wallet.vooInVooPoolKey);
    } else {
      this.wallet.vooInVooPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.vooKey)) {
      this.wallet.voo = +localStorage.getItem(this.wallet.vooKey);
    } else {
      this.wallet.voo = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInVooPoolKey)) {
      this.wallet.usdInVooPool = +localStorage.getItem(this.wallet.usdInVooPoolKey);
    } else {
      this.wallet.usdInVooPool = 0;
    }
    // DIS POOL
    if (this.isLocalStorageNotEmpty(this.wallet.disInDisPoolKey)) {
      this.wallet.disInDisPool = +localStorage.getItem(this.wallet.disInDisPoolKey);
    } else {
      this.wallet.disInDisPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.disKey)) {
      this.wallet.dis = +localStorage.getItem(this.wallet.disKey);
    } else {
      this.wallet.dis = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInDisPoolKey)) {
      this.wallet.usdInDisPool = +localStorage.getItem(this.wallet.usdInDisPoolKey);
    } else {
      this.wallet.usdInDisPool = 0;
    }
    // MCHI POOL
    if (this.isLocalStorageNotEmpty(this.wallet.mchiInMchiPoolKey)) {
      this.wallet.mchiInMchiPool = +localStorage.getItem(this.wallet.mchiInMchiPoolKey);
    } else {
      this.wallet.mchiInMchiPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.mchiKey)) {
      this.wallet.mchi = +localStorage.getItem(this.wallet.mchiKey);
    } else {
      this.wallet.mchi = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInMchiPoolKey)) {
      this.wallet.usdInMchiPool = +localStorage.getItem(this.wallet.usdInMchiPoolKey);
    } else {
      this.wallet.usdInMchiPool = 0;
    }
    // MSTR POOL
    if (this.isLocalStorageNotEmpty(this.wallet.mstrInMstrPoolKey)) {
      this.wallet.mstrInMstrPool = +localStorage.getItem(this.wallet.mstrInMstrPoolKey);
    } else {
      this.wallet.mstrInMstrPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.mstrKey)) {
      this.wallet.mstr = +localStorage.getItem(this.wallet.mstrKey);
    } else {
      this.wallet.mstr = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInMstrPoolKey)) {
      this.wallet.usdInMstrPool = +localStorage.getItem(this.wallet.usdInMstrPoolKey);
    } else {
      this.wallet.usdInMstrPool = 0;
    }
    // INTC POOL
    if (this.isLocalStorageNotEmpty(this.wallet.intcInIntcPoolKey)) {
      this.wallet.intcInIntcPool = +localStorage.getItem(this.wallet.intcInIntcPoolKey);
    } else {
      this.wallet.intcInIntcPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.intcKey)) {
      this.wallet.intc = +localStorage.getItem(this.wallet.intcKey);
    } else {
      this.wallet.intc = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInIntcPoolKey)) {
      this.wallet.usdInIntcPool = +localStorage.getItem(this.wallet.usdInIntcPoolKey);
    } else {
      this.wallet.usdInIntcPool = 0;
    }
    // PYPL POOL
    if (this.isLocalStorageNotEmpty(this.wallet.pyplInPyplPoolKey)) {
      this.wallet.pyplInPyplPool = +localStorage.getItem(this.wallet.pyplInPyplPoolKey);
    } else {
      this.wallet.pyplInPyplPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.pyplKey)) {
      this.wallet.pypl = +localStorage.getItem(this.wallet.pyplKey);
    } else {
      this.wallet.pypl = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInPyplPoolKey)) {
      this.wallet.usdInPyplPool = +localStorage.getItem(this.wallet.usdInPyplPoolKey);
    } else {
      this.wallet.usdInPyplPool = 0;
    }
    // BRK.B POOL
    if (this.isLocalStorageNotEmpty(this.wallet.brkbInBrkbPoolKey)) {
      this.wallet.brkbInBrkbPool = +localStorage.getItem(this.wallet.brkbInBrkbPoolKey);
    } else {
      this.wallet.brkbInBrkbPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.brkbKey)) {
      this.wallet.brkb = +localStorage.getItem(this.wallet.brkbKey);
    } else {
      this.wallet.brkb = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInBrkbPoolKey)) {
      this.wallet.usdInBrkbPool = +localStorage.getItem(this.wallet.usdInBrkbPoolKey);
    } else {
      this.wallet.usdInBrkbPool = 0;
    }
    // KO POOL
    if (this.isLocalStorageNotEmpty(this.wallet.koInKoPoolKey)) {
      this.wallet.koInKoPool = +localStorage.getItem(this.wallet.koInKoPoolKey);
    } else {
      this.wallet.koInKoPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.koKey)) {
      this.wallet.ko = +localStorage.getItem(this.wallet.koKey);
    } else {
      this.wallet.ko = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInKoPoolKey)) {
      this.wallet.usdInKoPool = +localStorage.getItem(this.wallet.usdInKoPoolKey);
    } else {
      this.wallet.usdInKoPool = 0;
    }
    // PG POOL
    if (this.isLocalStorageNotEmpty(this.wallet.pgInPgPoolKey)) {
      this.wallet.pgInPgPool = +localStorage.getItem(this.wallet.pgInPgPoolKey);
    } else {
      this.wallet.pgInPgPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.pgKey)) {
      this.wallet.pg = +localStorage.getItem(this.wallet.pgKey);
    } else {
      this.wallet.pg = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInPgPoolKey)) {
      this.wallet.usdInPgPool = +localStorage.getItem(this.wallet.usdInPgPoolKey);
    } else {
      this.wallet.usdInPgPool = 0;
    }
    // SAP POOL
    if (this.isLocalStorageNotEmpty(this.wallet.sapInSapPoolKey)) {
      this.wallet.sapInSapPool = +localStorage.getItem(this.wallet.sapInSapPoolKey);
    } else {
      this.wallet.sapInSapPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.sapKey)) {
      this.wallet.sap = +localStorage.getItem(this.wallet.sapKey);
    } else {
      this.wallet.sap = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInSapPoolKey)) {
      this.wallet.usdInSapPool = +localStorage.getItem(this.wallet.usdInSapPoolKey);
    } else {
      this.wallet.usdInSapPool = 0;
    }

    // URA POOL
    if (this.isLocalStorageNotEmpty(this.wallet.uraInUraPoolKey)) {
      this.wallet.uraInUraPool = +localStorage.getItem(this.wallet.uraInUraPoolKey);
    } else {
      this.wallet.uraInUraPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.uraKey)) {
      this.wallet.ura = +localStorage.getItem(this.wallet.uraKey);
    } else {
      this.wallet.ura = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInUraPoolKey)) {
      this.wallet.usdInUraPool = +localStorage.getItem(this.wallet.usdInUraPoolKey);
    } else {
      this.wallet.usdInUraPool = 0;
    }

    // GSG POOL
    if (this.isLocalStorageNotEmpty(this.wallet.gsgInGsgPoolKey)) {
      this.wallet.gsgInGsgPool = +localStorage.getItem(this.wallet.gsgInGsgPoolKey);
    } else {
      this.wallet.gsgInGsgPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.gsgKey)) {
      this.wallet.gsg = +localStorage.getItem(this.wallet.gsgKey);
    } else {
      this.wallet.gsg = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInGsgPoolKey)) {
      this.wallet.usdInGsgPool = +localStorage.getItem(this.wallet.usdInGsgPoolKey);
    } else {
      this.wallet.usdInGsgPool = 0;
    }

    // CS POOL
    if (this.isLocalStorageNotEmpty(this.wallet.csInCsPoolKey)) {
      this.wallet.csInCsPool = +localStorage.getItem(this.wallet.csInCsPoolKey);
    } else {
      this.wallet.csInCsPool = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.csKey)) {
      this.wallet.cs = +localStorage.getItem(this.wallet.csKey);
    } else {
      this.wallet.cs = 0;
    }
    if (this.isLocalStorageNotEmpty(this.wallet.usdInCsPoolKey)) {
      this.wallet.usdInCsPool = +localStorage.getItem(this.wallet.usdInCsPoolKey);
    } else {
      this.wallet.usdInCsPool = 0;
    }

    // WALLET
    if (this.isLocalStorageNotEmpty(this.wallet.dfiKey)) {
      this.wallet.dfi = +localStorage.getItem(this.wallet.dfiKey);
    } else {
      this.wallet.dfi = 0;
    }

  }

  onChangeDfiStaking(): void {
    this.berechneStakingOut();
    this.berechnePoolOut();
    this.berechneAllOut();
    this.buildDataForChart();
    this.buildDataForChartIncome();
  }

  buildDataForChart(): void {

    this.valueComponent?.buildDataForChart();
  }

  buildDataForChartIncome(): void {
    this.incomeComponent?.buildDataForChartIncome();
  }

  onChangeFiat(newValue: string): void {
    this.fiat = newValue;
    this.matomoTracker.trackEvent('Klick', 'Change Fiat', newValue);

    this.buildChartValue();
    this.buildChartIncome();
    localStorage.setItem(this.fiatKey, newValue);

  }

  trackGraphQL(): void {
    this.matomoTracker.trackEvent('Klick', 'GraphQL Reflink');
  }

  trackGit(): void {
    this.matomoTracker.trackEvent('Klick', 'GitRepo Reflink');

  }

  trackHelper(): void {
    this.matomoTracker.trackEvent('Klick', 'Adresses Helper');
  }

  trackDFX(): void {
    this.matomoTracker.trackEvent('Klick', 'DFX Buy');
  }

  getAllValuesUsdPrice(): number {

    // All Crypto and Stock values
    const allCryptoAndStocks = this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd()
      + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd() + this.getTslaValueUsd() + this.getUsdValueUsd()
      + this.getSpyValueUsd() + this.getQqqValueUsd() + this.getPltrValueUsd() + this.getSlvValueUsd() + this.getAaplValueUsd()
      + this.getGldValueUsd() + this.getGmeValueUsd() + this.getGooglValueUsd() + this.getArkkValueUsd() + this.getBabaValueUsd()
      + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd() + this.getPdbcValueUsd()
      + this.getAmznValueUsd() + this.getNvdaValueUsd() + this.getCoinValueUsd() + this.getEemValueUsd()
      + this.getMsftValueUsd() + this.getNflxValueUsd() + this.getFbValueUsd() + this.getVooValueUsd()
      + this.getDisValueUsd() + this.getMchiValueUsd() + this.getMstrValueUsd() + this.getIntcValueUsd()
      + this.getPyplValueUsd() + this.getBrkbValueUsd() + this.getKoValueUsd() + this.getPgValueUsd()
      + this.getSapValueUsd() + this.getUraValueUsd() + this.getGsgValueUsd() + this.getCsValueUsd()
      + this.getXomValueUsd() + this.getPpltValueUsd() + this.getTanValueUsd() + this.getGovtValueUsd()
      + this.getJnjValueUsd() + this.getAddyyValueUsd() + this.getGsValueUsd() + this.getDaxValueUsd();

    // Collateral
    const collateral = this.getVaultsValueUsd();

    return allCryptoAndStocks + collateral;
  }

  getAllValuesUsdPriceWithputLoan(): number {

    // All Crypto and Stock values
    const allWithLoans = this.getAllValuesUsdPrice();
    const loans = this.getVaultsLoansValueUsd();
    let freezerValue = 0;
    // Freezer not couting
    if (!this.freezerInTotolValue) {
      freezerValue += this.adressesMasternodesFreezer5.length * 20000 * this.poolBtc?.priceB;
      freezerValue += this.adressesMasternodesFreezer10.length * 20000 * this.poolBtc?.priceB;
    }
    return allWithLoans - loans - freezerValue;
  }

  getVaultsLoansValueUsd(): number {
    let loan = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        loan += +this.getLoanFromVaultUsd(addressVault);
      });
    });

    return loan;
  }

  getLoanFromVaultUsd(vault: Vault): number {

    let usd = 0; let spy = 0; let tsla = 0; let qqq = 0; let pltr = 0; let slv = 0; let aapl = 0; let gld = 0;
    let gme = 0; let google = 0; let arkk = 0; let baba = 0; let vnq = 0; let urth = 0; let tlt = 0;
    let pdbc = 0; let amzn = 0; let nvda = 0; let coin = 0; let eem = 0;
    let msft = 0; let fb = 0; let voo = 0; let nflx = 0;
    let dis = 0; let mchi = 0; let mstr = 0; let intc = 0;
    let pypl = 0; let brkb = 0; let ko = 0; let pg = 0;
    let sap = 0; let ura = 0; let cs = 0; let gsg = 0;
    let xom = 0; let govt = 0; let tan = 0; let pplt = 0;
    let jnj = 0; let addyy = 0; let gs = 0; let dax = 0;

    vault?.loanAmounts?.forEach(loan => {
      if ('DUSD' === loan.symbolKey) {
        usd = +loan.amount;
      } else if ('SPY' === loan.symbolKey) {
        spy = +loan.amount * this.getUsdPriceOfStockPools(this.poolSpy);
      } else if ('TSLA' === loan.symbolKey) {
        tsla = +loan.amount * this.getUsdPriceOfStockPools(this.poolTsla);
      } else if ('QQQ' === loan.symbolKey) {
        qqq = +loan.amount * this.getUsdPriceOfStockPools(this.poolQqq);
      } else if ('PLTR' === loan.symbolKey) {
        pltr = +loan.amount * this.getUsdPriceOfStockPools(this.poolPltr);
      } else if ('SLV' === loan.symbolKey) {
        slv = +loan.amount * this.getUsdPriceOfStockPools(this.poolSlv);
      } else if ('AAPL' === loan.symbolKey) {
        aapl = +loan.amount * this.getUsdPriceOfStockPools(this.poolAapl);
      } else if ('GLD' === loan.symbolKey) {
        gld = +loan.amount * this.getUsdPriceOfStockPools(this.poolGld);
      } else if ('GME' === loan.symbolKey) {
        gme = +loan.amount * this.getUsdPriceOfStockPools(this.poolGme);
      } else if ('GOOGL' === loan.symbolKey) {
        google = +loan.amount * this.getUsdPriceOfStockPools(this.poolGoogl);
      } else if ('ARKK' === loan.symbolKey) {
        arkk = +loan.amount * this.getUsdPriceOfStockPools(this.poolArkk);
      } else if ('BABA' === loan.symbolKey) {
        baba = +loan.amount * this.getUsdPriceOfStockPools(this.poolBaba);
      } else if ('VNQ' === loan.symbolKey) {
        vnq = +loan.amount * this.getUsdPriceOfStockPools(this.poolVnq);
      } else if ('URTH' === loan.symbolKey) {
        urth = +loan.amount * this.getUsdPriceOfStockPools(this.poolUrth);
      } else if ('TLT' === loan.symbolKey) {
        tlt = +loan.amount * this.getUsdPriceOfStockPools(this.poolTlt);
      } else if ('PDBC' === loan.symbolKey) {
        pdbc = +loan.amount * this.getUsdPriceOfStockPools(this.poolPdbc);
      } else if ('AMZN' === loan.symbolKey) {
        amzn = +loan.amount * this.getUsdPriceOfStockPools(this.poolAmzn);
      } else if ('NVDA' === loan.symbolKey) {
        nvda = +loan.amount * this.getUsdPriceOfStockPools(this.poolNvda);
      } else if ('COIN' === loan.symbolKey) {
        coin = +loan.amount * this.getUsdPriceOfStockPools(this.poolCoin);
      } else if ('EEM' === loan.symbolKey) {
        eem = +loan.amount * this.getUsdPriceOfStockPools(this.poolEem);
      } else if ('MSFT' === loan.symbolKey) {
        msft = +loan.amount * this.getUsdPriceOfStockPools(this.poolMsft);
      } else if ('NFLX' === loan.symbolKey) {
        nflx = +loan.amount * this.getUsdPriceOfStockPools(this.poolNflx);
      } else if ('VOO' === loan.symbolKey) {
        voo = +loan.amount * this.getUsdPriceOfStockPools(this.poolVoo);
      } else if ('FB' === loan.symbolKey) {
        fb = +loan.amount * this.getUsdPriceOfStockPools(this.poolFb);
      } else if ('DIS' === loan.symbolKey) {
        dis = +loan.amount * this.getUsdPriceOfStockPools(this.poolDis);
      } else if ('MCHI' === loan.symbolKey) {
        mchi = +loan.amount * this.getUsdPriceOfStockPools(this.poolMchi);
      } else if ('MSTR' === loan.symbolKey) {
        mstr = +loan.amount * this.getUsdPriceOfStockPools(this.poolMstr);
      } else if ('INTC' === loan.symbolKey) {
        intc = +loan.amount * this.getUsdPriceOfStockPools(this.poolIntc);
      } else if ('PYPL' === loan.symbolKey) {
        pypl = +loan.amount * this.getUsdPriceOfStockPools(this.poolPypl);
      } else if ('BRK.B' === loan.symbolKey) {
        brkb = +loan.amount * this.getUsdPriceOfStockPools(this.poolBrkb);
      } else if ('KO' === loan.symbolKey) {
        ko = +loan.amount * this.getUsdPriceOfStockPools(this.poolKo);
      } else if ('PG' === loan.symbolKey) {
        pg = +loan.amount * this.getUsdPriceOfStockPools(this.poolPg);
      } else if ('URA' === loan.symbolKey) {
        ura = +loan.amount * this.getUsdPriceOfStockPools(this.poolUra);
      } else if ('GSG' === loan.symbolKey) {
        gsg = +loan.amount * this.getUsdPriceOfStockPools(this.poolGsg);
      } else if ('CS' === loan.symbolKey) {
        cs = +loan.amount * this.getUsdPriceOfStockPools(this.poolCs);
      } else if ('SAP' === loan.symbolKey) {
        sap = +loan.amount * this.getUsdPriceOfStockPools(this.poolSap);
      } else if ('PPLT' === loan.symbolKey) {
        pplt = +loan.amount * this.getUsdPriceOfStockPools(this.poolPplt);
      } else if ('GOVT' === loan.symbolKey) {
        govt = +loan.amount * this.getUsdPriceOfStockPools(this.poolGovt);
      } else if ('TAN' === loan.symbolKey) {
        tan = +loan.amount * this.getUsdPriceOfStockPools(this.poolTan);
      } else if ('XOM' === loan.symbolKey) {
        xom = +loan.amount * this.getUsdPriceOfStockPools(this.poolXom);
      } else if ('JNJ' === loan.symbolKey) {
        jnj = +loan.amount * this.getUsdPriceOfStockPools(this.poolJnj);
      } else if ('ADDYY' === loan.symbolKey) {
        addyy = +loan.amount * this.getUsdPriceOfStockPools(this.poolAddyy);
      } else if ('GS' === loan.symbolKey) {
        gs = +loan.amount * this.getUsdPriceOfStockPools(this.poolGs);
      } else if ('DAX' === loan.symbolKey) {
        dax = +loan.amount * this.getUsdPriceOfStockPools(this.poolDax);
      }
    });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx + voo + fb
      + dis + mchi + mstr + intc + pypl + brkb + ko + pg + sap + ura + gsg + cs
      + pplt + xom + govt + tan + jnj + gs + addyy + dax;
  }

  getVaultsValueUsd(): number {

    let dfiInVaults = 0;
    let btcInVaults = 0;
    let ethInVaults = 0;
    let usdcInVaults = 0;
    let usdtInVaults = 0;
    let dusdInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault?.collateralAmounts?.forEach(vaultCollaterral => {
          if ('DFI' === vaultCollaterral.symbolKey) {
            dfiInVaults += +vaultCollaterral.amount;
          } else if ('BTC' === vaultCollaterral.symbolKey) {
            btcInVaults += +vaultCollaterral.amount;
          } else if ('ETH' === vaultCollaterral.symbolKey) {
            ethInVaults += +vaultCollaterral.amount;
          } else if ('USDC' === vaultCollaterral.symbolKey) {
            usdcInVaults += +vaultCollaterral.amount;
          } else if ('USDT' === vaultCollaterral.symbolKey) {
            usdtInVaults += +vaultCollaterral.amount;
          } else if ('DUSD' === vaultCollaterral.symbolKey) {
            dusdInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults * this.poolBtc?.priceB + btcInVaults * this.poolBtc?.priceA + ethInVaults
      * this.poolEth?.priceA + usdcInVaults + usdtInVaults + dusdInVaults * 0.99;

  }

  getFreezerDfiCount(): number {
    let dfi = 0;
    this.adressesMasternodesFreezer5.forEach(a => {
      dfi += this.adressBalances.find(p => p.address === a)?.dfiCoins;
    });

    this.adressesMasternodesFreezer10.forEach(a => {
      dfi += this.adressBalances.find(p => p.address === a)?.dfiCoins;
    });

    return dfi;
  }

  getBtcValueUsd(): number {
    return (this.wallet?.btcInBtcPool + this.wallet?.btc) * this.poolBtc?.priceA;
  }
  getBtcValueLmUsd(): number {
    return (this.wallet?.btcInBtcPool) * this.poolBtc?.priceA;
  }
  getEthValueUsd(): number {
    return (this.wallet?.ethInEthPool + this.wallet?.eth) * this.poolEth?.priceA;
  }
  getEthValueLmUsd(): number {
    return (this.wallet?.ethInEthPool) * this.poolEth?.priceA;
  }
  getUsdtValueUsd(): number {
    return (this.wallet?.usdtInUsdtPool + this.wallet?.usdtInUsdtDusdPool + this.wallet?.usdt) * this.poolUsdt?.priceA;
  }
  getUsdtValueLmUsd(): number {
    return (this.wallet?.usdtInUsdtPool + this.wallet?.usdtInUsdtDusdPool) * this.poolUsdt?.priceA;
  }
  getUsdcValueUsd(): number {
    return (this.wallet?.usdcInUsdcPool + this.wallet?.usdcInUsdcDusdPool + this.wallet?.usdc) * this.poolUsdc?.priceA;
  }
  getUsdcValueLmUsd(): number {
    return (this.wallet?.usdcInUsdcPool + this.wallet?.usdcInUsdcDusdPool ) * this.poolUsdc?.priceA;
  }
  getLtcValueUsd(): number {
    return (this.wallet?.ltcInLtcPool + this.wallet?.ltc) * this.poolLtc?.priceA;
  }
  getLtcValueLmUsd(): number {
    return (this.wallet?.ltcInLtcPool) * this.poolLtc?.priceA;
  }
  getDogeValueUsd(): number {
    return (this.wallet?.dogeInDogePool + this.wallet?.doge) * this.poolDoge?.priceA;
  }
  getDogeValueLmUsd(): number {
    return (this.wallet?.dogeInDogePool) * this.poolDoge?.priceA;
  }
  getBchValueUsd(): number {
    return (this.wallet?.bchInBchPool + this.wallet?.bch) * this.poolBch?.priceA;
  }
  getBchValueLmUsd(): number {
    return (this.wallet?.bchInBchPool) * this.poolBch?.priceA;
  }

  getUsdValueUsd(): number {
    return this.getUsdValueLmUsd() + (this.wallet?.usd * this.getUsdPriceOfStockPools(this.poolUsd));
  }

  getUsdValueLmUsd(): number {
    return (this.wallet?.usdInUsdPool + this.wallet?.dusdInUsdcDusdPool + this.wallet?.dusdInUsdtDusdPool
      + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
      + this.wallet?.usdInQqqPool + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
      + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
      + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
      + this.wallet?.usdInPdbcPool + this.wallet?.usdInAmznPool + this.wallet?.usdInNvdaPool + this.wallet?.usdInCoinPool
      + this.wallet?.usdInEemPool + this.wallet?.usdInMsftPool + this.wallet?.usdInNflxPool + this.wallet?.usdInVooPool
      + this.wallet?.usdInFbPool + this.wallet?.usdInDisPool + this.wallet?.usdInMchiPool + this.wallet?.usdInMstrPool
      + this.wallet?.usdInIntcPool + this.wallet?.usdInPyplPool + this.wallet?.usdInBrkbPool +  this.wallet?.usdInKoPool
      + this.wallet?.usdInPgPool + this.wallet?.usdInSapPool + this.wallet?.usdInUraPool + this.wallet?.usdInGsgPool
      + this.wallet?.usdInCsPool + this.wallet?.usdInPpltPool + this.wallet?.usdInGovtPool + this.wallet?.usdInXomPool
      + this.wallet?.usdInTanPool + this.wallet?.usdInJnjPool + this.wallet?.usdInAddyyPool + this.wallet?.usdInGsPool
      + this.wallet?.usdInDaxPool) * this.getUsdPriceOfStockPools(this.poolUsd);
  }
  getTslaValueUsd(): number {
    return (this.wallet?.tslaInTslaPool + this.wallet?.tsla) * this.getUsdPriceOfStockPools(this.poolTsla);
  }
  getTslaValueLmUsd(): number {
    return (this.wallet?.tslaInTslaPool) * this.getUsdPriceOfStockPools(this.poolTsla);
  }
  getSpyValueUsd(): number {
    return (this.wallet?.spyInSpyPool + this.wallet?.spy) * this.getUsdPriceOfStockPools(this.poolSpy);
  }
  getSpyValueLmUsd(): number {
    return (this.wallet?.spyInSpyPool) * this.getUsdPriceOfStockPools(this.poolSpy);
  }
  getQqqValueUsd(): number {
    return (this.wallet?.qqqInQqqPool + this.wallet?.qqq) * this.getUsdPriceOfStockPools(this.poolQqq);
  }
  getQqqValueLmUsd(): number {
    return (this.wallet?.qqqInQqqPool) * this.getUsdPriceOfStockPools(this.poolQqq);
  }
  getPltrValueUsd(): number {
    return (this.wallet?.pltrInPltrPool + this.wallet?.pltr) * this.getUsdPriceOfStockPools(this.poolPltr);
  }
  getPltrValueLmUsd(): number {
    return (this.wallet?.pltrInPltrPool) * this.getUsdPriceOfStockPools(this.poolPltr);
  }
  getSlvValueUsd(): number {
    return (this.wallet?.slvInSlvPool + this.wallet?.slv) * this.getUsdPriceOfStockPools(this.poolSlv);
  }
  getSlvValueLmUsd(): number {
    return (this.wallet?.slvInSlvPool) * this.getUsdPriceOfStockPools(this.poolSlv);
  }
  getAaplValueUsd(): number {
    return (this.wallet?.aaplInAaplPool + this.wallet?.aapl) * this.getUsdPriceOfStockPools(this.poolAapl);
  }
  getAaplValueLmUsd(): number {
    return (this.wallet?.aaplInAaplPool) * this.getUsdPriceOfStockPools(this.poolAapl);
  }
  getGldValueUsd(): number {
    return (this.wallet?.gldInGldPool + this.wallet?.gld) * this.getUsdPriceOfStockPools(this.poolGld);
  }
  getGldValueLmUsd(): number {
    return (this.wallet?.gldInGldPool) * this.getUsdPriceOfStockPools(this.poolGld);
  }
  getGmeValueUsd(): number {
    return (this.wallet?.gmeInGmePool + this.wallet?.gme) * this.getUsdPriceOfStockPools(this.poolGme);
  }
  getGmeValueLmUsd(): number {
    return (this.wallet?.gmeInGmePool) * this.getUsdPriceOfStockPools(this.poolGme);
  }
  getGooglValueUsd(): number {
    return (this.wallet?.googlInGooglPool + this.wallet?.googl) * this.getUsdPriceOfStockPools(this.poolGoogl);
  }
  getGooglValueLmUsd(): number {
    return (this.wallet?.googlInGooglPool) * this.getUsdPriceOfStockPools(this.poolGoogl);
  }
  getArkkValueUsd(): number {
    return (this.wallet?.arkkInArkkPool + this.wallet?.arkk) * this.getUsdPriceOfStockPools(this.poolArkk);
  }
  getArkkValueLmUsd(): number {
    return (this.wallet?.arkkInArkkPool) * this.getUsdPriceOfStockPools(this.poolArkk);
  }
  getBabaValueUsd(): number {
    return (this.wallet?.babaInBabaPool + this.wallet?.baba) * this.getUsdPriceOfStockPools(this.poolBaba);
  }
  getBabaValueLmUsd(): number {
    return (this.wallet?.babaInBabaPool) * this.getUsdPriceOfStockPools(this.poolBaba);
  }
  getVnqValueUsd(): number {
    return (this.wallet?.vnqInVnqPool + this.wallet?.vnq) * this.getUsdPriceOfStockPools(this.poolVnq);
  }
  getVnqValueLmUsd(): number {
    return (this.wallet?.vnqInVnqPool) * this.getUsdPriceOfStockPools(this.poolVnq);
  }
  getUrthValueUsd(): number {
    return (this.wallet?.urthInUrthPool + this.wallet?.urth) * this.getUsdPriceOfStockPools(this.poolUrth);
  }
  getUrthValueLmUsd(): number {
    return (this.wallet?.urthInUrthPool) * this.getUsdPriceOfStockPools(this.poolUrth);
  }
  getTltValueUsd(): number {
    return (this.wallet?.tltInTltPool + this.wallet?.tlt) * this.getUsdPriceOfStockPools(this.poolTlt);
  }
  getTltValueLmUsd(): number {
    return (this.wallet?.tltInTltPool) * this.getUsdPriceOfStockPools(this.poolTlt);
  }
  getPdbcValueUsd(): number {
    return (this.wallet?.pdbcInPdbcPool + this.wallet?.pdbc) * this.getUsdPriceOfStockPools(this.poolPdbc);
  }
  getPdbcValueLmUsd(): number {
    return (this.wallet?.pdbcInPdbcPool) * this.getUsdPriceOfStockPools(this.poolPdbc);
  }
  getAmznValueUsd(): number {
    return (this.wallet?.amznInAmznPool + this.wallet?.amzn) * this.getUsdPriceOfStockPools(this.poolAmzn);
  }
  getAmznValueLmUsd(): number {
    return (this.wallet?.amznInAmznPool) * this.getUsdPriceOfStockPools(this.poolAmzn);
  }
  getNvdaValueUsd(): number {
    return (this.wallet?.nvdaInNvdaPool + this.wallet?.nvda) * this.getUsdPriceOfStockPools(this.poolNvda);
  }
  getNvdaValueLmUsd(): number {
    return (this.wallet?.nvdaInNvdaPool) * this.getUsdPriceOfStockPools(this.poolNvda);
  }
  getCoinValueUsd(): number {
    return (this.wallet?.coinInCoinPool + this.wallet?.coin) * this.getUsdPriceOfStockPools(this.poolCoin);
  }
  getCoinValueLmUsd(): number {
    return (this.wallet?.coinInCoinPool) * this.getUsdPriceOfStockPools(this.poolCoin);
  }
  getEemValueUsd(): number {
    return (this.wallet?.eemInEemPool + this.wallet?.eem) * this.getUsdPriceOfStockPools(this.poolEem);
  }
  getEemValueLmUsd(): number {
    return (this.wallet?.eemInEemPool) * this.getUsdPriceOfStockPools(this.poolEem);
  }
  getMsftValueUsd(): number {
    return (this.wallet?.msftInMsftPool + this.wallet?.msft) * this.getUsdPriceOfStockPools(this.poolMsft);
  }
  getMsftValueLmUsd(): number {
    return (this.wallet?.msftInMsftPool) * this.getUsdPriceOfStockPools(this.poolMsft);
  }
  getFbValueUsd(): number {
    return (this.wallet?.fbInFbPool + this.wallet?.fb) * this.getUsdPriceOfStockPools(this.poolFb);
  }
  getFbValueLmUsd(): number {
    return (this.wallet?.fbInFbPool) * this.getUsdPriceOfStockPools(this.poolFb);
  }
  getNflxValueUsd(): number {
    return (this.wallet?.nflxInNflxPool + this.wallet?.nflx) * this.getUsdPriceOfStockPools(this.poolNflx);
  }
  getNflxValueLmUsd(): number {
    return (this.wallet?.nflxInNflxPool) * this.getUsdPriceOfStockPools(this.poolNflx);
  }
  getVooValueUsd(): number {
    return (this.wallet?.vooInVooPool + this.wallet?.voo) * this.getUsdPriceOfStockPools(this.poolVoo);
  }
  getVooValueLmUsd(): number {
    return (this.wallet?.vooInVooPool) * this.getUsdPriceOfStockPools(this.poolVoo);
  }
  getDisValueUsd(): number {
    return (this.wallet?.disInDisPool + this.wallet?.dis) * this.getUsdPriceOfStockPools(this.poolDis);
  }
  getDisValueLmUsd(): number {
    return (this.wallet?.disInDisPool) * this.getUsdPriceOfStockPools(this.poolDis);
  }
  getMchiValueUsd(): number {
    return (this.wallet?.mchiInMchiPool + this.wallet?.mchi) * this.getUsdPriceOfStockPools(this.poolMchi);
  }
  getMchiValueLmUsd(): number {
    return (this.wallet?.mchiInMchiPool) * this.getUsdPriceOfStockPools(this.poolMchi);
  }
  getMstrValueUsd(): number {
    return (this.wallet?.mstrInMstrPool + this.wallet?.mstr) * this.getUsdPriceOfStockPools(this.poolMstr);
  }
  getMstrValueLmUsd(): number {
    return (this.wallet?.mstrInMstrPool) * this.getUsdPriceOfStockPools(this.poolMstr);
  }
  getIntcValueUsd(): number {
    return (this.wallet?.intcInIntcPool + this.wallet?.intc) * this.getUsdPriceOfStockPools(this.poolIntc);
  }
  getIntcValueLmUsd(): number {
    return (this.wallet?.intcInIntcPool) * this.getUsdPriceOfStockPools(this.poolIntc);
  }
  getPyplValueUsd(): number {
    return (this.wallet?.pyplInPyplPool + this.wallet?.pypl) * this.getUsdPriceOfStockPools(this.poolPypl);
  }
  getPyplValueLmUsd(): number {
    return (this.wallet?.pyplInPyplPool) * this.getUsdPriceOfStockPools(this.poolPypl);
  }
  getBrkbValueUsd(): number {
    return (this.wallet?.brkbInBrkbPool + this.wallet?.brkb) * this.getUsdPriceOfStockPools(this.poolBrkb);
  }
  getBrkbValueLmUsd(): number {
    return (this.wallet?.brkbInBrkbPool) * this.getUsdPriceOfStockPools(this.poolBrkb);
  }
  getKoValueUsd(): number {
    return (this.wallet?.koInKoPool + this.wallet?.ko) * this.getUsdPriceOfStockPools(this.poolKo);
  }
  getKoValueLmUsd(): number {
    return (this.wallet?.koInKoPool) * this.getUsdPriceOfStockPools(this.poolKo);
  }
  getPgValueUsd(): number {
    return (this.wallet?.pgInPgPool + this.wallet?.pg) * this.getUsdPriceOfStockPools(this.poolPg);
  }
  getPgValueLmUsd(): number {
    return (this.wallet?.pgInPgPool) * this.getUsdPriceOfStockPools(this.poolPg);
  }
  getSapValueUsd(): number {
    return (this.wallet?.sapInSapPool + this.wallet?.sap) * this.getUsdPriceOfStockPools(this.poolSap);
  }
  getSapValueLmUsd(): number {
    return (this.wallet?.sapInSapPool) * this.getUsdPriceOfStockPools(this.poolSap);
  }
  getUraValueUsd(): number {
    return (this.wallet?.uraInUraPool + this.wallet?.ura) * this.getUsdPriceOfStockPools(this.poolUra);
  }
  getUraValueLmUsd(): number {
    return (this.wallet?.uraInUraPool) * this.getUsdPriceOfStockPools(this.poolUra);
  }
  getGsgValueUsd(): number {
    return (this.wallet?.gsgInGsgPool + this.wallet?.gsg) * this.getUsdPriceOfStockPools(this.poolGsg);
  }
  getGsgValueLmUsd(): number {
    return (this.wallet?.gsgInGsgPool) * this.getUsdPriceOfStockPools(this.poolGsg);
  }
  getCsValueUsd(): number {
    return (this.wallet?.csInCsPool + this.wallet?.cs) * this.getUsdPriceOfStockPools(this.poolCs);
  }
  getCsValueLmUsd(): number {
    return (this.wallet?.csInCsPool) * this.getUsdPriceOfStockPools(this.poolCs);
  }

  getPpltValueUsd(): number {
    return (this.wallet?.ppltInPpltPool + this.wallet?.pplt) * this.getUsdPriceOfStockPools(this.poolPplt);
  }
  getPpltValueLmUsd(): number {
    return (this.wallet?.ppltInPpltPool) * this.getUsdPriceOfStockPools(this.poolPplt);
  }

  getGovtValueUsd(): number {
    return (this.wallet?.govtInGovtPool + this.wallet?.govt) * this.getUsdPriceOfStockPools(this.poolGovt);
  }
  getGovtValueLmUsd(): number {
    return (this.wallet?.govtInGovtPool) * this.getUsdPriceOfStockPools(this.poolGovt);
  }

  getXomValueUsd(): number {
    return (this.wallet?.xomInXomPool + this.wallet?.xom) * this.getUsdPriceOfStockPools(this.poolXom);
  }
  getXomValueLmUsd(): number {
    return (this.wallet?.xomInXomPool) * this.getUsdPriceOfStockPools(this.poolXom);
  }

  getTanValueUsd(): number {
    return (this.wallet?.tanInTanPool + this.wallet?.tan) * this.getUsdPriceOfStockPools(this.poolTan);
  }
  getTanValueLmUsd(): number {
    return (this.wallet?.tanInTanPool) * this.getUsdPriceOfStockPools(this.poolTan);
  }

  getJnjValueUsd(): number {
    return (this.wallet?.jnjInJnjPool + this.wallet?.jnj) * this.getUsdPriceOfStockPools(this.poolJnj);
  }
  getJnjValueLmUsd(): number {
    return (this.wallet?.jnjInJnjPool) * this.getUsdPriceOfStockPools(this.poolJnj);
  }

  getAddyyValueUsd(): number {
    return (this.wallet?.addyyInAddyyPool + this.wallet?.addyy) * this.getUsdPriceOfStockPools(this.poolAddyy);
  }
  getAddyyValueLmUsd(): number {
    return (this.wallet?.addyyInAddyyPool) * this.getUsdPriceOfStockPools(this.poolAddyy);
  }

  getGsValueUsd(): number {
    return (this.wallet?.gsInGsPool + this.wallet?.gs) * this.getUsdPriceOfStockPools(this.poolGs);
  }
  getGsValueLmUsd(): number {
    return (this.wallet?.gsInGsPool) * this.getUsdPriceOfStockPools(this.poolGs);
  }

  getDaxValueUsd(): number {
    return (this.wallet?.daxInDaxPool + this.wallet?.dax) * this.getUsdPriceOfStockPools(this.poolDax);
  }
  getDaxValueLmUsd(): number {
    return (this.wallet?.daxInDaxPool) * this.getUsdPriceOfStockPools(this.poolDax);
  }

  getUsdPriceOfStockPools(pool: Pool): number {

    if (pool && pool.id === '17') {
      return this.getCorrectDusdPrice();
    }

    return pool ? pool?.totalLiquidityUsd / 2 / +pool?.reserveA : 0;
  }

  getCorrectDusdPrice(): number {
    return (100 + this.getArb(this.priceDFICEX,
      this.poolUsd?.totalLiquidityUsd / 2 / +this.poolUsd?.reserveB) * -1 ) / 100;
  }

  getDfiCount(): number {
    return this.wallet?.dfi + this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool
      + this.wallet?.dfiInUsdcPool + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool  + this.wallet?.dfiInUsdPool
      + this.wallet?.dfiInBchPool + this.dfiInStaking + this.dfiInDfxStaking + this.wallet?.dfiInMasternodes;

  }

  getDfiCountLM(): number {
    return this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool + this.wallet?.dfiInUsdcPool
      + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool + this.wallet?.dfiInBchPool + this.wallet?.dfiInUsdPool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return (this.dfiInStaking + this.dfiInDfxStaking) * this.poolBtc?.priceB;
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd()
      + this.getBtcValueLmUsd() + this.getEthValueLmUsd() + this.getLtcValueLmUsd()
      + this.getUsdtValueLmUsd() + this.getUsdcValueLmUsd() + this.getDogeValueLmUsd() + this.getBchValueLmUsd()
      + this.getUsdValueLmUsd()
      + this.getTslaValueLmUsd() + this.getSpyValueLmUsd() + this.getQqqValueLmUsd()
      + this.getPltrValueLmUsd() + this.getSlvValueLmUsd() + this.getAaplValueLmUsd() + this.getGldValueLmUsd()
      + this.getGmeValueLmUsd() + this.getGooglValueLmUsd() + this.getArkkValueLmUsd() + this.getBabaValueLmUsd()
      + this.getVnqValueLmUsd() + this.getUrthValueLmUsd() + this.getTltValueLmUsd() + this.getPdbcValueLmUsd()
      + this.getAmznValueLmUsd() + this.getNvdaValueLmUsd() + this.getCoinValueLmUsd() + this.getEemValueLmUsd()
      + this.getMsftValueLmUsd() + this.getFbValueLmUsd() + this.getVooValueLmUsd() + this.getNflxValueLmUsd()
      + this.getDisValueLmUsd() + this.getMchiValueLmUsd() + this.getMstrValueLmUsd() + this.getIntcValueLmUsd()
      + this.getPyplValueLmUsd() + this.getBrkbValueLmUsd() + this.getKoValueLmUsd() + this.getPgValueLmUsd()
      + this.getGsgValueLmUsd() + this.getSapValueLmUsd() + this.getUraValueLmUsd() + this.getCsValueLmUsd()
      + this.getXomValueLmUsd() + this.getPpltValueLmUsd() + this.getTanValueLmUsd() + this.getGovtValueLmUsd()
      + this.getJnjValueLmUsd() + this.getAddyyValueLmUsd() + this.getGsValueLmUsd() + this.getDaxValueLmUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return (this.dfiInStaking + this.dfiInDfxStaking) * this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    return this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool + this.wallet?.dfiInUsdcPool
      + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool + this.wallet?.dfiInUsdPool;
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getAllPoolDfIncome(): number {
    return this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolUsdtOut.dfiPerDay
      + this.poolUsdUsdtOut.dfiPerDay + this.poolUsdUsdcOut.dfiPerDay
      + this.poolUsdcOut.dfiPerDay + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay + this.poolUsdOut.dfiPerDay
      + this.poolTslaOut.dfiPerDay + this.poolSpyOut.dfiPerDay + this.poolQqqOut.dfiPerDay + this.poolPltrOut.dfiPerDay
      + this.poolSlvOut.dfiPerDay + this.poolAaplOut.dfiPerDay + this.poolGldOut.dfiPerDay + this.poolGmeOut.dfiPerDay
      + this.poolGooglOut.dfiPerDay + this.poolArkkOut.dfiPerDay + this.poolBabaOut.dfiPerDay + this.poolVnqOut.dfiPerDay
      + this.poolUrthOut.dfiPerDay + this.poolTltOut.dfiPerDay + this.poolPdbcOut.dfiPerDay
      + this.poolAmznOut.dfiPerDay + this.poolNvdaOut.dfiPerDay + this.poolCoinOut.dfiPerDay + this.poolEemOut.dfiPerDay
      + this.poolMsftOut.dfiPerDay + this.poolFbOut.dfiPerDay + this.poolVooOut.dfiPerDay + this.poolNflxOut.dfiPerDay
      + this.poolDisOut.dfiPerDay + this.poolMchiOut.dfiPerDay + this.poolMstrOut.dfiPerDay + this.poolIntcOut.dfiPerDay
      + this.poolPyplOut.dfiPerDay + this.poolBrkbOut.dfiPerDay + this.poolKoOut.dfiPerDay + this.poolPgOut.dfiPerDay
      + this.poolSapOut.dfiPerDay + this.poolUraOut.dfiPerDay + this.poolCsOut.dfiPerDay + this.poolGsgOut.dfiPerDay
      + this.poolXomOut.dfiPerDay + this.poolGovtOut.dfiPerDay + this.poolPpltOut.dfiPerDay + this.poolTanOut.dfiPerDay
      + this.poolJnjOut.dfiPerDay + this.poolAddyyOut.dfiPerDay + this.poolGsOut.dfiPerDay + this.poolDaxOut.dfiPerDay;
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
  getAnteilUSDTDusdPoolAnGesamtLM(): number {
    return this.poolUsdUsdtOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }
  getAnteilUSDCPoolAnGesamtLM(): number {
    return this.poolUsdcOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }
  getAnteilUSDCDusdPoolAnGesamtLM(): number {
    return this.poolUsdUsdcOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }
  getAnteilDogePoolAnGesamtLM(): number {
    return this.poolDogeOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }
  getAnteilBchPoolAnGesamtLM(): number {
    return this.poolBchOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }
  getAnteilUsdPoolAnGesamtLM(): number {
    return this.poolUsdOut.dfiPerDay > 0 ? this.poolUsdOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilTslaPoolAnGesamtLM(): number {
    return this.poolTslaOut.dfiPerDay > 0 ? this.poolTslaOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilSpyPoolAnGesamtLM(): number {
    return this.poolSpyOut.dfiPerDay > 0 ? this.poolSpyOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilQqqPoolAnGesamtLM(): number {
    return this.poolQqqOut.dfiPerDay > 0 ?  this.poolQqqOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilPltrPoolAnGesamtLM(): number {
    return this.poolPltrOut.dfiPerDay > 0 ? this.poolPltrOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilSlvPoolAnGesamtLM(): number {
    return this.poolSlvOut.dfiPerDay > 0 ? this.poolSlvOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilAaplPoolAnGesamtLM(): number {
    return this.poolAaplOut.dfiPerDay > 0 ? this.poolAaplOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGldPoolAnGesamtLM(): number {
    return this.poolGldOut.dfiPerDay > 0 ? this.poolGldOut.dfiPerDay  / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGmePoolAnGesamtLM(): number {
    return this.poolGmeOut.dfiPerDay > 0 ? this.poolGmeOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGooglPoolAnGesamtLM(): number {
    return this.poolGooglOut.dfiPerDay > 0 ? this.poolGooglOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilArkkPoolAnGesamtLM(): number {
    return this.poolArkkOut.dfiPerDay > 0 ? this.poolArkkOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilBabaPoolAnGesamtLM(): number {
    return this.poolBabaOut.dfiPerDay > 0 ? this.poolBabaOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilVnqPoolAnGesamtLM(): number {
    return this.poolVnqOut.dfiPerDay > 0 ?  this.poolVnqOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilUrthPoolAnGesamtLM(): number {
    return this.poolUrthOut.dfiPerDay > 0 ? this.poolUrthOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilTltPoolAnGesamtLM(): number {
    return this.poolTltOut.dfiPerDay > 0 ? this.poolTltOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilPdbcPoolAnGesamtLM(): number {
    return this.poolPdbcOut.dfiPerDay >  0 ? this.poolPdbcOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilAmznPoolAnGesamtLM(): number {
    return this.poolAmznOut.dfiPerDay > 0 ?  this.poolAmznOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilNvdaPoolAnGesamtLM(): number {
    return this.poolNvdaOut.dfiPerDay > 0 ? this.poolNvdaOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilCoinPoolAnGesamtLM(): number {
    return this.poolCoinOut.dfiPerDay > 0 ? this.poolCoinOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilEemPoolAnGesamtLM(): number {
    return this.poolEemOut.dfiPerDay >  0 ? this.poolEemOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilMsftPoolAnGesamtLM(): number {
    return this.poolMsftOut.dfiPerDay > 0 ?  this.poolMsftOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilFbPoolAnGesamtLM(): number {
    return this.poolFbOut.dfiPerDay > 0 ? this.poolFbOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilVooPoolAnGesamtLM(): number {
    return this.poolVooOut.dfiPerDay > 0 ? this.poolVooOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilNflxPoolAnGesamtLM(): number {
    return this.poolNflxOut.dfiPerDay >  0 ? this.poolNflxOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilDisPoolAnGesamtLM(): number {
    return this.poolDisOut.dfiPerDay >  0 ? this.poolDisOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilMchiPoolAnGesamtLM(): number {
    return this.poolMchiOut.dfiPerDay >  0 ? this.poolMchiOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilMstrPoolAnGesamtLM(): number {
    return this.poolMstrOut.dfiPerDay >  0 ? this.poolMstrOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilIntcPoolAnGesamtLM(): number {
    return this.poolIntcOut.dfiPerDay >  0 ? this.poolIntcOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilPyplPoolAnGesamtLM(): number {
    return this.poolPyplOut.dfiPerDay >  0 ? this.poolPyplOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilBrkbPoolAnGesamtLM(): number {
    return this.poolBrkbOut.dfiPerDay >  0 ? this.poolBrkbOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilKoPoolAnGesamtLM(): number {
    return this.poolKoOut.dfiPerDay >  0 ? this.poolKoOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilPgPoolAnGesamtLM(): number {
    return this.poolPgOut.dfiPerDay >  0 ? this.poolPgOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilSapPoolAnGesamtLM(): number {
    return this.poolSapOut.dfiPerDay >  0 ? this.poolSapOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilUraPoolAnGesamtLM(): number {
    return this.poolUraOut.dfiPerDay >  0 ? this.poolUraOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilCsPoolAnGesamtLM(): number {
    return this.poolCsOut.dfiPerDay >  0 ? this.poolCsOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGsgPoolAnGesamtLM(): number {
    return this.poolGsgOut.dfiPerDay >  0 ? this.poolGsgOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilXomPoolAnGesamtLM(): number {
    return this.poolXomOut.dfiPerDay >  0 ? this.poolXomOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGovtPoolAnGesamtLM(): number {
    return this.poolGovtOut.dfiPerDay >  0 ? this.poolGovtOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilTanPoolAnGesamtLM(): number {
    return this.poolTanOut.dfiPerDay >  0 ? this.poolTanOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilPpltPoolAnGesamtLM(): number {
    return this.poolPpltOut.dfiPerDay >  0 ? this.poolPpltOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilJnjPoolAnGesamtLM(): number {
    return this.poolJnjOut.dfiPerDay >  0 ? this.poolJnjOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilAddyyPoolAnGesamtLM(): number {
    return this.poolAddyyOut.dfiPerDay >  0 ? this.poolAddyyOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilGsPoolAnGesamtLM(): number {
    return this.poolGsOut.dfiPerDay >  0 ? this.poolGsOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }
  getAnteilDaxPoolAnGesamtLM(): number {
    return this.poolDaxOut.dfiPerDay >  0 ? this.poolDaxOut.dfiPerDay / this.getAllPoolDfIncome() * 100 : 0;
  }

  allAddresses(): string [] {
    return [...this.adressesMasternodes, ...this.adresses];
  }

  async importMamon(): Promise<void> {
    await this.loadMamon();

    this.clearWallet();
    this.loadAddressesAndDexData();

    setTimeout(() => {
      this.update();
    }, 10000);

  }

  async loadMamon(): Promise<void> {
    const account = await firstValueFrom(this.dataService.getMamonAccount(this.mamonKey));

    if (account) {
      for (const key of Object.keys(account)) {
        if (this.adressesMasternodes.indexOf(key) < 0) {
          this.adressesMasternodes.push(key);
          this.newAddressesAdded.push(key);
        }

        const node = await firstValueFrom(this.dataService.getMamonAccountNode(key)) as MamonAccountNode;

        if (this.newAddressesAdded.indexOf(key) > -1) {
          if (node.targetMultipliers && node.targetMultipliers.length === 3
            && this.adressesMasternodesFreezer5.indexOf(key) === -1) {
            this.adressesMasternodesFreezer5.push(key);
          }
          if (node.targetMultipliers && node.targetMultipliers.length === 4
            && this.adressesMasternodesFreezer10.indexOf(key) === -1) {
            this.adressesMasternodesFreezer10.push(key);
          }
        }
      }

      if (this.newAddressesAdded?.length === 0) {
        this.mamonKey = '';
        return;
      }

      this.showDialogAddressesAdded = true;
      this.mamonKey = '';


      setTimeout(() => {
        /** dialog ends after 5 seconds */
        this.showDialogAddressesAdded = false;
      }, 5000);
    }

  }

  trackCakeRef(): void {
    this.matomoTracker.trackEvent('Klick', 'Cake Reflink');
  }

  addAdress(): void {

    // checkCheckboxes
    this.showDialogAddressesAdded = false;

    if (!this.adress) {
      this.showDialogAddressesNotAdded = true;
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.showDialogAddressesNotAdded = false;
      }, 5000);
      return;
    }

    if (this.masternodeFreezer5 && this.masternodeFreezer10) {
      this.showDialogAddressesNotAdded = true;
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.showDialogAddressesNotAdded = false;
      }, 5000);
      return;
    } else if ((this.masternodeFreezer5 && !this.masternodeAdress) || (this.masternodeFreezer10 && !this.masternodeAdress)) {
      this.showDialogAddressesNotAdded = true;
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.showDialogAddressesNotAdded = false;
      }, 5000);
      return;
    }

    this.newAddressesAdded = new Array<string>();

    this.showDialogAddressesAdded = false;

    let inputAsArray = false;
    let inputTokens = false;

    // test if import from output of console
    try {
      const obj = JSON.parse(this.adress);

      if (Array.isArray(obj)) {
        inputAsArray = true;
        inputTokens = obj [0].key !== undefined && obj [0].key !== null;
      }

    } catch (e) {
      // nothing to do normal address import
    }

    // input from concole of app
    if (inputAsArray) {

      const obj = JSON.parse(this.adress);

      // if output from listaccounts {} false false true
      if (!inputTokens) {
        obj.forEach(l1 => {
          l1.forEach(l2 => {
            if (l2 [1] > 0) {
              if (this.adresses.indexOf(l2 [0]) < 0 && this.newAddressesAdded.indexOf(l2 [0]) < 0 &&
                this.adressesMasternodes.indexOf(l2 [0]) < 0) {

                this.adresses.push(l2 [0]);
                this.newAddressesAdded.push(l2 [0]);
              }
            }
          });
        });

        // if output from listaddressgroupings
      } else {
        obj.forEach(l1 => {
          if (this.adresses.indexOf(l1.owner) < 0 && this.newAddressesAdded.indexOf(l1.owner) < 0 &&
            this.adressesMasternodes.indexOf(l1.owner) < 0) {
            this.adresses.push(l1.owner);
            this.newAddressesAdded.push(l1.owner);
          }
        });
      }

    } else {

      this.adress.split(',').forEach(a => {

        if (!this.masternodeAdress) {
          if (this.adresses.indexOf(a) < 0) {
            this.adresses.push(a);
            this.newAddressesAdded.push(a);
          }
        } else {
          if (this.adressesMasternodes.indexOf(a) < 0) {
            this.adressesMasternodes.push(a);
            if (this.masternodeFreezer5 && this.adressesMasternodesFreezer5.indexOf(a) === -1) {
              this.adressesMasternodesFreezer5.push(a);
            }
            if (this.masternodeFreezer10 && this.adressesMasternodesFreezer10.indexOf(a) === -1) {
              this.adressesMasternodesFreezer10.push(a);
            }
            this.newAddressesAdded.push(a);
          }
        }

      });
    }

    this.showDialogAddressesAdded = true;

    if (this.newAddressesAdded?.length === 0) {
      this.adress = '';
      return;
    }

    setTimeout(() => {
      /** spinner ends after 10 seconds and update */
      this.showDialogAddressesAdded = false;
      this.update();
    }, 10000);

    this.adress = '';
    this.masternodeAdress = false;
    this.masternodeFreezer5 = false;
    this.masternodeFreezer10 = false;
    this.clearWallet();
    this.loadAddressesAndDexData();

  }

  deleteAdress(adress: string): void {
    const index = this.adresses.indexOf(adress, 0);
    const indexMn = this.adressesMasternodes.indexOf(adress, 0);
    const indexMnF5 = this.adressesMasternodesFreezer5.indexOf(adress, 0);
    const indexMnF10 = this.adressesMasternodesFreezer10.indexOf(adress, 0);
    if (index > -1) {
      this.adresses.splice(index, 1);
    }

    if (indexMn > -1) {
      this.adressesMasternodes.splice(indexMn, 1);
    }

    if (indexMnF5 > -1) {
      this.adressesMasternodesFreezer5.splice(indexMnF5, 1);
    }
    if (indexMnF10 > -1) {
      this.adressesMasternodesFreezer10.splice(indexMnF5, 1);
    }

    if (index > -1 || indexMn > -1) {
      this.clearWallet();
      this.loadAddressesAndDexData();
    }

    setTimeout(() => {
      /** after 5 seconds update */
      this.update();
    }, 5000);

  }

  clearWallet(): void {
    const newWallet = new Wallet();
    newWallet.dfiInStaking = this.dfiInStaking;
    newWallet.dfiInDfxStaking = this.dfiInDfxStaking;
    this.wallet = newWallet;
  }

  // ============= ONCHANGE INPUT =================
  // CRYPTO
  onChangeBtcBtcPool(): void {
    if (this.checkInputNumber(this.wallet.btcInBtcPool)) {
      localStorage.setItem(this.wallet.btcInBtcPoolKey, JSON.stringify(this.wallet.btcInBtcPool));
      this.berechnePoolOutBtc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeEthEthPool(): void {
    if (this.checkInputNumber(this.wallet.ethInEthPool)) {
      localStorage.setItem(this.wallet.ethInEthPoolKey, JSON.stringify(this.wallet.ethInEthPool));
      this.berechnePoolOutEth();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdtUsdtPool(): void {
    if (this.checkInputNumber(this.wallet.usdtInUsdtPool)) {
      localStorage.setItem(this.wallet.usdtInUsdtPoolKey, JSON.stringify(this.wallet.usdtInUsdtPool));
      this.berechnePoolOutUsdt();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeUsdcUsdcPool(): void {
    if (this.checkInputNumber(this.wallet.usdcInUsdcPool)) {
      localStorage.setItem(this.wallet.usdcInUsdcPoolKey, JSON.stringify(this.wallet.usdcInUsdcPool));
      this.berechnePoolOutUsdc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeUsdUsdPool(): void {
    if (this.checkInputNumber(this.wallet.usdInUsdPool)) {
      localStorage.setItem(this.wallet.usdInUsdPoolKey, JSON.stringify(this.wallet.usdInUsdPool));
      this.berechnePoolOutUsd();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeLtcLtcPool(): void {
    if (this.checkInputNumber(this.wallet.ltcInLtcPool)) {
      localStorage.setItem(this.wallet.ltcInLtcPoolKey, JSON.stringify(this.wallet.ltcInLtcPool));
      this.berechnePoolOutLtc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeDogeDogePool(): void {
    if (this.checkInputNumber(this.wallet.dogeInDogePool)) {
      localStorage.setItem(this.wallet.dogeInDogePoolKey, JSON.stringify(this.wallet.dogeInDogePool));
      this.berechnePoolOutDoge();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBchBchPool(): void {
    if (this.checkInputNumber(this.wallet.bchInBchPool)) {
      localStorage.setItem(this.wallet.bchInBchPoolKey, JSON.stringify(this.wallet.bchInBchPool));
      this.berechnePoolOutBch();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  // WALLETS
  onChangeBtcWallet(): void {
    if (this.checkInputNumber(this.wallet.btc)) {
      localStorage.setItem(this.wallet.btcKey, JSON.stringify(this.wallet.btc));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeDogeWallet(): void {
    if (this.checkInputNumber(this.wallet.doge)) {
      localStorage.setItem(this.wallet.dogeKey, JSON.stringify(this.wallet.doge));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBchWallet(): void {
    if (this.checkInputNumber(this.wallet.bch)) {
      localStorage.setItem(this.wallet.bchKey, JSON.stringify(this.wallet.bch));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeLtcWallet(): void {
    if (this.checkInputNumber(this.wallet.ltc)) {
      localStorage.setItem(this.wallet.ltcKey, JSON.stringify(this.wallet.ltc));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdtWallet(): void {
    if (this.checkInputNumber(this.wallet.usdt)) {
      localStorage.setItem(this.wallet.usdtKey, JSON.stringify(this.wallet.usdt));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdcWallet(): void {
    if (this.checkInputNumber(this.wallet.usdc)) {
      localStorage.setItem(this.wallet.usdcKey, JSON.stringify(this.wallet.usdc));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeEthWallet(): void {
    if (this.checkInputNumber(this.wallet.eth)) {
      localStorage.setItem(this.wallet.ethKey, JSON.stringify(this.wallet.eth));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdWallet(): void {
    if (this.checkInputNumber(this.wallet.usd)) {
      localStorage.setItem(this.wallet.usdKey, JSON.stringify(this.wallet.usd));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeTslaWallet(): void {
    if (this.checkInputNumber(this.wallet.tsla)) {
      localStorage.setItem(this.wallet.tslaKey, JSON.stringify(this.wallet.tsla));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSpyWallet(): void {
    if (this.checkInputNumber(this.wallet.spy)) {
      localStorage.setItem(this.wallet.spyKey, JSON.stringify(this.wallet.spy));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeQqqWallet(): void {
    if (this.checkInputNumber(this.wallet.qqq)) {
      localStorage.setItem(this.wallet.qqqKey, JSON.stringify(this.wallet.qqq));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePltrWallet(): void {
    if (this.checkInputNumber(this.wallet.pltr)) {
      localStorage.setItem(this.wallet.pltrKey, JSON.stringify(this.wallet.pltr));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSlvWallet(): void {
    if (this.checkInputNumber(this.wallet.slv)) {
      localStorage.setItem(this.wallet.slvKey, JSON.stringify(this.wallet.slv));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeAaplWallet(): void {
    if (this.checkInputNumber(this.wallet.aapl)) {
      localStorage.setItem(this.wallet.aaplKey, JSON.stringify(this.wallet.aapl));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGldWallet(): void {
    if (this.checkInputNumber(this.wallet.gld)) {
      localStorage.setItem(this.wallet.gldKey, JSON.stringify(this.wallet.gld));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGmeWallet(): void {
    if (this.checkInputNumber(this.wallet.gme)) {
      localStorage.setItem(this.wallet.gmeKey, JSON.stringify(this.wallet.gme));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGooglWallet(): void {
    if (this.checkInputNumber(this.wallet.googl)) {
      localStorage.setItem(this.wallet.googlKey, JSON.stringify(this.wallet.googl));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeArkkWallet(): void {
    if (this.checkInputNumber(this.wallet.arkk)) {
      localStorage.setItem(this.wallet.arkkKey, JSON.stringify(this.wallet.arkk));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBabaWallet(): void {
    if (this.checkInputNumber(this.wallet.baba)) {
      localStorage.setItem(this.wallet.babaKey, JSON.stringify(this.wallet.baba));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeVnqWallet(): void {
    if (this.checkInputNumber(this.wallet.vnq)) {
      localStorage.setItem(this.wallet.vnqKey, JSON.stringify(this.wallet.vnq));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUrthWallet(): void {
    if (this.checkInputNumber(this.wallet.urth)) {
      localStorage.setItem(this.wallet.urthKey, JSON.stringify(this.wallet.urth));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeTltWallet(): void {
    if (this.checkInputNumber(this.wallet.tlt)) {
      localStorage.setItem(this.wallet.tltKey, JSON.stringify(this.wallet.tlt));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePdbcWallet(): void {
    if (this.checkInputNumber(this.wallet.pdbc)) {
      localStorage.setItem(this.wallet.pdbcKey, JSON.stringify(this.wallet.pdbc));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeAmznWallet(): void {
    if (this.checkInputNumber(this.wallet.amzn)) {
      localStorage.setItem(this.wallet.amznKey, JSON.stringify(this.wallet.amzn));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeNvdaWallet(): void {
    if (this.checkInputNumber(this.wallet.nvda)) {
      localStorage.setItem(this.wallet.nvdaKey, JSON.stringify(this.wallet.nvda));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeCoinWallet(): void {
    if (this.checkInputNumber(this.wallet.coin)) {
      localStorage.setItem(this.wallet.coinKey, JSON.stringify(this.wallet.coin));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeEemWallet(): void {
    if (this.checkInputNumber(this.wallet.eem)) {
      localStorage.setItem(this.wallet.eemKey, JSON.stringify(this.wallet.eem));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMsftWallet(): void {
    if (this.checkInputNumber(this.wallet.msft)) {
      localStorage.setItem(this.wallet.msftKey, JSON.stringify(this.wallet.msft));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeNflxWallet(): void {
    if (this.checkInputNumber(this.wallet.nflx)) {
      localStorage.setItem(this.wallet.nflxKey, JSON.stringify(this.wallet.nflx));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeFbWallet(): void {
    if (this.checkInputNumber(this.wallet.fb)) {
      localStorage.setItem(this.wallet.fbKey, JSON.stringify(this.wallet.fb));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeVooWallet(): void {
    if (this.checkInputNumber(this.wallet.voo)) {
      localStorage.setItem(this.wallet.vooKey, JSON.stringify(this.wallet.voo));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDisWallet(): void {
    if (this.checkInputNumber(this.wallet.dis)) {
      localStorage.setItem(this.wallet.disKey, JSON.stringify(this.wallet.dis));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMchiWallet(): void {
    if (this.checkInputNumber(this.wallet.mchi)) {
      localStorage.setItem(this.wallet.mchiKey, JSON.stringify(this.wallet.mchi));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMstrWallet(): void {
    if (this.checkInputNumber(this.wallet.mstr)) {
      localStorage.setItem(this.wallet.mstrKey, JSON.stringify(this.wallet.mstr));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeIntcWallet(): void {
    if (this.checkInputNumber(this.wallet.intc)) {
      localStorage.setItem(this.wallet.intcKey, JSON.stringify(this.wallet.intc));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePyplWallet(): void {
    if (this.checkInputNumber(this.wallet.pypl)) {
      localStorage.setItem(this.wallet.pyplKey, JSON.stringify(this.wallet.pypl));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBrkbWallet(): void {
    if (this.checkInputNumber(this.wallet.brkb)) {
      localStorage.setItem(this.wallet.brkbKey, JSON.stringify(this.wallet.brkb));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeKoWallet(): void {
    if (this.checkInputNumber(this.wallet.ko)) {
      localStorage.setItem(this.wallet.koKey, JSON.stringify(this.wallet.ko));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePgWallet(): void {
    if (this.checkInputNumber(this.wallet.pg)) {
      localStorage.setItem(this.wallet.pgKey, JSON.stringify(this.wallet.pg));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSapWallet(): void {
    if (this.checkInputNumber(this.wallet.sap)) {
      localStorage.setItem(this.wallet.sapKey, JSON.stringify(this.wallet.sap));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUraWallet(): void {
    if (this.checkInputNumber(this.wallet.ura)) {
      localStorage.setItem(this.wallet.uraKey, JSON.stringify(this.wallet.ura));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeCsWallet(): void {
    if (this.checkInputNumber(this.wallet.cs)) {
      localStorage.setItem(this.wallet.csKey, JSON.stringify(this.wallet.cs));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGsgWallet(): void {
    if (this.checkInputNumber(this.wallet.gsg)) {
      localStorage.setItem(this.wallet.gsgKey, JSON.stringify(this.wallet.gsg));
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  // DFI in POOLS
  onChangeDfiBtcPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInBtcPool)) {
      localStorage.setItem(this.wallet.dfiInBtcPoolKey, JSON.stringify(this.wallet.dfiInBtcPool));
      this.berechnePoolOutBtc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiEthPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInEthPool)) {
      localStorage.setItem(this.wallet.dfiInEthPoolKey, JSON.stringify(this.wallet.dfiInEthPool));
      this.berechnePoolOutEth();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiUsdtPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInUsdtPool)) {
      localStorage.setItem(this.wallet.dfiInUsdtPoolKey, JSON.stringify(this.wallet.dfiInUsdtPool));
      this.berechnePoolOutUsdt();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiUsdcPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInUsdcPool)) {
      localStorage.setItem(this.wallet.dfiInUsdcPoolKey, JSON.stringify(this.wallet.dfiInUsdcPool));
      this.berechnePoolOutUsdc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiLtcPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInLtcPool)) {
      localStorage.setItem(this.wallet.dfiInLtcPoolKey, JSON.stringify(this.wallet.dfiInLtcPool));
      this.berechnePoolOutLtc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiDogePool(): void {
    if (this.checkInputNumber(this.wallet.dfiInDogePool)) {
      localStorage.setItem(this.wallet.dfiInDogePoolKey, JSON.stringify(this.wallet.dfiInDogePool));
      this.berechnePoolOutDoge();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiBchPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInBchPool)) {
      localStorage.setItem(this.wallet.dfiInBchPoolKey, JSON.stringify(this.wallet.dfiInBchPool));
      this.berechnePoolOutBch();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  onChangeDfiUsdPool(): void {
    if (this.checkInputNumber(this.wallet.dfiInUsdPool)) {
      localStorage.setItem(this.wallet.dfiInUsdPoolKey, JSON.stringify(this.wallet.dfiInUsdPool));
      this.berechnePoolOutUsd();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  // STOCKS
  onChangeTslaTslaPool(): void {
    if (this.checkInputNumber(this.wallet.tslaInTslaPool)) {
      localStorage.setItem(this.wallet.tslaInTslaPoolKey, JSON.stringify(this.wallet.tslaInTslaPool));
      this.berechnePoolOutTsla();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdTslaPool(): void {
    if (this.checkInputNumber(this.wallet.usdInTslaPool)) {
      localStorage.setItem(this.wallet.usdInTslaPoolKey, JSON.stringify(this.wallet.usdInTslaPool));
      this.berechnePoolOutTsla();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSpySpyPool(): void {
    if (this.checkInputNumber(this.wallet.spyInSpyPool)) {
      localStorage.setItem(this.wallet.spyInSpyPoolKey, JSON.stringify(this.wallet.spyInSpyPool));
      this.berechnePoolOutSpy();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdSpyPool(): void {
    if (this.checkInputNumber(this.wallet.usdInSpyPool)) {
      localStorage.setItem(this.wallet.usdInSpyPoolKey, JSON.stringify(this.wallet.usdInSpyPool));
      this.berechnePoolOutSpy();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeQqqQqqPool(): void {
    if (this.checkInputNumber(this.wallet.qqqInQqqPool)) {
      localStorage.setItem(this.wallet.qqqInQqqPoolKey, JSON.stringify(this.wallet.qqqInQqqPool));
      this.berechnePoolOutQqq();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdQqqPool(): void {
    if (this.checkInputNumber(this.wallet.usdInQqqPool)) {
      localStorage.setItem(this.wallet.usdInQqqPoolKey, JSON.stringify(this.wallet.usdInQqqPool));
      this.berechnePoolOutQqq();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePltrPltrPool(): void {
    if (this.checkInputNumber(this.wallet.pltrInPltrPool)) {
      localStorage.setItem(this.wallet.pltrInPltrPoolKey, JSON.stringify(this.wallet.pltrInPltrPool));
      this.berechnePoolOutPltr();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdPltrPool(): void {
    if (this.checkInputNumber(this.wallet.usdInPltrPool)) {
      localStorage.setItem(this.wallet.usdInPltrPoolKey, JSON.stringify(this.wallet.usdInPltrPool));
      this.berechnePoolOutPltr();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSlvSlvPool(): void {
    if (this.checkInputNumber(this.wallet.slvInSlvPool)) {
      localStorage.setItem(this.wallet.slvInSlvPoolKey, JSON.stringify(this.wallet.slvInSlvPool));
      this.berechnePoolOutSlv();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdSlvPool(): void {
    if (this.checkInputNumber(this.wallet.usdInSlvPool)) {
      localStorage.setItem(this.wallet.usdInSlvPoolKey, JSON.stringify(this.wallet.usdInSlvPool));
      this.berechnePoolOutSlv();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeAaplAaplPool(): void {
    if (this.checkInputNumber(this.wallet.aaplInAaplPool)) {
      localStorage.setItem(this.wallet.aaplInAaplPoolKey, JSON.stringify(this.wallet.aaplInAaplPool));
      this.berechnePoolOutAapl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
    }
  }
  onChangeUsdAaplPool(): void {
    if (this.checkInputNumber(this.wallet.usdInAaplPool)) {
      localStorage.setItem(this.wallet.usdInAaplPoolKey, JSON.stringify(this.wallet.usdInAaplPool));
      this.berechnePoolOutAapl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGldGldPool(): void {
    if (this.checkInputNumber(this.wallet.gldInGldPool)) {
      localStorage.setItem(this.wallet.gldInGldPoolKey, JSON.stringify(this.wallet.gldInGldPool));
      this.berechnePoolOutGld();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdGldPool(): void {
    if (this.checkInputNumber(this.wallet.usdInGldPool)) {
      localStorage.setItem(this.wallet.usdInGldPoolKey, JSON.stringify(this.wallet.usdInGldPool));
      this.berechnePoolOutGld();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGmeGmePool(): void {
    if (this.checkInputNumber(this.wallet.gmeInGmePool)) {
      localStorage.setItem(this.wallet.gmeInGmePoolKey, JSON.stringify(this.wallet.gmeInGmePool));
      this.berechnePoolOutGme();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdGmePool(): void {
    if (this.checkInputNumber(this.wallet.usdInGmePool)) {
      localStorage.setItem(this.wallet.usdInGmePoolKey, JSON.stringify(this.wallet.usdInGmePool));
      this.berechnePoolOutGme();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGooglGooglPool(): void {
    if (this.checkInputNumber(this.wallet.googlInGooglPool)) {
      localStorage.setItem(this.wallet.googlInGooglPoolKey, JSON.stringify(this.wallet.googlInGooglPool));
      this.berechnePoolOutGoogl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdGooglPool(): void {
    if (this.checkInputNumber(this.wallet.usdInGooglPool)) {
      localStorage.setItem(this.wallet.usdInGooglPoolKey, JSON.stringify(this.wallet.usdInGooglPool));
      this.berechnePoolOutGoogl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeArkkArkkPool(): void {
    if (this.checkInputNumber(this.wallet.arkkInArkkPool)) {
      localStorage.setItem(this.wallet.arkkInArkkPoolKey, JSON.stringify(this.wallet.arkkInArkkPool));
      this.berechnePoolOutArkk();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdArkkPool(): void {
    if (this.checkInputNumber(this.wallet.usdInArkkPool)) {
      localStorage.setItem(this.wallet.usdInArkkPoolKey, JSON.stringify(this.wallet.usdInArkkPool));
      this.berechnePoolOutArkk();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBabaBabaPool(): void {
    if (this.checkInputNumber(this.wallet.babaInBabaPool)) {
      localStorage.setItem(this.wallet.babaInBabaPoolKey, JSON.stringify(this.wallet.babaInBabaPool));
      this.berechnePoolOutBaba();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdBabaPool(): void {
    if (this.checkInputNumber(this.wallet.usdInBabaPool)) {
      localStorage.setItem(this.wallet.usdInBabaPoolKey, JSON.stringify(this.wallet.usdInBabaPool));
      this.berechnePoolOutBaba();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeVnqVnqPool(): void {
    if (this.checkInputNumber(this.wallet.vnqInVnqPool)) {
      localStorage.setItem(this.wallet.vnqInVnqPoolKey, JSON.stringify(this.wallet.vnqInVnqPool));
      this.berechnePoolOutVnq();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdVnqPool(): void {
    if (this.checkInputNumber(this.wallet.usdInVnqPool)) {
      localStorage.setItem(this.wallet.usdInVnqPoolKey, JSON.stringify(this.wallet.usdInVnqPool));
      this.berechnePoolOutVnq();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUrthUrthPool(): void {
    if (this.checkInputNumber(this.wallet.urthInUrthPool)) {
      localStorage.setItem(this.wallet.urthInUrthPoolKey, JSON.stringify(this.wallet.urthInUrthPool));
      this.berechnePoolOutUrth();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdUrthPool(): void {
    if (this.checkInputNumber(this.wallet.usdInUrthPool)) {
      localStorage.setItem(this.wallet.usdInUrthPoolKey, JSON.stringify(this.wallet.usdInUrthPool));
      this.berechnePoolOutUrth();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeTltTltPool(): void {
    if (this.checkInputNumber(this.wallet.tltInTltPool)) {
      localStorage.setItem(this.wallet.tltInTltPoolKey, JSON.stringify(this.wallet.tltInTltPool));
      this.berechnePoolOutTlt();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdTltPool(): void {
    if (this.checkInputNumber(this.wallet.usdInTltPool)) {
      localStorage.setItem(this.wallet.usdInTltPoolKey, JSON.stringify(this.wallet.usdInTltPool));
      this.berechnePoolOutTlt();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePdbcPdbcPool(): void {
    if (this.checkInputNumber(this.wallet.pdbcInPdbcPool)) {
      localStorage.setItem(this.wallet.pdbcInPdbcPoolKey, JSON.stringify(this.wallet.pdbcInPdbcPool));
      this.berechnePoolOutPdbc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdPdbcPool(): void {
    if (this.checkInputNumber(this.wallet.usdInPdbcPool)) {
      localStorage.setItem(this.wallet.usdInPdbcPoolKey, JSON.stringify(this.wallet.usdInPdbcPool));
      this.berechnePoolOutPdbc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeAmznAmznPool(): void {
    if (this.checkInputNumber(this.wallet.amznInAmznPool)) {
      localStorage.setItem(this.wallet.amznInAmznPoolKey, JSON.stringify(this.wallet.amznInAmznPool));
      this.berechnePoolOutAmzn();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdAmznPool(): void {
    if (this.checkInputNumber(this.wallet.usdInAmznPool)) {
      localStorage.setItem(this.wallet.usdInAmznPoolKey, JSON.stringify(this.wallet.usdInAmznPool));
      this.berechnePoolOutAmzn();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeNvdaNvdaPool(): void {
    if (this.checkInputNumber(this.wallet.nvdaInNvdaPool)) {
      localStorage.setItem(this.wallet.nvdaInNvdaPoolKey, JSON.stringify(this.wallet.nvdaInNvdaPool));
      this.berechnePoolOutNvda();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdNvdaPool(): void {
    if (this.checkInputNumber(this.wallet.usdInNvdaPool)) {
      localStorage.setItem(this.wallet.usdInNvdaPoolKey, JSON.stringify(this.wallet.usdInNvdaPool));
      this.berechnePoolOutNvda();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeCoinCoinPool(): void {
    if (this.checkInputNumber(this.wallet.coinInCoinPool)) {
      localStorage.setItem(this.wallet.coinInCoinPoolKey, JSON.stringify(this.wallet.coinInCoinPool));
      this.berechnePoolOutCoin();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdCoinPool(): void {
    if (this.checkInputNumber(this.wallet.usdInCoinPool)) {
      localStorage.setItem(this.wallet.usdInCoinPoolKey, JSON.stringify(this.wallet.usdInCoinPool));
      this.berechnePoolOutCoin();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeEemEemPool(): void {
    if (this.checkInputNumber(this.wallet.eemInEemPool)) {
      localStorage.setItem(this.wallet.eemInEemPoolKey, JSON.stringify(this.wallet.eemInEemPool));
      this.berechnePoolOutEem();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdEemPool(): void {
    if (this.checkInputNumber(this.wallet.usdInEemPool)) {
      localStorage.setItem(this.wallet.usdInEemPoolKey, JSON.stringify(this.wallet.usdInEemPool));
      this.berechnePoolOutEem();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMsftMsftPool(): void {
    if (this.checkInputNumber(this.wallet.msftInMsftPool)) {
      localStorage.setItem(this.wallet.msftInMsftPoolKey, JSON.stringify(this.wallet.msftInMsftPool));
      this.berechnePoolOutMsft();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdMsftPool(): void {
    if (this.checkInputNumber(this.wallet.usdInMsftPool)) {
      localStorage.setItem(this.wallet.usdInMsftPoolKey, JSON.stringify(this.wallet.usdInMsftPool));
      this.berechnePoolOutMsft();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeFbFbPool(): void {
    if (this.checkInputNumber(this.wallet.fbInFbPool)) {
      localStorage.setItem(this.wallet.fbInFbPoolKey, JSON.stringify(this.wallet.fbInFbPool));
      this.berechnePoolOutFb();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdFbPool(): void {
    if (this.checkInputNumber(this.wallet.usdInFbPool)) {
      localStorage.setItem(this.wallet.usdInFbPoolKey, JSON.stringify(this.wallet.usdInFbPool));
      this.berechnePoolOutFb();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeNflxNflxPool(): void {
    if (this.checkInputNumber(this.wallet.nflxInNflxPool)) {
      localStorage.setItem(this.wallet.nflxInNflxPoolKey, JSON.stringify(this.wallet.nflxInNflxPool));
      this.berechnePoolOutNflx();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdNflxPool(): void {
    if (this.checkInputNumber(this.wallet.usdInNflxPool)) {
      localStorage.setItem(this.wallet.usdInNflxPoolKey, JSON.stringify(this.wallet.usdInNflxPool));
      this.berechnePoolOutNflx();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeVooVooPool(): void {
    if (this.checkInputNumber(this.wallet.vooInVooPool)) {
      localStorage.setItem(this.wallet.vooInVooPoolKey, JSON.stringify(this.wallet.vooInVooPool));
      this.berechnePoolOutVoo();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdVooPool(): void {
    if (this.checkInputNumber(this.wallet.usdInVooPool)) {
      localStorage.setItem(this.wallet.usdInVooPoolKey, JSON.stringify(this.wallet.usdInVooPool));
      this.berechnePoolOutVoo();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeDisDisPool(): void {
    if (this.checkInputNumber(this.wallet.disInDisPool)) {
      localStorage.setItem(this.wallet.disInDisPoolKey, JSON.stringify(this.wallet.disInDisPool));
      this.berechnePoolOutDis();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdDisPool(): void {
    if (this.checkInputNumber(this.wallet.usdInDisPool)) {
      localStorage.setItem(this.wallet.usdInDisPoolKey, JSON.stringify(this.wallet.usdInDisPool));
      this.berechnePoolOutDis();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMchiMchiPool(): void {
    if (this.checkInputNumber(this.wallet.mchiInMchiPool)) {
      localStorage.setItem(this.wallet.mchiInMchiPoolKey, JSON.stringify(this.wallet.mchiInMchiPool));
      this.berechnePoolOutMchi();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdMchiPool(): void {
    if (this.checkInputNumber(this.wallet.usdInMchiPool)) {
      localStorage.setItem(this.wallet.usdInMchiPoolKey, JSON.stringify(this.wallet.usdInMchiPool));
      this.berechnePoolOutMchi();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeMstrMstrPool(): void {
    if (this.checkInputNumber(this.wallet.mstrInMstrPool)) {
      localStorage.setItem(this.wallet.mstrInMstrPoolKey, JSON.stringify(this.wallet.mstrInMstrPool));
      this.berechnePoolOutMstr();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdMstrPool(): void {
    if (this.checkInputNumber(this.wallet.usdInMstrPool)) {
      localStorage.setItem(this.wallet.usdInMstrPoolKey, JSON.stringify(this.wallet.usdInMstrPool));
      this.berechnePoolOutMstr();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeIntcIntcPool(): void {
    if (this.checkInputNumber(this.wallet.intcInIntcPool)) {
      localStorage.setItem(this.wallet.intcInIntcPoolKey, JSON.stringify(this.wallet.intcInIntcPool));
      this.berechnePoolOutIntc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdIntcPool(): void {
    if (this.checkInputNumber(this.wallet.usdInIntcPool)) {
      localStorage.setItem(this.wallet.usdInIntcPoolKey, JSON.stringify(this.wallet.usdInIntcPool));
      this.berechnePoolOutIntc();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePyplPyplPool(): void {
    if (this.checkInputNumber(this.wallet.pyplInPyplPool)) {
      localStorage.setItem(this.wallet.pyplInPyplPoolKey, JSON.stringify(this.wallet.pyplInPyplPool));
      this.berechnePoolOutPypl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdPyplPool(): void {
    if (this.checkInputNumber(this.wallet.usdInPyplPool)) {
      localStorage.setItem(this.wallet.usdInPyplPoolKey, JSON.stringify(this.wallet.usdInPyplPool));
      this.berechnePoolOutPypl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeBrkbBrkbPool(): void {
    if (this.checkInputNumber(this.wallet.brkbInBrkbPool)) {
      localStorage.setItem(this.wallet.brkbInBrkbPoolKey, JSON.stringify(this.wallet.brkbInBrkbPool));
      this.berechnePoolOutBrkb();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdBrkbPool(): void {
    if (this.checkInputNumber(this.wallet.usdInBrkbPool)) {
      localStorage.setItem(this.wallet.usdInBrkbPoolKey, JSON.stringify(this.wallet.usdInBrkbPool));
      this.berechnePoolOutBrkb();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeKoKoPool(): void {
    if (this.checkInputNumber(this.wallet.koInKoPool)) {
      localStorage.setItem(this.wallet.koInKoPoolKey, JSON.stringify(this.wallet.koInKoPool));
      this.berechnePoolOutKo();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdKoPool(): void {
    if (this.checkInputNumber(this.wallet.usdInKoPool)) {
      localStorage.setItem(this.wallet.usdInKoPoolKey, JSON.stringify(this.wallet.usdInKoPool));
      this.berechnePoolOutKo();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangePgPgPool(): void {
    if (this.checkInputNumber(this.wallet.pgInPgPool)) {
      localStorage.setItem(this.wallet.pgInPgPoolKey, JSON.stringify(this.wallet.pgInPgPool));
      this.berechnePoolOutPg();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdPgPool(): void {
    if (this.checkInputNumber(this.wallet.usdInPgPool)) {
      localStorage.setItem(this.wallet.usdInPgPoolKey, JSON.stringify(this.wallet.usdInPgPool));
      this.berechnePoolOutPg();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeSapSapPool(): void {
    if (this.checkInputNumber(this.wallet.sapInSapPool)) {
      localStorage.setItem(this.wallet.sapInSapPoolKey, JSON.stringify(this.wallet.sapInSapPool));
      this.berechnePoolOutSap();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdSapPool(): void {
    if (this.checkInputNumber(this.wallet.usdInSapPool)) {
      localStorage.setItem(this.wallet.usdInSapPoolKey, JSON.stringify(this.wallet.usdInSapPool));
      this.berechnePoolOutSap();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUraUraPool(): void {
    if (this.checkInputNumber(this.wallet.uraInUraPool)) {
      localStorage.setItem(this.wallet.uraInUraPoolKey, JSON.stringify(this.wallet.uraInUraPool));
      this.berechnePoolOutUra();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdUraPool(): void {
    if (this.checkInputNumber(this.wallet.usdInUraPool)) {
      localStorage.setItem(this.wallet.usdInUraPoolKey, JSON.stringify(this.wallet.usdInUraPool));
      this.berechnePoolOutUra();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeGsgGsgPool(): void {
    if (this.checkInputNumber(this.wallet.gsgInGsgPool)) {
      localStorage.setItem(this.wallet.gsgInGsgPoolKey, JSON.stringify(this.wallet.gsgInGsgPool));
      this.berechnePoolOutGsg();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdGsgPool(): void {
    if (this.checkInputNumber(this.wallet.usdInGsgPool)) {
      localStorage.setItem(this.wallet.usdInGsgPoolKey, JSON.stringify(this.wallet.usdInGsgPool));
      this.berechnePoolOutGsg();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeCsCsPool(): void {
    if (this.checkInputNumber(this.wallet.csInCsPool)) {
      localStorage.setItem(this.wallet.csInCsPoolKey, JSON.stringify(this.wallet.csInCsPool));
      this.berechnePoolOutCs();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdCsPool(): void {
    if (this.checkInputNumber(this.wallet.usdInCsPool)) {
      localStorage.setItem(this.wallet.usdInCsPoolKey, JSON.stringify(this.wallet.usdInCsPool));
      this.berechnePoolOutCs();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartIncome();
    }
  }

  checkInputNumber(value: number): boolean {
    return value !== null && value >= 0;
  }


  copyValues(wallet: WalletDto): Wallet {
    const walletFinal = new Wallet();
    walletFinal.dfiInStaking = wallet.dfiInStaking;
    walletFinal.dfiInDfxStaking = wallet.dfiInDfxStaking;
    walletFinal.dfi = wallet.dfi;

    walletFinal.btcdfi = wallet.btcdfi;
    walletFinal.ethdfi = wallet.ethdfi;
    walletFinal.ltcdfi = wallet.ltcdfi;
    walletFinal.dogedfi = wallet.dogedfi;
    walletFinal.usdtdfi = wallet.usdtdfi;
    walletFinal.usdcdfi = wallet.usdcdfi;
    walletFinal.bchdfi = wallet.bchdfi;
    walletFinal.usddfi = wallet.usdcdfi;
    walletFinal.tslausd = wallet.tslausd;
    walletFinal.qqqusd = wallet.qqqusd;
    walletFinal.spyusd = wallet.spyusd;
    walletFinal.pltrusd = wallet.pltrusd;
    walletFinal.slvusd = wallet.slvusd;
    walletFinal.aaplusd = wallet.aaplusd;
    walletFinal.gldusd = wallet.gldusd;
    walletFinal.gmeusd = wallet.gmeusd;
    walletFinal.googlusd = wallet.googlusd;
    walletFinal.arkkusd = wallet.arkkusd;
    walletFinal.babausd = wallet.babausd;
    walletFinal.vnqusd = wallet.vnqusd;
    walletFinal.urthusd = wallet.urthusd;
    walletFinal.tltusd = wallet.tltusd;
    walletFinal.pdbcusd = wallet.pdbcusd;

    walletFinal.amznusd = wallet.amznusd;
    walletFinal.nvdausd = wallet.nvdausd;
    walletFinal.coinusd = wallet.coinusd;
    walletFinal.eemusd = wallet.eemusd;

    walletFinal.msftusd = wallet.msftusd;
    walletFinal.fbusd = wallet.fbusd;
    walletFinal.voousd = wallet.voousd;
    walletFinal.nflxusd = wallet.nflxusd;

    walletFinal.disusd = wallet.disusd;
    walletFinal.mchiusd = wallet.mchiusd;
    walletFinal.mstrusd = wallet.mstrusd;
    walletFinal.intcusd = wallet.intcusd;

    walletFinal.pyplusd = wallet.pyplusd;
    walletFinal.brkbusd = wallet.brkbusd;
    walletFinal.kousd = wallet.kousd;
    walletFinal.pgusd = wallet.pgusd;

    walletFinal.sapusd = wallet.sapusd;
    walletFinal.urausd = wallet.urausd;
    walletFinal.gsgusd = wallet.gsgusd;
    walletFinal.csusd = wallet.csusd;

    walletFinal.tanusd = wallet.tanusd;
    walletFinal.xomusd = wallet.xomusd;
    walletFinal.govtusd = wallet.govtusd;
    walletFinal.ppltusd = wallet.ppltusd;

    walletFinal.btcInBtcPool = wallet.btcInBtcPool;
    walletFinal.dfiInBtcPool = wallet.dfiInBtcPool;
    walletFinal.ethInEthPool = wallet.ethInEthPool;
    walletFinal.dfiInEthPool = wallet.dfiInEthPool;
    walletFinal.usdtInUsdtPool = wallet.usdtInUsdtPool;
    walletFinal.dfiInUsdtPool = wallet.dfiInUsdtPool;
    walletFinal.usdcInUsdcPool = wallet.usdcInUsdcPool;
    walletFinal.dfiInUsdcPool = wallet.dfiInUsdcPool;
    walletFinal.ltcInLtcPool = wallet.ltcInLtcPool;
    walletFinal.dfiInLtcPool = wallet.dfiInLtcPool;
    walletFinal.dogeInDogePool = wallet.dogeInDogePool;
    walletFinal.dfiInDogePool = wallet.dfiInDogePool;
    walletFinal.bchInBchPool = wallet.bchInBchPool;
    walletFinal.dfiInBchPool = wallet.dfiInBchPool;
    walletFinal.tslaInTslaPool = wallet.tslaInTslaPool;
    walletFinal.usdInTslaPool = wallet.usdInTslaPool;
    walletFinal.usdInUsdPool = wallet.usdInUsdPool;
    walletFinal.dfiInUsdPool = wallet.dfiInUsdPool;
    walletFinal.spyInSpyPool = wallet.spyInSpyPool;
    walletFinal.usdInSpyPool = wallet.usdInSpyPool;
    walletFinal.qqqInQqqPool = wallet.qqqInQqqPool;
    walletFinal.usdInQqqPool = wallet.usdInQqqPool;
    walletFinal.pltrInPltrPool = wallet.pltrInPltrPool;
    walletFinal.usdInPltrPool = wallet.usdInPltrPool;
    walletFinal.slvInSlvPool = wallet.slvInSlvPool;
    walletFinal.usdInSlvPool = wallet.usdInSlvPool;
    walletFinal.aaplInAaplPool = wallet.aaplInAaplPool;
    walletFinal.usdInAaplPool = wallet.usdInAaplPool;
    walletFinal.gldInGldPool = wallet.gldInGldPool;
    walletFinal.usdInGldPool = wallet.usdInGldPool;
    walletFinal.gmeInGmePool = wallet.gmeInGmePool;
    walletFinal.usdInGmePool = wallet.usdInGmePool;
    walletFinal.googlInGooglPool = wallet.googlInGooglPool;
    walletFinal.usdInGooglPool = wallet.usdInGooglPool;
    walletFinal.arkkInArkkPool = wallet.arkkInArkkPool;
    walletFinal.usdInArkkPool = wallet.usdInArkkPool;
    walletFinal.babaInBabaPool = wallet.babaInBabaPool;
    walletFinal.usdInBabaPool = wallet.usdInBabaPool;
    walletFinal.vnqInVnqPool = wallet.vnqInVnqPool;
    walletFinal.usdInVnqPool = wallet.usdInVnqPool;
    walletFinal.urthInUrthPool = wallet.urthInUrthPool;
    walletFinal.usdInUrthPool = wallet.usdInUrthPool;
    walletFinal.tltInTltPool = wallet.tltInTltPool;
    walletFinal.usdInTltPool = wallet.usdInTltPool;
    walletFinal.pdbcInPdbcPool = wallet.pdbcInPdbcPool;
    walletFinal.usdInPdbcPool = wallet.usdInPdbcPool;

    walletFinal.amznInAmznPool = wallet.amznInAmznPool;
    walletFinal.usdInAmznPool = wallet.usdInAmznPool;
    walletFinal.nvdaInNvdaPool = wallet.nvdaInNvdaPool;
    walletFinal.usdInNvdaPool = wallet.usdInNvdaPool;
    walletFinal.coinInCoinPool = wallet.coinInCoinPool;
    walletFinal.usdInCoinPool = wallet.usdInCoinPool;
    walletFinal.eemInEemPool = wallet.eemInEemPool;
    walletFinal.usdInEemPool = wallet.usdInEemPool;

    walletFinal.msftInMsftPool = wallet.msftInMsftPool;
    walletFinal.usdInMsftPool = wallet.usdInMsftPool;
    walletFinal.nflxInNflxPool = wallet.nflxInNflxPool;
    walletFinal.usdInNflxPool = wallet.usdInNflxPool;
    walletFinal.fbInFbPool = wallet.fbInFbPool;
    walletFinal.usdInFbPool = wallet.usdInFbPool;
    walletFinal.vooInVooPool = wallet.vooInVooPool;
    walletFinal.usdInVooPool = wallet.usdInVooPool;

    walletFinal.disInDisPool = wallet.disInDisPool;
    walletFinal.usdInDisPool = wallet.usdInDisPool;
    walletFinal.mchiInMchiPool = wallet.mchiInMchiPool;
    walletFinal.usdInMchiPool = wallet.usdInMchiPool;
    walletFinal.mstrInMstrPool = wallet.mstrInMstrPool;
    walletFinal.usdInMstrPool = wallet.usdInMstrPool;
    walletFinal.intcInIntcPool = wallet.intcInIntcPool;
    walletFinal.usdInIntcPool = wallet.usdInIntcPool;

    walletFinal.pyplInPyplPool = wallet.pyplInPyplPool;
    walletFinal.usdInPyplPool = wallet.usdInPyplPool;
    walletFinal.brkbInBrkbPool = wallet.brkbInBrkbPool;
    walletFinal.usdInBrkbPool = wallet.usdInBrkbPool;
    walletFinal.koInKoPool = wallet.koInKoPool;
    walletFinal.usdInKoPool = wallet.usdInKoPool;
    walletFinal.pgInPgPool = wallet.pgInPgPool;
    walletFinal.usdInPgPool = wallet.usdInPgPool;

    walletFinal.sapInSapPool = wallet.sapInSapPool;
    walletFinal.usdInSapPool = wallet.usdInSapPool;
    walletFinal.gsgInGsgPool = wallet.gsgInGsgPool;
    walletFinal.usdInGsgPool = wallet.usdInGsgPool;
    walletFinal.csInCsPool = wallet.csInCsPool;
    walletFinal.usdInCsPool = wallet.usdInCsPool;
    walletFinal.uraInUraPool = wallet.uraInUraPool;
    walletFinal.usdInUraPool = wallet.usdInUraPool;

    walletFinal.btc = wallet.btc;
    walletFinal.eth = wallet.eth;
    walletFinal.ltc = wallet.ltc;
    walletFinal.doge = wallet.doge;
    walletFinal.usdt = wallet.usdt;
    walletFinal.usdc = wallet.usdc;
    walletFinal.bch = wallet.bch;
    walletFinal.usd = wallet.usd;
    walletFinal.tsla = wallet.tsla;
    walletFinal.qqq = wallet.qqq;
    walletFinal.spy = wallet.spy;
    walletFinal.pltr = wallet.pltr;
    walletFinal.slv = wallet.slv;
    walletFinal.aapl = wallet.aapl;
    walletFinal.gld = wallet.gld;
    walletFinal.gme = wallet.gme;
    walletFinal.googl = wallet.googl;
    walletFinal.arkk = wallet.arkk;
    walletFinal.baba = wallet.baba;
    walletFinal.vnq = wallet.vnq;
    walletFinal.urth = wallet.urth;
    walletFinal.tlt = wallet.tlt;
    walletFinal.pdbc = wallet.pdbc;

    walletFinal.amzn = wallet.amzn;
    walletFinal.nvda = wallet.nvda;
    walletFinal.coin = wallet.coin;
    walletFinal.eem = wallet.eem;

    walletFinal.msft = wallet.msft;
    walletFinal.voo = wallet.voo;
    walletFinal.fb = wallet.fb;
    walletFinal.nflx = wallet.nflx;

    walletFinal.dis = wallet.dis;
    walletFinal.mchi = wallet.mchi;
    walletFinal.mstr = wallet.mstr;
    walletFinal.intc = wallet.intc;

    walletFinal.pypl = wallet.pypl;
    walletFinal.brkb = wallet.brkb;
    walletFinal.ko = wallet.ko;
    walletFinal.pg = wallet.pg;

    walletFinal.sap = wallet.sap;
    walletFinal.gsg = wallet.gsg;
    walletFinal.cs = wallet.cs;
    walletFinal.ura = wallet.ura;

    return walletFinal;
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }

  openInfoMenu(): void {
    this.isInfoOpen = !this.isInfoOpen;
  }

  toggleDarkMode(): void {
    if (this.isDarkModeOn) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', this.isDarkModeOn ? 'dark' : 'light');
    this.buildChartValue();
    this.buildChartIncome();
  }

  toggleTotalValueChart(): void {

    localStorage.setItem(this.isValueChartOnKey, String(this.isValueChartOn));
  }

  toggleTotalincomeChart(): void {

    localStorage.setItem(this.isIncomeChartOnKey, String(this.isIncomeChartOn));
  }

  toggleAutoCake(): void {

    localStorage.setItem(this.cakeApyLoadAutoKey, String(this.cakeApyLoadAuto));
  }

  onChangeCorrelationForCalc(value: number): void {
    this.correlationDays = +value;
    localStorage.setItem(this.correlationDaysKey, String(value));
  }

  toggleFreezerInValue(): void {
    localStorage.setItem('freezerInValue', String(this.freezerInTotolValue));
  }

  getAPRAverage(): number {

    if (!this.wallet || !this.poolOut || !this.stakingOut || !this.poolMasternodeOut) {
      return 0;
    }

    // calculate how much income all
    const allIncome = this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear + this.poolMasternodeOut.dfiPerYear;

    // calculate how much income from all pools, staking and masternode
    const countFreezer5 = this.adressesMasternodesFreezer5.length;
    const countFreezer10 = this.adressesMasternodesFreezer10.length;
    const countNormal = this.adressesMasternodes.length - countFreezer5 - countFreezer10;

    const rewardNormaleMnPart = countNormal * 20000 * this.stakingApyMN / allIncome;
    const reward5MnPart = countFreezer5 * 20000 * this.stakingApyMN * 1.5 / allIncome;
    const reward10MnPart = countFreezer10 * 20000 * this.stakingApyMN * 2 / allIncome;

    const dfiBtcPart = this.poolBtcOut?.dfiPerYear / allIncome * 100;
    const dfiEthPart = this.poolEthOut?.dfiPerYear / allIncome * 100;
    const dfiUsdcPart = this.poolUsdcOut?.dfiPerYear / allIncome * 100;
    const dfiUsdtPart = this.poolUsdtOut?.dfiPerYear / allIncome * 100;
    const dfiDogePart = this.poolDogeOut?.dfiPerYear / allIncome * 100;
    const dfiBchPart = this.poolBchOut?.dfiPerYear / allIncome * 100;
    const dfiLtcPart = this.poolLtcOut?.dfiPerYear / allIncome * 100;

    const dfiUsdPart = this.poolUsdOut?.dfiPerYear / allIncome * 100;
    const dfiTslaPart = this.poolTslaOut?.dfiPerYear / allIncome * 100;
    const dfiSpyPart = this.poolSpyOut?.dfiPerYear / allIncome * 100;
    const dfiQqqPart = this.poolQqqOut?.dfiPerYear / allIncome * 100;
    const dfiPltrPart = this.poolPltrOut?.dfiPerYear / allIncome * 100;
    const dfiSlvPart = this.poolSlvOut?.dfiPerYear / allIncome * 100;
    const dfiAaplPart = this.poolAaplOut?.dfiPerYear / allIncome * 100;
    const dfiGldPart = this.poolGldOut?.dfiPerYear / allIncome * 100;
    const dfiGmePart = this.poolGmeOut?.dfiPerYear / allIncome * 100;
    const dfiGooglPart = this.poolGooglOut?.dfiPerYear / allIncome * 100;
    const dfiArkkPart = this.poolArkkOut?.dfiPerYear / allIncome * 100;
    const dfiBabaPart = this.poolBabaOut?.dfiPerYear / allIncome * 100;
    const dfiVnqPart = this.poolVnqOut?.dfiPerYear / allIncome * 100;
    const dfiUrthPart = this.poolUrthOut?.dfiPerYear / allIncome * 100;
    const dfiTltPart = this.poolTltOut?.dfiPerYear / allIncome * 100;
    const dfiPdbcPart = this.poolPdbcOut?.dfiPerYear / allIncome * 100;

    const dfiAmznPart = this.poolAmznOut?.dfiPerYear / allIncome * 100;
    const dfiNvdaPart = this.poolNvdaOut?.dfiPerYear / allIncome * 100;
    const dfiCoinPart = this.poolCoinOut?.dfiPerYear / allIncome * 100;
    const dfiEemPart = this.poolEemOut?.dfiPerYear / allIncome * 100;

    const dfiMsftPart = this.poolMsftOut?.dfiPerYear / allIncome * 100;
    const dfiFbPart = this.poolFbOut?.dfiPerYear / allIncome * 100;
    const dfiNflxPart = this.poolNflxOut?.dfiPerYear / allIncome * 100;
    const dfiVooPart = this.poolVooOut?.dfiPerYear / allIncome * 100;

    const dfiDisPart = this.poolDisOut?.dfiPerYear / allIncome * 100;
    const dfiMchiPart = this.poolMchiOut?.dfiPerYear / allIncome * 100;
    const dfiMstrPart = this.poolMstrOut?.dfiPerYear / allIncome * 100;
    const dfiIntcPart = this.poolIntcOut?.dfiPerYear / allIncome * 100;

    const dfiPyplPart = this.poolPyplOut?.dfiPerYear / allIncome * 100;
    const dfiBrkbPart = this.poolBrkbOut?.dfiPerYear / allIncome * 100;
    const dfiKoPart = this.poolKoOut?.dfiPerYear / allIncome * 100;
    const dfiPgPart = this.poolPgOut?.dfiPerYear / allIncome * 100;

    const dfiSapPart = this.poolSapOut?.dfiPerYear / allIncome * 100;
    const dfiUraPart = this.poolUraOut?.dfiPerYear / allIncome * 100;
    const dfiCsPart = this.poolCsOut?.dfiPerYear / allIncome * 100;
    const dfiGsgPart = this.poolGsgOut?.dfiPerYear / allIncome * 100;

    const dfiPpltPart = this.poolPpltOut?.dfiPerYear / allIncome * 100;
    const dfiTanPart = this.poolTanOut?.dfiPerYear / allIncome * 100;
    const dfiXomPart = this.poolXomOut?.dfiPerYear / allIncome * 100;
    const dfiGovtPart = this.poolGovtOut?.dfiPerYear / allIncome * 100;

    const dfiJnjPart = this.poolJnjOut?.dfiPerYear / allIncome * 100;
    const dfiDaxPart = this.poolDaxOut?.dfiPerYear / allIncome * 100;
    const dfiGsPart = this.poolGsOut?.dfiPerYear / allIncome * 100;
    const dfiAddyyPart = this.poolAddyyOut?.dfiPerYear / allIncome * 100;

    const stakingPart = this.stakingOut?.dfiPerYear / allIncome * 100;


    // Calculate weighted apr
    const btcApr = dfiBtcPart * this.poolBtc?.apr;
    const ethApr = dfiEthPart * this.poolEth?.apr;
    const usdcApr = dfiUsdcPart * this.poolUsdc?.apr;
    const bchApr = dfiBchPart * this.poolBch?.apr;
    const dogeApr = dfiDogePart * this.poolDoge?.apr;
    const usdtApr = dfiUsdtPart * this.poolUsdt?.apr;
    const ltcApr = dfiLtcPart * this.poolLtc?.apr;

    const usdApr = dfiUsdPart * this.poolUsd?.apr;
    const tslaApr = dfiTslaPart * this.poolTsla?.apr;
    const spyApr = dfiSpyPart * this.poolSpy?.apr;
    const qqqApr = dfiQqqPart * this.poolQqq?.apr;
    const pltrApr = dfiPltrPart * this.poolPltr?.apr;
    const slvApr = dfiSlvPart * this.poolSlv?.apr;
    const aaplApr = dfiAaplPart * this.poolAapl?.apr;
    const gldApr = dfiGldPart * this.poolGld?.apr;
    const gmeApr = dfiGmePart * this.poolGme?.apr;
    const googlApr = dfiGooglPart * this.poolGoogl?.apr;
    const arkkApr = dfiArkkPart * this.poolArkk?.apr;
    const babaApr = dfiBabaPart * this.poolBaba?.apr;
    const vnqApr = dfiVnqPart * this.poolVnq?.apr;
    const urthApr = dfiUrthPart * this.poolUrth?.apr;
    const tltApr = dfiTltPart * this.poolTlt?.apr;
    const pdbcApr = dfiPdbcPart * this.poolPdbc?.apr;

    const amznApr = dfiAmznPart * this.poolAmzn?.apr;
    const nvdaApr = dfiNvdaPart * this.poolNvda?.apr;
    const coinApr = dfiCoinPart * this.poolCoin?.apr;
    const eemApr = dfiEemPart * this.poolEem?.apr;

    const msftApr = dfiMsftPart * this.poolMsft?.apr;
    const vooApr = dfiVooPart * this.poolVoo?.apr;
    const fbApr = dfiFbPart * this.poolFb?.apr;
    const nflxApr = dfiNflxPart * this.poolNflx?.apr;

    const disApr = dfiDisPart * this.poolDis?.apr;
    const mchiApr = dfiMchiPart * this.poolMchi?.apr;
    const mstrApr = dfiMstrPart * this.poolMstr?.apr;
    const intcApr = dfiIntcPart * this.poolIntc?.apr;

    const pyplApr = dfiPyplPart * this.poolPypl?.apr;
    const brkbApr = dfiBrkbPart * this.poolBrkb?.apr;
    const koApr = dfiKoPart * this.poolKo?.apr;
    const pgApr = dfiPgPart * this.poolPg?.apr;

    const sapApr = dfiSapPart * this.poolSap?.apr;
    const uraApr = dfiUraPart * this.poolUra?.apr;
    const csApr = dfiCsPart * this.poolCs?.apr;
    const gsgApr = dfiGsgPart * this.poolGsg?.apr;

    const ppltApr = dfiPpltPart * this.poolPplt?.apr;
    const xomApr = dfiXomPart * this.poolXom?.apr;
    const govtApr = dfiGovtPart * this.poolGovt?.apr;
    const tanApr = dfiTanPart * this.poolTan?.apr;

    const jnjApr = dfiJnjPart * this.poolJnj?.apr;
    const daxApr = dfiDaxPart * this.poolDax?.apr;
    const addyyApr = dfiAddyyPart * this.poolAddyy?.apr;
    const gsApr = dfiGsPart * this.poolGs?.apr;

    const stakingApr = stakingPart * this.stakingApyMN * 0.85;
    const normalMnApr = rewardNormaleMnPart * this.stakingApyMN;
    const fiveFreezerMnApr = reward5MnPart * this.stakingApyMN * 1.5;
    const tenFreezerMnApr = reward10MnPart * this.stakingApyMN * 2;

    // compute average
    const average = (btcApr + ethApr + usdcApr + bchApr + dogeApr + usdtApr
      + ltcApr + usdApr + tslaApr + spyApr + qqqApr + pltrApr + slvApr
      + aaplApr + gldApr + gmeApr + googlApr + arkkApr + babaApr + vnqApr
      + urthApr + tltApr + pdbcApr + amznApr + nvdaApr + coinApr + eemApr
      + msftApr + vooApr + fbApr + nflxApr
      + disApr + mchiApr + mstrApr + intcApr
      + pyplApr + brkbApr + koApr + pgApr
      + sapApr + gsgApr + csApr + uraApr
      + ppltApr + xomApr + tanApr + govtApr
      + jnjApr + daxApr + addyyApr + gsApr
      + stakingApr + normalMnApr + fiveFreezerMnApr + tenFreezerMnApr) / 100;

    if (!average) {
      return 0;
    }

    return Math.round(average * 100) / 100;
  }

  getDfiForAverageAPR(): number {
    return this.getDfiCountInLM() * 2 + this.dfiInStaking + this.dfiInDfxStaking + this.getDfiCountMn();
  }

  getDfiCountMn(): number {
    const normalMns = this.adressesMasternodes?.length -
      (this.adressesMasternodesFreezer5?.length + this.adressesMasternodesFreezer10?.length);
    const mns = normalMns + this.adressesMasternodesFreezer5?.length + this.adressesMasternodesFreezer10?.length;
    return mns * 20000;
  }

  copyToClipBoard(text: string): void {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);

    this.toastr.success(this.translate.instant('copy'), '', {
      closeButton: true,
    });
  }
}
