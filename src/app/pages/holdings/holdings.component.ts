import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Wallet, WalletDto } from '@interfaces/Data';
import { Pool, PoolBtcOut } from '@interfaces/Dex';

@Component({
  selector: 'app-holdings-page',
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {
  public dialogOpen: boolean = true;
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
  
  @Input()
  stakingApy: Number;

  @Input()
  onChangeBtcWallet: Function;

  @Input()
  onChangeEthWallet: Function;

  @Input()
  onChangeLtcWallet: Function;

  @Input()
  onChangeUsdtWallet: Function;

  @Input()
  onChangeDogeWallet: Function;

  @Input()
  onChangeBchWallet: Function;

  @Input()
  saveInputStaking: Function;

  @Input()
  onChangeDfiStaking: Function;

  @Input()
  onChangeBtcBtcPool: Function;
  
  @Input()
  onChangeDfiBtcPool: Function;

  @Input()
  onChangeEthEthPool: Function;
  
  @Input()
  onChangeDfiEthPool: Function;
  
  @Input()
  onChangeUsdtUsdtPool: Function;
  
  @Input()
  onChangeDfiUsdtPool: Function;
  
  @Input()
  onChangeLtcLtcPool: Function;
  
  @Input()
  onChangeDfiLtcPool: Function;
  
  @Input()
  onChangeDogeDogePool: Function;
  
  @Input()
  onChangeDfiDogePool: Function;
  
  @Input()
  onChangeBchBchPool: Function;
  
  @Input()
  onChangeDfiBchPool: Function;

  constructor(private modalService: NgbModal) { }

  ngOnInit (): void {}

  handleSettingsDialog(): void {
    this.dialogOpen = !this.dialogOpen
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab
  }
}
