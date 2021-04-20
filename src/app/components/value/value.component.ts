import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Pool} from '@interfaces/Dex';
import {ChartOptions, ChartOptions3, Data, Wallet} from '@interfaces/Data';
import {ChartComponent} from 'ng-apexcharts';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
})
export class ValueComponent implements OnInit, OnChanges {

  @ViewChild('chart3') chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions3>;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input()
  wallet!: Wallet;

  @Input()
  dfiInStaking!: number;

  @Input()
  usdToEur!: number;

  @Input()
  usdToChf!: number;

  @Input()
  usdToGbp!: number;

  @Input()
  usdToAud!: number;

  @Input()
  fiat!: string;

  @Input()
  poolBtc!: Pool;

  @Input()
  poolEth!: Pool;

  @Input()
  poolUsdt!: Pool;

  @Input()
  poolLtc!: Pool;

  @Input()
  poolDoge!: Pool;

  @Input()
  poolBch!: Pool;

  @Input()
  hideHoldings: boolean;

  detailsOpen = false;

  ngOnInit(): void {
    this.buildDataForChart();
    this.buildDataForChartValue();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChart();
    this.buildDataForChartValue();
  }

  getAnteilWalletOfAllValue(): number {
    return this.getWalletValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getWalletValueUsd(): number {
    return this.getDfiCountWalletUsd() + this.getBtcWalletValueUsd() + this.getEthWalletValueUsd() +
      this.getUsdtWalletValueUsd() + this.getLtcWalletValueUsd() + this.getDogeWalletValueUsd() + this.getBchWalletValueUsd();
  }

  getDfiCountWalletUsd(): number {
    return this.wallet?.dfi * this.poolBtc?.priceB;
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd();
  }

  getBtcValueUsd(): number {
    return (this.wallet.btcInBtcPool + this.wallet.btc) * this.poolBtc?.priceA;
  }

  getBtcWalletValueUsd(): number {
    return this.wallet.btc * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet.ethInEthPool + this.wallet.eth) * this.poolEth?.priceA;
  }

  getEthWalletValueUsd(): number {
    return  this.wallet.eth * this.poolEth?.priceA;
  }


  getUsdtValueUsd(): number {
    return (this.wallet.usdtInUsdtPool + this.wallet.usdt) * this.poolUsdt?.priceA;
  }

  getUsdtWalletValueUsd(): number {
    return this.wallet.usdt * this.poolUsdt?.priceA;
  }

  getLtcValueUsd(): number {
    return (this.wallet.ltcInLtcPool + this.wallet.ltc) * this.poolLtc?.priceA;
  }

  getLtcWalletValueUsd(): number {
    return this.wallet.ltc * this.poolLtc?.priceA;
  }

  getDogeValueUsd(): number {
    return (this.wallet.dogeInDogePool + this.wallet.doge) * this.poolDoge?.priceA;
  }

  getDogeWalletValueUsd(): number {
    return this.wallet.doge * this.poolDoge?.priceA;
  }

  getBchValueUsd(): number {
    return (this.wallet.bchInBchPool + this.wallet.bch) * this.poolBch?.priceA;
  }

  getBchWalletValueUsd(): number {
    return this.wallet.bch * this.poolBch?.priceA;
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.dfiInStaking;
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInLtcPool
      + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool;
  }

  buildDataForChartValue(): void {

    this.chartOptions3 = {

      series: this.getSeriesValue(),

      labels: this.getLabelsValue(),
      colors: this.getColorsValue(),
      chart: {
        width: '100%',
        type: 'donut'
      },
      dataLabels: {
        enabled: true
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
              width: '100%'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

  }

  getSeriesValue(): Array<number> {

    const incomeNumbers = new Array<number>();

    if (this.getWalletValueUsd() > 0) {
      incomeNumbers.push(Math.round(this.getWalletValueUsd() * 100) / 100);
    }
    if (this.getStakingValueUsd() > 0) {
      incomeNumbers.push(Math.round(this.getStakingValueUsd() * 100) / 100);
    }
    if (this.getAnteilLMOfBtcPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfBtcPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfEthPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfEthPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfLtcPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfLtcPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfDogePoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfDogePoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfBchPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfBchPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfUsdtPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfUsdtPoolValue() * 100) / 100);
    }

    return incomeNumbers;
  }

  getAnteilLMOfBtcPoolValue(): number {
    return ((this.wallet.dfiInBtcPool * this.poolBtc?.priceB) + (this.wallet.btcInBtcPool * this.poolBtc?.priceA));
  }

  getAnteilLMOfEthPoolValue(): number {
    return ((this.wallet.dfiInEthPool * this.poolEth?.priceB) + (this.wallet.ethInEthPool * this.poolEth?.priceA));
  }

  getAnteilLMOfLtcPoolValue(): number {
    return ((this.wallet.dfiInLtcPool * this.poolLtc?.priceB) + (this.wallet.ltcInLtcPool * this.poolLtc?.priceA));
  }

