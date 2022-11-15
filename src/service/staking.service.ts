import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import { CakeStaking, DfxStaking, LockStaking, LockStats, OceanStats } from '@interfaces/Staking'


@Injectable({
  providedIn: 'root'
})
export class StakingService {

  constructor(private http: HttpClient) {
  }

  public getStaking(): Observable<CakeStaking> {
    return this.http.get<CakeStaking>(environment.cake);
  }

  public getStakingDFX(): Observable<DfxStaking> {
    return this.http.get<DfxStaking>(environment.dfx);
  }

  public getStakingLock(address: string): Observable<LockStaking> {
    return this.http.get<LockStaking>(environment.lock + address);
  }

  public getStatsLock(): Observable<LockStats> {
    return this.http.get<LockStats>(environment.lockStats);
  }
}
