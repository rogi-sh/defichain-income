import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import {CakeStaking, Masternode} from '@interfaces/Staking';


@Injectable({
  providedIn: 'root'
})
export class StakingService {

  constructor(private http: HttpClient) {
  }

  public getStaking(): Observable<CakeStaking> {

    // tslint:disable-next-line:ban-types
    const requestOptions: Object = {
      /* other options here */
      headers: {'access-control-allow-origin': '*'}
    };
    return this.http.get<CakeStaking>(environment.cake, requestOptions);
  }

  public getMasternode(): Observable<Masternode> {

    // tslint:disable-next-line:ban-types
    const requestOptions: Object = {
      /* other options here */
      headers: {'access-control-allow-origin': '*'}
    };

    return this.http.get<Masternode>(environment.defichainnode, requestOptions);
  }
}
