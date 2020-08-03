'use strict';
const axios = require('axios');
const axiosRetry = require('axios-retry');
const cron = require('node-cron');
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('MCO Bot is alive!'))

app.listen(PORT, () => console.log(`MCO bot listening on port:${PORT}`))

axiosRetry(axios, {
  retries: 5
});

const scheduleJob = () => {
  // Check for auto book
  cron.schedule('*/10 * * * *', async () => {
    ping(); // For heroku
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/crypto-com-chain?localization=false');
      await sendPrice(response.data.market_data.current_price.sgd);
    } catch (error) {
      console.error(error);
    }
  });
};

const sendPrice = async (price) => {
  try {
    const response = await axios.get('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage?chat_id=' + process.env.TELEGRAM_CHAT_ID + '&text=The current price for CRO is: SGD ' + price);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const ping = () => {
  axios.get(process.env.HEROKU_URL);
}

scheduleJob();




