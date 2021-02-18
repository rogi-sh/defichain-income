import {Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DexInfo, Pool} from '../interface/Dex';

@Injectable({
  providedIn: 'root'
})
export class Dex {

  constructor(private http: HttpClient) {  }

  public getDex() {
    return this.http.get<DexInfo>(environment.dex);
  }

  public getPoolDetail(id: string) {
    return this.http.get<Pool>(environment.poolDetails + id);
  }
}
