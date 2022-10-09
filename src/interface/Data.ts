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
  ApexMarkers, ApexTheme,
} from 'ng-apexcharts';
import { Outcome, Pool } from './Dex';

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

export class PoolPairsOcean {
  data: Array<PoolPairOcean>;
}

export class PoolPairOcean {
  id: string;
  symbol: string;
  rewardPct: string;
  rewardLoanPct: string;
  volume: PoolPairVolume;
  apr: PoolPairApr;
  totalLiquidity: Liquidity;
  priceRatio: PriceRatio;
  tokenA: Token;
  tokenB: Token;
}

export class Fee {
  pct: string;
  inPct: string;
  outPct: string;
}

export class Token {
  symbol: string;
  displaySymbol: string;
  id: string;
  reserve: string;
  blockCommission: string;
  fee: Fee;
}

export class PriceRatio {
  ab: string;
  ba: string;
}

export class Liquidity {
  token: string;
  usd: string;
}

export class PoolPairVolume {
  h24: number;
  d30: number;
}

export class PoolPairApr {
  reward: number;
  commission: number;
  total: number;
}

export class Burn {
  paybackburn: Array<string>;
  dfipaybackfee: number;
  auctionburn: number;
  feeburn: number;
  amount: number;
}

export class StockOracle {
  activePrice: OraclePriceActive;
  token: OrcalePrice;
  factor: string;
  interest: string;
}

export class OrcalePrice {
    id: string;
    symbol: string;
    symbolKey: string;
}

export class OraclePriceActive {
  active: OraclePriceActiveAmount;
  next: OraclePriceActiveAmount;
}

export class OraclePriceActiveAmount {
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
  interestValue: string;
  collateralAmounts: Array<CollateralAmount>;
  loanAmounts: Array<LoanAmount>;
  interestAmounts: Array<LoanAmount>;
  loanScheme: LoanSchema;
}

export class CollateralAmount {
  amount: string;
  symbol: string;
  symbolKey: string;
  activePrice: ActivePrice;
}

export class LoanAmount {
  amount: string;
  symbol: string;
  symbolKey: string;
  activePrice: ActivePrice;
}

export class LoanSchema {
  id: string;
  minColRatio: string;
  interestRate: string;
}

export class ActivePrice {
  active: Price;
  next: Price;
}

export class Price {
  amount: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
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
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
};

export class Series {
  data: Array<number>;
  name: string;
}

export interface WalletDto {
  dfi: number;

  dfiInStaking: number;
  dfiInDfxStaking: number;

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

  amznusd: number;
  nvdausd: number;
  coinusd: number;
  eemusd: number;

  msftusd: number;
  fbusd: number;
  nflxusd: number;
  voousd: number;

  disusd: number;
  mchiusd: number;
  mstrusd: number;
  intcusd: number;

  pyplusd: number;
  brkbusd: number;
  kousd: number;
  pgusd: number;

  sapusd: number;
  gsgusd: number;
  csusd: number;
  urausd: number;

  tanusd: number;
  xomusd: number;
  govtusd: number;
  ppltusd: number;

  daxusd: number;
  gsusd: number;
  addyyusd: number;
  jnjusd: number;

  wmtusd: number;
  ulusd: number;
  ungusd: number;
  usousd: number;

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

  // AMZN Pool
  amznInAmznPool: number;
  amzn: number;
  usdInAmznPool: number;

  // NVDA Pool
  nvdaInNvdaPool: number;
  nvda: number;
  usdInNvdaPool: number;

  // COIN Pool
  coinInCoinPool: number;
  coin: number;
  usdInCoinPool: number;

  // EEM Pool
  eemInEemPool: number;
  eem: number;
  usdInEemPool: number;

  // MSFT Pool
  msftInMsftPool: number;
  msft: number;
  usdInMsftPool: number;

  // FB Pool
  fbInFbPool: number;
  fb: number;
  usdInFbPool: number;

  // NFLX Pool
  nflxInNflxPool: number;
  nflx: number;
  usdInNflxPool: number;

