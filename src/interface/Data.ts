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
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexMarkers
} from 'ng-apexcharts';
import {Outcome} from './Dex';

export class Data {
  name: string;
  value: number;
}

export class Blocks {
  data: Array<Block>;
}

export class Block {
  hash: string;
  height: number;
  time: number;
}

export class StockOracles {
  data: Array<StockOracle>;
}

export class StockOracle {
  id: string;
  price: OrcalePrice;
}

export class OrcalePrice {
    aggregated: OraclePriceAggregated;
}

export class OraclePriceAggregated {
  amount: string;
}

export class Balance {
  confirmed: number;
  balance: number;
}

export class AddressVaults {
  data: Array<Vault>;
}

export class Vault {
  vaultId: string;
  ownerAddress: string;
  state: string;
  informativeRatio: string;
  collateralRatio: string;
  collateralValue: string;
  loanValue: string;
  interestValue: number;
  collateralAmounts: Array<CollateralAmount>;
  loanAmounts: Array<LoanAmount>;
}

export class CollateralAmount {
  amount: string;
  symbol: string;
  symbolKey: string;
}

export class LoanAmount {
  amount: string;
  symbol: string;
  symbolKey: string;
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
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
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
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

export type ChartOptions6 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export class Series {
  data: Array<number>;
  name: string;
}

export interface WalletDto {
  dfi: number;

  dfiInStaking: number;

  btcdfi: number;
  ethdfi: number;
  ltcdfi: number;
  dogedfi: number;
  usdtdfi: number;
  usdcdfi: number;
  bchdfi: number;
  usddfi: number;

  tslausd: number;
  qqqusd: number;
  spyusd: number;
  pltrusd: number;
  slvusd: number;
  aaplusd: number;
  gldusd: number;
  gmeusd: number;
  googlusd: number;
  arkkusd: number;
  babausd: number;
  vnqusd: number;
  urthusd: number;
  tltusd: number;
  pdbcusd: number;

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

  // USDC Pool
  usdcInUsdcPool: number;
  usdc: number;
  dfiInUsdcPool: number;

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

  // USD Pool
  usdInUsdPool: number;
  usd: number;
  dfiInUsdPool: number;

  // TSLA Pool
  tslaInTslaPool: number;
  tsla: number;
  usdInTslaPool: number;

  // QQQ Pool
  qqqInQqqPool: number;
  qqq: number;
  usdInQqqPool: number;

  // SPY Pool
  spyInSpyPool: number;
  spy: number;
  usdInSpyPool: number;

  // PLTR Pool
  pltrInPltrPool: number;
  pltr: number;
  usdInPltrPool: number;

  // SLV Pool
  slvInSlvPool: number;
  slv: number;
  usdInSlvPool: number;

  // AAPL Pool
  aaplInAaplPool: number;
  aapl: number;
  usdInAaplPool: number;

  // GLD Pool
  gldInGldPool: number;
  gld: number;
  usdInGldPool: number;

  // GME Pool
  gmeInGmePool: number;
  gme: number;
  usdInGmePool: number;

  // GOOGL Pool
  googlInGooglPool: number;
  googl: number;
  usdInGooglPool: number;

  // ARKK Pool
  arkkInArkkPool: number;
  arkk: number;
  usdInArkkPool: number;

  // BABA Pool
  babaInBabaPool: number;
  baba: number;
  usdInBabaPool: number;

  // VNQ Pool
  vnqInVnqPool: number;
  vnq: number;
  usdInVnqPool: number;

  // URTH Pool
  urthInUrthPool: number;
  urth: number;
  usdInUrthPool: number;

  // TLT Pool
  tltInTltPool: number;
  tlt: number;
  usdInTltPool: number;

  // PDBC Pool
  pdbcInPdbcPool: number;
  pdbc: number;
  usdInPdbcPool: number;

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
  usdcdfi = 0;
  usddfi = 0;

  tslausd = 0;
  qqqusd = 0;
  spyusd = 0;
  pltrusd = 0;
  slvusd = 0;
  aaplusd = 0;
  gldusd = 0;
  gmeusd = 0;
  googlusd = 0;
  arkkusd = 0;
  babausd = 0;
  vnqusd = 0;
  urthusd = 0;
  tltusd = 0;
  pdbcusd = 0;

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

  // USDC Pool
  usdcInUsdcPool = 0;
  usdcInUsdcPoolKey = 'usdcInUsdcPoolKey';
  usdc = 0;
  usdcKey = 'usdcKey';
  dfiInUsdcPool = 0;
  dfiInUsdcPoolKey = 'dfiInUsdcPoolKey';

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

  // USD Pool
  usdInUsdPool = 0;
  usdInUsdPoolKey = 'usdInUsdPoolKey';
  usd = 0;
  usdKey = 'usdKey';
  dfiInUsdPoolKey = 'dfiInUsdPoolKey';
  dfiInUsdPool = 0;

