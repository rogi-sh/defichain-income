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

export class PoolBtcOut {
  dfiPerMinBtc: number;
  dfiPerHourBtc: number;
  dfiPerDayBtc: number;
  dfiPerWeekBtc: number;
  dfiPerMonthBtc: number;
}

export class PoolEthOut {
  dfiPerMinEth: number;
  dfiPerHourEth: number;
  dfiPerDayEth: number;
  dfiPerWeekEth: number;
  dfiPerMonthEth: number;
}

export class PoolUsdtOut {
  dfiPerMinUsdt: number;
  dfiPerHourUsdt: number;
  dfiPerDayUsdt: number;
  dfiPerWeekUsdt: number;
  dfiPerMonthUsdt: number;
}

export class PoolOut {
  dfiPerMin: number;
  dfiPerHour: number;
  dfiPerDay: number;
  dfiPerWeek: number;
  dfiPerMonth: number;
}

export class StakingOut {
  dfiPerMin: number;
  dfiPerHour: number;
  dfiPerDay: number;
  dfiPerWeek: number;
  dfiPerMonth: number;
}


