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
  dfiInDfxStaking!: number;

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
        loan += +addressVault.interestValue;
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
    let pypl = 0; let brkb = 0; let ko = 0; let pg = 0;
    let sap = 0; let ura = 0; let cs = 0; let gsg = 0;
    let xom = 0; let govt = 0; let tan = 0; let pplt = 0;
    let jnj = 0; let addyy = 0; let gs = 0; let dax = 0;

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
        } else if ('PYPL' === loan.symbolKey) {
          pypl = +loan.amount * +loan.activePrice.active.amount;
        } else if ('BRK.B' === loan.symbolKey) {
          brkb = +loan.amount * +loan.activePrice.active.amount;
        } else if ('KO' === loan.symbolKey) {
          ko = +loan.amount * +loan.activePrice.active.amount;
        } else if ('PG' === loan.symbolKey) {
          pg = +loan.amount * +loan.activePrice.active.amount;
        } else if ('URA' === loan.symbolKey) {
          ura = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GSG' === loan.symbolKey) {
          gsg = +loan.amount * +loan.activePrice.active.amount;
        } else if ('CS' === loan.symbolKey) {
          cs = +loan.amount * +loan.activePrice.active.amount;
        } else if ('SAP' === loan.symbolKey) {
          sap = +loan.amount * +loan.activePrice.active.amount;
        } else if ('PPLT' === loan.symbolKey) {
          pplt = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GOVT' === loan.symbolKey) {
          govt = +loan.amount * +loan.activePrice.active.amount;
        } else if ('TAN' === loan.symbolKey) {
          tan = +loan.amount * +loan.activePrice.active.amount;
        } else if ('XOM' === loan.symbolKey) {
          xom = +loan.amount * +loan.activePrice.active.amount;
        } else if ('JNJ' === loan.symbolKey) {
          jnj = +loan.amount * +loan.activePrice.active.amount;
        } else if ('ADDYY' === loan.symbolKey) {
          addyy = +loan.amount * +loan.activePrice.active.amount;
        } else if ('GS' === loan.symbolKey) {
          gs = +loan.amount * +loan.activePrice.active.amount;
        } else if ('DAX' === loan.symbolKey) {
          dax = +loan.amount * +loan.activePrice.active.amount;
        }
      });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx
      + fb + voo + dis + mchi + mstr + intc + pypl + brkb + ko + pg
      + sap + ura + gsg + cs + pplt + xom + govt + tan + jnj + gs + addyy + dax;
  }

  getNextLoanFromVaultUsd(vault: Vault): number {

    let usd = 0; let spy = 0; let tsla = 0; let qqq = 0; let pltr = 0; let slv = 0; let aapl = 0; let gld = 0;
    let gme = 0; let google = 0; let arkk = 0; let baba = 0; let vnq = 0; let urth = 0; let tlt = 0;
    let pdbc = 0; let amzn = 0; let nvda = 0; let coin = 0; let eem = 0;
    let msft = 0; let nflx = 0; let fb = 0; let voo = 0;
    let dis = 0; let mchi = 0; let mstr = 0; let intc = 0;
    let pypl = 0; let brkb = 0; let ko = 0; let pg = 0;
    let sap = 0; let ura = 0; let cs = 0; let gsg = 0;
    let xom = 0; let govt = 0; let tan = 0; let pplt = 0;
    let jnj = 0; let addyy = 0; let gs = 0; let dax = 0;

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
      } else if ('PYPL' === loan.symbolKey) {
        pypl = +loan.amount * +loan.activePrice.next.amount;
      } else if ('BRK.B' === loan.symbolKey) {
        brkb = +loan.amount * +loan.activePrice.next.amount;
      } else if ('KO' === loan.symbolKey) {
        ko = +loan.amount * +loan.activePrice.next.amount;
      } else if ('PG' === loan.symbolKey) {
        pg = +loan.amount * +loan.activePrice.next.amount;
      } else if ('URA' === loan.symbolKey) {
        ura = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GSG' === loan.symbolKey) {
        gsg = +loan.amount * +loan.activePrice.next.amount;
      } else if ('CS' === loan.symbolKey) {
        cs = +loan.amount * +loan.activePrice.next.amount;
      } else if ('SAP' === loan.symbolKey) {
        sap = +loan.amount * +loan.activePrice.next.amount;
      } else if ('PPLT' === loan.symbolKey) {
        pplt = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GOVT' === loan.symbolKey) {
        govt = +loan.amount * +loan.activePrice.next.amount;
      } else if ('TAN' === loan.symbolKey) {
        tan = +loan.amount * +loan.activePrice.next.amount;
      } else if ('XOM' === loan.symbolKey) {
        xom = +loan.amount * +loan.activePrice.next.amount;
      } else if ('JNJ' === loan.symbolKey) {
        jnj = +loan.amount * +loan.activePrice.next.amount;
      } else if ('ADDYY' === loan.symbolKey) {
        addyy = +loan.amount * +loan.activePrice.next.amount;
      } else if ('GS' === loan.symbolKey) {
        gs = +loan.amount * +loan.activePrice.next.amount;
      } else if ('DAX' === loan.symbolKey) {
        dax = +loan.amount * +loan.activePrice.next.amount;
      }
    });

    return usd + spy + tsla + qqq + pltr + slv + aapl + gld + gme + google + arkk
      + baba + vnq + urth + tlt + pdbc + amzn + nvda + coin + eem + msft + nflx
      + fb + voo + dis + mchi + mstr + intc + pypl + brkb + ko + pg
      + sap + ura + gsg + cs  + pplt + xom + govt + tan  + jnj + gs + addyy + dax;
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
      + usdtInVaults * usdtActualPrice + dusdInVaults * dusdActualPrice + ethInVaults * this.getPool('ETH')?.priceA;
  }

  getPool(name: string): Pool {
    return this.pools?.find(p => p.tokenASymbol === name);
  }

  getPoolSymbol(name: string): Pool {
    return this.pools?.find(p => p.symbol === name);
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
    return (this.wallet?.dfiInMasternodes) * this.getPool('BTC')?.priceB;
  }

  getMasternodeDfiUsdWithoutFreeezer(): number {
    return (this.wallet?.dfiInMasternodes - this.getFreezerDfiCount()) * this.getPool('BTC')?.priceB;
  }

  // CRYPTO IN WALLET AND POOLS
  getBtcValueUsd(): number {
    return (this.wallet.btcInBtcPool + this.wallet.btc + this.getCollateralCountVaults('BTC')) * this.getPool('BTC')?.priceA;
  }

  getEthValueUsd(): number {
    return (this.wallet.ethInEthPool + this.wallet.eth + this.getCollateralCountVaults('ETH')) * this.getPool('ETH')?.priceA;
  }

  getUsdtValueUsd(): number {
    return (this.wallet?.usdtInUsdtPool + this.wallet?.usdtInUsdtDusdPool + this.wallet.usdt
      + this.getCollateralCountVaults('USDT')) * this.getPool('USDT')?.priceA;
  }

  getUsdcValueUsd(): number {
    return (this.wallet?.usdcInUsdcPool + this.wallet?.usdcInUsdcDusdPool + this.wallet.usdc
      + this.getCollateralCountVaults('USDC')) * this.getPool('USDC')?.priceA;
  }

  getLtcValueUsd(): number {
    return (this.wallet.ltcInLtcPool + this.wallet.ltc) * this.getPool('LTC')?.priceA;
  }

  getDogeValueUsd(): number {
    return (this.wallet.dogeInDogePool + this.wallet.doge) * this.getPool('DOGE')?.priceA;
  }

  getBchValueUsd(): number {
    return (this.wallet.bchInBchPool + this.wallet.bch) * this.getPool('BCH')?.priceA;
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
      || this.wallet?.usdInPyplPool > 0
      || this.wallet?.usdInBrkbPool > 0 || this.wallet?.usdInKoPool > 0 || this.wallet?.usdInPgPool > 0
      || this.wallet?.usdInSapPool > 0
      || this.wallet?.usdInUraPool > 0 || this.wallet?.usdInCsPool > 0 || this.wallet?.usdInGsgPool > 0
      || this.wallet?.usdInPpltPool > 0
      || this.wallet?.usdInGovtPool > 0 || this.wallet?.usdInTanPool > 0 || this.wallet?.usdInXomPool > 0
      || this.wallet?.usdtInUsdtDusdPool > 0 || this.wallet?.usdcInUsdcDusdPool > 0
      || this.wallet?.usdInJnjPool > 0 || this.wallet?.usdInAddyyPool > 0
      || this.wallet?.usdInGsPool > 0 || this.wallet?.usdInDaxPool > 0
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
      + this.wallet?.usdInIntcPool + this.wallet?.usdInPyplPool + this.wallet?.usdInBrkbPool +  this.wallet?.usdInKoPool
      + this.wallet?.usdInPgPool + this.wallet?.usdInSapPool + this.wallet?.usdInUraPool + this.wallet?.usdInCsPool
      + this.wallet?.usdInGsgPool + this.wallet?.usdInPpltPool + this.wallet?.usdInGovtPool + this.wallet?.usdInTanPool
      + this.wallet?.usdInXomPool + this.wallet?.usdtInUsdtDusdPool +  this.wallet?.usdcInUsdcDusdPool  + this.wallet?.usdInJnjPool
      + this.wallet?.usdInAddyyPool + this.wallet?.usdInGsPool + this.wallet?.usdInDaxPool
      + this.getCollateralCountVaults('DUSD');
  }

  getUsdValueUsd(): number {
    return this.getUsdCount() * this.getDUSDPrice();
  }

  //  STOCKS VALUE IN WALLET AND POOLS
  getTslaValueUsd(): number {
    return (this.wallet?.tslaInTslaPool + this.wallet?.tsla) * this.getUsdPriceOfStockPools(this.getPool('TSLA'));
  }
  getSpyValueUsd(): number {
    return (this.wallet?.spyInSpyPool + this.wallet?.spy) * this.getUsdPriceOfStockPools(this.getPool('SPY'));
  }
  getQqqValueUsd(): number {
    return (this.wallet?.qqqInQqqPool + this.wallet?.qqq) * this.getUsdPriceOfStockPools(this.getPool('QQQ'));
  }
  getPltrValueUsd(): number {
    return (this.wallet?.pltrInPltrPool + this.wallet?.pltr) * this.getUsdPriceOfStockPools(this.getPool('PLTR'));
  }
  getSlvValueUsd(): number {
    return (this.wallet?.slvInSlvPool + this.wallet?.slv) * this.getUsdPriceOfStockPools(this.getPool('SLV'));
  }
  getAaplValueUsd(): number {
    return (this.wallet?.aaplInAaplPool + this.wallet?.aapl) * this.getUsdPriceOfStockPools(this.getPool('AAPL'));
  }
  getGldValueUsd(): number {
    return (this.wallet?.gldInGldPool + this.wallet?.gld) * this.getUsdPriceOfStockPools(this.getPool('GLD'));
  }
  getGmeValueUsd(): number {
    return (this.wallet?.gmeInGmePool + this.wallet?.gme) * this.getUsdPriceOfStockPools(this.getPool('GME'));
  }
  getGooglValueUsd(): number {
    return (this.wallet?.googlInGooglPool + this.wallet?.googl) * this.getUsdPriceOfStockPools(this.getPool('GOOGL'));
  }
  getArkkValueUsd(): number {
    return (this.wallet?.arkkInArkkPool + this.wallet?.arkk) * this.getUsdPriceOfStockPools(this.getPool('ARKK'));
  }
  getBabaValueUsd(): number {
    return (this.wallet?.babaInBabaPool + this.wallet?.baba) * this.getUsdPriceOfStockPools(this.getPool('BABA'));
  }
  getVnqValueUsd(): number {
    return (this.wallet?.vnqInVnqPool + this.wallet?.vnq) * this.getUsdPriceOfStockPools(this.getPool('VNQ'));
  }
  getUrthValueUsd(): number {
    return (this.wallet?.urthInUrthPool + this.wallet?.urth) * this.getUsdPriceOfStockPools(this.getPool('URTH'));
  }
  getTltValueUsd(): number {
    return (this.wallet?.tltInTltPool + this.wallet?.tlt) * this.getUsdPriceOfStockPools(this.getPool('TLT'));
  }
  getPdbcValueUsd(): number {
    return (this.wallet?.pdbcInPdbcPool + this.wallet?.pdbc) * this.getUsdPriceOfStockPools(this.getPool('PDBC'));
  }
  getAmznValueUsd(): number {
    return (this.wallet?.amznInAmznPool + this.wallet?.amzn) * this.getUsdPriceOfStockPools(this.getPool('AMZN'));
  }
  getNvdaValueUsd(): number {
    return (this.wallet?.nvdaInNvdaPool + this.wallet?.nvda) * this.getUsdPriceOfStockPools(this.getPool('NVDA'));
  }
  getCoinValueUsd(): number {
    return (this.wallet?.coinInCoinPool + this.wallet?.coin) * this.getUsdPriceOfStockPools(this.getPool('COIN'));
  }
  getEemValueUsd(): number {
    return (this.wallet?.eemInEemPool + this.wallet?.eem) * this.getUsdPriceOfStockPools(this.getPool('EEM'));
  }
  getMsftValueUsd(): number {
    return (this.wallet?.msftInMsftPool + this.wallet?.msft) * this.getUsdPriceOfStockPools(this.getPool('MSFT'));
  }
  getNflxValueUsd(): number {
    return (this.wallet?.nflxInNflxPool + this.wallet?.nflx) * this.getUsdPriceOfStockPools(this.getPool('NFLX'));
  }
  getFbValueUsd(): number {
    return (this.wallet?.fbInFbPool + this.wallet?.fb) * this.getUsdPriceOfStockPools(this.getPool('FB'));
  }
  getVooValueUsd(): number {
    return (this.wallet?.vooInVooPool + this.wallet?.voo) * this.getUsdPriceOfStockPools(this.getPool('VOO'));
  }
  getDisValueUsd(): number {
    return (this.wallet?.disInDisPool + this.wallet?.dis) * this.getUsdPriceOfStockPools(this.getPool('DIS'));
  }
  getMchiValueUsd(): number {
    return (this.wallet?.mchiInMchiPool + this.wallet?.mchi) * this.getUsdPriceOfStockPools(this.getPool('MCHI'));
  }
  getMstrValueUsd(): number {
    return (this.wallet?.mstrInMstrPool + this.wallet?.mstr) * this.getUsdPriceOfStockPools(this.getPool('MSTR'));
  }
  getIntcValueUsd(): number {
    return (this.wallet?.intcInIntcPool + this.wallet?.intc) * this.getUsdPriceOfStockPools(this.getPool('INTC'));
  }
  getPyplValueUsd(): number {
    return (this.wallet?.pyplInPyplPool + this.wallet?.pypl) * this.getUsdPriceOfStockPools(this.getPool('PYPL'));
  }
  getBrkbValueUsd(): number {
    return (this.wallet?.brkbInBrkbPool + this.wallet?.brkb) * this.getUsdPriceOfStockPools(this.getPool('BRK.B'));
  }
  getKoValueUsd(): number {
    return (this.wallet?.koInKoPool + this.wallet?.ko) * this.getUsdPriceOfStockPools(this.getPool('KO'));
  }
  getPgValueUsd(): number {
    return (this.wallet?.pgInPgPool + this.wallet?.pg) * this.getUsdPriceOfStockPools(this.getPool('PG'));
  }
  getSapValueUsd(): number {
    return (this.wallet?.sapInSapPool + this.wallet?.sap) * this.getUsdPriceOfStockPools(this.getPool('SAP'));
  }
  getUraValueUsd(): number {
    return (this.wallet?.uraInUraPool + this.wallet?.ura) * this.getUsdPriceOfStockPools(this.getPool('URA'));
  }
  getCsValueUsd(): number {
    return (this.wallet?.csInCsPool + this.wallet?.cs) * this.getUsdPriceOfStockPools(this.getPool('CS'));
  }
  getGsgValueUsd(): number {
    return (this.wallet?.gsgInGsgPool + this.wallet?.gsg) * this.getUsdPriceOfStockPools(this.getPool('GSG'));
  }
  getPpltValueUsd(): number {
    return (this.wallet?.ppltInPpltPool + this.wallet?.pplt) * this.getUsdPriceOfStockPools(this.getPool('PPLT'));
  }
  getGovtValueUsd(): number {
    return (this.wallet?.govtInGovtPool + this.wallet?.govt) * this.getUsdPriceOfStockPools(this.getPool('GOVT'));
  }
  getTanValueUsd(): number {
    return (this.wallet?.tanInTanPool + this.wallet?.tan) * this.getUsdPriceOfStockPools(this.getPool('TAN'));
  }
  getXomValueUsd(): number {
    return (this.wallet?.xomInXomPool + this.wallet?.xom) * this.getUsdPriceOfStockPools(this.getPool('XOM'));
  }
  getJnjValueUsd(): number {
    return (this.wallet?.jnjInJnjPool + this.wallet?.jnj) * this.getUsdPriceOfStockPools(this.getPool('JNJ'));
  }
  getAddyyValueUsd(): number {
    return (this.wallet?.addyyInAddyyPool + this.wallet?.addyy) * this.getUsdPriceOfStockPools(this.getPool('ADDYY'));
  }
  getGsValueUsd(): number {
    return (this.wallet?.gsInGsPool + this.wallet?.gs) * this.getUsdPriceOfStockPools(this.getPool('GS'));
  }
  getDaxValueUsd(): number {
    return (this.wallet?.daxInDaxPool + this.wallet?.dax) * this.getUsdPriceOfStockPools(this.getPool('DAX'));
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

  getAllValuesUsdPrice(): number {
    // All Crypto and Stock values
    const allCryptoAndStocks = this.getBtcValueUsd() + this.getEthValueUsd() + this.getUsdtValueUsd() + this.getUsdcValueUsd()
      + this.getLtcValueUsd() + this.getDogeValueUsd() + this.getBchValueUsd() + this.getDfiValueUsd()  + this.getTslaValueUsd()
      + this.getUsdValueUsd() + this.getSpyValueUsd() + this.getQqqValueUsd() + this.getPltrValueUsd()
      + this.getSlvValueUsd() + this.getAaplValueUsd() + this.getGldValueUsd() + this.getGmeValueUsd() + this.getGooglValueUsd()
      + this.getArkkValueUsd() + this.getBabaValueUsd() + this.getVnqValueUsd() + this.getUrthValueUsd() + this.getTltValueUsd()
      + this.getPdbcValueUsd() + this.getAmznValueUsd() + this.getNvdaValueUsd() + this.getCoinValueUsd() + this.getEemValueUsd()
      + this.getMsftValueUsd() + this.getNflxValueUsd() + this.getFbValueUsd() + this.getVooValueUsd()
      + this.getDisValueUsd() + this.getMchiValueUsd() + this.getMstrValueUsd() + this.getIntcValueUsd()
      + this.getPyplValueUsd() + this.getBrkbValueUsd() + this.getKoValueUsd() + this.getPgValueUsd()
      + this.getSapValueUsd() + this.getUraValueUsd() + this.getCsValueUsd() + this.getGsgValueUsd()
      + this.getPpltValueUsd() + this.getGovtValueUsd() + this.getTanValueUsd() + this.getXomValueUsd()
      + this.getJnjValueUsd() + this.getAddyyValueUsd() + this.getGsValueUsd() + this.getDaxValueUsd();
    // Collateral
    const collateral = this.getVaultsCollateralUsd();

    return allCryptoAndStocks  + collateral;

  }

  // WALLETS HOLDINGS
  getWalletValueUsd(): number {
    return this.getDfiCountWalletUsd() + this.getBtcWalletValueUsd() + this.getEthWalletValueUsd() +
      this.getUsdtWalletValueUsd() + this.getUsdcWalletValueUsd() + this.getLtcWalletValueUsd() + this.getDogeWalletValueUsd()
      + this.getBchWalletValueUsd()
      + this.getUsdWalletValueUsd() + this.getTslaWalletValueUsd() + this.getSpyWalletValueUsd() + this.getQqqWalletValueUsd()
      + this.getPltrWalletValueUsd() + this.getSlvWalletValueUsd() + this.getAaplWalletValueUsd() + this.getGldWalletValueUsd()
      + this.getGmeWalletValueUsd() + this.getGooglWalletValueUsd() + this.getArkkWalletValueUsd() + this.getBabaWalletValueUsd()
      + this.getVnqWalletValueUsd() + this.getUrthWalletValueUsd() + this.getTltWalletValueUsd() + this.getPdbcWalletValueUsd()
      + this.getAmznWalletValueUsd() + this.getNvdaWalletValueUsd() + this.getCoinWalletValueUsd() + this.getEemWalletValueUsd()
      + this.getMsftWalletValueUsd() + this.getNflxWalletValueUsd() + this.getFbWalletValueUsd() + this.getVooWalletValueUsd()
      + this.getDisWalletValueUsd() + this.getMchiWalletValueUsd() + this.getMstrWalletValueUsd() + this.getIntcWalletValueUsd()
      + this.getPyplWalletValueUsd() + this.getBrkbWalletValueUsd() + this.getKoWalletValueUsd() + this.getPgWalletValueUsd()
      + this.getSapWalletValueUsd() + this.getUraWalletValueUsd() + this.getCsWalletValueUsd() + this.getGsgWalletValueUsd()
      + this.getPpltWalletValueUsd() + this.getGovtWalletValueUsd() + this.getTanWalletValueUsd() + this.getXomWalletValueUsd()
      + this.getJnjWalletValueUsd() + this.getAddyyWalletValueUsd() + this.getGsWalletValueUsd() + this.getDaxWalletValueUsd();
  }

  getDfiCountWalletUsd(): number {
    return this.getDfiCountWallet() * this.getPool('BTC')?.priceB;
  }

  getDfiCountWallet(): number {
    return this.wallet?.dfi;
  }

  getEthWalletValueUsd(): number {
    return  this.wallet.eth * this.getPool('ETH')?.priceA;
  }

  getBtcWalletValueUsd(): number {
    return this.wallet.btc * this.getPool('BTC')?.priceA;
  }

  getBchWalletValueUsd(): number {
    return this.wallet.bch * this.getPool('BCH')?.priceA;
  }

  getUsdtWalletValueUsd(): number {
    return (this.wallet.usdt + this.wallet.usdtDusd) * this.getPool('USDT')?.priceA;
  }

  getUsdcWalletValueUsd(): number {
    return (this.wallet.usdc + this.wallet.usdcDusd) * this.getPool('USDC')?.priceA;
  }

  getDogeWalletValueUsd(): number {
    return this.wallet.doge * this.getPool('DOGE')?.priceA;
  }

  getUsdWalletValueUsd(): number {
    return this.wallet.usd * this.getDUSDPrice();
  }

  getLtcWalletValueUsd(): number {
    return this.wallet.ltc * this.getPool('LTC')?.priceA;
  }

  getTslaWalletValueUsd(): number {
    return this.wallet.tsla * this.getUsdPriceOfStockPools(this.getPool('TSLA'));
  }

  getSpyWalletValueUsd(): number {
    return this.wallet?.spy * this.getUsdPriceOfStockPools(this.getPool('SPY'));
  }
  getQqqWalletValueUsd(): number {
    return  this.wallet?.qqq * this.getUsdPriceOfStockPools(this.getPool('QQQ'));
  }
  getPltrWalletValueUsd(): number {
    return  this.wallet?.pltr * this.getUsdPriceOfStockPools(this.getPool('PLTR'));
  }
  getSlvWalletValueUsd(): number {
    return this.wallet?.slv * this.getUsdPriceOfStockPools(this.getPool('SLV'));
  }
  getAaplWalletValueUsd(): number {
    return  this.wallet?.aapl * this.getUsdPriceOfStockPools(this.getPool('AAPL'));
  }
  getGldWalletValueUsd(): number {
    return this.wallet?.gld * this.getUsdPriceOfStockPools(this.getPool('GLD'));
  }
  getGmeWalletValueUsd(): number {
    return this.wallet?.gme * this.getUsdPriceOfStockPools(this.getPool('GME'));
  }
  getGooglWalletValueUsd(): number {
    return this.wallet?.googl * this.getUsdPriceOfStockPools(this.getPool('GOOGL'));
  }
  getArkkWalletValueUsd(): number {
    return this.wallet?.arkk * this.getUsdPriceOfStockPools(this.getPool('ARKK'));
  }
  getBabaWalletValueUsd(): number {
    return this.wallet?.baba * this.getUsdPriceOfStockPools(this.getPool('BABA'));
  }
  getVnqWalletValueUsd(): number {
    return this.wallet?.vnq * this.getUsdPriceOfStockPools(this.getPool('VNQ'));
  }
  getUrthWalletValueUsd(): number {
    return this.wallet?.urth * this.getUsdPriceOfStockPools(this.getPool('URTH'));
  }
  getTltWalletValueUsd(): number {
    return this.wallet?.tlt * this.getUsdPriceOfStockPools(this.getPool('TLT'));
  }
  getPdbcWalletValueUsd(): number {
    return this.wallet?.pdbc * this.getUsdPriceOfStockPools(this.getPool('PDBC'));
  }
  getAmznWalletValueUsd(): number {
    return this.wallet?.amzn * this.getUsdPriceOfStockPools(this.getPool('AMZN'));
  }
  getNvdaWalletValueUsd(): number {
    return this.wallet?.nvda * this.getUsdPriceOfStockPools(this.getPool('NVDA'));
  }
  getCoinWalletValueUsd(): number {
    return this.wallet?.coin * this.getUsdPriceOfStockPools(this.getPool('COIN'));
  }
  getEemWalletValueUsd(): number {
    return this.wallet?.eem * this.getUsdPriceOfStockPools(this.getPool('EEM'));
  }
  getMsftWalletValueUsd(): number {
    return this.wallet?.msft * this.getUsdPriceOfStockPools(this.getPool('MSFT'));
  }
  getNflxWalletValueUsd(): number {
    return this.wallet?.nflx * this.getUsdPriceOfStockPools(this.getPool('NFLX'));
  }
  getFbWalletValueUsd(): number {
    return this.wallet?.fb * this.getUsdPriceOfStockPools(this.getPool('FB'));
  }
  getVooWalletValueUsd(): number {
    return this.wallet?.voo * this.getUsdPriceOfStockPools(this.getPool('VOO'));
  }
  getDisWalletValueUsd(): number {
    return this.wallet?.dis * this.getUsdPriceOfStockPools(this.getPool('DIS'));
  }
  getMchiWalletValueUsd(): number {
    return this.wallet?.mchi * this.getUsdPriceOfStockPools(this.getPool('MCHI'));
  }
  getMstrWalletValueUsd(): number {
    return this.wallet?.mstr * this.getUsdPriceOfStockPools(this.getPool('MSTR'));
  }
  getIntcWalletValueUsd(): number {
    return this.wallet?.intc * this.getUsdPriceOfStockPools(this.getPool('INTC'));
  }
  getPyplWalletValueUsd(): number {
    return this.wallet?.pypl * this.getUsdPriceOfStockPools(this.getPool('PYPL'));
  }
  getBrkbWalletValueUsd(): number {
    return this.wallet?.brkb * this.getUsdPriceOfStockPools(this.getPool('BRK.B'));
  }
  getKoWalletValueUsd(): number {
    return this.wallet?.ko * this.getUsdPriceOfStockPools(this.getPool('KO'));
  }
  getPgWalletValueUsd(): number {
    return this.wallet?.pg * this.getUsdPriceOfStockPools(this.getPool('PG'));
  }
  getSapWalletValueUsd(): number {
    return this.wallet?.sap * this.getUsdPriceOfStockPools(this.getPool('SAP'));
  }
  getUraWalletValueUsd(): number {
    return this.wallet?.ura * this.getUsdPriceOfStockPools(this.getPool('URA'));
  }
  getGsgWalletValueUsd(): number {
    return this.wallet?.gsg * this.getUsdPriceOfStockPools(this.getPool('GSG'));
  }
  getCsWalletValueUsd(): number {
    return this.wallet?.cs * this.getUsdPriceOfStockPools(this.getPool('CS'));
  }
  getPpltWalletValueUsd(): number {
    return this.wallet?.pplt * this.getUsdPriceOfStockPools(this.getPool('PPLT'));
  }
  getGovtWalletValueUsd(): number {
    return this.wallet?.govt * this.getUsdPriceOfStockPools(this.getPool('GOVT'));
  }
  getTanWalletValueUsd(): number {
    return this.wallet?.tan * this.getUsdPriceOfStockPools(this.getPool('TAN'));
  }
  getXomWalletValueUsd(): number {
    return this.wallet?.xom * this.getUsdPriceOfStockPools(this.getPool('XOM'));
  }
  getJnjWalletValueUsd(): number {
    return this.wallet?.jnj * this.getUsdPriceOfStockPools(this.getPool('JNJ'));
  }
  getAddyyWalletValueUsd(): number {
    return this.wallet?.addyy * this.getUsdPriceOfStockPools(this.getPool('ADDYY'));
  }
  getGsWalletValueUsd(): number {
    return this.wallet?.gs * this.getUsdPriceOfStockPools(this.getPool('GS'));
  }
  getDaxWalletValueUsd(): number {
    return this.wallet?.dax * this.getUsdPriceOfStockPools(this.getPool('DAX'));
  }

  getDfiValueUsd(): number {
    return this.getDfiCount() * this.getPool('BTC')?.priceB;
  }

  getDfiInVaultUsd(): number {
    return this.getCollateralCountVaults('DFI') * this.getPool('BTC')?.priceB;
  }

  getBtcInVaultUsd(): number {
    return this.getCollateralCountVaults('BTC') * this.getPool('BTC')?.priceA;
  }

  getDfiCount(): number {
    return this.wallet.dfi + this.wallet.dfiInEthPool + this.wallet.dfiInBtcPool + this.wallet.dfiInUsdtPool + this.wallet.dfiInUsdcPool
      + this.wallet.dfiInLtcPool + this.wallet.dfiInDogePool + this.wallet.dfiInBchPool + this.wallet.dfiInUsdPool
      + this.dfiInStaking + this.dfiInDfxStaking + this.wallet.dfiInMasternodes + this.getCollateralCountVaults('DFI');
  }

  getAnteilStakingOfAllValue(): number {
    return this.getStakingValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilMasternodesOfAllValue(): number {
    return (this.getMasternodeDfiUsd()) / this.getAllValuesUsdPrice() * 100;
  }

  getStakingValueUsd(): number {
    return (this.dfiInStaking + this.dfiInDfxStaking) * this.getPool('BTC')?.priceB;
  }

  getAnteilLMOfAllValue(): number {
    return this.getLmUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getLmUsd(): number {
    return this.getAnteilLMOfBtcPoolValue() + this.getAnteilLMOfEthPoolValue()
      + this.getAnteilLMOfLtcPoolValue() + this.getAnteilLMOfUsdtPoolValue() + this.getAnteilLMOfUsdtDusdPoolValue()
      + this.getAnteilLMOfUsdcPoolValue() + this.getAnteilLMOfUsdcDusdPoolValue()
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
      + this.getAnteilLMOfIntcPoolValue() + this.getAnteilLMOfPyplPoolValue() + this.getAnteilLMOfBrkbPoolValue()
      + this.getAnteilLMOfKoPoolValue() + this.getAnteilLMOfPgPoolValue() + this.getAnteilLMOfSapPoolValue()
      + this.getAnteilLMOfUraPoolValue() + this.getAnteilLMOfCsPoolValue() + this.getAnteilLMOfGsgPoolValue()
      + this.getAnteilLMOfPpltPoolValue()
      + this.getAnteilLMOfGovtPoolValue() + this.getAnteilLMOfTanPoolValue() + this.getAnteilLMOfXomPoolValue()
      + this.getAnteilLMOfJnjPoolValue() + this.getAnteilLMOfAddyyPoolValue() + this.getAnteilLMOfGsPoolValue()
      + this.getAnteilLMOfDaxPoolValue();
  }

  getAnteilCollaterallOfAllValue(): number {
    return this.getVaultsCollateralUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getAnteilLoanOfAllValue(): number {
    return this.getVaultsLoansValueUsd() / this.getAllValuesUsdPrice() * 100;
  }

  getDfiCountLMUsd(): number {
    return this.getDfiCountLM() * this.getPool('BTC')?.priceB;
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
      this.loanValues.push(new LoanValue('DUSD', this.getPool('DUSD')));
    }
    if (this.getLoanCountVaults('TSLA') > 0) {
      this.loanValues.push(new LoanValue('TSLA', this.getPool('TSLA')));
    }
    if (this.getLoanCountVaults('AAPL') > 0) {
    this.loanValues.push(new LoanValue('AAPL', this.getPool('AAPL')));
    }
    if (this.getLoanCountVaults('ARKK') > 0) {
    this.loanValues.push(new LoanValue('ARKK', this.getPool('Arkk')));
    }
    if (this.getLoanCountVaults('BABA') > 0) {
    this.loanValues.push(new LoanValue('BABA', this.getPool('BABA')));
    }
    if (this.getLoanCountVaults('GLD') > 0) {
    this.loanValues.push(new LoanValue('GLD', this.getPool('GLD')));
    }
    if (this.getLoanCountVaults('GME') > 0) {
    this.loanValues.push(new LoanValue('GME', this.getPool('GME')));
    }
    if (this.getLoanCountVaults('GOOGL') > 0) {
    this.loanValues.push(new LoanValue('GOOGL', this.getPool('GOOGL')));
    }
    if (this.getLoanCountVaults('PDBC') > 0) {
    this.loanValues.push(new LoanValue('PDBC', this.getPool('PDBC')));
    }
    if (this.getLoanCountVaults('PLTR') > 0) {
    this.loanValues.push(new LoanValue('PLTR', this.getPool('PLTR')));
    }
    if (this.getLoanCountVaults('QQQ') > 0) {
    this.loanValues.push(new LoanValue('QQQ', this.getPool('QQQ')));
    }
    if (this.getLoanCountVaults('SLV') > 0) {
    this.loanValues.push(new LoanValue('SLV', this.getPool('SLV')));
    }
    if (this.getLoanCountVaults('SPY') > 0) {
    this.loanValues.push(new LoanValue('SPY', this.getPool('SPY')));
    }
    if (this.getLoanCountVaults('TLT') > 0) {
    this.loanValues.push(new LoanValue('TLT', this.getPool('TLT')));
    }
    if (this.getLoanCountVaults('URTH') > 0) {
    this.loanValues.push(new LoanValue('URTH', this.getPool('URTH')));
    }
    if (this.getLoanCountVaults('VNQ') > 0) {
    this.loanValues.push(new LoanValue('VNQ', this.getPool('VNQ')));
    }
    if (this.getLoanCountVaults('AMZN') > 0) {
    this.loanValues.push(new LoanValue('AMZN', this.getPool('AMZN')));
    }
    if (this.getLoanCountVaults('NVDA') > 0) {
    this.loanValues.push(new LoanValue('NVDA', this.getPool('NVDA')));
    }
    if (this.getLoanCountVaults('COIN') > 0) {
    this.loanValues.push(new LoanValue('COIN', this.getPool('COIN')));
    }
    if (this.getLoanCountVaults('EEM') > 0) {
    this.loanValues.push(new LoanValue('EEM', this.getPool('EEM')));
    }
    if (this.getLoanCountVaults('MSFT') > 0) {
    this.loanValues.push(new LoanValue('MSFT', this.getPool('MSFT')));
    }
    if (this.getLoanCountVaults('NFLX') > 0) {
    this.loanValues.push(new LoanValue('NFLX', this.getPool('NFLX')));
    }
    if (this.getLoanCountVaults('FB') > 0) {
    this.loanValues.push(new LoanValue('FB', this.getPool('FB')));
    }
    if (this.getLoanCountVaults('VOO') > 0) {
    this.loanValues.push(new LoanValue('VOO', this.getPool('VOO')));
    }
    if (this.getLoanCountVaults('DIS') > 0) {
    this.loanValues.push(new LoanValue('DIS', this.getPool('DIS')));
    }
    if (this.getLoanCountVaults('MCHI') > 0) {
    this.loanValues.push(new LoanValue('MCHI', this.getPool('MCHI')));
    }
    if (this.getLoanCountVaults('MSTR') > 0) {
    this.loanValues.push(new LoanValue('MSTR', this.getPool('MSTR')));
    }
    if (this.getLoanCountVaults('INTC') > 0) {
    this.loanValues.push(new LoanValue('INTC', this.getPool('INTC')));
    }
    if (this.getLoanCountVaults('PYPL') > 0) {
      this.loanValues.push(new LoanValue('PYPL', this.getPool('PYPL')));
    }
    if (this.getLoanCountVaults('BRK.B') > 0) {
      this.loanValues.push(new LoanValue('BRK.B', this.getPool('BRK.B')));
    }
    if (this.getLoanCountVaults('KO') > 0) {
      this.loanValues.push(new LoanValue('KO', this.getPool('KO')));
    }
    if (this.getLoanCountVaults('PG') > 0) {
      this.loanValues.push(new LoanValue('PG', this.getPool('PG')));
    }
    if (this.getLoanCountVaults('SAP') > 0) {
      this.loanValues.push(new LoanValue('SAP', this.getPool('SAP')));
    }
    if (this.getLoanCountVaults('URA') > 0) {
      this.loanValues.push(new LoanValue('URA', this.getPool('URA')));
    }
    if (this.getLoanCountVaults('CS') > 0) {
      this.loanValues.push(new LoanValue('CS', this.getPool('CS')));
    }
    if (this.getLoanCountVaults('GSG') > 0) {
      this.loanValues.push(new LoanValue('GSG', this.getPool('GSG')));
    }
    if (this.getLoanCountVaults('PPLT') > 0) {
      this.loanValues.push(new LoanValue('PPLT', this.getPool('PPLT')));
    }
    if (this.getLoanCountVaults('GOVT') > 0) {
      this.loanValues.push(new LoanValue('GOVT', this.getPool('GOVT')));
    }
    if (this.getLoanCountVaults('TAN') > 0) {
      this.loanValues.push(new LoanValue('TAN', this.getPool('TAN')));
    }
    if (this.getLoanCountVaults('XOM') > 0) {
      this.loanValues.push(new LoanValue('XOM', this.getPool('XOM')));
    }
    if (this.getLoanCountVaults('JNJ') > 0) {
      this.loanValues.push(new LoanValue('JNJ', this.getPool('JNJ')));
    }
    if (this.getLoanCountVaults('ADDYY') > 0) {
      this.loanValues.push(new LoanValue('ADDYY', this.getPool('ADDYY')));
    }
    if (this.getLoanCountVaults('GS') > 0) {
      this.loanValues.push(new LoanValue('GS', this.getPool('GS')));
    }
    if (this.getLoanCountVaults('DAX') > 0) {
      this.loanValues.push(new LoanValue('DAX', this.getPool('DAX')));
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

    if (this.wallet?.usdt > 0 || this.wallet?.usdtInUsdtPool > 0  || this.wallet?.usdtInUsdtDusdPool > 0 || this.getCollateralCountVaults('USDT')) {
      this.holdingValues.push(new HoldingValue('USDT',
        this.wallet?.usdt + this.wallet?.usdtInUsdtPool + this.wallet?.usdtInUsdtDusdPool
        + this.getCollateralCountVaults('USDT'), this.getUsdtValueUsd()));
    }

    if (this.wallet?.usdc > 0 || this.wallet?.usdcInUsdcPool > 0 || this.wallet?.usdcInUsdcDusdPool > 0 || this.getCollateralCountVaults('USDC')) {
      this.holdingValues.push(new HoldingValue('USDC',
        this.wallet?.usdc + this.wallet?.usdcInUsdcPool + this.wallet?.usdcInUsdcDusdPool
        + this.getCollateralCountVaults('USDC'), this.getUsdcValueUsd()));
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
        this.wallet?.nvda + this.wallet?.nvdaInNvdaPool, this.getNvdaValueUsd()));
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

    if (this.wallet?.pypl > 0 || this.wallet?.pyplInPyplPool > 0 ) {
      this.holdingValues.push(new HoldingValue('PYPL',
        this.wallet?.pypl + this.wallet?.pyplInPyplPool, this.getPyplValueUsd()));
    }

    if (this.wallet?.brkb > 0 || this.wallet?.brkbInBrkbPool > 0 ) {
      this.holdingValues.push(new HoldingValue('BRK.B',
        this.wallet?.brkb + this.wallet?.brkbInBrkbPool, this.getBrkbValueUsd()));
    }

    if (this.wallet?.ko > 0 || this.wallet?.koInKoPool > 0 ) {
      this.holdingValues.push(new HoldingValue('KO',
        this.wallet?.ko + this.wallet?.koInKoPool, this.getKoValueUsd()));
    }

    if (this.wallet?.pg > 0 || this.wallet?.pgInPgPool > 0 ) {
      this.holdingValues.push(new HoldingValue('PG',
        this.wallet?.pg + this.wallet?.pgInPgPool, this.getPgValueUsd()));
    }

    if (this.wallet?.sap > 0 || this.wallet?.sapInSapPool > 0 ) {
      this.holdingValues.push(new HoldingValue('SAP',
        this.wallet?.sap + this.wallet?.sapInSapPool, this.getSapValueUsd()));
    }

    if (this.wallet?.ura > 0 || this.wallet?.uraInUraPool > 0 ) {
      this.holdingValues.push(new HoldingValue('URA',
        this.wallet?.ura + this.wallet?.uraInUraPool, this.getUraValueUsd()));
    }

    if (this.wallet?.cs > 0 || this.wallet?.csInCsPool > 0 ) {
      this.holdingValues.push(new HoldingValue('CS',
        this.wallet?.cs + this.wallet?.csInCsPool, this.getCsValueUsd()));
    }

    if (this.wallet?.gsg > 0 || this.wallet?.gsgInGsgPool > 0 ) {
      this.holdingValues.push(new HoldingValue('GSG',
        this.wallet?.gsg + this.wallet?.gsgInGsgPool, this.getGsgValueUsd()));
    }

    if (this.wallet?.pplt > 0 || this.wallet?.ppltInPpltPool > 0 ) {
      this.holdingValues.push(new HoldingValue('PPLT',
        this.wallet?.pplt + this.wallet?.ppltInPpltPool, this.getPpltValueUsd()));
    }

    if (this.wallet?.govt > 0 || this.wallet?.govtInGovtPool > 0 ) {
      this.holdingValues.push(new HoldingValue('GOVT',
        this.wallet?.govt + this.wallet?.govtInGovtPool, this.getGovtValueUsd()));
    }

    if (this.wallet?.tan > 0 || this.wallet?.tanInTanPool > 0 ) {
      this.holdingValues.push(new HoldingValue('TAN',
        this.wallet?.tan + this.wallet?.tanInTanPool, this.getTanValueUsd()));
    }

    if (this.wallet?.xom > 0 || this.wallet?.xomInXomPool > 0 ) {
      this.holdingValues.push(new HoldingValue('XOM',
        this.wallet?.xom + this.wallet?.xomInXomPool, this.getXomValueUsd()));
    }

    if (this.wallet?.jnj > 0 || this.wallet?.jnjInJnjPool > 0 ) {
      this.holdingValues.push(new HoldingValue('JNJ',
        this.wallet?.jnj + this.wallet?.jnjInJnjPool, this.getJnjValueUsd()));
    }

    if (this.wallet?.addyy > 0 || this.wallet?.addyyInAddyyPool > 0 ) {
      this.holdingValues.push(new HoldingValue('ADDYY',
        this.wallet?.addyy + this.wallet?.addyyInAddyyPool, this.getAddyyValueUsd()));
    }

    if (this.wallet?.gs > 0 || this.wallet?.gsInGsPool > 0 ) {
      this.holdingValues.push(new HoldingValue('GS',
        this.wallet?.gs + this.wallet?.gsInGsPool, this.getGsValueUsd()));
    }

    if (this.wallet?.dax > 0 || this.wallet?.daxInDaxPool > 0 ) {
      this.holdingValues.push(new HoldingValue('DAX',
        this.wallet?.dax + this.wallet?.daxInDaxPool, this.getDaxValueUsd()));
    }

  }

  createWalletTokens(): void {

    this.walletValues = new Array<HoldingValue>();

    if (this.wallet?.btc > 0) {
      this.walletValues.push(new HoldingValue('BTC',
        this.wallet?.btc, this.wallet?.btc * this.getPool('BTC')?.priceA));
    }

    if (this.wallet?.eth > 0) {
      this.walletValues.push(new HoldingValue('ETH',
        this.wallet?.eth, this.wallet?.eth * this.getPool('ETH')?.priceA));
    }

    if (this.wallet?.usdt > 0) {
      this.walletValues.push(new HoldingValue('USDT',
        this.wallet?.usdt, this.wallet?.usdt * this.getPool('USDT')?.priceA));
    }

    if (this.wallet?.usdc > 0) {
      this.walletValues.push(new HoldingValue('USDC',
        this.wallet?.usdc , this.wallet?.usdc * this.getPool('USDC')?.priceA));
    }

    if (this.isUsdInPortfolio()) {
      this.walletValues.push(new HoldingValue('DUSD',
        this.wallet?.usd, this.wallet?.usd * this.getDUSDPrice()));
    }

    if (this.wallet?.ltc > 0) {
      this.walletValues.push(new HoldingValue('LTC',
        this.wallet?.ltc, this.wallet?.ltc * this.getPool('LTC')?.priceA));
    }

    if (this.wallet?.doge > 0) {
      this.walletValues.push(new HoldingValue('DOGE',
        this.wallet?.doge , this.wallet?.doge * this.getPool('DOGE')?.priceA));
    }

    if (this.wallet?.bch > 0) {
      this.walletValues.push(new HoldingValue('BCH',
        this.wallet?.bch, this.wallet?.bch * this.getPool('BCH')?.priceA));
    }

    if (this.wallet?.tsla > 0) {
      this.walletValues.push(new HoldingValue('TSLA',
        this.wallet?.tsla , this.wallet?.tsla * this.getUsdPriceOfStockPools(this.getPool('TSLA'))));
    }

    if (this.wallet?.qqq > 0) {
      this.walletValues.push(new HoldingValue('QQQ',
        this.wallet?.qqq, this.wallet?.qqq * this.getUsdPriceOfStockPools(this.getPool('QQQ'))));
    }

    if (this.wallet?.spy > 0 ) {
      this.walletValues.push(new HoldingValue('SPY',
        this.wallet?.spy, this.wallet?.spy * this.getUsdPriceOfStockPools(this.getPool('SPY'))));
    }

    if (this.wallet?.pltr > 0  ) {
      this.walletValues.push(new HoldingValue('PLTR',
        this.wallet?.pltr, this.wallet?.pltr * this.getUsdPriceOfStockPools(this.getPool('PLTR'))));
    }

    if (this.wallet?.slv > 0 ) {
      this.walletValues.push(new HoldingValue('SLV',
        this.wallet?.slv, this.wallet?.slv * this.getUsdPriceOfStockPools(this.getPool('SLV'))));
    }

    if (this.wallet?.aapl > 0 ) {
      this.walletValues.push(new HoldingValue('AAPL',
        this.wallet?.aapl, this.wallet?.aapl * this.getUsdPriceOfStockPools(this.getPool('AAPL'))));
    }

    if (this.wallet?.gld > 0 ) {
      this.walletValues.push(new HoldingValue('GLD',
        this.wallet?.gld, this.wallet?.gld * this.getUsdPriceOfStockPools(this.getPool('GLD'))));
    }

    if (this.wallet?.gme > 0 ) {
      this.walletValues.push(new HoldingValue('GME',
        this.wallet?.gme, this.wallet?.gme * this.getUsdPriceOfStockPools(this.getPool('GME'))));
    }

    if (this.wallet?.googl > 0) {
      this.walletValues.push(new HoldingValue('GOOGL',
        this.wallet?.googl, this.wallet?.googl * this.getUsdPriceOfStockPools(this.getPool('GOOGL'))));
    }

    if (this.wallet?.arkk > 0  ) {
      this.walletValues.push(new HoldingValue('ARKK',
        this.wallet?.arkk , this.wallet?.arkk * this.getUsdPriceOfStockPools(this.getPool('Arkk'))));
    }

    if (this.wallet?.baba > 0  ) {
      this.walletValues.push(new HoldingValue('BABA',
        this.wallet?.baba , this.wallet?.baba * this.getUsdPriceOfStockPools(this.getPool('BABA'))));
    }

    if (this.wallet?.vnq > 0 ) {
      this.walletValues.push(new HoldingValue('VNQ',
        this.wallet?.vnq , this.wallet?.vnq * this.getUsdPriceOfStockPools(this.getPool('VNQ'))));
    }

    if (this.wallet?.urth > 0 ) {
      this.walletValues.push(new HoldingValue('URTH',
        this.wallet?.urth , this.wallet?.urth * this.getUsdPriceOfStockPools(this.getPool('URTH'))));
    }

    if (this.wallet?.tlt > 0 ) {
      this.walletValues.push(new HoldingValue('TLT',
        this.wallet?.tlt , this.wallet?.tlt * this.getUsdPriceOfStockPools(this.getPool('TLT'))));
    }

    if (this.wallet?.pdbc > 0  ) {
      this.walletValues.push(new HoldingValue('PDBC',
        this.wallet?.pdbc , this.wallet?.pdbc * this.getUsdPriceOfStockPools(this.getPool('PDBC'))));
    }

    if (this.wallet?.amzn > 0 ) {
      this.walletValues.push(new HoldingValue('AMZN',
        this.wallet?.amzn , this.wallet?.amzn * this.getUsdPriceOfStockPools(this.getPool('AMZN'))));
    }

    if (this.wallet?.nvda > 0) {
      this.walletValues.push(new HoldingValue('NVDA',
        this.wallet?.nvda, this.wallet?.nvda * this.getUsdPriceOfStockPools(this.getPool('NVDA'))));
    }

    if (this.wallet?.coin > 0 ) {
      this.walletValues.push(new HoldingValue('COIN',
        this.wallet?.coin , this.wallet?.coin * this.getUsdPriceOfStockPools(this.getPool('COIN'))));
    }

    if (this.wallet?.eem > 0  ) {
      this.walletValues.push(new HoldingValue('EEM',
        this.wallet?.eem, this.wallet?.eem * this.getUsdPriceOfStockPools(this.getPool('EEM'))));
    }

    if (this.wallet?.msft > 0 ) {
      this.walletValues.push(new HoldingValue('MSFT',
        this.wallet?.msft, this.wallet?.msft * this.getUsdPriceOfStockPools(this.getPool('MSFT'))));
    }

    if (this.wallet?.nflx > 0 ) {
      this.walletValues.push(new HoldingValue('NFLX',
        this.wallet?.nflx, this.wallet?.nflx * this.getUsdPriceOfStockPools(this.getPool('NFLX'))));
    }

    if (this.wallet?.fb > 0  ) {
      this.walletValues.push(new HoldingValue('FB',
        this.wallet?.fb, this.wallet?.fb * this.getUsdPriceOfStockPools(this.getPool('FB'))));
    }
    if (this.wallet?.voo > 0 ) {
      this.walletValues.push(new HoldingValue('VOO',
        this.wallet?.voo, this.wallet?.voo * this.getUsdPriceOfStockPools(this.getPool('VOO'))));
    }

    if (this.wallet?.dis > 0 ) {
      this.walletValues.push(new HoldingValue('DIS',
        this.wallet?.dis, this.wallet?.dis * this.getUsdPriceOfStockPools(this.getPool('DIS'))));
    }

    if (this.wallet?.mchi > 0 ) {
      this.walletValues.push(new HoldingValue('MCHI',
        this.wallet?.mchi, this.wallet?.mchi * this.getUsdPriceOfStockPools(this.getPool('MCHI'))));
    }

    if (this.wallet?.mstr > 0) {
      this.walletValues.push(new HoldingValue('MSTR',
        this.wallet?.mstr, this.wallet?.mstr * this.getUsdPriceOfStockPools(this.getPool('MSTR'))));
    }

    if (this.wallet?.intc > 0) {
      this.walletValues.push(new HoldingValue('INTC',
        this.wallet?.intc , this.wallet?.intc * this.getUsdPriceOfStockPools(this.getPool('INTC'))));
    }

    if (this.wallet?.pypl > 0) {
      this.walletValues.push(new HoldingValue('PYPL',
        this.wallet?.pypl , this.wallet?.pypl * this.getUsdPriceOfStockPools(this.getPool('PYPL'))));
    }

    if (this.wallet?.brkb > 0) {
      this.walletValues.push(new HoldingValue('BRK.B',
        this.wallet?.brkb , this.wallet?.brkb * this.getUsdPriceOfStockPools(this.getPool('BRK.B'))));
    }

    if (this.wallet?.ko > 0) {
      this.walletValues.push(new HoldingValue('KO',
        this.wallet?.ko , this.wallet?.pypl * this.getUsdPriceOfStockPools(this.getPool('KO'))));
    }

    if (this.wallet?.pg > 0) {
      this.walletValues.push(new HoldingValue('PG',
        this.wallet?.pg , this.wallet?.pg * this.getUsdPriceOfStockPools(this.getPool('PG'))));
    }

    if (this.wallet?.sap > 0) {
      this.walletValues.push(new HoldingValue('SAP',
        this.wallet?.sap , this.wallet?.sap * this.getUsdPriceOfStockPools(this.getPool('SAP'))));
    }

    if (this.wallet?.ura > 0) {
      this.walletValues.push(new HoldingValue('URA',
        this.wallet?.ura , this.wallet?.ura * this.getUsdPriceOfStockPools(this.getPool('URA'))));
    }

    if (this.wallet?.cs > 0) {
      this.walletValues.push(new HoldingValue('CS',
        this.wallet?.cs , this.wallet?.cs * this.getUsdPriceOfStockPools(this.getPool('CS'))));
    }

    if (this.wallet?.gsg > 0) {
      this.walletValues.push(new HoldingValue('GSG',
        this.wallet?.gsg , this.wallet?.gsg * this.getUsdPriceOfStockPools(this.getPool('GSG'))));
    }
    if (this.wallet?.pplt > 0) {
      this.walletValues.push(new HoldingValue('PPLT',
        this.wallet?.pplt , this.wallet?.pplt * this.getUsdPriceOfStockPools(this.getPool('PPLT'))));
    }

    if (this.wallet?.govt > 0) {
      this.walletValues.push(new HoldingValue('GOVT',
        this.wallet?.govt , this.wallet?.govt * this.getUsdPriceOfStockPools(this.getPool('GOVT'))));
    }

    if (this.wallet?.tan > 0) {
      this.walletValues.push(new HoldingValue('TAN',
        this.wallet?.tan , this.wallet?.tan * this.getUsdPriceOfStockPools(this.getPool('TAN'))));
    }

    if (this.wallet?.xom > 0) {
      this.walletValues.push(new HoldingValue('XOM',
        this.wallet?.xom , this.wallet?.xom * this.getUsdPriceOfStockPools(this.getPool('XOM'))));
    }

    if (this.wallet?.jnj > 0) {
      this.walletValues.push(new HoldingValue('JNJ',
        this.wallet?.jnj , this.wallet?.jnj * this.getUsdPriceOfStockPools(this.getPool('JNJ'))));
    }

    if (this.wallet?.addyy > 0) {
      this.walletValues.push(new HoldingValue('ADDYY',
        this.wallet?.addyy , this.wallet?.addyy * this.getUsdPriceOfStockPools(this.getPool('ADDYY'))));
    }

    if (this.wallet?.gs > 0) {
      this.walletValues.push(new HoldingValue('GS',
        this.wallet?.gs , this.wallet?.gs * this.getUsdPriceOfStockPools(this.getPool('GS'))));
    }

    if (this.wallet?.dax > 0) {
      this.walletValues.push(new HoldingValue('DAX',
        this.wallet?.dax , this.wallet?.dax * this.getUsdPriceOfStockPools(this.getPool('DAX'))));
    }

  }

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
        this.getCollateralCountVaults('DUSD'), this.getCollateralCountVaults('DUSD') * 0.99));
    }

  }

  createLpTokens(): void {

    this.lpTokensValues = new Array<HoldingValue>();

    if (this.wallet?.btcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('BTC-DFI',
        this.wallet?.btcdfi, this.wallet?.btcdfi * this.getLpTokenValue(this.getPool('BTC'))));
    }

    if (this.wallet?.ethdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('ETH-DFI',
        this.wallet?.ethdfi, this.wallet?.ethdfi * this.getLpTokenValue(this.getPool('ETH'))));
    }

    if (this.wallet?.usdtdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('USDT-DFI',
        this.wallet?.usdtdfi, this.wallet?.usdtdfi * this.getLpTokenValue(this.getPool('USDT'))));
    }

    if (this.wallet?.usdtdusd > 0) {
      this.lpTokensValues.push(new HoldingValue('USDT-DUSD',
        this.wallet?.usdtdusd, this.wallet?.usdtdusd * this.getLpTokenValue(this.getPoolSymbol('USDT-DUSD'))));
    }

    if (this.wallet?.usdcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('USDC-DFI',
        this.wallet?.usdcdfi , this.wallet?.usdcdfi * this.getLpTokenValue(this.getPool('USDC'))));
    }

    if (this.wallet?.usdcdusd > 0) {
      this.lpTokensValues.push(new HoldingValue('USDC-DUSD',
        this.wallet?.usdcdusd , this.wallet?.usdcdusd * this.getLpTokenValue(this.getPoolSymbol('USDC-DUSD'))));
    }

    if (this.wallet?.usddfi) {
      this.lpTokensValues.push(new HoldingValue('DUSD-DFI',
        this.wallet?.usddfi, this.wallet?.usddfi * this.getLpTokenValue(this.getPool('DUSD'))));
    }

    if (this.wallet?.ltcdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('LTC-DFI',
        this.wallet?.ltcdfi, this.wallet?.ltcdfi * this.getLpTokenValue(this.getPool('LTC'))));
    }

    if (this.wallet?.dogedfi > 0) {
      this.lpTokensValues.push(new HoldingValue('DOGE-DFI',
        this.wallet?.dogedfi , this.wallet?.dogedfi * this.getLpTokenValue(this.getPool('DOGE'))));
    }

    if (this.wallet?.bchdfi > 0) {
      this.lpTokensValues.push(new HoldingValue('BCH-DFI',
        this.wallet?.bchdfi, this.wallet?.bchdfi * this.getLpTokenValue(this.getPool('BCH'))));
    }

    if (this.wallet?.tslausd > 0) {
      this.lpTokensValues.push(new HoldingValue('TSLA-DUSD',
        this.wallet?.tslausd , this.wallet?.tslausd * this.getLpTokenValue(this.getPool('TSLA'))));
    }

    if (this.wallet?.qqqusd > 0) {
      this.lpTokensValues.push(new HoldingValue('QQQ-DUSD',
        this.wallet?.qqqusd, this.wallet?.qqqusd * this.getLpTokenValue(this.getPool('QQQ'))));
    }

    if (this.wallet?.spyusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('SPY-DUSD',
        this.wallet?.spyusd, this.wallet?.spyusd * this.getLpTokenValue(this.getPool('SPY'))));
    }

    if (this.wallet?.pltrusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('PLTR-DUSD',
        this.wallet?.pltrusd, this.wallet?.pltrusd * this.getLpTokenValue(this.getPool('PLTR'))));
    }

    if (this.wallet?.slvusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('SLV-DUSD',
        this.wallet?.slvusd, this.wallet?.slvusd * this.getLpTokenValue(this.getPool('SLV'))));
    }

    if (this.wallet?.aaplusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('AAPL-DUSD',
        this.wallet?.aaplusd, this.wallet?.aaplusd * this.getLpTokenValue(this.getPool('AAPL'))));
    }

    if (this.wallet?.gldusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('GLD-DUSD',
        this.wallet?.gldusd, this.wallet?.gldusd * this.getLpTokenValue(this.getPool('GLD'))));
    }

    if (this.wallet?.gmeusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('GME-DUSD',
        this.wallet?.gmeusd, this.wallet?.gmeusd * this.getLpTokenValue(this.getPool('GME'))));
    }

    if (this.wallet?.googlusd > 0) {
      this.lpTokensValues.push(new HoldingValue('GOOGL-DUSD',
        this.wallet?.googlusd, this.wallet?.googlusd * this.getLpTokenValue(this.getPool('GOOGL'))));
    }

    if (this.wallet?.arkkusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('ARKK-DUSD',
        this.wallet?.arkkusd , this.wallet?.arkkusd * this.getLpTokenValue(this.getPool('ARKK'))));
    }

    if (this.wallet?.babausd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('BABA-DUSD',
        this.wallet?.babausd , this.wallet?.babausd * this.getLpTokenValue(this.getPool('BABA'))));
    }

    if (this.wallet?.vnqusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('VNQ-DUSD',
        this.wallet?.vnqusd , this.wallet?.vnqusd * this.getLpTokenValue(this.getPool('VNQ'))));
    }

    if (this.wallet?.urthusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('URTH-DUSD',
        this.wallet?.urthusd , this.wallet?.urthusd * this.getLpTokenValue(this.getPool('URTH'))));
    }

    if (this.wallet?.tltusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('TLT-DUSD',
        this.wallet?.tltusd , this.wallet?.tltusd * this.getLpTokenValue(this.getPool('TLT'))));
    }

    if (this.wallet?.pdbcusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('PDBC-DUSD',
        this.wallet?.pdbcusd, this.wallet?.pdbcusd * this.getLpTokenValue(this.getPool('PDBC'))));
    }

    if (this.wallet?.amznusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('AMZN-DUSD',
        this.wallet?.amznusd , this.wallet?.amznusd * this.getLpTokenValue(this.getPool('AMZN'))));
    }

    if (this.wallet?.nvdausd > 0) {
      this.lpTokensValues.push(new HoldingValue('NVDA-DUSD',
        this.wallet?.nvdausd, this.wallet?.nvdausd * this.getLpTokenValue(this.getPool('NVDA'))));
    }

    if (this.wallet?.coinusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('COIN-DUSD',
        this.wallet?.coinusd , this.wallet?.coinusd * this.getLpTokenValue(this.getPool('COIN'))));
    }

    if (this.wallet?.eemusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('EEM-DUSD',
        this.wallet?.eemusd, this.wallet?.eemusd * this.getLpTokenValue(this.getPool('EEM'))));
    }

    if (this.wallet?.msftusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('MSFT-DUSD',
        this.wallet?.msftusd, this.wallet?.msftusd * this.getLpTokenValue(this.getPool('MSFT'))));
    }

    if (this.wallet?.nflxusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('NFLX-DUSD',
        this.wallet?.nflxusd, this.wallet?.nflxusd * this.getLpTokenValue(this.getPool('NFLX'))));
    }

    if (this.wallet?.fbusd > 0  ) {
      this.lpTokensValues.push(new HoldingValue('FB-DUSD',
        this.wallet?.fbusd, this.wallet?.fbusd * this.getLpTokenValue(this.getPool('FB'))));
    }
    if (this.wallet?.voousd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('VOO-DUSD',
        this.wallet?.voousd, this.wallet?.voousd * this.getLpTokenValue(this.getPool('VOO'))));
    }

    if (this.wallet?.disusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('DIS-DUSD',
        this.wallet?.disusd, this.wallet?.disusd * this.getLpTokenValue(this.getPool('DIS'))));
    }

    if (this.wallet?.mchiusd > 0 ) {
      this.lpTokensValues.push(new HoldingValue('MCHI-DUSD',
        this.wallet?.mchiusd, this.wallet?.mchiusd * this.getLpTokenValue(this.getPool('MCHI'))));
    }

    if (this.wallet?.mstrusd > 0) {
      this.lpTokensValues.push(new HoldingValue('MSTR-DUSD',
        this.wallet?.mstrusd, this.wallet?.mstrusd * this.getLpTokenValue(this.getPool('MSTR'))));
    }

    if (this.wallet?.intcusd > 0) {
      this.lpTokensValues.push(new HoldingValue('INTC-DUSD',
        this.wallet?.intcusd , this.wallet?.intcusd * this.getLpTokenValue(this.getPool('INTC'))));
    }

    if (this.wallet?.pyplusd > 0) {
      this.lpTokensValues.push(new HoldingValue('PYPL-DUSD',
        this.wallet?.pyplusd , this.wallet?.pyplusd * this.getLpTokenValue(this.getPool('PYPL'))));
    }

    if (this.wallet?.brkbusd > 0) {
      this.lpTokensValues.push(new HoldingValue('BRK.B-DUSD',
        this.wallet?.brkbusd , this.wallet?.brkbusd * this.getLpTokenValue(this.getPool('BRK.B'))));
    }

    if (this.wallet?.kousd > 0) {
      this.lpTokensValues.push(new HoldingValue('KO-DUSD',
        this.wallet?.kousd , this.wallet?.kousd * this.getLpTokenValue(this.getPool('KO'))));
    }

    if (this.wallet?.pgusd > 0) {
      this.lpTokensValues.push(new HoldingValue('PG-DUSD',
        this.wallet?.pgusd , this.wallet?.pgusd * this.getLpTokenValue(this.getPool('PG'))));
    }

    if (this.wallet?.sapusd > 0) {
      this.lpTokensValues.push(new HoldingValue('SAP-DUSD',
        this.wallet?.sapusd , this.wallet?.sapusd * this.getLpTokenValue(this.getPool('SAP'))));
    }

    if (this.wallet?.urausd > 0) {
      this.lpTokensValues.push(new HoldingValue('URA-DUSD',
        this.wallet?.urausd , this.wallet?.urausd * this.getLpTokenValue(this.getPool('URA'))));
    }

    if (this.wallet?.gsgusd > 0) {
      this.lpTokensValues.push(new HoldingValue('GSG-DUSD',
        this.wallet?.gsgusd , this.wallet?.gsgusd * this.getLpTokenValue(this.getPool('GSG'))));
    }

    if (this.wallet?.csusd > 0) {
      this.lpTokensValues.push(new HoldingValue('CS-DUSD',
        this.wallet?.csusd , this.wallet?.csusd * this.getLpTokenValue(this.getPool('CS'))));
    }

    if (this.wallet?.ppltusd > 0) {
      this.lpTokensValues.push(new HoldingValue('PPLT-DUSD',
        this.wallet?.ppltusd , this.wallet?.ppltusd * this.getLpTokenValue(this.getPool('PPLT'))));
    }

    if (this.wallet?.govtusd > 0) {
      this.lpTokensValues.push(new HoldingValue('GOVT-DUSD',
        this.wallet?.govtusd , this.wallet?.govtusd * this.getLpTokenValue(this.getPool('GOVT'))));
    }

    if (this.wallet?.tanusd > 0) {
      this.lpTokensValues.push(new HoldingValue('TAN-DUSD',
        this.wallet?.tanusd , this.wallet?.tanusd * this.getLpTokenValue(this.getPool('TAN'))));
    }

    if (this.wallet?.xomusd > 0) {
      this.lpTokensValues.push(new HoldingValue('XOM-DUSD',
        this.wallet?.xomusd , this.wallet?.xomusd * this.getLpTokenValue(this.getPool('XOM'))));
    }

    if (this.wallet?.jnjusd > 0) {
      this.lpTokensValues.push(new HoldingValue('JNJ-DUSD',
        this.wallet?.jnjusd , this.wallet?.jnjusd * this.getLpTokenValue(this.getPool('JNJ'))));
    }

    if (this.wallet?.addyyusd > 0) {
      this.lpTokensValues.push(new HoldingValue('ADDYY-DUSD',
        this.wallet?.addyyusd , this.wallet?.addyyusd * this.getLpTokenValue(this.getPool('ADDYY'))));
    }

    if (this.wallet?.gsusd > 0) {
      this.lpTokensValues.push(new HoldingValue('GS-DUSD',
        this.wallet?.gsusd , this.wallet?.gsusd * this.getLpTokenValue(this.getPool('GS'))));
    }

    if (this.wallet?.daxusd > 0) {
      this.lpTokensValues.push(new HoldingValue('DAX-DUSD',
        this.wallet?.daxusd , this.wallet?.daxusd * this.getLpTokenValue(this.getPool('DAX'))));
    }
  }

  getLpTokenValue(pool: Pool): number {
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
    return this.getFreezerDfiCount() * this.getPool('BTC')?.priceB;
  }

  // ANTEIL CRYPTO
  getAnteilLMOfBtcPoolValue(): number {
    return ((this.wallet.dfiInBtcPool * this.getPool('BTC')?.priceB) + (this.wallet.btcInBtcPool * this.getPool('BTC')?.priceA));
  }
  getAnteilLMOfEthPoolValue(): number {
    return ((this.wallet.dfiInEthPool * this.getPool('BTC')?.priceB) + (this.wallet.ethInEthPool * this.getPool('ETH')?.priceA));
  }
  getAnteilLMOfLtcPoolValue(): number {
    return ((this.wallet.dfiInLtcPool * this.getPool('BTC')?.priceB) + (this.wallet.ltcInLtcPool * this.getPool('LTC')?.priceA));
  }
  getAnteilLMOfUsdtPoolValue(): number {
    return ((this.wallet.dfiInUsdtPool * this.getPool('BTC')?.priceB) + (this.wallet.usdtInUsdtPool * this.getPool('USDT')?.priceA));
  }
  getAnteilLMOfUsdtDusdPoolValue(): number {
    return ((this.wallet.usdtInUsdtDusdPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.usdtInUsdtPool * this.getPool('USDT')?.priceA));
  }
  getAnteilLMOfUsdcPoolValue(): number {
    return ((this.wallet.dfiInUsdcPool * this.getPool('BTC')?.priceB) + (this.wallet.usdcInUsdcPool * this.getPool('USDC')?.priceA));
  }
  getAnteilLMOfUsdcDusdPoolValue(): number {
    return ((this.wallet.usdcInUsdcDusdPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.usdcInUsdcPool * this.getPool('USDC')?.priceA));
  }
  getAnteilLMOfDogePoolValue(): number {
    return ((this.wallet.dfiInDogePool * this.getPool('BTC')?.priceB) + (this.wallet.dogeInDogePool * this.getPool('DOGE')?.priceA));
  }
  getAnteilLMOfBchPoolValue(): number {
    return ((this.wallet.dfiInBchPool * this.getPool('BTC')?.priceB) + (this.wallet.bchInBchPool * this.getPool('BCH')?.priceA));
  }
  // ANTEIL STOCKS
  getAnteilLMOfUsdPoolValue(): number {
    return ((this.wallet.dfiInUsdPool * this.getPool('BTC')?.priceB) + (this.wallet.usdInUsdPool
      * this.getDUSDPrice()));
  }
  getAnteilLMOfTslaPoolValue(): number {
    return ((this.wallet.usdInTslaPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.tslaInTslaPool * this.getUsdPriceOfStockPools(this.getPool('TSLA'))));
  }
  getAnteilLMOfSpyPoolValue(): number {
    return ((this.wallet.usdInSpyPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.spyInSpyPool * this.getUsdPriceOfStockPools(this.getPool('SPY'))));
  }
  getAnteilLMOfQqqPoolValue(): number {
    return ((this.wallet.usdInQqqPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.qqqInQqqPool * this.getUsdPriceOfStockPools(this.getPool('QQQ'))));
  }
  getAnteilLMOfPltrPoolValue(): number {
    return ((this.wallet.usdInPltrPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.pltrInPltrPool * this.getUsdPriceOfStockPools(this.getPool('PLTR'))));
  }
  getAnteilLMOfSlvPoolValue(): number {
    return ((this.wallet.usdInSlvPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.slvInSlvPool * this.getUsdPriceOfStockPools(this.getPool('SLV'))));
  }
  getAnteilLMOfAaplPoolValue(): number {
    return ((this.wallet.usdInAaplPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.aaplInAaplPool * this.getUsdPriceOfStockPools(this.getPool('AAPL'))));
  }
  getAnteilLMOfGldPoolValue(): number {
    return ((this.wallet.usdInGldPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.gldInGldPool * this.getUsdPriceOfStockPools(this.getPool('GLD'))));
  }
  getAnteilLMOfGmePoolValue(): number {
    return ((this.wallet.usdInGmePool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.gmeInGmePool * this.getUsdPriceOfStockPools(this.getPool('GME'))));
  }
  getAnteilLMOfGooglPoolValue(): number {
    return ((this.wallet.usdInGooglPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.googlInGooglPool * this.getUsdPriceOfStockPools(this.getPool('GOOGL'))));
  }
  getAnteilLMOfArkkPoolValue(): number {
    return ((this.wallet.usdInArkkPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.arkkInArkkPool * this.getUsdPriceOfStockPools(this.getPool('Arkk'))));
  }
  getAnteilLMOfBabaPoolValue(): number {
    return ((this.wallet.usdInBabaPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.babaInBabaPool * this.getUsdPriceOfStockPools(this.getPool('BABA'))));
  }
  getAnteilLMOfVnqPoolValue(): number {
    return ((this.wallet.usdInVnqPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.vnqInVnqPool * this.getUsdPriceOfStockPools(this.getPool('VNQ'))));
  }
  getAnteilLMOfUrthPoolValue(): number {
    return ((this.wallet.usdInUrthPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.urthInUrthPool * this.getUsdPriceOfStockPools(this.getPool('URTH'))));
  }
  getAnteilLMOfTltPoolValue(): number {
    return ((this.wallet.usdInTltPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.tltInTltPool * this.getUsdPriceOfStockPools(this.getPool('TLT'))));
  }
  getAnteilLMOfPdbcPoolValue(): number {
    return ((this.wallet.usdInPdbcPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.pdbcInPdbcPool * this.getUsdPriceOfStockPools(this.getPool('PDBC'))));
  }
  getAnteilLMOfAmznPoolValue(): number {
    return ((this.wallet.usdInAmznPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.amznInAmznPool * this.getUsdPriceOfStockPools(this.getPool('AMZN'))));
  }
  getAnteilLMOfNvdaPoolValue(): number {
    return ((this.wallet.usdInNvdaPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.nvdaInNvdaPool * this.getUsdPriceOfStockPools(this.getPool('NVDA'))));
  }
  getAnteilLMOfCoinPoolValue(): number {
    return ((this.wallet.usdInCoinPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.coinInCoinPool * this.getUsdPriceOfStockPools(this.getPool('COIN'))));
  }
  getAnteilLMOfEemPoolValue(): number {
    return ((this.wallet.usdInEemPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.eemInEemPool * this.getUsdPriceOfStockPools(this.getPool('EEM'))));
  }
  getAnteilLMOfMsftPoolValue(): number {
    return ((this.wallet.usdInMsftPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.msftInMsftPool * this.getUsdPriceOfStockPools(this.getPool('MSFT'))));
  }
  getAnteilLMOfNflxPoolValue(): number {
    return ((this.wallet.usdInNflxPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.nflxInNflxPool * this.getUsdPriceOfStockPools(this.getPool('NFLX'))));
  }
  getAnteilLMOfFbPoolValue(): number {
    return ((this.wallet.usdInFbPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.fbInFbPool * this.getUsdPriceOfStockPools(this.getPool('FB'))));
  }
  getAnteilLMOfVooPoolValue(): number {
    return ((this.wallet.usdInVooPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.vooInVooPool * this.getUsdPriceOfStockPools(this.getPool('VOO'))));
  }
  getAnteilLMOfDisPoolValue(): number {
    return ((this.wallet.usdInDisPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.disInDisPool * this.getUsdPriceOfStockPools(this.getPool('DIS'))));
  }
  getAnteilLMOfMchiPoolValue(): number {
    return ((this.wallet.usdInMchiPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.mchiInMchiPool * this.getUsdPriceOfStockPools(this.getPool('MCHI'))));
  }
  getAnteilLMOfMstrPoolValue(): number {
    return ((this.wallet.usdInMstrPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.mstrInMstrPool * this.getUsdPriceOfStockPools(this.getPool('MSTR'))));
  }
  getAnteilLMOfIntcPoolValue(): number {
    return ((this.wallet.usdInIntcPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.intcInIntcPool * this.getUsdPriceOfStockPools(this.getPool('INTC'))));
  }

  getAnteilLMOfPyplPoolValue(): number {
    return ((this.wallet.usdInPyplPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.pyplInPyplPool * this.getUsdPriceOfStockPools(this.getPool('PYPL'))));
  }

  getAnteilLMOfBrkbPoolValue(): number {
    return ((this.wallet.usdInBrkbPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.brkbInBrkbPool * this.getUsdPriceOfStockPools(this.getPool('BRK.B'))));
  }

  getAnteilLMOfKoPoolValue(): number {
    return ((this.wallet.usdInKoPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.koInKoPool * this.getUsdPriceOfStockPools(this.getPool('KO'))));
  }

  getAnteilLMOfPgPoolValue(): number {
    return ((this.wallet.usdInPgPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.pgInPgPool * this.getUsdPriceOfStockPools(this.getPool('PG'))));
  }

  getAnteilLMOfSapPoolValue(): number {
    return ((this.wallet.usdInSapPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.sapInSapPool * this.getUsdPriceOfStockPools(this.getPool('SAP'))));
  }

  getAnteilLMOfUraPoolValue(): number {
    return ((this.wallet.usdInUraPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.uraInUraPool * this.getUsdPriceOfStockPools(this.getPool('URA'))));
  }

  getAnteilLMOfGsgPoolValue(): number {
    return ((this.wallet.usdInGsgPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.gsgInGsgPool * this.getUsdPriceOfStockPools(this.getPool('GSG'))));
  }

  getAnteilLMOfCsPoolValue(): number {
    return ((this.wallet.usdInCsPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.csInCsPool * this.getUsdPriceOfStockPools(this.getPool('CS'))));
  }

  getAnteilLMOfPpltPoolValue(): number {
    return ((this.wallet.usdInPpltPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.ppltInPpltPool * this.getUsdPriceOfStockPools(this.getPool('PPLT'))));
  }
  getAnteilLMOfGovtPoolValue(): number {
    return ((this.wallet.usdInGovtPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.govtInGovtPool * this.getUsdPriceOfStockPools(this.getPool('GOVT'))));
  }
  getAnteilLMOfTanPoolValue(): number {
    return ((this.wallet.usdInTanPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.tanInTanPool * this.getUsdPriceOfStockPools(this.getPool('TAN'))));
  }
  getAnteilLMOfXomPoolValue(): number {
    return ((this.wallet.usdInXomPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.xomInXomPool * this.getUsdPriceOfStockPools(this.getPool('XOM'))));
  }

  getAnteilLMOfJnjPoolValue(): number {
    return ((this.wallet.usdInJnjPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.jnjInJnjPool * this.getUsdPriceOfStockPools(this.getPool('JNJ'))));
  }
  getAnteilLMOfAddyyPoolValue(): number {
    return ((this.wallet.usdInAddyyPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.addyyInAddyyPool * this.getUsdPriceOfStockPools(this.getPool('ADDYY'))));
  }
  getAnteilLMOfGsPoolValue(): number {
    return ((this.wallet.usdInGsPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.gsInGsPool * this.getUsdPriceOfStockPools(this.getPool('GS'))));
  }
  getAnteilLMOfDaxPoolValue(): number {
    return ((this.wallet.usdInDaxPool * this.getUsdPriceOfStockPools(this.getPool('DUSD')))
      + (this.wallet.daxInDaxPool * this.getUsdPriceOfStockPools(this.getPool('DAX'))));
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

    const dataPYPL = new Data();
    dataPYPL.name = 'PYPL';
    dataPYPL.value = this.getPyplValueUsd() * this.dataService.getPrice(this.fiat);

    const dataBRKB = new Data();
    dataBRKB.name = 'BRK.B';
    dataBRKB.value = this.getBrkbValueUsd() * this.dataService.getPrice(this.fiat);

    const dataKO = new Data();
    dataKO.name = 'KO';
    dataKO.value = this.getKoValueUsd() * this.dataService.getPrice(this.fiat);

    const dataPG = new Data();
    dataPG.name = 'PG';
    dataPG.value = this.getPgValueUsd() * this.dataService.getPrice(this.fiat);

    const dataSAP = new Data();
    dataSAP.name = 'SAP';
    dataSAP.value = this.getSapValueUsd() * this.dataService.getPrice(this.fiat);

    const dataURA = new Data();
    dataURA.name = 'URA';
    dataURA.value = this.getUraValueUsd() * this.dataService.getPrice(this.fiat);

    const dataCS = new Data();
    dataCS.name = 'CS';
    dataCS.value = this.getCsValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGSG = new Data();
    dataGSG.name = 'GSG';
    dataGSG.value = this.getGsgValueUsd() * this.dataService.getPrice(this.fiat);

    const dataPplt = new Data();
    dataPplt.name = 'PPLT';
    dataPplt.value = this.getPpltValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGovt = new Data();
    dataGovt.name = 'GOVT';
    dataGovt.value = this.getGovtValueUsd() * this.dataService.getPrice(this.fiat);

    const dataTan = new Data();
    dataTan.name = 'TAN';
    dataTan.value = this.getTanValueUsd() * this.dataService.getPrice(this.fiat);

    const dataXom = new Data();
    dataXom.name = 'XOM';
    dataXom.value = this.getXomValueUsd() * this.dataService.getPrice(this.fiat);

    const dataJnj = new Data();
    dataJnj.name = 'JNJ';
    dataJnj.value = this.getJnjValueUsd() * this.dataService.getPrice(this.fiat);

    const dataAddyy = new Data();
    dataAddyy.name = 'ADDYY';
    dataAddyy.value = this.getAddyyValueUsd() * this.dataService.getPrice(this.fiat);

    const dataGs = new Data();
    dataGs.name = 'GS';
    dataGs.value = this.getGsValueUsd() * this.dataService.getPrice(this.fiat);

    const dataDax = new Data();
    dataDax.name = 'DAX';
    dataDax.value = this.getDaxValueUsd() * this.dataService.getPrice(this.fiat);

    const dataDfi = new Data();
    dataDfi.name = 'DFI';
    dataDfi.value = this.getDfiValueUsd() * this.dataService.getPrice(this.fiat);

    const allValue = dataBtc.value + dataEth.value + dataUsdt.value + dataUsdc.value + dataUsd.value + dataLtc.value +
      dataDoge.value + dataBch.value + dataTsla.value + dataSpy.value + dataQqq.value + dataPltr.value + dataSLV.value +
      dataAAPL.value + dataGLD.value + dataGME.value + dataGOOGL.value + dataARKK.value + dataBABA.value + dataVNQ.value +
      dataURTH.value + dataTLT.value + dataPDBC.value  + dataAMZN.value + dataNVDA.value + dataCOIN.value + dataEEM.value +
      dataMSFT.value + dataNFLX.value + dataFB.value + dataVOO.value + dataDfi.value +
      dataDIS.value + dataMCHI.value + dataMSTR.value + dataINTC.value +
      dataPYPL.value + dataBRKB.value + dataKO.value + dataPG.value +
      dataSAP.value + dataURA.value + dataCS.value + dataGSG.value +
      dataGovt.value + dataTan.value + dataXom.value + dataPplt.value +
      dataJnj.value + dataAddyy.value + dataGs.value + dataDax.value;

    this.chartOptions = {
      series: [{
        name: this.fiat,
        data: this.getSeriesOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
          dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
          dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
          dataDIS, dataMCHI, dataMSTR, dataINTC, dataPYPL, dataBRKB, dataKO, dataPG,
          dataSAP, dataURA, dataCS, dataGSG, dataPplt, dataGovt, dataTan, dataXom,
          dataJnj, dataAddyy, dataGs, dataDax, dataDfi)
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
        dataDIS, dataMCHI, dataMSTR, dataINTC, dataPYPL, dataBRKB, dataKO, dataPG, dataSAP, dataURA, dataCS, dataGSG,
        dataPplt, dataGovt, dataTan, dataXom,
        dataJnj, dataAddyy, dataGs, dataDax, dataDfi),
      xaxis: {
        type: 'category',
        categories: this.getLabelsOverallValue(dataBtc, allValue, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge,
        dataBch, dataTsla, dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK,  dataBABA,
        dataVNQ, dataURTH, dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
        dataDIS, dataMCHI, dataMSTR, dataINTC, dataPYPL, dataBRKB, dataKO, dataPG, dataSAP, dataURA, dataCS, dataGSG,
          dataPplt, dataGovt, dataTan, dataXom,
          dataJnj, dataAddyy, dataGs, dataDax, dataDfi),
        position: 'bottom',
        labels: {
          style: {
            colors: this.getColorsOverallValue(dataBtc, dataEth, dataUsdt, dataUsdc, dataUsd, dataLtc, dataDoge, dataBch, dataTsla,
              dataSpy, dataQqq, dataPltr, dataSLV, dataAAPL, dataGLD, dataGME, dataGOOGL, dataARKK, dataBABA, dataVNQ, dataURTH,
              dataTLT, dataPDBC, dataAMZN, dataNVDA, dataCOIN, dataEEM, dataMSFT, dataNFLX, dataFB, dataVOO,
              dataDIS, dataMCHI, dataMSTR, dataINTC, dataPYPL, dataBRKB, dataKO, dataPG, dataSAP, dataURA, dataCS, dataGSG,
              dataPplt, dataGovt, dataTan, dataXom,
              dataJnj, dataAddyy, dataGs, dataDax, dataDfi),
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
          dataDIS, dataMCHI, dataMSTR, dataINTC, dataPYPL, dataBRKB, dataKO, dataPG, dataSAP, dataURA, dataCS, dataGSG,
          dataPplt, dataGovt, dataTan, dataXom,
          dataJnj, dataAddyy, dataGs, dataDax, dataDfi)
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
                                dataPYPL: Data, dataBRKB: Data, dataKO: Data, dataPG: Data,
                                dataSAP: Data, dataURA: Data, dataCS: Data, dataGSG: Data,
                                dataPplt: Data, dataGovt: Data, dataTan: Data, dataXom: Data,
                                dataJnj: Data, dataAddyy: Data, dataGs: Data, dataDax: Data,
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
    if (dataPYPL.value > 0) {
      incomeNumbers.push(+dataPYPL.value.toFixed(2));
    }
    if (dataBRKB.value > 0) {
      incomeNumbers.push(+dataBRKB.value.toFixed(2));
    }
    if (dataKO.value > 0) {
      incomeNumbers.push(+dataKO.value.toFixed(2));
    }
    if (dataPG.value > 0) {
      incomeNumbers.push(+dataPG.value.toFixed(2));
    }
    if (dataSAP.value > 0) {
      incomeNumbers.push(+dataSAP.value.toFixed(2));
    }
    if (dataURA.value > 0) {
      incomeNumbers.push(+dataURA.value.toFixed(2));
    }
    if (dataCS.value > 0) {
      incomeNumbers.push(+dataCS.value.toFixed(2));
    }
    if (dataGSG.value > 0) {
      incomeNumbers.push(+dataGSG.value.toFixed(2));
    }
    if (dataPplt.value > 0) {
      incomeNumbers.push(+dataPplt.value.toFixed(2));
    }
    if (dataGovt.value > 0) {
      incomeNumbers.push(+dataGovt.value.toFixed(2));
    }
    if (dataTan.value > 0) {
      incomeNumbers.push(+dataTan.value.toFixed(2));
    }
    if (dataXom.value > 0) {
      incomeNumbers.push(+dataXom.value.toFixed(2));
    }
    if (dataJnj.value > 0) {
      incomeNumbers.push(+dataJnj.value.toFixed(2));
    }
    if (dataAddyy.value > 0) {
      incomeNumbers.push(+dataAddyy.value.toFixed(2));
    }
    if (dataGs.value > 0) {
      incomeNumbers.push(+dataGs.value.toFixed(2));
    }
    if (dataDax.value > 0) {
      incomeNumbers.push(+dataDax.value.toFixed(2));
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
                                dataPYPL: Data, dataBRKB: Data, dataKO: Data, dataPG: Data,
                                dataSAP: Data, dataURA: Data, dataCS: Data, dataGSG: Data,
                                dataPplt: Data, dataGovt: Data, dataTan: Data, dataXom: Data,
                                dataJnj: Data, dataAddyy: Data, dataGs: Data, dataDax: Data,
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
    if (dataPYPL.value > 0) {
      incomeNumbers.push('#009cde');
    }
    if (dataBRKB.value > 0) {
      incomeNumbers.push('#2e3192');
    }
    if (dataKO.value > 0) {
      incomeNumbers.push('#F40009');
    }
    if (dataPG.value > 0) {
      incomeNumbers.push('#003cae');
    }
    if (dataSAP.value > 0) {
      incomeNumbers.push('#019CE0');
    }
    if (dataURA.value > 0) {
      incomeNumbers.push('#100A57');
    }
    if (dataCS.value > 0) {
      incomeNumbers.push('#003662');
    }
    if (dataGSG.value > 0) {
      incomeNumbers.push('#FFDE2E');
    }
    if (dataPplt.value > 0) {
      incomeNumbers.push('#E5E4E2');
    }
    if (dataGovt.value > 0) {
      incomeNumbers.push('#40B5AD');
    }
    if (dataTan.value > 0) {
      incomeNumbers.push('#FDB813');
    }
    if (dataXom.value > 0) {
      incomeNumbers.push('#F01523');
    }
    if (dataJnj.value > 0) {
      incomeNumbers.push('#d51900');
    }
    if (dataAddyy.value > 0) {
      incomeNumbers.push('#c41e3a');
    }
    if (dataGs.value > 0) {
      incomeNumbers.push('#6B96C3');
    }
    if (dataDax.value > 0) {
      incomeNumbers.push('#000299');
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
                                dataPYPL: Data, dataBRKB: Data, dataKO: Data, dataPG: Data,
                                dataSAP: Data, dataURA: Data, dataCS: Data, dataGSG: Data,
                                dataPplt: Data, dataGovt: Data, dataTan: Data, dataXom: Data,
                                dataJnj: Data, dataAddyy: Data, dataGs: Data, dataDax: Data,
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
    if (this.getAnteilPortfolioForChart(dataPYPL, allValue) > 0) {
      incomeNumbers.push('PYPL ' + this.getAnteilPortfolioForChart(dataPYPL, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataBRKB, allValue) > 0) {
      incomeNumbers.push('BRK.B ' + this.getAnteilPortfolioForChart(dataBRKB, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataKO, allValue) > 0) {
      incomeNumbers.push('KO ' + this.getAnteilPortfolioForChart(dataKO, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPG, allValue) > 0) {
      incomeNumbers.push('PG ' + this.getAnteilPortfolioForChart(dataPG, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataSAP, allValue) > 0) {
      incomeNumbers.push('SAP ' + this.getAnteilPortfolioForChart(dataSAP, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataURA, allValue) > 0) {
      incomeNumbers.push('URA ' + this.getAnteilPortfolioForChart(dataURA, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataCS, allValue) > 0) {
      incomeNumbers.push('CS ' + this.getAnteilPortfolioForChart(dataCS, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGSG, allValue) > 0) {
      incomeNumbers.push('GSG ' + this.getAnteilPortfolioForChart(dataGSG, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataPplt, allValue) > 0) {
      incomeNumbers.push('PPLT ' + this.getAnteilPortfolioForChart(dataPplt, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGovt, allValue) > 0) {
      incomeNumbers.push('GOVT ' + this.getAnteilPortfolioForChart(dataGovt, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataTan, allValue) > 0) {
      incomeNumbers.push('TAN ' + this.getAnteilPortfolioForChart(dataTan, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataXom, allValue) > 0) {
      incomeNumbers.push('XOM ' + this.getAnteilPortfolioForChart(dataXom, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataJnj, allValue) > 0) {
      incomeNumbers.push('JNJ ' + this.getAnteilPortfolioForChart(dataJnj, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataAddyy, allValue) > 0) {
      incomeNumbers.push('ADDYY ' + this.getAnteilPortfolioForChart(dataAddyy, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataGs, allValue) > 0) {
      incomeNumbers.push('GS ' + this.getAnteilPortfolioForChart(dataGs, allValue).toFixed(1) + '%');
    }
    if (this.getAnteilPortfolioForChart(dataDax, allValue) > 0) {
      incomeNumbers.push('DAX ' + this.getAnteilPortfolioForChart(dataDax, allValue).toFixed(1) + '%');
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
