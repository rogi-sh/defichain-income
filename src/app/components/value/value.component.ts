import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AddressBalance, Pool, Stats } from '@interfaces/Dex';
import {
  AddressVaults,
  ChartOptions,
  Data,
  HoldingValue,
  LoanValue,
  Vault,
  Wallet,
} from '@interfaces/Data';
import { ChartComponent } from 'ng-apexcharts';
import { DataService } from '@services/data.service';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
})
export class ValueComponent implements OnInit, OnChanges {

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
  poolAmzn!: Pool;

  @Input()
  poolNvda!: Pool;

  @Input()
  poolCoin!: Pool;

  @Input()
  poolEem!: Pool;

  @Input()
  poolMsft!: Pool;

  @Input()
  poolNflx!: Pool;

  @Input()
  poolFb!: Pool;

  @Input()
  poolVoo!: Pool;

  @Input()
  poolDis!: Pool;

  @Input()
  poolMchi!: Pool;

  @Input()
  poolMstr!: Pool;

  @Input()
  poolIntc!: Pool;

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
  vaultsOfAllAddresses!: Array<AddressVaults>;

  @Input()
  autoLoadData: boolean;

  @Input()
  currentPage: string;

  @Input()
  cexPrice!: number;

  detailsOpen = false;

  oracleBlockBase = 1528800;

  @Input()
  rewards: Stats;

