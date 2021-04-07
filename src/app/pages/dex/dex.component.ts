import {Component, OnInit, ViewChild} from '@angular/core';
import {Dex} from '@services/dex.service';
import {
  DexInfo, DexPoolPair, Outcome, OutcomeStaking, Pool, PoolBchOut, PoolBtcOut, PoolDogeOut, PoolEthOut, PoolLtcOut,
  PoolUsdtOut, Stats
} from '@interfaces/Dex';
import {Balance, Wallet, WalletDto} from '@interfaces/Data';
import {environment} from '@environments/environment';
import {forkJoin} from 'rxjs';
import {CountdownComponent} from 'ngx-countdown';
// @ts-ignore
import Timer = NodeJS.Timer;
import {TranslateService} from '@ngx-translate/core';
import {IncomeComponent} from '@components/income/income.component';
import {ValueComponent} from '@components/value/value.component';
import {MatomoInjector, MatomoTracker} from 'ngx-matomo';
import {Apollo} from 'apollo-angular';
import {LOGIN, REGISTER, UPDATE} from '@interfaces/Graphql';


@Component({
  selector: 'app-dex-page',
  templateUrl: './dex.component.html',
})
export class DexComponent implements OnInit {

  @ViewChild('cd', {static: false})
  private countdown: CountdownComponent;

  @ViewChild(IncomeComponent)
  private incomeComponent: IncomeComponent;

  @ViewChild(ValueComponent)
  private valueComponent: ValueComponent;

  title = 'defichain-income';
  lang = 'en';
  env = environment;

  wallet: Wallet;
  walletDTO: WalletDto;

  // fixed variables
  dfiProBlockBtc = 80;
  dfiProBlockEth = 15;
  dfiProBlockUsdt = 5;
  dfiProBlockLtc = 2;
  dfiProBlockDoge = 0.1;
  dfiProBlockBch = 1;
  rewards: Stats;

  blocktimeInS = 37;
  usdToEur = 0.82;
  usdToChf = 0.89;
  usdToGbp = 0.72;
  fiat = 'USD';
  details = 'Staking';
  fiatKey = 'fiatKey';
  detailsKey = 'detailsKey';

  // Staking infos
  dfiInStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';
  stakingApy = 37;
  stakingApyCake = 37;
  stakingApyMN = 42.5;
  stakingApyKey = 'stakingApyKey';

  adresses = new Array<string>();
  addressesDto;
  adress = '';
  adressesKey = 'adressesKey';

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

  poolBch: Pool;
  poolBchOut: PoolBchOut = new PoolBchOut();
  anteilAmPoolBch: number;

  poolOut: Outcome = new Outcome();
  stakingOut: OutcomeStaking = new OutcomeStaking();

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
  dataLoaded = false;

