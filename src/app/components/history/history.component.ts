import { Component, OnInit, ViewChild } from '@angular/core'
import { ChartComponent } from 'ng-apexcharts'
import { ChartOptions6 } from '@interfaces/Data'
import { History, HistoryPrice, Pool } from '@interfaces/Dex'
import { NgxSpinnerService } from 'ngx-spinner'
import { HISTORY } from '@interfaces/Graphql'
import { Apollo } from 'apollo-angular'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

  @ViewChild('chart6', { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions6>;

  @ViewChild('chart7', { static: false }) chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions6>;

  @ViewChild('chart8', { static: false }) chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions6>;

  @ViewChild('chart9', { static: false }) chart4: ChartComponent;
  public chartOptions4: Partial<ChartOptions6>;

  history = new Array<History>();
  historyNumbers = new Array<HistoryPrice>();

  curentStock = 'BTC';

  fromDate: Date = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  tillDate: Date = new Date();

  constructor(private apollo: Apollo, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  async loadHistory(): Promise<void> {
    this.spinner.show('historySpinner');
    this.apollo.query({
      query: HISTORY,
      variables: {
        fromYear: this.fromDate.getFullYear(),
        fromMonth: this.fromDate.getMonth() + 1,
        fromDay: this.fromDate.getUTCDate(),
        fromHour: this.fromDate.getHours(),
        tillYear: this.tillDate.getFullYear(),
        tillMonth: this.tillDate.getMonth() + 1,
        tillDay: this.tillDate.getUTCDate(),
        tillHour:  this.tillDate.getHours()
      }
    }).subscribe((result: any) => {
      if (result?.data?.getFarmingHistory) {
        this.history = result?.data?.getFarmingHistory;
        this.computeNumbers(this.curentStock);
        this.buildChartPrice();
        this.buildChartReserve();
        this.buildChartLiquidity();
        this.buildChartVolume();
        this.spinner.hide('historySpinner');
      } else {
        this.spinner.hide('historySpinner');
        console.log('No Date for Historx');
      }
    }, (error) => {
      this.spinner.hide('historySpinner');
      console.log(error);
    });
  }

  async buildChartPrice(): Promise<void> {
    this.chartOptions = {
      series: [
        {
          name: 'Price',
          data: this.getPrices()
        }
      ],
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent'
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
        text: 'Pool Price - ' + this.curentStock,
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
          trim: false,
          style: {
            colors: '#f1f1f1'
          }
        },
        categories: this.getDates(),
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return val + ' dUSD/USD';
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

  async buildChartReserve(): Promise<void> {
    this.chartOptions2 = {
      series: [
        {
          name: 'Reserve',
          data: this.getReserves()
        }
      ],
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent'
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
        text: 'Pool Reserve - ' + this.curentStock,
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
          trim: false,
          style: {
            colors: '#f1f1f1'
          }
        },
        categories: this.getDates(),
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return val;
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

  async buildChartLiquidity(): Promise<void> {
    this.chartOptions3 = {
      series: [
        {
          name: 'Liquidity Token',
          data: this.getLiquidity()
        }
      ],
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent'
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
        text: 'Pool Liquidity - ' + this.curentStock,
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
          trim: false,
          style: {
            colors: '#f1f1f1'
          }
        },
        categories: this.getDates(),
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return val;
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

  async buildChartVolume(): Promise<void> {
    this.chartOptions4 = {
      series: [
        {
          name: 'Volume',
          data: this.getVolume()
        }
      ],
      chart: {
        height: 500,
        type: 'line',
        background: 'transparent'
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
        text: 'Pool Volume - ' + this.curentStock,
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
          trim: false,
          style: {
            colors: '#f1f1f1'
          }
        },
        categories: this.getDates(),
      },
      tooltip: {
        y: [
          {
            title: {
              // tslint:disable-next-line:typedef
              formatter(val) {
                return val;
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

  computeNumbers(stock: string): void{
    if (!this.history) {
      return;
    }
    this.historyNumbers = new Array<HistoryPrice>();
    this.history.forEach(h => {

      // search first with pair
      const indexPairSearch = h.pools.findIndex(p => p.pair?.startsWith(stock));
      if (indexPairSearch > -1) {
        if (h.pools[indexPairSearch]?.priceA) {
          this.pushHistoryNumbers(h, indexPairSearch);
        }
        // search second with symbol
      } else {
        const indexSymbolSearch = h.pools.findIndex(p => p.symbol?.startsWith(stock));
        if (indexSymbolSearch > -1) {
          if (h.pools[indexSymbolSearch]?.priceA) {
            this.pushHistoryNumbers(h, indexSymbolSearch);
          }
        }
      }
    });

  }

  private pushHistoryNumbers(h: History, indexPairSearch: number): void {
    const price = new HistoryPrice();
    if (h.pools[indexPairSearch]?.symbol.startsWith('DUSD')) {
      const priceDfiCex = h.pools.filter(p => p.symbol.startsWith('BTC'))[0].priceB;
      const priceDfiDex = h.pools[indexPairSearch]?.priceB;
      if (priceDfiCex && priceDfiDex) {
        const priceDif =  priceDfiCex / priceDfiDex;
        price.price = Math.round(priceDif * 100) / 100;
      }
    } else {
      price.price = Math.round(h.pools[indexPairSearch]?.priceA * 100) / 100;
    }

    price.reserve = Math.round(+h.pools[indexPairSearch]?.reserveA * 100) / 100;
    price.liquidiy = Math.round(this.getLiquidityNumber(h.pools[indexPairSearch]) * 100) / 100;
    price.volume = Math.round(+h.pools[indexPairSearch]?.volumeA * 100) / 100;
    price.date = new Date(h.date);
    this.historyNumbers.push(price);
  }

  private getLiquidityNumber(pool: Pool): number {
    if (+pool?.totalLiquidity) {
      return +pool?.totalLiquidity;
    } else if (+pool?.totalLiquidityLpToken) {
      return +pool?.totalLiquidityLpToken;
    } else if (+pool?.totalStaked) {
      return +pool?.totalStaked;
    }
  }

  getPrices(): Array<number> {
    const prices = new Array<number>();
    if (!this.historyNumbers || this.historyNumbers.length === 0) {
      return prices;
    }
    this.historyNumbers.forEach(h => {
      prices.push(h.price);
    });

    return prices;
  }

  getReserves(): Array<number> {
    const reserves = new Array<number>();
    if (!this.historyNumbers || this.historyNumbers.length === 0) {
      return reserves;
    }
    this.historyNumbers.forEach(h => {
      reserves.push(h.reserve);
    });

    return reserves;
  }

  getVolume(): Array<number> {
    const volume = new Array<number>();
    if (!this.historyNumbers || this.historyNumbers.length === 0) {
      return volume;
    }
    this.historyNumbers.forEach(h => {
      volume.push(h.volume);
    });

    return volume;
  }

  getLiquidity(): Array<number> {
    const liquidity = new Array<number>();
    if (!this.historyNumbers || this.historyNumbers.length === 0) {
      return liquidity;
    }
    this.historyNumbers.forEach(h => {
      liquidity.push(h.liquidiy);
    });

    return liquidity;
  }

  getDates(): Array<string> {
    const dates = new Array<string>();
    if (!this.historyNumbers || this.historyNumbers.length === 0) {
      return dates;
    }
    this.historyNumbers.forEach(h => {
      dates.push(h.date.toLocaleDateString() + ' - ' + h.date.toLocaleTimeString());
    });

    return dates;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }

  onChangeStockPool(newValue: string): void {
    this.spinner.show('historySpinner');
    this.curentStock = newValue;
    this.computeNumbers(this.curentStock);
    this.buildChartPrice();
    this.buildChartReserve();
    this.buildChartLiquidity();
    this.buildChartVolume();
    this.spinner.hide('historySpinner');
  }

  onChangeDateStockPool(newValue: string): void {
    if ('1D' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
    } else if ('7D' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 7));
    } else if ('1M' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 30));
    } else if ('3M' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 90));
    } else if ('1Y' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 365));
    } else if ('ALL' === newValue) {
      this.fromDate = new Date(new Date().getTime() - (24 * 60 * 60 * 1000 * 3650));
    }
  }

}
