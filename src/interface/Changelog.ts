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
    this.log.comment = 'Wait 5 s before try again load dex ';

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

