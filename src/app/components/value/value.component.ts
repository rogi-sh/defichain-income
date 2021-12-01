import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {AddressBalance, Pool} from '@interfaces/Dex';
import { AddressVaults, ChartOptions, ChartOptions3, Data, Wallet } from '@interfaces/Data';
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
  fiat!: string;

  @Input()
  poolBtc!: Pool;

  @Input()
  poolEth!: Pool;

  @Input()
  poolUsdt!: Pool;

  @Input()
  poolUsdc!: Pool;

  @Input()
  poolLtc!: Pool;

  @Input()
  poolDoge!: Pool;

  @Input()
  poolBch!: Pool;

  @Input()
  poolUsd!: Pool;

  @Input()
  poolTsla!: Pool;

  @Input()
  hideHoldings: boolean;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  adressBalances!: AddressBalance [];

  @Input()
  freezer5!: string [];

  @Input()
  freezer10!: string [];

  @Input()
  vaultsOfAllAddresses: Array<AddressVaults>;

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
      this.getUsdtWalletValueUsd() + this.getLtcWalletValueUsd() + this.getDogeWalletValueUsd() + this.getBchWalletValueUsd()
      + this.getUsdWalletValueUsd() + this.getTslaWalletValueUsd();
  }

  getDfiCountWalletUsd(): number {
    return this.getDfiCountWallet() * this.poolBtc?.priceB;
  }

  getDfiCountWallet(): number {
    return this.wallet?.dfi - this.getDfiCountVaults();
  }

  getDfiCountVaults(): number {
    let dfiInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return dfiInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault.collateralAmounts.forEach(vaultCollaterral => {
          if ('DFI' === vaultCollaterral.symbolKey) {
              dfiInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults;
  }

  getMasternodeDfiUsd(): number {
    return (this.wallet?.dfiInMasternodes - this.getFreezerDfiCount()) * this.poolBtc?.priceB;
  }

  getAllValuesUsdPrice(): number {
    return this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getLtcValueUsd()
      + this.getDogeValueUsd() + this.getBchValueUsd() + this.getUsdValueUsd() + this.getTslaValueUsd() + this.getDfiValueUsd();
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

  getUsdcValueUsd(): number {
    return (this.wallet.usdcInUsdcPool + this.wallet.usdc) * this.poolUsdc?.priceA;
  }

  isUsdInPortfolio(): boolean {
    return this.wallet?.usd > 0 || this.wallet?.usdInUsdPool > 0 || this.wallet?.usdInTslaPool > 0;
  }

  getUsdCount(): number {
    return this.wallet?.usdInUsdPool + this.wallet?.usd + this.wallet?.usdInTslaPool;
  }

  getUsdValueUsd(): number {
    return this.getUsdCount() * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  getTslaValueUsd(): number {
    return (this.wallet?.tslaInTslaPool + this.wallet?.tsla) * this.getUsdPriceOfStockPools(this.poolTsla);
  }

  getUsdPriceOfStockPools(pool: Pool): number {
    return pool ? pool?.totalLiquidityUsd / 2 / +pool?.reserveA : 0;
  }

  getUsdtWalletValueUsd(): number {
    return this.wallet.usdt * this.poolUsdt?.priceA;
  }

  getUsdcWalletValueUsd(): number {
    return this.wallet.usdc * this.poolUsdc?.priceA;
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

  getUsdWalletValueUsd(): number {
    return this.wallet.usd * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  getTslaWalletValueUsd(): number {
    return this.wallet.tsla * this.getUsdPriceOfStockPools(this.poolTsla);
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet.dfiInUsdPool
      + this.dfiInStaking + this.wallet.dfiInMasternodes;
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilMasternodesOfAllValue(): number {
    return this.getMasternodeDfiUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd()
      + this.getUsdValueUsd() + this.getTslaValueUsd())
      / this.getAllValuesUsdPrice() * 100;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet.dfiInUsdPool;
  }

  getFreezerDfiCount(): number {
    let dfi = 0;
    this.freezer5?.forEach(a => {
      dfi += this.adressBalances.find(p => p.address === a)?.dfiCoins;
    });

    this.freezer10?.forEach(a => {
      dfi += this.adressBalances.find(p => p.address === a)?.dfiCoins;
    });

    return dfi;
  }

  getFreezerDfiUsd(): number {
    return this.getFreezerDfiCount() * this.poolBtc?.priceB;
  }

  buildDataForChartValue(): void {

    this.chartOptions3 = {

      series: this.getSeriesValue(),

      labels: this.getLabelsValue(),
      colors: this.getColorsValue(),
      chart: {
        width: '100%',
        type: 'donut',
        background: 'transparent'
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
    if (this.getMasternodeDfiUsd() > 0) {
      incomeNumbers.push(Math.round(this.getMasternodeDfiUsd() * 100) / 100);
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
    if (this.getAnteilLMOfUsdcPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfUsdcPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfUsdPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfUsdPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfTslaPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfTslaPoolValue() * 100) / 100);
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
  getAnteilLMOfUsdcPoolValue(): number {
    return ((this.wallet.dfiInUsdcPool * this.poolUsdc?.priceB) + (this.wallet.usdcInUsdcPool * this.poolUsdc?.priceA));
  }
  getAnteilLMOfUsdPoolValue(): number {
    return ((this.wallet.dfiInUsdPool * this.poolUsd?.priceB) + (this.wallet.usdInUsdPool * this.getUsdPriceOfStockPools(this.poolUsd)));
  }
  getAnteilLMOfTslaPoolValue(): number {
    return ((this.wallet.usdInTslaPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.tslaInTslaPool * this.getUsdPriceOfStockPools(this.poolTsla)));
  }
  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolDoge?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }

  getAnteilLMOfBchPoolValue(): number {
    return ((this.wallet.dfiInBchPool * this.poolBch?.priceB) + (this.wallet.bchInBchPool * this.poolBch?.priceA));
  }

  getLMUsd(): number {
    return this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd()  + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd();
  }

  getLabelsValue(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.getAnteilWalletOfAllValue() > 0) {
      incomeNumbers.push('Wallet ');
    }
    if (this.getAnteilStakingOfAllValue() > 0) {
      incomeNumbers.push('Staking ');
    }
    if (this.getAnteilMasternodesOfAllValue() > 0) {
      incomeNumbers.push('Masternode ');
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
    if (this.getAnteilLMOfUsdcPoolValue() > 0) {
      incomeNumbers.push('USDC-Pool ');
    }
    if (this.getAnteilLMOfUsdPoolValue() > 0) {
      incomeNumbers.push('USD-Pool ');
    }
    if (this.getAnteilLMOfTslaPoolValue() > 0) {
      incomeNumbers.push('TSLA-Pool ');
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
    if (this.getAnteilMasternodesOfAllValue() > 0) {
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
    if (this.getAnteilLMOfUsdcPoolValue() > 0) {
      incomeNumbers.push('#2875C9');
    }
    if (this.getAnteilLMOfUsdPoolValue() > 0) {
      incomeNumbers.push('#6B8068');
    }
    if (this.getAnteilLMOfTslaPoolValue() > 0) {
      incomeNumbers.push('#cc0000');
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

    const dataUsdc = new Data();
    dataUsdc.name = 'USDC';
    dataUsdc.value = this.getUsdcValueUsd();

    const dataUsd = new Data();
    dataUsd.name = 'USD';
    dataUsd.value = this.getUsdValueUsd();

    const dataLtc = new Data();
    dataLtc.name = 'LTC';
    dataLtc.value = this.getLtcValueUsd();

    const dataDoge = new Data();
    dataDoge.name = 'DOGE';
    dataDoge.value = this.getDogeValueUsd();

    const dataBch = new Data();
    dataBch.name = 'BCH';
    dataBch.value = this.getBchValueUsd();

    const dataTsla = new Data();
    dataTsla.name = 'TSLA';
    dataTsla.value = this.getTslaValueUsd();

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd();

    this.chartOptions = {
      series: this.getSeriesOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla, dataDfi),
      colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla, dataDfi),
      labels: this.getLabelsOverallValue(dataBtc, allValue, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge,
        dataBch, dataTsla, dataDfi),
      chart: {
        width: '100%',
        type: 'donut',
        background: 'transparent'
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

  private getSeriesOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataUsdc: Data, dataUsd: Data,
                                dataLtc: Data, dataDoge: Data, dataBch: Data, dataTsla: Data, dataDfi: Data): Array<number> {
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
    if (dataUsdc.value > 0) {
      incomeNumbers.push(+dataUsdc.value.toFixed(2));
    }
    if (dataUsd.value > 0) {
      incomeNumbers.push(+dataUsd.value.toFixed(2));
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
    if (dataTsla.value > 0) {
      incomeNumbers.push(+dataTsla.value.toFixed(2));
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push(+dataDfi.value.toFixed(2));
    }

    return incomeNumbers;
  }

  private getColorsOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataUsdc: Data, dataUsd: Data, dataLtc: Data,
                                dataDoge: Data, dataBch: Data, dataTsla: Data, dataDfi: Data): Array<string> {
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
    if (dataUsdc.value > 0) {
      incomeNumbers.push('#2875C9');
    }
    if (dataUsd.value > 0) {
      incomeNumbers.push('#6B8068');
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
    if (dataTsla.value > 0) {
      incomeNumbers.push('#cc0000');
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push('#ff00af');
    }

    return incomeNumbers;
  }

  private getLabelsOverallValue(dataBtc: Data, allValue: number, dataEth: Data, dataUsdt: Data, dataUsdc: Data,
                                dataUsd: Data, dataLtc: Data, dataDoge: Data, dataBch: Data, dataTsla: Data,
                                dataDfi: Data): Array<string> {

    const incomeNumbers = new Array<string>();
    if (this.getAnteilPortfolioForChart(dataBtc, allValue) > 0) {
      incomeNumbers.push('BTC ' + this.getAnteilPortfolioForChart(dataBtc, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataEth, allValue) > 0) {
      incomeNumbers.push('ETH ' + this.getAnteilPortfolioForChart(dataEth, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsdt, allValue) > 0) {
      incomeNumbers.push('USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsdc, allValue) > 0) {
      incomeNumbers.push('USDC ' + this.getAnteilPortfolioForChart(dataUsdc, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsd, allValue) > 0) {
      incomeNumbers.push('USD ' + this.getAnteilPortfolioForChart(dataUsd, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataLtc, allValue) > 0) {
      incomeNumbers.push('LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDoge, allValue) > 0) {
      incomeNumbers.push('DOGE ' + this.getAnteilPortfolioForChart(dataDoge, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBch, allValue) > 0) {
      incomeNumbers.push('BCH ' + this.getAnteilPortfolioForChart(dataBch, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataTsla, allValue) > 0) {
      incomeNumbers.push('TSLA ' + this.getAnteilPortfolioForChart(dataTsla, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDfi, allValue) > 0) {
      incomeNumbers.push('DFI ' + this.getAnteilPortfolioForChart(dataDfi, allValue).toFixed(5) + '%');
    }
    return incomeNumbers;
  }

  getAnteilPortfolioForChart(data: Data, allValue: number): number {
    return +(data.value / allValue * 100);
  }

  handleDetails(): void {
    this.detailsOpen = !this.detailsOpen;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }
}
