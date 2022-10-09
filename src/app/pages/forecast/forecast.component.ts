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
import {ChartComponent} from 'ng-apexcharts';
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
  poolUsdcDusd!: Pool;

  @Input()
  poolBch!: Pool;

  @Input()
  poolUsdt!: Pool;

  @Input()
  poolUsdtDusd!: Pool;

  @Input()
  poolDoge!: Pool;

  @Input()
  poolLtc!: Pool;

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
  poolPypl!: Pool;

  @Input()
  poolBrkb!: Pool;

  @Input()
  poolKo!: Pool;

  @Input()
  poolPg!: Pool;

  @Input()
  poolSap!: Pool;

  @Input()
  poolUra!: Pool;

  @Input()
  poolCs!: Pool;

  @Input()
  poolGsg!: Pool;

  @Input()
  poolPplt!: Pool;

  @Input()
  poolGovt!: Pool;

  @Input()
  poolTan!: Pool;

  @Input()
  poolXom!: Pool;

  @Input()
  poolJnj!: Pool;

  @Input()
  poolAddyy!: Pool;

  @Input()
  poolGs!: Pool;

  @Input()
  poolDax!: Pool;

  @Input()
  poolWmt!: Pool;

  @Input()
  poolUl!: Pool;

  @Input()
  poolUng!: Pool;

  @Input()
  poolUso!: Pool;

  @Input()
  blockHeight!: number;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  wallet!: Wallet;

  @Input()
  apyCake!: number;

  @Input()
  aprMn!: number;

  @Input()
  adressesMasternodes!: Array<string>;

  @Input()
  adressesMasternodesFreezer5!: Array<string>;

  @Input()
  adressesMasternodesFreezer10!: Array<string>;

  average: number;

  averageMn: number;

  euonsHardforkeBlock = 894000;

  poolOuts = new Array<PoolAllOut>();

  poolCompoundAllOuts = new Array<PoolAllOut>();

  poolLmOuts = new Array<PoolAllOut>();

  poolLmCompoundOuts = new Array<PoolAllOut>();

  poolStakingOuts = new Array<PoolAllOut>();

  poolMnOuts = new Array<PoolAllOut>();

  poolMnCompoundOuts = new Array<PoolAllOut>();

  blocksPerCycle = 32690;

  poolOutcomeChartPos: Outcome;
  poolOutcomeCompoundChartPos: Outcome;
  poolStakingChartPos: Outcome;
  poolLMChartPos: Outcome;
  poolLMCompoundChartPos: Outcome;
  poolMnChartPos: Outcome;
  poolMnCompoundChartPos: Outcome;
  actualPoolIndex = 0;

  reinvestPeriod = 365;
  reinvestPeriodMn = 259200;

  lmApy = 0;

  lastCycleReinvestedDfiMn = 0;
  lastCycleReinvestedDfiLm = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.average = this.getAPRAverage();
    this.averageMn = this.getAprMnAverage();
    this.computeMasternodesReduce();
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.computeMasternodesReduce();
  }

  computeMasternodesReduce(): void {

    this.lastCycleReinvestedDfiMn = 0;
    this.lastCycleReinvestedDfiLm = 0;

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
    this.poolMnCompoundOuts = new Array<PoolAllOut>();

    for (let i = 0; i <= this.timeHorizonCycles; i++) {
      const poolAllOut = new PoolAllOut();
      const poolCompoundAllOut = new PoolAllOut();
      const poolStakingOut = new PoolAllOut();
      const poolLmOut = new PoolAllOut();
      const poolLmCompoundOut = new PoolAllOut();
      const poolMnOut = new PoolAllOut();
      const poolMnCompoundOut = new PoolAllOut();

      if (i === 0) {
        this.transformPool(poolAllOut, this.poolOut);
        this.transformPool(poolCompoundAllOut, poolAllOut);
        this.transformPool(poolStakingOut, this.stakingOut);
        this.transformPool(poolLmOut, this.lmOut);
        // Compound ist gleich mit dem LM zu Beginn
        this.transformPool(poolLmCompoundOut, poolLmOut);
        this.transformPool(poolMnOut, this.poolMasternodeOut);
        this.transformPool(poolMnCompoundOut, poolMnOut);
      } else {
        this.transformPoolReduced(poolAllOut, this.poolOuts, i);
        this.transformPoolReduced(poolStakingOut, this.poolStakingOuts, i);
        this.transformPoolReduced(poolLmOut, this.poolLmOuts, i);
        this.transformPoolReducedCompound(poolLmCompoundOut, this.poolLmCompoundOuts, i);
        this.transformPoolReduced(poolMnOut, this.poolMnOuts, i);
        this.transformPoolReducedCompoundMn(poolMnCompoundOut, this.poolMnOuts, i);
        this.transformPoolAllReducedCompound(poolCompoundAllOut, poolStakingOut, poolLmCompoundOut, poolMnCompoundOut);
      }

      this.poolOuts.push(poolAllOut);
      this.poolCompoundAllOuts.push(poolCompoundAllOut);
      this.poolLmOuts.push(poolLmOut);
      this.poolLmCompoundOuts.push(poolLmCompoundOut);
      this.poolMnOuts.push(poolMnOut);
      this.poolMnCompoundOuts.push(poolMnCompoundOut);
      this.poolStakingOuts.push(poolStakingOut);
    }

    this.poolOutcomeChartPos = this.poolOuts[0];
    this.poolOutcomeCompoundChartPos = this.poolCompoundAllOuts[0];
    this.poolStakingChartPos = this.poolStakingOuts[0];
    this.poolLMChartPos = this.poolLmOuts[0];
    this.poolLMCompoundChartPos = this.poolLmCompoundOuts[0];
    this.poolMnChartPos = this.poolMnOuts[0];
    this.poolMnCompoundChartPos = this.poolMnCompoundOuts[0];
  }

  buildChart(): void {
    this.chartOptions = {
      series: this.getSeries(),
      chart: {
        type: 'line',
        background: 'transparent',
        height: 550,
        events: {
          mouseMove: (function(event, chartContext, config): void {
            if (this.poolOuts?.length > 0 && config?.dataPointIndex > -1 && this.actualPoolIndex !== config?.dataPointIndex) {
              this.poolOutcomeChartPos = this.poolOuts[config.dataPointIndex];
              this.poolOutcomeCompoundChartPos = this.poolCompoundAllOuts[config.dataPointIndex];
              this.poolStakingChartPos = this.poolStakingOuts[config.dataPointIndex];
              this.poolLMChartPos = this.poolLmOuts[config.dataPointIndex];
              this.poolLMCompoundChartPos = this.poolLmCompoundOuts[config.dataPointIndex];
              this.poolMnChartPos = this.poolMnOuts[config.dataPointIndex];
              this.poolMnCompoundChartPos = this.poolMnCompoundOuts[config.dataPointIndex];
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
        curve: 'straight',
        width: 3
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
    if (this.poolMasternodeOut?.dfiPerMonth > 0) {
      const mnC = new Series();
      mnC.name = 'Masternode Compound';
      mnC.data = this.getMNCompoundData();
      series.push(mnC);
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

  getMNCompoundData(): Array<number> {
    const result = new Array<number>();
    this.poolMnCompoundOuts.forEach((p) =>
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
    const options = {year: 'numeric', month: 'numeric', day: 'numeric'} as const;
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
    const newReinvestDFIActualCycle = this.getReinvestDFI(inputPool[i - 1], i, this.reinvestPeriod);
    const oldCyclesDFIReinvest = this.lastCycleReinvestedDfiLm;
    const newAndOld = newReinvestDFIActualCycle + oldCyclesDFIReinvest;
    this.lastCycleReinvestedDfiLm = newAndOld;
    const dfiiInLm = this.getDfiCountLM() * 2 + newAndOld;

    const reduction = this.getReduction(i);
    this.lmApy = Math.pow(1 + (this.average * reduction / 100 / this.reinvestPeriod), this.reinvestPeriod) - 1;

    poolAllOut.dfiPerDay = (dfiiInLm * Math.pow(1 + this.lmApy, 1 / 365) - dfiiInLm);
    poolAllOut.dfiPerMin = (dfiiInLm * Math.pow(1 + this.lmApy, 1 / 525600) - dfiiInLm);
    poolAllOut.dfiPerHour = (dfiiInLm * Math.pow(1 + this.lmApy, 1 / 8760) - dfiiInLm);
    poolAllOut.dfiPerMonth = (dfiiInLm * Math.pow(1 + this.lmApy, 1 / 12) - dfiiInLm);
    poolAllOut.dfiPerWeek = (dfiiInLm * Math.pow(1 + this.lmApy, 1 / 52) - dfiiInLm);
    poolAllOut.dfiPerYear = dfiiInLm * this.lmApy;

  }

  transformPoolReducedCompoundMn(
    poolAllOut: PoolAllOut,
    inputPool: Array<PoolAllOut>,
    i: number
  ): void {
    const mnApy = this.apyCake / 100 * this.reducePercent;
    const oldCyclesDFIReinvest = this.lastCycleReinvestedDfiMn;
    const reinvestDFI = this.getReinvestDFIMn(inputPool[i - 1], oldCyclesDFIReinvest, i, mnApy);
    this.lastCycleReinvestedDfiMn = reinvestDFI;

    const poolReinvest = new PoolAllOut();
    poolReinvest.dfiPerMin = reinvestDFI * Math.pow(1 + mnApy, 1 / 525600) - reinvestDFI;
    poolReinvest.dfiPerHour = reinvestDFI * Math.pow(1 + mnApy, 1 / 8760) - reinvestDFI;
    poolReinvest.dfiPerDay = reinvestDFI * Math.pow(1 + mnApy, 1 / 365) - reinvestDFI;
    poolReinvest.dfiPerWeek = reinvestDFI * Math.pow(1 + mnApy, 1 / 52) - reinvestDFI;
    poolReinvest.dfiPerMonth = reinvestDFI * Math.pow(1 + mnApy, 1 / 12) - reinvestDFI;
    poolReinvest.dfiPerYear = reinvestDFI * Math.pow(1 + mnApy, 1) - reinvestDFI;

    poolAllOut.dfiPerDay = (inputPool[i - 1]?.dfiPerDay + poolReinvest.dfiPerDay);
    poolAllOut.dfiPerMin = (inputPool[i - 1]?.dfiPerMin + poolReinvest.dfiPerMin);
    poolAllOut.dfiPerHour = (inputPool[i - 1]?.dfiPerHour + poolReinvest.dfiPerHour);
    poolAllOut.dfiPerMonth = (inputPool[i - 1]?.dfiPerMonth + poolReinvest.dfiPerMonth);
    poolAllOut.dfiPerWeek = (inputPool[i - 1]?.dfiPerWeek + poolReinvest.dfiPerWeek);
    poolAllOut.dfiPerYear = (inputPool[i - 1]?.dfiPerYear + poolReinvest.dfiPerYear);
  }

  getPreviousReinvests(i: number, dfiList: Array<number>): number {
    return i > 1 ? dfiList[i - 2] : 0;
  }

  getReinvestDFIMn(inputPool: PoolAllOut, previousReinvest: number,  i: number, mnApy: number): number {
    if (inputPool) {
      let dfiToReinvest = previousReinvest;
      let reinvestPeriodTimes = 0;
      const reinvestReward = inputPool.dfiPerDay * 3;
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        reinvestPeriodTimes = Math.round(blocks * this.bs / this.reinvestPeriodMn);
      } else {
        reinvestPeriodTimes = Math.round(this.blocksPerCycle * this.bs / this.reinvestPeriodMn);
      }
      for (let j = 0; j < reinvestPeriodTimes; j++) {
        dfiToReinvest = (dfiToReinvest + reinvestReward) * Math.pow(1 + mnApy, 1 / 122);
      }
      return dfiToReinvest;
    } else {
      return 0;
    }
  }


  getReinvestDFI(inputPool: PoolAllOut, i: number, reinvestPeriod: number): number {
    if (inputPool && reinvestPeriod === 365) {
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        const daysForReinvest = Math.round(blocks * this.bs / 86400);
        return inputPool.dfiPerDay * daysForReinvest;
      } else {
        const daysForReinvest = Math.round(this.blocksPerCycle * this.bs / 86400);
        return inputPool.dfiPerDay * daysForReinvest;
      }
    } else if (inputPool && reinvestPeriod === 52) {
      if (i === 1) {
        const blocks = 32690 - (this.blockHeight - this.euonsHardforkeBlock) % 32690;
        const weeksForInvest = Math.round(blocks * this.bs / 604800 * 10) / 10;
        return inputPool.dfiPerWeek * weeksForInvest;
      } else {
        const weeksForInvest = Math.round(this.blocksPerCycle * this.bs / 604800 * 10) / 10;
        return inputPool.dfiPerWeek * weeksForInvest;
      }
    } else if (inputPool && reinvestPeriod === 12) {
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
    const dfiUsdcDusdPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.dusdInUsdcDusdPool) / dfiInLm;
    const dfiUsdtDusdPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.dusdInUsdtDusdPool) / dfiInLm;
    const dfiDogePart = this.wallet?.dfiInDogePool / dfiInLm;
    const dfiBchPart = this.wallet?.dfiInBchPool / dfiInLm;
    const dfiLtcPart = this.wallet?.dfiInLtcPool / dfiInLm;
    const dfiUsdPart = this.wallet?.dfiInUsdPool / dfiInLm;

    const dfiTslaPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInTslaPool) / dfiInLm;
    const dfiQqqPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInQqqPool) / dfiInLm;
    const dfiSpyPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSpyPool) / dfiInLm;
    const dfiPltrPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPltrPool) / dfiInLm;
    const dfiSlvPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSlvPool) / dfiInLm;
    const dfiAaplPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAaplPool) / dfiInLm;
    const dfiGldPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGldPool) / dfiInLm;
    const dfiGmePart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGmePool) / dfiInLm;
    const dfiGooglPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGooglPool) / dfiInLm;
    const dfiArkkPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInArkkPool) / dfiInLm;
    const dfiBabaPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInBabaPool) / dfiInLm;
    const dfiVnqPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInVnqPool) / dfiInLm;
    const dfiUrthPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUrthPool) / dfiInLm;
    const dfiTltPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInTltPool) / dfiInLm;
    const dfiPdbcPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPdbcPool) / dfiInLm;
    const dfiAmznPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAmznPool) / dfiInLm;
    const dfiNvdaPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInNvdaPool) / dfiInLm;
    const dfiCoinPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInCoinPool) / dfiInLm;
    const dfiEemPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInEemPool) / dfiInLm;
    const dfiMsftPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMsftPool) / dfiInLm;
    const dfiNflxPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInNflxPool) / dfiInLm;
    const dfiFbPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInFbPool) / dfiInLm;
    const dfiVooPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInVooPool) / dfiInLm;
    const dfiDisPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInDisPool) / dfiInLm;
    const dfiMchiPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMchiPool) / dfiInLm;
    const dfiMstrPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMstrPool) / dfiInLm;
    const dfiIntcPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInIntcPool) / dfiInLm;
    const dfiPyplPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPyplPool) / dfiInLm;
    const dfiBrkbPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInBrkbPool) / dfiInLm;
    const dfiKoPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInKoPool) / dfiInLm;
    const dfiPgPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPgPool) / dfiInLm;
    const dfiSapPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSapPool) / dfiInLm;
    const dfiUraPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUraPool) / dfiInLm;
    const dfiCsPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInCsPool) / dfiInLm;
    const dfiGsgPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGsgPool) / dfiInLm;
    const dfiPpltPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPpltPool) / dfiInLm;
    const dfiTanPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGovtPool) / dfiInLm;
    const dfiXomPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInTanPool) / dfiInLm;
    const dfiGovtPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInXomPool) / dfiInLm;

    const dfiJnjPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInJnjPool) / dfiInLm;
    const dfiAddyyPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAddyyPool) / dfiInLm;
    const dfiGsPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGsPool) / dfiInLm;
    const dfiDaxPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInDaxPool) / dfiInLm;

    const dfiWmtPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInWmtPool) / dfiInLm;
    const dfiUlPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUlPool) / dfiInLm;
    const dfiUngPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUngPool) / dfiInLm;
    const dfiUsoPart = this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUsoPool) / dfiInLm;

    // Anteile berechnen je nachdem wie viel man in den Pools hat
    const average =
      ((dfiBtcPart * 100 * this.poolBtc?.apr) +
        (dfiEthPart * 100 * this.poolEth?.apr) +
        (dfiUsdcPart * 100 * this.poolUsdc?.apr) +
        (dfiUsdcDusdPart * 100 * this.poolUsdcDusd?.apr) +
        (dfiBchPart * 100 * this.poolBch?.apr) +
        (dfiDogePart * 100 * this.poolDoge?.apr) +
        (dfiUsdtPart * 100 * this.poolUsdt?.apr) +
        (dfiUsdtDusdPart * 100 * this.poolUsdtDusd?.apr) +
        (dfiLtcPart * 100 * this.poolLtc?.apr) +
        (dfiUsdPart * 100 * this.poolUsd?.apr) +
        (dfiTslaPart * 100 * this.poolTsla?.apr) +
        (dfiQqqPart * 100 * this.poolQqq?.apr) +
        (dfiSpyPart * 100 * this.poolSpy?.apr) +
        (dfiPltrPart * 100 * this.poolPltr?.apr) +
        (dfiSlvPart * 100 * this.poolSlv?.apr) +
        (dfiAaplPart * 100 * this.poolAapl?.apr) +
        (dfiGldPart * 100 * this.poolGld?.apr) +
        (dfiGmePart * 100 * this.poolGme?.apr) +
        (dfiGooglPart * 100 * this.poolGoogl?.apr) +
        (dfiArkkPart * 100 * this.poolArkk?.apr) +
        (dfiBabaPart * 100 * this.poolBaba?.apr) +
        (dfiVnqPart * 100 * this.poolVnq?.apr) +
        (dfiUrthPart * 100 * this.poolUrth?.apr) +
        (dfiTltPart * 100 * this.poolTlt?.apr) +
        (dfiPdbcPart * 100 * this.poolPdbc?.apr) +
        (dfiAmznPart * 100 * this.poolAmzn?.apr) +
        (dfiNvdaPart * 100 * this.poolNvda?.apr) +
        (dfiCoinPart * 100 * this.poolCoin?.apr) +
        (dfiEemPart * 100 * this.poolEem?.apr) +
        (dfiMsftPart * 100 * this.poolMsft?.apr) +
        (dfiNflxPart * 100 * this.poolNflx?.apr) +
        (dfiFbPart * 100 * this.poolFb?.apr) +
        (dfiVooPart * 100 * this.poolVoo?.apr) +
        (dfiDisPart * 100 * this.poolDis?.apr) +
        (dfiMchiPart * 100 * this.poolMchi?.apr) +
        (dfiMstrPart * 100 * this.poolMstr?.apr) +
        (dfiIntcPart * 100 * this.poolIntc?.apr) +
        (dfiPyplPart * 100 * this.poolPypl?.apr) +
        (dfiBrkbPart * 100 * this.poolBrkb?.apr) +
        (dfiKoPart * 100 * this.poolKo?.apr) +
        (dfiPgPart * 100 * this.poolPg?.apr) +
        (dfiSapPart * 100 * this.poolSap?.apr) +
        (dfiUraPart * 100 * this.poolUra?.apr) +
        (dfiCsPart * 100 * this.poolCs?.apr) +
        (dfiGsgPart * 100 * this.poolGsg?.apr) +
        (dfiPpltPart * 100 * this.poolPplt?.apr) +
        (dfiGovtPart * 100 * this.poolGovt?.apr) +
        (dfiTanPart * 100 * this.poolTan?.apr) +
        (dfiXomPart * 100 * this.poolXom?.apr) +
        (dfiJnjPart * 100 * this.poolJnj?.apr) +
        (dfiAddyyPart * 100 * this.poolAddyy?.apr) +
        (dfiGsPart * 100 * this.poolGs?.apr) +
        (dfiDaxPart * 100 * this.poolDax?.apr) +
        (dfiWmtPart * 100 * this.poolWmt?.apr) +
        (dfiUlPart * 100 * this.poolUl?.apr) +
        (dfiUngPart * 100 * this.poolUng?.apr) +
        (dfiUsoPart * 100 * this.poolUso?.apr)
      ) / 100;

    return Math.round(average * 100) / 100;
  }

  getAprMnAverage(): number {
    const normalMns = this.adressesMasternodes?.length - (this.adressesMasternodesFreezer5?.length
      + this.adressesMasternodesFreezer10?.length);
    const mns = normalMns + this.adressesMasternodesFreezer5?.length + this.adressesMasternodesFreezer10?.length;

    const aprs = normalMns * this.aprMn
      + this.adressesMasternodesFreezer5?.length * this.aprMn * 1.5
      + this.adressesMasternodesFreezer10?.length * this.aprMn * 2;

    return aprs / mns;
  }

  getDfiCountLM(): number {
    return this.wallet?.dfiInEthPool + this.wallet?.dfiInBtcPool + this.wallet?.dfiInUsdtPool + this.wallet?.dfiInUsdcPool
      + this.wallet?.dfiInLtcPool + this.wallet?.dfiInDogePool + this.wallet?.dfiInBchPool + this.wallet?.dfiInUsdPool
      + this.getDfiEqOfUsdPartOfPool(this.wallet.dusdInUsdcDusdPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.dusdInUsdtDusdPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet.usdInTslaPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInQqqPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSpyPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPltrPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSlvPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAaplPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGldPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGmePool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGooglPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInArkkPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInBabaPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInVnqPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUrthPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInTltPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPdbcPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAmznPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInNvdaPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInCoinPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInEemPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMsftPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInNflxPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInFbPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInVooPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInDisPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMchiPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInMstrPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInIntcPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPyplPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInBrkbPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInKoPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPgPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInSapPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUraPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInCsPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGsgPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInPpltPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGovtPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInTanPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInXomPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInJnjPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInAddyyPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInGsPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInDaxPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInWmtPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUlPool)
      + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUngPool) + this.getDfiEqOfUsdPartOfPool(this.wallet?.usdInUsoPool);
  }

  getUsdPriceOfDfiInDFIUSDPool(): number {
    return this.poolUsd?.totalLiquidityUsd / 2 / +this.poolUsd?.reserveB;
  }

  getDfiEqOfUsdPartOfPool(usd: number): number {
    return usd / this.getUsdPriceOfDfiInDFIUSDPool();
  }

  getDfiCountMn(): number {
    return this.adressesMasternodes?.length * 20000 + this.adressesMasternodesFreezer5?.length * 20000
      + this.adressesMasternodesFreezer10?.length * 20000;
  }
}
