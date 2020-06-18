require('dotenv').config()
const { get } = require('../utils/requests')
class Api {
    constructor(goDown) {
        this.weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall'
        this.geoUrl = 'https://api.ipgeolocation.io/astronomy'
        this.geoApiKey = process.env.IPGEOLOKATION_API_KEY
        this.weatherApiKey = process.env.OPENWEATHER_API_KEY
    }
}