  constructor(private dexService: Dex, private translate: TranslateService, private apollo: Apollo,
              private matomoInjector: MatomoInjector, private matomoTracker: MatomoTracker) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de/) ? browserLang : 'en');

    // setze matomo URL
    this.matomoInjector.init(environment.matomoUrl, environment.matomoId);

  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.lang = language;
    this.matomoTracker.trackEvent('Klick', 'Change Lang', language);
  }

  ngOnInit(): void {

    this.wallet = new Wallet();

    this.loadFromLocalStorage();

    this.testApi();
    setInterval(() => {
      this.testApi();
    }, 2000000);

    this.getRewards();
    setInterval(() => {
      this.getRewards();
    }, 3600000);

    if (this.loggedIn) {
      this.loadDataFromServerAndLoadAllStuff();
    } else {
      this.loadAddressesAndDexData();
    }

    this.countdown?.begin();
    this.timer = setInterval(() => {
      this.refresh();
    }, this.sCountdown * 1000);

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
    }
  }

  refresh(): void {
    this.dataLoaded = false;
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
    this.countdown?.restart();
  }

  register(): void {
    this.apollo.mutate({
      mutation: REGISTER,
      variables: {
        addresses: this.adresses,
        dfiInStaking: this.dfiInStaking,
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        bch: this.wallet.bch,
        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
        btcInBtcPool: this.wallet.btcInBtcPool,
        dfiInBtcPool: this.wallet.dfiInBtcPool,
        ethInEthPool: this.wallet.ethInEthPool,
        dfiInEthPool: this.wallet.dfiInEthPool,
        usdtInUsdtPool: this.wallet.usdtInUsdtPool,
        dfiInUsdtPool: this.wallet.dfiInUsdtPool,
        ltcInLtcPool: this.wallet.ltcInLtcPool,
        dfiInLtcPool: this.wallet.dfiInLtcPool,
        dogeInDogePool: this.wallet.dogeInDogePool,
        dfiInDogePool: this.wallet.dfiInDogePool,
        bchInBchPool: this.wallet.bchInBchPool,
        dfiInBchPool: this.wallet.dfiInBchPool
      }
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
        dfiInStaking: this.dfiInStaking,
        dfi: this.wallet.dfi,
        btc: this.wallet.btc,
        eth: this.wallet.eth,
        doge: this.wallet.doge,
        ltc: this.wallet.ltc,
        usdt: this.wallet.usdt,
        bch: this.wallet.bch,
        btcdfi: this.wallet.btcdfi,
        ethdfi: this.wallet.ethdfi,
        ltcdfi: this.wallet.ltcdfi,
        usdtdfi: this.wallet.usdtdfi,
        dogedfi: this.wallet.dogedfi,
        bchdfi: this.wallet.bchdfi,
        btcInBtcPool: this.wallet.btcInBtcPool,
        dfiInBtcPool: this.wallet.dfiInBtcPool,
        ethInEthPool: this.wallet.ethInEthPool,
        dfiInEthPool: this.wallet.dfiInEthPool,
        usdtInUsdtPool: this.wallet.usdtInUsdtPool,
        dfiInUsdtPool: this.wallet.dfiInUsdtPool,
        ltcInLtcPool: this.wallet.ltcInLtcPool,
        dfiInLtcPool: this.wallet.dfiInLtcPool,
        dogeInDogePool: this.wallet.dogeInDogePool,
        dfiInDogePool: this.wallet.dfiInDogePool
      }
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

  loadDataFromServerAndLoadAllStuff(): void {
    if (this.loggedInAuthInput || this.loggedInAuth) {
      this.apollo.query({
        query: LOGIN,
        variables: {
          key: this.loggedInAuthInput ? this.loggedInAuthInput : this.loggedInAuth
        }
      }).subscribe((result: any) => {
        if (result?.data?.userByKey) {
          this.loggedInAuth = this.loggedInAuthInput ? this.loggedInAuthInput : this.loggedInAuth;
          this.loggedIn = true;
          localStorage.setItem(this.loggedInKey, this.loggedInAuth);
          this.walletDTO = result?.data?.userByKey.wallet;
          this.dfiInStaking = this.walletDTO.dfiInStaking;
          if (!this.autoLoadData) {
            this.wallet = this.copyValues(this.walletDTO);
          }

          this.addressesDto = new Array(...result?.data?.userByKey?.addresses);
          this.adresses = this.addressesDto.slice();

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
    this.buildDataForChartIncome();

  }

  saveToggleInputShow(): void {
    localStorage.setItem(this.showInputAreaKey, JSON.stringify(this.showInputArea));
    this.matomoTracker.trackEvent('Klick', 'Change Show Input', JSON.stringify(this.showSettingsArea));
  }

  testApi(): void {

    this.dexService
      .getHealthCheck()
      .subscribe(ok => {
          if ('OK' === ok) {
            this.apiOnline = true;
          }
        },
        err => {
          console.error('Api down?' + err.message);
          this.apiOnline = false;

        });

  }

  getRewards(): void {
    this.dexService.getStats().subscribe(
      dex => {
        this.rewards = dex;
        console.log('Rewards loaded!');
      },
      err => {
        console.error(err);
        setTimeout(() => {
            this.getRewards();
            console.error('Try again ...');
          },
          5000);
      });
  }

  loadDex(): void {
    forkJoin([
      this.dexService.getListyieldfarming(),
      this.dexService.getListpoolpairs()]
    ).subscribe((([dex, poolPairs]: [DexInfo, DexPoolPair]) => {
          this.parsePoolsAndComputeOutcome(dex, poolPairs);

        }
      ),
      err => {
        console.error('Fehler beim Load Dex Data wait: ' + JSON.stringify(err.message));
        setTimeout(() => {
            this.loadDex();
            console.error('Try again ...');
          },
          5000);

      });

  }

  private parsePoolsAndComputeOutcome(dex: DexInfo, poolPairs: DexPoolPair): void {
    this.extractPools(dex);

    this.poolBtc.totalLiquidityLpToken = poolPairs['5'].totalLiquidity;
    this.poolBtc.customRewards = poolPairs['5'].customRewards;
    this.poolBtc.rewardPct = poolPairs['5'].rewardPct;

    this.poolEth.totalLiquidityLpToken = poolPairs['4'].totalLiquidity;
    this.poolEth.customRewards = poolPairs['4'].customRewards;
    this.poolEth.rewardPct = poolPairs['4'].rewardPct;

    this.poolUsdt.totalLiquidityLpToken = poolPairs['6'].totalLiquidity;
    this.poolUsdt.customRewards = poolPairs['6'].customRewards;
    this.poolUsdt.rewardPct = poolPairs['6'].rewardPct;

    this.poolLtc.totalLiquidityLpToken = poolPairs['10'].totalLiquidity;
    this.poolLtc.customRewards = poolPairs['10'].customRewards;
    this.poolLtc.rewardPct = poolPairs['10'].rewardPct;

    this.poolDoge.totalLiquidityLpToken = poolPairs['8'].totalLiquidity;
    this.poolDoge.customRewards = poolPairs['8'].customRewards;
    this.poolDoge.rewardPct = poolPairs['8'].rewardPct;

    this.poolBch.totalLiquidityLpToken = poolPairs['12'].totalLiquidity;
    this.poolBch.customRewards = poolPairs['12'].customRewards;
    this.poolBch.rewardPct = poolPairs['12'].rewardPct;

    this.computeRewardsPerBlockInPools();

    this.berechnePoolOutBtc();
    this.berechnePoolOutEth();
    this.berechnePoolOutBch();
    this.berechnePoolOutLtc();
    this.berechnePoolOutUsdt();
    this.berechnePoolOutDoge();

    this.berechneStakingOut();
    this.berechnePoolOut();
    this.dataLoaded = true;
  }

  private extractPools(dex: DexInfo): void {
    this.dex = dex;
    this.poolBtc = dex.pools.find(x => x.poolPairId === '5');
    this.poolEth = dex.pools.find(x => x.poolPairId === '4');
    this.poolUsdt = dex.pools.find(x => x.poolPairId === '6');
    this.poolLtc = dex.pools.find(x => x.poolPairId === '10');
    this.poolDoge = dex.pools.find(x => x.poolPairId === '8');
    this.poolBch = dex.pools.find(x => x.poolPairId === '12');
  }

  private computeRewardsPerBlockInPools(): void {

    this.dfiProBlockBtc = this.poolBtc.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockBtc += this.getCustomRewards(this.poolBtc.customRewards);

    this.dfiProBlockEth = this.poolEth.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockEth += this.getCustomRewards(this.poolEth.customRewards);

    this.dfiProBlockLtc = this.poolLtc.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockLtc += this.getCustomRewards(this.poolLtc.customRewards);

    this.dfiProBlockUsdt = this.poolUsdt.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockUsdt += this.getCustomRewards(this.poolUsdt.customRewards);

    this.dfiProBlockDoge = this.poolDoge.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockDoge += this.getCustomRewards(this.poolDoge.customRewards);

    this.dfiProBlockBch = this.poolBch.rewardPct * this.rewards.rewards.liquidityPool;
    this.dfiProBlockBch += this.getCustomRewards(this.poolBch.customRewards);

    console.log('computed btc' + this.dfiProBlockBtc);
    console.log('computed eth' + this.dfiProBlockEth);
    console.log('computed usdt' + this.dfiProBlockUsdt);
    console.log('computed ltc' + this.dfiProBlockLtc);
    console.log('computed bch' + this.dfiProBlockBch);
    console.log('computed doge' + this.dfiProBlockDoge);
  }

  private getCustomRewards(rewards: string []): number {
      let reward = 0;
      rewards.forEach(r => {
        reward += +r.split('@') [0];
      });

      return reward;
  }

  loadDexManual(): void {
    forkJoin([
      this.dexService.getListyieldfarming(),
      this.dexService.getListpoolpairs()]
    ).subscribe((([dex, poolPairs]: [DexInfo, DexPoolPair]) => {
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
    const requestArray = [];
    for (const ad of this.adresses) {
      requestArray.push(this.dexService.getAdressDetail(ad));
      requestArray.push(this.dexService.getAdressBalance(ad));
    }

    forkJoin(requestArray).subscribe(results => {
        results.forEach((value, i) => {
          if (i % 2 === 0) {
            const balances = value as [string];
            balances.forEach(value2 => this.addTokensToWallet(value2));
          } else {
            this.addCoinsToWallet(value as Balance);
          }
        });

        this.loadDex();

      },
      err => {
        console.error('Fehler beim Load Accounts: ' + JSON.stringify(err.message));
        setTimeout(() => {
            this.loadDex();
            console.error('Try again ...');
          },
          5000);

      });
  }

  addCoinsToWallet(balance: Balance): void {

    // Balance is in Satoshi
    this.wallet.dfi += balance.balance * 0.00000001;
  }

  addTokensToWallet(walletItem: string): void {
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
      case 'BCH': {
        this.wallet.bch += +splitted[0];
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
      case 'BCH-DFI': {
        this.wallet.bchdfi += +splitted[0];
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

  berechnePoolOutBch(): void {
    this.berechnePool('BCH', this.poolBch, this.poolBchOut, this.dfiProBlockBch);
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
      + this.poolUsdtOut.dfiPerMin + this.poolLtcOut.dfiPerMin + this.poolDogeOut.dfiPerMin + this.poolBchOut.dfiPerMin;
    this.poolOut.dfiPerHour = this.poolBtcOut.dfiPerHour + this.poolEthOut.dfiPerHour
      + this.poolUsdtOut.dfiPerHour + this.poolLtcOut.dfiPerHour + this.poolDogeOut.dfiPerHour + this.poolBchOut.dfiPerHour;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay
      + this.poolUsdtOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeek + this.poolEthOut.dfiPerWeek
      + this.poolUsdtOut.dfiPerWeek + this.poolLtcOut.dfiPerWeek + this.poolDogeOut.dfiPerWeek + this.poolBchOut.dfiPerWeek;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonth + this.poolEthOut.dfiPerMonth
      + this.poolUsdtOut.dfiPerMonth + this.poolLtcOut.dfiPerMonth + this.poolDogeOut.dfiPerMonth + this.poolBchOut.dfiPerMonth;
    this.poolOut.dfiPerYear = this.poolBtcOut.dfiPerYear + this.poolEthOut.dfiPerYear
      + this.poolUsdtOut.dfiPerYear + this.poolLtcOut.dfiPerYear + this.poolDogeOut.dfiPerYear + this.poolBchOut.dfiPerYear;
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

  onChangeDetails(newValue: string): void {
    this.details = newValue;
    localStorage.setItem(this.detailsKey, newValue);
    this.matomoTracker.trackEvent('Klick', 'Change Details', newValue);
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd();
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

  getBchValueUsd(): number {
    return (this.wallet.bchInBchPool + this.wallet.bch) * this.poolBch?.priceA;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.dfiInStaking;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }


  getAnteilLMOfUsdtPoolValue(): number {
    return ((this.wallet.dfiInUsdtPool * this.poolUsdt?.priceB) + (this.wallet.usdtInUsdtPool * this.poolUsdt?.priceA));
  }

  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolDoge?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd();
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

  getDfiIncomePerDay(): number {
    return this.stakingOut.dfiPerDay + this.poolOut.dfiPerDay;
  }

  getAllPoolDfIncome(): number {
    return this.poolBtcOut.dfiPerDay + this.poolEthOut.dfiPerDay + this.poolLtcOut.dfiPerDay + this.poolUsdtOut.dfiPerDay
      + this.poolDogeOut.dfiPerDay + this.poolBchOut.dfiPerDay;
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

  getAnteilBchPoolAnGesamtLM(): number {
    return this.poolBchOut.dfiPerDay / this.getAllPoolDfIncome() * 100;
  }

  addAdress(): void {
    this.adresses.push(this.adress);
    localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
    this.adress = '';
    this.clearWallet();
    this.loadAddressesAndDexData();
  }

  deleteAdress(adress: string): void {
    const index = this.adresses.indexOf(adress, 0);
    if (index > -1) {
      this.adresses.splice(index, 1);
      localStorage.setItem(this.adressesKey, JSON.stringify(this.adresses));
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

  onChangeLtcLtcPool(): void {
    if (this.checkInputNumber(this.wallet.ltcInLtcPool)) {
      localStorage.setItem(this.wallet.ltcInLtcPoolKey, JSON.stringify(this.wallet.ltcInLtcPool));
      this.berechnePoolOutLtc();
      this.berechnePoolOut();
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
    walletFinal.bchdfi = wallet.bchdfi;

    walletFinal.btcInBtcPool = wallet.btcInBtcPool;
    walletFinal.dfiInBtcPool = wallet.dfiInBtcPool;
    walletFinal.ethInEthPool = wallet.ethInEthPool;
    walletFinal.dfiInEthPool = wallet.dfiInEthPool;
    walletFinal.usdtInUsdtPool = wallet.usdtInUsdtPool;
    walletFinal.dfiInUsdtPool = wallet.dfiInUsdtPool;
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
    walletFinal.bch = wallet.bch;

    return walletFinal;
  }

}