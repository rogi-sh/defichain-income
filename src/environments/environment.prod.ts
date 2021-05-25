export const environment = {
  production: false,
  listyieldfarming: 'https://api.defichain.io/v1/listyieldfarming?network=mainnet',
  poolDetails: 'https://api.defichain.io/v1/getpoolpair?id=',
  listpoolpairs: 'https://api.defichain.io/v1/listpoolpairs',
  accountDetails: 'https://api.defichain.io/v1/getaccount?start=0&including_start=true&owner=',
  balance: 'https://mainnet-api.defichain.io/api/DFI/mainnet/address/SET-ADDRESS/balance',
  health: 'https://api.defichain.io/ok',
  stats: 'https://api.defichain.io/v1/stats',
  cur: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
  cake: 'https://api.cakedefi.com/staking',
  defichainnode: 'https://api.mydeficha.in/v1/listmasternodes/?count=True',
  version: '6.3.1',
  graphql: 'https://graphql.defichain-income.com/graphql',
  // Matomo
  matomoId: 6,
  matomoUrl: 'https://analytics.topiet.de/'
};
