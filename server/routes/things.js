const express = require('express')
const { Route } = require('express')
const app = express.Router()
app.get('/', async (req, res, next) => {
    let response = 'Welcome to things'
    res.send(response)
    next()
})

module.exports = app