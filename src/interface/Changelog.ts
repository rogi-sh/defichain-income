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
