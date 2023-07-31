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