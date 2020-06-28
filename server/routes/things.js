const express = require('express')
const { Route } = require('express')
const app = express.Router()

const controller = require('../controllers/things')

app.get('/', async (req, res, next) => {
    let response = 'Welcome to things'
    res.send(response)
    next()
})
app.post('/', async (req, res, next) => {
    console.log(req.body)
    res.send(req.body)
    next()
})

app.get('/connect', async (req, res, next) => {
    let response = 'Welcome to things connect'
    res.send(response)
    next()
})
app.post('/connect', async (req, res, next) => {
    let response = {}
    let { lat, lon, name } = req.body
    if (lat, lon) {
        controller.connectByLatLon(lat, lon)
    } else {
        let ip = req.connection.remoteAddress
        if (ip.length > 5) {
            controller.connectByIp(ip)
        }
    }
    res.send('response')
    next()
})
// controller.connectByLatLon(56.690318, 16.333079)
// controller.connectByIp('83.251.26.37')
module.exports = app