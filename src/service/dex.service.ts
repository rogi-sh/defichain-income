import {Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DexInfo, Pool} from '../interface/Dex';
import {Observable} from 'rxjs';

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

  public getAdressDetail(adress: string): Observable<[string]>  {
    return this.http.get<[string]>(environment.accountDetails + adress);
  }
}
