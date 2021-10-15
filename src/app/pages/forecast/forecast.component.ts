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
import {ChartOptions5, Series, Wallet} from '@interfaces/Data';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
})
export class ForecastComponent implements OnInit, OnChanges {
  @ViewChild('chartForecast') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions5>;

  reducePercent = (100 - 1.658) / 100;

  timeHorizonCycles = 12 * 2.72;

  @Input()
  poolOut!: Outcome;

  poolCompoundOut: Outcome;

  @Input()
  stakingOut!: OutcomeStaking;

  @Input()
  poolMasternodeOut!: MasternodeOutcome;

  @Input()
  lmOut!: Outcome;

  lmCompoundOut: Outcome;

  @Input()
  bs!: number;

  @Input()
  fiat!: string;

  @Input()
  poolBtc!: Pool;

  @Input()
  poolEth!: Pool;

  @Input()
  poolUsdc!: Pool;

  @Input()
  poolBch!: Pool;

  @Input()
  poolUsdt!: Pool;

  @Input()
  poolDoge!: Pool;

  @Input()
  poolLtc!: Pool;

  @Input()
  blockHeight!: number;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  wallet!: Wallet;

  average: number;

  euonsHardforkeBlock = 894000;

  poolOuts = new Array<PoolAllOut>();

  poolCompoundAllOuts = new Array<PoolAllOut>();

  poolLmOuts = new Array<PoolAllOut>();

  poolLmCompoundOuts = new Array<PoolAllOut>();

  poolStakingOuts = new Array<PoolAllOut>();

  poolMnOuts = new Array<PoolAllOut>();

  blocksPerCycle = 32690;

  poolOutcomeChartPos: Outcome;
  poolOutcomeCompoundChartPos: Outcome;
  poolStakingChartPos: Outcome;
  poolLMChartPos: Outcome;
  poolLMCompoundChartPos: Outcome;
  poolMnChartPos: Outcome;
  actualPoolIndex = 0;

  reinvestPeriod = 356;

  constructor() {}