  loanValues = new Array<LoanValue>();
  holdingValues = new Array<HoldingValue>();
  walletValues = new Array<HoldingValue>();
  lpTokensValues = new Array<HoldingValue>();
  colleteralTokensValues = new Array<HoldingValue>();

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.createLoanTokens();
    this.createHoldingTokens();
    this.createWalletTokens();
    this.createCollaterallTokens();
    this.createLpTokens();
    this.buildDataForChart();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChart();
  }

  getAnteilWalletOfAllValue(): number {
    return this.getWalletValueUsd() / this.getAllValuesUsdPrice() * 100;
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

  getVaultsCollateralUsd(): number {

    let total = 0;

    if (this.vaultsOfAllAddresses.length === 0) {
      return 0;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        total += this.getCollateralFromVaultUsd(addressVault);
      });
    });

    return total;

  }


  getLoanFromVaultUsd(vault: Vault): number {

    let usd = 0; let spy = 0; let tsla = 0; let qqq = 0; let pltr = 0; let slv = 0; let aapl = 0; let gld = 0;
    let gme = 0; let google = 0; let arkk = 0; let baba = 0; let vnq = 0; let urth = 0; let tlt = 0;
    let pdbc = 0; let amzn = 0; let nvda = 0; let coin = 0; let eem = 0;
    let msft = 0; let nflx = 0; let fb = 0; let voo = 0;
    let dis = 0; let mchi = 0; let mstr = 0; let intc = 0;

    vault?.loanAmounts?.forEach(loan => {
        if ('DUSD' === loan.symbolKey) {
          usd = +loan.amount;
        } else if ('SPY' === loan.symbolKey) {
          spy = +loan.amount * +loan.activePrice.active.amount;
        } else if ('TSLA' === loan.symbolKey) {
          tsla = +loan.amount * +loan.activePrice.active.amount;
        } else if ('QQQ' === loan.symbolKey) {
          qqq = +loan.amount * +loan.activePrice.active.amount;
        } else if ('PLTR' === loan.symbolKey) {
          pltr = +loan.amount * +loan.activePrice.active.amount;
        } else if ('SLV' === loan.symbolKey) {
          slv = +loan.amount * +loan.activePrice.active.amount;
        } else if ('AAPL' === loan.symbolKey) {
          aapl = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GLD' === loan.symbolKey) {
          gld = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GME' === loan.symbolKey) {
          gme = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GOOGL' === loan.symbolKey) {
          google = +loan.amount * +loan.activePrice.active.amount;
        } else if ('ARKK' === loan.symbolKey) {
          arkk = +loan.amount * +loan.activePrice.active.amount;
        } else if ('BABA' === loan.symbolKey) {
          baba = +loan.amount * +loan.activePrice.active.amount;
        } else if ('VNQ' === loan.symbolKey) {
          vnq = +loan.amount * +loan.activePrice.active.amount;
        } else if ('URTH' === loan.symbolKey) {
          urth = +loan.amount * +loan.activePrice.active.amount;
        } else if ('TLT' === loan.symbolKey) {
          tlt = +loan.amount * +loan.activePrice.active.amount;
        } else if ('PDBC' === loan.symbolKey) {
          pdbc = +loan.amount * +loan.activePrice.active.amount;
        } else if ('AMZN' === loan.symbolKey) {
          amzn = +loan.amount * +loan.activePrice.active.amount;
        } else if ('NVDA' === loan.symbolKey) {
          nvda = +loan.amount * +loan.activePrice.active.amount;
        } else if ('COIN' === loan.symbolKey) {
          coin = +loan.amount * +loan.activePrice.active.amount;
        } else if ('EEM' === loan.symbolKey) {
          eem = +loan.amount * +loan.activePrice.active.amount;
        } else if ('MSFT' === loan.symbolKey) {
          msft = +loan.amount * +loan.activePrice.active.amount;
        } else if ('NFLX' === loan.symbolKey) {
          nflx = +loan.amount * +loan.activePrice.active.amount;
        } else if ('FB' === loan.symbolKey) {
          fb = +loan.amount * +loan.activePrice.active.amount;
        } else if ('VOO' === loan.symbolKey) {
          voo = +loan.amount * +loan.activePrice.active.amount;
        } else if ('DIS' === loan.symbolKey) {
          dis = +loan.amount * +loan.activePrice.active.amount;
        } else if ('MCHI' === loan.symbolKey) {
          mchi = +loan.amount * +loan.activePrice.active.amount;
        } else if ('MSTR' === loan.symbolKey) {
          mstr = +loan.amount * +loan.activePrice.active.amount;
        } else if ('INTC' === loan.symbolKey) {
          intc = +loan.amount * +loan.activePrice.active.amount;
        }
      });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx
      + fb + voo + dis + mchi + mstr + intc;
  }

  getNextLoanFromVaultUsd(vault: Vault): number {

    let usd = 0; let spy = 0; let tsla = 0; let qqq = 0; let pltr = 0; let slv = 0; let aapl = 0; let gld = 0;
    let gme = 0; let google = 0; let arkk = 0; let baba = 0; let vnq = 0; let urth = 0; let tlt = 0;
    let pdbc = 0; let amzn = 0; let nvda = 0; let coin = 0; let eem = 0;
    let msft = 0; let nflx = 0; let fb = 0; let voo = 0;
    let dis = 0; let mchi = 0; let mstr = 0; let intc = 0;

    vault?.loanAmounts?.forEach(loan => {
      if ('DUSD' === loan.symbolKey) {
        usd = +loan.amount;
      } else if ('SPY' === loan.symbolKey) {
        spy = +loan.amount * +loan.activePrice.next.amount;
      } else if ('TSLA' === loan.symbolKey) {
        tsla = +loan.amount * +loan.activePrice.next.amount;
      } else if ('QQQ' === loan.symbolKey) {
        qqq = +loan.amount * +loan.activePrice.next.amount;
      } else if ('PLTR' === loan.symbolKey) {
        pltr = +loan.amount * +loan.activePrice.next.amount;
      } else if ('SLV' === loan.symbolKey) {
        slv = +loan.amount * +loan.activePrice.next.amount;
      } else if ('AAPL' === loan.symbolKey) {
        aapl = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GLD' === loan.symbolKey) {
        gld = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GME' === loan.symbolKey) {
        gme = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GOOGL' === loan.symbolKey) {
        google = +loan.amount * +loan.activePrice.next.amount;
      } else if ('ARKK' === loan.symbolKey) {
        arkk = +loan.amount * +loan.activePrice.next.amount;
      } else if ('BABA' === loan.symbolKey) {
        baba = +loan.amount * +loan.activePrice.next.amount;
      } else if ('VNQ' === loan.symbolKey) {
        vnq = +loan.amount * +loan.activePrice.next.amount;
      } else if ('URTH' === loan.symbolKey) {
        urth = +loan.amount * +loan.activePrice.next.amount;
      } else if ('TLT' === loan.symbolKey) {
        tlt = +loan.amount * +loan.activePrice.next.amount;
      } else if ('PDBC' === loan.symbolKey) {
        pdbc = +loan.amount * +loan.activePrice.next.amount;
      } else if ('AMZN' === loan.symbolKey) {
        amzn = +loan.amount * +loan.activePrice.next.amount;
      } else if ('NVDA' === loan.symbolKey) {
        nvda = +loan.amount * +loan.activePrice.next.amount;
      } else if ('COIN' === loan.symbolKey) {
        coin = +loan.amount * +loan.activePrice.next.amount;
      } else if ('EEM' === loan.symbolKey) {
        eem = +loan.amount * +loan.activePrice.next.amount;
      } else if ('MSFT' === loan.symbolKey) {
        msft = +loan.amount * +loan.activePrice.next.amount;
      } else if ('NFLX' === loan.symbolKey) {
        nflx = +loan.amount * +loan.activePrice.next.amount;
      } else if ('FB' === loan.symbolKey) {
        fb = +loan.amount * +loan.activePrice.next.amount;
      } else if ('VOO' === loan.symbolKey) {
        voo = +loan.amount * +loan.activePrice.next.amount;
      } else if ('DIS' === loan.symbolKey) {
        dis = +loan.amount * +loan.activePrice.next.amount;
      } else if ('MCHI' === loan.symbolKey) {
        mchi = +loan.amount * +loan.activePrice.next.amount;
      } else if ('MSTR' === loan.symbolKey) {
        mstr = +loan.amount * +loan.activePrice.next.amount;
      } else if ('INTC' === loan.symbolKey) {
        intc = +loan.amount * +loan.activePrice.next.amount;
      }
    });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx
      + fb + voo + dis + mchi + mstr + intc;
  }

  getRatioNext(vault: Vault): number {
    return Math.round(this.getNextCollateralFromVaultUsd(vault) / this.getNextLoanFromVaultUsd(vault) * 100 * 100) / 100;
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
    const dusdActualPrice = 0.99;

    if (!vault) {
      return 0;
    }

    vault?.collateralAmounts?.forEach(vaultCollaterral => {
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
      + usdtInVaults * usdtActualPrice + dusdInVaults * dusdActualPrice + ethInVaults
    * this.poolEth?.priceA;
  }

  getNextCollateralFromVaultUsd(vault: Vault): number {

    let dfiInVaults = 0;
    let dfiNextPrice = 0;
    let btcInVaults = 0;
    let btcNextPrice = 0;
    let ethInVaults = 0;
    let ethNextPrice = 0;
    let usdcInVaults = 0;
    let usdcNextPrice = 0;
    let usdtInVaults = 0;
    let usdtNextPrice = 0;
    let dusdInVaults = 0;
    const dusdActualPrice = 0.99;

    if (!vault) {
      return 0;
    }

    vault?.collateralAmounts?.forEach(vaultCollaterral => {
      if ('DFI' === vaultCollaterral.symbolKey) {
        dfiInVaults += +vaultCollaterral.amount;
        dfiNextPrice = +vaultCollaterral.activePrice?.next?.amount;
      } else if ('BTC' === vaultCollaterral.symbolKey) {
        btcInVaults += +vaultCollaterral.amount;
        btcNextPrice = +vaultCollaterral.activePrice?.next?.amount;
      } else if ('ETH' === vaultCollaterral.symbolKey) {
        ethInVaults += +vaultCollaterral.amount;
        ethNextPrice = +vaultCollaterral.activePrice?.next?.amount;
      } else if ('USDC' === vaultCollaterral.symbolKey) {
        usdcInVaults += +vaultCollaterral.amount;
        usdcNextPrice = +vaultCollaterral.activePrice?.next?.amount;
      } else if ('USDT' === vaultCollaterral.symbolKey) {
        usdtInVaults += +vaultCollaterral.amount;
        usdtNextPrice = +vaultCollaterral.activePrice?.next?.amount;
      } else if ('DUSD' === vaultCollaterral.symbolKey) {
        dusdInVaults += +vaultCollaterral.amount;
      }

    });

    return dfiInVaults * dfiNextPrice + btcInVaults * btcNextPrice + ethInVaults * ethNextPrice
      + usdcInVaults * usdcNextPrice + usdtInVaults * usdtNextPrice + dusdInVaults * dusdActualPrice;
  }

  getCollateralCountVaults(currency: string): number {
    let curInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0 || !currency ) {
      return curInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault?.collateralAmounts?.forEach(vaultCollaterral => {
          if (currency === vaultCollaterral.symbolKey) {
              curInVaults += +vaultCollaterral.amount;
          }
        });
      });
    });

    return curInVaults;
  }

  getLoanCountVaults(currency: string): number {
    let loanInVaults = 0;

    if (this.vaultsOfAllAddresses.length === 0 || !currency ) {
      return loanInVaults;
    }

    this.vaultsOfAllAddresses.forEach(vault => {
      vault.data.forEach(addressVault => {
        addressVault?.loanAmounts?.forEach(loan => {
          if (currency === loan.symbolKey) {
            loanInVaults += +loan.amount;
          }
        });
      });
    });

    return loanInVaults;
  }

  getAllVaultsFromAllAddresses(): Array<Vault> {

    const vaults = new Array<Vault>();
    if (this.vaultsOfAllAddresses.length === 0) {
      return vaults;
    }

    this.vaultsOfAllAddresses.forEach(va => {
      vaults.push(...va.data);
    });

    vaults.sort((a, b) => (+a.collateralValue > +b.collateralValue) ? -1 : ((+b.collateralValue > +a.collateralValue) ? 1 : 0));

    return vaults;

  }

  getShortOfId(id: string): string {
    const first = id.slice(0, 5);
    const last = id.slice(id.length - 5, id.length);

    return first + '...' + last;
  }

  getMasternodeDfiUsd(): number {
    return (this.wallet?.dfiInMasternodes) * this.poolBtc?.priceB;
  }

  getMasternodeDfiUsdWithoutFreeezer(): number {
    return (this.wallet?.dfiInMasternodes - this.getFreezerDfiCount()) * this.poolBtc?.priceB;
  }

  // CRYPTO IN WALLET AND POOLS
  getBtcValueUsd(): number {
    return (this.wallet.btcInBtcPool + this.wallet.btc + this.getCollateralCountVaults('BTC')) * this.poolBtc?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet.ethInEthPool + this.wallet.eth + this.getCollateralCountVaults('ETH')) * this.poolEth?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.wallet.usdtInUsdtPool + this.wallet.usdt + this.getCollateralCountVaults('USDT')) * this.poolUsdt?.priceA;
  }

  getUsdcValueUsd(): number {
    return (this.wallet.usdcInUsdcPool + this.wallet.usdc + this.getCollateralCountVaults('USDC')) * this.poolUsdc?.priceA;
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
      || this.wallet?.usdInTltPool > 0 || this.wallet?.usdInPdbcPool > 0
      || this.wallet?.usdInAmznPool > 0 || this.wallet?.usdInNvdaPool > 0
      || this.wallet?.usdInCoinPool > 0 || this.wallet?.usdInEemPool > 0 || this.wallet?.usdInMsftPool > 0
      || this.wallet?.usdInNflxPool > 0 || this.wallet?.usdInFbPool > 0 || this.wallet?.usdInVooPool > 0
      || this.wallet?.usdInDisPool > 0
      || this.wallet?.usdInMchiPool > 0 || this.wallet?.usdInMstrPool > 0 || this.wallet?.usdInIntcPool > 0
      || this.getCollateralCountVaults('DUSD') > 0 ;
  }

  getUsdCount(): number {
    return this.wallet?.usdInUsdPool + this.wallet?.usd + this.wallet?.usdInTslaPool + this.wallet?.usdInSpyPool
      + this.wallet?.usdInQqqPool + this.wallet?.usdInPltrPool + this.wallet?.usdInSlvPool + this.wallet?.usdInAaplPool
      + this.wallet?.usdInGldPool + this.wallet?.usdInGmePool + this.wallet?.usdInGooglPool + this.wallet?.usdInArkkPool
      + this.wallet?.usdInBabaPool + this.wallet?.usdInVnqPool + this.wallet?.usdInUrthPool + this.wallet?.usdInTltPool
      + this.wallet?.usdInPdbcPool + this.wallet?.usdInAmznPool + this.wallet?.usdInNvdaPool + this.wallet?.usdInCoinPool
      + this.wallet?.usdInEemPool + this.wallet?.usdInMsftPool + this.wallet?.usdInNflxPool + this.wallet?.usdInFbPool
      + this.wallet?.usdInVooPool + this.wallet?.usdInDisPool + this.wallet?.usdInMchiPool + this.wallet?.usdInMstrPool
      + this.wallet?.usdInIntcPool + this.getCollateralCountVaults('DUSD');
  }

  getUsdValueUsd(): number {
    return this.getUsdCount() * this.getUsdPriceOfStockPools(this.poolUsd);
  }

  //  STOCKS VALUE IN WALLET AND POOLS
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
  getAmznValueUsd(): number {
    return (this.wallet?.amznInAmznPool + this.wallet?.amzn) * this.getUsdPriceOfStockPools(this.poolAmzn);
  }
  getNvdaValueUsd(): number {
    return (this.wallet?.nvdaInNvdaPool + this.wallet?.nvda) * this.getUsdPriceOfStockPools(this.poolNvda);
  }
  getCoinValueUsd(): number {
    return (this.wallet?.coinInCoinPool + this.wallet?.coin) * this.getUsdPriceOfStockPools(this.poolCoin);
  }
  getEemValueUsd(): number {
    return (this.wallet?.eemInEemPool + this.wallet?.eem) * this.getUsdPriceOfStockPools(this.poolEem);
  }
  getMsftValueUsd(): number {
    return (this.wallet?.msftInMsftPool + this.wallet?.msft) * this.getUsdPriceOfStockPools(this.poolMsft);
  }
  getNflxValueUsd(): number {
    return (this.wallet?.nflxInNflxPool + this.wallet?.nflx) * this.getUsdPriceOfStockPools(this.poolNflx);
  }
  getFbValueUsd(): number {
    return (this.wallet?.fbInFbPool + this.wallet?.fb) * this.getUsdPriceOfStockPools(this.poolFb);
  }
  getVooValueUsd(): number {
    return (this.wallet?.vooInVooPool + this.wallet?.voo) * this.getUsdPriceOfStockPools(this.poolVoo);
  }
  getDisValueUsd(): number {
    return (this.wallet?.disInDisPool + this.wallet?.dis) * this.getUsdPriceOfStockPools(this.poolDis);
  }
  getMchiValueUsd(): number {
    return (this.wallet?.mchiInMchiPool + this.wallet?.mchi) * this.getUsdPriceOfStockPools(this.poolMchi);
  }
  getMstrValueUsd(): number {
    return (this.wallet?.mstrInMstrPool + this.wallet?.mstr) * this.getUsdPriceOfStockPools(this.poolMstr);
  }
  getIntcValueUsd(): number {
    return (this.wallet?.intcInIntcPool + this.wallet?.intc) * this.getUsdPriceOfStockPools(this.poolIntc);
  }

  getUsdPriceOfStockPools(pool: Pool): number {
    return pool ? pool?.totalLiquidityUsd / 2 / +pool?.reserveA : 0;
  }

  getAllValuesUsdPrice(): number {
    // All Crypto and Stock values
    const allCryptoAndStocks = this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd()
      + this.getLtcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd() +  this.getDfiInVaultUsd()
      + this.getTslaValueUsd() + this.getUsdValueUsd() + this.getSpyValueUsd() + this.getQqqValueUsd() + this.getPltrValueUsd()
      + this.getSlvValueUsd() + this.getAaplValueUsd() + this.getGldValueUsd() + this.getGmeValueUsd() + this.getGooglValueUsd()
      + this.getArkkValueUsd() + this.getBabaValueUsd() + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd()
      + this.getPdbcValueUsd() + this.getAmznValueUsd() + this.getNvdaValueUsd() + this.getCoinValueUsd() + this.getEemValueUsd()
      + this.getMsftValueUsd() + this.getNflxValueUsd() + this.getFbValueUsd() + this.getVooValueUsd()
      + this.getDisValueUsd() + this.getMchiValueUsd() + this.getMstrValueUsd() + this.getIntcValueUsd();
       // Collateral
    const collateral = this.getVaultsCollateralUsd();

    return allCryptoAndStocks  + collateral;

  }

  // WALLETS HOLDINGS
  getWalletValueUsd(): number {
    return this.getDfiCountWalletUsd() + this.getBtcWalletValueUsd() + this.getEthWalletValueUsd() +
      this.getUsdtWalletValueUsd() + this.getLtcWalletValueUsd() + this.getDogeWalletValueUsd() + this.getBchWalletValueUsd()
      + this.getUsdWalletValueUsd() + this.getTslaWalletValueUsd() + this.getSpyWalletValueUsd() + this.getQqqWalletValueUsd()
      + this.getPltrWalletValueUsd() + this.getSlvWalletValueUsd() + this.getAaplWalletValueUsd() + this.getGldWalletValueUsd()
      + this.getGmeWalletValueUsd() + this.getGooglWalletValueUsd() + this.getArkkWalletValueUsd() + this.getBabaWalletValueUsd()
      + this.getVnqWalletValueUsd() + this.getUrthWalletValueUsd() + this.getTltWalletValueUsd() + this.getPdbcWalletValueUsd()
      + this.getAmznWalletValueUsd() + this.getNvdaWalletValueUsd() + this.getCoinWalletValueUsd() + this.getEemWalletValueUsd()
      + this.getMsftWalletValueUsd() + this.getNflxWalletValueUsd() + this.getFbWalletValueUsd() + this.getVooWalletValueUsd()
      + this.getDisWalletValueUsd() + this.getMchiWalletValueUsd() + this.getMstrWalletValueUsd() + this.getIntcWalletValueUsd();
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
  getAmznWalletValueUsd(): number {
    return this.wallet?.amzn * this.getUsdPriceOfStockPools(this.poolAmzn);
  }
  getNvdaWalletValueUsd(): number {
    return this.wallet?.nvda * this.getUsdPriceOfStockPools(this.poolNvda);
  }
  getCoinWalletValueUsd(): number {
    return this.wallet?.coin * this.getUsdPriceOfStockPools(this.poolCoin);
  }
  getEemWalletValueUsd(): number {
    return this.wallet?.eem * this.getUsdPriceOfStockPools(this.poolEem);
  }
  getMsftWalletValueUsd(): number {
    return this.wallet?.msft * this.getUsdPriceOfStockPools(this.poolMsft);
  }
  getNflxWalletValueUsd(): number {
    return this.wallet?.nflx * this.getUsdPriceOfStockPools(this.poolNflx);
  }
  getFbWalletValueUsd(): number {
    return this.wallet?.fb * this.getUsdPriceOfStockPools(this.poolFb);
  }
  getVooWalletValueUsd(): number {
    return this.wallet?.voo * this.getUsdPriceOfStockPools(this.poolVoo);
  }
  getDisWalletValueUsd(): number {
    return this.wallet?.dis * this.getUsdPriceOfStockPools(this.poolDis);
  }
  getMchiWalletValueUsd(): number {
    return this.wallet?.mchi * this.getUsdPriceOfStockPools(this.poolMchi);
  }
  getMstrWalletValueUsd(): number {
    return this.wallet?.mstr * this.getUsdPriceOfStockPools(this.poolMstr);
  }
  getIntcWalletValueUsd(): number {
    return this.wallet?.intc * this.getUsdPriceOfStockPools(this.poolIntc);
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.poolBtc?.priceB;
  }

  getDfiInVaultUsd(): number {
    return this.getCollateralCountVaults('DFI') * this.poolBtc?.priceB;
  }

  getBtcInVaultUsd(): number {
    return this.getCollateralCountVaults('BTC') * this.poolBtc?.priceA;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet.dfiInUsdPool
      + this.dfiInStaking + this.wallet.dfiInMasternodes + this.getCollateralCountVaults('DFI');
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilMasternodesOfAllValue(): number {
    return (this.getMasternodeDfiUsd()) / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return this.getLmUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getLmUsd(): number {
    return this.getAnteilLMOfBtcPoolValue() + this.getAnteilLMOfEthPoolValue()
      + this.getAnteilLMOfLtcPoolValue() + this.getAnteilLMOfUsdtPoolValue() + this.getAnteilLMOfUsdcPoolValue()
      + this.getAnteilLMOfDogePoolValue() + this.getAnteilLMOfBchPoolValue() + this.getAnteilLMOfUsdPoolValue()
      + this.getAnteilLMOfTslaPoolValue() + this.getAnteilLMOfSpyPoolValue() + this.getAnteilLMOfQqqPoolValue()
      + this.getAnteilLMOfPltrPoolValue() + this.getAnteilLMOfSlvPoolValue() + this.getAnteilLMOfAaplPoolValue()
      + this.getAnteilLMOfGldPoolValue()  + this.getAnteilLMOfGmePoolValue() + this.getAnteilLMOfGooglPoolValue()
      + this.getAnteilLMOfArkkPoolValue() + this.getAnteilLMOfBabaPoolValue() + this.getAnteilLMOfVnqPoolValue()
      + this.getAnteilLMOfUrthPoolValue() + this.getAnteilLMOfTltPoolValue() + this.getAnteilLMOfPdbcPoolValue()
      + this.getAnteilLMOfAmznPoolValue() + this.getAnteilLMOfNvdaPoolValue() + this.getAnteilLMOfCoinPoolValue()
      + this.getAnteilLMOfEemPoolValue() + this.getAnteilLMOfMsftPoolValue() + this.getAnteilLMOfNflxPoolValue()
      + this.getAnteilLMOfFbPoolValue() + this.getAnteilLMOfVooPoolValue() + this.getAnteilLMOfDisPoolValue()
      + this.getAnteilLMOfMchiPoolValue() + this.getAnteilLMOfMstrPoolValue() + this.getAnteilLMOfMchiPoolValue()
      + this.getAnteilLMOfIntcPoolValue();
  }

  getAnteilCollaterallOfAllValue(): number {
    return this.getVaultsCollateralUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilLoanOfAllValue(): number {
    return this.getVaultsLoansValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.poolBtc?.priceB;
  }

  getDfiCountLM(): number {
    return this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet.dfiInUsdPool;
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

    if (this.getLoanCountVaults('DUSD') > 0) {
      this.loanValues.push(new LoanValue('DUSD', this.poolUsd));
    }
    if (this.getLoanCountVaults('TSLA') > 0) {
      this.loanValues.push(new LoanValue('TSLA', this.poolTsla));
    }
    if (this.getLoanCountVaults('AAPL') > 0) {
    this.loanValues.push(new LoanValue('AAPL', this.poolAapl));
    }
    if (this.getLoanCountVaults('ARKK') > 0) {
    this.loanValues.push(new LoanValue('ARKK', this.poolArkk));
    }
    if (this.getLoanCountVaults('BABA') > 0) {
    this.loanValues.push(new LoanValue('BABA', this.poolBaba));
    }
    if (this.getLoanCountVaults('GLD') > 0) {
    this.loanValues.push(new LoanValue('GLD', this.poolGld));
    }
    if (this.getLoanCountVaults('GME') > 0) {
    this.loanValues.push(new LoanValue('GME', this.poolGme));
    }
    if (this.getLoanCountVaults('GOOGL') > 0) {
    this.loanValues.push(new LoanValue('GOOGL', this.poolGoogl));
    }
    if (this.getLoanCountVaults('PDBC') > 0) {
    this.loanValues.push(new LoanValue('PDBC', this.poolPdbc));
    }
    if (this.getLoanCountVaults('PLTR') > 0) {
    this.loanValues.push(new LoanValue('PLTR', this.poolPltr));
    }
    if (this.getLoanCountVaults('QQQ') > 0) {
    this.loanValues.push(new LoanValue('QQQ', this.poolQqq));
    }
    if (this.getLoanCountVaults('SLV') > 0) {
    this.loanValues.push(new LoanValue('SLV', this.poolSlv));
    }
    if (this.getLoanCountVaults('SPY') > 0) {
    this.loanValues.push(new LoanValue('SPY', this.poolSpy));
    }
    if (this.getLoanCountVaults('TLT') > 0) {
    this.loanValues.push(new LoanValue('TLT', this.poolTlt));
    }
    if (this.getLoanCountVaults('URTH') > 0) {
    this.loanValues.push(new LoanValue('URTH', this.poolUrth));
    }
    if (this.getLoanCountVaults('VNQ') > 0) {
    this.loanValues.push(new LoanValue('VNQ', this.poolVnq));
    }
    if (this.getLoanCountVaults('AMZN') > 0) {
    this.loanValues.push(new LoanValue('AMZN', this.poolAmzn));
    }
    if (this.getLoanCountVaults('NVDA') > 0) {
    this.loanValues.push(new LoanValue('NVDA', this.poolNvda));
    }
    if (this.getLoanCountVaults('COIN') > 0) {
    this.loanValues.push(new LoanValue('COIN', this.poolCoin));
    }
    if (this.getLoanCountVaults('EEM') > 0) {
    this.loanValues.push(new LoanValue('EEM', this.poolEem));
    }
    if (this.getLoanCountVaults('MSFT') > 0) {
    this.loanValues.push(new LoanValue('MSFT', this.poolMsft));
    }
    if (this.getLoanCountVaults('NFLX') > 0) {
    this.loanValues.push(new LoanValue('NFLX', this.poolNflx));
    }
    if (this.getLoanCountVaults('FB') > 0) {
    this.loanValues.push(new LoanValue('FB', this.poolFb));
    }
    if (this.getLoanCountVaults('VOO') > 0) {
    this.loanValues.push(new LoanValue('VOO', this.poolVoo));
    }
    if (this.getLoanCountVaults('DIS') > 0) {
    this.loanValues.push(new LoanValue('DIS', this.poolDis));
    }
    if (this.getLoanCountVaults('MCHI') > 0) {
    this.loanValues.push(new LoanValue('MCHI', this.poolMchi));
    }
    if (this.getLoanCountVaults('MSTR') > 0) {
    this.loanValues.push(new LoanValue('MSTR', this.poolMstr));
    }
    if (this.getLoanCountVaults('INTC') > 0) {
    this.loanValues.push(new LoanValue('INTC', this.poolIntc));
    }


  }

  createHoldingTokens(): void {

    this.holdingValues = new Array<HoldingValue>();

    if (this.wallet?.btc > 0 || this.wallet?.btcInBtcPool > 0 || this.getCollateralCountVaults('BTC')) {
      this.holdingValues.push(new HoldingValue('BTC',
        this.wallet?.btc + this.wallet?.btcInBtcPool  + this.getCollateralCountVaults('BTC'), this.getBtcValueUsd()));
    }

    if (this.wallet?.eth > 0 || this.wallet?.ethInEthPool > 0 || this.getCollateralCountVaults('ETH')) {
      this.holdingValues.push(new HoldingValue('ETH',
        this.wallet?.eth + this.wallet?.ethInEthPool  + this.getCollateralCountVaults('ETH'), this.getEthValueUsd()));
    }

    if (this.wallet?.usdt > 0 || this.wallet?.usdtInUsdtPool > 0 || this.getCollateralCountVaults('USDT')) {
      this.holdingValues.push(new HoldingValue('USDT',
        this.wallet?.usdt + this.wallet?.usdtInUsdtPool  + this.getCollateralCountVaults('USDT'), this.getUsdtValueUsd()));
    }

    if (this.wallet?.usdc > 0 || this.wallet?.usdcInUsdcPool > 0 || this.getCollateralCountVaults('USDC')) {
      this.holdingValues.push(new HoldingValue('USDC',
        this.wallet?.usdc + this.wallet?.usdcInUsdcPool  + this.getCollateralCountVaults('USDC'), this.getUsdcValueUsd()));
    }

    if (this.isUsdInPortfolio()) {
      this.holdingValues.push(new HoldingValue('DUSD',
        this.getUsdCount(), this.getUsdValueUsd()));
    }

    if (this.wallet?.ltc > 0 || this.wallet?.ltcInLtcPool > 0 ) {
      this.holdingValues.push(new HoldingValue('LTC',
        this.wallet?.ltc + this.wallet?.ltcInLtcPool, this.getLtcValueUsd()));
    }

    if (this.wallet?.doge > 0 || this.wallet?.dogeInDogePool > 0 ) {
      this.holdingValues.push(new HoldingValue('DOGE',
        this.wallet?.doge + this.wallet?.dogeInDogePool, this.getDogeValueUsd()));
    }

    if (this.wallet?.bch > 0 || this.wallet?.bchInBchPool > 0 ) {
      this.holdingValues.push(new HoldingValue('BCH',
        this.wallet?.bch + this.wallet?.bchInBchPool, this.getBchValueUsd()));
    }

    if (this.wallet?.tsla > 0 || this.wallet?.tslaInTslaPool > 0 ) {
      this.holdingValues.push(new HoldingValue('TSLA',
        this.wallet?.tsla + this.wallet?.tslaInTslaPool, this.getTslaValueUsd()));
    }

    if (this.wallet?.qqq > 0 || this.wallet?.qqqInQqqPool > 0 ) {
      this.holdingValues.push(new HoldingValue('QQQ',
        this.wallet?.qqq + this.wallet?.qqqInQqqPool, this.getQqqValueUsd()));
    }

    if (this.wallet?.spy > 0 || this.wallet?.spyInSpyPool > 0 ) {
      this.holdingValues.push(new HoldingValue('SPY',
        this.wallet?.spy + this.wallet?.spyInSpyPool, this.getSpyValueUsd()));
    }

    if (this.wallet?.pltr > 0 || this.wallet?.pltrInPltrPool > 0 ) {
      this.holdingValues.push(new HoldingValue('PLTR',
        this.wallet?.pltr + this.wallet?.pltrInPltrPool, this.getPltrValueUsd()));
    }

    if (this.wallet?.slv > 0 || this.wallet?.slvInSlvPool > 0 ) {
      this.holdingValues.push(new HoldingValue('SLV',
        this.wallet?.slv + this.wallet?.slvInSlvPool, this.getSlvValueUsd()));
    }

    if (this.wallet?.aapl > 0 || this.wallet?.aaplInAaplPool > 0 ) {
      this.holdingValues.push(new HoldingValue('AAPL',
        this.wallet?.aapl + this.wallet?.aaplInAaplPool, this.getAaplValueUsd()));
    }

    if (this.wallet?.gld > 0 || this.wallet?.gldInGldPool > 0 ) {
      this.holdingValues.push(new HoldingValue('GLD',
        this.wallet?.gld + this.wallet?.gldInGldPool, this.getGldValueUsd()));
    }

    if (this.wallet?.gme > 0 || this.wallet?.gmeInGmePool > 0 ) {
      this.holdingValues.push(new HoldingValue('GME',
        this.wallet?.gme + this.wallet?.gmeInGmePool, this.getGmeValueUsd()));
    }

    if (this.wallet?.googl > 0 || this.wallet?.googlInGooglPool > 0 ) {
      this.holdingValues.push(new HoldingValue('GOOGL',
        this.wallet?.googl + this.wallet?.googlInGooglPool, this.getGooglValueUsd()));
    }

    if (this.wallet?.arkk > 0 || this.wallet?.arkkInArkkPool > 0 ) {
      this.holdingValues.push(new HoldingValue('ARKK',
        this.wallet?.arkk + this.wallet?.arkkInArkkPool, this.getArkkValueUsd()));
    }

    if (this.wallet?.baba > 0 || this.wallet?.babaInBabaPool > 0 ) {
      this.holdingValues.push(new HoldingValue('BABA',
        this.wallet?.baba + this.wallet?.babaInBabaPool, this.getBabaValueUsd()));
    }

    if (this.wallet?.vnq > 0 || this.wallet?.vnqInVnqPool > 0 ) {
      this.holdingValues.push(new HoldingValue('VNQ',
        this.wallet?.vnq + this.wallet?.vnqInVnqPool, this.getVnqValueUsd()));
    }

    if (this.wallet?.urth > 0 || this.wallet?.urthInUrthPool > 0 ) {
      this.holdingValues.push(new HoldingValue('URTH',
        this.wallet?.urth + this.wallet?.urthInUrthPool, this.getUrthValueUsd()));
    }

    if (this.wallet?.tlt > 0 || this.wallet?.tltInTltPool > 0 ) {
      this.holdingValues.push(new HoldingValue('TLT',
        this.wallet?.tlt + this.wallet?.tltInTltPool, this.getTltValueUsd()));
    }

    if (this.wallet?.pdbc > 0 || this.wallet?.pdbcInPdbcPool > 0 ) {
      this.holdingValues.push(new HoldingValue('PDBC',
        this.wallet?.pdbc + this.wallet?.pdbcInPdbcPool, this.getPdbcValueUsd()));
    }

    if (this.wallet?.amzn > 0 || this.wallet?.amznInAmznPool > 0 ) {
      this.holdingValues.push(new HoldingValue('AMZN',
        this.wallet?.amzn + this.wallet?.amznInAmznPool, this.getAmznValueUsd()));
    }

    if (this.wallet?.nvda > 0 || this.wallet?.nvdaInNvdaPool > 0 ) {
      this.holdingValues.push(new HoldingValue('NVDA',
        this.wallet?.nvda + this.wallet?.nvdaInNvdaPool, this.getAmznValueUsd()));
    }

    if (this.wallet?.coin > 0 || this.wallet?.coinInCoinPool > 0 ) {
      this.holdingValues.push(new HoldingValue('COIN',
        this.wallet?.coin + this.wallet?.coinInCoinPool, this.getCoinValueUsd()));
    }

    if (this.wallet?.eem > 0 || this.wallet?.eemInEemPool > 0 ) {
      this.holdingValues.push(new HoldingValue('EEM',
        this.wallet?.eem + this.wallet?.eemInEemPool, this.getEemValueUsd()));
    }

    if (this.wallet?.msft > 0 || this.wallet?.msftInMsftPool > 0 ) {
      this.holdingValues.push(new HoldingValue('MSFT',
        this.wallet?.msft + this.wallet?.msftInMsftPool, this.getMsftValueUsd()));
    }

    if (this.wallet?.nflx > 0 || this.wallet?.nflxInNflxPool > 0 ) {
      this.holdingValues.push(new HoldingValue('NFLX',
        this.wallet?.nflx + this.wallet?.nflxInNflxPool, this.getNflxValueUsd()));
    }

    if (this.wallet?.fb > 0 || this.wallet?.fbInFbPool > 0 ) {
      this.holdingValues.push(new HoldingValue('FB',
        this.wallet?.fb + this.wallet?.fbInFbPool, this.getFbValueUsd()));
    }
    if (this.wallet?.voo > 0 || this.wallet?.vooInVooPool > 0 ) {
      this.holdingValues.push(new HoldingValue('VOO',
        this.wallet?.voo + this.wallet?.vooInVooPool, this.getVooValueUsd()));
    }

    if (this.wallet?.dis > 0 || this.wallet?.disInDisPool > 0 ) {
      this.holdingValues.push(new HoldingValue('DIS',
        this.wallet?.dis + this.wallet?.disInDisPool, this.getDisValueUsd()));
    }

    if (this.wallet?.mchi > 0 || this.wallet?.mchiInMchiPool > 0 ) {
      this.holdingValues.push(new HoldingValue('MCHI',
        this.wallet?.mchi + this.wallet?.mchiInMchiPool, this.getMchiValueUsd()));
    }

    if (this.wallet?.mstr > 0 || this.wallet?.mstrInMstrPool > 0 ) {
      this.holdingValues.push(new HoldingValue('MSTR',
        this.wallet?.mstr + this.wallet?.mstrInMstrPool, this.getMstrValueUsd()));
    }

    if (this.wallet?.intc > 0 || this.wallet?.intcInIntcPool > 0 ) {
      this.holdingValues.push(new HoldingValue('INTC',
        this.wallet?.intc + this.wallet?.intcInIntcPool, this.getIntcValueUsd()));
    }

  }

  createWalletTokens(): void {

    this.walletValues = new Array<HoldingValue>();

    if (this.wallet?.btc > 0) {
      this.walletValues.push(new HoldingValue('BTC',
        this.wallet?.btc, this.wallet?.btc * this.poolBtc?.priceA));
    }

    if (this.wallet?.eth > 0) {
      this.walletValues.push(new HoldingValue('ETH',
        this.wallet?.eth, this.wallet?.eth * this.poolEth.priceA));
    }

    if (this.wallet?.usdt > 0) {
      this.walletValues.push(new HoldingValue('USDT',
        this.wallet?.usdt, this.wallet?.usdt * this.poolUsdt?.priceA));
    }

    if (this.wallet?.usdc > 0) {
      this.walletValues.push(new HoldingValue('USDC',
        this.wallet?.usdc , this.wallet?.usdc * this.poolUsdc?.priceA));
    }

    if (this.isUsdInPortfolio()) {
      this.walletValues.push(new HoldingValue('DUSD',
        this.wallet?.usd, this.wallet?.usd * this.getUsdPriceOfStockPools(this.poolUsd)));
    }

    if (this.wallet?.ltc > 0) {
      this.walletValues.push(new HoldingValue('LTC',
        this.wallet?.ltc, this.wallet?.ltc * this.poolLtc?.priceA));
    }

    if (this.wallet?.doge > 0) {
      this.walletValues.push(new HoldingValue('DOGE',
        this.wallet?.doge , this.wallet?.doge * this.poolDoge?.priceA));
    }

    if (this.wallet?.bch > 0) {
      this.walletValues.push(new HoldingValue('BCH',
        this.wallet?.bch, this.wallet?.bch * this.poolBch?.priceA));
    }

    if (this.wallet?.tsla > 0) {
      this.walletValues.push(new HoldingValue('TSLA',
        this.wallet?.tsla , this.wallet?.tsla * this.getUsdPriceOfStockPools(this.poolTsla)));
    }

    if (this.wallet?.qqq > 0) {
      this.walletValues.push(new HoldingValue('QQQ',
        this.wallet?.qqq, this.wallet?.qqq * this.getUsdPriceOfStockPools(this.poolQqq)));
    }

    if (this.wallet?.spy > 0 ) {
      this.walletValues.push(new HoldingValue('SPY',
        this.wallet?.spy, this.wallet?.spy * this.getUsdPriceOfStockPools(this.poolSpy)));
    }

    if (this.wallet?.pltr > 0  ) {
      this.walletValues.push(new HoldingValue('PLTR',
        this.wallet?.pltr, this.wallet?.pltr * this.getUsdPriceOfStockPools(this.poolPltr)));
    }

    if (this.wallet?.slv > 0 ) {
      this.walletValues.push(new HoldingValue('SLV',
        this.wallet?.slv, this.wallet?.slv * this.getUsdPriceOfStockPools(this.poolSlv)));
    }

    if (this.wallet?.aapl > 0 ) {
      this.walletValues.push(new HoldingValue('AAPL',
        this.wallet?.aapl, this.wallet?.aapl * this.getUsdPriceOfStockPools(this.poolAapl)));
    }

    if (this.wallet?.gld > 0 ) {
      this.walletValues.push(new HoldingValue('GLD',
        this.wallet?.gld, this.wallet?.gld * this.getUsdPriceOfStockPools(this.poolGld)));
    }

    if (this.wallet?.gme > 0 ) {
      this.walletValues.push(new HoldingValue('GME',
        this.wallet?.gme, this.wallet?.gme * this.getUsdPriceOfStockPools(this.poolGme)));
    }

    if (this.wallet?.googl > 0) {
      this.walletValues.push(new HoldingValue('GOOGL',
        this.wallet?.googl, this.wallet?.googl * this.getUsdPriceOfStockPools(this.poolGoogl)));
    }

    if (this.wallet?.arkk > 0  ) {
      this.walletValues.push(new HoldingValue('ARKK',
        this.wallet?.arkk , this.wallet?.arkk * this.getUsdPriceOfStockPools(this.poolArkk)));
    }

    if (this.wallet?.baba > 0  ) {
      this.walletValues.push(new HoldingValue('BABA',
        this.wallet?.baba , this.wallet?.baba * this.getUsdPriceOfStockPools(this.poolBaba)));
    }

    if (this.wallet?.vnq > 0 ) {
      this.walletValues.push(new HoldingValue('VNQ',
        this.wallet?.vnq , this.wallet?.vnq * this.getUsdPriceOfStockPools(this.poolVnq)));
    }

    if (this.wallet?.urth > 0 ) {
      this.walletValues.push(new HoldingValue('URTH',
        this.wallet?.urth , this.wallet?.urth * this.getUsdPriceOfStockPools(this.poolUrth)));
    }

    if (this.wallet?.tlt > 0 ) {
      this.walletValues.push(new HoldingValue('TLT',
        this.wallet?.tlt , this.wallet?.tlt * this.getUsdPriceOfStockPools(this.poolTlt)));
    }

    if (this.wallet?.pdbc > 0  ) {
      this.walletValues.push(new HoldingValue('PDBC',
        this.wallet?.pdbc , this.wallet?.pdbc * this.getUsdPriceOfStockPools(this.poolPdbc)));
    }

    if (this.wallet?.amzn > 0 ) {
      this.walletValues.push(new HoldingValue('AMZN',
        this.wallet?.amzn , this.wallet?.amzn * this.getUsdPriceOfStockPools(this.poolAmzn)));
    }

    if (this.wallet?.nvda > 0) {
      this.walletValues.push(new HoldingValue('NVDA',
        this.wallet?.nvda, this.wallet?.nvda * this.getUsdPriceOfStockPools(this.poolNvda)));
    }

    if (this.wallet?.coin > 0 ) {
      this.walletValues.push(new HoldingValue('COIN',
        this.wallet?.coin , this.wallet?.coin * this.getUsdPriceOfStockPools(this.poolCoin)));
    }

    if (this.wallet?.eem > 0  ) {
      this.walletValues.push(new HoldingValue('EEM',
        this.wallet?.eem, this.wallet?.eem * this.getUsdPriceOfStockPools(this.poolEem)));
    }

    if (this.wallet?.msft > 0 ) {
      this.walletValues.push(new HoldingValue('MSFT',
        this.wallet?.msft, this.wallet?.msft * this.getUsdPriceOfStockPools(this.poolMsft)));
    }

    if (this.wallet?.nflx > 0 ) {
      this.walletValues.push(new HoldingValue('NFLX',
        this.wallet?.nflx, this.wallet?.nflx * this.getUsdPriceOfStockPools(this.poolNflx)));
    }

    if (this.wallet?.fb > 0  ) {
      this.walletValues.push(new HoldingValue('FB',
        this.wallet?.fb, this.wallet?.fb * this.getUsdPriceOfStockPools(this.poolFb)));
    }
    if (this.wallet?.voo > 0 ) {
      this.walletValues.push(new HoldingValue('VOO',
        this.wallet?.voo, this.wallet?.voo * this.getUsdPriceOfStockPools(this.poolVoo)));
    }

    if (this.wallet?.dis > 0 ) {
      this.walletValues.push(new HoldingValue('DIS',
        this.wallet?.dis, this.wallet?.dis * this.getUsdPriceOfStockPools(this.poolDis)));
    }

    if (this.wallet?.mchi > 0 ) {
      this.walletValues.push(new HoldingValue('MCHI',
        this.wallet?.mchi, this.wallet?.mchi * this.getUsdPriceOfStockPools(this.poolMchi)));
    }

    if (this.wallet?.mstr > 0) {
      this.walletValues.push(new HoldingValue('MSTR',
        this.wallet?.mstr, this.wallet?.mstr * this.getUsdPriceOfStockPools(this.poolMstr)));
    }

    if (this.wallet?.intc > 0) {
      this.walletValues.push(new HoldingValue('INTC',
        this.wallet?.intc , this.wallet?.intc * this.getUsdPriceOfStockPools(this.poolIntc)));
    }

  }

  createCollaterallTokens(): void {

    this.colleteralTokensValues = new Array<HoldingValue>();

    if (this.getCollateralCountVaults('BTC') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('BTC',
        this.getCollateralCountVaults('BTC'), this.getCollateralCountVaults('BTC') * this.poolBtc.priceA));
    }
    if (this.getCollateralCountVaults('ETH') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('ETH',
        this.getCollateralCountVaults('ETH'), this.getCollateralCountVaults('ETH') * this.poolEth.priceA));
    }
    if (this.getCollateralCountVaults('USDC') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('USDC',
        this.getCollateralCountVaults('USDC'), this.getCollateralCountVaults('USDC') * this.poolUsdc.priceA));
    }
    if (this.getCollateralCountVaults('USDT') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('USDT',
        this.getCollateralCountVaults('USDT'), this.getCollateralCountVaults('USDT') * this.poolUsdt.priceA));
    }
    if (this.getCollateralCountVaults('DFI') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('DFI',
        this.getCollateralCountVaults('DFI'), this.getCollateralCountVaults('DFI') * this.poolBtc.priceB));
    }
    if (this.getCollateralCountVaults('DUSD') > 0) {
      this.colleteralTokensValues.push(new HoldingValue('DUSD',
        this.getCollateralCountVaults('DUSD'), this.getCollateralCountVaults('DUSD') * 0.99));
    }

  }

  createLpTokens(): void {

    this.lpTokensValues = new Array<HoldingValue>();

    if (this.wallet?.btcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('BTC-DFI',
        this.wallet?.btcdfi, this.wallet?.btcdfi * this.getPlTokenValue(this.poolBtc)));
    }

    if (this.wallet?.ethdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('ETH-DFI',
        this.wallet?.ethdfi, this.wallet?.ethdfi * this.getPlTokenValue(this.poolEth)));
    }

    if (this.wallet?.usdtdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('USDT-DFI',
        this.wallet?.usdtdfi, this.wallet?.usdtdfi * this.getPlTokenValue(this.poolUsdt)));
    }

    if (this.wallet?.usdcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('USDC-DFI',
        this.wallet?.usdcdfi , this.wallet?.usdcdfi * this.getPlTokenValue(this.poolUsdc)));
    }

    if (this.wallet?.usddfi) {
      this.lpTokensValues.push(new HoldingValue('DUSD-DFI',
        this.wallet?.usddfi, this.wallet?.usddfi * this.getPlTokenValue(this.poolUsd)));
    }

    if (this.wallet?.ltcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('LTC-DFI',
        this.wallet?.ltcdfi, this.wallet?.ltc * this.getPlTokenValue(this.poolLtc)));
    }

    if (this.wallet?.dogedfi > 0) {
      this.lpTokensValues.push(new HoldingValue('DOGE-DFI',
        this.wallet?.dogedfi , this.wallet?.dogedfi * this.getPlTokenValue(this.poolDoge)));
    }

    if (this.wallet?.bchdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('BCH-DFI',
        this.wallet?.bchdfi, this.wallet?.bchdfi * this.getPlTokenValue(this.poolBch)));
    }

    if (this.wallet?.tslausd > 0) {
      this.lpTokensValues.push(new HoldingValue('TSLA-DUSD',
        this.wallet?.tslausd , this.wallet?.tslausd * this.getPlTokenValue(this.poolTsla)));
    }

    if (this.wallet?.qqqusd > 0) {
      this.lpTokensValues.push(new HoldingValue('QQQ-DUSD',
        this.wallet?.qqqusd, this.wallet?.qqqusd * this.getPlTokenValue(this.poolQqq)));
    }

    if (this.wallet?.spyusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('SPY-DUSD',
        this.wallet?.spyusd, this.wallet?.spyusd * this.getPlTokenValue(this.poolSpy)));
    }

    if (this.wallet?.pltr > 0  ) {
      this.lpTokensValues.push(new HoldingValue('PLTR-DUSD',
        this.wallet?.pltr, this.wallet?.pltrusd * this.getPlTokenValue(this.poolPltr)));
    }

    if (this.wallet?.slvusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('SLV-DUSD',
        this.wallet?.slvusd, this.wallet?.slvusd * this.getPlTokenValue(this.poolSlv)));
    }

    if (this.wallet?.aaplusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('AAPL-DUSD',
        this.wallet?.aaplusd, this.wallet?.aaplusd * this.getPlTokenValue(this.poolAapl)));
    }

    if (this.wallet?.gldusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('GLD-DUSD',
        this.wallet?.gldusd, this.wallet?.gldusd * this.getPlTokenValue(this.poolGld)));
    }

    if (this.wallet?.gmeusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('GME-DUSD',
        this.wallet?.gmeusd, this.wallet?.gmeusd * this.getPlTokenValue(this.poolGme)));
    }

    if (this.wallet?.googlusd > 0) {
      this.lpTokensValues.push(new HoldingValue('GOOGL-DUSD',
        this.wallet?.googlusd, this.wallet?.googlusd * this.getPlTokenValue(this.poolGoogl)));
    }

    if (this.wallet?.arkkusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('ARKK-DUSD',
        this.wallet?.arkkusd , this.wallet?.arkkusd * this.getPlTokenValue(this.poolArkk)));
    }

    if (this.wallet?.babausd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('BABA-DUSD',
        this.wallet?.babausd , this.wallet?.baba * this.getPlTokenValue(this.poolBaba)));
    }

    if (this.wallet?.vnq > 0 ) {
      this.lpTokensValues.push(new HoldingValue('VNQ-DUSD',
        this.wallet?.vnq , this.wallet?.vnq * this.getPlTokenValue(this.poolVnq)));
    }

    if (this.wallet?.urthusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('URTH-DUSD',
        this.wallet?.urthusd , this.wallet?.urthusd * this.getPlTokenValue(this.poolUrth)));
    }

    if (this.wallet?.tltusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('TLT-DUSD',
        this.wallet?.tltusd , this.wallet?.tltusd * this.getPlTokenValue(this.poolTlt)));
    }

    if (this.wallet?.pdbcusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('PDBC-DUSD',
        this.wallet?.pdbcusd, this.wallet?.pdbcusd * this.getPlTokenValue(this.poolPdbc)));
    }

    if (this.wallet?.amznusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('AMZN-DUSD',
        this.wallet?.amznusd , this.wallet?.amznusd * this.getPlTokenValue(this.poolAmzn)));
    }

    if (this.wallet?.nvdausd > 0) {
      this.lpTokensValues.push(new HoldingValue('NVDA-DUSD',
        this.wallet?.nvdausd, this.wallet?.nvdausd * this.getPlTokenValue(this.poolNvda)));
    }

    if (this.wallet?.coinusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('COIN-DUSD',
        this.wallet?.coinusd , this.wallet?.coinusd * this.getPlTokenValue(this.poolCoin)));
    }

    if (this.wallet?.eemusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('EEM-DUSD',
        this.wallet?.eemusd, this.wallet?.eemusd * this.getPlTokenValue(this.poolEem)));
    }

    if (this.wallet?.msftusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('MSFT-DUSD',
        this.wallet?.msftusd, this.wallet?.msftusd * this.getPlTokenValue(this.poolMsft)));
    }

    if (this.wallet?.nflxusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('NFLX-DUSD',
        this.wallet?.nflxusd, this.wallet?.nflxusd * this.getPlTokenValue(this.poolNflx)));
    }

    if (this.wallet?.fbusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('FB-DUSD',
        this.wallet?.fbusd, this.wallet?.fbusd * this.getPlTokenValue(this.poolFb)));
    }
    if (this.wallet?.voousd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('VOO-DUSD',
        this.wallet?.voousd, this.wallet?.voousd * this.getPlTokenValue(this.poolVoo)));
    }

    if (this.wallet?.disusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('DIS-DUSD',
        this.wallet?.disusd, this.wallet?.disusd * this.getPlTokenValue(this.poolDis)));
    }

    if (this.wallet?.mchiusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('MCHI-DUSD',
        this.wallet?.mchiusd, this.wallet?.mchiusd * this.getPlTokenValue(this.poolMchi)));
    }

    if (this.wallet?.mstrusd > 0) {
      this.lpTokensValues.push(new HoldingValue('MSTR-DUSD',
        this.wallet?.mstrusd, this.wallet?.mstrusd * this.getPlTokenValue(this.poolMstr)));
    }

    if (this.wallet?.intcusd > 0) {
      this.lpTokensValues.push(new HoldingValue('INTC-DUSD',
        this.wallet?.intcusd , this.wallet?.intcusd * this.getPlTokenValue(this.poolIntc)));
    }

  }

  getPlTokenValue(pool: Pool): number {
   return pool?.totalLiquidityUsd / pool?.totalLiquidityLpToken;
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

  // ANTEIL CRYPTO
  getAnteilLMOfBtcPoolValue(): number {
    return ((this.wallet.dfiInBtcPool * this.poolBtc?.priceB) + (this.wallet.btcInBtcPool * this.poolBtc?.priceA));
  }
  getAnteilLMOfEthPoolValue(): number {
    return ((this.wallet.dfiInEthPool * this.poolBtc?.priceB) + (this.wallet.ethInEthPool * this.poolEth?.priceA));
  }
  getAnteilLMOfLtcPoolValue(): number {
    return ((this.wallet.dfiInLtcPool * this.poolBtc?.priceB) + (this.wallet.ltcInLtcPool * this.poolLtc?.priceA));
  }
  getAnteilLMOfUsdtPoolValue(): number {
    return ((this.wallet.dfiInUsdtPool * this.poolBtc?.priceB) + (this.wallet.usdtInUsdtPool * this.poolUsdt?.priceA));
  }
  getAnteilLMOfUsdcPoolValue(): number {
    return ((this.wallet.dfiInUsdcPool * this.poolBtc?.priceB) + (this.wallet.usdcInUsdcPool * this.poolUsdc?.priceA));
  }
  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.poolBtc?.priceB) + (this.wallet.dogeInDogePool * this.poolDoge?.priceA));
  }
  getAnteilLMOfBchPoolValue(): number {
    return ((this.wallet.dfiInBchPool * this.poolBtc?.priceB) + (this.wallet.bchInBchPool * this.poolBch?.priceA));
  }
  // ANTEIL STOCKS
  getAnteilLMOfUsdPoolValue(): number {
    return ((this.wallet.dfiInUsdPool * this.poolBtc?.priceB) + (this.wallet.usdInUsdPool * this.getUsdPriceOfStockPools(this.poolUsd)));
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
  getAnteilLMOfAmznPoolValue(): number {
    return ((this.wallet.usdInAmznPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.amznInAmznPool * this.getUsdPriceOfStockPools(this.poolAmzn)));
  }
  getAnteilLMOfNvdaPoolValue(): number {
    return ((this.wallet.usdInNvdaPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.nvdaInNvdaPool * this.getUsdPriceOfStockPools(this.poolNvda)));
  }
  getAnteilLMOfCoinPoolValue(): number {
    return ((this.wallet.usdInCoinPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.coinInCoinPool * this.getUsdPriceOfStockPools(this.poolCoin)));
  }
  getAnteilLMOfEemPoolValue(): number {
    return ((this.wallet.usdInEemPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.eemInEemPool * this.getUsdPriceOfStockPools(this.poolEem)));
  }
  getAnteilLMOfMsftPoolValue(): number {
    return ((this.wallet.usdInMsftPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.msftInMsftPool * this.getUsdPriceOfStockPools(this.poolMsft)));
  }
  getAnteilLMOfNflxPoolValue(): number {
    return ((this.wallet.usdInNflxPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.nflxInNflxPool * this.getUsdPriceOfStockPools(this.poolNflx)));
  }
  getAnteilLMOfFbPoolValue(): number {
    return ((this.wallet.usdInFbPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.fbInFbPool * this.getUsdPriceOfStockPools(this.poolFb)));
  }
  getAnteilLMOfVooPoolValue(): number {
    return ((this.wallet.usdInVooPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.vooInVooPool * this.getUsdPriceOfStockPools(this.poolVoo)));
  }
  getAnteilLMOfDisPoolValue(): number {
    return ((this.wallet.usdInDisPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.disInDisPool * this.getUsdPriceOfStockPools(this.poolDis)));
  }
  getAnteilLMOfMchiPoolValue(): number {
    return ((this.wallet.usdInMchiPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.mchiInMchiPool * this.getUsdPriceOfStockPools(this.poolMchi)));
  }
  getAnteilLMOfMstrPoolValue(): number {
    return ((this.wallet.usdInMstrPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.mstrInMstrPool * this.getUsdPriceOfStockPools(this.poolMstr)));
  }
  getAnteilLMOfIntcPoolValue(): number {
    return ((this.wallet.usdInIntcPool * this.getUsdPriceOfStockPools(this.poolUsd))
      + (this.wallet.intcInIntcPool * this.getUsdPriceOfStockPools(this.poolIntc)));
  }

  buildDataForChart(): void {

    const dataBtc = new Data();
    dataBtc.value = (this.getBtcValueUsd()) * this.dataService.getPrice(this.fiat);
    dataBtc.name = 'BTC';

    const dataEth = new Data();
    dataEth.name = 'ETH';
    dataEth.value = this.getEthValueUsd() * this.dataService.getPrice(this.fiat);

    const dataUsdt = new Data();
    dataUsdt.name = 'USDT';
    dataUsdt.value = (this.getUsdtValueUsd()) * this.dataService.getPrice(this.fiat);

    const dataUsdc = new Data();
    dataUsdc.name = 'USDC';
    dataUsdc.value = (this.getUsdcValueUsd()) * this.dataService.getPrice(this.fiat);

    const dataUsd = new Data();
    dataUsd.name = 'USD';
    dataUsd.value = this.getUsdValueUsd() * this.dataService.getPrice(this.fiat);

    const dataLtc = new Data();
    dataLtc.name = 'LTC';
    dataLtc.value = this.getLtcValueUsd() * this.dataService.getPrice(this.fiat);

    const dataDoge = new Data();
    dataDoge.name = 'DOGE';
    dataDoge.value = this.getDogeValueUsd() * this.dataService.getPrice(this.fiat);

    const dataBch = new Data();
    dataBch.name = 'BCH';
    dataBch.value = this.getBchValueUsd() * this.dataService.getPrice(this.fiat);

    const dataTsla = new Data();
    dataTsla.name = 'TSLA';
    dataTsla.value = this.getTslaValueUsd() * this.dataService.getPrice(this.fiat);

    const dataSpy = new Data();
    dataSpy.name = 'SPY';
    dataSpy.value = this.getSpyValueUsd() * this.dataService.getPrice(this.fiat);

    const dataQqq = new Data();
    dataQqq.name = 'QQQ';
    dataQqq.value = this.getQqqValueUsd() * this.dataService.getPrice(this.fiat);

    const dataPltr = new Data();
    dataPltr.name = 'PLTR';
    dataPltr.value = this.getPltrValueUsd() * this.dataService.getPrice(this.fiat);

    const dataSLV = new Data();
    dataSLV.name = 'SLV';
    dataSLV.value = this.getSlvValueUsd() * this.dataService.getPrice(this.fiat);

    const dataAAPL = new Data();
    dataAAPL.name = 'AAPL';
    dataAAPL.value = this.getAaplValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGLD = new Data();
    dataGLD.name = 'GLD';
    dataGLD.value = this.getGldValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGME = new Data();
    dataGME.name = 'GME';
    dataGME.value = this.getGmeValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGOOGL = new Data();
    dataGOOGL.name = 'GOOGL';
    dataGOOGL.value = this.getGooglValueUsd() * this.dataService.getPrice(this.fiat);

    const dataARKK = new Data();
    dataARKK.name = 'ARKK';
    dataARKK.value = this.getArkkValueUsd() * this.dataService.getPrice(this.fiat);

    const dataBABA = new Data();
    dataBABA.name = 'BABA';
    dataBABA.value = this.getBabaValueUsd() * this.dataService.getPrice(this.fiat);

    const dataVNQ = new Data();
    dataVNQ.name = 'VNQ';
    dataVNQ.value = this.getVnqValueUsd() * this.dataService.getPrice(this.fiat);

    const dataURTH = new Data();
    dataURTH.name = 'URTH';
    dataURTH.value = this.getUrthValueUsd() * this.dataService.getPrice(this.fiat);

    const dataTLT = new Data();
    dataTLT.name = 'TLT';
    dataTLT.value = this.getTltValueUsd() * this.dataService.getPrice(this.fiat);

    const dataPDBC = new Data();
    dataPDBC.name = 'PDBC';
    dataPDBC.value = this.getPdbcValueUsd() * this.dataService.getPrice(this.fiat);

    const dataAMZN = new Data();
    dataAMZN.name = 'AMZN';
    dataAMZN.value = this.getAmznValueUsd() * this.dataService.getPrice(this.fiat);

    const dataNVDA = new Data();
    dataNVDA.name = 'NVDA';
    dataNVDA.value = this.getNvdaValueUsd() * this.dataService.getPrice(this.fiat);

    const dataCOIN = new Data();
    dataCOIN.name = 'COIN';
    dataCOIN.value = this.getCoinValueUsd() * this.dataService.getPrice(this.fiat);

    const dataEEM = new Data();
    dataEEM.name = 'EEM';
    dataEEM.value = this.getEemValueUsd() * this.dataService.getPrice(this.fiat);

    const dataMSFT = new Data();
    dataMSFT.name = 'MSFT';
    dataMSFT.value = this.getMsftValueUsd() * this.dataService.getPrice(this.fiat);

    const dataNFLX = new Data();
    dataNFLX.name = 'NFLX';
    dataNFLX.value = this.getNflxValueUsd() * this.dataService.getPrice(this.fiat);

    const dataFB = new Data();
    dataFB.name = 'FB';
    dataFB.value = this.getFbValueUsd() * this.dataService.getPrice(this.fiat);

    const dataVOO = new Data();
    dataVOO.name = 'VOO';
    dataVOO.value = this.getVooValueUsd() * this.dataService.getPrice(this.fiat);

    const dataDIS = new Data();
    dataDIS.name = 'DIS';
    dataDIS.value = this.getDisValueUsd() * this.dataService.getPrice(this.fiat);

    const dataMCHI = new Data();
    dataMCHI.name = 'MCHI';
    dataMCHI.value = this.getMchiValueUsd() * this.dataService.getPrice(this.fiat);

    const dataMSTR = new Data();
    dataMSTR.name = 'MSTR';
    dataMSTR.value = this.getMstrValueUsd() * this.dataService.getPrice(this.fiat);

    const dataINTC = new Data();
    dataINTC.name = 'INTC';
    dataINTC.value = this.getIntcValueUsd() * this.dataService.getPrice(this.fiat);

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd() * this.dataService.getPrice(this.fiat);

    const allValue = dataBtc.value + dataEth.value + dataUsdt.value + dataUsdc.value + dataUsd.value + dataLtc.value +
      dataDoge.value + dataBch.value + dataTsla.value + dataSpy.value + dataQqq.value + dataPltr.value + dataSLV.value +
      dataAAPL.value + dataGLD.value + dataGME.value + dataGOOGL.value + dataARKK.value + dataBABA.value + dataVNQ.value +
      dataURTH.value + dataTLT.value + dataPDBC.value  + dataAMZN.value + dataNVDA.value + dataCOIN.value + dataEEM.value +
      dataMSFT.value + dataNFLX.value + dataFB.value + dataVOO.value + dataDfi.value +
      dataDIS.value + dataMCHI.value + dataMSTR.value + dataINTC.value;

    this.chartOptions = {
      series: [{
        name: this.fiat,
        data: this.getSeriesOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
          dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
          dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
          dataDIS, dataMCHI, dataMSTR, dataINTC, dataDfi)
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
      colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
        dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
        dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
        dataDIS, dataMCHI, dataMSTR, dataINTC, dataDfi),
      xaxis: {
        type: 'category',
        categories: this.getLabelsOverallValue(dataBtc, allValue, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge,
        dataBch, dataTsla, dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK,  dataBABA,
        dataVNQ, dataURTH, dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
        dataDIS, dataMCHI, dataMSTR, dataINTC, dataDfi),
        position: 'bottom',
        labels: {
          style: {
            colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
              dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
              dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
              dataDIS, dataMCHI, dataMSTR, dataINTC, dataDfi),
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
        colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
          dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
          dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
          dataDIS, dataMCHI, dataMSTR, dataINTC, dataDfi)
      },
    };
  }

  private getSeriesOverallValue(dataBtc: Data, dataEth: Data, dataUsdt: Data, dataUsdc: Data, dataUsd: Data,
                                dataLtc: Data, dataDoge: Data, dataBch: Data, dataTsla: Data,
                                dataSpy: Data, dataQqq: Data, dataPltr: Data, dataSLV: Data, dataAAPL: Data, dataGLD: Data,
                                dataGME: Data, dataGOOGL: Data, dataARKK: Data,  dataBABA: Data, dataVNQ: Data,
                                dataURTH: Data, dataTLT: Data, dataPDBC: Data,
                                dataAMZN: Data, dataNVDA: Data, dataCOIN: Data, dataEEM: Data,
                                dataMSFT: Data, dataNFLX: Data, dataFB: Data, dataVOO: Data,
                                dataDIS: Data, dataMCHI: Data, dataMSTR: Data, dataINTC: Data,
                                dataDfi: Data): Array<number> {
    const incomeNumbers = new Array<number>();

    if (dataBtc.value > 0) {
      incomeNumbers.push( +dataBtc.value.toFixed(2));
    }
    if (dataEth.value > 0) {
      incomeNumbers.push( +dataEth.value.toFixed(2));
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
    if (dataAMZN.value > 0) {
      incomeNumbers.push(+dataAMZN.value.toFixed(2));
    }
    if (dataNVDA.value > 0) {
      incomeNumbers.push(+dataNVDA.value.toFixed(2));
    }
    if (dataCOIN.value > 0) {
      incomeNumbers.push(+dataCOIN.value.toFixed(2));
    }
    if (dataEEM.value > 0) {
      incomeNumbers.push(+dataEEM.value.toFixed(2));
    }
    if (dataMSFT.value > 0) {
      incomeNumbers.push(+dataMSFT.value.toFixed(2));
    }
    if (dataNFLX.value > 0) {
      incomeNumbers.push(+dataNFLX.value.toFixed(2));
    }
    if (dataFB.value > 0) {
      incomeNumbers.push(+dataFB.value.toFixed(2));
    }
    if (dataVOO.value > 0) {
      incomeNumbers.push(+dataVOO.value.toFixed(2));
    }
    if (dataDIS.value > 0) {
      incomeNumbers.push(+dataDIS.value.toFixed(2));
    }
    if (dataMCHI.value > 0) {
      incomeNumbers.push(+dataMCHI.value.toFixed(2));
    }
    if (dataMSTR.value > 0) {
      incomeNumbers.push(+dataMSTR.value.toFixed(2));
    }
    if (dataINTC.value > 0) {
      incomeNumbers.push(+dataINTC.value.toFixed(2));
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
                                dataAMZN: Data, dataNVDA: Data, dataCOIN: Data, dataEEM: Data,
                                dataMSFT: Data, dataNFLX: Data, dataFB: Data, dataVOO: Data,
                                dataDIS: Data, dataMCHI: Data, dataMSTR: Data, dataINTC: Data,
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
    if (dataAMZN.value > 0) {
      incomeNumbers.push('#FF9900');
    }
    if (dataNVDA.value > 0) {
      incomeNumbers.push('#76B900');
    }
    if (dataCOIN.value  > 0) {
      incomeNumbers.push('#1652f0');
    }
    if (dataEEM.value  > 0) {
      incomeNumbers.push('#4682B4');
    }
    if (dataMSFT.value  > 0) {
      incomeNumbers.push('#737373');
    }
    if (dataNFLX.value  > 0) {
      incomeNumbers.push('#E50914');
    }
    if (dataFB.value  > 0) {
      incomeNumbers.push('#4267B2');
    }
    if (dataVOO.value  > 0) {
      incomeNumbers.push('#6082B6');
    }
    if (dataDIS.value > 0) {
      incomeNumbers.push('#113CCF');
    }
    if (dataMCHI.value  > 0) {
      incomeNumbers.push('#D1EAF0');
    }
    if (dataMSTR.value > 0) {
      incomeNumbers.push('#df3741');
    }
    if (dataINTC.value > 0) {
      incomeNumbers.push('#0071c5');
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
                                dataURTH: Data, dataTLT: Data, dataPDBC: Data,
                                dataAMZN: Data, dataNVDA: Data, dataCOIN: Data, dataEEM: Data,
                                dataMSFT: Data, dataNFLX: Data, dataFB: Data, dataVOO: Data,
                                dataDIS: Data, dataMCHI: Data, dataMSTR: Data, dataINTC: Data,
                                dataDfi: Data): Array<string> {

    const incomeNumbers = new Array<string>();
    if (this.getAnteilPortfolioForChart(dataBtc, allValue) > 0) {
      incomeNumbers.push('BTC ' + this.getAnteilPortfolioForChart(dataBtc, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataEth, allValue) > 0) {
      incomeNumbers.push('ETH ' + this.getAnteilPortfolioForChart(dataEth, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsdt, allValue) > 0) {
      incomeNumbers.push('USDT ' + this.getAnteilPortfolioForChart(dataUsdt, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsdc, allValue) > 0) {
      incomeNumbers.push('USDC ' + this.getAnteilPortfolioForChart(dataUsdc, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataUsd, allValue) > 0) {
      incomeNumbers.push('DUSD ' + this.getAnteilPortfolioForChart(dataUsd, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataLtc, allValue) > 0) {
      incomeNumbers.push('LTC ' + this.getAnteilPortfolioForChart(dataLtc, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDoge, allValue) > 0) {
      incomeNumbers.push('DOGE ' + this.getAnteilPortfolioForChart(dataDoge, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBch, allValue) > 0) {
      incomeNumbers.push('BCH ' + this.getAnteilPortfolioForChart(dataBch, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataTsla, allValue) > 0) {
      incomeNumbers.push('TSLA ' + this.getAnteilPortfolioForChart(dataTsla, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataSpy, allValue) > 0) {
      incomeNumbers.push('SPY ' + this.getAnteilPortfolioForChart(dataSpy, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataQqq, allValue) > 0) {
      incomeNumbers.push('QQQ ' + this.getAnteilPortfolioForChart(dataQqq, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPltr, allValue) > 0) {
      incomeNumbers.push('PLTR ' + this.getAnteilPortfolioForChart(dataPltr, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataSLV, allValue) > 0) {
      incomeNumbers.push('SLV ' + this.getAnteilPortfolioForChart(dataSLV, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataAAPL, allValue) > 0) {
      incomeNumbers.push('AAPL ' + this.getAnteilPortfolioForChart(dataAAPL, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGLD, allValue) > 0) {
      incomeNumbers.push('GLD ' + this.getAnteilPortfolioForChart(dataGLD, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGME, allValue) > 0) {
      incomeNumbers.push('GME ' + this.getAnteilPortfolioForChart(dataGME, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGOOGL, allValue) > 0) {
      incomeNumbers.push('GOOGL ' + this.getAnteilPortfolioForChart(dataGOOGL, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataARKK, allValue) > 0) {
      incomeNumbers.push('ARKK ' + this.getAnteilPortfolioForChart(dataARKK, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBABA, allValue) > 0) {
      incomeNumbers.push('BABA ' + this.getAnteilPortfolioForChart(dataBABA, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataVNQ, allValue) > 0) {
      incomeNumbers.push('VNQ ' + this.getAnteilPortfolioForChart(dataVNQ, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataURTH, allValue) > 0) {
      incomeNumbers.push('URTH ' + this.getAnteilPortfolioForChart(dataURTH, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataTLT, allValue) > 0) {
      incomeNumbers.push('TLT ' + this.getAnteilPortfolioForChart(dataTLT, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPDBC, allValue) > 0) {
      incomeNumbers.push('PDBC ' + this.getAnteilPortfolioForChart(dataPDBC, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataAMZN, allValue) > 0) {
      incomeNumbers.push('AMZN ' + this.getAnteilPortfolioForChart(dataAMZN, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataNVDA, allValue) > 0) {
      incomeNumbers.push('NVDA ' + this.getAnteilPortfolioForChart(dataNVDA, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataCOIN, allValue) > 0) {
      incomeNumbers.push('COIN ' + this.getAnteilPortfolioForChart(dataCOIN, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataEEM, allValue) > 0) {
      incomeNumbers.push('EEM ' + this.getAnteilPortfolioForChart(dataEEM, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataMSFT, allValue) > 0) {
      incomeNumbers.push('MSFT ' + this.getAnteilPortfolioForChart(dataMSFT, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataNFLX, allValue) > 0) {
      incomeNumbers.push('NFLX ' + this.getAnteilPortfolioForChart(dataNFLX, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataFB, allValue) > 0) {
      incomeNumbers.push('FB ' + this.getAnteilPortfolioForChart(dataFB, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataVOO, allValue) > 0) {
      incomeNumbers.push('VOO ' + this.getAnteilPortfolioForChart(dataVOO, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDIS, allValue) > 0) {
      incomeNumbers.push('DIS ' + this.getAnteilPortfolioForChart(dataDIS, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataMCHI, allValue) > 0) {
      incomeNumbers.push('MCHI ' + this.getAnteilPortfolioForChart(dataMCHI, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataMSTR, allValue) > 0) {
      incomeNumbers.push('MSTR ' + this.getAnteilPortfolioForChart(dataMSTR, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataINTC, allValue) > 0) {
      incomeNumbers.push('INTC ' + this.getAnteilPortfolioForChart(dataINTC, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDfi, allValue) > 0) {
      incomeNumbers.push('DFI ' + this.getAnteilPortfolioForChart(dataDfi, allValue).toFixed(1) + '%');
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
