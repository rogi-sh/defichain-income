import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@environments/environment';
import { CakeStaking, DfxStaking, OceanStats } from '@interfaces/Staking';


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

  public getMasternode(): Observable<OceanStats> {
    return this.http.get<OceanStats>(environment.oceanstats);
  }
}