  ngOnInit(): void {
    this.average = this.getAPRAverage();
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
    this.poolCompoundAllOuts = new Array<PoolAllOut>();
    this.poolLmOuts = new Array<PoolAllOut>();
    this.poolLmCompoundOuts = new Array<PoolAllOut>();
    this.poolStakingOuts = new Array<PoolAllOut>();
    this.poolMnOuts = new Array<PoolAllOut>();

    for (let i = 0; i <= this.timeHorizonCycles; i++) {
      const poolAllOut = new PoolAllOut();
      const poolCompoundAllOut = new PoolAllOut();
      const poolStakingOut = new PoolAllOut();
      const poolLmOut = new PoolAllOut();
      const poolLmCompoundOut = new PoolAllOut();
      const poolMnOut = new PoolAllOut();

      if (i === 0) {
        this.transformPool(poolAllOut, this.poolOut);
        this.transformPool(poolCompoundAllOut, poolAllOut);
        this.transformPool(poolStakingOut, this.stakingOut);
        this.transformPool(poolLmOut, this.lmOut);
        // Compound ist gleich mit dem LM zu Beginn
        this.transformPool(poolLmCompoundOut, poolLmOut);
        this.transformPool(poolMnOut, this.poolMasternodeOut);
      } else {
        this.transformPoolReduced(poolAllOut, this.poolOuts, i);
        this.transformPoolReduced(poolStakingOut, this.poolStakingOuts, i);
        this.transformPoolReduced(poolLmOut, this.poolLmOuts, i);
        this.transformPoolReducedCompound(poolLmCompoundOut, this.poolLmCompoundOuts, i);
        this.transformPoolReduced(poolMnOut, this.poolMnOuts, i);
        this.transformPoolAllReducedCompound(poolCompoundAllOut, poolStakingOut, poolLmCompoundOut, poolMnOut);
      }

      this.poolOuts.push(poolAllOut);
      this.poolCompoundAllOuts.push(poolCompoundAllOut);
      this.poolLmOuts.push(poolLmOut);
      this.poolLmCompoundOuts.push(poolLmCompoundOut);
      this.poolMnOuts.push(poolMnOut);
      this.poolStakingOuts.push(poolStakingOut);
    }

    this.poolOutcomeChartPos = this.poolOuts[0];
    this.poolOutcomeCompoundChartPos = this.poolCompoundAllOuts[0];
    this.poolStakingChartPos = this.poolStakingOuts[0];
    this.poolLMChartPos = this.poolLmOuts[0];
    this.poolLMCompoundChartPos = this.poolLmCompoundOuts[0];
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
              this.poolOutcomeCompoundChartPos = this.poolCompoundAllOuts[config.dataPointIndex];
              this.poolStakingChartPos = this.poolStakingOuts[config.dataPointIndex];
              this.poolLMChartPos = this.poolLmOuts[config.dataPointIndex];
              this.poolLMCompoundChartPos = this.poolLmCompoundOuts[config.dataPointIndex];
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
    if (this.lmOut?.dfiPerMonth > 0) {
      const lmC = new Series();
      lmC.name = 'LM Compound';
      lmC.data = this.getLMCompoundData();
      series.push(lmC);
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

    const allC = new Series();
    allC.name = 'All Compound';
    allC.data = this.getAllCompoundData();
    series.push(allC);

    return series;

  }

  onChangeLmCalculatIncome(value: number): void {
    this.timeHorizonCycles = value * 2.72;
    this.computeMasternodesReduce();
    this.buildChart();
  }

  onChangeReinvestIncome(value: number): void {
    this.reinvestPeriod = +value;
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

  getLMCompoundData(): Array<number> {
    const result = new Array<number>();
    this.poolLmCompoundOuts.forEach((p) =>
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

  getAllCompoundData(): Array<number> {
    const result = new Array<number>();
    this.poolCompoundAllOuts.forEach((p) =>
      result.push(Math.round(p.dfiPerMonth * 100) / 100)
    );
    return result;
  }

  getCat(): Array<string> {
    const result = new Array<string>();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;
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
    poolAllOut.dfiPerDay = poolInput?.dfiPerDay;
    poolAllOut.dfiPerMin = poolInput?.dfiPerMin;
    poolAllOut.dfiPerHour = poolInput?.dfiPerHour;
    poolAllOut.dfiPerMonth = poolInput?.dfiPerMonth;
    poolAllOut.dfiPerWeek = poolInput?.dfiPerWeek;
    poolAllOut.dfiPerYear = poolInput?.dfiPerYear;
  }

  transformPoolReduced(
    poolAllOut: PoolAllOut,
    inputPool: Array<PoolAllOut>,
    i: number
  ): void {
    poolAllOut.dfiPerDay = inputPool[i - 1]?.dfiPerDay * this.reducePercent;
    poolAllOut.dfiPerMin = inputPool[i - 1]?.dfiPerMin * this.reducePercent;
    poolAllOut.dfiPerHour = inputPool[i - 1]?.dfiPerHour * this.reducePercent;
    poolAllOut.dfiPerMonth = inputPool[i - 1]?.dfiPerMonth * this.reducePercent;
    poolAllOut.dfiPerWeek = inputPool[i - 1]?.dfiPerWeek * this.reducePercent;
    poolAllOut.dfiPerYear = inputPool[i - 1]?.dfiPerYear * this.reducePercent;
  }

  transformPoolReducedCompound(
    poolAllOut: PoolAllOut,
    inputPool: Array<PoolAllOut>,
    i: number
  ): void {
    const reinvestDFI = this.getReinvestDFI(inputPool[i - 1], i);
    const dfiiInLm = this.getDfiCountLM() * 2 + reinvestDFI;

    const reduction = this.getReduction(i);
    const apy = Math.pow(1 + (this.average / 100 / this.reinvestPeriod), this.reinvestPeriod) - 1;
    const yearYield = dfiiInLm * apy * reduction;

    poolAllOut.dfiPerDay = yearYield / 356;
    poolAllOut.dfiPerMin = yearYield / 525600;
    poolAllOut.dfiPerHour = yearYield / 8760;
    poolAllOut.dfiPerMonth = yearYield / 12;
    poolAllOut.dfiPerWeek = yearYield / 52;
    poolAllOut.dfiPerYear = yearYield;
  }

  getReinvestDFI(inputPool: PoolAllOut, i: number): number {
    if (inputPool && this.reinvestPeriod === 356) {
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        const daysForReinvest = Math.round(blocks * this.bs / 86400);
        return inputPool.dfiPerDay * daysForReinvest;
      } else {
          const daysForReinvest = Math.round(this.blocksPerCycle * this.bs / 86400);
          return inputPool.dfiPerDay * daysForReinvest;
        }
    } else if (inputPool && this.reinvestPeriod === 52) {
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        const weeksForInvest =  Math.round(blocks * this.bs / 604800 * 10) / 10;
        return inputPool.dfiPerWeek * weeksForInvest;
      } else {
        const weeksForInvest = Math.round(this.blocksPerCycle * this.bs / 604800 * 10) / 10;
        return inputPool.dfiPerWeek * weeksForInvest;
      }
    } else if (inputPool && this.reinvestPeriod === 12) {
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        const monthForInvest = Math.round(blocks * this.bs / 2628000 * 10) / 10;
        return inputPool.dfiPerMonth * monthForInvest;
      } else {
        const monthForInvest = Math.round(this.blocksPerCycle * this.bs / 2628000 * 10) / 10;
        return inputPool.dfiPerMonth * monthForInvest;
      }
    }
  }

  transformPoolAllReducedCompound(
    poolAllOut: PoolAllOut,
    stakingPool: PoolAllOut,
    lmCompundPool: PoolAllOut,
    mnPool: PoolAllOut
  ): void {

    poolAllOut.dfiPerDay = stakingPool.dfiPerDay + lmCompundPool.dfiPerDay + mnPool.dfiPerDay;
    poolAllOut.dfiPerMin = stakingPool.dfiPerMin + lmCompundPool.dfiPerMin + mnPool.dfiPerMin;
    poolAllOut.dfiPerHour = stakingPool.dfiPerHour + lmCompundPool.dfiPerHour + mnPool.dfiPerHour;
    poolAllOut.dfiPerMonth = stakingPool.dfiPerMonth + lmCompundPool.dfiPerMonth + mnPool.dfiPerMonth;
    poolAllOut.dfiPerWeek = stakingPool.dfiPerWeek + lmCompundPool.dfiPerWeek + mnPool.dfiPerWeek;
    poolAllOut.dfiPerYear = stakingPool.dfiPerYear + lmCompundPool.dfiPerYear + mnPool.dfiPerYear;
  }

  getReduction(iteration: number): number {
    let percent = 100;
    for (let i = 1; i <= iteration; i++) {

      percent = percent * this.reducePercent;
    }
    return percent / 100;
  }

  getTheme(): string {
    return localStorage.getItem('theme');
  }

  getAPRAverage(): number {

    const dfiInLm = this.getDfiCountLM();
    const dfiBtcPart = this.wallet?.dfiInBtcPool / dfiInLm;
    const dfiEthPart = this.wallet?.dfiInEthPool / dfiInLm;
    const dfiUsdcPart = this.wallet?.dfiInUsdcPool / dfiInLm;
    const dfiUsdtPart = this.wallet?.dfiInUsdtPool / dfiInLm;
    const dfiDogePart = this.wallet?.dfiInDogePool / dfiInLm;
    const dfiBchPart = this.wallet?.dfiInBchPool / dfiInLm;
    const dfiLtcPart = this.wallet?.dfiInLtcPool / dfiInLm;

    // Anteile berechnen je nachdem wie viel man in den Pools hat
    const average =
      ((dfiBtcPart * 100 * this.poolBtc?.apy) +
        (dfiEthPart * 100 * this.poolEth?.apy) +
        (dfiUsdcPart * 100 * this.poolUsdc?.apy) +
        (dfiBchPart * 100 * this.poolBch?.apy) +
        (dfiDogePart * 100 * this.poolDoge?.apy) +
        (dfiUsdtPart * 100 * this.poolUsdt?.apy) +
        (dfiLtcPart * 100 * this.poolLtc?.apy)) / 100;

    return Math.round(average * 100) / 100;
  }

  getDfiCountLM(): number {
    return this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool + this.wallet?.dfiInUsdcPool
      + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool + this.wallet?.dfiInBchPool;
  }
}
