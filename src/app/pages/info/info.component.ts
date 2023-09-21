import { Component, Input, OnInit } from '@angular/core';
import { Currencies, ServerVersion } from '@interfaces/Data'
import { environment } from '@environments/environment'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-info-page',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  @Input()
  trackGit: () => void;

  @Input()
  trackGraphQL: () => void;

  version = "1.0.0"

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getVersionBackend();
  }

  public async getVersionBackend(): Promise<void> {
    const promise = await this.http.get<ServerVersion>(environment.versionBackend).toPromise();
    this.version = promise.version;
  }

}
