import {Component, Input, OnInit} from '@angular/core';
import {Pool} from '@interfaces/Dex';

@Component({
  selector: 'app-lm-target-calculator',
  templateUrl: './lm-target-calculator.component.html',
  styleUrls: ['./lm-target-calculator.component.css']
})
export class LmTargetCalculatorComponent implements OnInit {

  @Input()
  pools: Pool [];

  @Input()
  blocktimeInS;

  @Input()
  poolBtc: Pool;

  poolSelected = 'BTC-DFI'
  pool: Pool;

  poolLmCalculationTargetReturn = 'BTC';
  dfiNeededForAimReturnMinPool = 0;
  btcNeededForAimReturnMinPool = 0;
  anteilNeededForAimReturnMinPool = 0;
  aimReturnMinPool = 0;
  targetReturnLMMin = 0;

  dfiNeededForAimReturnHourPool = 0;
  btcNeededForAimReturnHourPool = 0;
  anteilNeededForAimReturnHourPool = 0;
  aimReturnHourPool = 0;
  targetReturnLMHour = 0;

  dfiNeededForAimReturnDayPool = 0;
  btcNeededForAimReturnDayPool = 0;
  anteilNeededForAimReturnDayPool = 0;
  aimReturnDayPool = 0;
  targetReturnLMDay = 0;

  dfiNeededForAimReturnMonthPool = 0;
  btcNeededForAimReturnMonthPool = 0;
  anteilNeededForAimReturnMonthPool = 0;
  aimReturnMonthPool = 0;
  targetReturnLMMonth = 0;


  constructor() {
  }

  ngOnInit(): void {
  }

  onChangeLmCalculationTargetPool(newValue: string): void {
    this.poolLmCalculationTargetReturn = newValue.split("-")[0];
    this.poolSelected = newValue;
    this.pool = this.getCorrectPoolAndReward();
    this.onChangeAimReturnMinPool(this.targetReturnLMMin);
    this.onChangeAimReturnHourPool(this.targetReturnLMHour);
    this.onChangeAimReturnDayPool(this.targetReturnLMDay);
    this.onChangeAimReturnMonthPool(this.targetReturnLMMonth);
  }

  onChangeAimReturnMinPool(newValue): void {
    this.targetReturnLMMin = newValue;
    this.pool = this.getCorrectPoolAndReward();
    this.anteilNeededForAimReturnMinPool = newValue * 100 / this.getDfiPerMin(this.pool);
    this.dfiNeededForAimReturnMinPool = +this.pool.reserveB * this.anteilNeededForAimReturnMinPool / 100;
    this.btcNeededForAimReturnMinPool = +this.pool.reserveA * this.anteilNeededForAimReturnMinPool / 100;
  }


  onChangeAimReturnHourPool(newValue): void {
    this.targetReturnLMHour = newValue;
    this.pool = this.getCorrectPoolAndReward();
    this.anteilNeededForAimReturnHourPool = newValue / 60 * 100 / this.getDfiPerMin(this.pool);
    this.dfiNeededForAimReturnHourPool = +this.pool.reserveB * this.anteilNeededForAimReturnHourPool / 100;
    this.btcNeededForAimReturnHourPool = +this.pool.reserveA * this.anteilNeededForAimReturnHourPool / 100;
  }

  onChangeAimReturnDayPool(newValue): void {
    this.targetReturnLMDay = newValue;
    this.pool = this.getCorrectPoolAndReward();
    this.anteilNeededForAimReturnDayPool = newValue / 60 / 24 * 100 / this.getDfiPerMin(this.pool);
    this.dfiNeededForAimReturnDayPool = +this.pool.reserveB * this.anteilNeededForAimReturnDayPool / 100;
    this.btcNeededForAimReturnDayPool = +this.pool.reserveA * this.anteilNeededForAimReturnDayPool / 100;
  }

  onChangeAimReturnMonthPool(newValue): void {
    this.targetReturnLMMonth = newValue;
    this.pool = this.getCorrectPoolAndReward();
    this.anteilNeededForAimReturnMonthPool = newValue / 60 / 24 / 30 * 100 / this.getDfiPerMin(this.pool);
    this.dfiNeededForAimReturnMonthPool = +this.pool.reserveB * this.anteilNeededForAimReturnMonthPool / 100;
    this.btcNeededForAimReturnMonthPool = +this.pool.reserveA * this.anteilNeededForAimReturnMonthPool / 100;
  }

  getToken(): Array<Pool> {

    const tokens =  [];

    this.pools?.filter(a => !a.symbol.includes('v1')).forEach(element => {
      tokens.push(element.symbol);
    });

    return tokens;
  }

  private getCorrectPoolAndReward(): Pool {
    return this.pools.find(pool => pool.symbol === this.poolSelected);
  }

  isCrypto(): boolean {
    return this.poolLmCalculationTargetReturn === 'BTC' || this.poolLmCalculationTargetReturn === 'ETH'
      || this.poolLmCalculationTargetReturn === 'LTC' || this.poolLmCalculationTargetReturn === 'DOGE'
      || this.poolLmCalculationTargetReturn === 'BCH' || this.poolLmCalculationTargetReturn === 'USDT'
      || this.poolLmCalculationTargetReturn === 'USDC' || this.poolLmCalculationTargetReturn === 'DUSD'
      || this.poolLmCalculationTargetReturn === 'SOL' || this.poolLmCalculationTargetReturn === 'DOT'
      || this.poolLmCalculationTargetReturn === 'MATIC' || this.poolLmCalculationTargetReturn === 'SUI'
      || this.poolSelected === 'EUROC-DFI' || this.poolSelected === 'XCHF-DFI';
  }

  private getDfiPerMin(pool: Pool): number {
    const dfiPerYearInPool = pool.totalLiquidityUsd * pool.apr / 100 / this.poolBtc.priceB;
    const dfiPerMin = dfiPerYearInPool / 525600;
    return dfiPerMin;
  }

}
