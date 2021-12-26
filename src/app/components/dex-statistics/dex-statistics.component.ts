import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Correlation, History, IncomeStatistics, Pool, Stats } from '@interfaces/Dex';
import {Apollo} from 'apollo-angular';
import { CORRELATION, HISTORY, INCOME_STATISTICS } from '@interfaces/Graphql';
import {Octokit} from '@octokit/rest';
import {Milestone, Release} from '@interfaces/Github';
import { OceanStats } from '@interfaces/Staking';
import { Dex } from '@services/dex.service';
import { ChartOptions, ChartOptions6, StockOracles } from '@interfaces/Data';
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dex-statistics',
  templateUrl: './dex-statistics.component.html',
})
export class DexStatisticsComponent implements OnInit {

  @ViewChild('chart6') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions6>;

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
  blockTimeUsed: number;

  @Input()
  blockTimeSecond: number;

  @Input()
  blockCountForCalc: number;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  burnedDfi: number;

  @Input()
  correlationDays: number;

  @Input()
  priceDFICEX: number;

  corr: Correlation;

  euonsHardforkeBlock = 894000;

  octokit = new Octokit();

  milestones = new Array<Milestone>();

  releasesNode = new Array<Release>();

  releasesApp = new Array<Release>();

  releasesWallet = new Array<Release>();

  oraclePrices: StockOracles;

  incomeStatistics: IncomeStatistics;

  history = new Array<History>();

  curentStock = 'SPY-DUSD';

  constructor(private apollo: Apollo, private dex: Dex, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void  {
    this.loadCor();
    this.loadMilestones();
    this.loadNodeRelease();
    this.loadAppRelease();
    this.loadWalletRelease();
    this.loadOraclePrices();
    this.loadIncomeStatistics();
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

  loadWalletRelease(): void {
    this.octokit.rest.repos.listReleases({
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
    return this.stocksPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
  }

  getCryptoPools(): Array<Pool> {
    return this.cryptoPools.sort((a, b) => b.totalLiquidityUsd - a.totalLiquidityUsd);
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

  loadHistory(): void {
    this.spinner.show();
    this.apollo.query({
      query: HISTORY
    }).subscribe((result: any) => {
      if (result?.data?.getFarmingHistory) {
        this.history = result?.data?.getFarmingHistory;
        this.buildChartPrice();
        this.spinner.hide();
      } else {
        console.log('No Date for Historx');
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

  getDexDFI(): number {
    let dfi = 0;

    if (!this.cryptoPools) {
      return dfi;
    }

    this.cryptoPools?.forEach(c => {
      dfi += +c?.reserveB;
    });

    dfi += +this.stocksPools?.find(a => a.symbol === 'DUSD-DFI').reserveB;

    return dfi;
  }

  // TODO Correct calculation
  getVaultDFI(): number {
    return this.getTotalDFILocked() - this.getDexDFI() - this.MNCount * 20000;
  }

  // TODO Add Vaults DFI
  getTotalDFILocked(): number {
    return this.getDexDFI() + this.MNCount * 20000;
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
    return Math.round(dex / cex  * 100) - 100;
  }

  isDUSDPool(pool: Pool): boolean {
    return pool?.symbol === 'DUSD-DFI';
  }

  getStockPrice(key: string): number {

    if (!this.oraclePrices || this.oraclePrices.data.length === 0) {
      return 0;
    }

    return +this.oraclePrices.data.find(o => o.id === key.replace('DUSD', 'USD')).price.aggregated.amount;
  }

  buildChartPrice(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Price',
          data: this.getPrices(this.curentStock)
        }
      ],
      chart: {
        height: 500,
        type: 'line'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'Stock Price - ' + this.curentStock,
        align: 'left'
      },
      legend: {
        // tslint:disable-next-line:typedef
        tooltipHoverFormatter(val, opts) {
          return (
            val +
            ' - <strong>' +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            '</strong>'
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: this.getDates(this.curentStock)
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return val + ' DUSD';
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1'
      }
    };
  }

  getPrices(stock: string): Array<number> {
    const prices = new Array<number>();
    if (!this.history) {
      return prices;
    }
    this.history.forEach(h => {
      prices.push(Math.round(h.pools.find(p => p.symbol === stock)?.priceA));
    });

    return prices;
  }

  getDates(stock: string): Array<string> {
    const dates = new Array<string>();
    if (!this.history) {
      return dates;
    }
    this.history.forEach(h => {
      dates.push(new Date(h.date).toLocaleString());
    });

    return dates;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }

  onChangeStockPool(newValue: string): void {
    this.curentStock = newValue + '-DUSD';
    this.buildChartPrice();
  }

}
