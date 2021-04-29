export class CakeStaking {
  shares: Share [];
}

export class Share {
  id: string;
  name: string;
  returnPerAnnum: string;
  payoutFreq: number;
  withdrawalFee: string;
  availability: string;
  total: string;
  coinsOnSale: string;
}

export class Masternode {
  ENABLED: number;
  PRE_ENABLED: number;
  RESIGNED: number;
  PRE_RESIGNED: number;
}

