require('dotenv').config()
const { get } = require('../utils/requests')
class Unit {
    constructor(goDown) {
        this.geoUrl = "https://api.ipgeolocation.io/astronomy"
        // this.weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
        this.weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall'
        this.geoApiKey = process.env.IPGEOLOKATION_API_KEY
        this.weatherApiKey = process.env.OPENWEATHER_API_KEY
        this.ip = undefined
        this.goDown = goDown
        this.geoData = {}
        this.weather = {}
    }
    setGoDown(goDownBolean) {
        this.goDown = goDownBolean
    }
    async setIp(ipAdress) {
        let data = await get(`${this.geoUrl}?apiKey=${this.geoApiKey}&ip=${ipAdress}`)
        if (data) {
            this.ip = ipAdress
            this.updateData()
        } else {
            throw Error('Invalid Ip')
        }
    }
    getIp() {
        return this.ip
    }
    getData() {
        return this.geoData
    }
    async updateData() {
        if (this.ip) {
            this.geoData = await get(`${this.geoUrl}?apiKey=${this.geoApiKey}&ip=${this.ip}`)
            console.log(this.geoData)
            this.setWeather()
        } else {
            throw Error('Ip Missing')
        }
    }
    async setWeather() {
        // ?lat={lat}&lon={lon}&appid={your api key}
        let { latitude, longitude } = this.geoData.location
        if (latitude && longitude) {
            let data = await get(`${this.weatherUrl}?lat=${this.geoData.location.latitude}&lon=${this.geoData.location.longitude}&exclude=minutely&exclude=daily&appid=${this.weatherApiKey}`)
            let weather = data.hourly.map(({ weather, clouds }) => {
                return { weather, clouds }
            })
            this.weather = weather
        }
    }
}

module.exports = Unit