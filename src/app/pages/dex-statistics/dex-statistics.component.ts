import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Correlation, History, IncomeStatistics, Pool, Stats, StockLongName } from '@interfaces/Dex';
import {Apollo} from 'apollo-angular';
import { CORRELATION, EXCHANGE, INCOME_STATISTICS } from '@interfaces/Graphql';
import {Octokit} from '@octokit/rest';
import {Milestone, Release} from '@interfaces/Github';
import { DfxStaking, OceanStats } from '@interfaces/Staking';
import { Dex } from '@services/dex.service';
import { Blocks, Burn, ChartOptions6, Exchange, PoolPairOcean, PoolPairsOcean, StockOracles } from '@interfaces/Data';
import { ChartComponent } from 'ng-apexcharts';


@Component({
  selector: 'app-dex-statistics',
  templateUrl: './dex-statistics.component.html',
  styleUrls: ['../../app.component.css'],
})
export class DexStatisticsComponent implements OnInit {

  @ViewChild('chart6', { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions6>;

  @ViewChild('chart7', { static: false }) chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions6>;

  @Input()
  fiat: string;

  @Input()
  oceanStats!: OceanStats;

  // Crypto
  @Input()
  cryptoPools!: Array<Pool>;

  // Stocks
  @Input()
  stocksPools!: Array<Pool>;

  @Input()
  stakingApyMN: number;

  @Input()
  stakingApyCake: number;

  @Input()
  MNCount: number;

  @Input()
  MNCount5Freezer: number;

  @Input()
  MNCount10Freezer: number;

  @Input()
  MNCount0Freezer: number;

  @Input()
  rewards: Stats;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  burnedDfi: number;

  @Input()
  correlationDays: number;

  @Input()
  priceDFICEX: number;

  @Input()
  blockTimeUsed: number;

  @Input()
  blockTimeSecond: number;

  @Input()
  stakingDfx: DfxStaking;

  @Output()
  callDefiView = new EventEmitter<string>();

  corr: Correlation;

  euonsHardforkeBlock = 894000;

  oracleBlockBase = 1528800;

  futureBlockBase = 1794240;

  octokit = new Octokit();

  milestones = new Array<Milestone>();

  releasesNode = new Array<Release>();

  releasesApp = new Array<Release>();

  releasesWallet = new Array<Release>();

  oraclePrices: StockOracles;

  @Input()
  poolPairsOcean: PoolPairsOcean;

  burnDfi: Burn;

  incomeStatistics: IncomeStatistics;

  history = new Array<History>();

  curentStock = 'BTC';

  fromDate: Date = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  tillDate: Date = new Date();

  avgBlocktime = 30;
  medianBlocktime = 30;
  avgFirstLastBlocktime = 30;

  exchange: Exchange;

  statisticsOn = true;
  statisticsOnKey = 'statisticsOnKey';

  asc = true;
  sortColumn = 'tvl';

  constructor(private apollo: Apollo, private dex: Dex, private dexService: Dex) {
  }

  ngOnInit(): void  {

    if (localStorage.getItem(this.statisticsOnKey) !== null) {
      this.statisticsOn = JSON.parse(localStorage.getItem(this.statisticsOnKey));
    }

    this.loadCor();
    this.loadMilestones();
    this.loadNodeRelease();
    this.loadAppRelease();
    this.loadWalletRelease();
    this.loadOraclePrices();
    this.loadBurnInfo();
    this.loadIncomeStatistics();
    this.calculateBlockTime();
    this.calculateExchangesStatus();

    this.stocksPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
    this.cryptoPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
  }

  loadMilestones(): void {
    this.octokit.rest.issues.listMilestones({
      owner: 'DeFiCh',
      repo: 'ain',
    })
      .then(({data}) => {
        // handle data
        this.milestones = data as unknown as Milestone [];

      });
  }

  loadNodeRelease(): void {
    this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'ain',
    })
      .then(({data}) => {
        // handle data
        this.releasesNode = data as unknown as Release [];
        this.releasesNode = this.filterReleases(this.releasesNode);

      });
  }

