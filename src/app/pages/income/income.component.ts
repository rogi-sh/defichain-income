import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ChartOptions2, StakingCalc, Wallet} from '@interfaces/Data';
import {MasternodeOutcome, Outcome, OutcomeStaking, Pool} from '@interfaces/Dex';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html'
})
export class IncomeComponent implements OnInit, OnChanges {
  stakingCalcOut: StakingCalc = new StakingCalc();
  selectedTab = 'All';

  @ViewChild('chart2') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;

  @Input()
  stakingOut!: OutcomeStaking;

  @Input()
  masternodeOut!: MasternodeOutcome;

  @Input()
  poolOut!: Outcome;

  @Input()
  poolAllOut!: Outcome;

  @Input()
  poolBtcOut!: Outcome;

  @Input()
  poolEthOut!: Outcome;

  @Input()
  poolUsdtOut!: Outcome;

  @Input()
  poolUsdcOut!: Outcome;

  @Input()
  poolLtcOut!: Outcome;

  @Input()
  poolBchOut!: Outcome;

  @Input()
  poolDogeOut!: Outcome;

  @Input()
  poolUsdOut!: Outcome;

  @Input()
  poolTslaOut!: Outcome;

  @Input()
  poolSpyOut!: Outcome;

  @Input()
  poolQqqOut!: Outcome;

  @Input()
  poolPltrOut!: Outcome;

  @Input()
  poolSlvOut!: Outcome;

  @Input()
  poolAaplOut!: Outcome;

  @Input()
  poolGldOut!: Outcome;

  @Input()
  poolGmeOut!: Outcome;

  @Input()
  poolGooglOut!: Outcome;

  @Input()
  poolArkkOut!: Outcome;

  @Input()
  poolBabaOut!: Outcome;

  @Input()
  poolVnqOut!: Outcome;

  @Input()
  poolUrthOut!: Outcome;

  @Input()
  poolTltOut!: Outcome;

  @Input()
  poolPdbcOut!: Outcome;

  @Input()
  poolAmznOut!: Outcome;

  @Input()
  poolNvdaOut!: Outcome;

  @Input()
  poolCoinOut!: Outcome;

  @Input()
  poolEemOut!: Outcome;

  @Input()
  poolMsftOut!: Outcome;

  @Input()
  poolNflxOut!: Outcome;

  @Input()
  poolFbOut!: Outcome;

  @Input()
  poolVooOut!: Outcome;

  @Input()
  poolDisOut!: Outcome;

  @Input()
  poolMchiOut!: Outcome;

  @Input()
  poolMsrtOut!: Outcome;

  @Input()
  poolIntcOut!: Outcome;

  @Input()
  poolPyplOut!: Outcome;

  @Input()
  poolBrkbOut!: Outcome;

  @Input()
  poolKoOut!: Outcome;

  @Input()
  poolPgOut!: Outcome;

  @Input()
  poolSapOut!: Outcome;

  @Input()
  poolUraOut!: Outcome;

  @Input()
  poolCsOut!: Outcome;

  @Input()
  poolPpltOut!: Outcome;

  @Input()
  poolXomOut!: Outcome;

  @Input()
  poolGovtOut!: Outcome;

  @Input()
  poolTanOut!: Outcome;

  @Input()
  poolGsgOut!: Outcome;

  @Input()
  poolBtc!: Pool;

  @Input()
  fiat!: string;

  @Input()
  dfiInStaking!: number;

  @Input()
  dfiInDfxStaking!: number;

  @Input()
  stakingApy!: number;

  @Input()
  stakingDfxApy!: number;

  @Input()
  masternodesApr!: number;

  @Input()
  masternodesCount!: number;

  @Input()
  getAnteilBTCPoolAnGesamtLM: number;

  @Input()
  getAnteilETHPoolAnGesamtLM: number;

  @Input()
  getAnteilLTCPoolAnGesamtLM: number;

  @Input()
  getAnteilUSDTPoolAnGesamtLM: number;

  @Input()
  getAnteilUSDCPoolAnGesamtLM: number;

  @Input()
  getAnteilDogePoolAnGesamtLM: number;

  @Input()
  getAnteilBchPoolAnGesamtLM: number;

  @Input()
  getAnteilUsdPoolAnGesamtLM: number;

  @Input()
  getAnteilTslaPoolAnGesamtLM: number;

