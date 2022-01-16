import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import { AddressVaults, Currencies, USD } from '@interfaces/Data'
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
  poolDfiPrice: number;

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

  public setDfiUsd(price: number): void {
    this.poolDfiPrice = price;
  }

  public getDfiUsd(): number {
    return this.poolDfiPrice;
  }

  public getCurrencies = async () =>  {
    const promise = await this.http.get<Currencies>(environment.cur).toPromise();
    this.usd = promise.usd;
  }

  public getAdressAccount(address: string): Observable<Array<SupernodeAccount>>  {
    return this.http.get<Array<SupernodeAccount>>(environment.supernode_account + address);
  }

  public getAddressVaults(address: string): Observable<AddressVaults>  {
    const url = environment.address_vaults.replace('ADDRESS_VAULTS', address);
    return this.http.get<AddressVaults>(url);
  }

  public getMamonAccount(key: string): Observable<any>  {
    const url = environment.mamon_account.replace('KEY', key);
    return this.http.get<any>(url);
  }

  public getMamonAccountNode(key: string): Observable<MamonAccountNode> {
    return this.http.get<MamonAccountNode>(environment.mamon_account_node + key);
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
    } else if (fiat === 'BTC') {
      return this.getBtcUsd();
    } else if (fiat === 'ETH') {
      return this.getEthUsd();
    } else if (fiat === 'DFI') {
      return this.getDfiUsd();
    }
  }
}
