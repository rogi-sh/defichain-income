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

export interface Stats {
  blockHeight: number;
  rewards: Rewards;
}

export interface Rewards {
    anchorPercent: number;
    liquidityPoolPercent: number;
    communityPercent: number;
    total: number;
    community: number;
    minter: number;
    anchorReward: number;
    liquidityPool: number;

}

export class PoolPair {
  dfi: number;
  poolPairToken: number;
}


export class AddressBalance {
  address: string;

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


