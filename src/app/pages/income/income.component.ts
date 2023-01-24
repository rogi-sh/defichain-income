import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import { ChartOptions2, Income, IncomePoolIncome, StakingCalc, Wallet } from '@interfaces/Data'
import {MasternodeOutcome, Outcome, OutcomeStaking, Pool} from '@interfaces/Dex';
import { DataService } from '@services/data.service'

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
  income!: Income;

  @Input()
  poolAllOut!: Outcome;

  @Input()
  lmOut!: Outcome;

  @Input()
  poolBtc!: Pool;

  @Input()
  fiat!: string;

  @Input()
  dfiInStaking!: number;

  @Input()
  dfiInLockStaking!: number;

  @Input()
  dfiInMasternodes!: number;

  @Input()
  stakingApy!: number;

  @Input()
  stakingLockApy!: number;

  @Input()
  masternodesApr!: number;

  @Input()
  masternodesCount!: number;

  @Input()
  getDfiCountInLM: number;

  @Input()
  getLMUsd: number;

  @Input()
  showOnlyGraph: boolean;

  @Input()
  isIncognitoModeOn: boolean;

  constructor(private dataService: DataService)  { }

  ngOnInit(): void {
    this.buildDataForChartIncome();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChartIncome();
  }

  getRound(num: number): number {
    return Math.round((num) * 10) / 10;
  }

  getAnteilStakingOfIncome(): number {
    return this.stakingOut.dfiPerYear / this.getAllIncome() * 100;
  }

  getAnteilLMOfIncome(): number {
    return this.income?.rewards.year.dfi / this.getAllIncome() * 100;
  }

  getAnteilMasternodeOfIncome(): number {
    return this.masternodeOut.dfiPerYear / this.getAllIncome() * 100;
  }

  getAllIncome(): number {
    return this.income?.rewards.year.dfi + this.stakingOut.dfiPerYear + this.masternodeOut.dfiPerYear;
  }

  getAllPoolDfIncome(): number {

    return this.income?.poolIncome.reduce((accumulator, object) => {
      return accumulator + object.dfiIncomeYear;
    }, 0);

  }

  getPoolsIncome(): IncomePoolIncome [] {
    return this.income?.poolIncome;
  }

  getAnteilPoolAnGesamtLM(poolIncome: IncomePoolIncome): number {
    return poolIncome.dfiIncomeYear / this.getAllPoolDfIncome() * 100;
  }

  getSeriesIncome(): Array<number> {

    const incomeNumbers = new Array<number>();

    if (this.stakingOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.stakingOut.dfiPerMonth * 100) / 100);
    }
    if (this.masternodeOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.masternodeOut.dfiPerMonth * 100) / 100);
    }
    this.income?.poolIncome.forEach(pool => {
      incomeNumbers.push(Math.round(pool.dfiIncomeYear / 12 * 100) / 100);
    })

    return incomeNumbers;
  }

  getDfiCountStakingUsd(): number {
    return (this.dfiInStaking  + this.dfiInLockStaking) * this.poolBtc?.priceB;
  }

  getDfiCountMasternodesUsd(): number {
    return this.dfiInMasternodes * this.poolBtc?.priceB;
  }

  getBalanceMasternode(): number {
    return this.dfiInMasternodes - 20000 * this.masternodesCount;
  }

  getColorsIncome(): Array<string> {

    const incomeColors = new Array<string>();

    if (this.stakingOut?.dfiPerMonth > 0) {
      incomeColors.push('#ff00af');
    }
    if (this.masternodeOut?.dfiPerMonth > 0) {
      incomeColors.push('#ff00af');
    }
    this.income?.poolIncome.forEach(pool => {
      incomeColors.push(this.dataService.getColorPool(+pool.id));
    })

    return incomeColors;
  }


  getSeriesIncomeTitle(): Array<string> {

    const incomeTitle = new Array<string>();

    if (this.stakingOut.dfiPerMonth > 0) {
      incomeTitle.push(`Staking - ${this.isIncognitoModeOn ? '****' : this.stakingOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    if (this.masternodeOut.dfiPerMonth > 0) {
      incomeTitle.push(`Masternode - ${this.isIncognitoModeOn ? '****' : this.masternodeOut.dfiPerMonth.toFixed(2)} DFI`);
    }
    this.income?.poolIncome.forEach(pool => {
      incomeTitle.push(pool.name + " - " + (this.isIncognitoModeOn ? '****' : (pool.dfiIncomeYear / 12).toFixed(2)) + " DFI");
    })

    return incomeTitle;
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
