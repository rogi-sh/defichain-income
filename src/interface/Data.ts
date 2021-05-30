import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke, ApexPlotOptions,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexTooltip,
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

export type ChartOptions5 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export class Series {
  data: Array<number>;
  name: string;
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

  dfiInMasternodes = 0;

  btcdfi = 0;
  bchdfi = 0;
  ethdfi = 0;
  ltcdfi = 0;
  dogedfi = 0;
  usdtdfi = 0;

  // User Infos
  // BTC Pool
  btcInBtcPool = 0;
  btcInBtcPoolKey = 'btcInBtcPoolKey';
  btc = 0;
  btcKey = 'btcKey';
  dfiInBtcPoolKey = 'dfiInBtcPoolKey';
  dfiInBtcPool = 0;

  // ETH Pool
  ethInEthPool = 0;
  ethInEthPoolKey = 'ethInEthPoolKey';
  eth = 0;
  ethKey = 'ethKey';
  dfiInEthPool = 0;
  dfiInEthPoolKey = 'dfiInEthPoolKey';

  // USDT Pool
  usdtInUsdtPool = 0;
  usdtInUsdtPoolKey = 'usdtInUsdtPoolKey';
  usdt = 0;
  usdtKey = 'usdtKey';
  dfiInUsdtPool = 0;
  dfiInUsdtPoolKey = 'dfiInUsdtPoolKey';

  // LTC Pool
  ltcInLtcPool = 0;
  ltcInLtcPoolKey = 'ltcInLtcPoolKey';
  ltc = 0;
  ltcKey = 'ltcKey';
  dfiInLtcPool = 0;
  dfiInLtcPoolKey = 'dfiInLtcPoolKey';

  // DOGE Pool
  dogeInDogePool = 0;
  dogeInDogePoolKey = 'dogeInDogePoolKey';
  doge = 0;
  dogeKey = 'dogeKey';
  dfiInDogePool = 0;
  dfiInDogePoolKey = 'dfiInDogePoolKey';

  // BCH Pool
  bchInBchPool = 0;
  bchInBchPoolKey = 'bchInBchPoolKey';
  bch = 0;
  bchKey = 'bchKey';
  dfiInBchPoolKey = 'dfiInBchPoolKey';
  dfiInBchPool = 0;

}

export class StakingCalc extends Outcome {
  dfiAmount = 10000;
  apy = 38;
}

export class StakingCake extends Outcome {
}

export class StakingCalcMN extends Outcome {
}

export class Currencies {
  usd: USD;
}

export class USD {
  eur: number;
  chf: number;
  gbp: number;
  aud: number;
  rub: number;
  jpy: number;
  cad: number;
  cny: number;
  sgd: number;
}