  // VOO Pool
  vooInVooPool: number;
  voo: number;
  usdInVooPool: number;

  // DIS Pool
  disInDisPool: number;
  dis: number;
  usdInDisPool: number;

  // MCHI Pool
  mchiInMchiPool: number;
  mchi: number;
  usdInMchiPool: number;

  // MSTR Pool
  mstrInMstrPool: number;
  mstr: number;
  usdInMstrPool: number;

  // INTC Pool
  intcInIntcPool: number;
  intc: number;
  usdInIntcPool: number;

  // PYPL Pool
  pyplInPyplPool: number;
  pypl: number;
  usdInPyplPool: number;

  // BRKB Pool
  brkbInBrkbPool: number;
  brkb: number;
  usdInBrkbPool: number;

  // KO Pool
  koInKoPool: number;
  ko: number;
  usdInKoPool: number;

  // PG Pool
  pgInPgPool: number;
  pg: number;
  usdInPgPool: number;

  // SAP Pool
  sapInSapPool: number;
  sap: number;
  usdInSapPool: number;

  // GSG Pool
  gsgInGsgPool: number;
  gsg: number;
  usdInGsgPool: number;

  // CS Pool
  csInCsPool: number;
  cs: number;
  usdInCsPool: number;

  // URA Pool
  uraInUraPool: number;
  ura: number;
  usdInUraPool: number;

  // PPLT Pool
  ppltInPpltPool: number;
  pplt: number;
  usdInPpltPool: number;

  // GOVT Pool
  govtInGovtPool: number;
  govt: number;
  usdInGovtPool: number;

  // TAN Pool
  tanInTanPool: number;
  tan: number;
  usdInTanPool: number;

  // XOM Pool
  xomInXomPool: number;
  xom: number;
  usdInXomPool: number;

  // JNJ Pool
  jnjInJnjPool: number;
  jnj: number;
  usdInJnjPool: number;

  // ADDYY Pool
  addyyInAddyyPool: number;
  addyy: number;
  usdInAddyyPool: number;

  // GS Pool
  gsInGsPool: number;
  gs: number;
  usdInGsPool: number;

  // DAX Pool
  daxInDaxPool: number;
  dax: number;
  usdInDaxPool: number;

  // WMT Pool
  wmtInWmtPool: number;
  wmt: number;
  usdInWmtPool: number;

  // UL Pool
  ulInUlPool: number;
  ul: number;
  usdInUlPool: number;

  // UNG Pool
  ungInUngPool: number;
  ung: number;
  usdInUngPool: number;

  // USO Pool
  usoInUsoPool: number;
  uso: number;
  usdInUsoPool: number;

}

export class Newsletter {
  email: string;
  payingAddress: string;
  status: string;
  subscribed: Date;
}

export class Wallet {

  dfi = 0;
  dfiKey = 'dfiKey';

  dfiInStaking = 0;
  dfiInDfxStaking = 0;
  dfiInStakingKey = 'dfiInStakingKey';

  dfiInMasternodes = 0;

  btcdfi = 0;
  bchdfi = 0;
  ethdfi = 0;
  ltcdfi = 0;
  dogedfi = 0;
  usdtdfi = 0;
  usdcdfi = 0;
  usdtdusd = 0;
  usdcdusd = 0;
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

  amznusd = 0;
  nvdausd = 0;
  coinusd = 0;
  eemusd = 0;

  msftusd = 0;
  fbusd = 0;
  nflxusd = 0;
  voousd = 0;

  disusd = 0;
  mchiusd = 0;
  mstrusd = 0;
  intcusd = 0;

    pyplusd = 0;
  brkbusd = 0;
  kousd = 0;
  pgusd = 0;

  sapusd = 0;
  urausd = 0;
  csusd = 0;
  gsgusd = 0;

  ppltusd = 0;
  xomusd = 0;
  govtusd = 0;
  tanusd = 0;

  jnjusd = 0;
  gsusd = 0;
  daxusd = 0;
  addyyusd = 0;

  wmtusd = 0;
  ulusd = 0;
  ungusd = 0;
  usousd = 0;

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

