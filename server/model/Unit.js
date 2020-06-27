require('dotenv').config()
const MqttHandler = require('../model/MqttHandler')
const { getGeoByIp, getGeoByLatLon, getWeatherByLatLon } = require('../utils/requests')
const { contentSecurityPolicy } = require('helmet')
const { connect } = require('../routes/things')

class Unit {
    constructor(goDown = true) {
        this.ip = undefined
        this.goDown = goDown
        this.currentPercent = 0
        this.latLon = {
            lat: undefined,
            lon: undefined
        }
        this.geoData = {}
        this.currentWeather = {}
        this.milliseconds = 180000
        this.autoInterval = undefined
        this.clock = undefined
        this.mqtt = undefined
        this.autoPreferences = {
            clouds: 70,
            resetTo: 0,
            solarAltitude: {
                top: 50,
                bottom: 10,
                resetAt: 0
            }
        }
    }
    setMinutes(min) {
        this.milliseconds = min * 60000
    }
    getMinutes() {
        this.milliseconds = min / 60000
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
        console.log('1')
        let geoData
        if (this.latLon.lat && this.latLon.lon) {
            console.log('latlon')
            geoData = await getGeoByLatLon(this.latLon.lat, this.latLon.lon)
        } else if (this.ip) {
            console.log('ip')
            geoData = await getGeoByIp(this.ip)
            this.latLon = {
                lat: geoData.location.latitude,
                lon: geoData.location.longitude
            }
        } else {
            throw Error('Ip Missing')
        }
        this.geoData = geoData
        this.currentWeather = this.getWeather(this.latLon.lat, this.latLon.lon)
        return Promise.all([this.geoData, this.currentWeather]).then(() => { return true })
    }
    async getWeather(lat, lon) {
        if (lat && lon) {
            let { clouds, weather } = await getWeatherByLatLon(lat, lon)
            return {
                clouds: clouds.all,
                weather: weather[0]
            }
        } else {
            throw Error('No latitude or longitude')
        }
    }
    startAutoPosition() {
        console.log('Inteval started')
        this.autoInterval = setInterval(() => {
            this.runAutoPositioner()
        }, this.milliseconds)
    }
    runAutoPositioner() {
        let calcPercent = this.solarAltitudePercent()
        if (this.isTimeForMovement()) {
            this.updateData().then(() => {
                console.log('Time to move')
                console.log('Current Solar Altitude: ' + this.geoData.sun_altitude)
                if (this.goDown && calcPercent >= this.currentPercent) {
                    console.log('Sending message: ' + calcPercent)
                    this.sendMessage(calcPercent)
                } else if (!this.goDown && calcPercent <= this.currentPercent) {
                    console.log('Sending message: ' + calcPercent)
                    this.sendMessage(calcPercent)
                }
            })
        } else if (this.goDown && this.autoPreferences.solarAltitude.resetAt <= this.geoData.sun_altitude) {
            console.log('Reseting, Sending message: ' + this.autoPreferences.resetTo)
            this.sendMessage(this.autoPreferences.resetTo)
        }
    }
    stopAuto() {
        clearInterval(this.autoInterval)
    }
    setMqttConnection() {
        this.mqtt = new MqttHandler()
        this.mqtt.connect()
        this.mqtt.onMessage((msg) => this.setCurrentPercent(msg))
    }
    sendMessage(message) {
        if (this.mqtt) {
            this.mqtt.sendMessage(message)
        }
    }
    setCurrentPercent(message) {
        let num = Number(message)
        if (!isNaN(num)) {
            this.currentPercent = num
        }
    }
    isTimeForMovement() {
        let { sun_altitude, sunrise, sunset, solar_noon, date } = this.geoData
        let { top, bottom } = this.autoPreferences.solarAltitude

        let solarPositionIsOk = sun_altitude < top && sun_altitude > bottom
        let timeIsOk = false
        let currentTime = new Date()
        let noon = new Date(`${date}T${solar_noon}:00`)

        if (this.goDown) {
            let set = new Date(`${date}T${sunset}:00`)
            timeIsOk = currentTime < set && currentTime > noon
        } else {
            let rise = new Date(`${date}T${sunrise}:00`)
            timeIsOk = currentTime > rise && currentTime < noon
        }
        return timeIsOk && solarPositionIsOk
    }
    solarAltitudePercent() { // TODO: Calculate current solar altitude percent
        let { sun_altitude } = this.geoData
        let { top, bottom } = this.autoPreferences.solarAltitude
        let percent = (sun_altitude - bottom) / (top - bottom) * 100 // Calculate the percent of how close altitude is to top variable
        percent = 100 - percent // Reverse so the percent is for how close to down the sun is.
        if (percent > 100) {
            percent = 100
        } else if (percent < 0) {
            percent = 0
        }
    }
}

module.exports = Unit