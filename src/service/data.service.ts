import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Currencies, USD} from '@interfaces/Data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  usd: USD;

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

    this.getCurrencies();
    setInterval(() => {
      this.getCurrencies();
    }, 21600000);

  }

  public getUsdCur(): USD {
    return this.usd;
  }

  async getCurrencies(): Promise<void> {
     const promise = await this.http.get<Currencies>(environment.cur).toPromise();
     this.usd = promise.usd;
  }
}
