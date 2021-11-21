import { Component, OnInit, ViewChild } from '@angular/core';
import { Dex } from '@services/dex.service';
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
  PoolPair,
  PoolUsdtOut,
  PoolUsdcOut,
  Stats, Rewards, PoolUsdOut, PoolTslaOut,
} from '@interfaces/Dex';
import { Wallet, WalletDto } from '@interfaces/Data';
import { environment } from '@environments/environment';
import { filter, forkJoin } from 'rxjs';
import { CountdownComponent } from 'ngx-countdown';
// @ts-ignore
import Timer = NodeJS.Timer;
import { TranslateService } from '@ngx-translate/core';
import { IncomeComponent } from '@components/income/income.component';
import { ValueComponent } from '@components/value/value.component';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo-v9';
import { Apollo } from 'apollo-angular';
import { LOGIN, REGISTER, UPDATE } from '@interfaces/Graphql';
import { DataService } from '@services/data.service';
import { StakingService } from '@services/staking.service';
import { Meta } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SupernodeAccount } from '@interfaces/Supernode';
import { firstValueFrom } from 'rxjs';
import { MamonAccountNode } from '@interfaces/Mamon';
import { OceanStats } from '@interfaces/Staking';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  @ViewChild('cd', { static: false })
  private countdown: CountdownComponent;

  @ViewChild(IncomeComponent)
  private incomeComponent: IncomeComponent;

  @ViewChild(ValueComponent)
  private valueComponent: ValueComponent;

  title = 'defichain-income';
  lang = 'en';
  env = environment;
  currentPage = 'info';
  currentPageKey = 'currentPageKey';

  wallet: Wallet;
  walletDTO: WalletDto;

  // fixed variables
  dfiProBlockBtc = 80;
  dfiProBlockEth = 15;
  dfiProBlockUsdt = 5;
  dfiProBlockUsdc = 1;
  dfiProBlockLtc = 2;
  dfiProBlockDoge = 0.1;
  dfiProBlockBch = 1;
  dfiProBlockUsd = 1;
  dfiProBlockTsla = 10;
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

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();
  poolAllOut: PoolAllOut = new PoolAllOut();
  poolMasternodeOut: MasternodeOutcome = new MasternodeOutcome();

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

  lastBlocksForCompute = 2000;
  lastBlocksForComputeKey = 'lastBlocksForComputeKey';

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

  constructor(private dexService: Dex, private translate: TranslateService, private apollo: Apollo,
              private matomoInjector: MatomoInjector, private matomoTracker: MatomoTracker, private dataService: DataService,
              private stakingService: StakingService, private meta: Meta, private spinner: NgxSpinnerService,
              private toastr: ToastrService, private router: Router, private route: ActivatedRoute) {
    translate.addLangs(['en', 'de', 'ru', 'es', 'fr']);
    translate.setDefaultLang('de');

    this.translate = translate;
    const browserLang = translate.getBrowserLang();
    this.lang = translate.getLangs().indexOf(browserLang) > -1 ? browserLang : 'en';
    translate.use(this.lang);

    // setze matomo URL
    this.matomoInjector.init(environment.matomoUrl, environment.matomoId);

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
      }

      this.loadData();

      this.toggleDarkMode();
      this.handlePageHeight();

      if (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        this.isDarkModeOn = true;
      }
    });

  }

  async loadData(): Promise<void> {

    this.spinner.show();

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
    this.loadStackingMasternode();

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

  handlePage(pageTag: string): void {
    this.currentPage = pageTag;
    this.menu = false;
    localStorage.setItem(this.currentPageKey, this.currentPage);
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
    if (localStorage.getItem(this.adressesKey) !== null) {
      this.adresses = JSON.parse(localStorage.getItem(this.adressesKey));
    }
    if (localStorage.getItem(this.adressesMasternodesKey) !== null) {
      this.adressesMasternodes = JSON.parse(localStorage.getItem(this.adressesMasternodesKey));
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
    // Staking special
    if (this.isLocalStorageNotEmpty(this.dfiInStakingKey)) {
      this.dfiInStaking = +localStorage.getItem(this.dfiInStakingKey);
    }
    if (this.isLocalStorageNotEmpty(this.stakingApyKey)) {
      this.stakingApy = JSON.parse(localStorage.getItem(this.stakingApyKey));
      this.stakingApyCake = this.stakingApy;
    }
    if (localStorage.getItem(this.currentPageKey) !== null) {
      this.currentPage = localStorage.getItem(this.currentPageKey);
    }
    if (localStorage.getItem(this.lastBlocksForComputeKey) !== null) {
      this.lastBlocksForCompute = +localStorage.getItem(this.lastBlocksForComputeKey);
    }
    if (localStorage.getItem('theme') !== null) {
      this.isDarkModeOn = localStorage.getItem('theme') === 'dark';
    }
    if (localStorage.getItem(this.cakeApyLoadAutoKey) !== null) {
      this.cakeApyLoadAuto = JSON.parse(localStorage.getItem(this.cakeApyLoadAutoKey));
    }
    if (localStorage.getItem(this.correlationDaysKey) !== null) {
      this.correlationDays = JSON.parse(localStorage.getItem(this.correlationDaysKey));
    }

  }

  async refresh(): Promise<void> {
    this.dataLoaded = false;
    await this.computeMeta();
    if (this.autoLoadData) {
      // only clear when not manual
      this.clearWallet();
      this.loadAllAccounts();
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
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        usdc: this.wallet.usdc,
        bch: this.wallet.bch,
        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        usdcdfi: this.wallet.usdcdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
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

  update(): void {
    this.apollo.mutate({
      mutation: UPDATE,
      variables: {
        key: this.loggedInAuth,
        addresses: this.adresses,
        addressesMasternodes: this.adressesMasternodes,
        adressesMasternodesFreezer5: this.adressesMasternodesFreezer5,
        adressesMasternodesFreezer10: this.adressesMasternodesFreezer10,
        dfiInStaking: this.dfiInStaking,
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        usdc: this.wallet.usdc,
        bch: this.wallet.bch,
        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        usdcdfi: this.wallet.usdcdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
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
      },
    }).subscribe((result: any) => {
      if (result?.data?.updateUser) {
        console.log('User Updated!');
        this.successBackend = 'User updated';
        setInterval(() => {
          this.successBackend = null;
        }, 5000);
      }
    }, (error) => {
      console.log('there was an error sending mutation register', error);
      this.errorBackend = error.message;
      setInterval(() => {
        this.errorBackend = null;
      }, 5000);
    });

  }

  logout(): void {
    this.loggedInAuth = '';
    this.loggedIn = false;
    localStorage.removeItem(this.loggedInKey);
    this.wallet = new Wallet();
    this.dfiInStaking = 0;
    this.adresses = [];
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
          this.loggedInAuth = this.authKeyOverUrl;
          this.loggedIn = true;

          this.parseWallet(result);
          this.parseAddresses(result);
          this.loadAddressesAndDexData();

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

      // if fixed blocktime to 30 s
      if (this.lastBlocksForCompute < 0) {
        this.blocktimeInS = 30;
        this.blocktimeInSSecond = 30;
        this.blocktimeFirstLastSecond = 30;
        return;
      }

      const promiseBlocks = await this.dexService.getLastBlocks(
        this.lastBlocksForCompute === -1 ? 2 : this.lastBlocksForCompute).toPromise();

      promiseBlocks.data.sort((a, b) => a.time - b.time);

      const diffS = new Array<number>();

      for (let i = 0; i < promiseBlocks.data.length - 2; i++) {
        const date = promiseBlocks.data[i].time;
        const date2 = promiseBlocks.data[i + 1].time;
        diffS.push(Math.abs(date - date2));
      }

      // avg first and last
      const diff = (promiseBlocks.data[promiseBlocks.data.length - 1].time
        - promiseBlocks.data[0].time);
      const avgFirstAndLast = Math.round(diff / promiseBlocks.data.length);

      // avg
      const sum = diffS.reduce((previous, current) => current += previous);
      const avg = Math.round(sum / diffS.length);

      // median
      diffS.sort((a, b) => a - b);
      const lowMiddle = Math.floor((diffS.length - 1) / 2);
      const highMiddle = Math.ceil((diffS.length - 1) / 2);
      const median = Math.round((diffS[lowMiddle] + diffS[highMiddle]) / 2);

      this.blocktimeInS = avg;
      this.blocktimeInSSecond = median;
      this.blocktimeFirstLastSecond = avgFirstAndLast;


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
    this.oceanStats = promiseStats;
  }

  loadDex(): void {
    forkJoin([
      this.dexService.getListyieldfarming(),
      this.dexService.getListpoolpairs()],
    ).subscribe((([dex, poolPairs]: [Array<Pool>, DexPoolPair]) => {
          this.parsePoolsAndComputeOutcome(dex, poolPairs);

        }
      ),
      err => {
        console.error('Fehler beim Load Dex Data wait: ' + JSON.stringify(err.message));
        setTimeout(() => {
            this.loadDex();
            console.error('Try again ...');
          },
          10000);

      });

  }

  private parsePoolsAndComputeOutcome(pools: Array<Pool> , poolPairs: DexPoolPair): void {
    this.extractPools(pools);

    // compute correct price of dfi
    this.priceDFICEX = this.poolBtc.priceB;
    this.poolBtc.priceB = this.poolBtc.priceA / (+this.poolBtc.reserveB / +this.poolBtc.reserveA);

    this.poolBtc.totalLiquidityLpToken = poolPairs['5'].totalLiquidity;
    this.poolBtc.customRewards = poolPairs['5'].customRewards;
    this.poolBtc.rewardPct = poolPairs['5'].rewardPct;
    this.poolBtc.totalLiquidityUsd = poolPairs['5'].totalLiquidityUsd;

    this.poolEth.totalLiquidityLpToken = poolPairs['4'].totalLiquidity;
    this.poolEth.customRewards = poolPairs['4'].customRewards;
    this.poolEth.rewardPct = poolPairs['4'].rewardPct;
    this.poolEth.totalLiquidityUsd = poolPairs['4'].totalLiquidityUsd;

    this.poolUsdt.totalLiquidityLpToken = poolPairs['6'].totalLiquidity;
    this.poolUsdt.customRewards = poolPairs['6'].customRewards;
    this.poolUsdt.rewardPct = poolPairs['6'].rewardPct;
    this.poolUsdt.totalLiquidityUsd = poolPairs['6'].totalLiquidityUsd;

    this.poolUsdc.totalLiquidityLpToken = poolPairs['14'].totalLiquidity;
    this.poolUsdc.customRewards = poolPairs['14'].customRewards;
    this.poolUsdc.rewardPct = poolPairs['14'].rewardPct;
    this.poolUsdc.totalLiquidityUsd = poolPairs['14'].totalLiquidityUsd;

    this.poolLtc.totalLiquidityLpToken = poolPairs['10'].totalLiquidity;
    this.poolLtc.customRewards = poolPairs['10'].customRewards;
    this.poolLtc.rewardPct = poolPairs['10'].rewardPct;
    this.poolLtc.totalLiquidityUsd = poolPairs['10'].totalLiquidityUsd;

    this.poolDoge.totalLiquidityLpToken = poolPairs['8'].totalLiquidity;
    this.poolDoge.customRewards = poolPairs['8'].customRewards;
    this.poolDoge.rewardPct = poolPairs['8'].rewardPct;
    this.poolDoge.totalLiquidityUsd = poolPairs['8'].totalLiquidityUsd;

    this.poolBch.totalLiquidityLpToken = poolPairs['12'].totalLiquidity;
    this.poolBch.customRewards = poolPairs['12'].customRewards;
    this.poolBch.rewardPct = poolPairs['12'].rewardPct;
    this.poolBch.totalLiquidityUsd = poolPairs['12'].totalLiquidityUsd;

    this.poolUsd.totalLiquidityLpToken = poolPairs['17'].totalLiquidity;
    this.poolUsd.customRewards = poolPairs['17'].customRewards;
    this.poolUsd.rewardPct = poolPairs['17'].rewardPct;
    this.poolUsd.totalLiquidityUsd = poolPairs['17'].totalLiquidityUsd;

    this.poolTsla.totalLiquidityLpToken = poolPairs['18'].totalLiquidity;
    this.poolTsla.customRewards = poolPairs['18'].customRewards;
    this.poolTsla.rewardPct = poolPairs['18'].rewardPct;
    this.poolTsla.totalLiquidityUsd = poolPairs['18'].totalLiquidityUsd;


    this.computeRewardsPerBlockInPools();

    this.berechnePoolOutBtc();
    this.berechnePoolOutEth();
    this.berechnePoolOutBch();
    this.berechnePoolOutLtc();
    this.berechnePoolOutUsdt();
    this.berechnePoolOutUsdc();
    this.berechnePoolOutDoge();
    this.berechnePoolOutUsd();
    this.berechnePoolOutTsla();

    this.berechneStakingOut();
    this.berechneMNOut();
    this.berechnePoolOut();
    this.berechneAllOut();
    this.dataService.setBtcUsd(this.poolBtc.priceA);
    this.dataService.setEthUsd(this.poolEth.priceA);
    this.dataService.setDfiUsd(this.poolBtc.priceB);
    this.dataLoaded = true;
    this.avgApr = this.getAPRAverage();
    this.spinner.hide();
  }

  private extractPools(pools: Array<Pool>): void {
    this.pools = pools;
    this.poolBtc = pools.find(x => x.poolPairId === '5');
    this.poolEth = pools.find(x => x.poolPairId === '4');
    this.poolUsdt = pools.find(x => x.poolPairId === '6');
    this.poolUsdc = pools.find(x => x.poolPairId === '14');
    this.poolLtc = pools.find(x => x.poolPairId === '10');
    this.poolDoge = pools.find(x => x.poolPairId === '8');
    this.poolBch = pools.find(x => x.poolPairId === '12');
    this.poolUsd = pools.find(x => x.poolPairId === '17');
    this.poolTsla = pools.find(x => x.poolPairId === '18');
  }

  private computeRewardsPerBlockInPools(): void {

    this.dfiProBlockBtc = this.poolBtc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockBtc += this.getCustomRewards(this.poolBtc.customRewards);

    this.dfiProBlockEth = this.poolEth.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockEth += this.getCustomRewards(this.poolEth.customRewards);

    this.dfiProBlockLtc = this.poolLtc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockLtc += this.getCustomRewards(this.poolLtc.customRewards);

    this.dfiProBlockUsdt = this.poolUsdt.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockUsdt += this.getCustomRewards(this.poolUsdt.customRewards);

    this.dfiProBlockUsdc = this.poolUsdc.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockUsdc += this.getCustomRewards(this.poolUsdc.customRewards);

    this.dfiProBlockDoge = this.poolDoge.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockDoge += this.getCustomRewards(this.poolDoge.customRewards);

    this.dfiProBlockBch = this.poolBch.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockBch += this.getCustomRewards(this.poolBch.customRewards);

    this.dfiProBlockUsd = this.poolUsd.rewardPct * this.rewards?.rewards?.liquidity;
    this.dfiProBlockUsd += this.getCustomRewards(this.poolUsd.customRewards);

  }

  private getCustomRewards(rewards: string []): number {
    let reward = 0;

    if (rewards === undefined || rewards === null) {
      return reward;
    }

    rewards.forEach(r => {
      reward += +r.split('@') [0];
    });

    return reward;
  }

  loadDexManual(): void {
    forkJoin([
      this.dexService.getListyieldfarming(),
      this.dexService.getListpoolpairs()],
    ).subscribe((([dex, poolPairs]: [Array<Pool>, DexPoolPair]) => {
          this.parsePoolsAndComputeOutcome(dex, poolPairs);
        }
      ),
      err => {
        console.error(err);
        setTimeout(() => {
            this.loadDexManual();
            console.error('Try again ...');
          },
          5000);
      });
  }

  loadAllAccounts(): void {
    this.adressBalances = new Array<AddressBalance>();
    const requestArray = [];

    // normal adresses
    for (const ad of this.adresses) {
      requestArray.push(this.dataService.getAdressAccount(ad));
    }

    // minter adresses
    for (const adM of this.adressesMasternodes) {
      requestArray.push(this.dataService.getAdressAccount(adM));
    }

    // if adresses exist
    if (requestArray.length > 0) {
      forkJoin(requestArray).subscribe(results => {
          results.forEach((value, i) => {
            // minter address
            if (i > this.adresses?.length - 1) {
              const adress = this.getMasternodeAddressForIteration(i);
              this.addCoinsAndTokensToWallet(value as Array<SupernodeAccount>, adress, true, this.isFrozen5(adress),
                this.isFrozen10(adress));
            } else {
              this.addCoinsAndTokensToWallet(value as Array<SupernodeAccount>, this.getAddressForIteration(i), false,
                false, false);
            }
          });

          this.loadDex();
          this.loadStackingMasternode();

        },
        err => {
          console.error('Fehler beim Load Accounts: ' + JSON.stringify(err.message));
          setTimeout(() => {
              this.loadDex();
              console.error('Try again ...');
            },
            5000);

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
        console.error(err);
        setTimeout(() => {
            this.loadStackingCake();
            console.error('Try again loadStackingCake ...');
          },
          60000);
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
        console.error(err);
        setTimeout(() => {
            this.loadStackingCake();
            console.error('Try again loadStackingMasternode ...');
          },
          600000);
      });
  }

  getAddressForIteration(i: number): string {
    return this.adresses[i];
  }

  getMasternodeAddressForIteration(i: number): string {
    return this.adressesMasternodes[i - this.adresses?.length];
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
            this.wallet.dfi += +splitted[0] * 0.00000001;
          } else {
            this.wallet.dfiInMasternodes += +splitted[0] * 0.00000001;
          }
          this.getAddressBalance(address).dfiCoins = +splitted[0] * 0.00000001;
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
    if (poolName === 'USD') {
      if (this.autoLoadData) {
        this.anteilAmPoolUsd = this.berechneAnteilAmPool(this.wallet.usddfi, pool, outcome, dfiProBlock);
        this.wallet.usdInUsdPool = this.anteilAmPoolUsd * +pool.reserveA / 100;
        this.wallet.dfiInUsdPool = this.anteilAmPoolUsd * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolUsd =
          this.berechneAnteilAmPoolManuel(this.wallet.usdInUsdPool, this.wallet.dfiInUsdPool, pool, outcome, dfiProBlock);
      }

    }

    if (poolName === 'TSLA') {
      if (this.autoLoadData) {
        this.anteilAmPoolTsla = this.berechneAnteilAmPool(this.wallet.tsladfi, pool, outcome, dfiProBlock);
        this.wallet.tslaInTslaPool = this.anteilAmPoolTsla * +pool.reserveA / 100;
        this.wallet.usdInTslaPool = this.anteilAmPoolTsla * +pool.reserveB / 100;
      } else {
        this.anteilAmPoolTsla =
          this.berechneAnteilAmPoolManuel(this.wallet.tslaInTslaPool, this.wallet.usdInTslaPool, pool, outcome, dfiProBlock);
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

  getPoolPairFromShare(share: number, pool: Pool): PoolPair {
    const pair = new PoolPair();
    pair.dfi = +pool.reserveB * share / 100;
    pair.poolPairToken = +pool.reserveA * share / 100;

    return pair;
  }

  berechnePoolOut(): void {
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMin + this.poolEthOut.dfiPerMin
      + this.poolUsdtOut.dfiPerMin + this.poolUsdcOut.dfiPerMin + this.poolLtcOut.dfiPerMin
      + this.poolDogeOut.dfiPerMin + this.poolBchOut.dfiPerMin;
    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolUsdcOut.dfiPerHour + this.poolLtcOut.dfiPerHour
      + this.poolDogeOut.dfiPerHour + this.poolBchOut.dfiPerHour;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolUsdcOut.dfiPerDay + this.poolLtcOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolUsdcOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek
      + this.poolDogeOut.dfiPerWeek + this.poolBchOut.dfiPerWeek;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolUsdcOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth
      + this.poolDogeOut.dfiPerMonth + this.poolBchOut.dfiPerMonth;
    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolUsdcOut.dfiPerYear + this.poolLtcOut.dfiPerYear
      + this.poolDogeOut.dfiPerYear + this.poolBchOut.dfiPerYear;
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
    // WALLET
    if (this.isLocalStorageNotEmpty(this.wallet.dfiKey)) {
      this.wallet.dfi = +localStorage.getItem(this.wallet.dfiKey);
    } else {
      this.wallet.dfi = 0;
    }

  }

  onChangeDfiStaking(): void {
    localStorage.setItem(this.dfiInStakingKey, JSON.stringify(this.dfiInStaking));
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

  onChangeDetails(newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
    this.matomoTracker.trackEvent('Klick', 'Change Details', newValue);
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

  getFreezerDfiUsd(): number {
    return this.getFreezerDfiCount() * this.poolBtc?.priceB;
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd();
  }

  getBtcValueUsd(): number {
    return (this.wallet?.btcInBtcPool + this.wallet?.btc) * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet?.ethInEthPool + this.wallet?.eth) * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.wallet?.usdtInUsdtPool + this.wallet?.usdt) * this.poolUsdt?.priceA;
  }

  /*
   * USDC Price from usdt pool because not in usdc pool
   */
  getUsdcValueUsd(): number {
    return (this.wallet?.usdcInUsdcPool + this.wallet?.usdc) * this.poolUsdc?.priceA;
  }


  getLtcValueUsd(): number {
    return (this.wallet?.ltcInLtcPool + this.wallet?.ltc) * this.poolLtc?.priceA;
  }

  getDogeValueUsd(): number {
    return (this.wallet?.dogeInDogePool + this.wallet?.doge) * this.poolDoge?.priceA;
  }

  getBchValueUsd(): number {
    return (this.wallet?.bchInBchPool + this.wallet?.bch) * this.poolBch?.priceA;
  }

  getDfiCount(): number {
    return this.wallet?.dfi + this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool
      + this.wallet?.dfiInUsdcPool + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool
      + this.wallet?.dfiInBchPool + this.dfiInStaking + this.wallet?.dfiInMasternodes;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
        + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }


  getAnteilLMOfUsdtPoolValue(): number {
    return ((this.wallet.dfiInUsdtPool * this.poolUsdt?.priceB) + (this.wallet.usdtInUsdtPool * this.poolUsdt?.priceA));
  }

  getAnteilLMOfUsdcPoolValue(): number {
    return ((this.wallet.dfiInUsdcPool * this.poolUsdc?.priceB) + (this.wallet.usdcInUsdcPool * this.poolUsdc?.priceA));
  }

  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolDoge?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool;
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getDfiIncomePerDay(): number {
    return this.stakingOut.dfiPerDay + this.poolOut.dfiPerDay;
  }

  getAllPoolDfIncome(): number {
    return this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolUsdtOut.dfiPerDay
      + this.poolUsdcOut.dfiPerDay + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay;
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

  allAddresses(): string [] {
    return [...this.adressesMasternodes, ...this.adresses];
  }

  async importMamon(): Promise<void> {
    await this.loadMamon();

    this.clearWallet();
    this.loadAddressesAndDexData();
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
      /** spinner ends after 5 seconds */
      this.showDialogAddressesAdded = false;
    }, 5000);

    localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
    localStorage.setItem(this.adressesMasternodesKey, JSON.stringify(this.adressesMasternodes));
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
      localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
    }

    if (indexMn > -1) {
      this.adressesMasternodes.splice(indexMn, 1);
      localStorage.setItem(this.adressesMasternodesKey, JSON.stringify(this.adressesMasternodes));
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

  }

  clearWallet(): void {
    const newWallet = new Wallet();
    newWallet.dfiInStaking = this.dfiInStaking;
    this.wallet = newWallet;
  }

  // ============= ONCHANGE INPUT =================
  onChangeDfiWallet(): void {
    if (this.checkInputNumber(this.wallet.dfi)) {
      localStorage.setItem(this.wallet.dfiKey, JSON.stringify(this.wallet.dfi));
      this.buildDataForChart();
      this.buildDataForChartValue();
      this.buildDataForChartIncome();
    }
  }

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

  onChangeBtcWallet(): void {
    if (this.checkInputNumber(this.wallet.btc)) {
      localStorage.setItem(this.wallet.btcKey, JSON.stringify(this.wallet.btc));
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

  onChangeEthWallet(): void {
    if (this.checkInputNumber(this.wallet.eth)) {
      localStorage.setItem(this.wallet.ethKey, JSON.stringify(this.wallet.eth));
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

  onChangeLtcWallet(): void {
    if (this.checkInputNumber(this.wallet.ltc)) {
      localStorage.setItem(this.wallet.ltcKey, JSON.stringify(this.wallet.ltc));
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

  onChangeDogeWallet(): void {
    if (this.checkInputNumber(this.wallet.doge)) {
      localStorage.setItem(this.wallet.dogeKey, JSON.stringify(this.wallet.doge));
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

  onChangeBchWallet(): void {
    if (this.checkInputNumber(this.wallet.bch)) {
      localStorage.setItem(this.wallet.bchKey, JSON.stringify(this.wallet.bch));
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

    walletFinal.btc = wallet.btc;
    walletFinal.eth = wallet.eth;
    walletFinal.ltc = wallet.ltc;
    walletFinal.doge = wallet.doge;
    walletFinal.usdt = wallet.usdt;
    walletFinal.usdc = wallet.usdc;
    walletFinal.bch = wallet.bch;

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
  }

  toggleAutoCake(): void {

    localStorage.setItem(this.cakeApyLoadAutoKey, String(this.cakeApyLoadAuto));
  }

  onChangeLastBlocksForCalc(value: number): void {
    this.lastBlocksForCompute = +value;
    localStorage.setItem(this.lastBlocksForComputeKey, String(value));
    this.refresh();
  }

  onChangeCorrelationForCalc(value: number): void {
    this.correlationDays = +value;
    localStorage.setItem(this.correlationDaysKey, String(value));
  }

  getAPRAverage(): number {

    const dfiInAll = this.getDfiForAverageAPR();

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
    const stakingPart = this.stakingOut?.dfiPerYear / allIncome * 100;


    // Calculate weighted apr
    const btcApr = dfiBtcPart * this.poolBtc?.apy;
    const ethApr = dfiEthPart * this.poolEth?.apy;
    const usdcApr = dfiUsdcPart * this.poolUsdc?.apy;
    const bchApr = dfiBchPart * this.poolBch?.apy;
    const dogeApr = dfiDogePart * this.poolDoge?.apy;
    const usdtApr = dfiUsdtPart * this.poolUsdt?.apy;
    const ltcApr = dfiLtcPart * this.poolLtc?.apy;
    const stakingApr = stakingPart * this.stakingApyMN * 0.85;
    const normalMnApr = rewardNormaleMnPart * this.stakingApyMN;
    const fiveFreezerMnApr = reward5MnPart * this.stakingApyMN * 1.5;
    const tenFreezerMnApr = reward10MnPart * this.stakingApyMN * 2;

    // compute average
    const average = (btcApr + ethApr + usdcApr + bchApr + dogeApr + usdtApr + ltcApr + stakingApr + normalMnApr + fiveFreezerMnApr
      + tenFreezerMnApr) / 100;

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

  handlePageHeight(): void {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
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

  toggleIncognitoMode(): void {
    this.isIncognitoModeOn = !this.isIncognitoModeOn;
  }
}
