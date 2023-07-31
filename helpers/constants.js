const {config} = require('dotenv');
const path = require('path');
const ENV_FILE = `.env`;
const ENV_PATH = path.resolve(process.cwd(), ENV_FILE);

config({path: ENV_PATH, override: true});

const configuration = {
    GL_TOKEN: process.env.GL_TOKEN,
};

module.exports = configuration;
