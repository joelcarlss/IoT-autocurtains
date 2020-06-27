require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')


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

// Start server
app.listen(port, () => {
    console.log(`running on localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
})


