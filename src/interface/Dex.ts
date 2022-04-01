import { StockOracle } from '@interfaces/Data';

export interface DexPoolPair {
  '4': Pool;
  '5': Pool;
  '6': Pool;
  '8': Pool;
  '10': Pool;
  '12': Pool;
  '14': Pool;
  '17': Pool;
  '18': Pool;
  '39': Pool;
  '38': Pool;
  '35': Pool;
  '46': Pool;
  '36': Pool;
  '43': Pool;
  '25': Pool;
  '32': Pool;
  '42': Pool;
  '33': Pool;
  '41': Pool;
  '44': Pool;
  '45': Pool;
  '40': Pool;
}

export interface Prices {
  bitcoin: PriceAsset;
  tether: PriceAsset;
  dogecoin: PriceAsset;
  litecoin: PriceAsset;
  ethereum: PriceAsset;
  defichain: PriceAsset;
  bitcoincash: PriceAsset;
}

export class PriceAsset {
  coin: string;
  fiat: number;
  idToken: string;
  currency: string;
}


export interface Pool {
  apr: number;
  name: string;
  pair: string;
  logo: string;
  customRewards: string [];
  poolRewards: string [];
  rewardPct: number;
  pairLink: string;
  idTokenA: string;
  idTokenB: string;
  totalStaked: number;
  poolPairId: string;
  reserveA: string;
  reserveB: string;
  volumeA: number;
  volumeB: number;
  tokenASymbol: string;
  tokenBSymbol: string;
  priceA: number;
  priceB: number;
  totalLiquidityLpToken: number;
  totalLiquidity: number;
  totalLiquidityUsd: number;
  commission: number;
  reserveADivReserveB: number;
  reserveBDivReserveA: number;
  id: string;
  symbol: string;
  volume24h: number;
}

export class Stats {
  blockHeight: number;
  rewards: Rewards;
}

export class Rewards {
    total: number;
    community: number;
    minter: number;
    anchor: number;
    liquidity: number;
    swap: number;
    futures: number;
    options: number;
    liquidityStocks: number;

}

export class PoolPair {
  dfiOrUsdToken: number;
  poolPairToken: number;
}


export class AddressBalance {
  address: string;
  masternode: boolean;
  freezed5: boolean;
  freezed10: boolean;

  dfiCoins: number;
  dfiTokens: number;

  btcToken: number;
  ltcToken: number;
  ethToken: number;
  dogeToken: number;
  bchToken: number;
  usdtToken: number;
  usdcToken: number;
  usdToken: number;

  tslaToken: number;
  qqqToken: number;
  spyToken: number;
  pltrToken: number;
  slvToken: number;
  aaplToken: number;
  gldToken: number;
  gmeToken: number;
  googlToken: number;
  arkkToken: number;
  babaToken: number;
  vnqToken: number;
  urthToken: number;
  tltToken: number;
  pdbcToken: number;

  amznToken: number;
  coinToken: number;
  nvdaToken: number;
  eemToken: number;

  msftToken: number;
  fbToken: number;
  vooToken: number;
  nflxToken: number;

  disToken: number;
  mchiToken: number;
  mstrToken: number;
  intcToken: number;

  btcdfiToken: number;
  ltcdfiToken: number;
  ethdfiToken: number;
  dogedfiToken: number;
  bchdfiToken: number;
  usdtdfiToken: number;
  usdcdfiToken: number;
  usddfiToken: number;

  tslausdToken: number;
  qqqusdToken: number;
  spyusdToken: number;
  pltrusdToken: number;
  slvusdToken: number;
  aaplusdToken: number;
  gldusdToken: number;
  gmeusdToken: number;
  googlusdToken: number;
  arkkusdToken: number;
  babausdToken: number;
  vnqusdToken: number;
  urthusdToken: number;
  tltusdToken: number;
  pdbcusdToken: number;

  amznusdToken: number;
  nvdausdToken: number;
  coinusdToken: number;
  eemusdToken: number;

  msftusdToken: number;
  fbusdToken: number;
  voousdToken: number;
  nflxusdToken: number;

  disusdToken: number;
  mchiusdToken: number;
  mstrusdToken: number;
  intcusdToken: number;

}

export class Outcome {
  dfiPerMin = 0;
  dfiPerHour = 0;
  dfiPerDay = 0;
  dfiPerWeek = 0;
  dfiPerMonth = 0;
  dfiPerYear = 0;
}

export class PoolBtcOut extends Outcome {}

export class PoolBchOut extends Outcome {}

export class PoolEthOut extends Outcome {}

export class PoolUsdtOut extends Outcome {}

export class PoolUsdcOut extends Outcome {}

export class PoolLtcOut extends Outcome {}

export class PoolDogeOut extends Outcome {}

export class PoolUsdOut extends Outcome {}

export class PoolTslaOut extends Outcome {}

export class PoolQqqOut extends Outcome {}

export class PoolSpyOut extends Outcome {}

export class PoolPltrOut extends Outcome {}

export class PoolSlvOut extends Outcome {}

export class PoolAaplOut extends Outcome {}

export class PoolGldOut extends Outcome {}

export class PoolGmeOut extends Outcome {}

export class PoolGooglOut extends Outcome {}

export class PoolArkkOut extends Outcome {}

export class PoolBabaOut extends Outcome {}

export class PoolVnqOut extends Outcome {}

export class PoolUrthOut extends Outcome {}

export class PoolTltOut extends Outcome {}

export class PoolPdbcOut extends Outcome {}

export class PoolEemOut extends Outcome {}

export class PoolAmznOut extends Outcome {}

export class PoolNvdaOut extends Outcome {}

export class PoolCoinOut extends Outcome {}

export class PoolMsftOut extends Outcome {}

export class PoolNflxOut extends Outcome {}

export class PoolFbOut extends Outcome {}

export class PoolVooOut extends Outcome {}

export class PoolDisOut extends Outcome {}

export class PoolMchiOut extends Outcome {}

export class PoolMstrOut extends Outcome {}

export class PoolIntcOut extends Outcome {}

export class OutcomeStaking extends Outcome {}

export class PoolAllOut extends Outcome {}

export class MasternodeOutcome extends Outcome {}


export class Correlation {
  btcPool: number;
  ethPool: number;
  ltcPool: number;
  dogePool: number;
  bchPool: number;
  usdtPool: number;
  usdcPool: number;
  usdPool: number;
  tslaPool: number;

  btcPricesDex: [number];
  ethPricesDex: [number];
  ltcPricesDex: [number];
  dogePricesDex: [number];
  bchPricesDex: [number];
  usdtPricesDex: [number];
  usdcPricesDex: [number];
  usdPricesDex: [number];
  tslaPricesDex: [number];
  dfiPricesDex: [number];
}

export class IncomeStatistics {
    users: number;
    addresses: number;
    addressesMasternodes: number;
    visits: number;
}

export class History {
  date: Date;
  pools: [Pool];
}

export class HistoryPrice {
  date: Date;
  price: number;
  reserve: number;
  liquidiy: number;
  volume24h: number;
  apr: number;
}
