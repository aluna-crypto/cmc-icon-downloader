const sleep = require('sleep-promise')
const {get} = require('request-promise')
const fs = require('fs')

const COOL_DOWN = 10000

module.exports = async function(uri, filename){
  const path = "./images/" + filename.toLowerCase() + "@2x.png"

  while(true) {
    try {
      const response = await get({
        uri,
        encoding: null,
        resolveWithFullResponse: true
      })
      
      return fs.writeFileSync(path, response.body)
    } catch (error) {
      if(error.statusCode === 429) {
        console.log("too many requests, cooling down")
      } else {
        throw(error)
      }
      
      await sleep(COOL_DOWN)
    }
    
  }
  
};