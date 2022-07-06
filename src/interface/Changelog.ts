export class Log {
  version: string;
  comment: string;
}

export class Changelog {
  logs: Array<Log>;
  log: Log;

  constructor() {

    this.logs = new Array<Log>();

    this.log = new Log();
    this.log.version = '9.2.7 - 6.7.2022';
    this.log.comment = 'Fix history >= 3m period oracle price';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.6 - 6.7.2022';
    this.log.comment = 'Fix linebreaks';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.5 - 6.7.2022';
    this.log.comment = 'Add Fees to dex table';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '9.2.4 - 6.7.2022';
    this.log.comment = 'DEX dUsd Fee added';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.3 - 5.7.2022';
    this.log.comment = 'Fix DFI Burned';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.2 - 4.7.2022';
    this.log.comment = 'Added backend support for new pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.1 - 3.7.2022';
    this.log.comment = 'Income Chart fixed for new pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.2.0 - 3.7.2022';
    this.log.comment = 'Add new dTokens';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.9 - 19.6.2022';
    this.log.comment = 'Add 24H Commission Total';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.8 - 18.6.2022';
    this.log.comment = 'Interest of dUsd in dex table';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.7 - 16.6.2022';
    this.log.comment = 'Fix dusd price';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.6 - 16.6.2022';
    this.log.comment = 'Fix lm calculator for new pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.5 - 10.6.2022';
    this.log.comment = 'Add interest for vaults';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.4 - 7.6.2022';
    this.log.comment = 'Back to defichain-income ocean';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.3 - 7.6.2022';
    this.log.comment = 'Fallback to ocean from defichain';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.2 - 6.6.2022';
    this.log.comment = 'Fix dex volume with pool without commission apr';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.1 - 6.6.2022';
    this.log.comment = 'Fix missing tokens (increase size of response)';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.1.0 - 5.6.2022';
    this.log.comment = 'Move to self hosted ocean';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.0.1 - 5.6.2022';
    this.log.comment = 'Fix Holdings View shown before data loaded';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '9.0.0 - 5.6.2022';
    this.log.comment = 'Full Switch to Ocean Api';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.6 - 2.6.2022';
    this.log.comment = 'Kucoin ERC 20 Status added in dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.5 - 31.5.2022';
    this.log.comment = 'Fix DFI price in holdings wallet, Fix ARKK loan fiat value';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.4 - 31.5.2022';
    this.log.comment = 'Fix total value with CS Pool';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.3 - 31.5.2022';
    this.log.comment = 'Better UI for DFI in header';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.2 - 31.5.2022';
    this.log.comment = 'Calculations with correct DUSD Price';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.1 - 30.5.2022';
    this.log.comment = 'Dex Pool column sortable';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.22.0 - 30.5.2022';
    this.log.comment = 'Add new pools SAP, URA, CS and GSG';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.21.2 - 11.5.2022';
    this.log.comment = 'Add dUSD current price in dex view in $ to see more easy if the peg is correct';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.21.1 - 4.5.2022';
    this.log.comment = 'Adjusted blockrewards for stockpools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.21.0 - 1.5.2022';
    this.log.comment = 'Add new pools PYPL, BRKB, KO and PG';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.20.1 - 27.4.2022';
    this.log.comment = 'Missing AMZN full name of stocks and crypto in dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.20.0 - 24.4.2022';
    this.log.comment = 'Add full name of stocks and crypto in dex view with link to the chart (clickable)';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.19.0 - 22.4.2022';
    this.log.comment = 'Add new Card for Volume and Commissions statistics in dex view';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.18.0 - 22.4.2022';
    this.log.comment = 'Next Stock price added to dex view table';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.17.2 - 19.4.2022';
    this.log.comment = 'Fix LP Tokens value in Value View';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.17.1 - 14.4.2022';
    this.log.comment = 'Blocks to future swap in dex view, fix url with address and authKey';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.17.0 - 12.4.2022';
    this.log.comment = 'DFX Staking Integration, just add your address and your staked DFI will be loaded automatically';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.9 - 11.4.2022';
    this.log.comment = 'Lib Updates, api url changes of burn info';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.8 - 10.4.2022';
    this.log.comment = 'Add oracle price history to price history chart in history view on defichain-income/history, HKD added as currency';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.7 - 7.4.2022';
    this.log.comment = 'Reload button reload the hole page';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.6 - 6.4.2022';
    this.log.comment = 'Fix new pools in manual inputs, fix nvda valueusd';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.5 - 5.4.2022';
    this.log.comment = 'Fix tauri icon on desktop app, better ui for vaults';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.4 - 4.4.2022';
    this.log.comment = 'Fix eth-dfi lp tokens value';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.3 - 3.4.2022';
    this.log.comment = 'Dex table columns premium, volume, tvl and apr are sortable';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.2 - 3.4.2022';
    this.log.comment = 'Fix msft holdings, split dex, oracle price and premium in dex table';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.1 - 2.4.2022';
    this.log.comment = 'Fix duplicated items in income, values';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.16.0 - 2.4.2022';
    this.log.comment = 'New pools added, values (holding, loan tokens, collateral tokens, wallet holdings) are now sorted ASC, remove unusefull value chart, transform chart to bars chart, massive refactorings on the technical side';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.8 - 29.3.2022';
    this.log.comment = 'Fix Graphql Link in info';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.15.7 - 29.3.2022';
    this.log.comment = 'Move to next level backend';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.6 - 28.3.2022';
    this.log.comment = 'Fix no full reload of page on refresh';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.5 - 28.3.2022';
    this.log.comment = 'Fix routing when change views, Reload hole page if refresh';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.4 - 26.3.2022';
    this.log.comment = 'Fix missing key for delete history modal in income chart';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.3 - 26.3.2022';
    this.log.comment = 'Fix not automated release';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.2 - 26.3.2022';
    this.log.comment = 'Fix reload data after delete user histories';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.1 - 26.3.2022';
    this.log.comment = 'Fix windows build';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.15.0 - 26.3.2022';
    this.log.comment = 'Added dialog to delete data in value and income history charts';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.10 - 25.3.2022';
    this.log.comment = 'German video linked, vaults sort by collateral';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.9 - 23.3.2022';
    this.log.comment = 'Build first tauri apps';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.8 - 23.3.2022';
    this.log.comment = 'Tauri builder for mac, windows and linux app';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.7 - 23.3.2022';
    this.log.comment = 'Views callable over url like defichain-income.com/income or /dex, small fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.6 - 22.3.2022';
    this.log.comment = 'UX optimizations on the dex view cards';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.5 - 19.3.2022';
    this.log.comment = 'Small UI optimizations';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.4 - 19.3.2022';
    this.log.comment = 'Fix DFX staking not loading correcty causes errors';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.3 - 18.3.2022';
    this.log.comment = 'DFX staking rates in dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.2 - 17.3.2022';
    this.log.comment = 'Fix Darkmode';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.1 - 17.3.2022';
    this.log.comment = 'Fix Spinner';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.14.0 - 17.3.2022';
    this.log.comment = 'Add commission to reward calculation, code refactoring pool income component';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.13.6 - 13.3.2022';
    this.log.comment = 'Newsletter unsubscribe added';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.13.5 - 9.3.2022';
    this.log.comment = 'QR Code for tips';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.13.4 - 9.3.2022';
    this.log.comment = 'Fix: Wrong total reward';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.13.3 - 8.3.2022';
    this.log.comment = 'Fix: No Rewards for msft pool';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.13.2 - 8.3.2022';
    this.log.comment = 'New Stock pools fully integrated';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.13.1 - 6.3.2022';
    this.log.comment = 'New Stock pool reward distribution';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.13.0 - 5.3.2022';
    this.log.comment = 'Add march pool to dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.29 - 27.2.2022';
    this.log.comment = 'Fix loading history up 3m, add volume chart to history';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.28 - 27.2.2022';
    this.log.comment = 'Add Apr history';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.27 - 25.2.2022';
    this.log.comment = 'Add Volume and detailed APR % with reward and commision split to dex table of pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.26 - 23.2.2022';
    this.log.comment = 'Toggle for Statistics in DEX View';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.25 - 21.2.2022';
    this.log.comment = 'Fix eem and nvda apr in income, better vaults style, sort vaults state and emoji';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.24 - 18.2.2022';
    this.log.comment = 'Add new language, welcome NL';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.23 - 18.2.2022';
    this.log.comment = 'Auto Update (5 s) User after add, remove or import addresses, fix history title';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.22 - 16.2.2022';
    this.log.comment = 'Fix no user history chart if total value 0';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.21 - 15.2.2022';
    this.log.comment = 'Add better tooltip with hours to charts';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.20 - 15.2.2022';
    this.log.comment = 'Fix darkmode change in value and income history charts';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.19 - 13.2.2022';
    this.log.comment = 'Fix Value and Income Chart performance';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.18 - 13.2.2022';
    this.log.comment = 'Fix DUSD colleteral in next calculation';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.17 - 12.2.2022';
    this.log.comment = 'Add burn to dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.16 - 11.2.2022';
    this.log.comment = 'Add newsletter status to newsletter page';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.15 - 10.2.2022';
    this.log.comment = 'Better History wording and styling, show only numbers if value > 0 in all numbers';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.14 - 9.2.2022';
    this.log.comment = 'Oracle Price of DFI in DEX View Crypto pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.13 - 8.2.2022';
    this.log.comment = 'Add DFX Status Staking';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.12 - 7.2.2022';
    this.log.comment = 'Add DUSD as collateral';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.11 - 6.2.2022';
    this.log.comment = 'Small fix wrong coin name in income';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.10 - 4.2.2022';
    this.log.comment = 'DUSD stock price cex from btc pool, style fixes newsletter view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.9 - 3.2.2022';
    this.log.comment = 'Disable newsletter button without authKey';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.8 - 3.2.2022';
    this.log.comment = 'Add epic pacman loading to newsletter';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.7 - 3.2.2022';
    this.log.comment = 'Add DUSD history, add better wording source address newsletter ';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.6 - 1.2.2022';
    this.log.comment = 'Add income share of the new pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.5 - 31.1.2022';
    this.log.comment = 'Mobile view fixes for vaults and newsletter';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.4 - 31.1.2022';
    this.log.comment = 'Add new pools to history';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.3 - 31.1.2022';
    this.log.comment = 'Fix lp tokens holdings';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.2 - 31.1.2022';
    this.log.comment = 'Fix address shortcuts and added links to defiscan';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.1 - 31.1.2022';
    this.log.comment = 'Fix income pool names';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.12.0 - 31.1.2022';
    this.log.comment = 'New Stocks added, new newsletter subscription';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.11.9 - 27.1.2022';
    this.log.comment = 'Fix stockname in wallet holdings section';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.8 - 25.1.2022';
    this.log.comment = 'Small UI Fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.7 - 21.1.2022';
    this.log.comment = 'Add DFX Status in Exchanges Overview';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.6 - 20.1.2022';
    this.log.comment = 'Fix lm calculator for google, add 2 decimals for btc colleteral, refresh history chart with refresh';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.5 - 17.1.2022';
    this.log.comment = 'Fix localstorage issues and authKey over url with history';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.4 - 16.1.2022';
    this.log.comment = 'Add currency to value charts, renaming usd to dusd, add clear addresses';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.3 - 14.1.2022';
    this.log.comment = 'All currencies for income and value charts';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.2 - 11.1.2022';
    this.log.comment = 'Fix use total income for history chart, not only lm';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.1 - 11.1.2022';
    this.log.comment = 'History Charts toggable, next prices and ration for vaults, better headline in value view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.11.0 - 9.1.2022';
    this.log.comment = 'Add History of total value and monthly income';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.10.3 - 8.1.2022';
    this.log.comment = 'Auto update user after load all data';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.10.2 - 6.1.2022';
    this.log.comment = 'Fix apr of cake';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.10.1 - 4.1.2022';
    this.log.comment = 'DFI in Vaults added to holdings overview, better UI for exhcange status, Small inkognito fix';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.10.0 - 4.1.2022';
    this.log.comment = 'Computed Blocktime last 200 Blocks, Exchange Status added';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.5 - 2.1.2022';
    this.log.comment = 'Remove dynamic Blocktime, fix to 30s, add volume chart and liquidity numbers fix';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.4 - 1.1.2022';
    this.log.comment = 'Hide spinner if error';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.3 - 28.12.2021';
    this.log.comment = 'Add reserve and liauidity tokens, moved history to a new view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.2 - 28.12.2021';
    this.log.comment = 'Better colors and formats for history chart';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.1 - 27.12.2021';
    this.log.comment = 'FIX: if no price from api is available';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.9.0 - 27.12.2021';
    this.log.comment = 'Add pool price history of crypto and stock pools (ex. dUSD pool)';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.8 - 25.12.2021';
    this.log.comment = 'Fix: baba pool dfi per block reward';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.7 - 23.12.2021';
    this.log.comment = 'Fix: bch pool update in manual input';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.6 - 22.12.2021';
    this.log.comment = 'Add electron';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.5 - 20.12.2021';
    this.log.comment = 'Better wording for premium in dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.4 - 18.12.2021';
    this.log.comment = 'Fix: vaults in liquidation with no colleteral and loan';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.3 - 13.12.2021';
    this.log.comment = 'Fix: try again removed, just show api offline, Just try later with reload';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.2 - 13.12.2021';
    this.log.comment = 'Fix Cake Apr';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.1 - 13.12.2021';
    this.log.comment = 'Radar Chart fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.8.0 - 12.12.2021';
    this.log.comment = 'Add Income Statistics to Dex View';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.7.0 - 11.12.2021';
    this.log.comment = 'Add Arbitrage % infos for every crypto and stock pools to dex view';
    this.logs.push(this.log);


    this.log = new Log();
    this.log.version = '8.6.1 - 10.12.2021';
    this.log.comment = 'Radar chart usd values added to Label';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.6.0 - 10.12.2021';
    this.log.comment = 'Value Chart type changed to radar. Better view of all usd values from different types, Optmized dashboard only income Chart, small fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.5.0 - 9.12.2021';
    this.log.comment = 'Dex View: Prices of DFI added to Pools table';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.6 - 9.12.2021';
    this.log.comment = 'Fix: Remove second number in total amount (green bubble in header) because it causes more confusion, add collateral and loan of all vaults';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.5 - 8.12.2021';
    this.log.comment = 'Fix: Loan value of vault always same';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.4 - 8.12.2021';
    this.log.comment = 'Fix: Dfi in staking counted twice';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.3 - 8.12.2021';
    this.log.comment = 'Loan value with dex prices';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.2 - 8.12.2021';
    this.log.comment = 'Vault values calculated with dex prices, Total holdings with loan and without loan in the header';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.1 - 7.12.2021';
    this.log.comment = 'Fix masternode dfi counted twice';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.4.0 - 7.12.2021';
    this.log.comment = 'Holdings view refactoring and restructuring, loan is treated as working capital';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.3.2 - 6.12.2021';
    this.log.comment = 'Loan Value is not part of holdings';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.3.1 - 6.12.2021';
    this.log.comment = 'Stock block reward auto computation';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.3.0 - 6.12.2021';
    this.log.comment = 'Add loans to vaults overview, add dfi per block for stock token, add more links to github, small fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.2.1 - 5.12.2021';
    this.log.comment = 'Fix value distribution chart - usd part, small typo fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.2.0 - 5.12.2021';
    this.log.comment = 'Dedicated overview of VAULTS in Value view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.1.0 - 5.12.2021';
    this.log.comment = 'Manual input of the values for the new pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '8.0.0 - 4.12.2021';
    this.log.comment = 'Fort Canning Features: Stock Pools, Api deprication move to saiive, fix api issues';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.5 - 1.12.2021';
    this.log.comment = 'Fix stocks pool missing for income calc, fix price of dfi in btc pool';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.4 - 30.11.2021';
    this.log.comment = 'Fix lp token value';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.3 - 30.11.2021';
    this.log.comment = 'Fix overall USD not included usd and tesla, small fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.2 - 30.11.2021';
    this.log.comment = 'DFI in Wallet now shown without Vault DFI';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.1 - 30.11.2021';
    this.log.comment = 'DEX Table to the end because too large, small fix if stock pools not available';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.26.0 - 30.11.2021';
    this.log.comment = 'Add more stocks to dex, technical improvements for faster pool add in future';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.25.0 - 29.11.2021';
    this.log.comment = 'Add Vault Support for adresses, Small fixes in value with tesla and usd pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.8 - 28.11.2021';
    this.log.comment = 'Fix small amounts in value chart';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.7 - 26.11.2021';
    this.log.comment = 'Fix USDC label for USD in value Chart';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.6 - 25.11.2021';
    this.log.comment = 'Fix USD from adress, added loan statistics, DEX view small order change';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.5 - 25.11.2021';
    this.log.comment = 'Added USD and TSLA Pool Support (beta)';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.4 - 23.11.2021';
    this.log.comment = 'Fix computation when usd or tsla pool is not responded from api';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.3 - 22.11.2021';
    this.log.comment = 'Add CakeDefi Reflink in settings';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.2 - 21.11.2021';
    this.log.comment = 'fix reserve of pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.1 - 21.11.2021';
    this.log.comment = 'fix usd and tsla not over api';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.24.0 - 21.11.2021';
    this.log.comment = 'AuthKey over url: defichain-income.com/authKey/your-key';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.23.2 - 20.11.2021';
    this.log.comment = 'Address over url, fix typo';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.23.1 - 20.11.2021';
    this.log.comment = 'Ocean stats endpoint without version';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.23.0 - 20.11.2021';
    this.log.comment = 'Add tracking of one adress without login over url: defichain-income.com/address/your-adress';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.22.4 - 19.11.2021';
    this.log.comment = 'Api completly moved to saiive or ocean, limit blocks for blocktime to 200, add usd and tsla pool in dex view';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.22.3 - 16.11.2021';
    this.log.comment = 'Stats endpoint version update';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.22.2 - 15.11.2021';
    this.log.comment = 'Stats endpoint moved to ocean';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.22.1 - 14.11.2021';
    this.log.comment = 'Stats Endpoint version update';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.22.0 - 7.11.2021';
    this.log.comment = 'Select the number of days for the calculation of the correlation in settings';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.21.0 - 5.11.2021';
    this.log.comment = 'Add prices in holdings view for holdings and lp tokens, add DFI as official currency';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.20.3 - 5.11.2021';
    this.log.comment = 'Fix calc of average apr';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.20.2 - 28.10.2021';
    this.log.comment = 'Fix calc of masternode apr based on subnodes, add cake apr, small fixes';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.20.1 - 25.10.2021';
    this.log.comment = 'Staking with freezer apr and apy, weekly apy of lm pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.20.0 - 24.10.2021';
    this.log.comment = 'Average APR of all defichain products, daily apy of lm pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.19.0 - 20.10.2021';
    this.log.comment = 'Masternode Compound added';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.18.1 - 20.10.2021';
    this.log.comment = 'Fix styles';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.18.0 - 20.10.2021';
    this.log.comment = 'Update settings design';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.17.2 - 16.10.2021';
    this.log.comment = 'Correct compound interest calculation';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.17.1 - 15.10.2021';
    this.log.comment = 'DFI Rewards from reinvest period added to lm reinvest calculation';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.17.0 - 15.10.2021';
    this.log.comment = 'LM Compounding in Forecast';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.16.3 - 14.10.2021';
    this.log.comment = 'Fix usd prices pairs';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.16.2 - 12.10.2021';
    this.log.comment = 'Fix saiive endpoint';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.16.1 - 7.10.2021';
    this.log.comment = 'Fix stats endpoint in ocean';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.16.0 - 6.10.2021';
    this.log.comment = 'LP Token Value added to dex statistics table';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.7 - 30.9.2021';
    this.log.comment = 'Fix Release text from github if structure not like normal';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.6 - 29.9.2021';
    this.log.comment = 'Fix link to github';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.5 - 26.9.2021';
    this.log.comment = 'Fix load dex data if no adresses';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.4 - 25.9.2021';
    this.log.comment = 'No auth key for github';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.3 - 25.9.2021';
    this.log.comment = 'Add links to github';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.2 - 24.9.2021';
    this.log.comment = 'Impove style for infos from github';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.1 - 24.9.2021';
    this.log.comment = 'Add wallet infos from github';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.15.0 - 23.9.2021';
    this.log.comment = 'Github Data in DEX';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.5 - 20.9.2021';
    this.log.comment = 'Ref Link hidden';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.4 - 12.9.2021';
    this.log.comment = 'Improve Styles';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.3 - 9.9.2021';
    this.log.comment = 'More infos in DEX Tab, DFI in DEX, Reserve in Pools';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.2 - 9.9.2021';
    this.log.comment = 'Masternodes infos extended in DEX Tab';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.1 - 8.9.2021';
    this.log.comment = 'Angular 12 Update and dependencies';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.14.0 - 8.9.2021';
    this.log.comment = 'Override Cake standard staking Apy for freezer calculations';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.13.3 - 4.9.2021';
    this.log.comment = 'Fix incognito style issue';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.13.2 - 4.9.2021';
    this.log.comment = 'Fix register issue';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.13.1 - 3.9.2021';
    this.log.comment = 'Fix manual tracking input issues';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.13.0 - 2.9.2021';
    this.log.comment = 'Buy DFI button added\n, Styles improved';
    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '7.12.3 - 1.9.2021';
    this.log.comment = 'Month added in forecast, period fix';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.12.3 - 31.8.2021';
    this.log.comment = 'Improve styles';

    this.log.version = '7.12.2 - 27.8.2021';
    this.log.comment = 'TVL of masternodes added';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.12.1 - 22.8.2021';
    this.log.comment = 'Fix call order of mamon calls';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.12.0 - 22.8.2021';
    this.log.comment = 'Integration of Masternode Monitor for Masternode Import';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.11.3 - 20.8.2021';
    this.log.comment = 'Fix dfi coins extraction from endpoint, fix sum after reload';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.11.2 - 17.8.2021';
    this.log.comment = 'Change to product of topiet gmbh - masternode freezer';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.11.1 - 17.8.2021';
    this.log.comment = 'Better view for Freezer';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.11.0 - 16.8.2021';
    this.log.comment = 'Refresh Button';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.10.2 - 10.8.2021';
    this.log.comment = 'USDC have a price feed now';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.10.1 - 10.8.2021';
    this.log.comment = 'USDC LP Token value fix';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.10.0 - 10.8.2021';
    this.log.comment = 'USDC Pool Support';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.9.3 - 8.8.2021';
    this.log.comment = 'Fix show added address success message';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.9.2 - 8.8.2021';
    this.log.comment = 'Fix wrong adresses balance requested';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.9.1 - 8.8.2021';
    this.log.comment = 'Dfi Amount view fix in settings';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.9.0 - 8.8.2021';
    this.log.comment = 'Freezer Masternodes, Supernode for Accounts';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.8.1 - 5.8.2021';
    this.log.comment = 'Inkognito Fixes and typos';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.8.0 - 5.8.2021';
    this.log.comment = 'Inkognito Mode';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.7 - 29.7.2021';
    this.log.comment = 'Better texts (Lord Mark himself feedback :) ) ';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.6 - 24.7.2021';
    this.log.comment = 'fix pwa for ios';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.5 - 23.7.2021';
    this.log.comment = 'activate pwa and icons for app icon';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.4 - 15.7.2021';
    this.log.comment = 'pwa fixes';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.3 - 7.7.2021';
    this.log.comment = 'week earnings fix in forecast';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.2 - 6.7.2021';
    this.log.comment = 'week earnings back';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.1 - 1.7.2021';
    this.log.comment = 'cake staking apy auto';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.7.0 - 21.6.2021';
    this.log.comment = 'autocopy of address commands, last updated time added';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.6.2 - 17.6.2021';
    this.log.comment = 'better success message after add addresses';

    this.logs.push(this.log);


    this.log = new Log();

    this.log.version = '7.6.1 - 17.6.2021';
    this.log.comment = 'fix overwrite masternode addresses';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.6.0 - 16.6.2021';
    this.log.comment = 'add addresses with output of the two commands ( "listaccounts {} false false true" and "listaddressgroupings" ) from the defichain app. No more search of addresses. Just the output in the inputfield and add.';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.10 - 14.6.2021';
    this.log.comment = 'fix charts error because of double bootstraping';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.9 - 10.6.2021';
    this.log.comment = 'set fixed blocktime of 30s in settings';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.8 - 10.6.2021';
    this.log.comment = 'show dex and cex price in header';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.7 - 9.6.2021';
    this.log.comment = 'forecast without guarantee';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.6 - 8.6.2021';
    this.log.comment = 'forecast chart fix next cycle date up from today, visual optimizations';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.5 - 8.6.2021';
    this.log.comment = 'api offline only when stats and transactions down';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.4 - 7.6.2021';
    this.log.comment = 'dfi price from btc pool on dex';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.3 - 7.6.2021';
    this.log.comment = 'rewards from api';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.2 - 6.6.2021';
    this.log.comment = 'typo';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.1 - 6.6.2021';
    this.log.comment = 'add time to block till cycle or difficulty';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.5.0 - 6.6.2021';
    this.log.comment = 'blocks till cycle and difficulty chage';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.4.0 - 6.6.2021';
    this.log.comment = 'last blocks for calc of blocktime configurable';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.3.1 - 5.6.2021';
    this.log.comment = 'sort blocks because not always correct';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.3.0 - 5.6.2021';
    this.log.comment = 'calculate blocktime on last 2000 blocks';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.2.3 - 5.6.2021';
    this.log.comment = 'better offline request';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.2.2 - 4.6.2021';
    this.log.comment = 'fix tradview on mobile, blocktimee to 30s';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.2.1 - 3.6.2021';
    this.log.comment = 'fix view rewards of pools, temporarily fix of wrong lm rewards from api';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.2.0 - 1.6.2021';
    this.log.comment = 'blocktime added to dex view';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.1.0 - 1.6.2021';
    this.log.comment = 'forecast with currencies on mouse over';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.0.1 - 30.5.2021';
    this.log.comment = 'fix forecast menu title';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '7.0.0 - 30.5.2021';
    this.log.comment = 'forecast of income with the new emission rate';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.3.3 - 26.5.2021';
    this.log.comment = 'icons switch between dex and tradeview charts';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.3.2 - 25.5.2021';
    this.log.comment = 'lib updates';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.3.1 - 25.5.2021';
    this.log.comment = 'correlation info and link';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.3.0 - 25.5.2021';
    this.log.comment = 'correlation of pools in dex view';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.7 - 23.5.2021';
    this.log.comment = 'pacmaaaaaan spinner';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.6 - 23.5.2021';
    this.log.comment = 'draw tools for tv widget';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.5 - 22.5.2021';
    this.log.comment = 'reload mn and cake after 10 min if error';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.4 - 22.5.2021';
    this.log.comment = 'api call for masternodes info fto new domain, fixed masternode computation';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.3 - 21.5.2021';
    this.log.comment = 'tradeview widget fixes: language and height';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.2 - 20.5.2021';
    this.log.comment = 'back to dfibtc';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.1 - 20.5.2021';
    this.log.comment = 'fix staking apy, manual use if apy fo cake not working';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.2.0 - 18.5.2021';
    this.log.comment = 'add french language, mn calculations errors';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.1.0 - 16.5.2021';
    this.log.comment = 'add russian language';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.0.2 - 11.5.2021';
    this.log.comment = 'better wording for update button';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.0.1 - 11.5.2021';
    this.log.comment = 'reduce columns when no masternode addresses added in income';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '6.0.0 - 10.5.2021';
    this.log.comment = 'add masternode addresses, show in value undd income of masternode addresses';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '5.0.1 - 9.5.2021';
    this.log.comment = 'full income tabs on dashboard, input addresses from value view';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '5.0.0 - 9.5.2021';
    this.log.comment = 'darkmode';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.10.0 - 8.5.2021';
    this.log.comment = 'address helper added';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.9.2 - 6.5.2021';
    this.log.comment = 'some piece of seo';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.9.1 - 5.5.2021';
    this.log.comment = 'mobile optimizations, price dfi and total in mobile header';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.9.0 - 3.5.2021';
    this.log.comment = 'prices under all dfi parts';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.8.2 - 30.4.2021';
    this.log.comment = 'change to https mn call';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.8.1 - 29.4.2021';
    this.log.comment = 'cake apy per api and mn count separated because of canceled calls';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.8.0 - 29.4.2021';
    this.log.comment = 'cake apy ver api, mn count and apr over api, add currencies for mobile, add langs for mobile, small fixes';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.7.0 - 28.4.2021';
    this.log.comment = 'add btc and eth as currency';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.5 - 28.4.2021';
    this.log.comment = 'youtube tutorial added, info text better wording, matomo update to v9';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.4 - 26.4.2021';
    this.log.comment = 'wait for rewards';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.3 - 26.4.2021';
    this.log.comment = 'better wording and headlines';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.2 - 26.4.2021';
    this.log.comment = 'fix no custom rewards';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.1 - 25.4.2021';
    this.log.comment = 'add more text auto/manuall load';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.6.0 - 25.4.2021';
    this.log.comment = 'better view for holdings';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.5.1 - 24.4.2021';
    this.log.comment = 'apy to apr in lm';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.5.0 - 24.4.2021';
    this.log.comment = 'more currencies, auto load currency';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.4.0 - 20.4.2021';
    this.log.comment = 'Staking in Fiat bug fixed, show pool share as tokens like btc and dfi, es lang added';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.3.0 - 20.4.2021';
    this.log.comment = 'Added AUD as currency';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.2.1 - 20.4.2021';
    this.log.comment = 'Fix income chart size, better income overviews all, staking and lm';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.2.0 - 19.4.2021';
    this.log.comment = 'Show every address balance, add staking/lm % of total, ';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.1.0 - 17.4.2021';
    this.log.comment = 'Show DFI price in header';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.0.1 - 16.4.2021';
    this.log.comment = 'DFI Charts renaming';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '4.0.0 - 16.4.2021';
    this.log.comment = 'Complete makeover and new UX';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.3.2 - 12.4.2021';
    this.log.comment = 'add telegram group';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.3.1 - 12.4.2021';
    this.log.comment = 'mirror to github';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.3.0 - 5.4.2021';
    this.log.comment = 'rewards from api, show rewards';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.2.3 - 1.4.2021';
    this.log.comment = 'account api fix';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.2.2 - 31.3.2021';
    this.log.comment = 'correct health check api, fix getacount api call';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.2.1 - 29.3.2021';
    this.log.comment = 'clear wallet only when autoload of funds from addresses';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.2.0 - 29.3.2021';
    this.log.comment = 'bulletproof loading of addresses and listyieldfarming';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.1.2 - 28.3.2021';
    this.log.comment = 'add onchanges event for charts childs components, settings per dfault on';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.1.1 - 28.3.2021';
    this.log.comment = 'render charts only after data loaded';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.1.0 - 27.3.2021';
    this.log.comment = 'shortcuts, waut for load addresses';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.0.4 - 27.3.2021';
    this.log.comment = 'fix reload malfunction';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.0.3 - 27.3.2021';
    this.log.comment = 'wait for load accounts';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.0.2 - 27.3.2021';
    this.log.comment = 'user message if update data';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.0.1 - 27.3.2021';
    this.log.comment = 'fix refresh';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '3.0.0 - 27.3.2021';
    this.log.comment = 'Login functionality';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.22.1 - 24.3.2021';
    this.log.comment = 'replace pool requests, more time for testapi, lib updates, countdown fix';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.22.0 - 21.3.2021';
    this.log.comment = 'replace coinpaprika by tradeview widget';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.21.0 - 21.3.2021';
    this.log.comment = 'Add btc and eth as currency for coinpaprika widget';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.20.0 - 21.3.2021';
    this.log.comment = 'Add reference to history graphql interface';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.19.1 - 19.3.2021';
    this.log.comment = 'Wallet in Distribution of holdings chart include all funds in the wallet like dfi, btc ...';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.19.0 - 19.3.2021';
    this.log.comment = 'Matomo integration for actions on website (NO Tracking of funds or inputs)';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.18.2 - 19.3.2021';
    this.log.comment = 'Small text fixes';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.18.1 - 17.3.2021';
    this.log.comment = 'BCH Pool 1 DFI per Block';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.18.0 - 16.3.2021';
    this.log.comment = 'Get dfi coins from address, different currencies for coinpaprika widget';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.17.1 - 14.3.2021';
    this.log.comment = 'Allow request from anywhere';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.17.0 - 14.3.2021';
    this.log.comment = 'Sourcecode is opensource, add link to repo';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.16.0 - 13.3.2021';
    this.log.comment = 'Holdings list not in input area and allways visible for auto funds load';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.15.0 - 12.3.2021';
    this.log.comment = 'Show how much dfi in staking, lm or wallet in value chart';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.14.0 - 12.3.2021';
    this.log.comment = 'Big code refactoring, Details now with separate calc tab';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.13.0 - 11.3.2021';
    this.log.comment = 'Changelog added, klick version button';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.12.0 - 11.3.2021';
    this.log.comment = 'Dex statistics cleaning and tvl for pools added';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.11.1 - 10.3.2021';
    this.log.comment = 'Correct color bch';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.11.0 - 10.3.2021';
    this.log.comment = 'Add bch pool';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.10.0 - 9.3.2021';
    this.log.comment = 'Staking apy over input';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.9.0 - 9.3.2021';
    this.log.comment = 'Coinpaprika, settings hide';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.8.0 - 9.3.2021';
    this.log.comment = 'Correct colors for charts';

    this.logs.push(this.log);
    this.log = new Log();

    this.log.version = '2.7.0 - 8.3.2021';
    this.log.comment = 'Staking calc und new charts added';

    this.logs.push(this.log);

    this.log = new Log();

    this.log.version = '2.6.0 - 8.3.2021';
    this.log.comment = 'Charts value und income';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.5.0 - 7.3.2021';
    this.log.comment = 'New defichain-income logo';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.4.0 - 5.3.2021';
    this.log.comment = 'Stake mn and cake checkbox';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.3.2 - 1.3.2021';
    this.log.comment = 'Doge rewards decrease';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.3.1 - 26.2.2021';
    this.log.comment = 'Settings reorganize';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.3.0 - 26.2.2021';
    this.log.comment = 'Api status and retest time';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.2.3 - 25.2.2021';
    this.log.comment = 'Wait 5 s before try again load listyieldfarming ';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.2.2 - 25.2.2021';
    this.log.comment = 'Remove sentry';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.2.1 - 25.2.2021';
    this.log.comment = 'Input from localstorage';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.2.0 - 25.2.2021';
    this.log.comment = 'Checkbox hide of inputs';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.1.3 - 22.2.2021';
    this.log.comment = 'Fix hour calculation for target return';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.1.2 - 21.2.2021';
    this.log.comment = 'More translations';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.1.1 - 21.2.2021';
    this.log.comment = 'Fix syntax translation';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '2.0.0 - 20.2.2021';
    this.log.comment = 'Add funds automatically over addresses or manuel with inputs';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.2.1 - 20.2.2021';
    this.log.comment = 'Test error tracking';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.2.0 - 19.2.2021';
    this.log.comment = 'Set your own refresh time';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.1.0 - 19.2.2021';
    this.log.comment = 'Add Countdown';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.0.4 - 19.2.2021';
    this.log.comment = 'Fix reload';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.0.3 - 19.2.2021';
    this.log.comment = 'Wallet amount ';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.0.2 - 19.2.2021';
    this.log.comment = 'Show Doge from addresses';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.0.1 - 19.2.2021';
    this.log.comment = 'Fix increasing wallet amount after refresh';

    this.logs.push(this.log);

    this.log = new Log();
    this.log.version = '1.0.0 - 19.2.2021';
    this.log.comment = 'Load funds from addresses';

    this.logs.push(this.log);
  }
}
