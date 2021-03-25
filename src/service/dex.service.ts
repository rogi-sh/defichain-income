import {Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DexInfo, DexPoolPair, Pool} from '../interface/Dex';
import {Observable} from 'rxjs';
import {Balance} from '../interface/Data';

@Injectable({
  providedIn: 'root'
})
export class Dex {

  constructor(private http: HttpClient) {  }

  public getDex(): Observable<DexInfo> {
    return this.http.get<DexInfo>(environment.dex);
  }

  public getPoolDetail(id: string): Observable<Pool>  {
    return this.http.get<Pool>(environment.poolDetails + id);
  }

  public getListpoolpairs(): Observable<DexPoolPair>  {
    return this.http.get<DexPoolPair>(environment.listpoolpairs);
  }

  public getAdressDetail(address: string): Observable<[string]>  {
    return this.http.get<[string]>(environment.accountDetails + address);
  }

  public getAdressBalance(address: string): Observable<Balance>  {
    const url = environment.balance.replace('SET-ADDRESS', address);
    return this.http.get<Balance>(url);
  }
}
