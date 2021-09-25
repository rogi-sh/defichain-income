import {Component, Input, OnInit} from '@angular/core';
import {Correlation, DexInfo, Pool, Stats} from '@interfaces/Dex';
import {Apollo} from 'apollo-angular';
import {CORRELATION} from '@interfaces/Graphql';
import { Octokit } from '@octokit/rest';
import {Milestone, Release} from '@interfaces/Github';

@Component({
  selector: 'app-dex-statistics',
  templateUrl: './dex-statistics.component.html',
})
export class DexStatisticsComponent implements OnInit {
  @Input()
  fiat: string;

  @Input()
  dex: DexInfo;

  @Input()
  poolBtc: Pool;

  @Input()
  poolEth: Pool;

  @Input()
  poolUsdt: Pool;

  @Input()
  poolUsdc: Pool;

  @Input()
  poolLtc: Pool;

  @Input()
  poolDoge: Pool;

  @Input()
  poolBch: Pool;

  @Input()
  stakingApyMN: number;

  @Input()
  stakingApyCake: number;

  @Input()
  MNCount: number;

  @Input()
  MNCount5Freezer: number;

  @Input()
  MNCount10Freezer: number;

  @Input()
  MNCount0Freezer: number;

  @Input()
  rewards: Stats;

  @Input()
  blockTimeUsed: number;

  @Input()
  blockTimeSecond: number;

  @Input()
  blockCountForCalc: number;

  @Input()
  isIncognitoModeOn: boolean;

  @Input()
  burnedDfi: number;

  corr: Correlation;

  euonsHardforkeBlock = 894000;

  octokit = new Octokit({auth: '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'});

  milestones = new Array<Milestone>();

  releasesNode = new Array<Release>();

  releasesApp = new Array<Release>();

  releasesWallet = new Array<Release>();

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.loadCor();
    this.loadMilestones();
    this.loadNodeRelease();
    this.loadAppRelease();
    this.loadWalletRelease();
  }

  loadMilestones(): void {
    this.octokit.rest.issues.listMilestones({
        owner: 'DeFiCh',
        repo: 'ain',
      })
      .then(({ data }) => {
        // handle data
        this.milestones  = data as unknown as Milestone [];

      });
  }

  loadNodeRelease(): void {
    this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'ain',
    })
      .then(({ data }) => {
        // handle data
        this.releasesNode  = data as unknown as Release [];
        this.releasesNode = this.filterReleases(this.releasesNode);

      });
  }

  getLatestReleaseNode(): Release {
    return this.releasesNode[0];
  }

  loadAppRelease(): void {
    this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'app',
    })
      .then(({ data }) => {
        // handle data
        this.releasesApp  = data as unknown as Release [];
        this.releasesApp = this.filterReleases(this.releasesApp );

      });
  }

  loadWalletRelease(): void {
    this.octokit.rest.repos.listReleases({
      owner: 'DeFiCh',
      repo: 'wallet',
    })
      .then(({ data }) => {
        // handle data
        this.releasesWallet  = data as unknown as Release [];
        this.releasesWallet = this.filterReleases(this.releasesWallet );

      });
  }

  private filterReleases(releases: Release []): Release [] {
    releases = releases.filter(a => a.prerelease === false);
    releases = releases.sort((a: Release, b: Release) => {
      return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
    });
    return releases.reverse();
  }

  getLatestReleaseApp(): Release {
    return this.releasesApp[0];
  }

  getLatestReleaseWallet(): Release {
    return this.releasesWallet[0];
  }

  getReleaseText(body: string): string {
    return body?.substring(0, body.indexOf('How to run?'));
  }

  getReleaseTextWallet(body: string): string {
    return body?.substring(0, body?.indexOf('Dependencies'));
  }

  loadCor(): void {
      this.apollo.query({
        query: CORRELATION
      }).subscribe((result: any) => {
        if (result?.data?.getCorrelation) {
          this.corr = result?.data?.getCorrelation;
        } else {
          console.log('No Date for Corr');
        }
      }, (error) => {
        console.log(error);
      });
    }

  getBlockToNextCycle(): string  {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 32690 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 32690;
    const time = blocks * this.blockTimeUsed / 60 / 60 / 24;
    return String(blocks) + ' ~ ' + Math.round(time ) + ' d';
  }

  getBlockToNextDiffChange(): string {
    if (!this.rewards || !this.blockTimeUsed) {
      return '0';
    }

    const blocks = 1008 - (this.rewards?.blockHeight - this.euonsHardforkeBlock) % 1008;
    const time = blocks * this.blockTimeUsed / 60 / 60;
    return String(blocks) + ' ~ ' + Math.round(time) + ' h';
  }

  getMasternodeTVL(): number {
    return this.MNCount * 20000 * this.poolUsdc?.priceB;
  }

  getTotalTVL(): number {
    return this.dex?.tvl + this.getMasternodeTVL();
  }

  getDexDFI(): number {
    return +this.poolBtc?.reserveB + +this.poolEth?.reserveB + +this.poolLtc?.reserveB + +this.poolUsdt?.reserveB +
      +this.poolUsdc?.reserveB + +this.poolDoge?.reserveB;
  }

  getTotalDFILocked(): number {
    return this.getDexDFI() + this.MNCount * 20000;
  }

}
