module.exports = {
    TWITTER_TARGET_ACCOUNT: 'https://twitter.com/',
    TWITTER_LOGIN_URL: 'https://twitter.com/i/flow/login',
    TWITTER_FIELD_USERNAME: 'input[name="text"]',
    TWITTER_FIELD_NEXT : "//div[@class='css-18t94o4 css-1dbjc4n r-sdzlij r-1phboty r-rs99b7 r-ywje51 r-usiww2 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr r-13qz1uu']/descendant::span[@class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']",  // TO DO need refactor
    TWITTER_BUTTON_NEXT : "div[class=\'css-18t94o4 css-1dbjc4n r-sdzlij r-1phboty r-rs99b7 r-ywje51 r-usiww2 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr r-13qz1uu\']", // TO DO need refactor
    TWITTER_FIELD_PASSWORD : 'input[name="password"]', // or [autocomplete='current-password']
    TWITTER_BUTTON_LOG_IN : 'div[class=\'css-1dbjc4n r-pw2am6\']',
    TWITTER_BUTTON_NEXT_ACCOUNT_ALREADY_LOGGED : 'div[class = \'css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0\']', // TO DO need refactor
    TWITTER_POST : '[data-testid=tweet]',
    TWITTER_LIKE_POST : '[data-testid=like]',
    TWITTER_RETWEET_POST : '[data-testid=retweet]',
    TWITTER_AVATAR_PROFILE : '[data-testid=UserAvatar-Container-',
    TWITTER_TEXT_POST : '[data-testid=tweetText]',
    TWITTER_RETWEET_CONFIRM : '[data-testid=retweetConfirm]',
    TWITTER_USERNAME : '[data-testid=User-Names]',
}
