const GoLogin = require('gologin');
const puppeteer = require('puppeteer');
const {GL_TOKEN} = require('./constants');

async function connection(user_profile) {
    const GL = new GoLogin({
        token: GL_TOKEN,
        profile_id: user_profile,
    });

    const {status, wsUrl} = await GL.start().catch((e) => {
        console.trace(e);
        return {status: 'failure'};
    });

    if (status !== 'success') {
        console.log('Invalid status');
        return;
    }

    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl.toString(),
        ignoreHTTPSErrors: true,
    });

    return browser;
}

exports.connection = connection;
