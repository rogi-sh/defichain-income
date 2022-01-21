// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  prices: 'https://supernode.saiive.live/api/v1/mainnet/DFI/coin-price/USD',
  oraclePrices: 'https://ocean.defichain.com/v0/mainnet/prices?size=1000',
  listpoolpairs: 'https://supernode.saiive.live/api/v1/mainnet/DFI/listpoolpairs',
  health: 'https://supernode.saiive.live/api/v1/health',
  cur: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
  cake: 'https://api.cakedefi.com/coins/apy',
  oceanstats: 'https://ocean.defichain.com/v0/mainnet/stats',
  blocks: 'https://ocean.defichain.com/v0/mainnet/blocks?size=2000',
  supernode_account: 'https://supernode.saiive.live/api/v1/mainnet/DFI/account/',
  address_vaults: 'https://ocean.defichain.com/v0/mainnet/address/ADDRESS_VAULTS/vaults',
  mamon_account: 'https://sync.defichain-masternode-monitor.com/v1/KEY/masternodes',
  mamon_account_node: 'https://api.defichain-masternode-monitor.com/v1/masternodes/info/',
  version: '8.11.7',
  graphql: 'https://graphql.defichain-income.com/graphql',
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
