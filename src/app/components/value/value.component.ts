import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {AddressBalance, Pool} from '@interfaces/Dex';
import { AddressVaults, ChartOptions, ChartOptions3, Data, Vault, Wallet } from '@interfaces/Data';
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
  poolQqq!: Pool;

  @Input()
  poolSpy!: Pool;

  @Input()
  poolPltr!: Pool;

  @Input()
  poolSlv!: Pool;

  @Input()
  poolAapl!: Pool;

  @Input()
  poolGld!: Pool;

  @Input()
  poolGme!: Pool;

  @Input()
  poolGoogl!: Pool;

  @Input()
  poolArkk!: Pool;

  @Input()
  poolBaba!: Pool;

  @Input()
  poolVnq!: Pool;

  @Input()
  poolUrth!: Pool;

  @Input()
  poolTlt!: Pool;

  @Input()
  poolPdbc!: Pool;

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

  @Input()
  getAllValuesUsdPrice: number;

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
    return this.getWalletValueUsd() / this.getAllValuesUsdPrice * 100;
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

  getBtcCountVaults(): number {
    let dfiInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return dfiInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault.collateralAmounts.forEach(vaultCollaterral => {
          if ('BTC' === vaultCollaterral.symbolKey) {
            dfiInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults;
  }

  getUsdtCountVaults(): number {
    let dfiInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return dfiInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault.collateralAmounts.forEach(vaultCollaterral => {
          if ('USDT' === vaultCollaterral.symbolKey) {
            dfiInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults;
  }

  getUsdcCountVaults(): number {
    let dfiInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return dfiInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault.collateralAmounts.forEach(vaultCollaterral => {
          if ('USDC' === vaultCollaterral.symbolKey) {
            dfiInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return dfiInVaults;
  }

  getAllVaultsFromAllAddresses(): Array<Vault> {

    const vaults = new Array<Vault>();
    if (this.vaultsOfAllAddresses.length === 0) {
      return vaults;
    }

    this.vaultsOfAllAddresses.forEach(va => {
      vaults.push(...va.data);
    });

    return vaults;

  }

  getShortOfId(id: string): string {
    const first = id.slice(0, 5);
    const last = id.slice(id.length - 6, id.length - 1);

    return first + '...' + last;
  }

  getMasternodeDfiUsd(): number {
    return (this.wallet?.dfiInMasternodes - this.getFreezerDfiCount()) * this.poolBtc?.priceB;
  }

  // WALLET AND POOLS CRYPTO
  getBtcValueUsd(): number {
    return (this.wallet.btcInBtcPool + this.wallet.btc) * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet.ethInEthPool + this.wallet.eth) * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.wallet.usdtInUsdtPool + this.wallet.usdt) * this.poolUsdt?.priceA;
  }

  getUsdcValueUsd(): number {
    return (this.wallet.usdcInUsdcPool + this.wallet.usdc) * this.poolUsdc?.priceA;
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

  isUsdInPortfolio(): boolean {
    return this.wallet?.usd > 0 || this.wallet?.usdInUsdPool > 0 || this.wallet?.usdInTslaPool > 0 ||
      this.wallet?.usdInSpyPool > 0 || this.wallet?.usdInQqqPool > 0 || this.wallet?.usdInPltrPool > 0
      || this.wallet?.usdInSlvPool > 0 || this.wallet?.usdInAaplPool > 0 || this.wallet?.usdInGldPool > 0
      || this.wallet?.usdInGmePool > 0 || this.wallet?.usdInGooglPool > 0 || this.wallet?.usdInArkkPool > 0
      || this.wallet?.usdInBabaPool > 0 || this.wallet?.usdInVnqPool > 0 || this.wallet?.usdInUrthPool > 0
      || this.wallet?.usdInTltPool > 0 || this.wallet?.usdInPdbcPool > 0;
  }

  getUsdCount(): number {
    return this.wallet?.usdInUsdPool + this.wallet?.usd + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
      + this.wallet?.usdInQqqPool  + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
      + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
      + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
      + this.wallet?.usdInPdbcPool;
  }

  getUsdValueUsd(): number {
    return this.getUsdCount() * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  //  WALLET AND POOLS STOCKS
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

  // WALLETS HOLDINGS
  getWalletValueUsd(): number {
    return this.getDfiCountWalletUsd() + this.getBtcWalletValueUsd() + this.getEthWalletValueUsd() +
      this.getUsdtWalletValueUsd() + this.getLtcWalletValueUsd() + this.getDogeWalletValueUsd() + this.getBchWalletValueUsd()
      + this.getUsdWalletValueUsd() + this.getTslaWalletValueUsd() + this.getSpyWalletValueUsd() + this.getQqqWalletValueUsd()
      + this.getPltrWalletValueUsd() + this.getSlvWalletValueUsd() + this.getAaplWalletValueUsd() + this.getGldWalletValueUsd()
      + this.getGmeWalletValueUsd() + this.getGooglWalletValueUsd() + this.getArkkWalletValueUsd() + this.getBabaWalletValueUsd()
      + this.getVnqWalletValueUsd() + this.getUrthWalletValueUsd() + this.getTltWalletValueUsd() + this.getPdbcWalletValueUsd();
  }

  getDfiCountWalletUsd(): number {
    return this.getDfiCountWallet() * this.poolBtc?.priceB;
  }

  getDfiCountWallet(): number {
    return this.wallet?.dfi;
  }

  getEthWalletValueUsd(): number {
    return  this.wallet.eth * this.poolEth?.priceA;
  }

  getBtcWalletValueUsd(): number {
    return this.wallet.btc * this.poolBtc?.priceA;
  }

  getBchWalletValueUsd(): number {
    return this.wallet.bch * this.poolBch?.priceA;
  }

  getUsdtWalletValueUsd(): number {
    return this.wallet.usdt * this.poolUsdt?.priceA;
  }

  getUsdcWalletValueUsd(): number {
    return this.wallet.usdc * this.poolUsdc?.priceA;
  }

  getDogeWalletValueUsd(): number {
    return this.wallet.doge * this.poolDoge?.priceA;
  }

  getUsdWalletValueUsd(): number {
    return this.wallet.usd * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  getLtcWalletValueUsd(): number {
    return this.wallet.ltc * this.poolLtc?.priceA;
  }

  getTslaWalletValueUsd(): number {
    return this.wallet.tsla * this.getUsdPriceOfStockPools(this.poolTsla);
  }

  getSpyWalletValueUsd(): number {
    return this.wallet?.spy * this.getUsdPriceOfStockPools(this.poolSpy);
  }
  getQqqWalletValueUsd(): number {
    return  this.wallet?.qqq * this.getUsdPriceOfStockPools(this.poolQqq);
  }
  getPltrWalletValueUsd(): number {
    return  this.wallet?.pltr * this.getUsdPriceOfStockPools(this.poolPltr);
  }
  getSlvWalletValueUsd(): number {
    return this.wallet?.slv * this.getUsdPriceOfStockPools(this.poolSlv);
  }
  getAaplWalletValueUsd(): number {
    return  this.wallet?.aapl * this.getUsdPriceOfStockPools(this.poolAapl);
  }
  getGldWalletValueUsd(): number {
    return this.wallet?.gld * this.getUsdPriceOfStockPools(this.poolGld);
  }
  getGmeWalletValueUsd(): number {
    return this.wallet?.gme * this.getUsdPriceOfStockPools(this.poolGme);
  }
  getGooglWalletValueUsd(): number {
    return this.wallet?.googl * this.getUsdPriceOfStockPools(this.poolGoogl);
  }
  getArkkWalletValueUsd(): number {
    return this.wallet?.arkk * this.getUsdPriceOfStockPools(this.poolArkk);
  }
  getBabaWalletValueUsd(): number {
    return this.wallet?.baba * this.getUsdPriceOfStockPools(this.poolBaba);
  }
  getVnqWalletValueUsd(): number {
    return this.wallet?.vnq * this.getUsdPriceOfStockPools(this.poolVnq);
  }
  getUrthWalletValueUsd(): number {
    return this.wallet?.urth * this.getUsdPriceOfStockPools(this.poolUrth);
  }
  getTltWalletValueUsd(): number {
    return this.wallet?.tlt * this.getUsdPriceOfStockPools(this.poolTlt);
  }
  getPdbcWalletValueUsd(): number {
    return this.wallet?.pdbc * this.getUsdPriceOfStockPools(this.poolPdbc);
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
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice * 100;
  }

  getAnteilMasternodesOfAllValue(): number {
    return this.getMasternodeDfiUsd() / this.getAllValuesUsdPrice * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return (this.getDfiCountLMUsd() + this.getBtcValueUsd() + this.getEthValueUsd() + this.getLtcValueUsd()
      + this.getUsdtValueUsd() + this.getUsdcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd()
      + this.getUsdValueUsd() + this.getTslaValueUsd() + this.getSpyValueUsd()
        + this.getQqqValueUsd() + this.getPltrValueUsd() + this.getSlvValueUsd() + this.getAaplValueUsd() + this.getGldValueUsd()
        + this.getGmeValueUsd() + this.getGooglValueUsd() + this.getArkkValueUsd() + this.getBabaValueUsd()
        + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd() + this.getPdbcValueUsd() + this.getDfiValueUsd())
      / this.getAllValuesUsdPrice * 100;
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
    if (this.getAnteilLMOfQqqPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfQqqPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfSpyPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfSpyPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfPltrPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfPltrPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfSlvPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfSlvPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfAaplPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfAaplPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfGldPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfGldPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfGmePoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfGmePoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfGooglPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfGooglPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfArkkPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfArkkPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfBabaPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfBabaPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfVnqPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfVnqPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfUrthPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfUrthPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfTltPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfTltPoolValue() * 100) / 100);
    }
    if (this.getAnteilLMOfPdbcPoolValue() > 0) {
      incomeNumbers.push(Math.round(this.getAnteilLMOfPdbcPoolValue() * 100) / 100);
    }

    return incomeNumbers;
  }

  // ANTEIL CRYPTO
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
  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolDoge?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }
  getAnteilLMOfBchPoolValue(): number {
    return ((this.wallet.dfiInBchPool * this.poolBch?.priceB) + (this.wallet.bchInBchPool * this.poolBch?.priceA));
  }
  // ANTEIL STOCKS
  getAnteilLMOfUsdPoolValue(): number {
    return ((this.wallet.dfiInUsdPool * this.poolUsd?.priceB) + (this.wallet.usdInUsdPool * this.getUsdPriceOfStockPools(this.poolUsd)));
  }
  getAnteilLMOfTslaPoolValue(): number {
    return ((this.wallet.usdInTslaPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.tslaInTslaPool * this.getUsdPriceOfStockPools(this.poolTsla)));
  }
  getAnteilLMOfSpyPoolValue(): number {
    return ((this.wallet.usdInSpyPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.spyInSpyPool * this.getUsdPriceOfStockPools(this.poolSpy)));
  }
  getAnteilLMOfQqqPoolValue(): number {
    return ((this.wallet.usdInQqqPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.qqqInQqqPool * this.getUsdPriceOfStockPools(this.poolQqq)));
  }
  getAnteilLMOfPltrPoolValue(): number {
    return ((this.wallet.usdInPltrPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.pltrInPltrPool * this.getUsdPriceOfStockPools(this.poolPltr)));
  }
  getAnteilLMOfSlvPoolValue(): number {
    return ((this.wallet.usdInSlvPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.slvInSlvPool * this.getUsdPriceOfStockPools(this.poolSlv)));
  }
  getAnteilLMOfAaplPoolValue(): number {
    return ((this.wallet.usdInAaplPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.aaplInAaplPool * this.getUsdPriceOfStockPools(this.poolAapl)));
  }
  getAnteilLMOfGldPoolValue(): number {
    return ((this.wallet.usdInGldPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.gldInGldPool * this.getUsdPriceOfStockPools(this.poolGld)));
  }
  getAnteilLMOfGmePoolValue(): number {
    return ((this.wallet.usdInGmePool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.gmeInGmePool * this.getUsdPriceOfStockPools(this.poolGme)));
  }
  getAnteilLMOfGooglPoolValue(): number {
    return ((this.wallet.usdInGooglPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.googlInGooglPool * this.getUsdPriceOfStockPools(this.poolGoogl)));
  }
  getAnteilLMOfArkkPoolValue(): number {
    return ((this.wallet.usdInArkkPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.arkkInArkkPool * this.getUsdPriceOfStockPools(this.poolArkk)));
  }
  getAnteilLMOfBabaPoolValue(): number {
    return ((this.wallet.usdInBabaPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.babaInBabaPool * this.getUsdPriceOfStockPools(this.poolBaba)));
  }
  getAnteilLMOfVnqPoolValue(): number {
    return ((this.wallet.usdInVnqPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.vnqInVnqPool * this.getUsdPriceOfStockPools(this.poolVnq)));
  }
  getAnteilLMOfUrthPoolValue(): number {
    return ((this.wallet.usdInUrthPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.urthInUrthPool * this.getUsdPriceOfStockPools(this.poolUrth)));
  }
  getAnteilLMOfTltPoolValue(): number {
    return ((this.wallet.usdInTltPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.tltInTltPool * this.getUsdPriceOfStockPools(this.poolTlt)));
  }
  getAnteilLMOfPdbcPoolValue(): number {
    return ((this.wallet.usdInPdbcPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.pdbcInPdbcPool * this.getUsdPriceOfStockPools(this.poolPdbc)));
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
    if (this.getAnteilLMOfSpyPoolValue() > 0) {
      incomeNumbers.push('SPY-Pool ');
    }
    if (this.getAnteilLMOfQqqPoolValue() > 0) {
      incomeNumbers.push('QQQ-Pool ');
    }
    if (this.getAnteilLMOfPltrPoolValue() > 0) {
      incomeNumbers.push('PLTR-Pool ');
    }
    if (this.getAnteilLMOfSlvPoolValue() > 0) {
      incomeNumbers.push('SLV-Pool ');
    }
    if (this.getAnteilLMOfAaplPoolValue() > 0) {
      incomeNumbers.push('AAPL-Pool ');
    }
    if (this.getAnteilLMOfGldPoolValue() > 0) {
      incomeNumbers.push('GLD-Pool ');
    }
    if (this.getAnteilLMOfGmePoolValue() > 0) {
      incomeNumbers.push('GME-Pool ');
    }
    if (this.getAnteilLMOfGooglPoolValue() > 0) {
      incomeNumbers.push('GOOGL-Pool ');
    }
    if (this.getAnteilLMOfArkkPoolValue() > 0) {
      incomeNumbers.push('ARKK-Pool ');
    }
    if (this.getAnteilLMOfBabaPoolValue() > 0) {
      incomeNumbers.push('BABA-Pool ');
    }
    if (this.getAnteilLMOfVnqPoolValue() > 0) {
      incomeNumbers.push('VNQ-Pool ');
    }
    if (this.getAnteilLMOfUrthPoolValue() > 0) {
      incomeNumbers.push('URTH-Pool ');
    }
    if (this.getAnteilLMOfTltPoolValue() > 0) {
      incomeNumbers.push('TLT-Pool ');
    }
    if (this.getAnteilLMOfPdbcPoolValue() > 0) {
      incomeNumbers.push('PDBC-Pool ');
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
    if (this.getAnteilLMOfSpyPoolValue() > 0) {
      incomeNumbers.push('#87CEFA');
    }
    if (this.getAnteilLMOfQqqPoolValue() > 0) {
      incomeNumbers.push('#87CEEB');
    }
    if (this.getAnteilLMOfPltrPoolValue() > 0) {
      incomeNumbers.push('#47484a');
    }
    if (this.getAnteilLMOfSlvPoolValue() > 0) {
      incomeNumbers.push('#aaa9ad');
    }
    if (this.getAnteilLMOfAaplPoolValue() > 0) {
      incomeNumbers.push('#A2AAAD');
    }
    if (this.getAnteilLMOfGldPoolValue() > 0) {
      incomeNumbers.push('#FFD700');
    }
    if (this.getAnteilLMOfGmePoolValue() > 0) {
      incomeNumbers.push('#f84443');
    }
    if (this.getAnteilLMOfGooglPoolValue() > 0) {
      incomeNumbers.push('#4285F4');
    }
    if (this.getAnteilLMOfArkkPoolValue() > 0) {
      incomeNumbers.push('#00BFFF');
    }
    if (this.getAnteilLMOfBabaPoolValue() > 0) {
      incomeNumbers.push('#FF7300');
    }
    if (this.getAnteilLMOfVnqPoolValue() > 0) {
      incomeNumbers.push('#B0C4DE');
    }
    if (this.getAnteilLMOfUrthPoolValue() > 0) {
      incomeNumbers.push('#1E90FF');
    }
    if (this.getAnteilLMOfTltPoolValue() > 0) {
      incomeNumbers.push('#6495ED');
    }
    if (this.getAnteilLMOfPdbcPoolValue() > 0) {
      incomeNumbers.push('#1e1e1e');
    }

    return incomeNumbers;
  }

  buildDataForChart(): void {

    const allValue = this.getAllValuesUsdPrice;

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

    const dataSpy = new Data();
    dataSpy.name = 'SPY';
    dataSpy.value = this.getSpyValueUsd();

    const dataQqq = new Data();
    dataQqq.name = 'QQQ';
    dataQqq.value = this.getQqqValueUsd();

    const dataPltr = new Data();
    dataPltr.name = 'PLTR';
    dataPltr.value = this.getPltrValueUsd();

    const dataSLV = new Data();
    dataSLV.name = 'SLV';
    dataSLV.value = this.getSlvValueUsd();

    const dataAAPL = new Data();
    dataAAPL.name = 'AAPL';
    dataAAPL.value = this.getAaplValueUsd();

    const dataGLD = new Data();
    dataGLD.name = 'GLD';
    dataGLD.value = this.getGldValueUsd();

    const dataGME = new Data();
    dataGME.name = 'GME';
    dataGME.value = this.getGmeValueUsd();

    const dataGOOGL = new Data();
    dataGOOGL.name = 'GOOGL';
    dataGOOGL.value = this.getGooglValueUsd();

    const dataARKK = new Data();
    dataARKK.name = 'ARKK';
    dataARKK.value = this.getArkkValueUsd();

    const dataBABA = new Data();
    dataBABA.name = 'BABA';
    dataBABA.value = this.getBabaValueUsd();

    const dataVNQ = new Data();
    dataVNQ.name = 'VNQ';
    dataVNQ.value = this.getVnqValueUsd();

    const dataURTH = new Data();
    dataURTH.name = 'URTH';
    dataURTH.value = this.getUrthValueUsd();

    const dataTLT = new Data();
    dataTLT.name = 'TLT';
    dataTLT.value = this.getTltValueUsd();

    const dataPDBC = new Data();
    dataPDBC.name = 'PDBC';
    dataPDBC.value = this.getPdbcValueUsd();

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd();

    this.chartOptions = {
      series: this.getSeriesOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
        dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK,  dataBABA, dataVNQ, dataURTH,
        dataTLT, dataPDBC,  dataDfi),
      colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
        dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK,  dataBABA, dataVNQ, dataURTH,
        dataTLT, dataPDBC, dataDfi),
      labels: this.getLabelsOverallValue(dataBtc, allValue, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge,
        dataBch, dataTsla, dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK,  dataBABA,
        dataVNQ, dataURTH, dataTLT, dataPDBC, dataDfi),
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
                                dataLtc: Data, dataDoge: Data, dataBch: Data, dataTsla: Data,
                                dataSpy: Data, dataQqq: Data, dataPltr: Data, dataSLV: Data, dataAAPL: Data, dataGLD: Data,
                                dataGME: Data, dataGOOGL: Data, dataARKK: Data,  dataBABA: Data, dataVNQ: Data,
                                dataURTH: Data, dataTLT: Data, dataPDBC: Data, dataDfi: Data): Array<number> {
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
    if (dataSpy.value > 0) {
      incomeNumbers.push(+dataSpy.value.toFixed(2));
    }
    if (dataQqq.value > 0) {
      incomeNumbers.push(+dataQqq.value.toFixed(2));
    }
    if (dataPltr.value > 0) {
      incomeNumbers.push(+dataPltr.value.toFixed(2));
    }
    if (dataSLV.value > 0) {
      incomeNumbers.push(+dataSLV.value.toFixed(2));
    }
    if (dataAAPL.value > 0) {
      incomeNumbers.push(+dataAAPL.value.toFixed(2));
    }
    if (dataGLD.value > 0) {
      incomeNumbers.push(+dataGLD.value.toFixed(2));
    }
    if (dataGME.value > 0) {
      incomeNumbers.push(+dataGME.value.toFixed(2));
    }
    if (dataGOOGL.value > 0) {
      incomeNumbers.push(+dataGOOGL.value.toFixed(2));
    }
    if (dataARKK.value > 0) {
      incomeNumbers.push(+dataARKK.value.toFixed(2));
    }
    if (dataBABA.value > 0) {
      incomeNumbers.push(+dataBABA.value.toFixed(2));
    }
    if (dataVNQ.value > 0) {
      incomeNumbers.push(+dataVNQ.value.toFixed(2));
    }
    if (dataURTH.value > 0) {
      incomeNumbers.push(+dataURTH.value.toFixed(2));
    }
    if (dataTLT.value > 0) {
      incomeNumbers.push(+dataTLT.value.toFixed(2));
    }
    if (dataPDBC.value > 0) {
      incomeNumbers.push(+dataPDBC.value.toFixed(2));
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push(+dataDfi.value.toFixed(2));
    }

    return incomeNumbers;
  }

  private getColorsOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataUsdc: Data, dataUsd: Data, dataLtc: Data,
                                dataDoge: Data, dataBch: Data, dataTsla: Data, dataSpy: Data, dataQqq: Data, dataPltr: Data,
                                dataSLV: Data, dataAAPL: Data, dataGLD: Data, dataGME: Data, dataGOOGL: Data, dataARKK: Data,
                                dataBABA: Data, dataVNQ: Data, dataURTH: Data, dataTLT: Data, dataPDBC: Data,
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
    if (dataSpy.value > 0) {
      incomeNumbers.push('#87CEFA');
    }
    if (dataQqq.value > 0) {
      incomeNumbers.push('#87CEEB');
    }
    if (dataPltr.value > 0) {
      incomeNumbers.push('#47484a');
    }
    if (dataSLV.value > 0) {
      incomeNumbers.push('#aaa9ad');
    }
    if (dataAAPL.value > 0) {
      incomeNumbers.push('#A2AAAD');
    }
    if (dataGLD.value > 0) {
      incomeNumbers.push('#FFD700');
    }
    if (dataGME.value > 0) {
      incomeNumbers.push('#f84443');
    }
    if (dataGOOGL.value > 0) {
      incomeNumbers.push('#4285F4');
    }
    if (dataARKK.value > 0) {
      incomeNumbers.push('#00BFFF');
    }
    if (dataBABA.value > 0) {
      incomeNumbers.push('#FF7300');
    }
    if (dataVNQ.value > 0) {
      incomeNumbers.push('#B0C4DE');
    }
    if (dataURTH.value > 0) {
      incomeNumbers.push('#1E90FF');
    }
    if (dataTLT.value > 0) {
      incomeNumbers.push('#6495ED');
    }
    if (dataPDBC.value > 0) {
      incomeNumbers.push('#1e1e1e');
    }
    if (dataDfi.value > 0) {
      incomeNumbers.push('#ff00af');
    }

    return incomeNumbers;
  }

  private getLabelsOverallValue(dataBtc: Data, allValue: number, dataEth: Data, dataUsdt: Data, dataUsdc: Data,
                                dataUsd: Data, dataLtc: Data, dataDoge: Data, dataBch: Data, dataTsla: Data,
                                dataSpy: Data, dataQqq: Data, dataPltr: Data, dataSLV: Data, dataAAPL: Data, dataGLD: Data,
                                dataGME: Data, dataGOOGL: Data, dataARKK: Data,  dataBABA: Data, dataVNQ: Data,
                                dataURTH: Data, dataTLT: Data, dataPDBC: Data,  dataDfi: Data): Array<string> {

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
    if (this.getAnteilPortfolioForChart(dataSpy, allValue) > 0) {
      incomeNumbers.push('SPY ' + this.getAnteilPortfolioForChart(dataSpy, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataQqq, allValue) > 0) {
      incomeNumbers.push('QQQ ' + this.getAnteilPortfolioForChart(dataQqq, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPltr, allValue) > 0) {
      incomeNumbers.push('PLTR ' + this.getAnteilPortfolioForChart(dataPltr, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataSLV, allValue) > 0) {
      incomeNumbers.push('SLV ' + this.getAnteilPortfolioForChart(dataSLV, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataAAPL, allValue) > 0) {
      incomeNumbers.push('AAPL ' + this.getAnteilPortfolioForChart(dataAAPL, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGLD, allValue) > 0) {
      incomeNumbers.push('GLD ' + this.getAnteilPortfolioForChart(dataGLD, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGME, allValue) > 0) {
      incomeNumbers.push('GME ' + this.getAnteilPortfolioForChart(dataGME, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGOOGL, allValue) > 0) {
      incomeNumbers.push('GOOGL ' + this.getAnteilPortfolioForChart(dataGOOGL, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataARKK, allValue) > 0) {
      incomeNumbers.push('ARKK ' + this.getAnteilPortfolioForChart(dataARKK, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBABA, allValue) > 0) {
      incomeNumbers.push('BABA ' + this.getAnteilPortfolioForChart(dataBABA, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataVNQ, allValue) > 0) {
      incomeNumbers.push('VNQ ' + this.getAnteilPortfolioForChart(dataVNQ, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataURTH, allValue) > 0) {
      incomeNumbers.push('URTH ' + this.getAnteilPortfolioForChart(dataURTH, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataTLT, allValue) > 0) {
      incomeNumbers.push('TLT ' + this.getAnteilPortfolioForChart(dataTLT, allValue).toFixed(5) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPDBC, allValue) > 0) {
      incomeNumbers.push('PDBC ' + this.getAnteilPortfolioForChart(dataPDBC, allValue).toFixed(5) + '%');
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
