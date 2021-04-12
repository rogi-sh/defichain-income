import { Component, Input, OnInit } from '@angular/core';

import { Wallet } from '@interfaces/Data';
import { Pool } from '@interfaces/Dex';

@Component({
  selector: 'app-holdings-page',
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {
  dialogOpen = false;
  isInfoOpen = false;
  selectedTab = 'manual';

  @Input()
  addAdress: () => void;

  @Input()
  deleteAdress: () => void;

  @Input()
  adress: string;

  @Input()
  adresses: Array<string>;

  @Input()
  wallet: Wallet;

  @Input()
  dfiInStaking: number;

  @Input()
  usdToEur: number;

  @Input()
  usdToChf: number;

  @Input()
  usdToGbp: number;

  @Input()
  fiat: string;

  @Input()
  poolBtc: Pool;

  @Input()
  poolEth: Pool;

  @Input()
  poolUsdt: Pool;

  @Input()
  poolLtc: Pool;

  @Input()
  poolDoge: Pool;

  @Input()
  poolBch: Pool;

  @Input()
  stakingApy: number;
  
  @Input()
  autoLoadData: boolean;

  @Input()
  onChangeBtcWallet: () => void;

  @Input()
  onChangeEthWallet: () => void;

  @Input()
  onChangeLtcWallet: () => void;

  @Input()
  onChangeUsdtWallet: () => void;

  @Input()
  onChangeDogeWallet: () => void;

  @Input()
  onChangeBchWallet: () => void;

  @Input()
  saveInputStaking: () => void;

  @Input()
  onChangeDfiStaking: () => void;

  @Input()
  onChangeBtcBtcPool: () => void;

  @Input()
  onChangeDfiBtcPool: () => void;

  @Input()
  onChangeEthEthPool: () => void;

  @Input()
  onChangeDfiEthPool: () => void;

  @Input()
  onChangeUsdtUsdtPool: () => void;

  @Input()
  onChangeDfiUsdtPool: () => void;

  @Input()
  onChangeLtcLtcPool: () => void;

  @Input()
  onChangeDfiLtcPool: () => void;

  @Input()
  onChangeDogeDogePool: () => void;

  @Input()
  onChangeDfiDogePool: () => void;

  @Input()
  onChangeBchBchPool: () => void;

  @Input()
  onChangeDfiBchPool: () => void;

  constructor() {}

  ngOnInit(): void {}

  handleSettingsDialog(): void {
    this.dialogOpen = !this.dialogOpen;
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
  }

  openInfoMenu(): void {
    this.isInfoOpen = !this.isInfoOpen;
  }
}