  getAnteilLMOfUsdtPoolValue(): number {
    return ((this.wallet.dfiInUsdtPool * this.poolUsdt?.priceB) + (this.wallet.usdtInUsdtPool * this.poolUsdt?.priceA));
  }
  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolDoge?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }

  getAnteilLMOfBchPoolValue(): number {
    return ((this.wallet.dfiInBchPool * this.poolBch?.priceB) + (this.wallet.bchInBchPool * this.poolBch?.priceA));
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd();
  }

  getLabelsValue(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.getAnteilWalletOfAllValue() > 0) {
      incomeNumbers.push('Wallet ');
    }
    if (this.getAnteilStakingOfAllValue() > 0) {
      incomeNumbers.push('Staking ');
    }
    if (this.getAnteilLMOfBtcPoolValue() > 0) {
      incomeNumbers.push('BTC-Pool ');
    }
    if (this.getAnteilLMOfEthPoolValue() > 0) {
      incomeNumbers.push('ETH-Pool ');
    }
    if (this.getAnteilLMOfLtcPoolValue() > 0) {
      incomeNumbers.push('LTC-Pool ');
    }
    if (this.getAnteilLMOfDogePoolValue() > 0) {
      incomeNumbers.push('DOGE-Pool ');
    }
    if (this.getAnteilLMOfBchPoolValue() > 0) {
      incomeNumbers.push('BCH-Pool ');
    }
    if (this.getAnteilLMOfUsdtPoolValue() > 0) {
      incomeNumbers.push('USDT-Pool ');
    }

    return incomeNumbers;
  }

  getColorsValue(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.getAnteilWalletOfAllValue() > 0) {
      incomeNumbers.push('#1ab7ea');
    }
    if (this.getAnteilStakingOfAllValue() > 0) {
      incomeNumbers.push('#ff00af');
    }
    if (this.getAnteilLMOfBtcPoolValue() > 0) {
      incomeNumbers.push('#ff9900');
    }
    if (this.getAnteilLMOfEthPoolValue() > 0) {
      incomeNumbers.push('#3c3c3d');
    }
    if (this.getAnteilLMOfLtcPoolValue() > 0) {
      incomeNumbers.push('#b8b8b8');
    }
    if (this.getAnteilLMOfDogePoolValue() > 0) {
      incomeNumbers.push('#cb9800');
    }
    if (this.getAnteilLMOfBchPoolValue() > 0) {
      incomeNumbers.push('#4CC947');
    }
    if (this.getAnteilLMOfUsdtPoolValue() > 0) {
      incomeNumbers.push('#26a17b');
    }

    return incomeNumbers;
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

    const dataBch = new Data();
    dataBch.name = 'BCH';
    dataBch.value = this.getBchValueUsd();

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd();

    this.chartOptions = {
      series: this.getSeriesOverallValue(dataBtc, dataEth, dataUsdt, dataLtc, dataDoge, dataBch, dataDfi),
      colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataLtc, dataDoge, dataBch, dataDfi),
      labels: this.getLabelsOverallValue(dataBtc, allValue, dataEth, dataUsdt, dataLtc, dataDoge, dataBch, dataDfi),
      chart: {
        width: '100%',
        type: 'donut'
      },
      dataLabels: {
        enabled: true
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
              width: '100%'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  private getSeriesOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataLtc: Data, dataDoge: Data, dataBch: Data,
                                dataDfi: Data): Array<number> {
    const incomeNumbers = new Array<number>();

    if (dataBtc.value > 0) {
      incomeNumbers.push(+dataBtc.value.toFixed(2));
    }
    if (dataEth.value > 0) {
      incomeNumbers.push(+dataEth.value.toFixed(2));
    }
    if (dataUsdt.value > 0) {
      incomeNumbers.push(+dataUsdt.value.toFixed(2));
    }
    if (dataLtc.value > 0) {
      incomeNumbers.push(+dataLtc.value.toFixed(2));
    }
    if (dataDoge.value > 0) {
      incomeNumbers.push(+dataDoge.value.toFixed(2));
    }
    if (dataBch.value > 0) {
      incomeNumbers.push(+dataBch.value.toFixed(2));
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push(+dataDfi.value.toFixed(2));
    }

    return incomeNumbers;
  }

  private getColorsOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataLtc: Data, dataDoge: Data, dataBch: Data,
                                dataDfi: Data): Array<string> {
    const incomeNumbers = new Array<string>();

    if (dataBtc.value > 0) {
      incomeNumbers.push('#ff9900');
    }
    if (dataEth.value > 0) {
      incomeNumbers.push('#3c3c3d');
    }
    if (dataUsdt.value > 0) {
      incomeNumbers.push('#26a17b');
    }
    if (dataLtc.value > 0) {
      incomeNumbers.push('#b8b8b8');
    }
    if (dataDoge.value > 0) {
      incomeNumbers.push('#cb9800');
    }
    if (dataBch.value > 0) {
      incomeNumbers.push('#4CC947');
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push('#ff00af');
    }

    return incomeNumbers;
  }

  private getLabelsOverallValue(dataBtc: Data, allValue: number, dataEth: Data, dataUsdt: Data, dataLtc: Data, dataDoge: Data,
                                dataBch: Data, dataDfi: Data): Array<string> {

    const incomeNumbers = new Array<string>();
    if (this.getAnteilPortfolioForChart(dataBtc, allValue) > 0) {
      incomeNumbers.push('BTC ' + this.getAnteilPortfolioForChart(dataBtc, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataEth, allValue) > 0) {
      incomeNumbers.push('ETH ' + this.getAnteilPortfolioForChart(dataEth, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsdt, allValue) > 0) {
      incomeNumbers.push('USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataLtc, allValue) > 0) {
      incomeNumbers.push('LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDoge, allValue) > 0) {
      incomeNumbers.push('DOGE ' + this.getAnteilPortfolioForChart(dataDoge, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBch, allValue) > 0) {
      incomeNumbers.push('BCH ' + this.getAnteilPortfolioForChart(dataBch, allValue) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDfi, allValue) > 0) {
      incomeNumbers.push('DFI ' + this.getAnteilPortfolioForChart(dataDfi, allValue) + '%');
    }
    return incomeNumbers;
  }

  getAnteilPortfolioForChart(data: Data, allValue: number): number {
    return +(data.value / allValue * 100).toFixed(5);
  }

  handleDetails(): void {
    this.detailsOpen = !this.detailsOpen;
  }
}
