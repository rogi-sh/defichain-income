import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke, ApexPlotOptions
} from 'ng-apexcharts';
import {Outcome} from './Dex';

export class Data {
  name: string;
  value: number;
}

export class Balance {
  confirmed: number;
  balance: number;
}

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  stroke: ApexStroke;
  fill: ApexFill;
};

export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export type ChartOptions4 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

export interface WalletDto {
  dfi: number;

  dfiInStaking: number;

  btcdfi: number;
  ethdfi: number;
  ltcdfi: number;
  dogedfi: number;
  usdtdfi: number;
  bchdfi: number;

  // User Infos
  // BTC Pool
  btcInBtcPool: number;
  btc: number;
  dfiInBtcPool: number;

  // ETH Pool
  ethInEthPool: number;
  eth: number;
  dfiInEthPool: number;

  // USDT Pool
  usdtInUsdtPool: number;
  usdt: number;
  dfiInUsdtPool: number;

  // LTC Pool
  ltcInLtcPool: number;
  ltc: number;
  dfiInLtcPool: number;

  // DOGE Pool
  dogeInDogePool: number;
  doge: number;
  dfiInDogePool: number;

  // BCH Pool
  bchInBchPool: number;
  bch: number;
  dfiInBchPool: number;
}

export class Wallet {

  dfi = 0;
  dfiKey = 'dfiKey';

  dfiInStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';

  btcdfi = 5;
  bchdfi = 5;
  ethdfi = 5;
  ltcdfi = 5;
  dogedfi = 5;
  usdtdfi = 5;

  // User Infos
  // BTC Pool
  btcInBtcPool = 0;
  btcInBtcPoolKey = 'btcInBtcPoolKey';
  btc = 1;
  btcKey = 'btcKey';
  dfiInBtcPoolKey = 'dfiInBtcPoolKey';
  dfiInBtcPool = 0;

  // ETH Pool
  ethInEthPool = 0;
  ethInEthPoolKey = 'ethInEthPoolKey';
  eth = 2;
  ethKey = 'ethKey';
  dfiInEthPool = 0;
  dfiInEthPoolKey = 'dfiInEthPoolKey';

  // USDT Pool
  usdtInUsdtPool = 0;
  usdtInUsdtPoolKey = 'usdtInUsdtPoolKey';
  usdt = 20;
  usdtKey = 'usdtKey';
  dfiInUsdtPool = 0;
  dfiInUsdtPoolKey = 'dfiInUsdtPoolKey';

  // LTC Pool
  ltcInLtcPool = 0;
  ltcInLtcPoolKey = 'ltcInLtcPoolKey';
  ltc = 3;
  ltcKey = 'ltcKey';
  dfiInLtcPool = 0;
  dfiInLtcPoolKey = 'dfiInLtcPoolKey';

  // DOGE Pool
  dogeInDogePool = 0;
  dogeInDogePoolKey = 'dogeInDogePoolKey';
  doge = 5;
  dogeKey = 'dogeKey';
  dfiInDogePool = 0;
  dfiInDogePoolKey = 'dfiInDogePoolKey';

  // BCH Pool
  bchInBchPool = 0;
  bchInBchPoolKey = 'bchInBchPoolKey';
  bch = 7;
  bchKey = 'bchKey';
  dfiInBchPoolKey = 'dfiInBchPoolKey';
  dfiInBchPool = 0;

}

export class StakingCalc extends Outcome {
  dfiAmount = 10000;
  apy = 38;
}

export class StakingCalcNormal extends Outcome {
}

export class StakingCalcMN extends Outcome {
}
