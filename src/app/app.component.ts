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
  PoolGmeOut, PoolGooglOut, PoolArkkOut, PoolBabaOut, PoolVnqOut, PoolUrthOut, PoolTltOut, PoolPdbcOut, Prices,
} from '@interfaces/Dex';
import { AddressVaults, IncomePoolDto, Vault, Wallet, WalletDto } from '@interfaces/Data'
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

  cryptoPools: Array<Pool>;
  stocksPools: Array<Pool>;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();
  poolAllOut: PoolAllOut = new PoolAllOut();
  poolMasternodeOut: MasternodeOutcome = new MasternodeOutcome();

  poolForIncome: Array<IncomePoolDto>;

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
              private toastr: ToastrService, private router: Router) {
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
        usdInPdbcPool : this.wallet.usdInPdbcPool

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
        usdInPdbcPool : this.wallet.usdInPdbcPool

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

    this.setFromPoolPair(this.poolBtc, poolPairs);
    this.setFromPoolPair(this.poolEth, poolPairs);
    this.setFromPoolPair(this.poolUsdc, poolPairs);
    this.setFromPoolPair(this.poolUsdt, poolPairs);
    this.setFromPoolPair(this.poolLtc, poolPairs);
    this.setFromPoolPair(this.poolDoge, poolPairs);
    this.setFromPoolPair(this.poolBch, poolPairs);

    this.createCryptoPoolsArray();

    if (this.poolUsd) {
      this.setFromPoolPair(this.poolUsd, poolPairs);
    }
    if (this.poolTsla) {
      this.setFromPoolPair(this.poolTsla, poolPairs);
    }
    if (this.poolQqq) {
      this.setFromPoolPair(this.poolQqq, poolPairs);
    }
    if (this.poolSpy) {
      this.setFromPoolPair(this.poolSpy, poolPairs);
    }
    if (this.poolPltr) {
      this.setFromPoolPair(this.poolPltr, poolPairs);
    }
    if (this.poolSlv) {
      this.setFromPoolPair(this.poolSlv, poolPairs);
    }
    if (this.poolAapl) {
      this.setFromPoolPair(this.poolAapl, poolPairs);
    }
    if (this.poolGld) {
      this.setFromPoolPair(this.poolGld, poolPairs);
    }
    if (this.poolGme) {
      this.setFromPoolPair(this.poolGme, poolPairs);
    }
    if (this.poolGoogl) {
      this.setFromPoolPair(this.poolGoogl, poolPairs);
    }
    if (this.poolArkk) {
      this.setFromPoolPair(this.poolArkk, poolPairs);
    }
    if (this.poolBaba) {
      this.setFromPoolPair(this.poolBaba, poolPairs);
    }
    if (this.poolVnq) {
      this.setFromPoolPair(this.poolVnq, poolPairs);
    }
    if (this.poolUrth) {
      this.setFromPoolPair(this.poolUrth, poolPairs);
    }
    if (this.poolTlt) {
      this.setFromPoolPair(this.poolTlt, poolPairs);
    }
    if (this.poolPdbc) {
      this.setFromPoolPair(this.poolPdbc, poolPairs);
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

  private setFromPoolPair(pool: Pool, poolPairs: DexPoolPair): void {
    pool.totalLiquidityLpToken = poolPairs[pool.id].totalLiquidity;
    const splitted = poolPairs[pool.id].symbol.split('-');
    pool.tokenASymbol = splitted[0];
    pool.tokenBSymbol = splitted[1];
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

    // STOCKS
    this.dfiProBlockUsd = 0.5 * this.dfiPorBlockStock;
    this.dfiProBlockUsd += this.getCustomRewards(this.poolUsd?.customRewards);

    this.dfiProBlockTsla = 0.1098 * this.dfiPorBlockStock;
    this.dfiProBlockTsla += this.getCustomRewards(this.poolTsla?.customRewards);

    this.dfiProBlockQqq = 0.0479 * this.dfiPorBlockStock;
    this.dfiProBlockQqq += this.getCustomRewards(this.poolQqq?.customRewards);

    this.dfiProBlockSpy = 0.0786 * this.dfiPorBlockStock;
    this.dfiProBlockSpy += this.getCustomRewards(this.poolSpy?.customRewards);

    this.dfiProBlockAapl = 0.0378 * this.dfiPorBlockStock;
    this.dfiProBlockAapl += this.getCustomRewards(this.poolAapl?.customRewards);

    this.dfiProBlockPltr = 0.0263 * this.dfiPorBlockStock;
    this.dfiProBlockPltr += this.getCustomRewards(this.poolPltr?.customRewards);

    this.dfiProBlockSlv = 0.0166 * this.dfiPorBlockStock;
    this.dfiProBlockSlv += this.getCustomRewards(this.poolSlv?.customRewards);

    this.dfiProBlockGld = 0.0108 * this.dfiPorBlockStock;
    this.dfiProBlockGld += this.getCustomRewards(this.poolGld?.customRewards);

    this.dfiProBlockGme = 0.0499 * this.dfiPorBlockStock;
    this.dfiProBlockGme += this.getCustomRewards(this.poolGme?.customRewards);

    this.dfiProBlockGoogle = 0.0239 * this.dfiPorBlockStock;
    this.dfiProBlockGoogle += this.getCustomRewards(this.poolGoogl?.customRewards);

    this.dfiProBlockArkk = 0.0222 * this.dfiPorBlockStock;
    this.dfiProBlockArkk += this.getCustomRewards(this.poolArkk?.customRewards);

    this.dfiProBlockBaba = 0.0355 * this.dfiPorBlockStock;
    this.dfiProBlockBaba += this.getCustomRewards(this.poolBaba?.customRewards);

    this.dfiProBlockVnq = 0.0096 * this.dfiPorBlockStock;
    this.dfiProBlockVnq += this.getCustomRewards(this.poolVnq?.customRewards);

    this.dfiProBlockUrth = 0.008 * this.dfiPorBlockStock;
    this.dfiProBlockUrth += this.getCustomRewards(this.poolUrth?.customRewards);

    this.dfiProBlockTlt = 0.0144 * this.dfiPorBlockStock;
    this.dfiProBlockTlt += this.getCustomRewards(this.poolTlt?.customRewards);

    this.dfiProBlockPdbc = 0.0107 * this.dfiPorBlockStock;
    this.dfiProBlockPdbc += this.getCustomRewards(this.poolPdbc?.customRewards);
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

  getVaultAddressForIteration(i: number): string {
    return this.adresses[i - this.adresses?.length];
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

  getPoolPairFromShare(share: number, pool: Pool): PoolPair {
    const pair = new PoolPair();
    pair.dfiOrUsdToken = +pool.reserveB * share / 100;
    pair.poolPairToken = +pool.reserveA * share / 100;

    return pair;
  }

  berechnePoolOut(): void {
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMin + this.poolEthOut.dfiPerMin
      + this.poolUsdtOut.dfiPerMin + this.poolUsdcOut.dfiPerMin + this.poolLtcOut.dfiPerMin
      + this.poolDogeOut.dfiPerMin + this.poolBchOut.dfiPerMin + this.poolUsdOut?.dfiPerMin + this.poolTslaOut?.dfiPerMin
      + this.poolSpyOut?.dfiPerMin + this.poolQqqOut?.dfiPerMin + this.poolPltrOut?.dfiPerMin + this.poolSlvOut?.dfiPerMin
      + this.poolAaplOut?.dfiPerMin + this.poolGldOut?.dfiPerMin + this.poolGmeOut?.dfiPerMin + this.poolGooglOut?.dfiPerMin
      + this.poolArkkOut?.dfiPerMin + this.poolBabaOut?.dfiPerMin + this.poolVnqOut?.dfiPerMin + this.poolUrthOut?.dfiPerMin
      + this.poolTltOut?.dfiPerMin + this.poolPdbcOut?.dfiPerMin;

    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolUsdcOut.dfiPerHour + this.poolLtcOut.dfiPerHour
      + this.poolDogeOut.dfiPerHour + this.poolBchOut.dfiPerHour + this.poolUsdOut.dfiPerHour + this.poolTslaOut.dfiPerHour
      + this.poolSpyOut?.dfiPerHour + this.poolQqqOut?.dfiPerHour + this.poolPltrOut?.dfiPerHour + this.poolSlvOut?.dfiPerHour
      + this.poolAaplOut?.dfiPerHour + this.poolGldOut?.dfiPerHour + this.poolGmeOut?.dfiPerHour + this.poolGooglOut?.dfiPerHour
      + this.poolArkkOut?.dfiPerHour + this.poolBabaOut?.dfiPerHour + this.poolVnqOut?.dfiPerHour + this.poolUrthOut?.dfiPerHour
      + this.poolTltOut?.dfiPerHour + this.poolPdbcOut?.dfiPerHour;

    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolUsdcOut.dfiPerDay + this.poolLtcOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay + this.poolUsdOut.dfiPerDay + this.poolTslaOut.dfiPerDay
      + this.poolSpyOut?.dfiPerDay + this.poolQqqOut?.dfiPerDay + this.poolPltrOut?.dfiPerDay + this.poolSlvOut?.dfiPerDay
      + this.poolAaplOut?.dfiPerDay + this.poolGldOut?.dfiPerDay + this.poolGmeOut?.dfiPerDay + this.poolGooglOut?.dfiPerDay
      + this.poolArkkOut?.dfiPerDay + this.poolBabaOut?.dfiPerDay + this.poolVnqOut?.dfiPerDay + this.poolUrthOut?.dfiPerDay
      + this.poolTltOut?.dfiPerDay + this.poolPdbcOut?.dfiPerDay;

    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolUsdcOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek
      + this.poolDogeOut.dfiPerWeek + this.poolBchOut.dfiPerWeek + this.poolUsdOut.dfiPerWeek + this.poolTslaOut.dfiPerWeek
      + this.poolSpyOut?.dfiPerWeek + this.poolQqqOut?.dfiPerWeek + this.poolPltrOut?.dfiPerWeek + this.poolSlvOut?.dfiPerWeek
      + this.poolAaplOut?.dfiPerWeek + this.poolGldOut?.dfiPerWeek + this.poolGmeOut?.dfiPerWeek + this.poolGooglOut?.dfiPerWeek
      + this.poolArkkOut?.dfiPerWeek + this.poolBabaOut?.dfiPerWeek + this.poolVnqOut?.dfiPerWeek + this.poolUrthOut?.dfiPerWeek
      + this.poolTltOut?.dfiPerWeek + this.poolPdbcOut?.dfiPerWeek;

    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolUsdcOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth
      + this.poolDogeOut.dfiPerMonth + this.poolBchOut.dfiPerMonth + this.poolUsdOut.dfiPerMonth + this.poolTslaOut.dfiPerMonth
      + this.poolSpyOut?.dfiPerMonth + this.poolQqqOut?.dfiPerMonth + this.poolPltrOut?.dfiPerMonth + this.poolSlvOut?.dfiPerMonth
      + this.poolAaplOut?.dfiPerMonth + this.poolGldOut?.dfiPerMonth + this.poolGmeOut?.dfiPerMonth + this.poolGooglOut?.dfiPerMonth
      + this.poolArkkOut?.dfiPerMonth + this.poolBabaOut?.dfiPerMonth + this.poolVnqOut?.dfiPerMonth + this.poolUrthOut?.dfiPerMonth
      + this.poolTltOut?.dfiPerMonth + this.poolPdbcOut?.dfiPerMonth;

    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolUsdcOut.dfiPerYear + this.poolLtcOut.dfiPerYear
      + this.poolDogeOut.dfiPerYear + this.poolBchOut.dfiPerYear + this.poolUsdOut.dfiPerYear + this.poolTslaOut.dfiPerYear
      + this.poolSpyOut?.dfiPerYear + this.poolQqqOut?.dfiPerYear + this.poolPltrOut?.dfiPerYear + this.poolSlvOut?.dfiPerYear
      + this.poolAaplOut?.dfiPerYear + this.poolGldOut?.dfiPerYear + this.poolGmeOut?.dfiPerYear + this.poolGooglOut?.dfiPerYear
      + this.poolArkkOut?.dfiPerYear + this.poolBabaOut?.dfiPerYear + this.poolVnqOut?.dfiPerYear + this.poolUrthOut?.dfiPerYear
      + this.poolTltOut?.dfiPerYear + this.poolPdbcOut?.dfiPerYear;
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

  getAllValuesUsdPrice(): number {

    // All Crypo and Stock values
    const allCryptoAndStocks = this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd()
      + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd() + this.getTslaValueUsd() + this.getUsdValueUsd()
      + this.getSpyValueUsd() + this.getQqqValueUsd() + this.getPltrValueUsd() + this.getSlvValueUsd() + this.getAaplValueUsd()
      + this.getGldValueUsd() + this.getGmeValueUsd() + this.getGooglValueUsd() + this.getArkkValueUsd() + this.getBabaValueUsd()
      + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd() + this.getPdbcValueUsd();
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
    let pdbc = 0;

    vault.loanAmounts.forEach(loan => {
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
      }
    });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc;
  }

  getVaultsValueUsd(): number {

    let dfiInVaults = 0;
    let btcInVaults = 0;
    let usdcInVaults = 0;
    let usdtInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault.collateralAmounts.forEach(vaultCollaterral => {
          if ('DFI' === vaultCollaterral.symbolKey) {
            dfiInVaults += +vaultCollaterral.amount;
          } else if ('BTC' === vaultCollaterral.symbolKey) {
            btcInVaults += +vaultCollaterral.amount;
          } else if ('USDC' === vaultCollaterral.symbolKey) {
            usdcInVaults += +vaultCollaterral.amount;
          } else if ('USDT' === vaultCollaterral.symbolKey) {
            usdtInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults * this.poolBtc?.priceB + btcInVaults * this.poolBtc?.priceA + usdcInVaults + usdtInVaults;

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

  getMasternodeDfiUsd(): number {
    return (this.wallet?.dfiInMasternodes) * this.poolBtc?.priceB;
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

  getUsdValueUsd(): number {
    return (this.wallet?.usdInUsdPool + this.wallet?.usd + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
        + this.wallet?.usdInQqqPool + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
        + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
        + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
        + this.wallet?.usdInPdbcPool) * this.getUsdPriceOfStockPools(this.poolUsd);
  }
  getTslaValueUsd(): number {
    return (this.wallet?.tslaInTslaPool + this.wallet?.tsla) * this.getUsdPriceOfStockPools(this.poolTsla);
  }
  getSpyValueUsd(): number {
    return (this.wallet?.spyInSpyPool + this.wallet?.spy) * this.getUsdPriceOfStockPools(this.poolSpy);
  }
  getQqqValueUsd(): number {
    return (this.wallet?.qqqInQqqPool + this.wallet?.qqq) * this.getUsdPriceOfStockPools(this.poolQqq);
  }
  getPltrValueUsd(): number {
    return (this.wallet?.pltrInPltrPool + this.wallet?.pltr) * this.getUsdPriceOfStockPools(this.poolPltr);
  }
  getSlvValueUsd(): number {
    return (this.wallet?.slvInSlvPool + this.wallet?.slv) * this.getUsdPriceOfStockPools(this.poolSlv);
  }
  getAaplValueUsd(): number {
    return (this.wallet?.aaplInAaplPool + this.wallet?.aapl) * this.getUsdPriceOfStockPools(this.poolAapl);
  }
  getGldValueUsd(): number {
    return (this.wallet?.gldInGldPool + this.wallet?.gld) * this.getUsdPriceOfStockPools(this.poolGld);
  }
  getGmeValueUsd(): number {
    return (this.wallet?.gmeInGmePool + this.wallet?.gme) * this.getUsdPriceOfStockPools(this.poolGme);
  }
  getGooglValueUsd(): number {
    return (this.wallet?.googlInGooglPool + this.wallet?.googl) * this.getUsdPriceOfStockPools(this.poolGoogl);
  }
  getArkkValueUsd(): number {
    return (this.wallet?.arkkInArkkPool + this.wallet?.arkk) * this.getUsdPriceOfStockPools(this.poolArkk);
  }
  getBabaValueUsd(): number {
    return (this.wallet?.babaInBabaPool + this.wallet?.baba) * this.getUsdPriceOfStockPools(this.poolBaba);
  }
  getVnqValueUsd(): number {
    return (this.wallet?.vnqInVnqPool + this.wallet?.vnq) * this.getUsdPriceOfStockPools(this.poolVnq);
  }
  getUrthValueUsd(): number {
    return (this.wallet?.urthInUrthPool + this.wallet?.urth) * this.getUsdPriceOfStockPools(this.poolUrth);
  }
  getTltValueUsd(): number {
    return (this.wallet?.tltInTltPool + this.wallet?.tlt) * this.getUsdPriceOfStockPools(this.poolTlt);
  }
  getPdbcValueUsd(): number {
    return (this.wallet?.pdbcInPdbcPool + this.wallet?.pdbc) * this.getUsdPriceOfStockPools(this.poolPdbc);
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
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet?.dfiInUsdPool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd()
      + this.getUsdValueUsd() + this.getTslaValueUsd() + this.getSpyValueUsd() + this.getQqqValueUsd()
      + this.getPltrValueUsd() + this.getSlvValueUsd() + this.getAaplValueUsd() + this.getGldValueUsd()
      + this.getGmeValueUsd() + this.getGooglValueUsd() + this.getArkkValueUsd() + this.getBabaValueUsd()
      + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd() + this.getPdbcValueUsd();
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getDfiCountInLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInUsdPool;
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
      + this.poolUrthOut.dfiPerDay + this.poolTltOut.dfiPerDay + this.poolPdbcOut.dfiPerDay;
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

    const stakingApr = stakingPart * this.stakingApyMN * 0.85;
    const normalMnApr = rewardNormaleMnPart * this.stakingApyMN;
    const fiveFreezerMnApr = reward5MnPart * this.stakingApyMN * 1.5;
    const tenFreezerMnApr = reward10MnPart * this.stakingApyMN * 2;

    // compute average
    const average = (btcApr + ethApr + usdcApr + bchApr + dogeApr + usdtApr
      + ltcApr + usdApr + tslaApr + spyApr + qqqApr + pltrApr + slvApr
      + aaplApr + gldApr + gmeApr + googlApr + arkkApr + babaApr + vnqApr
      + urthApr + tltApr + pdbcApr + stakingApr + normalMnApr + fiveFreezerMnApr
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
}
