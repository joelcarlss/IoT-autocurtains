require('dotenv').config()
let utils = require('../utils/hue')
let hue = require('node-hue-api')
var HueApi = require('node-hue-api').HueApi
var hueApi = new HueApi()

// Inherited from other project.
class Hue {
    constructor() {
        this.userDescription = 'Home built project in node'
        this.username = process.env.HUE_TOKEN
        this.host = process.env.HUE_IP
        this.device = false
    }

    // Gateway functionality
    async connect() {
        this.api = new HueApi(this.host, this.username)
        let description = await this.getDescription()
        return 'Connected to: ' + description.name
    }

    async getDescription() {
        let result = this.api.getDescription()
        return result
    }

    async findBridges() {
        try {
            let bridges = await hue.upnpSearch()
            return bridges
        } catch (e) {
            console.log(e)
        }
    }

    // User

    // Requires bridge button to be pressed
    // Returns username
    async registerUser(ip) {
        let result = await hueApi.registerUser(ip, this.userDescription)
        this.username = result
        return result
    }
    async getUsers() {
        let result = this.api.registeredUsers()
        return result
    }
    // Returns true if user is deleted
    async deleteUser(username) {
        let result = this.api.deleteUser(username)
        return result
    }

    // Returns state for every unit
    async getFullState() {
        let result = this.api.fullState()
        return result
    }

    // Returns all lights
    async getLights() {
        let { lights } = await this.api.lights()
        lights.forEach(light => {
            if (light.state.colormode === 'xy') {
                let x = light.state.xy[0]
                let y = light.state.xy[1]
                let bri = light.state.bri
                light.state.rgb = utils.xyBriToRgb(x, y, bri)
            }
        })
        return lights
    }

    // Single Light
    async getLightStateById(id) {
        let light = await this.api.lightStatus(id)
        let x = light.state.xy[0]
        let y = light.state.xy[1]
        let bri = light.state.bri
        light.state.rgb = utils.xyBriToRgb(x, y, bri)
        return light
    }

    async setLightState(id, bool) {
        let createState = hue.lightState.create()
        let state = bool ? createState.turnOn() : createState.turnOff()
        let result = await this.api.setLightState(id, state)
        return result
    }

    // Uses percentage
    async setBrightness(id, percentage) {
        let state = hue.lightState.create().brightness(percentage)
        let result = await this.api.setLightState(id, state)
        // if (result) {
        //   result = {value: percentage}
        // }
        return result
    }
    async setRgbColor(id, rgb) {
        let result
        let { r, g, b } = rgb
        let light = await this.getLightStateById(id)
        if (light.state.colormode === 'xy') {
            let state = hue.lightState.create().rgb(r, g, b)
            result = await this.api.setLightState(id, state)
        } else {
            result = 'Not a colorlamp'
        }

        return result
    }

    // Sensors

    async getMovementSensors() {
        let arr = []
        let sensors = await this.getSensors()
        sensors.forEach(element => {
            if (element.type === 'ZLLPresence') {
                arr.push(element)
            }
        })
        return arr
    }

    async getTemperatureSensors() {
        let arr = []
        let sensors = await this.getSensors()
        sensors.forEach(element => {
            if (element.type === 'ZLLTemperature') {
                arr.push(element)
            }
        })
        return arr
    }

    async getDaylightSensors() {
        let arr = []
        let sensors = await this.getSensors()
        sensors.forEach(element => {
            if (element.type === 'ZLLLightLevel') {
                arr.push(element)
            }
        })
        return arr
    }

    async getInteractionSensors() {
        let switches = await this.getSwitches()
        let sensors = await this.getMovementSensors()
        let result = switches.concat(sensors)
        return result
    }

    async getLastActiveSensor() {
        let obj = {}
        let highestNumber = 0
        let sensors = await this.getInteractionSensors()
        sensors.forEach(element => {
            let lastUpdated = element.state.lastupdated
            var string = lastUpdated.replace(/-/g, '').replace(/:/g, '').replace(/[TZ]/g, '')
            let number = parseInt(string)
            if (number > highestNumber) {
                highestNumber = number
                obj = element
            }
        })
        return obj
    }

    async getSwitches() {
        let arr = []
        let sensors = await this.getSensors()
        sensors.forEach(element => {
            if (element.state.buttonevent) {
                arr.push(element)
            }
        })
        return arr
    }

    async getSensors() {
        let result = await this.api.getSensors()
        let sensors = this.filterSensors(result.sensors)
        return sensors
    }
    filterSensors(sensors) {
        let arr = []
        sensors.forEach(element => {
            if (element.manufacturername === 'Philips') {
                if (element.config.reachable === true) {
                    if (element.config.battery) {
                        arr.push(element)
                    }
                }
            }
        })
        return arr
    }

    async getSensorById(searchId) {
        let result = await this.getSensors()
        let array = result.filter(({ id }) => (id === searchId))
        if (array.length > 0) {
            return array[0]
        } else {
            throw new Error('No match')
        }
    }

    // Rooms

    async getRooms() {
        let result = await this.api.groups()
        result = result.filter(room => room.type === 'Room')
        return result
    }
    async getRoomById(id) {
        let result = await this.api.getGroup(id)
        return result
    }
    async setRoomStateById(id, bool) {
        let createState = hue.lightState.create()
        let state = bool ? createState.turnOn() : createState.turnOff()
        let result = await this.api.setGroupLightState(id, state)
        return result
    }
    async setRoomBrightnessById(id, percentage) {
        let state = hue.lightState.create().brightness(percentage)
        let result = await this.api.setGroupLightState(id, state)
        return result
    }
    async setRoomColorById(id, rgb) {
        let result
        let { r, g, b } = rgb
        let state = hue.lightState.create().rgb(r, g, b)
        result = await this.api.setGroupLightState(id, state)

        return result
    }
}

module.exports = Hue
