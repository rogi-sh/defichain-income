import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AddressBalance, Pool, Stats } from '@interfaces/Dex';
import {
  ChartOptions,
  Data,
  HoldingValue, Income,
  LoanValue, StockOracles,
  Vault,
} from '@interfaces/Data'
import { ChartComponent } from 'ng-apexcharts';
import { DataService } from '@services/data.service';
import { Dex } from '@services/dex.service';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
})
export class ValueComponent implements OnInit, OnChanges {

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input()
  income!: Income;

  @Input()
  dfiInStaking!: number;

  @Input()
  dfiInDfxStaking!: number;

  @Input()
  dfiInLockStaking!: number;

  @Input()
  dfiInMasternodes!: number;

  @Input()
  fiat!: string;

  @Input()
  pools!: Pool[];

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
  vaultsOfAllAddresses!: Array<Vault>;

  @Input()
  autoLoadData: boolean;

  @Input()
  currentPage: string;

  @Input()
  cexPrice!: number;

  oracleBlockBase = 1528800;

  collTokens: StockOracles;
  dusdFactor = 0;

  @Input()
  rewards: Stats;

  loanValues = new Array<LoanValue>();
  holdingValues = new Array<HoldingValue>();
  walletValues = new Array<HoldingValue>();
  lpTokensValues = new Array<HoldingValue>();
  colleteralTokensValues = new Array<HoldingValue>();

  constructor(private dataService: DataService, private dexService: Dex) {
  }

  ngOnInit(): void {
    this.loadColTokens();
    this.createLoanTokens();
    this.createHoldingTokens();
    this.createWalletTokens();
    this.createCollaterallTokens();
    this.createLpTokens();
    this.buildDataForChart();

  }

  loadColTokens(): void {
    this.dexService.getCollateralTokens()
      .subscribe(tokens => {
          this.collTokens = tokens;
          this.dusdFactor = +this.collTokens?.data?.find(a => a.token.id === '15').factor;
          this.createCollaterallTokens();
        },
        err => {
          console.error('Fehler beim load col tokens: ' + JSON.stringify(err.message));
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChart();
  }

  getVaultsLoansValueUsd(): number {
    let loan = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {

        loan += +this.getLoanFromVaultUsd(vault);
        loan += +vault.interestUsdValue;

    });

    return loan;
  }

  getVaultsCollateralUsd(): number {

    let total = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {

        total += this.getCollateralFromVaultUsd(vault);

    });

    return total;

  }


  getLoanFromVaultUsd(vault: Vault): number {

    let usd = 0;
    let total = 0;

    vault?.loans?.forEach(loan => {
      if ('DUSD' === loan.symbolKey) {
        usd = +loan.amount;
      } else {
        total = +loan.amount * +loan.activePrice.active.amount;
      }
    });

    return usd + total;
  }

  getNextLoanFromVaultUsd(vault) {

    let usd = 0;
    let total = 0;

    vault?.loanAmounts?.forEach(loan => {
      if ('DUSD' === loan.symbolKey) {
        usd = +loan.amount;
      } else {
        total = +loan.amount * +loan.activePrice.next.amount;
      }
    });

    return usd + total;
  }

  getBlockToNextOracle(): string {
    if (!this.rewards) {
      return '0';
    }

    const blocks = 120 - (this.rewards?.blockHeight - this.oracleBlockBase) % 120;
    const time = blocks * 30 / 60;
    return String(blocks) + ' Blocks  ~ ' + Math.round(time) + ' min';
  }