  // USDT-DUSD Pool
  usdtInUsdtDusdPool = 0;
  usdtInUsdtDusdPoolKey = 'usdtInUsdtDusdPoolKey';
  usdtDusd = 0;
  usdtDusdKey = 'usdtDusdKey';
  dusdInUsdtDusdPool = 0;
  dusdInUsdtDusdPoollKey = 'dusdInUsdtDusdPoollKey';

  // USDC Pool
  usdcInUsdcPool = 0;
  usdcInUsdcPoolKey = 'usdcInUsdcPoolKey';
  usdc = 0;
  usdcKey = 'usdcKey';
  dfiInUsdcPool = 0;
  dfiInUsdcPoolKey = 'dfiInUsdcPoolKey';

  // USDC-DUSD Pool
  usdcInUsdcDusdPool = 0;
  usdcInUsdcDusdPoolKey = 'usdcInUsdcDusdPoolKey';
  usdcDusd = 0;
  usdcDusdKey = 'usdcDusdKey';
  dusdInUsdcDusdPool = 0;
  dusdInUsdcDusdPoolKey = 'dusdInUsdcDusdPoolKey';

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

  // AMZN Pool
  amznInAmznPool = 0;
  amznInAmznPoolKey = 'amznInAmznPoolKey';
  amzn = 0;
  amznKey = 'amznKey';
  usdInAmznPoolKey = 'usdInAmznPoolKey';
  usdInAmznPool = 0;

  // NVDA Pool
  nvdaInNvdaPool = 0;
  nvdaInNvdaPoolKey = 'nvdaInNvdaPoolKey';
  nvda = 0;
  nvdaKey = 'nvdaKey';
  usdInNvdaPoolKey = 'usdInNvdaPoolKey';
  usdInNvdaPool = 0;

  // COIN Pool
  coinInCoinPool = 0;
  coinInCoinPoolKey = 'coinInCoinPoolKey';
  coin = 0;
  coinKey = 'coinKey';
  usdInCoinPoolKey = 'usdInCoinPoolKey';
  usdInCoinPool = 0;

  // EEM Pool
  eemInEemPool = 0;
  eemInEemPoolKey = 'eemInEemPoolKey';
  eem = 0;
  eemKey = 'eemKey';
  usdInEemPoolKey = 'usdInEemPoolKey';
  usdInEemPool = 0;

  // MSFT Pool
  msftInMsftPool = 0;
  msftInMsftPoolKey = 'msftInMsftPoolKey';
  msft = 0;
  msftKey = 'msftKey';
  usdInMsftPoolKey = 'usdInMsftPoolKey';
  usdInMsftPool = 0;

  // FB Pool
  fbInFbPool = 0;
  fbInFbPoolKey = 'fbInFbPoolKey';
  fb = 0;
  fbKey = 'fbKey';
  usdInFbPoolKey = 'usdInFbPoolKey';
  usdInFbPool = 0;

  // NFLX Pool
  nflxInNflxPool = 0;
  nflxInNflxPoolKey = 'coinInCoinPoolKey';
  nflx = 0;
  nflxKey = 'nflxKey';
  usdInNflxPoolKey = 'usdInNflxPoolKey';
  usdInNflxPool = 0;

  // VOO Pool
  vooInVooPool = 0;
  vooInVooPoolKey = 'vooInVooPoolKey';
  voo = 0;
  vooKey = 'vooKey';
  usdInVooPoolKey = 'usdInVooPoolKey';
  usdInVooPool = 0;

  // DIS Pool
  disInDisPool = 0;
  disInDisPoolKey = 'disInDisPoolKey';
  dis = 0;
  disKey = 'disKey';
  usdInDisPoolKey = 'usdInDisPoolKey';
  usdInDisPool = 0;

  // MCHI Pool
  mchiInMchiPool = 0;
  mchiInMchiPoolKey = 'mchiInMchiPoolKey';
  mchi = 0;
  mchiKey = 'mchiKey';
  usdInMchiPoolKey = 'usdInMchiPoolKey';
  usdInMchiPool = 0;