  // TSLA Pool
  tslaInTslaPool = 0;
  tslaInTslaPoolKey = 'tslaInTslaPoolKey';
  tsla = 0;
  tslaKey = 'tslaKey';
  usdInTslaPoolKey = 'usdInTslaPoolKey';
  usdInTslaPool = 0;

  // QQQ Pool
  qqqInQqqPool = 0;
  qqqInQqqPoolKey = 'qqqInQqqPoolKey';
  qqq = 0;
  qqqKey = 'qqqKey';
  usdInQqqPoolKey = 'usdInQqqPoolKey';
  usdInQqqPool = 0;

  // SPY Pool
  spyInSpyPool = 0;
  spyInSpyPoolKey = 'spyInSpyPoolKey';
  spy = 0;
  spyKey = 'spyKey';
  usdInSpyPoolKey = 'usdInSpyPoolKey';
  usdInSpyPool = 0;

  // PLTR Pool
  pltrInPltrPool = 0;
  pltrInPltrPoolKey = 'pltrInPltrPoolKey';
  pltr = 0;
  pltrKey = 'pltrKey';
  usdInPltrPoolKey = 'usdInPltrPoolKey';
  usdInPltrPool = 0;

  // SLV Pool
  slvInSlvPool = 0;
  slvInSlvPoolKey = 'slvInSlvPoolKey';
  slv = 0;
  slvKey = 'slvKey';
  usdInSlvPoolKey = 'usdInSlvPoolKey';
  usdInSlvPool = 0;

  // AAPL Pool
  aaplInAaplPool = 0;
  aaplInAaplPoolKey = 'aaplInAaplPoolKey';
  aapl = 0;
  aaplKey = 'aaplKey';
  usdInAaplPoolKey = 'usdInAaplPoolKey';
  usdInAaplPool = 0;

  // GLD Pool
  gldInGldPool = 0;
  gldInGldPoolKey = 'gldInGldPoolKey';
  gld = 0;
  gldKey = 'gldKey';
  usdInGldPoolKey = 'usdInGldPoolKey';
  usdInGldPool = 0;

  // GME Pool
  gmeInGmePool = 0;
  gmeInGmePoolKey = 'gmeInGmePoolKey';
  gme = 0;
  gmeKey = 'gmeKey';
  usdInGmePoolKey = 'usdInGmePoolKey';
  usdInGmePool = 0;

  // GOOGL Pool
  googlInGooglPool = 0;
  googlInGooglPoolKey = 'googlInGooglPoolKey';
  googl = 0;
  googlKey = 'googlKey';
  usdInGooglPoolKey = 'usdInGooglPoolKey';
  usdInGooglPool = 0;

  // ARKK Pool
  arkkInArkkPool = 0;
  arkkInArkkPoolKey = 'arkkInArkkPoolKey';
  arkk = 0;
  arkkKey = 'arkkKey';
  usdInArkkPoolKey = 'usdInArkkPoolKey';
  usdInArkkPool = 0;

  // BABA Pool
  babaInBabaPool = 0;
  babaInBabaPoolKey = 'babaInBabaPoolKey';
  baba = 0;
  babaKey = 'babaKey';
  usdInBabaPoolKey = 'usdInBabaPoolKey';
  usdInBabaPool = 0;

  // VNQ Pool
  vnqInVnqPool = 0;
  vnqInVnqPoolKey = 'vnqInVnqPoolKey';
  vnq = 0;
  vnqKey = 'vnqKey';
  usdInVnqPoolKey = 'usdInVnqPoolKey';
  usdInVnqPool = 0;

  // URTH Pool
  urthInUrthPool = 0;
  urthInUrthPoolKey = 'urthInUrthPoolKey';
  urth = 0;
  urthKey = 'vnqKey';
  usdInUrthPoolKey = 'usdInUrthPoolKey';
  usdInUrthPool = 0;

  // TLT Pool
  tltInTltPool = 0;
  tltInTltPoolKey = 'tltInTltPoolKey';
  tlt = 0;
  tltKey = 'tltKey';
  usdInTltPoolKey = 'usdInTltPoolKey';
  usdInTltPool = 0;

  // PDBC Pool
  pdbcInPdbcPool = 0;
  pdbcInPdbcPoolKey = 'pdbcInPdbcPoolKey';
  pdbc = 0;
  pdbcKey = 'pdbcKey';
  usdInPdbcPoolKey = 'usdInPdbcPoolKey';
  usdInPdbcPool = 0;

}

export class IncomePoolDto {
  pool; Pool;
  anteil: number;
  poolOut: Outcome;
  pairPoolTokenInWallet: number;
  dfiOrUsdPoolTokenInWallet: number;
  blockRewardPool: number;

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

export class Exchange {
  bittrexStatus: string;
  bittrexNotice: string;
  kucoinStatusDeposit: boolean;
  kucoinStatusWithdraw: boolean;
}
