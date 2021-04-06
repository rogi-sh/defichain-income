import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';

import { Pool } from '@interfaces/Dex';
import { ChartOptions4, StakingCalc, StakingCalcMN, StakingCalcNormal } from '@interfaces/Data';

@Component({
  selector: 'app-apy-calculator',
  templateUrl: './apy-calculator.component.html',
  styleUrls: ['./apy-calculator.component.css']
})
export class ApyCalculatorComponent implements OnInit {

  stakingCalcOut: StakingCalc = new StakingCalc();
  stakingCalcNormal: StakingCalcNormal = new StakingCalcNormal();
  stakingCalcMN: StakingCalcMN = new StakingCalcMN();

  @ViewChild('chart4') chart4: ChartComponent;
  public chartOptions4: Partial<ChartOptions4>;

  @Input()
  stakingApyCake: number;

  @Input()
  stakingApyMN: number;

  @Input()
  poolBtc: Pool;

  @Input()
  fiat: string;

  @Input()
  usdToEur: number;

  @Input()
  usdToChf: number;

  @Input()
  usdToGbp: number;

  constructor() { }

  ngOnInit (): void {

    this.calcStakingOutCome();
  }

  calcStakingOutCome (): void {

    // Calc
    this.stakingCalcOut.dfiPerDay = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingCalcOut.apy / 100, 1 / 365)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcOut.dfiPerHour = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingCalcOut.apy / 100, 1 / 8760)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcOut.dfiPerMin = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingCalcOut.apy / 100, 1 / 525600)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcOut.dfiPerWeek = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingCalcOut.apy / 100, 1 / 52.1429)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcOut.dfiPerMonth = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingCalcOut.apy / 100, 1 / 12)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcOut.dfiPerYear = this.stakingCalcOut.dfiAmount * (1 + this.stakingCalcOut.apy / 100) - this.stakingCalcOut.dfiAmount;

    // normal
    this.stakingCalcNormal.dfiPerDay = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyCake / 100, 1 / 365)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcNormal.dfiPerHour = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyCake / 100, 1 / 8760)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcNormal.dfiPerMin = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyCake / 100, 1 / 525600)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcNormal.dfiPerWeek = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyCake / 100, 1 / 52.1429)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcNormal.dfiPerMonth = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyCake / 100, 1 / 12)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcNormal.dfiPerYear = this.stakingCalcOut.dfiAmount * (1 + this.stakingApyCake / 100) - this.stakingCalcOut.dfiAmount;


    // mn
    this.stakingCalcMN.dfiPerDay = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyMN / 100, 1 / 365)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcMN.dfiPerHour = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyMN / 100, 1 / 8760)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcMN.dfiPerMin = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyMN / 100, 1 / 525600)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcMN.dfiPerWeek = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyMN / 100, 1 / 52.1429)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcMN.dfiPerMonth = this.stakingCalcOut.dfiAmount * Math.pow(1 + this.stakingApyMN / 100, 1 / 12)
      - this.stakingCalcOut.dfiAmount;
    this.stakingCalcMN.dfiPerYear = this.stakingCalcOut.dfiAmount * (1 + this.stakingApyMN / 100) - this.stakingCalcOut.dfiAmount;

    this.buildDataForChartCalcStaking('Month');
  }

  getDfiCountStakingCalcUsd (): number {
    return this.stakingCalcOut.dfiAmount * this.poolBtc?.priceB;
  }

  buildDataForChartCalcStaking (type: string): void {
    const key = `dfiPer${ type }`
    const normal = this.stakingCalcNormal[key];
    const mn = this.stakingCalcMN[key];
    const calc = this.stakingCalcOut[key];

    console.log(calc, mn, normal)
    const array = [+normal.toFixed(2), +mn.toFixed(2), +calc.toFixed(2)];
    const max = Math.max(+normal.toFixed(2), +mn.toFixed(2), +calc.toFixed(2));

    this.chartOptions4 = {
      series: [+(normal / max * 100).toFixed(2), +(mn / max * 100).toFixed(2), +(calc / max * 100).toFixed(2)],
      chart: {
        height: 390,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 280,
          hollow: {
            margin: 5,
            size: '40%',
            background: 'transparent',
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: true
            }
          }
        }
      },
      colors: ['#FF00AF', '#BD1087', '#1AB7EA'],
      labels: ['Normal', 'Masternode', 'Calc'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        // tslint:disable-next-line:only-arrow-functions
        formatter (seriesName, opts): string {
          return seriesName + ':  ' + array[opts.seriesIndex] + ' DFI';
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: true
            }
          }
        }
      ]
    };
  }

}
