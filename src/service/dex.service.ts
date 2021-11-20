import {Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DexInfo, DexPoolPair} from '../interface/Dex';
import {Observable} from 'rxjs';
import {Balance, Block} from '../interface/Data';
import {OceanStats} from '@interfaces/Staking';

@Injectable({
  providedIn: 'root'
})
export class Dex {

  constructor(private http: HttpClient) {  }

  public getListyieldfarming(): Observable<DexInfo> {
    return this.http.get<DexInfo>(environment.listyieldfarming);
  }

  public getStats(): Observable<OceanStats>  {
    return this.http.get<OceanStats>(environment.oceanstats);
  }

  public getListpoolpairs(): Observable<DexPoolPair>  {
    return this.http.get<DexPoolPair>(environment.listpoolpairs);
  }

  public getAdressDetail(address: string): Observable<[string]>  {
    return this.http.get<[string]>(environment.accountDetails + address);
  }

  public getLastBlocks(blocks: number): Observable<Array<Block>> {
    const url = environment.blocks.replace('2000', String(blocks));
    return this.http.get<Array<Block>>(url);
  }

  public getHealthCheck(): Observable<any>  {
    // tslint:disable-next-line:ban-types
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    };

    return this.http.get<any>(environment.health, requestOptions);
  }

  public getAdressBalance(address: string): Observable<Balance>  {
    const url = environment.balance.replace('SET-ADDRESS', address);
    return this.http.get<Balance>(url);
  }
}
