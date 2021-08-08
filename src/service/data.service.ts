import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Currencies, USD} from '@interfaces/Data';
import {Observable} from 'rxjs/dist/types';
import {SupernodeAccount} from '@interfaces/Supernode';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  usd: USD;

  poolBtcPrice: number;
  poolEthPrice: number;

  constructor(private http: HttpClient) {

    this.usd = new USD();
    this.usd.eur = 0.832245;
    this.usd.chf = 0.9171;
    this.usd.gbp = 0.722715;
    this.usd.aud = 1.29799;
    this.usd.rub = 75.5359;
    this.usd.jpy = 107.939;
    this.usd.cad = 1.25031;
    this.usd.cny = 6.4913;
    this.usd.sgd = 1.3296;

    setInterval(() => {
      this.getCurrencies();
    }, 3600000);


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

  async getCurrencies(): Promise<void> {
     const promise = await this.http.get<Currencies>(environment.cur).toPromise();
     this.usd = promise.usd;
  }

  public getAdressAccount(address: string): Observable<Array<SupernodeAccount>>  {
    return this.http.get<Array<SupernodeAccount>>(environment.supernode_account + address);
  }
}
