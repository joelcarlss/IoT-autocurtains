require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
var cors = require('cors')
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

// const hue = new Hue()
// hue.connect()

// routes
app.use('/things', things)
require('./routes/home')(app)
app.use('/things', things)




app.listen(port || 3000, () => {
    console.log(`running on localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
})