  @Input()
  getAnteilQqqPoolAnGesamtLM: number;

  @Input()
  getAnteilSpyPoolAnGesamtLM: number;

  @Input()
  getAnteilPltrPoolAnGesamtLM: number;

  @Input()
  getAnteilSlvPoolAnGesamtLM: number;

  @Input()
  getAnteilAaplPoolAnGesamtLM: number;

  @Input()
  getAnteilGldPoolAnGesamtLM: number;

  @Input()
  getAnteilGmePoolAnGesamtLM: number;

  @Input()
  getAnteilGooglPoolAnGesamtLM: number;

  @Input()
  getAnteilArkkPoolAnGesamtLM: number;

  @Input()
  getAnteilBabaPoolAnGesamtLM: number;

  @Input()
  getAnteilVnqPoolAnGesamtLM: number;

  @Input()
  getAnteilUrthPoolAnGesamtLM: number;

  @Input()
  getAnteilTltPoolAnGesamtLM: number;

  @Input()
  getAnteilPdbcPoolAnGesamtLM: number;

  @Input()
  getAnteilAmznPoolAnGesamtLM: number;

  @Input()
  getAnteilNvdaPoolAnGesamtLM: number;

  @Input()
  getAnteilCoinPoolAnGesamtLM: number;

  @Input()
  getAnteilEemPoolAnGesamtLM: number;

  @Input()
  getAnteilMsftPoolAnGesamtLM: number;

  @Input()
  getAnteilNflxPoolAnGesamtLM: number;

  @Input()
  getAnteilFbPoolAnGesamtLM: number;

  @Input()
  getAnteilVooPoolAnGesamtLM: number;

  @Input()
  getAnteilDisPoolAnGesamtLM: number;

  @Input()
  getAnteilMchiPoolAnGesamtLM: number;

  @Input()
  getAnteilMstrPoolAnGesamtLM: number;

  @Input()
  getAnteilIntcPoolAnGesamtLM: number;

  @Input()
  getAnteilPyplPoolAnGesamtLM: number;

  @Input()
  getAnteilBrkbPoolAnGesamtLM: number;

  @Input()
  getAnteilKoPoolAnGesamtLM: number;

  @Input()
  getAnteilPgPoolAnGesamtLM: number;

  @Input()
  getAnteilSapPoolAnGesamtLM: number;

  @Input()
  getAnteilUraPoolAnGesamtLM: number;

  @Input()
  getAnteilCsPoolAnGesamtLM: number;

  @Input()
  getAnteilGsgPoolAnGesamtLM: number;

  @Input()
  getAnteilPpltPoolAnGesamtLM: number;

  @Input()
  getAnteilGovtPoolAnGesamtLM: number;

  @Input()
  getAnteilTanPoolAnGesamtLM: number;

  @Input()
  getAnteilXomPoolAnGesamtLM: number;

  @Input()
  getDfiCountInLM: number;

  @Input()
  getLMUsd: number;

  @Input()
  wallet: Wallet;

  @Input()
  showOnlyGraph: boolean;

  @Input()
  isIncognitoModeOn: boolean;

  constructor()  { }

  ngOnInit(): void {
    this.buildDataForChartIncome();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChartIncome();
  }

  getAnteilStakingOfIncome(): number {
    return this.stakingOut.dfiPerYear / this.getAllIncome() * 100;
  }

  getAnteilLMOfIncome(): number {
    return this.poolOut.dfiPerYear / this.getAllIncome() * 100;
  }

  getAnteilMasternodeOfIncome(): number {
    return this.masternodeOut.dfiPerYear / this.getAllIncome() * 100;
  }

  getAllIncome(): number {
    return this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear + this.masternodeOut.dfiPerYear;
  }

