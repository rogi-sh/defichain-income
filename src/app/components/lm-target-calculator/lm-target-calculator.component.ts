import {Component, Input, OnInit} from '@angular/core';
import {Pool} from '@interfaces/Dex';

@Component({
  selector: 'app-lm-target-calculator',
  templateUrl: './lm-target-calculator.component.html',
  styleUrls: ['./lm-target-calculator.component.css']
})
export class LmTargetCalculatorComponent implements OnInit {

  @Input()
  poolBtc: Pool;

  @Input()
  poolEth: Pool;

  @Input()
  poolUsdt: Pool;

  @Input()
  poolUsdc: Pool;

  @Input()
  poolUsdtDusd: Pool;

  @Input()
  poolUsdcDusd: Pool;

  @Input()
  poolLtc: Pool;

  @Input()
  poolDoge: Pool;

  @Input()
  poolBch: Pool;

  @Input()
  poolUsd: Pool;

  @Input()
  poolTsla: Pool;

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
  dfiProBlockBtc;

  @Input()
  dfiProBlockEth;

  @Input()
  dfiProBlockUsdt;

  @Input()
  dfiProBlockUsdc;

  @Input()
  dfiProBlockUsdtDusd;

  @Input()
  dfiProBlockUsdcDusd;

  @Input()
  dfiProBlockLtc;

  @Input()
  dfiProBlockDoge;

  @Input()
  dfiProBlockBch;

  @Input()
  dfiProBlockUsd;

  @Input()
  dfiProBlockTsla;

  @Input()
  dfiProBlockQqq;

  @Input()
  dfiProBlockSpy;

  @Input()
  dfiProBlockPltr;

  @Input()
  dfiProBlockSlv;

  @Input()
  dfiProBlockAapl;

  @Input()
  dfiProBlockGld;

  @Input()
  dfiProBlockGme;

  @Input()
  dfiProBlockGoogl;

  @Input()
  dfiProBlockArkk;

  @Input()
  dfiProBlockBaba;

  @Input()
  dfiProBlockVnq;

  @Input()
  dfiProBlockUrth;

  @Input()
  dfiProBlockTlt;

  @Input()
  dfiProBlockPdbc;

  @Input()
  dfiProBlockAmzn;

  @Input()
  dfiProBlockNvda;

  @Input()
  dfiProBlockCoin;

  @Input()
  dfiProBlockEem;

  @Input()
  dfiProBlockMsft;

  @Input()
  dfiProBlockNflx;

  @Input()
  dfiProBlockFb;

  @Input()
  dfiProBlockVoo;

  @Input()
  dfiProBlockDis;

  @Input()
  dfiProBlockMchi;

  @Input()
  dfiProBlockMstr;

  @Input()
  dfiProBlockIntc;

  @Input()
  dfiProBlockPypl;

  @Input()
  dfiProBlockBrkb;

  @Input()
  dfiProBlockKo;

  @Input()
  dfiProBlockPg;

  @Input()
  dfiProBlockSap;

  @Input()
  dfiProBlockUra;

  @Input()
  dfiProBlockCs;

  @Input()
  dfiProBlockGsg;

  @Input()
  dfiProBlockPplt;

  @Input()
  dfiProBlockGovt;

  @Input()
  dfiProBlockTan;

  @Input()
  dfiProBlockXom;

  @Input()
  blocktimeInS;

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

  pool: Pool;

  constructor() { }

  ngOnInit(): void {
    this.pool = this.poolBtc;
  }

  onChangeLmCalculationTargetPool(newValue: string): void {
    this.poolLmCalculationTargetReturn = newValue;
    this.onChangeAimReturnMinPool(this.targetReturnLMMin);
    this.onChangeAimReturnHourPool(this.targetReturnLMHour);
    this.onChangeAimReturnDayPool(this.targetReturnLMDay);
    this.onChangeAimReturnMonthPool(this.targetReturnLMMonth);
  }

  onChangeAimReturnMinPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMMin = newValue;
    this.anteilNeededForAimReturnMinPool = newValue * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnMinPool = +pool.reserveB * this.anteilNeededForAimReturnMinPool / 100;
    this.btcNeededForAimReturnMinPool = +pool.reserveA * this.anteilNeededForAimReturnMinPool / 100;
  }


  onChangeAimReturnHourPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMHour = newValue;
    this.anteilNeededForAimReturnHourPool = newValue / 60 * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnHourPool = +pool.reserveB * this.anteilNeededForAimReturnHourPool / 100;
    this.btcNeededForAimReturnHourPool = +pool.reserveA * this.anteilNeededForAimReturnHourPool / 100;
  }

  onChangeAimReturnDayPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMDay = newValue;
    this.anteilNeededForAimReturnDayPool = newValue / 60 / 24 * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnDayPool = +pool.reserveB * this.anteilNeededForAimReturnDayPool / 100;
    this.btcNeededForAimReturnDayPool = +pool.reserveA * this.anteilNeededForAimReturnDayPool / 100;
  }

  onChangeAimReturnMonthPool(newValue): void {
    const {pool, dfiPerBlock} = this.getCorrectPoolAndReward();
    this.targetReturnLMMonth = newValue;
    this.anteilNeededForAimReturnMonthPool = newValue / 60 / 24 / 30 * 100 / this.getDfiPerMin(dfiPerBlock);
    this.dfiNeededForAimReturnMonthPool = +pool.reserveB * this.anteilNeededForAimReturnMonthPool / 100;
    this.btcNeededForAimReturnMonthPool = +pool.reserveA * this.anteilNeededForAimReturnMonthPool / 100;
  }

  private getCorrectPoolAndReward(): any {
    let pool = null;
    let dfiPerBlock = null;
    if (this.poolLmCalculationTargetReturn === 'BTC') {
      pool = this.poolBtc;
      dfiPerBlock = this.dfiProBlockBtc;
    } else if (this.poolLmCalculationTargetReturn === 'ETH') {
      pool = this.poolEth;
      dfiPerBlock = this.dfiProBlockEth;
    } else if (this.poolLmCalculationTargetReturn === 'LTC') {
      pool = this.poolLtc;
      dfiPerBlock = this.dfiProBlockLtc;
    } else if (this.poolLmCalculationTargetReturn === 'DOGE') {
      pool = this.poolDoge;
      dfiPerBlock = this.dfiProBlockDoge;
    } else if (this.poolLmCalculationTargetReturn === 'BCH') {
      pool = this.poolBch;
      dfiPerBlock = this.dfiProBlockBch;
    } else if (this.poolLmCalculationTargetReturn === 'USDT'){
      pool = this.poolUsdt;
      dfiPerBlock = this.dfiProBlockUsdt;
    } else if (this.poolLmCalculationTargetReturn === 'USDC') {
      pool = this.poolUsdc;
      dfiPerBlock = this.dfiProBlockUsdc;
    } else if (this.poolLmCalculationTargetReturn === 'USDT-DUSD'){
      pool = this.poolUsdtDusd;
      dfiPerBlock = this.dfiProBlockUsdtDusd;
    } else if (this.poolLmCalculationTargetReturn === 'USDC-DUSD'){
      pool = this.poolUsdcDusd;
      dfiPerBlock = this.dfiProBlockUsdcDusd;
    } else if (this.poolLmCalculationTargetReturn === 'DUSD'){
      pool = this.poolUsd;
      dfiPerBlock = this.dfiProBlockUsd;
    } else if (this.poolLmCalculationTargetReturn === 'TSLA'){
      pool = this.poolTsla;
      dfiPerBlock = this.dfiProBlockTsla;
    } else if (this.poolLmCalculationTargetReturn === 'SPY'){
      pool = this.poolSpy;
      dfiPerBlock = this.dfiProBlockSpy;
    } else if (this.poolLmCalculationTargetReturn === 'QQQ'){
      pool = this.poolQqq;
      dfiPerBlock = this.dfiProBlockQqq;
    } else if (this.poolLmCalculationTargetReturn === 'PLTR'){
      pool = this.poolPltr;
      dfiPerBlock = this.dfiProBlockPltr;
    } else if (this.poolLmCalculationTargetReturn === 'SLV'){
      pool = this.poolSlv;
      dfiPerBlock = this.dfiProBlockSlv;
    } else if (this.poolLmCalculationTargetReturn === 'AAPL'){
      pool = this.poolAapl;
      dfiPerBlock = this.dfiProBlockAapl;
    } else if (this.poolLmCalculationTargetReturn === 'GLD'){
      pool = this.poolGld;
      dfiPerBlock = this.dfiProBlockGld;
    } else if (this.poolLmCalculationTargetReturn === 'GME'){
      pool = this.poolGme;
      dfiPerBlock = this.dfiProBlockGme;
    } else if (this.poolLmCalculationTargetReturn === 'GOOGL'){
      pool = this.poolGoogl;
      dfiPerBlock = this.dfiProBlockGoogl;
    } else if (this.poolLmCalculationTargetReturn === 'ARKK'){
      pool = this.poolArkk;
      dfiPerBlock = this.dfiProBlockArkk;
    } else if (this.poolLmCalculationTargetReturn === 'BABA'){
      pool = this.poolBaba;
      dfiPerBlock = this.dfiProBlockBaba;
    } else if (this.poolLmCalculationTargetReturn === 'VNQ'){
      pool = this.poolVnq;
      dfiPerBlock = this.dfiProBlockVnq;
    } else if (this.poolLmCalculationTargetReturn === 'URTH'){
      pool = this.poolUrth;
      dfiPerBlock = this.dfiProBlockUrth;
    } else if (this.poolLmCalculationTargetReturn === 'TLT'){
      pool = this.poolTlt;
      dfiPerBlock = this.dfiProBlockTlt;
    } else if (this.poolLmCalculationTargetReturn === 'PDBC'){
      pool = this.poolPdbc;
      dfiPerBlock = this.dfiProBlockPdbc;
    } else if (this.poolLmCalculationTargetReturn === 'AMZN'){
      pool = this.poolAmzn;
      dfiPerBlock = this.dfiProBlockAmzn;
    } else if (this.poolLmCalculationTargetReturn === 'NVDA'){
      pool = this.poolNvda;
      dfiPerBlock = this.dfiProBlockNvda;
    } else if (this.poolLmCalculationTargetReturn === 'COIN'){
      pool = this.poolCoin;
      dfiPerBlock = this.dfiProBlockCoin;
    } else if (this.poolLmCalculationTargetReturn === 'EEM'){
      pool = this.poolEem;
      dfiPerBlock = this.dfiProBlockEem;
    } else if (this.poolLmCalculationTargetReturn === 'MSFT'){
      pool = this.poolMsft;
      dfiPerBlock = this.dfiProBlockMsft;
    } else if (this.poolLmCalculationTargetReturn === 'NFLX'){
      pool = this.poolNflx;
      dfiPerBlock = this.dfiProBlockNflx;
    } else if (this.poolLmCalculationTargetReturn === 'FB'){
      pool = this.poolFb;
      dfiPerBlock = this.dfiProBlockFb;
    } else if (this.poolLmCalculationTargetReturn === 'VOO') {
      pool = this.poolVoo;
      dfiPerBlock = this.dfiProBlockVoo;
    } else if (this.poolLmCalculationTargetReturn === 'DIS') {
      pool = this.poolDis;
      dfiPerBlock = this.dfiProBlockDis;
    } else if (this.poolLmCalculationTargetReturn === 'MCHI') {
      pool = this.poolMchi;
      dfiPerBlock = this.dfiProBlockMchi;
    } else if (this.poolLmCalculationTargetReturn === 'MSTR') {
      pool = this.poolMstr;
      dfiPerBlock = this.dfiProBlockMstr;
    } else if (this.poolLmCalculationTargetReturn === 'INTC') {
      pool = this.poolIntc;
      dfiPerBlock = this.dfiProBlockIntc;
    } else if (this.poolLmCalculationTargetReturn === 'PYPL') {
      pool = this.poolPypl;
      dfiPerBlock = this.dfiProBlockPypl;
    } else if (this.poolLmCalculationTargetReturn === 'BRK.B') {
      pool = this.poolBrkb;
      dfiPerBlock = this.dfiProBlockBrkb;
    } else if (this.poolLmCalculationTargetReturn === 'KO') {
      pool = this.poolKo;
      dfiPerBlock = this.dfiProBlockKo;
    } else if (this.poolLmCalculationTargetReturn === 'PG') {
      pool = this.poolPg;
      dfiPerBlock = this.dfiProBlockPg;
    } else if (this.poolLmCalculationTargetReturn === 'SAP') {
      pool = this.poolSap;
      dfiPerBlock = this.dfiProBlockSap;
    } else if (this.poolLmCalculationTargetReturn === 'URA') {
      pool = this.poolUra;
      dfiPerBlock = this.dfiProBlockUra;
    } else if (this.poolLmCalculationTargetReturn === 'CS') {
      pool = this.poolCs;
      dfiPerBlock = this.dfiProBlockCs;
    } else if (this.poolLmCalculationTargetReturn === 'GSG') {
      pool = this.poolGsg;
      dfiPerBlock = this.dfiProBlockGsg;
    } else if (this.poolLmCalculationTargetReturn === 'PPLT') {
      pool = this.poolPplt;
      dfiPerBlock = this.dfiProBlockPplt;
    } else if (this.poolLmCalculationTargetReturn === 'GOVT') {
      pool = this.poolGovt;
      dfiPerBlock = this.dfiProBlockGovt;
    } else if (this.poolLmCalculationTargetReturn === 'TAN') {
      pool = this.poolTan;
      dfiPerBlock = this.dfiProBlockTan;
    } else if (this.poolLmCalculationTargetReturn === 'XOM') {
      pool = this.poolXom;
      dfiPerBlock = this.dfiProBlockXom;
    }

    else {
      pool = this.poolUsdc;
      dfiPerBlock = this.dfiProBlockUsdc;

    }

    this.pool = pool;

    return {pool, dfiPerBlock};
  }

  isCrypto(): boolean {
    return this.poolLmCalculationTargetReturn === 'BTC' || this.poolLmCalculationTargetReturn === 'ETH'
      || this.poolLmCalculationTargetReturn === 'LTC' || this.poolLmCalculationTargetReturn === 'DOGE'
      || this.poolLmCalculationTargetReturn === 'BCH' || this.poolLmCalculationTargetReturn === 'USDT'
      || this.poolLmCalculationTargetReturn === 'USDC' || this.poolLmCalculationTargetReturn === 'DUSD';
  }

  private getDfiPerMin(dfiProBlock: number): number {
    return dfiProBlock / this.blocktimeInS * 60;
  }

}
