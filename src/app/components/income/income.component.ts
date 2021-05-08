import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ChartComponent} from 'ng-apexcharts';
import {ChartOptions2, StakingCalc, Wallet} from '@interfaces/Data';
import {Outcome, OutcomeStaking, Pool} from '@interfaces/Dex';

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
  poolLtcOut!: Outcome;

  @Input()
  poolBchOut!: Outcome;

  @Input()
  poolDogeOut!: Outcome;

  @Input()
  poolBtc!: Pool;

  @Input()
  fiat!: string;

  @Input()
  dfiInStaking!: number;

  @Input()
  stakingApy!: number;

  @Input()
  getAnteilBTCPoolAnGesamtLM: number;

  @Input()
  getAnteilETHPoolAnGesamtLM: number;

  @Input()
  getAnteilLTCPoolAnGesamtLM: number;

  @Input()
  getAnteilUSDTPoolAnGesamtLM: number;

  @Input()
  getAnteilDogePoolAnGesamtLM: number;

  @Input()
  getAnteilBchPoolAnGesamtLM: number;

  @Input()
  getDfiCountInLM: number;

  @Input()
  getLMUsd: number;

  @Input()
  wallet: Wallet;

  @Input()
  showOnlyGraph: boolean;

  constructor()  { }

  ngOnInit(): void {
    this.buildDataForChartIncome();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDataForChartIncome();
  }

  getAnteilStakingOfIncome(): number {
    return this.stakingOut.dfiPerYear / (this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear) * 100;
  }

  getAnteilLMOfIncome(): number {
    return this.poolOut.dfiPerYear / (this.poolOut.dfiPerYear + this.stakingOut.dfiPerYear) * 100;
  }

  getDfiIncomePerMin(): number {
    return this.stakingOut.dfiPerMin + this.poolOut.dfiPerMin;
  }

  getDfiIncomeValuePerMinUsd(): number {
    return this.getDfiIncomePerMin() * this.poolBtc?.priceB;
  }

  getDfiIncomePerHour(): number {
    return this.stakingOut.dfiPerHour + this.poolOut.dfiPerHour;
  }

  getDfiIncomeValuePerHourUsd(): number {
    return this.getDfiIncomePerHour() * this.poolBtc?.priceB;
  }

  getDfiIncomePerDay(): number {
    return this.stakingOut.dfiPerDay + this.poolOut.dfiPerDay;
  }

  getDfiIncomeValuePerDayUsd(): number {
    return this.getDfiIncomePerDay() * this.poolBtc?.priceB;
  }

  getDfiIncomePerWeek(): number {
    return this.stakingOut.dfiPerWeek + this.poolOut.dfiPerWeek;
  }

  getDfiIncomeValuePerWeekUsd(): number {
    return this.getDfiIncomePerWeek() * this.poolBtc?.priceB;
  }

  getDfiIncomePerMonth(): number {
    return this.stakingOut.dfiPerMonth + this.poolOut.dfiPerMonth;
  }

  getDfiIncomeValuePerMonthUsd(): number {
    return this.getDfiIncomePerMonth() * this.poolBtc?.priceB;
  }

  getDfiIncomePerYear(): number {
    return this.stakingOut.dfiPerYear + this.poolOut.dfiPerYear;
  }

  getDfiIncomeValuePerYearUsd(): number {
    return this.getDfiIncomePerYear() * this.poolBtc?.priceB;
  }

  getSeriesIncome(): Array<number> {

    const incomeNumbers = new Array<number>();

    if (this.stakingOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.stakingOut.dfiPerMonth * 100) / 100);
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
    if (this.poolDogeOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolDogeOut.dfiPerMonth * 100) / 100);
    }
    if (this.poolBchOut?.dfiPerMonth > 0) {
      incomeNumbers.push(Math.round(this.poolBchOut.dfiPerMonth * 100) / 100);
    }


    return incomeNumbers;
  }

  getDfiCountStakingUsd(): number {
    return this.dfiInStaking * this.poolBtc?.priceB;
  }

  getColorsIncome(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.stakingOut?.dfiPerMonth > 0) {
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
    if (this.poolDogeOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#cb9800');
    }
    if (this.poolBchOut?.dfiPerMonth > 0) {
      incomeNumbers.push('#4CC947');
    }

    return incomeNumbers;
  }


  getSeriesIncomeTitle(): Array<string> {

    const incomeNumbers = new Array<string>();

    if (this.stakingOut.dfiPerMonth > 0) {
      incomeNumbers.push('Staking - ' + this.stakingOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolBtcOut.dfiPerMonth > 0) {
      incomeNumbers.push('BTC-Pool - ' + this.poolBtcOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolEthOut.dfiPerMonth > 0) {
      incomeNumbers.push('ETH-Pool - ' + this.poolEthOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolLtcOut.dfiPerMonth > 0) {
      incomeNumbers.push('LTC-Pool - ' + this.poolLtcOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolUsdtOut.dfiPerMonth > 0) {
      incomeNumbers.push('USDT-Pool - ' + this.poolUsdtOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolDogeOut.dfiPerMonth > 0) {
      incomeNumbers.push('DOGE-Pool - ' + this.poolDogeOut.dfiPerMonth.toFixed(2) + ' DFI');
    }
    if (this.poolBchOut.dfiPerMonth > 0) {
      incomeNumbers.push('BCH-Pool - ' + this.poolBchOut.dfiPerMonth.toFixed(2) + ' DFI');
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
        background: 'transparent'
      },
      stroke: {
        colors: ['#fff']
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
    return localStorage.theme
  }
}