  getSeriesIncome(): Array<number> {

    const incomeNumbers = new Array<number>();

    if (this.stakingOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.stakingOut.dfiPerMonth * 100) / 100);
    }
    if (this.masternodeOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.masternodeOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolBtcOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolBtcOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolEthOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolEthOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolLtcOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolLtcOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolUsdtOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolUsdtOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolUsdcOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolUsdcOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolDogeOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolDogeOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolBchOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolBchOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolUsdOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolUsdOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolTslaOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolTslaOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolSpyOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolSpyOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolQqqOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolQqqOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolPltrOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolPltrOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolSlvOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolSlvOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolAaplOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolAaplOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolGldOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolGldOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolGmeOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolGmeOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolGooglOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolGooglOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolArkkOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolArkkOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolBabaOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolBabaOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolVnqOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolVnqOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolUrthOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolUrthOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolTltOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolTltOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolPdbcOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolPdbcOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolAmznOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolAmznOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolNvdaOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolNvdaOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolCoinOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolCoinOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolEemOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolEemOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolMsftOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolMsftOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolNflxOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolNflxOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolFbOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolFbOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolVooOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolVooOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolDisOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolDisOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolMchiOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolMchiOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolMsrtOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolMsrtOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolIntcOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolIntcOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolPyplOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolPyplOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolBrkbOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolBrkbOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolKoOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolKoOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolPgOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolPgOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolSapOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolSapOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolUraOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolUraOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolCsOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolCsOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolGsgOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolGsgOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolPpltOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolPpltOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolGovtOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolGovtOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolTanOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolTanOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolXomOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolXomOut.dfiPerMonth * 100) / 100);
    }

    return incomeNumbers;
  }

  getDfiCountStakingUsd(): number {
    return (this.dfiInStaking + this.dfiInDfxStaking) * this.poolBtc?.priceB;
  }

  getDfiCountMasternodesUsd(): number {
    return this.wallet.dfiInMasternodes * this.poolBtc?.priceB;
  }

  getBalanceMasternode(): number {
    return this.wallet.dfiInMasternodes - 20000 * this.masternodesCount;
  }

  getColorsIncome(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.stakingOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#ff00af');
    }
    if (this.masternodeOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#ff00af');
    }
    if (this.poolBtcOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#ff9900');
    }
    if (this.poolEthOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#3c3c3d');
    }
    if (this.poolLtcOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#b8b8b8');
    }
    if (this.poolUsdtOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#26a17b');
    }
    if (this.poolUsdcOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#2875C9');
    }
    if (this.poolDogeOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#cb9800');
    }
    if (this.poolBchOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#4CC947');
    }
    if (this.poolUsdOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#6B8068');
    }
    if (this.poolTslaOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#cc0000');
    }
    if (this.poolSpyOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#87CEFA');
    }
    if (this.poolQqqOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#87CEEB');
    }
    if (this.poolPltrOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#47484a');
    }
    if (this.poolSlvOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#aaa9ad');
    }
    if (this.poolAaplOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#A2AAAD');
    }
    if (this.poolGldOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#FFD700');
    }
    if (this.poolGmeOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#f84443');
    }
    if (this.poolGooglOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#4285F4');
    }
    if (this.poolArkkOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#00BFFF');
    }
    if (this.poolBabaOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#FF7300');
    }
    if (this.poolVnqOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#B0C4DE');
    }
    if (this.poolUrthOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#1E90FF');
    }
    if (this.poolTltOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#6495ED');
    }
    if (this.poolPdbcOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#1e1e1e');
    }
    if (this.poolAmznOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#FF9900');
    }
    if (this.poolNvdaOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#76B900');
    }
    if (this.poolCoinOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#1652f0');
    }
    if (this.poolEemOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#4682B4');
    }
    if (this.poolMsftOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#737373');
    }
    if (this.poolNflxOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#E50914');
    }
    if (this.poolFbOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#4267B2');
    }
    if (this.poolVooOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#6082B6');
    }
    if (this.poolDisOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#113CCF');
    }
    if (this.poolMchiOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#D1EAF0');
    }
    if (this.poolMsrtOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#df3741');
    }
    if (this.poolIntcOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#0071c5');
    }
    if (this.poolPyplOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#009cde');
    }
    if (this.poolBrkbOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#2e3192');
    }
    if (this.poolKoOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#F40009');
    }
    if (this.poolPgOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#003cae');
    }
    if (this.poolSapOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#019CE0');
    }
    if (this.poolUraOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#100A57');
    }
    if (this.poolCsOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#003662');
    }
    if (this.poolGsgOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#FFDE2E');
    }
    if (this.poolPpltOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#E5E4E2');
    }
    if (this.poolGovtOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#40B5AD');
    }
    if (this.poolTanOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#FDB813');
    }
    if (this.poolXomOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#F01523');
    }

    return incomeNumbers;
  }


  getSeriesIncomeTitle(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.stakingOut.dfiPerMonth > 0) {
      incomeNumbers.push(`Staking - ${this.isIncognitoModeOn ? '****' : this.stakingOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.masternodeOut.dfiPerMonth > 0) {
      incomeNumbers.push(`Masternode - ${this.isIncognitoModeOn ? '****' : this.masternodeOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolBtcOut.dfiPerMonth > 0) {
      incomeNumbers.push(`BTC-Pool - ${this.isIncognitoModeOn ? '****' : this.poolBtcOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolEthOut.dfiPerMonth > 0) {
      incomeNumbers.push(`ETH-Pool - ${this.isIncognitoModeOn ? '****' : this.poolEthOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolLtcOut.dfiPerMonth > 0) {
      incomeNumbers.push(`LTC-Pool - ${this.isIncognitoModeOn ? '****' : this.poolLtcOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolUsdtOut.dfiPerMonth > 0) {
      incomeNumbers.push(`USDT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolUsdtOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolUsdcOut.dfiPerMonth > 0) {
      incomeNumbers.push(`USDC-Pool - ${this.isIncognitoModeOn ? '****' : this.poolUsdcOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolDogeOut.dfiPerMonth > 0) {
      incomeNumbers.push(`DOGE-Pool - ${this.isIncognitoModeOn ? '****' : this.poolDogeOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolBchOut.dfiPerMonth > 0) {
      incomeNumbers.push(`BCH-Pool - ${this.isIncognitoModeOn ? '****' : this.poolBchOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolUsdOut.dfiPerMonth > 0) {
      incomeNumbers.push(`DUSD-Pool - ${this.isIncognitoModeOn ? '****' : this.poolUsdOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolTslaOut.dfiPerMonth > 0) {
      incomeNumbers.push(`TSLA-Pool - ${this.isIncognitoModeOn ? '****' : this.poolTslaOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolSpyOut.dfiPerMonth > 0) {
      incomeNumbers.push(`SPY-Pool - ${this.isIncognitoModeOn ? '****' : this.poolSpyOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolQqqOut.dfiPerMonth > 0) {
      incomeNumbers.push(`QQQ-Pool - ${this.isIncognitoModeOn ? '****' : this.poolQqqOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolPltrOut.dfiPerMonth > 0) {
      incomeNumbers.push(`PLTR-Pool - ${this.isIncognitoModeOn ? '****' : this.poolPltrOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolSlvOut.dfiPerMonth > 0) {
      incomeNumbers.push(`SLV-Pool - ${this.isIncognitoModeOn ? '****' : this.poolSlvOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolAaplOut.dfiPerMonth > 0) {
      incomeNumbers.push(`AAPL-Pool - ${this.isIncognitoModeOn ? '****' : this.poolAaplOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolGldOut.dfiPerMonth > 0) {
      incomeNumbers.push(`GLD-Pool - ${this.isIncognitoModeOn ? '****' : this.poolGldOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolGmeOut.dfiPerMonth > 0) {
      incomeNumbers.push(`GME-Pool - ${this.isIncognitoModeOn ? '****' : this.poolGmeOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolGooglOut.dfiPerMonth > 0) {
      incomeNumbers.push(`GOOGL-Pool - ${this.isIncognitoModeOn ? '****' : this.poolGooglOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolArkkOut.dfiPerMonth > 0) {
      incomeNumbers.push(`ARKK-Pool - ${this.isIncognitoModeOn ? '****' : this.poolArkkOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolBabaOut.dfiPerMonth > 0) {
      incomeNumbers.push(`BABA-Pool - ${this.isIncognitoModeOn ? '****' : this.poolBabaOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolVnqOut.dfiPerMonth > 0) {
      incomeNumbers.push(`VNQ-Pool - ${this.isIncognitoModeOn ? '****' : this.poolVnqOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolUrthOut.dfiPerMonth > 0) {
      incomeNumbers.push(`URTH-Pool - ${this.isIncognitoModeOn ? '****' : this.poolUrthOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolTltOut.dfiPerMonth > 0) {
      incomeNumbers.push(`TLT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolTltOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolPdbcOut.dfiPerMonth > 0) {
      incomeNumbers.push(`PDBC-Pool - ${this.isIncognitoModeOn ? '****' : this.poolPdbcOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolAmznOut.dfiPerMonth > 0) {
      incomeNumbers.push(`AMZN-Pool - ${this.isIncognitoModeOn ? '****' : this.poolAmznOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolNvdaOut.dfiPerMonth > 0) {
      incomeNumbers.push(`NVDA-Pool - ${this.isIncognitoModeOn ? '****' : this.poolNvdaOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolCoinOut.dfiPerMonth > 0) {
      incomeNumbers.push(`COIN-Pool - ${this.isIncognitoModeOn ? '****' : this.poolCoinOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolEemOut.dfiPerMonth > 0) {
      incomeNumbers.push(`EEM-Pool - ${this.isIncognitoModeOn ? '****' : this.poolEemOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolMsftOut.dfiPerMonth > 0) {
      incomeNumbers.push(`MSFT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolMsftOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolNflxOut.dfiPerMonth > 0) {
      incomeNumbers.push(`NFLX-Pool - ${this.isIncognitoModeOn ? '****' : this.poolNflxOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolFbOut.dfiPerMonth > 0) {
      incomeNumbers.push(`FB-Pool - ${this.isIncognitoModeOn ? '****' : this.poolFbOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolVooOut.dfiPerMonth > 0) {
      incomeNumbers.push(`VOO-Pool - ${this.isIncognitoModeOn ? '****' : this.poolVooOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolDisOut.dfiPerMonth > 0) {
      incomeNumbers.push(`DIS-Pool - ${this.isIncognitoModeOn ? '****' : this.poolDisOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolMchiOut.dfiPerMonth > 0) {
      incomeNumbers.push(`MCHI-Pool - ${this.isIncognitoModeOn ? '****' : this.poolMchiOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolMsrtOut.dfiPerMonth > 0) {
      incomeNumbers.push(`MSRT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolMsrtOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolIntcOut.dfiPerMonth > 0) {
      incomeNumbers.push(`INTC-Pool - ${this.isIncognitoModeOn ? '****' : this.poolIntcOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolPyplOut.dfiPerMonth > 0) {
      incomeNumbers.push(`PYPL-Pool - ${this.isIncognitoModeOn ? '****' : this.poolPyplOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolBrkbOut.dfiPerMonth > 0) {
      incomeNumbers.push(`BRK.B-Pool - ${this.isIncognitoModeOn ? '****' : this.poolBrkbOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolKoOut.dfiPerMonth > 0) {
      incomeNumbers.push(`KO-Pool - ${this.isIncognitoModeOn ? '****' : this.poolKoOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolPgOut.dfiPerMonth > 0) {
      incomeNumbers.push(`PG-Pool - ${this.isIncognitoModeOn ? '****' : this.poolPgOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolSapOut.dfiPerMonth > 0) {
      incomeNumbers.push(`SAP-Pool - ${this.isIncognitoModeOn ? '****' : this.poolSapOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolUraOut.dfiPerMonth > 0) {
      incomeNumbers.push(`URA-Pool - ${this.isIncognitoModeOn ? '****' : this.poolUraOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolCsOut.dfiPerMonth > 0) {
      incomeNumbers.push(`CS-Pool - ${this.isIncognitoModeOn ? '****' : this.poolCsOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolGsgOut.dfiPerMonth > 0) {
      incomeNumbers.push(`GSG-Pool - ${this.isIncognitoModeOn ? '****' : this.poolGsgOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolPpltOut.dfiPerMonth > 0) {
      incomeNumbers.push(`PPLT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolPpltOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolGovtOut.dfiPerMonth > 0) {
      incomeNumbers.push(`GOVT-Pool - ${this.isIncognitoModeOn ? '****' : this.poolGovtOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolTanOut.dfiPerMonth > 0) {
      incomeNumbers.push(`TAN-Pool - ${this.isIncognitoModeOn ? '****' : this.poolTanOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.poolXomOut.dfiPerMonth > 0) {
      incomeNumbers.push(`XOM-Pool - ${this.isIncognitoModeOn ? '****' : this.poolXomOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    return incomeNumbers;
  }

  buildDataForChartIncome(): void {

    this.chartOptions2 = {

      series: this.getSeriesIncome(),
      colors: this.getColorsIncome(),
      chart: {
        width: '100%',
        height: '400px',
        type: 'polarArea',
        background: 'transparent',
        animations: {
          enabled: false
        }
      },
      stroke: {
        colors: ['#fff'],
        curve: 'straight'
      },
      labels: this.getSeriesIncomeTitle(),
      fill: {
        opacity: 0.9
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

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }
}
