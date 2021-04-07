import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Wallet, WalletDto } from '@interfaces/Data';
import { Pool, PoolBtcOut } from '@interfaces/Dex';

@Component({
  selector: 'app-holdings-page',
  templateUrl: './holdings.component.html',
})
export class HoldingsComponent implements OnInit {
  public dialogOpen: boolean = true;
  public selectedTab: string = 'api';
  
  wallet: Wallet;
  walletDTO: WalletDto;

  poolBtc: Pool;
  poolBtcOut: PoolBtcOut = new PoolBtcOut();
  anteilAmPoolBtc: number;

  // Staking infos
  dfiInStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';

  constructor(private modalService: NgbModal) { }

  ngOnInit (): void {
    this.wallet = new Wallet();
  }

  open (content): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {

    });
  }

  handleSettingsDialog(): void {
    this.dialogOpen = !this.dialogOpen
  }

  handleTab(selectedTab: string): void {
    this.selectedTab = selectedTab
  }

  clearWallet(): void {
    const newWallet = new Wallet();
    newWallet.dfiInStaking = this.dfiInStaking;
    this.wallet = newWallet;
  }

  copyValues(wallet: WalletDto): Wallet {
    const walletFinal = new Wallet();
    walletFinal.dfiInStaking = wallet.dfiInStaking;
    walletFinal.dfi = wallet.dfi;

    walletFinal.btcdfi = wallet.btcdfi;
    walletFinal.ethdfi = wallet.ethdfi;
    walletFinal.ltcdfi = wallet.ltcdfi;
    walletFinal.dogedfi = wallet.dogedfi;
    walletFinal.usdtdfi = wallet.usdtdfi;
    walletFinal.bchdfi = wallet.bchdfi;

    walletFinal.btcInBtcPool = wallet.btcInBtcPool;
    walletFinal.dfiInBtcPool = wallet.dfiInBtcPool;
    walletFinal.ethInEthPool = wallet.ethInEthPool;
    walletFinal.dfiInEthPool = wallet.dfiInEthPool;
    walletFinal.usdtInUsdtPool = wallet.usdtInUsdtPool;
    walletFinal.dfiInUsdtPool = wallet.dfiInUsdtPool;
    walletFinal.ltcInLtcPool = wallet.ltcInLtcPool;
    walletFinal.dfiInLtcPool = wallet.dfiInLtcPool;
    walletFinal.dogeInDogePool = wallet.dogeInDogePool;
    walletFinal.dfiInDogePool = wallet.dfiInDogePool;

    walletFinal.bchInBchPool = wallet.bchInBchPool;
    walletFinal.dfiInBchPool = wallet.dfiInBchPool;

    walletFinal.btc = wallet.btc;
    walletFinal.eth = wallet.eth;
    walletFinal.ltc = wallet.ltc;
    walletFinal.doge = wallet.doge;
    walletFinal.usdt = wallet.usdt;
    walletFinal.bch = wallet.bch;

    return walletFinal;
  }

}