  getLatestReleaseNode(): Release {
    return this.releasesNode[0];
  }

  routeToDfiView(asset: string): void {
    this.callDefiView.emit(asset);
  }

  loadAppRelease(): void {
    this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'app',
    })
      .then(({data}) => {
        // handle data
        this.releasesApp = data as unknown as Release [];
        this.releasesApp = this.filterReleases(this.releasesApp);

      });
  }

  async loadWalletRelease(): Promise<void> {
    await this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'wallet',
    })
      .then(({data}) => {
        // handle data
        this.releasesWallet = data as unknown as Release [];
        this.releasesWallet = this.filterReleases(this.releasesWallet);

      });
  }

  private filterReleases(releases: Release []): Release [] {
    releases = releases.filter(a => a.prerelease === false);
    releases = releases.sort((a: Release, b: Release) => {
      return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
    });
    return releases.reverse();
  }

  getStockPools(): Array<Pool> {
    return this.stocksPools;
  }

  getLongName(name: string): StockLongName {
    switch (name) {
      case 'BTC-DFI': {
        return new StockLongName('Bitcoin', 'Bitcoin');
      }
      case 'ETH-DFI': {
        return new StockLongName('Ethereum', 'Ethereum');
      }
      case 'LTC-DFI': {
        return new StockLongName('Litecoin', 'Litecoin');
      }
      case 'BCH-DFI': {
        return new StockLongName('BitcoinCash', 'BitcoinCash');
      }
      case 'DOGE-DFI': {
        return new StockLongName('Doge', 'Doge');
      }
      case 'USDT-DFI': {
        return new StockLongName('Tether $', '');
      }
      case 'USDC-DFI': {
        return new StockLongName('USD Coin', '');
      }
      case 'SPY-DUSD': {
        return new StockLongName('SPDR S&P 500 Trust', 'SPY');
      }
      case 'TSLA-DUSD': {
        return new StockLongName('Tesla Inc.', 'TSLA');
      }
      case 'QQQ-DUSD': {
        return new StockLongName('Invesco QQQ ETF (Nasdaq-100 Index)', 'QQQ');
      }
      case 'GME-DUSD': {
        return new StockLongName('Gamestop', 'GME');
      }
      case 'NVDA-DUSD': {
        return new StockLongName('Nvidia Corp.', 'NVDA');
      }
      case 'AAPL-DUSD': {
        return new StockLongName('Apple Inc.', 'AAPL');
      }
      case 'FB-DUSD': {
        return new StockLongName('Meta Platforms, Inc.', 'FB');
      }
      case 'MSFT-DUSD': {
        return new StockLongName('Microsoft Inc.', 'MSFT');
      }
      case 'BABA-DUSD': {
        return new StockLongName('Alibaba Group Holding Limited', 'BABA');
      }
      case 'MSTR-DUSD': {
        return new StockLongName('MicroStrategy Incorporated', 'MSTR');
      }
      case 'COIN-DUSD': {
        return new StockLongName('Coinbase Global, Inc.', 'COIN');
      }
      case 'NFLX-DUSD': {
        return new StockLongName('Netflix, Inc.', 'NFLX');
      }
      case 'ARKK-DUSD': {
        return new StockLongName('ARK Innovation ETF', 'ARKK');
      }
      case 'PLTR-DUSD': {
        return new StockLongName('Palantir Technologies Inc.', 'PLTR');
      }
      case 'AMZN-DUSD': {
        return new StockLongName('Amazon.com Inc.', 'AMZN');
      }
      case 'GOOGL-DUSD': {
        return new StockLongName('Alphabet Inc.', 'GOOGL');
      }
      case 'GLD-DUSD': {
        return new StockLongName('SPDR Gold Shares', 'GLD');
      }
      case 'INTC-DUSD': {
        return new StockLongName('Intel Corporation', 'INTC');
      }
      case 'TLT-DUSD': {
        return new StockLongName('iShares 20+ Year Treasury Bond ETF', 'TLT');
      }
      case 'SLV-DUSD': {
        return new StockLongName('iShares Silver Trust', 'SLV');
      }
      case 'PDBC-DUSD': {
        return new StockLongName('Invesco Optimum Yield Diversified Commodity Strategy No K-1 ETF', 'PDBC');
      }
      case 'MCHI-DUSD': {
        return new StockLongName('iShares MSCI China ETF', 'MCHI');
      }
      case 'EEM-DUSD': {
        return new StockLongName('iShares MSCI Emerging Markets ETF', 'EEM');
      }
      case 'VOO-DUSD': {
        return new StockLongName('Vanguard 500 Index Fund', 'VOO');
      }
      case 'DIS-DUSD': {
        return new StockLongName('The Walt Disney Company', 'DIS');
      }
      case 'URTH-DUSD': {
        return new StockLongName('iShares MSCI World ETF', 'URTH');
      }
      case 'VNQ-DUSD': {
        return new StockLongName('Vanguard Real Estate Index Fund', 'VNQ');
      }
      case 'PYPL-DUSD': {
        return new StockLongName('PayPal Holdings, Inc.', 'PYPL');
      }
      case 'BRK.B-DUSD': {
        return new StockLongName('Berkshire Hathaway Inc. New', 'BRK.B');
      }
      case 'KO-DUSD': {
        return new StockLongName('The Coca-Cola Company', 'KO');
      }
      case 'PG-DUSD': {
        return new StockLongName('The Procter & Gamble Company', 'PG');
      }
      case 'SAP-DUSD': {
        return new StockLongName('SAP SE', 'SAP');
      }
      case 'CS-DUSD': {
        return new StockLongName('Credit Suisse Group AG', 'CS');
      }
      case 'GSG-DUSD': {
        return new StockLongName('iShares S&P GSCI Commodity-Indexed Trust', 'GSG');
      }
      case 'URA-DUSD': {
        return new StockLongName('Global X Uranium ETF', 'URA');
      }
      default: {
        return new StockLongName('', '');
      }
    }
  }

  getCryptoPools(): Array<Pool> {
    return this.cryptoPools;
  }

  getVolumeAllPools(): number {
    let volume = 0;
    this.poolPairsOcean.data.forEach(p => volume = volume + p.volume?.h24);
    return Math.round(volume * 100) / 100;
  }

  getCommissionsAprAllPools(): number {
    let com = 0;
    this.poolPairsOcean.data.forEach(p => com = com + p.apr?.commission * 100);
    return Math.round(com * 100) / 100;
  }

  getRewardsAprAllPools(): number {
    let com = 0;
    this.poolPairsOcean.data.forEach(p => com = com + p.apr?.reward * 100);
    return Math.round(com * 100) / 100;
  }

  getAvgCommissionsAllPools(): number {
    return Math.round(this.getCommissionsAprAllPools() / this.poolPairsOcean?.data?.length * 100) / 100;
  }

  getRatioCommissionToRewardAllPools(): number {
   const com = this.getCommissionsAprAllPools();
   const reward = this.getRewardsAprAllPools();
   return Math.round(com / reward * 1000) / 1000;
  }

  sortOn(column: string): void {
    if (column === 'premium') {
      this.sortColumn = 'premium';
      if (!this.asc) {
        this.stocksPools.sort((a, b) =>
          (this.isDUSDPool(b) ? this.getArb(this.priceDFICEX, b?.totalLiquidityUsd / 2 / +b?.reserveB) :
            this.getArb(this.getStockPrice(b?.tokenASymbol), b?.totalLiquidityUsd / 2 / +b?.reserveA))
          - (this.isDUSDPool(a) ? this.getArb(this.priceDFICEX, a?.totalLiquidityUsd / 2 / +a?.reserveB) :
            this.getArb(this.getStockPrice(a?.tokenASymbol), a?.totalLiquidityUsd / 2 / +a?.reserveA)));

        this.cryptoPools.sort((a, b) =>
          (this.getArb(b?.priceA, b?.totalLiquidityUsd / 2 / +b?.reserveA))
          - (this.getArb(a?.priceA, a?.totalLiquidityUsd / 2 / +a?.reserveA)));
      } else {
        this.stocksPools.sort((a, b) =>
          (this.isDUSDPool(a) ? this.getArb(this.priceDFICEX, a.totalLiquidityUsd / 2 / +a?.reserveB) :
            this.getArb(this.getStockPrice(a?.tokenASymbol), a?.totalLiquidityUsd / 2 / +a?.reserveA))
          - (this.isDUSDPool(b) ? this.getArb(this.priceDFICEX, b?.totalLiquidityUsd / 2 / +b?.reserveB) :
            this.getArb(this.getStockPrice(b?.tokenASymbol), b?.totalLiquidityUsd / 2 / +b?.reserveA)));

        this.cryptoPools.sort((a, b) =>
          (this.getArb(a?.priceA, a?.totalLiquidityUsd / 2 / +a?.reserveA))
          - (this.getArb(b?.priceA, b?.totalLiquidityUsd / 2 / +b?.reserveA)));
      }
    } else if (column === 'tvl') {
      this.sortColumn = 'tvl';
      if (!this.asc) {
        this.stocksPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
        this.cryptoPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
      } else {
        this.stocksPools.sort((a, b) => a.totalLiquidityUsd - b.totalLiquidityUsd);
        this.cryptoPools.sort((a, b) => a.totalLiquidityUsd - b.totalLiquidityUsd);
      }
    } else if (column === 'apr') {
      this.sortColumn = 'apr';
      if (!this.asc) {
        this.stocksPools.sort((a, b) => this.getPoolFromOceanPoolPairs(b.id)?.apr.total - this.getPoolFromOceanPoolPairs(a.id)?.apr.total);
        this.cryptoPools.sort((a, b) => this.getPoolFromOceanPoolPairs(b.id)?.apr.total - this.getPoolFromOceanPoolPairs(a.id)?.apr.total);
      } else {
        this.stocksPools.sort((a, b) => this.getPoolFromOceanPoolPairs(a.id)?.apr.total - this.getPoolFromOceanPoolPairs(b.id)?.apr.total);
        this.cryptoPools.sort((a, b) => this.getPoolFromOceanPoolPairs(a.id)?.apr.total - this.getPoolFromOceanPoolPairs(b.id)?.apr.total);
      }
    } else if (column === 'volume') {
      this.sortColumn = 'volume';
      if (!this.asc) {
        this.stocksPools.sort((a, b) =>
          this.getPoolFromOceanPoolPairs(b.id)?.volume.h24 - this.getPoolFromOceanPoolPairs(a.id)?.volume.h24);
        this.cryptoPools.sort((a, b) =>
          this.getPoolFromOceanPoolPairs(b.id)?.volume.h24 - this.getPoolFromOceanPoolPairs(a.id)?.volume.h24);
      } else {
        this.stocksPools.sort((a, b) =>
          this.getPoolFromOceanPoolPairs(a.id)?.volume.h24 - this.getPoolFromOceanPoolPairs(b.id)?.volume.h24);
        this.cryptoPools.sort((a, b) =>
          this.getPoolFromOceanPoolPairs(a.id)?.volume.h24 - this.getPoolFromOceanPoolPairs(b.id)?.volume.h24);
      }
    } else if (column === 'pool') {
      this.sortColumn = 'pool';
      if (!this.asc) {
        this.stocksPools.sort((a, b) => b.symbol.localeCompare(a.symbol));
        this.cryptoPools.sort((a, b) => b.symbol.localeCompare(a.symbol));
      } else {
        this.stocksPools.sort((a, b) => a.symbol.localeCompare(b.symbol));
        this.cryptoPools.sort((a, b) => a.symbol.localeCompare(b.symbol));
      }
    }

    this.asc = !this.asc;
  }

  getLatestReleaseApp(): Release {
    return this.releasesApp[0];
  }

  getLatestReleaseWallet(): Release {
    return this.releasesWallet[0];
  }

  getReleaseText(body: string): string {
    if (body?.indexOf('How to run?') > -1) {
      return body?.substring(0, body?.indexOf('How to run?'));
    }
    return body;
  }

  getReleaseTextWallet(body: string): string {
    if (body?.indexOf('Dependencies') > -1) {
      return body?.substring(0, body?.indexOf('Dependencies'));
    }
    return body;
  }

  loadCor(): void {
    this.apollo.query({
      query: CORRELATION,
      variables: {
        days: this.correlationDays
      }
    }).subscribe((result: any) => {
      if (result?.data?.getCorrelation) {
        this.corr = result?.data?.getCorrelation;
      } else {
        console.log('No Date for Corr');
      }
    }, (error) => {
      console.log(error);
    });
  }

  loadIncomeStatistics(): void {
    this.apollo.query({
      query: INCOME_STATISTICS
    }).subscribe((result: any) => {
      if (result?.data?.getStatisticsIncome) {
        this.incomeStatistics = result?.data?.getStatisticsIncome;
      } else {
        console.log('No Date for Income Statistics');
      }
    }, (error) => {
      console.log(error);
    });
  }

  loadOraclePrices(): void {
  this.dex.getOraclePrices()
    .subscribe(prices => {
        this.oraclePrices = prices;
        },
      err => {
        console.error('Fehler beim load oracle Prices: ' + JSON.stringify(err.message));
      });
  }

  loadBurnInfo(): void {
    this.dex.getBurnInfo()
      .subscribe(burn => {
          this.burnDfi = burn;
        },
        err => {
          console.error('Fehler beim load burn info: ' + JSON.stringify(err.message));
        });
  }

  getPoolFromOceanPoolPairs(id: string): PoolPairOcean {
    return this.poolPairsOcean?.data.find(p => p.id === id);
  }

  getBlockToNextCycle(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 32690 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 32690;
    const time = blocks * this.blockTimeUsed / 60 / 60 / 24;
    return String(blocks) + ' ~ ' + Math.round(time) + ' d';
  }

  getBlockToNextDiffChange(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 1008 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 1008;
    const time = blocks * this.blockTimeUsed / 60 / 60;
    return String(blocks) + ' ~ ' + Math.round(time) + ' h';
  }

  getBlockToNextOracle(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 120 - (this.rewards?.blockHeight - this.oracleBlockBase) % 120;
    const time = blocks * this.blockTimeUsed / 60;
    return String(blocks) + ' ~ ' + Math.round(time) + ' min';
  }

  getBlockToNextFutureSwap(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 20160 - (this.rewards?.blockHeight - this.futureBlockBase) % 20160;
    const timeD = blocks * this.blockTimeUsed / 60 / 60 / 24;
    const timeH = blocks * this.blockTimeUsed / 60 / 60;
    return String(blocks) + ' ~ ' + Math.round(timeD) + 'd ~ ' + Math.round(timeH) + 'h' ;
  }

  getDexDFI(): number {
    let dfi = 0;

    if (!this.cryptoPools) {
      return dfi;
    }

    this.cryptoPools?.forEach(c => {
      dfi += +c?.reserveB;
    });

    dfi += +this.stocksPools?.find(a => a.symbol === 'DUSD-DFI')?.reserveB;

    return dfi;
  }

  // TODO Correct calculation
  getVaultDFI(): number {
    return this.getTotalDFILocked() - this.getDexDFI() - this.MNCount * 20000;
  }

  // TODO Add Vaults DFI
  getTotalDFILocked(): number {
    return this.getDexDFI() + this.getTotalMasternodesDfiLocked();
  }

  getTotalMasternodesDfiLocked(): number {
    return this.MNCount * 20000;
  }

  getApyWeeklyFromApr(apr: number): number {
    return 100 * (Math.pow(1 + (apr / 100 / 52), 52) - 1);
  }

  getAprFromApy(apy: number): number {
    return 100 * 730 * (Math.pow(1 + apy / 100, 1 / 730) - 1);
  }

  getCorr(pool: string): number {

    if ('BTC' === pool) {
      return this.corr?.btcPool;
    } else if ('ETH' === pool) {
      return this.corr?.ethPool;
    } else if ('LTC' === pool) {
      return this.corr?.ltcPool;
    } else if ('BCH' === pool) {
      return this.corr?.bchPool;
    } else if ('DOGE' === pool) {
      return this.corr?.dogePool;
    } else if ('USDT' === pool) {
      return this.corr?.usdtPool;
    } else if ('USDC' === pool) {
      return this.corr?.usdcPool;
    } else {
      return this.corr?.tslaPool;
    }
  }

  getArb(cex: number, dex: number): number {
    // round 1 digit
    return Math.round(dex / cex  * 1000 - 1000) / 10;
  }

  getRound3(num: number): number {
    return Math.round((num) * 1000) / 1000;
  }

  isDUSDPool(pool: Pool): boolean {
    return pool?.symbol === 'DUSD-DFI';
  }

  getStockPrice(key: string): number {

    if ( !key || !this.oraclePrices || this.oraclePrices.data.length === 0) {
      return 0;
    }

    const price = +this.oraclePrices.data.find(o => o.token.symbolKey === key)?.activePrice?.active?.amount;

    return Math.round(price * 100) / 100;
  }

  getStockPriceNext(key: string): number {

    if (!this.oraclePrices || this.oraclePrices.data.length === 0) {
      return 0;
    }
    const price = +this.oraclePrices.data.find(o => o.token.symbolKey === key)?.activePrice?.next?.amount;
    return Math.round(price * 100) / 100;
  }

  calculateBlockTime(): void {
    this.dexService.getLastBlocks(2000).subscribe((result: Blocks) => {

      result.data.sort((a, b) => a.time - b.time);

      const diffS = new Array<number>();

      for (let i = 0; i < result.data.length - 2; i++) {
        const date = result.data[i].time;
        const date2 = result.data[i + 1].time;
        diffS.push(Math.abs(date - date2));
      }

      // avg first and last
      const diff = (result.data[result.data.length - 1].time
        - result.data[0].time);
      const avgFirstAndLast = Math.round(diff / result.data.length);

      // avg
      const sum = diffS.reduce((previous, current) => current += previous);
      const avg = Math.round(sum / diffS.length);

      // median
      diffS.sort((a, b) => a - b);
      const lowMiddle = Math.floor((diffS.length - 1) / 2);
      const highMiddle = Math.ceil((diffS.length - 1) / 2);
      const median = Math.round((diffS[lowMiddle] + diffS[highMiddle]) / 2);

      this.avgBlocktime = avg;
      this.medianBlocktime = median;
      this.avgFirstLastBlocktime = avgFirstAndLast;

    }, (error) => {
      console.log(error);
    });
  }

  calculateExchangesStatus(): void {

    this.apollo.query({
      query: EXCHANGE
    }).subscribe((result: any) => {
      if (result?.data?.getExchangeStatus) {
        this.exchange = result?.data?.getExchangeStatus;
      } else {
        console.log('No Date for Income Statistics');
      }
    }, (error) => {
      console.log(error);
    });

  }


  toggleStatisticsOn(): void {
    localStorage.setItem(this.statisticsOnKey, String(this.statisticsOn));
  }

}
