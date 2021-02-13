export interface DexInfo {
  pools: Pool [];
  tvl: number;
  provider_logo: string;
}

export interface Pool {
  apr: number;
  name: string;
  pair: string;
  logo: string;
  poolRewards: string [];
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
}

export class Outcome {
  dfiPerMin: number;
  dfiPerHour: number;
  dfiPerDay: number;
  dfiPerWeek: number;
  dfiPerMonth: number;
}

export class PoolBtcOut extends Outcome {}

export class PoolEthOut extends Outcome {}

export class PoolUsdtOut extends Outcome {}

export class OutcomeStaking extends Outcome {}


