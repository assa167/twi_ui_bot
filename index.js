const fs = require('fs');
const Account = require('./account');
const readline = require('readline');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get_connection = require('./helpers/connection');
const {TWITTER_TARGET_ACCOUNT} = require('./selectors');
const log4js = require('log4js');
const logFile = './logs/' + new Date().toString().substr(4, 11) + '.log';

let nameAccount = 'Bitcoin';
let duration = 2;

log4js.configure({
    appenders: {
        everything: {type: 'fileSync', filename: logFile},
    },
    categories: {
        default: {appenders: ['everything'], level: 'debug'},
    },
});

const logger = log4js.getLogger('[twiBot]');

async function runTasks(account) {
    const actionPage = await account.gotoActionAccount(`${TWITTER_TARGET_ACCOUNT}${nameAccount}`);
    console.log(`Twitter target account: ${TWITTER_TARGET_ACCOUNT}${nameAccount}`);
    await account.handlePost(actionPage);
    //TODO: add another tasks for account
    return account;
}

async function initialize(data) {
    let rows = data.split('\n');
    // TODO: async operations with Promise.allSettled
    const accounts = rows.map((row) => new Account(row, nameAccount, duration, logger));
    for (let account of accounts) {
        await runTasks(account);
    }
}

async function launching() {
    try {
        logger.info('TargetAccount: ' + nameAccount);
        logger.info('Day count: ' + duration);
        const data = fs.readFileSync('files/data', 'utf8');
        await initialize(data);
    } catch (err) {
        console.error(err);
    }
}

async function setTargetAccountAndDuration() {
    try {
        console.log('Enter target account and how mach covers days via space: ' + '\n');
        let readData = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '>',
        });
        await readData.prompt();
        await readData.on('line', async (input) => {
            if (!!input) {
                input = input.split(' ');
                nameAccount = input[0];
                duration = input[1];
            }
            await readData.close();
        });
        await sleep(10000);
        await launching();
    } catch (err) {
        console.log(`Getting data from console err: ${err.message}`);
    }
}

setTargetAccountAndDuration();
