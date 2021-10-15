import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Currencies, USD} from '@interfaces/Data';
import {Observable} from 'rxjs';
import {SupernodeAccount} from '@interfaces/Supernode';
import {MamonAccountNode} from '@interfaces/Mamon';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  usd: USD;

  poolBtcPrice: number;
  poolEthPrice: number;

  constructor(private http: HttpClient) {

    this.usd = new USD();

    this.getCurrencies();

    setInterval(() => {
      this.getCurrencies();
    }, 60000);

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

  public getCurrencies = async () =>  {
    const promise = await this.http.get<Currencies>(environment.cur).toPromise();
    this.usd = promise.usd;
  }

  public getAdressAccount(address: string): Observable<Array<SupernodeAccount>>  {
    return this.http.get<Array<SupernodeAccount>>(environment.supernode_account + address);
  }

  public getMamonAccount(key: string): Observable<any>  {
    const url = environment.mamon_account.replace('KEY', key);
    return this.http.get<any>(url);
  }

  public getMamonAccountNode(key: string): Observable<MamonAccountNode> {
    return this.http.get<MamonAccountNode>(environment.mamon_account_node + key);
  }
}
