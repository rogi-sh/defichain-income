import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MasternodeOutcome, Outcome, OutcomeStaking, PoolAllOut} from '@interfaces/Dex';
import {ChartComponent} from 'ng-apexcharts';
import {ChartOptions5} from '@interfaces/Data';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html'
})
export class ForecastComponent implements OnInit, OnChanges {

  @ViewChild('chartForecast') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions5>;

  reducePercent = (100 - 1.658) / 100;

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

  poolOuts =  new Array<PoolAllOut>();

  poolLmOuts =  new Array<PoolAllOut>();

  poolStakingOuts =  new Array<PoolAllOut>();

  poolMnOuts =  new Array<PoolAllOut>();

  blocksPerCycle = 32690;

  constructor() { }

  ngOnInit(): void {
    this.computeMasternodesReduce();
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.computeMasternodesReduce();
  }

  computeMasternodesReduce(): void {

    console.log('Forecast start ' + JSON.stringify(this.poolOut));

    if (this.poolOut === undefined || this.poolOut.dfiPerDay === undefined) {
      return;
    }

    for (let i = 0; i <= 360; i++) {

      let poolAllOut = new PoolAllOut();
      let poolStakingOut = new PoolAllOut();
      let poolLmOut = new PoolAllOut();
      let poolMnOut = new PoolAllOut();


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

  }

  buildChart(): void {

    this.chartOptions = {
      series: [
        {
          name: 'Staking',
          data: this.getStakingData()
        },
        {
          name: 'LM',
          data: this.getLMData()
        },
        {
          name: 'Masternode',
          data: this.getMNData()
        },
        {
          name: 'All',
          data: this.getAllData()
        }
      ],
      chart: {
        height: 350,
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories: this.getCat()
      }
    };

  }

  getStakingData(): Array<number> {
    let result = new Array<number>();
    this.poolStakingOuts.forEach(p => result.push(p.dfiPerMonth));
    return result;
  }

  getLMData(): Array<number> {
    let result = new Array<number>();
    this.poolLmOuts.forEach(p => result.push(p.dfiPerMonth));
    return result;
  }

  getMNData(): Array<number> {
    let result = new Array<number>();
    this.poolMnOuts.forEach(p => result.push(p.dfiPerMonth));
    return result;
  }

  getAllData(): Array<number> {
    let result = new Array<number>();
    this.poolOuts.forEach(p => result.push(p.dfiPerMonth));
    return result;
  }

  getCat(): Array<string> {
    let result = new Array<string>();
    let data = new Date(2021, 6, 3);
    for (let i = 0; i <= 360; i++) {
      result.push(i + ' : ' + data);
      data = new Date(data.getTime() + this.blocksPerCycle * this.bs * 1000);
    }
    return result;
  }

  transformPool(poolAllOut: PoolAllOut, poolInput: Outcome): void {
    poolAllOut.dfiPerDay = poolInput.dfiPerDay;
    poolAllOut.dfiPerMin = poolInput.dfiPerMin;
    poolAllOut.dfiPerHour = poolInput.dfiPerHour;
    poolAllOut.dfiPerMonth = poolInput.dfiPerMonth;
    poolAllOut.dfiPerYear = poolInput.dfiPerYear;
  }

  transformPoolReduced(poolAllOut: PoolAllOut, inputPool: Array<PoolAllOut>, i: number): void {
    poolAllOut.dfiPerDay = inputPool[i - 1].dfiPerDay * this.reducePercent;
    poolAllOut.dfiPerMin = inputPool[i - 1].dfiPerMin * this.reducePercent;
    poolAllOut.dfiPerHour = inputPool[i - 1].dfiPerHour * this.reducePercent;
    poolAllOut.dfiPerMonth = inputPool[i - 1].dfiPerMonth * this.reducePercent;
    poolAllOut.dfiPerYear = inputPool[i - 1].dfiPerYear * this.reducePercent;
  }


}