  // MSTR Pool
  mstrInMstrPool = 0;
  mstrInMstrPoolKey = 'mstrInMstrPoolKey';
  mstr = 0;
  mstrKey = 'mstrKey';
  usdInMstrPoolKey = 'usdInMstrPoolKey';
  usdInMstrPool = 0;

  // INTC Pool
  intcInIntcPool = 0;
  intcInIntcPoolKey = 'intcInIntcPoolKey';
  intc = 0;
  intcKey = 'intcKey';
  usdInIntcPoolKey = 'usdInIntcPoolKey';
  usdInIntcPool = 0;

  // PYPL Pool
  pyplInPyplPool = 0;
  pyplInPyplPoolKey = 'pyplInPyplPoolKey';
  pypl = 0;
  pyplKey = 'pyplKey';
  usdInPyplPoolKey = 'usdInPyplPoolKey';
  usdInPyplPool = 0;

  // BRKB Pool
  brkbInBrkbPool = 0;
  brkbInBrkbPoolKey = 'brkbInBrkbPoolKey';
  brkb = 0;
  brkbKey = 'brkbKey';
  usdInBrkbPoolKey = 'usdInBrkbPoolKey';
  usdInBrkbPool = 0;

  // KO Pool
  koInKoPool = 0;
  koInKoPoolKey = 'koInKoPoolKey';
  ko = 0;
  koKey = 'koKey';
  usdInKoPoolKey = 'usdInKoPoolKey';
  usdInKoPool = 0;

  // PG Pool
  pgInPgPool = 0;
  pgInPgPoolKey = 'pgInPgPoolKey';
  pg = 0;
  pgKey = 'pgKey';
  usdInPgPoolKey = 'usdInPgPoolKey';
  usdInPgPool = 0;

  // SAP Pool
  sapInSapPool = 0;
  sapInSapPoolKey = 'sapInSapPoolKey';
  sap = 0;
  sapKey = 'sapKey';
  usdInSapPoolKey = 'usdInSapPoolKey';
  usdInSapPool = 0;

  // URA Pool
  uraInUraPool = 0;
  uraInUraPoolKey = 'uraInUraPoolKey';
  ura = 0;
  uraKey = 'uraKey';
  usdInUraPoolKey = 'usdInUraPoolKey';
  usdInUraPool = 0;

  // GSG Pool
  gsgInGsgPool = 0;
  gsgInGsgPoolKey = 'gsgInGsgPoolKey';
  gsg = 0;
  gsgKey = 'gsgKey';
  usdInGsgPoolKey = 'usdInGsgPoolKey';
  usdInGsgPool = 0;

  // CS Pool
  csInCsPool = 0;
  csInCsPoolKey = 'csInCsPoolKey';
  cs = 0;
  csKey = 'csKey';
  usdInCsPoolKey = 'usdInCsPoolKey';
  usdInCsPool = 0;

  // PPLT Pool
  ppltInPpltPool = 0;
  ppltInPpltPoolKey = 'ppltInPpltPoolKey';
  pplt = 0;
  ppltKey = 'ppltKey';
  usdInPpltPoolKey = 'usdInPpltPoolKey';
  usdInPpltPool = 0;

  // XOM Pool
  xomInXomPool = 0;
  xomInXomPoolKey = 'xomInXomPoolKey';
  xom = 0;
  xomKey = 'xomKey';
  usdInXomPoolKey = 'usdInXomPoolKey';
  usdInXomPool = 0;

  // GOVT Pool
  govtInGovtPool = 0;
  govtInGovtPoolKey = 'govtInGovtPoolKey';
  govt = 0;
  govtKey = 'govtKey';
  usdInGovtPoolKey = 'usdInGovtPoolKey';
  usdInGovtPool = 0;

  // TAN Pool
  tanInTanPool = 0;
  tanInTanPoolKey = 'tanInTanPoolKey';
  tan = 0;
  tanKey = 'tanKey';
  usdInTanPoolKey = 'usdInTanPoolKey';
  usdInTanPool = 0;

