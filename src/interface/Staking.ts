export class CakeStaking {
  staking: Share [];
}

export class Share {
  id: string;
  apy: number;
}

export class OceanStats {
  data: StatsData;
}

export class StatsData {
  count: Count;
  masternodes: Masternodes;
  burned: Burned;
  emission: Emisssion;
  tvl: Tvl;
  loan: Loan;
}
export class Loan {
  count: CountLoan;
  value: ValueLoan;
}

export class CountLoan {
  collateralTokens: number;
  loanTokens: number;
  openAuctions: number;
  openVaults: number;
  schemes: number;
}

export class ValueLoan {
  collateral: number;
  loan: number;
}

export class Tvl {
  total: number;
  dex: number;
  masternodes: number;
  loan: number;
}

export class Burned {
  total: number;
}
export class Count {
  blocks: number;
  masternodes: number;
  prices: number;
  tokens: number;
}

export class Emisssion {
  masternode: number;
  dex: number;
  community: number;
  anchor: number;
  burned: number;
  total: number;
}

export class Masternodes {
  locked: LockedMasternodes [];
}

export class LockedMasternodes {
  weeks: number;
  count: number;
  tvl: number;
}
