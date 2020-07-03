require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const Mqtt = require('./model/MqttHandler')
const controller = require('./controllers/things')

const mqtt = new Mqtt()
mqtt.connect()
mqtt.sendMessage('0')



const port = process.env.PORT || 3000
const requests = require('./utils/requests')
const things = require('./routes/things')

const app = express()
const router = express.Router()

// Adds cors header so webpages can access
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Helmet for security
app.use(helmet())

// routes
app.use('/things', things)
require('./routes/home')(app)

// Current start 
// controller.connectByLatLon(process.env.LATITUDE, process.env.LONGITUDE)
// controller.connectByIp(process.env.IP_ADDRESS)

// Start server
app.listen(port, () => {
    console.log(`running on localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
})


