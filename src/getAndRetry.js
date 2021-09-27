const sleep = require("sleep-promise");
const { get } = require("request-promise");

const COOL_DOWN = 10000;

module.exports = async (url) => {
  while (true) {
    try {
      return await get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
        },
      });
    } catch (error) {
      if (error.statusCode === 429) {
        console.log("too many requests, cooling down");
      } else {
        throw error;
      }

      await sleep(COOL_DOWN);
    }
  }
};
