require('dotenv').config()
const MqttHandler = require('../model/MqttHandler')
const { getGeoByIp, getGeoByLatLon, getWeatherByLatLon } = require('../utils/requests')

class Unit {
    constructor(goDown = true) {
        this.ip = undefined
        this.goDown = goDown
        this.currentPercent = 0
        this.latLon = {}
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
    updateData() {
        if (this.latLon.lat && this.latLon.lon) {
            getGeoByLatLon(this.latLon.lat, this.latLon.lon).then(d => this.geoData = d)
            this.updateWeather()
        } else if (this.ip) {
            getGeoByIp(this.ip).then((d) => {
                this.geoData = d
                this.latLon = { lat, lon } = d.location
                this.updateWeather()
            })
        } else {
            throw Error('Ip Missing')
        }
    }
    updateWeather() {
        if (this.latLon.lat && this.latLon.lon) {
            getWeatherByLatLon(this.latLon.lat, this.latLon.lon).then(({ clouds, weather }) => {
                this.currentWeather = {
                    clouds: clouds.all,
                    weather: weather[0]
                }
            })
        }
    }
    startClock() {
        this.clock = setInterval(() => {
            this.updateData()
        }, 60000)
    }
    startAutoPosition() {
        console.log('Inteval started')
        this.autoInterval = setInterval(() => {
            console.log('Current Solar Altitude: ' + this.geoData.sun_altitude)
            console.log('Current Time: ' + Date.now())
            let calcPercent = this.solarAltitudePercent()
            if (this.isTimeForMovement()) {
                console.log('Time to move')
                if (this.goDown && calcPercent >= this.currentPercent) {
                    console.log('Sending message: ' + calcPercent)
                    this.sendMessage(calcPercent)
                } else if (!this.goDown && calcPercent <= this.currentPercent) {
                    console.log('Sending message: ' + calcPercent)
                    this.sendMessage(calcPercent)
                }
            } else if (this.goDown && this.autoPreferences.solarAltitude.resetAt <= this.geoData.sun_altitude) {
                console.log('Reseting, Sending message: ' + this.autoPreferences.resetTo)
                this.sendMessage(this.autoPreferences.resetTo)
            }
        }, this.milliseconds)
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