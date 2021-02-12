import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Dex} from '../service/dex.service';
import {DexInfo, Pool, PoolBtcOut, PoolEthOut, PoolOut, StakingOut} from '../interface/Dex';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'defichain-income';

  dfiProBlockBtc = 80;
  dfiProBlockEth = 15;
  blocktimeInS = 37;

  btc = 2.17;
  dfiInBtcPool = 28282.49;
  eth = 14.34;
  dfiInEthPool = 7070.63;

  dfiInStaking = 11050;
  stakingApy = 37;

  dex: DexInfo;

  poolBtc: Pool;
  poolBtcOut: PoolBtcOut = new PoolBtcOut();
  anteilAmPoolBtc: number;


  poolEthOut: PoolEthOut = new PoolEthOut();
  poolEth: Pool;
  anteilAmPoolEth: number;

  poolOut: PoolOut = new PoolOut();
  stakingOut: StakingOut = new StakingOut();

  constructor(private dexService: Dex) {
  }

  ngOnInit(): void {
    this.loadDex();
    setInterval( () => {
      console.log('Refresh ...');
      this.loadDex();
    }, 60000);
  }

  loadDex(): void {
    this
      .dexService
      .getDex()
      .subscribe(
        dex => {
          this.dex = dex;
          this.poolBtc = dex.pools.find(x => x.poolPairId === '5');
          this.poolEth = dex.pools.find(x => x.poolPairId === '4');
          this.berechnePoolOutBtc();
          this.berechnePoolOutEth();
          this.berechnePoolOut();
          this.berechneStakingOut();
        },
        err => {
          console.error(err);
        });
  }

  getPool(id: string): Pool {
    return this.dex.pools.find(x => x.poolPairId === id);
  }

  berechnePoolOutBtc(): void {
    const reserveANumber = +this.poolBtc?.reserveA;
    const reserveBNumber = +this.poolBtc?.reserveB;
    const anteileBTC = this.btc / reserveANumber * 100;
    const anteileDFI = this.dfiInBtcPool / reserveBNumber * 100;
    this.anteilAmPoolBtc = (anteileBTC + anteileDFI) / 2;
    this.poolBtcOut.dfiPerMinBtc = this.dfiProBlockBtc / this.blocktimeInS * 60 * this.anteilAmPoolBtc / 100;
    this.poolBtcOut.dfiPerHourBtc =  this.poolBtcOut.dfiPerMinBtc * 60;
    this.poolBtcOut.dfiPerDayBtc = this.poolBtcOut.dfiPerHourBtc * 24;
    this.poolBtcOut.dfiPerWeekBtc = this.poolBtcOut.dfiPerDayBtc * 7;
    this.poolBtcOut.dfiPerMonthBtc = this.poolBtcOut.dfiPerDayBtc * 30;
  }

  berechnePoolOutEth(): void {
    const reserveANumber = +this.poolEth?.reserveA;
    const reserveBNumber = +this.poolEth?.reserveB;
    const anteileETH = this.eth / reserveANumber * 100;
    const anteileDFI = this.dfiInEthPool / reserveBNumber * 100;
    this.anteilAmPoolEth = (anteileETH + anteileDFI) / 2;
    this.poolEthOut.dfiPerMinEth = this.dfiProBlockEth / this.blocktimeInS * 60 * this.anteilAmPoolEth / 100;
    this.poolEthOut.dfiPerHourEth =  this.poolEthOut.dfiPerMinEth * 60;
    this.poolEthOut.dfiPerDayEth = this.poolEthOut.dfiPerHourEth * 24;
    this.poolEthOut.dfiPerWeekEth = this.poolEthOut.dfiPerDayEth * 7;
    this.poolEthOut.dfiPerMonthEth = this.poolEthOut.dfiPerDayEth * 30;
  }

  berechnePoolOut(): void {
    this.poolOut.dfiPerMin = this.poolBtcOut.dfiPerMinBtc + this.poolEthOut.dfiPerMinEth;
    this.poolOut.dfiPerHour =  this.poolBtcOut.dfiPerHourBtc + this.poolEthOut.dfiPerHourEth;
    this.poolOut.dfiPerDay = this.poolBtcOut.dfiPerDayBtc + this.poolEthOut.dfiPerDayEth;
    this.poolOut.dfiPerWeek = this.poolBtcOut.dfiPerWeekBtc + this.poolEthOut.dfiPerWeekEth;
    this.poolOut.dfiPerMonth = this.poolBtcOut.dfiPerMonthBtc + this.poolEthOut.dfiPerMonthEth;
  }

  berechneStakingOut(): void {
    this.stakingOut.dfiPerDay = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 365) - this.dfiInStaking;
    this.stakingOut.dfiPerHour =  this.stakingOut.dfiPerDay / 24;
    this.stakingOut.dfiPerMin = this.stakingOut.dfiPerHour / 60;
    this.stakingOut.dfiPerWeek = this.stakingOut.dfiPerDay  * 7;
    this.stakingOut.dfiPerMonth = this.dfiInStaking * Math.pow(1 + this.stakingApy / 100, 1 / 12) - this.dfiInStaking;
  }

}
