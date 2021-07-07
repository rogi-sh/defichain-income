import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MasternodeOutcome,
  Outcome,
  OutcomeStaking, Pool,
  PoolAllOut,
} from '@interfaces/Dex';
import { ChartComponent } from 'ng-apexcharts';
import {ChartOptions5, Series} from '@interfaces/Data';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
})
export class ForecastComponent implements OnInit, OnChanges {
  @ViewChild('chartForecast') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions5>;

  reducePercent = (100 - 1.658) / 100;

  timeHorizonCycles = 24;

  @Input()
  poolOut!: Outcome;

  @Input()
  stakingOut!: OutcomeStaking;

  @Input()
  poolMasternodeOut!: MasternodeOutcome;

  @Input()
  lmOut!: Outcome;

  @Input()
  bs!: number;

  @Input()
  fiat!: string;

  @Input()
  poolBtc!: Pool;

  @Input()
  blockHeight!: number;

  euonsHardforkeBlock = 894000;

  poolOuts = new Array<PoolAllOut>();

  poolLmOuts = new Array<PoolAllOut>();

  poolStakingOuts = new Array<PoolAllOut>();

  poolMnOuts = new Array<PoolAllOut>();

  blocksPerCycle = 32690;

  poolOutcomeChartPos: Outcome;
  poolStakingChartPos: Outcome;
  poolLMChartPos: Outcome;
  poolMnChartPos: Outcome;
  actualPoolIndex = 0;

  constructor() {}

  ngOnInit(): void {
    this.computeMasternodesReduce();
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.computeMasternodesReduce();
  }

  computeMasternodesReduce(): void {
    if (this.poolOut === undefined || this.poolOut.dfiPerDay === undefined) {
      return;
    }

    // clean
    this.poolOuts = new Array<PoolAllOut>();
    this.poolLmOuts = new Array<PoolAllOut>();
    this.poolStakingOuts = new Array<PoolAllOut>();
    this.poolMnOuts = new Array<PoolAllOut>();

    for (let i = 0; i <= this.timeHorizonCycles; i++) {
      const poolAllOut = new PoolAllOut();
      const poolStakingOut = new PoolAllOut();
      const poolLmOut = new PoolAllOut();
      const poolMnOut = new PoolAllOut();

      if (i === 0) {
        this.transformPool(poolAllOut, this.poolOut);
        this.transformPool(poolStakingOut, this.stakingOut);
        this.transformPool(poolLmOut, this.lmOut);
        this.transformPool(poolMnOut, this.poolMasternodeOut);
      } else {
        this.transformPoolReduced(poolAllOut, this.poolOuts, i);
        this.transformPoolReduced(poolStakingOut, this.poolStakingOuts, i);
        this.transformPoolReduced(poolLmOut, this.poolLmOuts, i);
        this.transformPoolReduced(poolMnOut, this.poolMnOuts, i);
      }

      this.poolOuts.push(poolAllOut);
      this.poolLmOuts.push(poolLmOut);
      this.poolMnOuts.push(poolMnOut);
      this.poolStakingOuts.push(poolStakingOut);
    }

    this.poolOutcomeChartPos = this.poolOuts[0];
    this.poolStakingChartPos = this.poolStakingOuts[0];
    this.poolLMChartPos = this.poolLmOuts[0];
    this.poolMnChartPos = this.poolMnOuts[0];
  }

  buildChart(): void {
    this.chartOptions = {
      series: this.getSeries(),
      chart: {
        type: 'area',
        background: 'transparent',
        height: 450,
        events: {
          mouseMove: (function(event, chartContext, config): void {
            if (this.poolOuts?.length > 0 && config?.dataPointIndex  > -1 && this.actualPoolIndex !== config?.dataPointIndex ) {
              this.poolOutcomeChartPos = this.poolOuts[config.dataPointIndex];
              this.poolStakingChartPos = this.poolStakingOuts[config.dataPointIndex];
              this.poolLMChartPos = this.poolLmOuts[config.dataPointIndex];
              this.poolMnChartPos = this.poolMnOuts[config.dataPointIndex];
            }
          }).bind(this)
        }
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        fontSize: '16px',
        fontWeight: 600,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: this.getCat(),
        labels: {
          style: {
            fontSize: '16px',
            fontWeight: 600,
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '16px',
            fontWeight: 600,
          }
        },
        title: {
          text: 'DFI',
          style: {
            color: '#ff00af',
            fontSize: '17px',
            fontWeight: 600,
          }
        },
      }
    };
  }

