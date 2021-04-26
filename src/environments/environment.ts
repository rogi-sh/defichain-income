// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  version: '4.6.3',
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
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
