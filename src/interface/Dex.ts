export interface DexInfo {
  pools: Pool [];
  tvl: number;
  provider_logo: string;
}

export interface DexPoolPair {
  '4': Pool;
  '5': Pool;
  '6': Pool;
  '8': Pool;
  '10': Pool;
  '12': Pool;
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
  apy: number;
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

}

export class PoolPair {
  dfi: number;
  poolPairToken: number;
}


export class AddressBalance {
  address: string;
  masternode: boolean;

  dfiCoins: number;
  dfiTokens: number;

  btcToken: number;
  ltcToken: number;
  ethToken: number;
  dogeToken: number;
  bchToken: number;
  usdtToken: number;

  btcdfiToken: number;
  ltcdfiToken: number;
  ethdfiToken: number;
  dogedfiToken: number;
  bchdfiToken: number;
  usdtdfiToken: number;

}

export class Outcome {
  dfiPerMin: number;
  dfiPerHour: number;
  dfiPerDay: number;
  dfiPerWeek: number;
  dfiPerMonth: number;
  dfiPerYear: number;
}

export class PoolBtcOut extends Outcome {}

export class PoolBchOut extends Outcome {}

export class PoolEthOut extends Outcome {}

export class PoolUsdtOut extends Outcome {}

export class PoolLtcOut extends Outcome {}

export class PoolDogeOut extends Outcome {}

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

  btcPricesDex: [number];
  ethPricesDex: [number];
  ltcPricesDex: [number];
  dogePricesDex: [number];
  bchPricesDex: [number];
  usdtPricesDex: [number];
  dfiPricesDex: [number];
}
