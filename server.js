import config, {CSE_ID, CSE_API_KEY} from './config'
import express from 'express'
import { MongoClient, ObjectID } from 'mongodb'
import assert from 'assert'
import request from "request"
import moment from 'moment'

const server = express()

let mdb;
MongoClient.connect(config.mongodbUri, (err, db) => {
    assert.equal(null, err)
    mdb = db
})


server.use(express.static('views'))

server.get('/api/:string', (req, res) => {
  let temp = []
  request(`https://content.googleapis.com/customsearch/v1?key=${CSE_API_KEY}&cx=${CSE_ID}&searchType=image&num=${req.query.offset}&q=${req.params.string}`,function (error, response, body){
  body = JSON.parse(body) 
  body.items.map((item)=>{
    let json = {} 
    json.url = item.link
    json.snippet = item.snippet
    json.thumbnail = item.image.thumbnailLink
    json.context = item.image.contextLink
    temp.push(json)   
}) 
    res.send(temp)
  })
  let obj = {}
  obj.string = req.params.string
  obj.createdDate = moment().format()
  mdb.collection('Images').find({string: req.params.string}).toArray((err,result)=>{
    if(result.length === 0){
      mdb.collection('Images').insert(obj)
    }
  }) 
  
}) 

server.get('/api/latest/imagesearch',(req,res)=>{
  mdb.collection('Images').find({}, {string: 1, createdDate: 1, _id: 0}).sort({createdDate:-1}).limit(10).toArray((err, result) =>{
    res.send(result)
  })
})

server.listen(config.port, () => {
    console.info('Express Listening on port:', config.port)
})
