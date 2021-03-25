import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-staking-target-calculator',
  templateUrl: './staking-target-calculator.component.html',
  styleUrls: ['./staking-target-calculator.component.css']
})
export class StakingTargetCalculatorComponent implements OnInit {

  // staking target return
  stakingNeededForAimReturnMin = 0;
  aimReturnMin = 0;

  stakingNeededForAimReturnHour = 0;
  aimReturnHour = 0;

  stakingNeededForAimReturnDay = 0;
  aimReturnDay = 0;

  stakingNeededForAimReturnMonth = 0;
  aimReturnMonth = 0;

  @Input()
  stakingApy: number;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeAimReturnDay(newValue): void {
    const apyPerDay = Math.pow(1 + this.stakingApy / 100, 1 / 365) - 1;
    this.stakingNeededForAimReturnDay = newValue / apyPerDay * (100 + apyPerDay) * (1 / (1 + apyPerDay / 100)) / 100;
  }

  onChangeAimReturnHour(newValue): void {
    const apyPerHour = Math.pow(1 + this.stakingApy / 100, 1 / 8760) - 1;
    this.stakingNeededForAimReturnHour = newValue / apyPerHour * (100 + apyPerHour) * (1 / (1 + apyPerHour / 100)) / 100;
  }

  onChangeAimReturnMin(newValue): void {
    const apyPerMin = Math.pow(1 + this.stakingApy / 100, 1 / 525600) - 1;
    this.stakingNeededForAimReturnMin = newValue / apyPerMin * (100 + apyPerMin) * (1 / (1 + apyPerMin / 100)) / 100;
  }

  onChangeAimReturnMonth(newValue): void {
    const apyPermonth = Math.pow(1 + this.stakingApy / 100, 1 / 12) - 1;
    this.stakingNeededForAimReturnMonth = newValue / apyPermonth * (100 + apyPermonth) * (1 / (1 + apyPermonth / 100)) / 100;
  }

}