  // JNJ Pool
  jnjInJnjPool = 0;
  jnjInJnjPoolKey = 'jnjInJnjPoolKey';
  jnj = 0;
  jnjKey = 'jnjKey';
  usdInJnjPoolKey = 'usdInJnjPoolKey';
  usdInJnjPool = 0;

  // ADDYY Pool
  addyyInAddyyPool = 0;
  addyyInAddyyPoolKey = 'addyyInAddyyPoolKey';
  addyy = 0;
  addyyKey = 'addyyKey';
  usdInAddyyPoolKey = 'usdInAddyyPoolKey';
  usdInAddyyPool = 0;

  // GS Pool
  gsInGsPool = 0;
  gsInGsPoolKey = 'gsInGsPoolKey';
  gs = 0;
  gsKey = 'gsKey';
  usdInGsPoolKey = 'usdInGsPoolKey';
  usdInGsPool = 0;

  // DAX Pool
  daxInDaxPool = 0;
  daxInDaxPoolKey = 'daxInDaxPoolKey';
  dax = 0;
  daxKey = 'daxKey';
  usdInDaxPoolKey = 'usdInDaxPoolKey';
  usdInDaxPool = 0;

  // WMT Pool
  wmtInWmtPool = 0;
  wmtInWmtPoolKey = 'wmtInWmtPoolKey';
  wmt = 0;
  wmtKey = 'wmtKey';
  usdInWmtPoolKey = 'usdInWmtPoolKey';
  usdInWmtPool = 0;

  // Ul Pool
  ulInUlPool = 0;
  ulInUlPoolKey = 'ulInUlPoolKey';
  ul = 0;
  ulKey = 'ulKey';
  usdInUlPoolKey = 'usdInUlPoolKey';
  usdInUlPool = 0;

  // Ung Pool
  ungInUngPool = 0;
  ungInUngPoolKey = 'ungInUngPoolKey';
  ung = 0;
  ungKey = 'ungKey';
  usdInUngPoolKey = 'usdInUngPoolKey';
  usdInUngPool = 0;

  // Uso Pool
  usoInUsoPool = 0;
  usoInUsoPoolKey = 'usoInUsoPoolKey';
  uso = 0;
  usoKey = 'ungKey';
  usdInUsoPoolKey = 'usdInUsoPoolKey';
  usdInUsoPool = 0;

}

export class StakingCalc extends Outcome {
  dfiAmount = 10000;
  apy = 38;
}

export class LoanValue {
  token: string;
  pool: Pool;

  constructor(token: string, pool: Pool) {
    this.token = token;
    this.pool = pool;
  }
}

export class HoldingValue {
  name: string;
  holding: number;
  holdingUsd: number;

  constructor(name: string, holding: number, holdingUsd: number) {
    this.name = name;
    this.holding = holding;
    this.holdingUsd = holdingUsd;
  }
}

export class PoolIncomeValue {
  anteil: number;
  pool: Pool;
  poolOut: Outcome;
  blockReward: number;

  constructor(anteil: number, pool: Pool, poolOut: Outcome, blockReward: number) {
    this.anteil = anteil;
    this.pool = pool;
    this.poolOut = poolOut;
    this.blockReward = blockReward;
  }
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
  hkd: number;
}

export class Exchange {
  bittrexStatus: string;
  bittrexNotice: string;
  kucoinStatusDeposit: boolean;
  kucoinStatusWithdraw: boolean;
  kucoinStatusDepositErc20: boolean;
  kucoinStatusWithdrawErc20: boolean;
  dfxBuy: string;
  dfxSell: string;
  dfxStaking: string;
  huobiStatus: string;
}

export class UserHistoryItem {
  date: Date;
  totalValue: number;
  totalValueIncomeDfi: number;
  totalValueIncomeUsd: number;
  // tslint:disable-next-line:variable-name
  _id: string;
}

export class UserHistory {
  key: string;
  values: Array<UserHistoryItem>;
}

export class PriceHistory {
  price: number;
  dateTime: Date;
}

export class UserHistoryDelete {
  toDelete: boolean;
  historyItem: UserHistoryItem;
}
