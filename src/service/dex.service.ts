import {Injectable } from '@angular/core';
import {environment} from '@environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { DexPoolPair, Pool, Prices } from '@interfaces/Dex'
import {Observable} from 'rxjs';
import {Blocks } from '@interfaces/Data';
import {OceanStats} from '@interfaces/Staking';

@Injectable({
  providedIn: 'root'
})
export class Dex {

  constructor(private http: HttpClient) {  }

  public getPrices(): Observable<Prices> {
    return this.http.get<Prices>(environment.prices);
  }

  public getStats(): Observable<OceanStats>  {
    return this.http.get<OceanStats>(environment.oceanstats);
  }

  public getListpoolpairs(): Observable<DexPoolPair>  {
    return this.http.get<DexPoolPair>(environment.listpoolpairs);
  }

  public getLastBlocks(blocks: number): Observable<Blocks> {
    const url = environment.blocks.replace('2000', String(blocks));
    return this.http.get<Blocks>(url);
  }

  public getHealthCheck(): Observable<HttpResponse<any>> {
    return this.http.get(environment.health, { observe: 'response' });
  }

}
