// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  listyieldfarming: 'https://api.defichain.io/v1/listyieldfarming',
  poolDetails: 'https://api.defichain.io/v1/getpoolpair?id=',
  listpoolpairs: 'https://supernode.saiive.live/api/v1/mainnet/dfi/listpoolpairs',
  accountDetails: 'https://api.defichain.io/v1/getaccount?including_start=true&owner=',
  balance: 'https://mainnet-api.defichain.io/api/DFI/mainnet/address/SET-ADDRESS/balance',
  health: 'https://api.defichain.io/ok',
  stats: 'https://api.defichain.io/v1/stats',
  cur: 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json',
  cake: 'https://api.cakedefi.com/coins/apy',
  oceanstats: 'https://ocean.defichain.com/v0.9/mainnet/stats',
  blocks: 'https://mainnet-api.defichain.io/api/DFI/mainnet/block?limit=2000&anchorsOnly=false',
  supernode_account: 'https://supernode.saiive.live/api/v1/mainnet/dfi/account/',
  mamon_account: 'https://sync.defichain-masternode-monitor.com/v1/KEY/masternodes',
  mamon_account_node: 'https://api.defichain-masternode-monitor.com/v1/masternodes/info/',
  version: '7.15.5',
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
