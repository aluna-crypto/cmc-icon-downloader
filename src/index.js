const downloadAndRetry = require('./downloadAndRetry')
const getAndRetry = require('./getAndRetry')
const cheerio = require('cheerio')
const sleep = require('sleep-promise')

const HOMEPAGE = 'https://coinmarketcap.com'

const parseCoinPage = async (page) => {

  const url = HOMEPAGE + page

  const html = await getAndRetry(url)

  await sleep(3000)

  const $ = cheerio.load(html)

  const image = $('meta[property="og:image"]').attr('content')

  const h1 = $('h1')
  const symbol = h1
    .find('span')
    .eq(1)
    .html()
    .replace('(', '')
    .replace(')', '')

  console.log("downloading: ", symbol)

  return downloadAndRetry(image, symbol)
}

const getPage = (number) => {
  if(number === 1) {
    return HOMEPAGE
  } else {
    return HOMEPAGE + '/' + number + '/'
  }
}

const parsePage = async () => {

  for(let page = 1; page <= 11; page++) {

    console.log("")
    console.log(` -- parsing page ${page} --`)
    console.log("")

    const html = await getAndRetry(getPage(page))

    const $ = cheerio.load(html)
  
    const rows = $('.cmc-table-row')
  
    for(let index = 0; index < 100; index++) {
      const row = rows.eq(index).find('a')
  
      const page = row.attr('href')
  
      await parseCoinPage(page)
  
      // we need to wait otherwise we are blocked with too many requests
      await sleep(3000)
    }

  }


}

parsePage()