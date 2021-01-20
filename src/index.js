const downloadAndRetry = require("./downloadAndRetry");
const getAndRetry = require("./getAndRetry");
const cheerio = require("cheerio");
const sleep = require("sleep-promise");

const HOMEPAGE = "https://coinmarketcap.com/";
const COOL_DOWN = 2000;

const parseCoinPage = async (page) => {
  const url = HOMEPAGE + page;

  const html = await getAndRetry(url);

  await sleep(COOL_DOWN);

  const $ = cheerio.load(html);

  const image = $('meta[property="og:image"]').attr("content");

  const h2 = $("h2");
  const symbol = h2.find("small").html();

  console.log("downloading: ", symbol);
  console.log("image", image);

  return downloadAndRetry(image, symbol);
};

const getPage = (number) => {
  if (number === 1) {
    return HOMEPAGE;
  } else {
    return HOMEPAGE + "/" + number + "/";
  }
};

const parsePage = async () => {
  for (let page = 1; page <= 10; page++) {
    console.log("");
    console.log(` -- parsing page ${page} --`);
    console.log("");

    const html = await getAndRetry(getPage(page));

    const $ = cheerio.load(html);

    const rows = $(".cmc-table tbody tr");

    for (let index = 0; index < 100; index++) {
      const row = rows.eq(index).children("td:nth-child(3)");

      const page = row.children().attr("href");

      console.log("INDEX ", index);
      console.log("page found ", page);

      if (page == undefined) continue;

      await parseCoinPage(page);

      await sleep(COOL_DOWN);
    }
  }
};

parsePage();
