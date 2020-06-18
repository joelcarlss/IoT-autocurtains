require('dotenv').config()
const { get, getGeoByIp, getGeoByLatLon, getWeatherByLatLon } = require('../utils/requests')
class Unit {
    constructor(goDown = true) {
        this.ip = undefined
        this.goDown = goDown
        this.latLon = {}
        this.geoData = {}
        this.weather = []
        this.currentWeather = {}
        this.milliseconds = 1800000
        this.autoInterval = undefined
        this.clock = undefined
    }
    setMinutes(min) {
        this.milliseconds = min * 60000
    }
    getMinutes() {
        this.milliseconds = min / 60000
    }
    async setIp(ipAdress) {
        let data = await getGeoByIp(ipAdress)
        if (data) {
            this.ip = ipAdress
        } else {
            throw Error('Invalid Ip')
        }
    }
    async setLatLon(lat, lon) {
        this.latLon = { lat, lon }
    }
    getIp() {
        return this.ip
    }
    getData() {
        return this.geoData
    }
    async updateData() {
        if (this.latLon.lat && this.latLon.lon) {
            this.geoData = await getGeoByLatLon(this.latLon.lat, this.latLon.lon)
            this.updateWeather()
        } else if (this.ip) {
            this.geoData = await getGeoByIp(this.ip)
            this.latLon = { lat, lon } = this.geoData.location
            this.updateWeather()
        } else {
            throw Error('Ip Missing')
        }
    }
    async updateWeather() {
        if (this.latLon.lat && this.latLon.lon) {
            let data = await getWeatherByLatLon(this.latLon.lat, this.latLon.lon)
            let hours = data.hourly.map(({ weather, clouds }) => {
                return { weather, clouds }
            })
            this.weather = hours.slice(0, 24)
            this.currentWeather = this.weather[0]
        }
    }
    startAuto() {
        this.autoInterval = setInterval(() => {
            if (this.weather.length > 0) {
                console.log(this.weather[0])
            }
        }, 600)
    }
    stopAuto() {
        clearInterval(this.autoInterval)
    }
    startClock() {
        let date = new Date()
        let hour = date.getHours()
        this.clock = setInterval(() => {
            let newDate = new Date()
            let newHour = date.getHours()
            if (newHour != hour) {
                this.weather = this.weather.slice(1)
                this.currentWeather = this.weather[0]
            }
            date = newDate
            hour = newHour
            if (this.weather.length <= 1) {
                this.updateData()
            }
        }, 60000)
    }

}

module.exports = Unit