import { Component, OnInit, ViewChild } from '@angular/core'
import { Dex } from '@services/dex.service'
import { Location } from '@angular/common'
import {
  AddressBalance,
  MasternodeOutcome,
  Outcome,
  OutcomeStaking,
  Pool,
  PoolAllOut, Prices,
  Rewards,
  Stats,
} from '@interfaces/Dex'
import { CountdownComponent } from 'ngx-countdown'
import {
  ChartOptions6,
  Income,
  Newsletter,
  PoolIncomeValue,
  PoolPairOcean,
  PoolPairsOcean,
  StockOracles,
  UserHistory,
  Vault,
  Wallet,
  WalletDto,
} from '@interfaces/Data'
import { environment } from '@environments/environment'
import { filter, firstValueFrom } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { MatomoInjector, MatomoTracker } from 'ngx-matomo-v9'
import { Apollo } from 'apollo-angular'
import { DFX_STAKING, HISTORY_USER, LOGIN, REGISTER, UPDATE } from '@interfaces/Graphql'
import { DataService } from '@services/data.service'
import { StakingService } from '@services/staking.service'
import { Meta } from '@angular/platform-browser'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MamonAccountNode } from '@interfaces/Mamon'
import { DfxStaking, LockStats, OceanStats } from '@interfaces/Staking'
import { NavigationEnd, Router } from '@angular/router'
import { ChartComponent } from 'ng-apexcharts'
import { IncomeComponent } from '@pages/income/income.component'
import { ValueComponent } from '@pages/value/value.component'
import { WhaleApiClient } from '@defichain/whale-api-client'

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

  client = new WhaleApiClient({
    url: 'https://ocean.defichain-income.com',
    timeout: 60000,
    version: 'v0',
    network: 'mainnet'
  })

  title = 'defichain-income';
  lang = 'en';
  env = environment;
  currentPage = 'info';
  currentPageKey = 'currentPageKey';

  wallet: Wallet;
  walletDTO: WalletDto;
  newsletter: Newsletter;

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
  dfiInLockStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';

  dfiPorBlockStock = 50;
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
  stakingLockStats: LockStats;
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

  vaultsOfAllAddresses = new Array<Vault>();

  oraclePrices: StockOracles = null;
  prices: Prices = null;

  correlationDays = 365;
  correlationDaysKey = 'correlationDaysKey';

  cryptoPools: Array<Pool>;
  stocksPools: Array<Pool>;
  poolPairsOcean: PoolPairsOcean;

  lmOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();
  poolAllOut: PoolAllOut = new PoolAllOut();
  poolMasternodeOut: MasternodeOutcome = new MasternodeOutcome();

  poolIncomeList = new Array<PoolIncomeValue>();

  poolUsd: Pool;
  poolEth: Pool;
  poolBtc: Pool;

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
  income: Income = null;

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
    pool.rewardLoanPct = +poolFromOcean.rewardLoanPct;
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
    pool.priceA = +poolFromOcean.totalLiquidity.usd / +poolFromOcean.tokenA.reserve / 2
    pool.priceB = +poolFromOcean.totalLiquidity.usd / +poolFromOcean.tokenB.reserve / 2
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
    }, 30000);

    this.updateDescription('meta-data.description');

    this.clearWallet();

    this.loadFromLocalStorage();

    await this.computeMeta();

    this.loadStackingCake();
    this.loadStackingDfx();
    this.loadStackingMasternode();
    this.loadHistoryUser();
    this.loadOraclePrices();

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
      this.loadAllAccounts();
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

    this.clearWallet()
    this.loadAllAccounts()
    this.loadHistoryUser()

    this.sCountdownShow = this.sCountdown
    this.countdown?.restart()

    this.timestamp = new Date().toLocaleTimeString()
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
        totalValueIncomeDfi: this.lmOut.dfiPerMonth,
        totalValueIncomeUsd: this.lmOut.dfiPerMonth * this.poolBtc?.priceB,
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

        jnj  : this.wallet.jnj,
        addyy  : this.wallet.addyy,
        gs : this.wallet.gs,
        dax  : this.wallet.dax,

        wmt  : this.wallet.wmt,
        ul  : this.wallet.ul,
        ung : this.wallet.ung,
        uso  : this.wallet.uso,

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

        jnjusd  : this.wallet.jnjusd,
        addyyusd  : this.wallet.addyyusd,
        gsusd  : this.wallet.gsusd,
        daxusd  : this.wallet.daxusd,

        wmtusd  : this.wallet.wmtusd,
        ulusd  : this.wallet.ulusd,
        ungusd  : this.wallet.ungusd,
        usousd  : this.wallet.usousd,

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
        usdInXomPool : this.wallet.usdInXomPool,

        jnjInJnjPool : this.wallet.jnjInJnjPool,
        usdInJnjPool : this.wallet.usdInJnjPool,
        gsInGsPool : this.wallet.gsInGsPool,
        usdInGsPool : this.wallet.usdInGsPool,
        daxInDaxPool : this.wallet.daxInDaxPool,
        usdInDaxPool : this.wallet.usdInDaxPool,
        addyyInAddyyPool : this.wallet.addyyInAddyyPool,
        usdInAddyyPool : this.wallet.usdInAddyyPool,

        wmtInWmtPool : this.wallet.wmtInWmtPool,
        usdInWmtPool : this.wallet.usdInWmtPool,
        ulInUlPool : this.wallet.ulInUlPool,
        usdInUlPool : this.wallet.usdInUlPool,
        ungInUngPool : this.wallet.ungInUngPool,
        usdInUngPool : this.wallet.usdInUngPool,
        usoInUsoPool : this.wallet.usoInUsoPool,
        usdInUsoPool : this.wallet.usdInUsoPool

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

        jnj  : this.wallet.jnj,
        addyy  : this.wallet.addyy,
        gs : this.wallet.gs,
        dax  : this.wallet.dax,

        wmt  : this.wallet.wmt,
        ul  : this.wallet.ul,
        ung : this.wallet.ung,
        uso  : this.wallet.uso,

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

        jnjusd  : this.wallet.jnjusd,
        addyyusd  : this.wallet.addyyusd,
        gsusd  : this.wallet.gsusd,
        daxusd  : this.wallet.daxusd,

        wmtusd  : this.wallet.wmtusd,
        ulusd  : this.wallet.ulusd,
        ungusd  : this.wallet.ungusd,
        usousd  : this.wallet.usousd,

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
        usdInXomPool : this.wallet.usdInXomPool,

        jnjInJnjPool : this.wallet.jnjInJnjPool,
        usdInJnjPool : this.wallet.usdInJnjPool,
        gsInGsPool : this.wallet.gsInGsPool,
        usdInGsPool : this.wallet.usdInGsPool,
        daxInDaxPool : this.wallet.daxInDaxPool,
        usdInDaxPool : this.wallet.usdInDaxPool,
        addyyInAddyyPool : this.wallet.addyyInAddyyPool,
        usdInAddyyPool : this.wallet.usdInAddyyPool,

        wmtInWmtPool : this.wallet.wmtInWmtPool,
        usdInWmtPool : this.wallet.usdInWmtPool,
        ulInUlPool : this.wallet.ulInUlPool,
        usdInUlPool : this.wallet.usdInUlPool,
        ungInUngPool : this.wallet.ungInUngPool,
        usdInUngPool : this.wallet.usdInUngPool,
        usoInUsoPool : this.wallet.usoInUsoPool,
        usdInUsoPool : this.wallet.usdInUsoPool

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
    this.dfiInLockStaking = 0;
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

  getInterest(key: string): number {

    if ( !key || !this.oraclePrices || this.oraclePrices.data.length === 0) {
      return 0;
    }

    return +this.oraclePrices.data.find(o => o.token.symbolKey === key)?.interest;

  }

  loadOraclePrices(): void {
    this.dexService.getOraclePrices()
      .subscribe(prices => {
          this.oraclePrices = prices;
        },
        err => {
          console.error('Fehler beim load oracle Prices: ' + JSON.stringify(err.message));
        });
  }

  loadPrices(): void {
    this.dexService.getPrices()
      .subscribe(prices => {
          this.prices = prices
          this.priceDFICEX = +this.prices.data.find( op => op.price.token === "DFI").price.aggregated.amount;
        },
        err => {
          console.error('Fehler beim load oracle Prices: ' + JSON.stringify(err.message));
        });
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
      this.poolPairsOcean.data = this.poolPairsOcean.data.filter(data => !data.symbol.includes("v1"));
      this.loadPrices();

      this.extractPools();

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

    this.berechneStakingOut();
    this.berechneMNOut();
    this.berechneAllOut();
    this.createIncomePools();

    this.dataService.setBtcUsd(this.poolBtc?.priceA);
    this.dataService.setEthUsd(this.poolEth?.priceA);
    this.dataService.setDfiUsd(this.poolBtc?.priceB);

    this.avgApr = this.getAPRAverage();
    if (this.apiOnline) {
      this.update();
    }
    this.spinner.hide();
  }

  private extractPools(): void {

    this.pools = this.addAllPools();
    this.poolUsd = this.pools.find(p => p.id === "17");
    this.poolBtc = this.pools.find(p => p.id === "5");
    this.poolEth = this.pools.find(p => p.id === "4");
  }

  private addAllPools(): Array<Pool> {

    const pools = new Array<Pool>();

    this.poolPairsOcean.data.forEach(oceanPool => {
      pools.push(this.setFromPoolPair(oceanPool.id));
    });

    return pools;
  }

  private createStockArray(): void {

    this.poolPairsOcean.data.forEach(oceanPool => {
      if (+oceanPool.id >= 17 && +oceanPool.id != 102 && +oceanPool.id != 101)
      this.stocksPools.push(this.setFromPoolPair(oceanPool.id));
    });

  }

  private createCryptoPoolsArray(): void {

    this.poolPairsOcean.data.forEach(oceanPool => {
      if (+oceanPool.id < 17 || +oceanPool.id === 101 || +oceanPool.id === 102) {
        this.cryptoPools.push(this.setFromPoolPair(oceanPool.id))
      }
    })

  }

  getIncomePools(): Array<PoolIncomeValue> {
    return this.poolIncomeList.sort((a, b) => (a.poolOut.dfiPerMonth > b.poolOut.dfiPerMonth) ? -1
      : ((b.poolOut.dfiPerMonth > a.poolOut.dfiPerMonth) ? 1 : 0));
  }

  createIncomePools(): void {

    this.poolIncomeList = new Array<PoolIncomeValue>();

    this.income.poolIncome.forEach(poolIncome => {

      const poolOut = new Outcome()

      const pool = this.setFromPoolPair(poolIncome.id + "");

      poolOut.dfiPerYear = poolIncome.dfiIncomeYear;
      poolOut.dfiPerMonth = poolIncome.dfiIncomeYear / 12;
      poolOut.dfiPerWeek = poolIncome.dfiIncomeYear / 52.1429;
      poolOut.dfiPerDay = poolIncome.dfiIncomeYear / 365;
      poolOut.dfiPerHour = poolIncome.dfiIncomeYear / 8760;
      poolOut.dfiPerMin = poolIncome.dfiIncomeYear / 525600;

      this.poolIncomeList.push(new PoolIncomeValue(poolIncome.share, pool, poolOut));
    });

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


  loadAllAccounts(): void {

    // if adresses exist
    if (this.adresses && this.adresses.length > 0) {
      this.dataService.getIncome(this.adresses).subscribe(results => {
          this.income = results;
          this.vaultsOfAllAddresses = results.vaults;
          this.setLMOut();
          this.loadStackingLock();
          this.loadDex();
          this.loadStackingMasternode();
          this.dataLoaded = true;

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

  loadStackingLock(): void {
    this.dfiInLockStaking = 0;
    this.adresses.forEach(adress => {
      this.stakingService
        .getStakingLock(adress).subscribe(
        lock => {
          const dfiInStaking = lock.find(l => l.asset === 'DFI');
          this.dfiInLockStaking += dfiInStaking.balance;
          this.berechneStakingOut();
          this.berechneAllOut();
        },
        err => {
          console.info("Address " + adress + " no lock staking.")
        });
    });
    this.stakingService
      .getStatsLock().subscribe(
      lock => {
        this.stakingLockStats = lock;
      },
      err => {
        console.error('Fehler beim get staking stats from lock: ' + JSON.stringify(err.message));
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

  getAddressBalance(address: string): AddressBalance {
    return this.adressBalances.find(a => a.address === address);
  }

  onChangeDfiStaking(): void {
    this.berechneStakingOut();
    this.berechneAllOut();
    this.buildDataForChart();
    this.buildDataForChartIncome();
  }

  getPool(id: string): Pool {
    return this.pools.find(x => x.poolPairId === id);
  }

  getPoolOcean(id: string): PoolPairOcean {
    return this.poolPairsOcean.data.find(x => x.id === id);
  }

  private getDfiPerMin(dfiProBlock: number): number {
    return dfiProBlock / this.blocktimeInS * 60;
  }


  berechneStakingOut(): void {

    this.stakingOut.dfiPerYear = (this.dfiInStaking * (1 + this.stakingApy / 100) - this.dfiInStaking)
      + (this.dfiInDfxStaking * (!this.stakingDfx?.staking?.yield?.apr ? 0: this.stakingDfx?.staking.yield.apr))
      + (this.dfiInLockStaking * (!this.stakingLockStats?.apr ? 0 : this.stakingLockStats?.apr));

    this.stakingOut.dfiPerDay = this.stakingOut.dfiPerYear / 356;
    this.stakingOut.dfiPerHour = this.stakingOut.dfiPerYear / 8760;
    this.stakingOut.dfiPerMin = this.stakingOut.dfiPerYear / 525600;
    this.stakingOut.dfiPerWeek = this.stakingOut.dfiPerYear / 52.1429;
    this.stakingOut.dfiPerMonth = this.stakingOut.dfiPerYear / 12;
  }

  berechneAllOut(): void {
    this.poolAllOut.dfiPerDay = this.stakingOut.dfiPerDay + this.lmOut.dfiPerDay + this.poolMasternodeOut.dfiPerDay;
    this.poolAllOut.dfiPerHour = this.stakingOut.dfiPerHour + this.lmOut.dfiPerHour + this.poolMasternodeOut.dfiPerHour;
    this.poolAllOut.dfiPerMin = this.stakingOut.dfiPerMin + this.lmOut.dfiPerMin + this.poolMasternodeOut.dfiPerMin;
    this.poolAllOut.dfiPerWeek = this.stakingOut.dfiPerWeek + this.lmOut.dfiPerWeek + this.poolMasternodeOut.dfiPerWeek;
    this.poolAllOut.dfiPerMonth = this.stakingOut.dfiPerMonth + this.lmOut.dfiPerMonth + this.poolMasternodeOut.dfiPerMonth;
    this.poolAllOut.dfiPerYear = this.stakingOut.dfiPerYear + this.lmOut.dfiPerYear + this.poolMasternodeOut.dfiPerYear;
  }

  setLMOut(): void {
    this.lmOut.dfiPerDay = this.income?.rewards.day.dfi;
    this.lmOut.dfiPerHour = this.income?.rewards.hour.dfi;
    this.lmOut.dfiPerMin = this.income?.rewards.min.dfi;
    this.lmOut.dfiPerWeek = this.income?.rewards.week.dfi;
    this.lmOut.dfiPerMonth = this.income?.rewards.month.dfi;
    this.lmOut.dfiPerYear = this.income?.rewards.year.dfi;
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
    return this.income?.totalValue;
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
      loan += +this.getLoanFromVaultUsd(vault)
      loan += +vault.interestUsdValue

    })

    return loan;
  }

  getLoanFromVaultUsd(vault: Vault): number {

    let usd = 0;
    let total = 0;

    vault?.loans?.forEach(loan => {
      if ('DUSD' === loan.symbolKey) {
        usd = +loan.amount;
      } else {
        total = +loan.amount * +loan.activePrice.active.amount;
      }
    });

    return usd + total;
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


  getLMUsd(): number {
    return this.income?.totalValueLM;
  }

  getStakingValueUsd(): number {
    return (this.dfiInStaking + this.dfiInDfxStaking) * this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    let dfiAmountInLm = 0;
    this.income?.poolIncome.forEach(pool => {
      if (pool.token_A_Id === 0) {
        dfiAmountInLm += pool.token_A_Amount;
      } else if (pool.token_B_Id === 0) {
        dfiAmountInLm += pool.token_B_Amount;
      }
    });
    return dfiAmountInLm;
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

    walletFinal.jnjusd = wallet.jnjusd;
    walletFinal.addyyusd = wallet.addyyusd;
    walletFinal.gsusd = wallet.gsusd;
    walletFinal.daxusd = wallet.daxusd;

    walletFinal.wmtusd = wallet.wmtusd;
    walletFinal.ulusd = wallet.ulusd;
    walletFinal.ungusd = wallet.ungusd;
    walletFinal.usousd = wallet.usousd;

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

    walletFinal.ppltInPpltPool = wallet.ppltInPpltPool;
    walletFinal.usdInPpltPool = wallet.usdInPpltPool;
    walletFinal.govtInGovtPool = wallet.govtInGovtPool;
    walletFinal.usdInGovtPool = wallet.usdInGovtPool;
    walletFinal.xomInXomPool = wallet.xomInXomPool;
    walletFinal.usdInXomPool = wallet.usdInXomPool;
    walletFinal.tanInTanPool = wallet.tanInTanPool;
    walletFinal.usdInTanPool = wallet.usdInTanPool;

    walletFinal.jnjInJnjPool = wallet.jnjInJnjPool;
    walletFinal.usdInJnjPool = wallet.usdInJnjPool;
    walletFinal.gsInGsPool = wallet.gsInGsPool;
    walletFinal.usdInGsPool = wallet.usdInGsPool;
    walletFinal.addyyInAddyyPool = wallet.addyyInAddyyPool;
    walletFinal.usdInAddyyPool = wallet.usdInAddyyPool;
    walletFinal.daxInDaxPool = wallet.daxInDaxPool;
    walletFinal.usdInDaxPool = wallet.usdInDaxPool;

    walletFinal.wmtInWmtPool = wallet.wmtInWmtPool;
    walletFinal.usdInWmtPool = wallet.usdInWmtPool;
    walletFinal.ulInUlPool = wallet.ulInUlPool;
    walletFinal.usdInUlPool = wallet.usdInUlPool;
    walletFinal.ungInUngPool = wallet.ungInUngPool;
    walletFinal.usdInUngPool = wallet.usdInUngPool;
    walletFinal.usoInUsoPool = wallet.usoInUsoPool;
    walletFinal.usdInUsoPool = wallet.usdInUsoPool;

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

    walletFinal.pplt = wallet.pplt;
    walletFinal.govt = wallet.govt;
    walletFinal.xom = wallet.xom;
    walletFinal.tan = wallet.tan;

    walletFinal.jnj = wallet.jnj;
    walletFinal.addyy = wallet.addyy;
    walletFinal.gs = wallet.gs;
    walletFinal.dax = wallet.dax;

    walletFinal.wmt = wallet.wmt;
    walletFinal.ul = wallet.ul;
    walletFinal.ung = wallet.ung;
    walletFinal.uso = wallet.uso;

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

    if (!this.wallet || !this.lmOut || !this.stakingOut || !this.poolMasternodeOut) {
      return 0;
    }

    // calculate how much income all
    const allIncome = this.lmOut.dfiPerYear + this.stakingOut.dfiPerYear + this.poolMasternodeOut.dfiPerYear;

    // calculate how much income from all pools, staking and masternode
    const countFreezer5 = this.adressesMasternodesFreezer5.length;
    const countFreezer10 = this.adressesMasternodesFreezer10.length;
    const countNormal = this.adressesMasternodes.length - countFreezer5 - countFreezer10;

    const rewardNormaleMnPart = countNormal * 20000 * this.stakingApyMN / allIncome;
    const reward5MnPart = countFreezer5 * 20000 * this.stakingApyMN * 1.5 / allIncome;
    const reward10MnPart = countFreezer10 * 20000 * this.stakingApyMN * 2 / allIncome;

    const stakingPart = this.stakingOut?.dfiPerYear / allIncome * 100;

    let lmPart = 0;
    this.income?.poolIncome.forEach(pool => {
      const poolPart = pool.dfiIncomeYear / allIncome * 100;
      const poolApr = poolPart * pool?.apr * 100;
      lmPart += poolApr;
    });

    const stakingApr = stakingPart * this.stakingApyMN * 0.85;
    const normalMnApr = rewardNormaleMnPart * this.stakingApyMN;
    const fiveFreezerMnApr = reward5MnPart * this.stakingApyMN * 1.5;
    const tenFreezerMnApr = reward10MnPart * this.stakingApyMN * 2;

    // compute average
    const average = (lmPart + stakingApr + normalMnApr + fiveFreezerMnApr + tenFreezerMnApr) / 100;

    if (!average) {
      return 0;
    }

    return Math.round(average * 100) / 100;
  }

  getDfiForAverageAPR(): number {
    return this.getDfiCountInLM() * 2 + this.dfiInStaking + this.dfiInDfxStaking + this.dfiInLockStaking + this.getDfiCountMn();
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