  getCollateralFromVaultUsd(vault: Vault): number {

    let dfiInVaults = 0;
    let dfiActualPrice = 0;
    let btcInVaults = 0;
    let btcActualPrice = 0;
    let ethInVaults = 0;
    let ethActualPrice = 0;
    let usdcInVaults = 0;
    let usdcActualPrice = 0;
    let usdtInVaults = 0;
    let usdtActualPrice = 0;
    let dusdInVaults = 0;

    if (!vault) {
      return 0;
    }

    vault?.collaterals?.forEach(vaultCollaterral => {
      if ('DFI' === vaultCollaterral.symbolKey) {
        dfiInVaults += +vaultCollaterral.amount;
        dfiActualPrice = +vaultCollaterral.activePrice?.active?.amount;
      } else if ('BTC' === vaultCollaterral.symbolKey) {
        btcInVaults += +vaultCollaterral.amount;
        btcActualPrice = +vaultCollaterral.activePrice?.active?.amount;
      } else if ('ETH' === vaultCollaterral.symbolKey) {
        ethInVaults += +vaultCollaterral.amount;
        ethActualPrice = +vaultCollaterral.activePrice?.active?.amount;
      } else if ('USDC' === vaultCollaterral.symbolKey) {
        usdcInVaults += +vaultCollaterral.amount;
        usdcActualPrice = +vaultCollaterral.activePrice?.active?.amount;
      } else if ('USDT' === vaultCollaterral.symbolKey) {
        usdtInVaults += +vaultCollaterral.amount;
        usdtActualPrice = +vaultCollaterral.activePrice?.active?.amount;
      } else if ('DUSD' === vaultCollaterral.symbolKey) {
        dusdInVaults += +vaultCollaterral.amount;
      }

    });

    return dfiInVaults * dfiActualPrice + btcInVaults * btcActualPrice + usdcInVaults * usdcActualPrice
      + usdtInVaults * usdtActualPrice + dusdInVaults * this.dusdFactor + ethInVaults * this.getPool('ETH')?.priceA;
  }

  getPool(name: string): Pool {
    return this.pools?.find(p => p.tokenASymbol === name);
  }


  getCollateralCountVaults(currency: string): number {
    let curInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0 || !currency ) {
      return curInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {

      vault?.collaterals?.forEach(vaultCollaterral => {
        if (currency === vaultCollaterral.symbolKey) {
          curInVaults += +vaultCollaterral.amount
        }
      })

    });

