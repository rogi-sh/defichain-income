import {ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexResponsive} from 'ng-apexcharts';

export class Data {
  name: string;
  value: number;
}

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

export class Wallet {
  dfi = 0;
  btc = 0;
  eth = 0;
  ltc =  0;
  doge = 0;
  usdt = 0;
  btcdfi = 0;
  ethdfi = 0;
  ltcdfi = 0;
  dogedfi = 0;
  usdtdfi = 0;
}

