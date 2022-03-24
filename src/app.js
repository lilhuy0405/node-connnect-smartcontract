const express = require('express')
const CrytopieceCardHandler = require("./contractPort/CrytopieceCardHandler");
const app = express()
const dotenv = require("dotenv")
dotenv.config()

const port = process.env.PORT || 3000
//filter
app.use(express.json())

const crytopieceCardHandler = new CrytopieceCardHandler();
app.get('/api/inventory', async (req, res) => {
  const address = req.query.address

  if (!address) {
    res.status(400).send({
      "error": "address is required",
      "status": 400,
      "message": "address is required"
    })
  }
  try {
    const cardInfos = await crytopieceCardHandler.getUserCardInfos(address)
    res.send({
      "status": 200,
      "message": "success",
      "data": cardInfos
    })
  } catch (err) {
    res.status(500).send({
      "error": err.message,
      "status": 500,
      "message": err.message
    })
  }
})

app.post('/api/mint', async (req, res) => {
  const address = req.body.address
  const cardType = req.body.cardType

  if (!address || !cardType) {
    res.status(400).send({
      "error": "address,  cardType are required",
      "status": 400,
      "message": "address, cardType are required"
    })
  }
  try {
    const txnHash = await crytopieceCardHandler.mintNft(address, cardType)
    res.status(201).send({
      "status": 201,
      "message": "mint success",
      "data": {
        "txnHash": txnHash
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({
      "error": err.message,
      "status": 500,
      "message": "internal server error"
    })
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})