  getSeries(): Array<Series> {
    const series = new Array<Series>();
    if (this.stakingOut?.dfiPerMonth > 0) {
      const staking = new Series();
      staking.name = 'Staking';
      staking.data = this.getStakingData();
      series.push(staking);
    }
    if (this.lmOut?.dfiPerMonth > 0) {
      const lm = new Series();
      lm.name = 'LM';
      lm.data = this.getLMData();
      series.push(lm);
    }
    if (this.poolMasternodeOut?.dfiPerMonth > 0) {
      const mn = new Series();
      mn.name = 'Masternode';
      mn.data = this.getMNData();
      series.push(mn);
    }

    const all = new Series();
    all.name = 'All';
    all.data = this.getAllData();
    series.push(all);

    return series;

  }

  onChangeLmCalculatIncome(value: number): void {
    this.timeHorizonCycles = value * 2;
    this.computeMasternodesReduce();
    this.buildChart();
  }

  getStakingData(): Array<number> {
    const result = new Array<number>();
    this.poolStakingOuts.forEach((p) =>
      result.push(Math.round(p.dfiPerMonth * 100) / 100)
    );
    return result;
  }

  getLMData(): Array<number> {
    const result = new Array<number>();
    this.poolLmOuts.forEach((p) =>
      result.push(Math.round(p.dfiPerMonth * 100) / 100)
    );
    return result;
  }

  getMNData(): Array<number> {
    const result = new Array<number>();
    this.poolMnOuts.forEach((p) =>
      result.push(Math.round(p.dfiPerMonth * 100) / 100)
    );
    return result;
  }

  getAllData(): Array<number> {
    const result = new Array<number>();
    this.poolOuts.forEach((p) =>
      result.push(Math.round(p.dfiPerMonth * 100) / 100)
    );
    return result;
  }

  getCat(): Array<string> {
    const result = new Array<string>();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let date =
      new Date(2021, 5, 3) > new Date() ? new Date(2021, 5, 3) : new Date();

    for (let i = 0; i <= this.timeHorizonCycles; i++) {

      result.push(date.toLocaleDateString('de-DE', options));
      if (i === 0) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        date = new Date(date.getTime() + blocks * this.bs * 1000);
      } else {
        date = new Date(date.getTime() + this.blocksPerCycle * this.bs * 1000);
      }
    }
    return result;
  }

  transformPool(poolAllOut: PoolAllOut, poolInput: Outcome): void {
    poolAllOut.dfiPerDay = poolInput.dfiPerDay;
    poolAllOut.dfiPerMin = poolInput.dfiPerMin;
    poolAllOut.dfiPerHour = poolInput.dfiPerHour;
    poolAllOut.dfiPerMonth = poolInput.dfiPerMonth;
    poolAllOut.dfiPerWeek = poolInput.dfiPerWeek;
    poolAllOut.dfiPerYear = poolInput.dfiPerYear;
  }

  transformPoolReduced(
    poolAllOut: PoolAllOut,
    inputPool: Array<PoolAllOut>,
    i: number
  ): void {
    poolAllOut.dfiPerDay = inputPool[i - 1].dfiPerDay * this.reducePercent;
    poolAllOut.dfiPerMin = inputPool[i - 1].dfiPerMin * this.reducePercent;
    poolAllOut.dfiPerHour = inputPool[i - 1].dfiPerHour * this.reducePercent;
    poolAllOut.dfiPerMonth = inputPool[i - 1].dfiPerMonth * this.reducePercent;
    poolAllOut.dfiPerWeek = inputPool[i - 1].dfiPerWeek * this.reducePercent;
    poolAllOut.dfiPerYear = inputPool[i - 1].dfiPerYear * this.reducePercent;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }
}
