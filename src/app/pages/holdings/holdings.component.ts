import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Wallet, WalletDto } from '@interfaces/Data';
import { Pool, PoolBtcOut } from '@interfaces/Dex';

@Component({
  selector: 'app-holdings-page',
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {
  public dialogOpen: boolean = false;
  public selectedTab: string = 'manual';

  @Input()
  addAdress: Function;

  @Input()
  deleteAdress: Function;

  @Input()
  adress: string;

  @Input()
  adresses: Array<string>;

  @Input()
  dataLoaded: boolean;

  @Input()
  wallet!: Wallet;

  @Input()
  dfiInStaking!: number;

  @Input()
  usdToEur!: number;

  @Input()
  usdToChf!: number;

  @Input()
  usdToGbp!: number;

  @Input()
  fiat!: string;

  @Input()
  poolBtc!: Pool;

  @Input()
  poolEth!: Pool;

  @Input()
  poolUsdt!: Pool;

  @Input()
  poolLtc!: Pool;

  @Input()
  poolDoge!: Pool;

  @Input()
  poolBch!: Pool;

  constructor(private modalService: NgbModal) { }

  ngOnInit (): void {}

  handleSettingsDialog(): void {
    this.dialogOpen = !this.dialogOpen
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab
  }
}
