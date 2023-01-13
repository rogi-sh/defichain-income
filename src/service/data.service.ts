import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Currencies, Income, USD } from '@interfaces/Data'
import {Observable} from 'rxjs';
import {MamonAccountNode} from '@interfaces/Mamon';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  usd: USD;

  poolBtcPrice: number;
  poolEthPrice: number;
  poolDfiPrice: number;

  constructor(private http: HttpClient) {

    this.usd = new USD();
    this.getCurrencies();

  }

  public getUsdCur(): USD {
    return this.usd;
  }

  public getBtcUsd(): number {
    return this.poolBtcPrice;
  }

  public setBtcUsd(price: number): void {
    this.poolBtcPrice = price;
  }

  public setEthUsd(price: number): void {
    this.poolEthPrice = price;
  }

  public getEthUsd(): number {
    return this.poolEthPrice;
  }

  public setDfiUsd(price: number): void {
    this.poolDfiPrice = price;
  }

  public getDfiUsd(): number {
    return this.poolDfiPrice;
  }

  public async getCurrencies(): Promise<void> {
    const promise = await this.http.get<Currencies>(environment.cur).toPromise();
    this.usd = promise.usd;
  }

  public getMamonAccount(key: string): Observable<any>  {
    const url = environment.mamon_account.replace('KEY', key);
    return this.http.get<any>(url);
  }

  public getMamonAccountNode(key: string): Observable<MamonAccountNode> {
    return this.http.get<MamonAccountNode>(environment.mamon_account_node + key);
  }

  public getIncome(addresses: string []): Observable<Income> {
    const body = {
      addresses: addresses
    }
    return this.http.post<Income>(environment.income, body);
  }

  getPrice(fiat: string): number {
    if (fiat === 'USD') {
      return 1;
    } else if (fiat === 'EUR') {
      return this.getUsdCur().eur;
    } else if (fiat === 'CHF') {
      return this.getUsdCur().chf;
    }  else if (fiat === 'GBP') {
      return this.getUsdCur().gbp;
    } else if (fiat === 'AUD') {
      return this.getUsdCur().aud;
    } else if (fiat === 'RUB') {
      return this.getUsdCur().rub;
    } else if (fiat === 'JPY') {
      return this.getUsdCur().jpy;
    } else if (fiat === 'CAD') {
      return this.getUsdCur().cad;
    } else if (fiat === 'CNY') {
      return this.getUsdCur().cny;
    } else if (fiat === 'SGD') {
      return this.getUsdCur().sgd;
    } else if (fiat === 'HKD') {
      return this.getUsdCur().hkd;
    } else if (fiat === 'BTC') {
      return this.getBtcUsd();
    } else if (fiat === 'ETH') {
      return this.getEthUsd();
    } else if (fiat === 'DFI') {
      return this.getDfiUsd();
    }
  }

  getColor(pool: number): string {
    if (pool === 5) {
      return '#ff9900';
    } else if (pool === 4) {
      return '#3c3c3d';
    } else if (pool === 10) {
      return '#b8b8b8';
    } else if (pool === 6) {
      return '#26a17b';
    } else if (pool === 101) {
      return '#26a17b';
    } else if (pool === 14) {
      return '#2875C9';
    } else if (pool === 102) {
      return '#2875C9';
    } else if (pool === 8) {
      return '#cb9800';
    } else if (pool === 12 ) {
      return '#4CC947';
    } else if (pool === 17) {
     return '#6B8068';
    } else {
      return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
  }
}
