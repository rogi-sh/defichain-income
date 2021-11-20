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
