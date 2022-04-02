import { Component, OnInit, ViewChild } from '@angular/core';
import { Dex } from '@services/dex.service';
import {Location} from '@angular/common';
import {
  AddressBalance,
  DexPoolPair,
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
  PoolDisOut, PoolMchiOut, PoolMstrOut, PoolIntcOut,
} from '@interfaces/Dex';
import {CountdownComponent} from 'ngx-countdown';
import {
  AddressVaults,
  ChartOptions6, HoldingValue,
  Newsletter, PoolIncomeValue, PoolPairsOcean,
  UserHistory,
  Vault,
  Wallet,
  WalletDto,
} from '@interfaces/Data';
import { environment } from '@environments/environment';
import { filter, forkJoin } from 'rxjs';
// @ts-ignore
import Timer = NodeJS.Timer;
import { TranslateService } from '@ngx-translate/core';
import { IncomeComponent } from '@components/income/income.component';
import { ValueComponent } from '@components/value/value.component';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo-v9';
import { Apollo } from 'apollo-angular';
import { HISTORY_USER, LOGIN, REGISTER, UPDATE } from '@interfaces/Graphql';
import { DataService } from '@services/data.service';
import { StakingService } from '@services/staking.service';
import { Meta } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SupernodeAccount } from '@interfaces/Supernode';
import { firstValueFrom } from 'rxjs';
import { MamonAccountNode } from '@interfaces/Mamon';
import { DfxStaking, OceanStats } from '@interfaces/Staking';
import { Router, NavigationEnd } from '@angular/router';
import { ChartComponent } from 'ng-apexcharts';

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

  dfiPorBlockStock = 77.8;

  rewards: Stats;

  blocktimeInS = 30;
  blocktimeInSSecond = 30;
  blocktimeFirstLastSecond = 30;
  fiat = 'USD';
  details = 'Staking';
  fiatKey = 'fiatKey';
  detailsKey = 'detailsKey';

  priceDFICEX: number;

  pools: Array<Pool>;
  oceanStats: OceanStats;

  // Staking infos
  dfiInStaking = 0;
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

  cryptoPools: Array<Pool>;
  stocksPools: Array<Pool>;
  poolPairsOcean: PoolPairsOcean;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();
  poolAllOut: PoolAllOut = new PoolAllOut();
  poolMasternodeOut: MasternodeOutcome = new MasternodeOutcome();

  poolIncomeList = new Array<PoolIncomeValue>();

  sCountdown = 300;
  sCountdownShow = 300;
  sCountdownKey = 'sCountdownKey';
  timer: Timer;

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

  dataLoaded = true;

  isInfoOpen = false;
  selectedTab = 'manual';
  isDarkModeOn = false;
  cakeApyLoadAuto = true;
  cakeApyLoadAutoKey = 'cakeApyLoadAutoKey';
  timestamp = null;

  oneTrackingAddress = null;
  authKeyOverUrl = null;

  userHistory: UserHistory = null;

  isValueChartOn = true;
  isValueChartOnKey = 'isValueChartOnKey';
  isIncomeChartOn = true;
  isIncomeChartOnKey = 'isIncomeChartOnKey';

  private static setFromPoolPair(pool: Pool, poolPairs: DexPoolPair): void {
    pool.totalLiquidityLpToken = poolPairs[pool.id].totalLiquidity;
    const splitted = poolPairs[pool.id].symbol.split('-');
    pool.tokenASymbol = splitted[0];
    pool.tokenBSymbol = splitted[1];
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

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {

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

    this.testApi();

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

  handlePage(pageTag: string): void {
    this.currentPage = pageTag;
    this.menu = false;
    localStorage.setItem(this.currentPageKey, this.currentPage);
    this.location.replaceState(pageTag);
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
        usdInIntcPool : this.wallet.usdInIntcPool

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
        usdInIntcPool : this.wallet.usdInIntcPool

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
        localStorage.setItem(this.loggedInKey, this.loggedInAuth);

        this.addressesDto = new Array(this.oneTrackingAddress);
        this.adresses = this.addressesDto.slice();

        this.loadAddressesAndDexData();

        this.handlePage('dashboard');

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
    clearInterval(this.timer[Symbol.toPrimitive]);
    clearInterval(this.timer[Symbol.toPrimitive]);
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

  testApi(): void {

    this.dexService
      .getHealthCheck()
      .subscribe(response => {
          if (response.status === 204) {
            this.apiOnline = true;
          }
        },
        err => {
          console.error('Api down?' + err.message);
          this.apiOnline = false;

        });

  }

  async computeMeta(): Promise<void> {

    // Stats
    this.rewards = new Stats();

    try {
      const promiseStats = await this.dexService.getStats().toPromise();
      this.apiOnline = true;

      this.setStats(promiseStats);

      this.poolPairsOcean = await this.dexService.getPoolPairsOcean().toPromise();

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
    forkJoin([
      this.dexService.getPrices(),
      this.dexService.getListpoolpairs()],
    ).subscribe((([prices, poolPairs]: [Prices, DexPoolPair]) => {
          this.parsePoolsAndComputeOutcome(prices, poolPairs);

        }
      ),
      err => {
        console.error('Fehler beim Load Dex Data wait: ' + JSON.stringify(err.message));
        this.apiOnline = false;

      });

  }

  private parsePoolsAndComputeOutcome(prices: Prices , poolPairs: DexPoolPair): void {

    this.cryptoPools = new Array<Pool>();
    this.stocksPools = new Array<Pool>();
    this.extractPools(poolPairs);
    this.computePrices(prices);

    AppComponent.setFromPoolPair(this.poolBtc, poolPairs);
    AppComponent.setFromPoolPair(this.poolEth, poolPairs);
    AppComponent.setFromPoolPair(this.poolUsdc, poolPairs);
    AppComponent.setFromPoolPair(this.poolUsdt, poolPairs);
    AppComponent.setFromPoolPair(this.poolLtc, poolPairs);
    AppComponent.setFromPoolPair(this.poolDoge, poolPairs);
    AppComponent.setFromPoolPair(this.poolBch, poolPairs);

    this.createCryptoPoolsArray();

    if (this.poolUsd) {
      AppComponent.setFromPoolPair(this.poolUsd, poolPairs);
    }
    if (this.poolTsla) {
      AppComponent.setFromPoolPair(this.poolTsla, poolPairs);
    }
    if (this.poolQqq) {
      AppComponent.setFromPoolPair(this.poolQqq, poolPairs);
    }
    if (this.poolSpy) {
      AppComponent.setFromPoolPair(this.poolSpy, poolPairs);
    }
    if (this.poolPltr) {
      AppComponent.setFromPoolPair(this.poolPltr, poolPairs);
    }
    if (this.poolSlv) {
      AppComponent.setFromPoolPair(this.poolSlv, poolPairs);
    }
    if (this.poolAapl) {
      AppComponent.setFromPoolPair(this.poolAapl, poolPairs);
    }
    if (this.poolGld) {
      AppComponent.setFromPoolPair(this.poolGld, poolPairs);
    }
    if (this.poolGme) {
      AppComponent.setFromPoolPair(this.poolGme, poolPairs);
    }
    if (this.poolGoogl) {
      AppComponent.setFromPoolPair(this.poolGoogl, poolPairs);
    }
    if (this.poolArkk) {
      AppComponent.setFromPoolPair(this.poolArkk, poolPairs);
    }
    if (this.poolBaba) {
      AppComponent.setFromPoolPair(this.poolBaba, poolPairs);
    }
    if (this.poolVnq) {
      AppComponent.setFromPoolPair(this.poolVnq, poolPairs);
    }
    if (this.poolUrth) {
      AppComponent.setFromPoolPair(this.poolUrth, poolPairs);
    }
    if (this.poolTlt) {
      AppComponent.setFromPoolPair(this.poolTlt, poolPairs);
    }
    if (this.poolPdbc) {
      AppComponent.setFromPoolPair(this.poolPdbc, poolPairs);
    }
    // new stocks 1.2.2022
    if (this.poolEem) {
      AppComponent.setFromPoolPair(this.poolEem, poolPairs);
    }
    if (this.poolAmzn) {
      AppComponent.setFromPoolPair(this.poolAmzn, poolPairs);
    }
    if (this.poolNvda) {
      AppComponent.setFromPoolPair(this.poolNvda, poolPairs);
    }
    if (this.poolCoin) {
      AppComponent.setFromPoolPair(this.poolCoin, poolPairs);
    }
    // new stocks 3.3.2022
    if (this.poolMsft) {
      AppComponent.setFromPoolPair(this.poolMsft, poolPairs);
    }
    if (this.poolFb) {
      AppComponent.setFromPoolPair(this.poolFb, poolPairs);
    }
    if (this.poolNflx) {
      AppComponent.setFromPoolPair(this.poolNflx, poolPairs);
    }
    if (this.poolVoo) {
      AppComponent.setFromPoolPair(this.poolVoo, poolPairs);
    }
    // new stocks 30.3.2022
    if (this.poolDis) {
      AppComponent.setFromPoolPair(this.poolDis, poolPairs);
    }
    if (this.poolMchi) {
      AppComponent.setFromPoolPair(this.poolMchi, poolPairs);
    }
    if (this.poolMstr) {
      AppComponent.setFromPoolPair(this.poolMstr, poolPairs);
    }
    if (this.poolIntc) {
      AppComponent.setFromPoolPair(this.poolIntc, poolPairs);
    }

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
    this.priceDFICEX = prices.defichain.fiat;
    this.poolBtc.priceA = prices.bitcoin.fiat;
    // compute correct price of dfi from btc pool
    this.poolBtc.priceB = this.poolBtc.totalLiquidityUsd / +this.poolBtc.reserveB / 2;
    this.poolEth.priceA = prices.ethereum.fiat;
    this.poolEth.priceB = prices.defichain.fiat;
    this.poolLtc.priceA = prices.litecoin.fiat;
    this.poolLtc.priceB = prices.defichain.fiat;
    this.poolDoge.priceA = prices.dogecoin.fiat;
    this.poolDoge.priceB = prices.defichain.fiat;
    this.poolUsdt.priceA = prices.tether.fiat;
    this.poolUsdt.priceB = prices.defichain.fiat;
    this.poolUsdc.priceA = prices.tether.fiat;
    this.poolUsdc.priceB = prices.defichain.fiat;
    this.poolBch.priceA = prices.bitcoincash.fiat;
    this.poolBch.priceB = prices.defichain.fiat;
  }

  private extractPools(pools: DexPoolPair): void {
    this.poolBtc = pools['5'];
    this.poolEth = pools['4'];
    this.poolUsdt = pools['6'];
    this.poolUsdc = pools['14'];
    this.poolLtc = pools['10'];
    this.poolDoge = pools['8'];
    this.poolBch = pools['12'];
    this.poolUsd = pools['17'];

    this.poolTsla = pools['18'];
    this.poolQqq = pools['39'];
    this.poolSpy = pools['38'];
    this.poolPltr = pools['35'];
    this.poolSlv = pools['46'];
    this.poolAapl = pools['36'];
    this.poolGld = pools['43'];
    this.poolGme = pools['25'];
    this.poolGoogl = pools['32'];
    this.poolArkk = pools['42'];
    this.poolBaba = pools['33'];
    this.poolVnq = pools['41'];
    this.poolUrth = pools['44'];
    this.poolTlt = pools['45'];
    this.poolPdbc = pools['40'];
    // 1.2.2022
    this.poolAmzn = pools['54'];
    this.poolEem = pools['53'];
    this.poolNvda = pools['55'];
    this.poolCoin = pools['56'];
    // 3.3.2022
    this.poolMsft = pools['61'];
    this.poolFb = pools['64'];
    this.poolNflx = pools['62'];
    this.poolVoo = pools['63'];
    // 30.3.2022
    this.poolDis = pools['69'];
    this.poolMchi = pools['70'];
    this.poolMstr = pools['71'];
    this.poolIntc = pools['72'];
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
  }

  private createCryptoPoolsArray(): void {
    this.cryptoPools.push(this.poolBtc);
    this.cryptoPools.push(this.poolEth);
    this.cryptoPools.push(this.poolLtc);
    this.cryptoPools.push(this.poolBch);
    this.cryptoPools.push(this.poolDoge);
    this.cryptoPools.push(this.poolUsdt);
    this.cryptoPools.push(this.poolUsdc);
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

    // STOCKS
    this.dfiProBlockUsd = 0.5 * this.dfiPorBlockStock;
    this.dfiProBlockUsd += this.getCommission(this.poolUsd);

    this.dfiProBlockTsla = 0.0491 * this.dfiPorBlockStock;
    this.dfiProBlockTsla += this.getCommission(this.poolTsla);

    this.dfiProBlockQqq = 0.039 * this.dfiPorBlockStock;
    this.dfiProBlockQqq += this.getCommission(this.poolQqq);

    this.dfiProBlockSpy = 0.0658 * this.dfiPorBlockStock;
    this.dfiProBlockSpy += this.getCommission(this.poolSpy);

    this.dfiProBlockAapl = 0.0263 * this.dfiPorBlockStock;
    this.dfiProBlockAapl += this.getCommission(this.poolAapl);

    this.dfiProBlockPltr = 0.0145 * this.dfiPorBlockStock;
    this.dfiProBlockPltr += this.getCommission(this.poolPltr);

    this.dfiProBlockSlv = 0.008 * this.dfiPorBlockStock;
    this.dfiProBlockSlv += this.getCommission(this.poolSlv);

    this.dfiProBlockGld = 0.0079 * this.dfiPorBlockStock;
    this.dfiProBlockGld += this.getCommission(this.poolGld);

    this.dfiProBlockGme = 0.036 * this.dfiPorBlockStock;
    this.dfiProBlockGme += this.getCommission(this.poolGme);

    this.dfiProBlockGoogle = 0.0126 * this.dfiPorBlockStock;
    this.dfiProBlockGoogle += this.getCommission(this.poolGoogl);

    this.dfiProBlockArkk = 0.0146 * this.dfiPorBlockStock;
    this.dfiProBlockArkk += this.getCommission(this.poolArkk);

    this.dfiProBlockBaba = 0.0191 * this.dfiPorBlockStock;
    this.dfiProBlockBaba += this.getCommission(this.poolBaba);

    this.dfiProBlockVnq = 0.0044 * this.dfiPorBlockStock;
    this.dfiProBlockVnq += this.getCommission(this.poolVnq);

    this.dfiProBlockUrth = 0.005 * this.dfiPorBlockStock;
    this.dfiProBlockUrth += this.getCommission(this.poolUrth);

    this.dfiProBlockTlt = 0.0083 * this.dfiPorBlockStock;
    this.dfiProBlockTlt += this.getCommission(this.poolTlt);

    this.dfiProBlockPdbc = 0.0087 * this.dfiPorBlockStock;
    this.dfiProBlockPdbc += this.getCommission(this.poolPdbc);

    // STOCKS 1.2.2022
    this.dfiProBlockAmzn = 0.0221 * this.dfiPorBlockStock;
    this.dfiProBlockAmzn += this.getCommission(this.poolAmzn);

    this.dfiProBlockNvda = 0.0305 * this.dfiPorBlockStock;
    this.dfiProBlockNvda += this.getCommission(this.poolNvda);

    this.dfiProBlockCoin = 0.0159 * this.dfiPorBlockStock;
    this.dfiProBlockCoin += this.getCommission(this.poolCoin);

    this.dfiProBlockEem = 0.0081 * this.dfiPorBlockStock;
    this.dfiProBlockEem += this.getCommission(this.poolEem);

    // STOCKS 3.3.2022
    this.dfiProBlockMsft = 0.0189 * this.dfiPorBlockStock;
    this.dfiProBlockMsft += this.getCommission(this.poolMsft);

    this.dfiProBlockNflx = 0.0142 * this.dfiPorBlockStock;
    this.dfiProBlockNflx += this.getCommission(this.poolNflx);

    this.dfiProBlockVoo = 0.0076 * this.dfiPorBlockStock;
    this.dfiProBlockVoo += this.getCommission(this.poolVoo);

    this.dfiProBlockFb = 0.0201 * this.dfiPorBlockStock;
    this.dfiProBlockFb += this.getCommission(this.poolFb);

    // STOCKS 30.3.2022
    this.dfiProBlockDis = this.getRewardIsOn(this.poolDis) ? 0.0076 * this.dfiPorBlockStock : 0;
    this.dfiProBlockDis += this.getCommission(this.poolDis);

    this.dfiProBlockMchi = this.getRewardIsOn(this.poolMchi) ? 0.0081 * this.dfiPorBlockStock : 0;
    this.dfiProBlockMchi += this.getCommission(this.poolMchi);

    this.dfiProBlockMstr = this.getRewardIsOn(this.poolMstr) ? 0.0166 * this.dfiPorBlockStock : 0;
    this.dfiProBlockMstr += this.getCommission(this.poolMstr);

    this.dfiProBlockIntc = this.getRewardIsOn(this.poolIntc) ? 0.011 * this.dfiPorBlockStock : 0;
    this.dfiProBlockIntc += this.getCommission(this.poolIntc);
  }

  getIncomePools(): Array<PoolIncomeValue> {
    return this.poolIncomeList.sort((a, b) => (a.poolOut.dfiPerMonth > b.poolOut.dfiPerMonth) ? -1
      : ((b.poolOut.dfiPerMonth > a.poolOut.dfiPerMonth) ? 1 : 0));
  }

  createIncomePools(): void {
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
    if (this.anteilAmPoolUsdc > 0 ) {
      this.poolIncomeList.push(new PoolIncomeValue(this.anteilAmPoolUsdc,
        this.poolUsdc, this.poolUsdcOut, this.dfiProBlockUsdc));
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
    forkJoin([
      this.dexService.getPrices(),
      this.dexService.getListpoolpairs()],
    ).subscribe((([prices, poolPairs]: [Prices, DexPoolPair]) => {
          this.parsePoolsAndComputeOutcome(prices, poolPairs);
        }
      ),
      err => {
        console.error('Fehler beim loadDexManual: ' + JSON.stringify(err.message));
        this.apiOnline = false;
      });
  }

  loadAllAccounts(): void {
    this.adressBalances = new Array<AddressBalance>();
    this.vaultsOfAllAddresses = new Array<AddressVaults>();
    const requestArray = [];

    // normal adresses
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAdressAccount(ad));
    }

    // vaults
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAddressVaults(ad));
    }

    // minter adresses
    for (const adM of this.adressesMasternodes) {
      requestArray.push(this.dataService.getAdressAccount(adM));
    }

    // if adresses exist
    if (requestArray.length > 0) {
      forkJoin(requestArray).subscribe(results => {
          results.forEach((value, i) => {
            // normal address
             if (i <= this.adresses?.length - 1) {
               this.addCoinsAndTokensToWallet(value as Array<SupernodeAccount>, this.getAddressForIteration(i), false,
                 false, false);
               // vaults address
             } else if (i > this.adresses?.length - 1 && i <= this.adresses?.length * 2 - 1) {
               if ((value as AddressVaults)?.data?.length > 0) {
                 this.vaultsOfAllAddresses.push(value as AddressVaults);
               }
               // minter address
             } else if (i > (this.adresses?.length * 2) - 1) {
               const adress = this.getMasternodeAddressForIteration(i);
               this.addCoinsAndTokensToWallet(value as Array<SupernodeAccount>, adress, true, this.isFrozen5(adress),
                 this.isFrozen10(adress));
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

  loadStackingMasternode(): void {
    this.stakingService
      .getMasternode().subscribe(
      masternode => {
        this.masternodeCount5Freezer = masternode.data.masternodes.locked.find(p => p.weeks === 260).count;
        this.masternodeCount10Freezer = masternode.data.masternodes.locked.find(p => p.weeks === 520).count;
        this.masternodeCount0Freezer = masternode.data.masternodes.locked.find(p => p.weeks === 0).count;
        this.masternodeCount = this.masternodeCount5Freezer + this.masternodeCount10Freezer + this.masternodeCount0Freezer;
        this.masternodeCountForAprCalc = this.masternodeCount5Freezer * 1.5 + this.masternodeCount10Freezer * 2
          + this.masternodeCount0Freezer;
        this.dfiBurned = masternode.data.burned.total;
        this.berechneMNOut();
        this.berechneAllOut();
      },
      err => {
        console.error('Fehler beim loadStackingMasternode: ' + JSON.stringify(err.message));
        this.apiOnline = false;
      });
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

  addCoinsAndTokensToWallet(accounts: Array<SupernodeAccount>, address: string, masternode: boolean, freezed5: boolean,
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
      const splitted = account.raw.split('@');
      switch (account.token) {
        case '$DFI': {
          if (!masternode) {
            this.wallet.dfi += +splitted[0];
          } else {
            this.wallet.dfiInMasternodes += +splitted[0];
          }
          this.getAddressBalance(address).dfiCoins = +splitted[0];
          break;
        }
        case 'DFI': {
          this.wallet.dfi += +splitted[0];
          this.getAddressBalance(address).dfiTokens = +splitted[0];
          break;
        }
        case 'BTC': {
          this.wallet.btc += +splitted[0];
          this.getAddressBalance(address).btcToken = +splitted[0];
          break;
        }
        case 'BCH': {
          this.wallet.bch += +splitted[0];
          this.getAddressBalance(address).bchToken = +splitted[0];
          break;
        }
        case 'ETH': {
          this.wallet.eth += +splitted[0];
          this.getAddressBalance(address).ethToken = +splitted[0];
          break;
        }
        case 'LTC': {
          this.wallet.ltc += +splitted[0];
          this.getAddressBalance(address).ltcToken = +splitted[0];
          break;
        }
        case 'DOGE': {
          this.wallet.doge += +splitted[0];
          this.getAddressBalance(address).dogeToken = +splitted[0];
          break;
        }
        case 'USDT': {
          this.wallet.usdt += +splitted[0];
          this.getAddressBalance(address).usdtToken = +splitted[0];
          break;
        }
        case 'USDC': {
          this.wallet.usdc += +splitted[0];
          this.getAddressBalance(address).usdcToken = +splitted[0];
          break;
        }
        case 'DUSD': {
          this.wallet.usd += +splitted[0];
          this.getAddressBalance(address).usdToken = +splitted[0];
          break;
        }
        case 'TSLA': {
          this.wallet.tsla += +splitted[0];
          this.getAddressBalance(address).tslaToken = +splitted[0];
          break;
        }
        case 'QQQ': {
          this.wallet.qqq += +splitted[0];
          this.getAddressBalance(address).qqqToken = +splitted[0];
          break;
        }
        case 'SPY': {
          this.wallet.spy += +splitted[0];
          this.getAddressBalance(address).spyToken = +splitted[0];
          break;
        }
        case 'PLTR': {
          this.wallet.pltr += +splitted[0];
          this.getAddressBalance(address).pltrToken = +splitted[0];
          break;
        }
        case 'SLV': {
          this.wallet.slv += +splitted[0];
          this.getAddressBalance(address).slvToken = +splitted[0];
          break;
        }
        case 'AAPL': {
          this.wallet.aapl += +splitted[0];
          this.getAddressBalance(address).aaplToken = +splitted[0];
          break;
        }
        case 'GLD': {
          this.wallet.gld += +splitted[0];
          this.getAddressBalance(address).gldToken = +splitted[0];
          break;
        }
        case 'GME': {
          this.wallet.gme += +splitted[0];
          this.getAddressBalance(address).gmeToken = +splitted[0];
          break;
        }
        case 'GOOGL': {
          this.wallet.googl += +splitted[0];
          this.getAddressBalance(address).googlToken = +splitted[0];
          break;
        }
        case 'ARKK': {
          this.wallet.arkk += +splitted[0];
          this.getAddressBalance(address).arkkToken = +splitted[0];
          break;
        }
        case 'BABA': {
          this.wallet.baba += +splitted[0];
          this.getAddressBalance(address).babaToken = +splitted[0];
          break;
        }
        case 'VNQ': {
          this.wallet.vnq += +splitted[0];
          this.getAddressBalance(address).vnqToken = +splitted[0];
          break;
        }
        case 'URTH': {
          this.wallet.urth += +splitted[0];
          this.getAddressBalance(address).urthToken = +splitted[0];
          break;
        }
        case 'TLT': {
          this.wallet.tlt += +splitted[0];
          this.getAddressBalance(address).tltToken = +splitted[0];
          break;
        }
        case 'PDBC': {
          this.wallet.pdbc += +splitted[0];
          this.getAddressBalance(address).pdbcToken = +splitted[0];
          break;
        }
        case 'AMZN': {
          this.wallet.amzn += +splitted[0];
          this.getAddressBalance(address).amznToken = +splitted[0];
          break;
        }
        case 'COIN': {
          this.wallet.coin += +splitted[0];
          this.getAddressBalance(address).coinToken = +splitted[0];
          break;
        }
        case 'NVDA': {
          this.wallet.nvda += +splitted[0];
          this.getAddressBalance(address).nvdaToken = +splitted[0];
          break;
        }
        case 'EEM': {
          this.wallet.eem += +splitted[0];
          this.getAddressBalance(address).eemToken = +splitted[0];
          break;
        }
        case 'MSFT': {
          this.wallet.msft += +splitted[0];
          this.getAddressBalance(address).msftToken = +splitted[0];
          break;
        }
        case 'FB': {
          this.wallet.fb += +splitted[0];
          this.getAddressBalance(address).fbToken = +splitted[0];
          break;
        }
        case 'VOO': {
          this.wallet.voo += +splitted[0];
          this.getAddressBalance(address).vooToken = +splitted[0];
          break;
        }
        case 'NFLX': {
          this.wallet.nflx += +splitted[0];
          this.getAddressBalance(address).nflxToken = +splitted[0];
          break;
        }
        case 'DIS': {
          this.wallet.dis += +splitted[0];
          this.getAddressBalance(address).disToken = +splitted[0];
          break;
        }
        case 'MCHI': {
          this.wallet.mchi += +splitted[0];
          this.getAddressBalance(address).mchiToken = +splitted[0];
          break;
        }
        case 'MSTR': {
          this.wallet.mstr += +splitted[0];
          this.getAddressBalance(address).mstrToken = +splitted[0];
          break;
        }
        case 'INTC': {
          this.wallet.intc += +splitted[0];
          this.getAddressBalance(address).intcToken = +splitted[0];
          break;
        }
        case 'BTC-DFI': {
          this.wallet.btcdfi += +splitted[0];
          this.getAddressBalance(address).btcdfiToken = +splitted[0];
          break;
        }
        case 'BCH-DFI': {
          this.wallet.bchdfi += +splitted[0];
          this.getAddressBalance(address).bchdfiToken = +splitted[0];
          break;
        }
        case 'ETH-DFI': {
          this.wallet.ethdfi += +splitted[0];
          this.getAddressBalance(address).ethdfiToken = +splitted[0];
          break;
        }
        case 'LTC-DFI': {
          this.wallet.ltcdfi += +splitted[0];
          this.getAddressBalance(address).ltcdfiToken = +splitted[0];
          break;
        }
        case 'DOGE-DFI': {
          this.wallet.dogedfi += +splitted[0];
          this.getAddressBalance(address).dogedfiToken = +splitted[0];
          break;
        }
        case 'USDT-DFI': {
          this.wallet.usdtdfi += +splitted[0];
          this.getAddressBalance(address).usdtdfiToken = +splitted[0];
          break;
        }
        case 'USDC-DFI': {
          this.wallet.usdcdfi += +splitted[0];
          this.getAddressBalance(address).usdcdfiToken = +splitted[0];
          break;
        }
        case 'DUSD-DFI': {
          this.wallet.usddfi += +splitted[0];
          this.getAddressBalance(address).usddfiToken = +splitted[0];
          break;
        }
        case 'TSLA-DUSD': {
          this.wallet.tslausd += +splitted[0];
          this.getAddressBalance(address).tslausdToken = +splitted[0];
          break;
        }
        case 'QQQ-DUSD': {
          this.wallet.qqqusd += +splitted[0];
          this.getAddressBalance(address).qqqusdToken = +splitted[0];
          break;
        }
        case 'SPY-DUSD': {
          this.wallet.spyusd += +splitted[0];
          this.getAddressBalance(address).spyusdToken = +splitted[0];
          break;
        }
        case 'PLTR-DUSD': {
          this.wallet.pltrusd += +splitted[0];
          this.getAddressBalance(address).pltrusdToken = +splitted[0];
          break;
        }
        case 'SLV-DUSD': {
          this.wallet.slvusd += +splitted[0];
          this.getAddressBalance(address).slvusdToken = +splitted[0];
          break;
        }
        case 'AAPL-DUSD': {
          this.wallet.aaplusd += +splitted[0];
          this.getAddressBalance(address).aaplusdToken = +splitted[0];
          break;
        }
        case 'GLD-DUSD': {
          this.wallet.gldusd += +splitted[0];
          this.getAddressBalance(address).gldusdToken = +splitted[0];
          break;
        }
        case 'GME-DUSD': {
          this.wallet.gmeusd += +splitted[0];
          this.getAddressBalance(address).gmeusdToken = +splitted[0];
          break;
        }
        case 'GOOGL-DUSD': {
          this.wallet.googlusd += +splitted[0];
          this.getAddressBalance(address).googlToken = +splitted[0];
          break;
        }
        case 'ARKK-DUSD': {
          this.wallet.arkkusd += +splitted[0];
          this.getAddressBalance(address).arkkusdToken = +splitted[0];
          break;
        }
        case 'BABA-DUSD': {
          this.wallet.babausd += +splitted[0];
          this.getAddressBalance(address).babausdToken = +splitted[0];
          break;
        }
        case 'VNQ-DUSD': {
          this.wallet.vnqusd += +splitted[0];
          this.getAddressBalance(address).vnqusdToken = +splitted[0];
          break;
        }
        case 'URTH-DUSD': {
          this.wallet.urthusd += +splitted[0];
          this.getAddressBalance(address).urthusdToken = +splitted[0];
          break;
        }
        case 'TLT-DUSD': {
          this.wallet.tltusd += +splitted[0];
          this.getAddressBalance(address).tltusdToken = +splitted[0];
          break;
        }
        case 'PDBC-DUSD': {
          this.wallet.pdbcusd += +splitted[0];
          this.getAddressBalance(address).pdbcusdToken = +splitted[0];
          break;
        }
        case 'AMZN-DUSD': {
          this.wallet.amznusd += +splitted[0];
          this.getAddressBalance(address).amznusdToken = +splitted[0];
          break;
        }
        case 'NVDA-DUSD': {
          this.wallet.nvdausd += +splitted[0];
          this.getAddressBalance(address).nvdausdToken = +splitted[0];
          break;
        }
        case 'COIN-DUSD': {
          this.wallet.coinusd += +splitted[0];
          this.getAddressBalance(address).coinusdToken = +splitted[0];
          break;
        }
        case 'EEM-DUSD': {
          this.wallet.eemusd += +splitted[0];
          this.getAddressBalance(address).eemusdToken = +splitted[0];
          break;
        }
        case 'MSFT-DUSD': {
          this.wallet.msftusd += +splitted[0];
          this.getAddressBalance(address).msftusdToken = +splitted[0];
          break;
        }
        case 'VOO-DUSD': {
          this.wallet.voousd += +splitted[0];
          this.getAddressBalance(address).voousdToken = +splitted[0];
          break;
        }
        case 'NFLX-DUSD': {
          this.wallet.nflxusd += +splitted[0];
          this.getAddressBalance(address).nflxusdToken = +splitted[0];
          break;
        }
        case 'FB-DUSD': {
          this.wallet.fbusd += +splitted[0];
          this.getAddressBalance(address).fbusdToken = +splitted[0];
          break;
        }
        case 'DIS-DUSD': {
          this.wallet.disusd += +splitted[0];
          this.getAddressBalance(address).disusdToken = +splitted[0];
          break;
        }
        case 'MCHI-DUSD': {
          this.wallet.mchiusd += +splitted[0];
          this.getAddressBalance(address).mchiusdToken = +splitted[0];
          break;
        }
        case 'MSTR-DUSD': {
          this.wallet.mstrusd += +splitted[0];
          this.getAddressBalance(address).mstrusdToken = +splitted[0];
          break;
        }
        case 'INTC-DUSD': {
          this.wallet.intcusd += +splitted[0];
          this.getAddressBalance(address).intcusdToken = +splitted[0];
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
      + this.poolUsdtOut.dfiPerMin + this.poolUsdcOut.dfiPerMin + this.poolLtcOut.dfiPerMin
      + this.poolDogeOut.dfiPerMin + this.poolBchOut.dfiPerMin + this.poolUsdOut?.dfiPerMin + this.poolTslaOut?.dfiPerMin
      + this.poolSpyOut?.dfiPerMin + this.poolQqqOut?.dfiPerMin + this.poolPltrOut?.dfiPerMin + this.poolSlvOut?.dfiPerMin
      + this.poolAaplOut?.dfiPerMin + this.poolGldOut?.dfiPerMin + this.poolGmeOut?.dfiPerMin + this.poolGooglOut?.dfiPerMin
      + this.poolArkkOut?.dfiPerMin + this.poolBabaOut?.dfiPerMin + this.poolVnqOut?.dfiPerMin + this.poolUrthOut?.dfiPerMin
      + this.poolTltOut?.dfiPerMin + this.poolPdbcOut?.dfiPerMin
      + this.poolAmznOut?.dfiPerMin + this.poolNvdaOut?.dfiPerMin + this.poolCoinOut?.dfiPerMin + this.poolEemOut?.dfiPerMin
      + this.poolMsftOut?.dfiPerMin + this.poolFbOut?.dfiPerMin + this.poolVooOut?.dfiPerMin + this.poolNflxOut?.dfiPerMin
      + this.poolDisOut?.dfiPerMin + this.poolMchiOut?.dfiPerMin + this.poolMstrOut?.dfiPerMin + this.poolIntcOut?.dfiPerMin;

    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolUsdcOut.dfiPerHour + this.poolLtcOut.dfiPerHour
      + this.poolDogeOut.dfiPerHour + this.poolBchOut.dfiPerHour + this.poolUsdOut.dfiPerHour + this.poolTslaOut.dfiPerHour
      + this.poolSpyOut?.dfiPerHour + this.poolQqqOut?.dfiPerHour + this.poolPltrOut?.dfiPerHour + this.poolSlvOut?.dfiPerHour
      + this.poolAaplOut?.dfiPerHour + this.poolGldOut?.dfiPerHour + this.poolGmeOut?.dfiPerHour + this.poolGooglOut?.dfiPerHour
      + this.poolArkkOut?.dfiPerHour + this.poolBabaOut?.dfiPerHour + this.poolVnqOut?.dfiPerHour + this.poolUrthOut?.dfiPerHour
      + this.poolTltOut?.dfiPerHour + this.poolPdbcOut?.dfiPerHour
      + this.poolAmznOut?.dfiPerHour + this.poolNvdaOut?.dfiPerHour + this.poolCoinOut?.dfiPerHour + this.poolEemOut?.dfiPerHour
      + this.poolMsftOut?.dfiPerHour + this.poolFbOut?.dfiPerHour + this.poolVooOut?.dfiPerHour + this.poolNflxOut?.dfiPerHour
      + this.poolDisOut?.dfiPerHour + this.poolMchiOut?.dfiPerHour + this.poolMstrOut?.dfiPerHour + this.poolIntcOut?.dfiPerHour;

    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolUsdcOut.dfiPerDay + this.poolLtcOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay + this.poolUsdOut.dfiPerDay + this.poolTslaOut.dfiPerDay
      + this.poolSpyOut?.dfiPerDay + this.poolQqqOut?.dfiPerDay + this.poolPltrOut?.dfiPerDay + this.poolSlvOut?.dfiPerDay
      + this.poolAaplOut?.dfiPerDay + this.poolGldOut?.dfiPerDay + this.poolGmeOut?.dfiPerDay + this.poolGooglOut?.dfiPerDay
      + this.poolArkkOut?.dfiPerDay + this.poolBabaOut?.dfiPerDay + this.poolVnqOut?.dfiPerDay + this.poolUrthOut?.dfiPerDay
      + this.poolTltOut?.dfiPerDay + this.poolPdbcOut?.dfiPerDay
      + this.poolAmznOut?.dfiPerDay + this.poolNvdaOut?.dfiPerDay + this.poolCoinOut?.dfiPerDay + this.poolEemOut?.dfiPerDay
      + this.poolMsftOut?.dfiPerDay + this.poolFbOut?.dfiPerDay + this.poolVooOut?.dfiPerDay + this.poolNflxOut?.dfiPerDay
      + this.poolDisOut?.dfiPerDay + this.poolMchiOut?.dfiPerDay + this.poolMstrOut?.dfiPerDay + this.poolIntcOut?.dfiPerDay;

    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolUsdcOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek
      + this.poolDogeOut.dfiPerWeek + this.poolBchOut.dfiPerWeek + this.poolUsdOut.dfiPerWeek + this.poolTslaOut.dfiPerWeek
      + this.poolSpyOut?.dfiPerWeek + this.poolQqqOut?.dfiPerWeek + this.poolPltrOut?.dfiPerWeek + this.poolSlvOut?.dfiPerWeek
      + this.poolAaplOut?.dfiPerWeek + this.poolGldOut?.dfiPerWeek + this.poolGmeOut?.dfiPerWeek + this.poolGooglOut?.dfiPerWeek
      + this.poolArkkOut?.dfiPerWeek + this.poolBabaOut?.dfiPerWeek + this.poolVnqOut?.dfiPerWeek + this.poolUrthOut?.dfiPerWeek
      + this.poolTltOut?.dfiPerWeek + this.poolPdbcOut?.dfiPerWeek
      + this.poolAmznOut?.dfiPerWeek + this.poolNvdaOut?.dfiPerWeek + this.poolCoinOut?.dfiPerWeek + this.poolEemOut?.dfiPerWeek
      + this.poolMsftOut?.dfiPerWeek + this.poolFbOut?.dfiPerWeek + this.poolVooOut?.dfiPerWeek + this.poolNflxOut?.dfiPerWeek
      + this.poolDisOut?.dfiPerWeek + this.poolMchiOut?.dfiPerWeek + this.poolMstrOut?.dfiPerWeek + this.poolIntcOut?.dfiPerWeek;

    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolUsdcOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth
      + this.poolDogeOut.dfiPerMonth + this.poolBchOut.dfiPerMonth + this.poolUsdOut.dfiPerMonth + this.poolTslaOut.dfiPerMonth
      + this.poolSpyOut?.dfiPerMonth + this.poolQqqOut?.dfiPerMonth + this.poolPltrOut?.dfiPerMonth + this.poolSlvOut?.dfiPerMonth
      + this.poolAaplOut?.dfiPerMonth + this.poolGldOut?.dfiPerMonth + this.poolGmeOut?.dfiPerMonth + this.poolGooglOut?.dfiPerMonth
      + this.poolArkkOut?.dfiPerMonth + this.poolBabaOut?.dfiPerMonth + this.poolVnqOut?.dfiPerMonth + this.poolUrthOut?.dfiPerMonth
      + this.poolTltOut?.dfiPerMonth + this.poolPdbcOut?.dfiPerMonth
      + this.poolAmznOut?.dfiPerMonth + this.poolNvdaOut?.dfiPerMonth + this.poolCoinOut?.dfiPerMonth + this.poolEemOut?.dfiPerMonth
      + this.poolMsftOut?.dfiPerMonth + this.poolFbOut?.dfiPerMonth + this.poolVooOut?.dfiPerMonth + this.poolNflxOut?.dfiPerMonth
      + this.poolDisOut?.dfiPerMonth + this.poolMchiOut?.dfiPerMonth + this.poolMstrOut?.dfiPerMonth + this.poolIntcOut?.dfiPerMonth;

    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolUsdcOut.dfiPerYear + this.poolLtcOut.dfiPerYear
      + this.poolDogeOut.dfiPerYear + this.poolBchOut.dfiPerYear + this.poolUsdOut.dfiPerYear + this.poolTslaOut.dfiPerYear
      + this.poolSpyOut?.dfiPerYear + this.poolQqqOut?.dfiPerYear + this.poolPltrOut?.dfiPerYear + this.poolSlvOut?.dfiPerYear
      + this.poolAaplOut?.dfiPerYear + this.poolGldOut?.dfiPerYear + this.poolGmeOut?.dfiPerYear + this.poolGooglOut?.dfiPerYear
      + this.poolArkkOut?.dfiPerYear + this.poolBabaOut?.dfiPerYear + this.poolVnqOut?.dfiPerYear + this.poolUrthOut?.dfiPerYear
      + this.poolTltOut?.dfiPerYear + this.poolPdbcOut?.dfiPerYear
      + this.poolAmznOut?.dfiPerYear + this.poolNvdaOut?.dfiPerYear + this.poolCoinOut?.dfiPerYear + this.poolEemOut?.dfiPerYear
      + this.poolMsftOut?.dfiPerYear + this.poolFbOut?.dfiPerYear + this.poolVooOut?.dfiPerYear + this.poolNflxOut?.dfiPerYear
      + this.poolDisOut?.dfiPerYear + this.poolMchiOut?.dfiPerYear + this.poolMstrOut?.dfiPerYear + this.poolIntcOut?.dfiPerYear;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking;
    this.stakingOut.dfiPerHour = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 8760) - this.dfiInStaking;
    this.stakingOut.dfiPerMin = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 525600) - this.dfiInStaking;
    this.stakingOut.dfiPerWeek = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 52.1429) - this.dfiInStaking;
    this.stakingOut.dfiPerMonth = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking;
    this.stakingOut.dfiPerYear = this.dfiInStaking * (1 + this.stakingApy / 100) - this.dfiInStaking;
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
    this.buildDataForChartValue();
  }

  buildDataForChart(): void {

    this.valueComponent?.buildDataForChart();
  }

  buildDataForChartValue(): void {

    this.valueComponent?.buildDataForChartValue();
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
      + this.getDisValueUsd() + this.getMchiValueUsd() + this.getMstrValueUsd() + this.getIntcValueUsd();

    // Collateral
    const collateral = this.getVaultsValueUsd();

    return allCryptoAndStocks + collateral;
  }

  getAllValuesUsdPriceWithputLoan(): number {

    // All Crypto and Stock values
    const allWithLoans = this.getAllValuesUsdPrice();
    const loans = this.getVaultsLoansValueUsd();
    return allWithLoans - loans;
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
      }
    });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx + voo + fb
      + dis + mchi + mstr + intc;
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
    return (this.wallet?.usdtInUsdtPool + this.wallet?.usdt) * this.poolUsdt?.priceA;
  }
  getUsdtValueLmUsd(): number {
    return (this.wallet?.usdtInUsdtPool) * this.poolUsdt?.priceA;
  }
  getUsdcValueUsd(): number {
    return (this.wallet?.usdcInUsdcPool + this.wallet?.usdc) * this.poolUsdc?.priceA;
  }
  getUsdcValueLmUsd(): number {
    return (this.wallet?.usdcInUsdcPool) * this.poolUsdc?.priceA;
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
    return (this.wallet?.usdInUsdPool + this.wallet?.usd + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
        + this.wallet?.usdInQqqPool + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
        + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
        + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
        + this.wallet?.usdInPdbcPool + this.wallet?.usdInAmznPool + this.wallet?.usdInNvdaPool + this.wallet?.usdInCoinPool
        + this.wallet?.usdInEemPool + this.wallet?.usdInMsftPool + this.wallet?.usdInNflxPool + this.wallet?.usdInVooPool
        + this.wallet?.usdInFbPool + this.wallet?.usdInDisPool + this.wallet?.usdInMchiPool + this.wallet?.usdInMstrPool
        + this.wallet?.usdInIntcPool) * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  getUsdValueLmUsd(): number {
    return (this.wallet?.usdInUsdPool + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
      + this.wallet?.usdInQqqPool + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
      + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
      + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
      + this.wallet?.usdInPdbcPool + this.wallet?.usdInAmznPool + this.wallet?.usdInNvdaPool + this.wallet?.usdInCoinPool
      + this.wallet?.usdInEemPool + this.wallet?.usdInMsftPool + this.wallet?.usdInNflxPool + this.wallet?.usdInVooPool
      + this.wallet?.usdInFbPool + this.wallet?.usdInDisPool + this.wallet?.usdInMchiPool + this.wallet?.usdInMstrPool
      + this.wallet?.usdInIntcPool) * this.getUsdPriceOfStockPools(this.poolUsd);
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

  getUsdPriceOfStockPools(pool: Pool): number {
    return pool ? pool?.totalLiquidityUsd / 2 / +pool?.reserveA : 0;
  }

  getDfiCount(): number {
    return this.wallet?.dfi + this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool
      + this.wallet?.dfiInUsdcPool + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool  + this.wallet?.dfiInUsdPool
      + this.wallet?.dfiInBchPool + this.dfiInStaking + this.wallet?.dfiInMasternodes;

  }

  getDfiCountLM(): number {
    return this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool + this.wallet?.dfiInUsdcPool
      + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool + this.wallet?.dfiInBchPool + this.wallet?.dfiInUsdPool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
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
      + this.getDisValueLmUsd() + this.getMchiValueLmUsd() + this.getMstrValueLmUsd() + this.getIntcValueLmUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
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
      + this.poolUsdcOut.dfiPerDay + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay + this.poolUsdOut.dfiPerDay
      + this.poolTslaOut.dfiPerDay + this.poolSpyOut.dfiPerDay + this.poolQqqOut.dfiPerDay + this.poolPltrOut.dfiPerDay
      + this.poolSlvOut.dfiPerDay + this.poolAaplOut.dfiPerDay + this.poolGldOut.dfiPerDay + this.poolGmeOut.dfiPerDay
      + this.poolGooglOut.dfiPerDay + this.poolArkkOut.dfiPerDay + this.poolBabaOut.dfiPerDay + this.poolVnqOut.dfiPerDay
      + this.poolUrthOut.dfiPerDay + this.poolTltOut.dfiPerDay + this.poolPdbcOut.dfiPerDay
      + this.poolAmznOut.dfiPerDay + this.poolNvdaOut.dfiPerDay + this.poolCoinOut.dfiPerDay + this.poolEemOut.dfiPerDay
      + this.poolMsftOut.dfiPerDay + this.poolFbOut.dfiPerDay + this.poolVooOut.dfiPerDay + this.poolNflxOut.dfiPerDay
      + this.poolDisOut.dfiPerDay + this.poolMchiOut.dfiPerDay + this.poolMstrOut.dfiPerDay + this.poolIntcOut.dfiPerDay;
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
  getAnteilUSDCPoolAnGesamtLM(): number {
    return this.poolUsdcOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

  // WALLETS
  onChangeBtcWallet(): void {
    if (this.checkInputNumber(this.wallet.btc)) {
      localStorage.setItem(this.wallet.btcKey, JSON.stringify(this.wallet.btc));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeDogeWallet(): void {
    if (this.checkInputNumber(this.wallet.doge)) {
      localStorage.setItem(this.wallet.dogeKey, JSON.stringify(this.wallet.doge));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeBchWallet(): void {
    if (this.checkInputNumber(this.wallet.bch)) {
      localStorage.setItem(this.wallet.bchKey, JSON.stringify(this.wallet.bch));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeLtcWallet(): void {
    if (this.checkInputNumber(this.wallet.ltc)) {
      localStorage.setItem(this.wallet.ltcKey, JSON.stringify(this.wallet.ltc));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdtWallet(): void {
    if (this.checkInputNumber(this.wallet.usdt)) {
      localStorage.setItem(this.wallet.usdtKey, JSON.stringify(this.wallet.usdt));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdcWallet(): void {
    if (this.checkInputNumber(this.wallet.usdc)) {
      localStorage.setItem(this.wallet.usdcKey, JSON.stringify(this.wallet.usdc));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeEthWallet(): void {
    if (this.checkInputNumber(this.wallet.eth)) {
      localStorage.setItem(this.wallet.ethKey, JSON.stringify(this.wallet.eth));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdWallet(): void {
    if (this.checkInputNumber(this.wallet.usd)) {
      localStorage.setItem(this.wallet.usdKey, JSON.stringify(this.wallet.usd));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeTslaWallet(): void {
    if (this.checkInputNumber(this.wallet.tsla)) {
      localStorage.setItem(this.wallet.tslaKey, JSON.stringify(this.wallet.tsla));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeSpyWallet(): void {
    if (this.checkInputNumber(this.wallet.spy)) {
      localStorage.setItem(this.wallet.spyKey, JSON.stringify(this.wallet.spy));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeQqqWallet(): void {
    if (this.checkInputNumber(this.wallet.qqq)) {
      localStorage.setItem(this.wallet.qqqKey, JSON.stringify(this.wallet.qqq));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangePltrWallet(): void {
    if (this.checkInputNumber(this.wallet.pltr)) {
      localStorage.setItem(this.wallet.pltrKey, JSON.stringify(this.wallet.pltr));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeSlvWallet(): void {
    if (this.checkInputNumber(this.wallet.slv)) {
      localStorage.setItem(this.wallet.slvKey, JSON.stringify(this.wallet.slv));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeAaplWallet(): void {
    if (this.checkInputNumber(this.wallet.aapl)) {
      localStorage.setItem(this.wallet.aaplKey, JSON.stringify(this.wallet.aapl));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeGldWallet(): void {
    if (this.checkInputNumber(this.wallet.gld)) {
      localStorage.setItem(this.wallet.gldKey, JSON.stringify(this.wallet.gld));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeGmeWallet(): void {
    if (this.checkInputNumber(this.wallet.gme)) {
      localStorage.setItem(this.wallet.gmeKey, JSON.stringify(this.wallet.gme));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeGooglWallet(): void {
    if (this.checkInputNumber(this.wallet.googl)) {
      localStorage.setItem(this.wallet.googlKey, JSON.stringify(this.wallet.googl));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeArkkWallet(): void {
    if (this.checkInputNumber(this.wallet.arkk)) {
      localStorage.setItem(this.wallet.arkkKey, JSON.stringify(this.wallet.arkk));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeBabaWallet(): void {
    if (this.checkInputNumber(this.wallet.baba)) {
      localStorage.setItem(this.wallet.babaKey, JSON.stringify(this.wallet.baba));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeVnqWallet(): void {
    if (this.checkInputNumber(this.wallet.vnq)) {
      localStorage.setItem(this.wallet.vnqKey, JSON.stringify(this.wallet.vnq));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeUrthWallet(): void {
    if (this.checkInputNumber(this.wallet.urth)) {
      localStorage.setItem(this.wallet.urthKey, JSON.stringify(this.wallet.urth));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeTltWallet(): void {
    if (this.checkInputNumber(this.wallet.tlt)) {
      localStorage.setItem(this.wallet.tltKey, JSON.stringify(this.wallet.tlt));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangePdbcWallet(): void {
    if (this.checkInputNumber(this.wallet.pdbc)) {
      localStorage.setItem(this.wallet.pdbcKey, JSON.stringify(this.wallet.pdbc));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

  onChangeAmznWallet(): void {
    if (this.checkInputNumber(this.wallet.amzn)) {
      localStorage.setItem(this.wallet.amznKey, JSON.stringify(this.wallet.amzn));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeNvdaWallet(): void {
    if (this.checkInputNumber(this.wallet.nvda)) {
      localStorage.setItem(this.wallet.nvdaKey, JSON.stringify(this.wallet.nvda));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeCoinWallet(): void {
    if (this.checkInputNumber(this.wallet.coin)) {
      localStorage.setItem(this.wallet.coinKey, JSON.stringify(this.wallet.coin));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeEemWallet(): void {
    if (this.checkInputNumber(this.wallet.eem)) {
      localStorage.setItem(this.wallet.eemKey, JSON.stringify(this.wallet.eem));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeMsftWallet(): void {
    if (this.checkInputNumber(this.wallet.msft)) {
      localStorage.setItem(this.wallet.msftKey, JSON.stringify(this.wallet.msft));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeNflxWallet(): void {
    if (this.checkInputNumber(this.wallet.nflx)) {
      localStorage.setItem(this.wallet.nflxKey, JSON.stringify(this.wallet.nflx));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeFbWallet(): void {
    if (this.checkInputNumber(this.wallet.fb)) {
      localStorage.setItem(this.wallet.fbKey, JSON.stringify(this.wallet.fb));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

  onChangeVooWallet(): void {
    if (this.checkInputNumber(this.wallet.voo)) {
      localStorage.setItem(this.wallet.vooKey, JSON.stringify(this.wallet.voo));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

  onChangeDisWallet(): void {
    if (this.checkInputNumber(this.wallet.dis)) {
      localStorage.setItem(this.wallet.disKey, JSON.stringify(this.wallet.dis));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeMchiWallet(): void {
    if (this.checkInputNumber(this.wallet.mchi)) {
      localStorage.setItem(this.wallet.mchiKey, JSON.stringify(this.wallet.mchi));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeMstrWallet(): void {
    if (this.checkInputNumber(this.wallet.mstr)) {
      localStorage.setItem(this.wallet.mstrKey, JSON.stringify(this.wallet.mstr));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeIntcWallet(): void {
    if (this.checkInputNumber(this.wallet.intc)) {
      localStorage.setItem(this.wallet.intcKey, JSON.stringify(this.wallet.intc));
      this.buildDataForChart();
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }
  onChangeUsdAaplPool(): void {
    if (this.checkInputNumber(this.wallet.usdInAaplPool)) {
      localStorage.setItem(this.wallet.usdInAaplPoolKey, JSON.stringify(this.wallet.usdInAaplPool));
      this.berechnePoolOutAapl();
      this.berechnePoolOut();
      this.berechneAllOut();
      this.buildDataForChart();
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
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
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

  checkInputNumber(value: number): boolean {
    return value !== null && value >= 0;
  }


  copyValues(wallet: WalletDto): Wallet {
    const walletFinal = new Wallet();
    walletFinal.dfiInStaking = wallet.dfiInStaking;
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
      + stakingApr + normalMnApr + fiveFreezerMnApr + tenFreezerMnApr) / 100;

    return Math.round(average * 100) / 100;
  }

  getDfiForAverageAPR(): number {
    return this.getDfiCountInLM() * 2 + this.dfiInStaking + this.getDfiCountMn();
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
