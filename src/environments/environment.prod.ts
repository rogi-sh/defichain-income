export const environment = {
  production: false,
  listyieldfarming: 'https://api.defichain.io/v1/listyieldfarming',
  poolDetails: 'https://api.defichain.io/v1/getpoolpair?id=',
  listpoolpairs: 'https://supernode.saiive.live/api/v1/mainnet/DFI/listpoolpairs',
  accountDetails: 'https://api.defichain.io/v1/getaccount?including_start=true&owner=',
  balance: 'https://mainnet-api.defichain.io/api/DFI/mainnet/address/SET-ADDRESS/balance',
  health: 'https://api.defichain.io/ok',
  stats: 'https://api.defichain.io/v1/stats',
  cur: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
  cake: 'https://api.cakedefi.com/coins/apy',
  oceanstats: 'https://ocean.defichain.com/v0.11/mainnet/stats',
  blocks: 'https://mainnet-api.defichain.io/api/DFI/mainnet/block?limit=2000&anchorsOnly=false',
  supernode_account: 'https://supernode.saiive.live/api/v1/mainnet/DFI/account/',
  mamon_account: 'https://sync.defichain-masternode-monitor.com/v1/KEY/masternodes',
  mamon_account_node: 'https://api.defichain-masternode-monitor.com/v1/masternodes/info/',
  version: '7.17.1',
  graphql: 'https://graphql.defichain-income.com/graphql',
  // Matomo
  matomoId: 6,
  matomoUrl: 'https://analytics.topiet.de/'
};