    return curInVaults;
  }

  getLoanCountVaults(currency: string): number {
    let loanInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0 || !currency ) {
      return loanInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {

      vault?.loans?.forEach(loan => {
        if (currency === loan.symbolKey) {
          loanInVaults += +loan.amount
        }

      })
    })

    return loanInVaults;
  }

  getLoanTokensFromVaults(): string[] {
    const tokens = [];

    if (this.vaultsOfAllAddresses.length === 0 ) {
      return tokens;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault?.loans?.forEach(loan => {
        if (tokens.findIndex(token => token === loan.symbolKey) === -1) {
          tokens.push(loan.symbolKey)
        }
      })
    })

    return tokens;
  }

  getAllVaultsFromAllAddresses(): Array<Vault> {

    const vaults = new Array<Vault>();
    if (this.vaultsOfAllAddresses.length === 0) {
      return vaults;
    }

    this.vaultsOfAllAddresses.sort((a, b) => (+a.collateralValue > +b.collateralValue) ? -1 : ((+b.collateralValue > +a.collateralValue) ? 1 : 0));

    return this.vaultsOfAllAddresses;

  }

  getShortOfId(id: string): string {

    if (!id) {
      return ""
    }

    const first = id.slice(0, 5);
    const last = id.slice(id.length - 5, id.length);

    return first + '...' + last;
  }

  getMasternodeDfiUsdWithoutFreeezer(): number {
    return (this.dfiInMasternodes - this.getFreezerDfiCount()) * this.getPool('BTC')?.priceB;
  }


  getUsdPriceOfStockPools(pool: Pool): number {

    if (pool && pool.id === '17') {
      return this.getDUSDPrice();
    }

    return pool ? pool?.totalLiquidityUsd / 2 / +pool?.reserveA : 0;
  }

  getDUSDPrice(): number {
    const dUsdPool = this.getPool('DUSD');

    if (!dUsdPool) {
      return 1;
    }

    const priceRateA = +dUsdPool.reserveB / +dUsdPool.reserveA;
    return this.getRound2(priceRateA * this.getPool('BTC')?.priceB);
  }

  getRound2(num: number): number {
    return Math.round((num) * 100) / 100;
  }

  getStakingValueUsd(): number {
    return this.getStakingValue() * this.getPool('BTC')?.priceB;
  }

  getStakingValue(): number {
    return this.dfiInStaking + this.dfiInDfxStaking + this.dfiInLockStaking;
  }

  getDfiCountWalletUsd(): number {
    return this.getDfiCountWallet() * this.getPool('BTC')?.priceB;
  }

  getDfiCountWallet(): number {
    return this.income.holdings?.find(h => h.id === "0")?.amount;
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.getPool('BTC')?.priceB;
  }

  getDfiPrice(): number {
      return this.getPool('BTC')?.priceB
  }

  getDfiInVaultUsd(): number {
    return this.getCollateralCountVaults('DFI') * this.getPool('BTC')?.priceB;
  }

  getDfiCount(): number {
    return this.income?.holdingsSplitted.find(h => h.id === "0")?.amount
      + this.dfiInStaking + this.dfiInDfxStaking + this.dfiInLockStaking
      + this.dfiInMasternodes + this.getCollateralCountVaults('DFI');
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.getPool('BTC')?.priceB;
  }

  getDfiCountLM(): number {
    return this.income?.holdingsSplitted.find(h => h.id === "0")?.amount - this.income.holdings.find(h => h.id === "0")?.amount;
  }

  getLoanTokens(): Array<LoanValue> {

    return this.loanValues.sort((a, b) =>
      (this.getLoanCountVaults(a.token) * this.getUsdPriceOfStockPools(a.pool) > this.getLoanCountVaults(b.token)
        * this.getUsdPriceOfStockPools(b.pool)) ? -1 : ((this.getLoanCountVaults(b.token)
        * this.getUsdPriceOfStockPools(b.pool) > this.getLoanCountVaults(a.token) * this.getUsdPriceOfStockPools(a.pool)) ? 1 : 0));
  }

  getHoldingTokens(): Array<HoldingValue> {

    return this.holdingValues.sort((a, b) => (a.holdingUsd > b.holdingUsd) ? -1
      : ((b.holdingUsd > a.holdingUsd) ? 1 : 0));
  }

  getWalletTokens(): Array<HoldingValue> {

    return this.walletValues.sort((a, b) => (a.holdingUsd > b.holdingUsd) ? -1
      : ((b.holdingUsd > a.holdingUsd) ? 1 : 0));
  }

  getLpTokens(): Array<HoldingValue> {

    return this.lpTokensValues.sort((a, b) => (a.holdingUsd > b.holdingUsd) ? -1
      : ((b.holdingUsd > a.holdingUsd) ? 1 : 0));
  }

  getCollateralTokens(): Array<HoldingValue> {

    return this.colleteralTokensValues.sort((a, b) => (a.holdingUsd > b.holdingUsd) ? -1
      : ((b.holdingUsd > a.holdingUsd) ? 1 : 0));
  }

  createLoanTokens(): void {

    this.loanValues = new Array<LoanValue>();

    this.getLoanTokensFromVaults().forEach(token => {
      this.loanValues.push(new LoanValue(token, this.getPool(token)));
    });
  }

  /**
   * All Tokens
   */
  createHoldingTokens(): void {

    this.holdingValues = new Array<HoldingValue>();

    this.income.holdingsSplitted.forEach(holding => {
      const colAmount = this.getCollateralCountVaults(holding.symbol);
      const pool =  this.getPool(holding.symbol);
      const price = this.getPrice(holding.id, holding.isLoanToken, pool);
      const colValue = colAmount * price;
      this.holdingValues.push(new HoldingValue(holding.symbol,
        holding.amount + colAmount, holding.usd + colValue));
    });

  }

  /**
   * Only wallet
   *
   */
  createWalletTokens(): void {

    this.walletValues = new Array<HoldingValue>();

    this.income.holdings.forEach(holding => {
      if (!holding.isLps) {
        const colAmount = this.getCollateralCountVaults(holding.symbol);
        const pool =  this.getPool(holding.symbol);
        const price = this.getPrice(holding.id, holding.isLoanToken, pool);
        const colValue = colAmount * price;
        this.walletValues.push(new HoldingValue(holding.symbol,
          holding.amount + colAmount, holding.usd + colValue));
      }
    });
  }


  /**
   * Only Collateral
   */
  createCollaterallTokens(): void {

    this.colleteralTokensValues = new Array<HoldingValue>();

    if (this.getCollateralCountVaults('BTC') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('BTC',
        this.getCollateralCountVaults('BTC'), this.getCollateralCountVaults('BTC') * this.getPool('BTC')?.priceA));
    }
    if (this.getCollateralCountVaults('ETH') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('ETH',
        this.getCollateralCountVaults('ETH'), this.getCollateralCountVaults('ETH') * this.getPool('ETH')?.priceA));
    }
    if (this.getCollateralCountVaults('USDC') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('USDC',
        this.getCollateralCountVaults('USDC'), this.getCollateralCountVaults('USDC') * this.getPool('USDC')?.priceA));
    }
    if (this.getCollateralCountVaults('USDT') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('USDT',
        this.getCollateralCountVaults('USDT'), this.getCollateralCountVaults('USDT') * this.getPool('USDT')?.priceA));
    }
    if (this.getCollateralCountVaults('DFI') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('DFI',
        this.getCollateralCountVaults('DFI'), this.getCollateralCountVaults('DFI') * this.getPool('BTC')?.priceB));
    }
    if (this.getCollateralCountVaults('DUSD') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('DUSD',
        this.getCollateralCountVaults('DUSD'), this.getCollateralCountVaults('DUSD') * this.dusdFactor));
    }

  }


  /**
   *
   * Holdings but only LM Tokens
   */
  createLpTokens(): void {

    this.lpTokensValues = new Array<HoldingValue>();

    this.income.holdings.forEach(holding => {
      if (holding.isLps) {
        this.lpTokensValues.push(new HoldingValue(holding.symbol,
          holding.amount, holding.usd));
      }
    });

  }

  getFreezerDfiCount(): number {
    let dfi = 0;
    this.freezer5?.forEach(a => {
      dfi += 20000;
    });

    this.freezer10?.forEach(a => {
      dfi += 20000;
    });

    return dfi;
  }

  getFreezerDfiUsd(): number {
    return this.getFreezerDfiCount() * this.getPool('BTC')?.priceB;
  }

  getPrice(tokenId: string, loanToken: boolean, pool: Pool): number {
    if (tokenId === "15") {
      return this.getDUSDPrice();
    } else if (tokenId === "0") {
      return this.getDfiPrice();
    } else if (loanToken) {
      return this.getUsdPriceOfStockPools(pool)
    } else {
      return pool?.priceA;
    }
  }

  buildDataForChart(): void {

    let allValue = 0;
    const dataList = [];

    this.income.holdingsSplitted.forEach(holding => {

      const colAmount = this.getCollateralCountVaults(holding.symbol);
      const pool =  this.getPool(holding.symbol);
      const price = this.getPrice(holding.id, holding.isLoanToken, pool);
      const colValue = colAmount * price;

      const data = new Data();
      data.name = holding.symbol;
      data.value = holding.usd + colValue;
      data.id = +holding.id;

      allValue += data.value;
      dataList.push(data);

    });

    this.chartOptions = {
      series: [{
        name: this.fiat,
        data: this.getSeriesOverallValue(dataList)
      }],
      chart: {
        width: '90%',
        height: '600',
        type: 'bar',
        background: 'transparent',
        animations: {
          enabled: false
        }
      },
      legend: {
        show: false,

      },
      colors: this.getColorsOverallValue(dataList),
      xaxis: {
        type: 'category',
        categories: this.getLabelsOverallValue(dataList, allValue),
        position: 'bottom',
        labels: {
          style: {
            colors: this.getColorsOverallValue(dataList),
            fontSize: '16px',
            fontWeight: 800
          },
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top' // top, center, bottom
          },
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 0.9,
        colors: this.getColorsOverallValue(dataList)
      },
    };
  }

  private getSeriesOverallValue(dataList: Array<Data>): Array<number> {
    const incomeNumbers = new Array<number>();

    dataList.forEach(data => {
      incomeNumbers.push( Number(data.value.toFixed(2)));
    });

    return incomeNumbers;
  }

  private getColorsOverallValue(dataList: Array<Data>): Array<string> {
    const incomeNumbers = new Array<string>();

    dataList.forEach(data => {
      incomeNumbers.push(this.dataService.getColorToken(data.id));
    });

    return incomeNumbers;
  }

  private getLabelsOverallValue(dataList: Array<Data>,  allValue: number): Array<string> {

    const incomeNumbers = new Array<string>();

    dataList.forEach(data => {
      incomeNumbers.push(data.name + ' ' + this.getAnteilPortfolioForChart(data, allValue).toFixed(1) + '%');
    });

    return incomeNumbers;
  }

  getAnteilPortfolioForChart(data: Data, allValue: number): number {
    return +(data.value / allValue * 100);
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }
}
