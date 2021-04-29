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

    return this.http.get<CakeStaking>(environment.cake);
  }

  public getMasternode(): Observable<Masternode> {

    return this.http.get<Masternode>(environment.defichainnode);
  }
}
