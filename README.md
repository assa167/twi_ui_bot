# **TwiBot**

### **Description**
This solution it's UI bot which based on API GoLogin for set different unique  browser profiles.
These profiles you can administrate using desktop version GoLogin.

#### Bot have next functional:
1) Login
2) Navigate on target account.
3) Like and retweet.

### **Getting Started**<br>

TwiBot supports MacOS and Windows platforms.

### **Installation**
1) Install WebStorm
2) Install GoLogin
3) Install Node JS on local machine https://phoenixnap.com/kb/install-node-js-npm-on-windows
4) Run in terminal core project next commands:
- npm i puppeteer
- npm i gologin
- npm i log4js
5) add .env file in project root (in directory "botnet") and add GoLogin access token.

#### Usage
For start work with bot run file "index.js"

#### Configuration

#### Bot have next configuration:
1) add new twitter profile;
2) Type target account;
3) Type count days for actions with target account.<br>
   **NOTE:** Default values for target account and count day set in file index.js: **nameAccount** and **duration**.

#### How change configuration:
1. Accounts you can add in "files/data" in format ProfileId (generate automatic GoLogin), Twitter login and password.<br>
   Example:
   ![1](https://user-images.githubusercontent.com/110620428/194098721-fb01100e-b0d2-4871-ac44-50f5a414a11d.PNG)
2. Type target account you can when start run program
3. Type count days you can when start run program<br>
   **NOTE:** For input data you have 10 seconds, if you will not set parameters and set empty field. <br>
   In this case will use default parameters. 
