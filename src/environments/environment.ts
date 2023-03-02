// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const ocean = 'https://ocean.defichain.com';

export const environment = {
  production: false,
  prices: ocean + '/v0/mainnet/prices?size=1000',
  oraclePrices: ocean + '/v0/mainnet/loans/tokens?size=1000',
  collateralTokens: ocean + '/v0/mainnet/loans/collaterals?size=1000',
  poolpairsocean: ocean + '/v0/mainnet/poolpairs?size=1000',
  cur: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
  cake: 'https://api.cakedefi.com/coins/apy',
  dfx: 'https://api.dfx.swiss/v1/statistic',
  oceanstats: ocean + '/v0/mainnet/stats',
  blocks: ocean + '/v0/mainnet/blocks?size=2000',
  account_tokens: ocean + '/v0/mainnet/address/ADDRESS/tokens?size=1000',
  account_balance: ocean + '/v0/mainnet/address/ADDRESS/balance?size=1000',
  address_vaults: ocean + '/v0/mainnet/address/ADDRESS_VAULTS/vaults?size=1000',
  mamon_account: 'https://sync.defichain-masternode-monitor.com/v1/KEY/masternodes',
  mamon_account_node: 'https://api.defichain-masternode-monitor.com/v1/masternodes/info/',
  burninfo: 'https://api.mydefichain.com/v1/getburninfo/',
  lock: 'https://api.lock.space/v1/staking/balance?userAddress=',
  lockStats: 'https://api.lock.space/v1/analytics/staking?asset=DFI&blockchain=DeFiChain&strategy=Masternode',
  version: '10.2.6',
  graphql: 'https://next-graphql.defichain-income.com/graphql',
  income: 'https://next-graphql.defichain-income.com/income',
  // Matomo
  // No tracking for local -> wrong id
  matomoId: 25,
  matomoUrl: 'https://analytics.topiet.de/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
