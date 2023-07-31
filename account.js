const get_connection = require('./helpers/connection');
const {
    TWITTER_LOGIN_URL,
    TWITTER_FIELD_USERNAME,
    TWITTER_FIELD_NEXT,
    TWITTER_BUTTON_NEXT,
    TWITTER_BUTTON_NEXT_ACCOUNT_ALREADY_LOGGED,
    TWITTER_FIELD_PASSWORD,
    TWITTER_BUTTON_LOG_IN,
    TWITTER_POST,
    TWITTER_LIKE_POST,
    TWITTER_RETWEET_POST,
    TWITTER_AVATAR_PROFILE,
    TWITTER_TEXT_POST,
    TWITTER_RETWEET_CONFIRM,
    TWITTER_USERNAME
} = require('./selectors');

const today = Date.now();
const wait = (page) => page.waitForTimeout(Math.random() * 2500);
let buffer = 0;
let dayMS = 86400000; // 1 day in milliseconds
let possibilityRetweet = 0.7; // it's mean that possibility equal ≈ 20%
let countLike = 0;
let countReTweet = 0;

class Account {
    userData;
    browser;
    nameAccount;
    duration;
    logger;

    constructor(account, name, days, logger) {
        this.duration = days;
        this.nameAccount = name;
        this.userData = account.split(' ');
        this.logger = logger;
    }

    async handlePost(page) {
        await page.waitForSelector(TWITTER_POST);
        await page.waitForTimeout(Math.random() * 1000);
        const tweets = await page.$$(TWITTER_POST);
        const accountsTweets = await Promise.allSettled(tweets.map((tweet) => this.getOurTweet(tweet)));
        const filteredTweets = accountsTweets.filter((tweet) => tweet.value.isAvatarExist).map((tweetObj) => tweetObj.value.tweet);
        for (let tweet of filteredTweets) {
            await this.handleTweet(page, tweet);
            await wait(page);
            if (Math.random() > possibilityRetweet) {
                await this.handleReTweet(page, tweet);
            }
            try {
                if (await this.analyzeDate(page, tweet)) {
                    this.ourReport();
                    await this.browser.close();
                } else {
                    let previousHeight = await page.evaluate('document.body.scrollHeight*0.7');
                    buffer += 700;
                    await page.evaluate(`window.scrollTo(0, ${buffer})`);
                    try {
                        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
                    } catch {
                        console.log('cycle not done');
                    }
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    await this.handlePost(page);
                }
            } catch (err) {
                console.log(`Close Account err: ${err.message}`);
            }
        }
    }

    ourReport() {
        this.logger.debug('Successfully liked posts: ' + countLike);
        this.logger.debug('Successfully retweets: ' + countReTweet);
        this.logger.info(this.userData[1] + ' successfully runs planning tasks.');
    }

    async analyzeDate(page, tweet) {
        try {
            await page.waitForSelector(TWITTER_POST);
            const post = await tweet.$(TWITTER_USERNAME);
            console.log('Start go in method analyzeData');
            const dataTimePost = await post.$eval('[datetime]', (node) => node.getAttribute('datetime'));
            if (dataTimePost) {
                const dataInMS = Date.parse(dataTimePost);
                console.log(this.duration * dataInMS);
                return today - dataInMS > this.duration * dayMS;
            }
        } catch (err) {
            console.log(`Data time err: ${err.message}`);
        }
    }

    async handleReTweet(page, tweet) {
        try {
            await page.waitForSelector(TWITTER_RETWEET_POST);
            const retweet = await tweet.$(TWITTER_RETWEET_POST);
            console.log('Retweet ' + retweet);
            if (retweet) {
                await retweet.click();
                await page.waitForSelector(TWITTER_RETWEET_CONFIRM);
                const retweetConfirm = await page.$(TWITTER_RETWEET_CONFIRM);
                console.log('retweetConfirm ' + retweetConfirm);
                if (retweetConfirm) {
                    await retweetConfirm.click();
                    countReTweet++;
                }
            } else {
                const tweetText = await tweet.$(TWITTER_TEXT_POST);
                const text = await tweetText.$eval('span', (node) => node.innerText);
                console.log(`Retweet already pushed text ${text}`);
            }
        } catch (err) {
            console.log(`Handle retweet err: ${err.message}`);
        }
    }

    async handleTweet(page, tweet) {
        try {
            await page.waitForSelector(TWITTER_LIKE_POST);
            const like = await tweet.$(TWITTER_LIKE_POST);
            // console.log('Like ' + like);
            if (like) {
                await like.click();
                countLike++;
            } else {
                const tweetText = await tweet.$(TWITTER_TEXT_POST);
                const text = await tweetText.$eval('span', (node) => node.innerText);
                console.log(`Like already pushed on post with text ${text}`);
            }
        } catch (err) {
            console.log(`Handle tweet err: ${err.message}`);
        }
    }

    async getOurTweet(tweet) {
        try {
            const avatar = await tweet.$(TWITTER_AVATAR_PROFILE + this.nameAccount + ']');
            return {tweet, isAvatarExist: !!avatar};
        } catch (err) {
            console.log('JS filter err: ${err.message} on tweet');
        }
    }

    async loginInTwitter() {
        try {
            //connection
            this.browser = await get_connection.connection(this.userData[0]);
            let url;
            console.log('Browser connected');
            //email page
            const page = await this.browser.newPage();
            await page.setJavaScriptEnabled(true);
            await page.goto(TWITTER_LOGIN_URL);
            url = await page.url();
            if (url === TWITTER_LOGIN_URL) {
                await page.waitForSelector(TWITTER_FIELD_USERNAME);
                await page.type(TWITTER_FIELD_USERNAME, this.userData[1], {delay: 25});
                await page.waitForXPath(TWITTER_FIELD_NEXT); // this line for understanding that we have button "Next"
                await page.click(TWITTER_BUTTON_NEXT);
                await wait(page);
                console.log('Email was input');

                // password page
                await page.waitForSelector(TWITTER_FIELD_PASSWORD);
                await page.type(TWITTER_FIELD_PASSWORD, this.userData[2], {delay: 25});
                await page.click(TWITTER_BUTTON_LOG_IN);
                await wait(page);
                console.log('Password was input');

                url = await page.url();
                if (url === TWITTER_LOGIN_URL) {
                    await page.waitForSelector(TWITTER_BUTTON_NEXT_ACCOUNT_ALREADY_LOGGED);
                    await page.click(TWITTER_BUTTON_NEXT_ACCOUNT_ALREADY_LOGGED);
                    await wait(page);
                }
            }
            return page;
        } catch (err) {
            console.log('Error in login function ${err.message}');
        }
    }

    async gotoActionAccount(accountForLikes) {
        console.log({accountForLikes});
        const loginedPage = await this.loginInTwitter();
        console.log('start go to target account');
        await loginedPage.goto(accountForLikes, {
            idleTime: 1000,
            waitUntil: 'networkidle2',
        });
        return loginedPage;
    }
}

module.exports = Account;
