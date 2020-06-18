const sleep = require('sleep-promise')
const {get} = require('request-promise')

const COOL_DOWN = 10000

module.exports = async (url) => {
  while(true) {
    try {
      return await get(url)
    } catch (error) {
      if(error.statusCode === 429) {
        console.log("too many requests, cooling down")
      } else {
        throw(error)
      }
      
      await sleep(COOL_DOWN)
    }
  }
}