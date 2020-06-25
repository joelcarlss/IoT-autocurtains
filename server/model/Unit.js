require('dotenv').config()
const MqttHandler = require('../model/MqttHandler')
const { getGeoByIp, getGeoByLatLon, getWeatherByLatLon } = require('../utils/requests')

class Unit {
    constructor(goDown = true) {
        this.ip = undefined
        this.goDown = goDown
        this.positionPercent = 0
        this.latLon = {}
        this.geoData = {}
        this.currentWeather = {}
        this.milliseconds = 1800000
        this.autoInterval = undefined
        this.clock = undefined
        this.mqttConnection = undefined
        this.autoPreferences = {
            clouds: 70,
            solarAltitude: {
                top: 50,
                bottom: 10,
                reset: 0
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
    startClock() { // Removes 
        this.clock = setInterval(() => {
            this.updateData()
        }, 60000)
    }
    startAuto() {
        this.autoInterval = setInterval(() => {
            if (this.weather.length > 0) {
                console.log(this.currentWeather)
            }
        }, this.milliseconds)
    }
    stopAuto() {
        clearInterval(this.autoInterval)
    }
    setMqttConnection() {
        this.mqttConnection = new MqttHandler()
        this.mqttConnection.connect()
    }
    testInterval(cb) {
        setInterval(() => {
            this.currentWeather
            cb('hej')
        }, 60);
    }
    isTimeForMovement() {
        let { sun_altitude, sunrise, sunset, solar_noon, date } = this.geoData
        let { top, bottom, reset } = this.autoPreferences.solarAltitude

        let solarPositionIsOk = sun_altitude < top && sun_altitude > bottom
        let timeIsOk = false
        let currentTime = new Date()
        let noon = new Date(`${date}T${solar_noon}:00`)

        console.log(currentTime.toString())
        if (this.goDown) {
            let set = new Date(`${date}T${sunset}:00`)
            timeIsOk = currentTime < set && currentTime > noon
        } else {
            let rise = new Date(`${date}T${sunrise}:00`)
            timeIsOk = currentTime > rise && currentTime < noon
        }
        return timeIsOk && solarPositionIsOk
    }
    solarAltitudePercent() { // calculates current solar altitude percent
        let { top, bottom, reset } = this.autoPreferences.solarAltitude
        let mockAltitude = 12

    }
}

module.exports = Unit