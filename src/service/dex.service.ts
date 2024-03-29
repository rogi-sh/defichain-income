import {Injectable } from '@angular/core';
import {environment} from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Prices } from '@interfaces/Dex';
import {Observable} from 'rxjs';
import { Blocks, Burn, PoolPairsOcean, StockOracles } from '@interfaces/Data';
import {OceanStats} from '@interfaces/Staking';

@Injectable({
  providedIn: 'root'
})
export class Dex {

  constructor(private http: HttpClient) {  }

  public getPrices(): Observable<Prices> {
    return this.http.get<Prices>(environment.prices);
  }

  public getOraclePrices(): Observable<StockOracles>  {
    return this.http.get<StockOracles>(environment.oraclePrices);
  }

  public getCollateralTokens(): Observable<StockOracles>  {
    return this.http.get<StockOracles>(environment.collateralTokens);
  }

  public getPoolPairsOcean(): Observable<PoolPairsOcean>  {
    return this.http.get<PoolPairsOcean>(environment.poolpairsocean);
  }

  public getBurnInfo(): Observable<Burn>  {
    return this.http.get<Burn>(environment.burninfo);
  }

  public getStats(): Observable<OceanStats>  {
    return this.http.get<OceanStats>(environment.oceanstats);
  }

  public getLastBlocks(blocks: number): Observable<Blocks> {
    const url = environment.blocks.replace('2000', String(blocks));
    return this.http.get<Blocks>(url);
  }

}
