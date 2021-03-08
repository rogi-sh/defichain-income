import {ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexStroke, ApexPlotOptions, ApexYAxis, ApexTooltip} from 'ng-apexcharts';
import {Outcome} from './Dex';

export class Data {
  name: string;
  value: number;
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

export class Wallet {
  dfi = 0;
  dfiKey = 'dfiKey';

  btcdfi = 0;
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

}

export class StakingCalc extends Outcome {
  dfiAmount = 10000;
  apy = 43.598;
}

export class StakingCalcNormal extends Outcome {}

export class StakingCalcMN extends Outcome {}
