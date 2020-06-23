const Things = require('../model/Things')
const Unit = require('../model/Unit')
let things = new Things()


module.exports = {
    connectByLatLon: (lat, lon) => {
        let unit = new Unit()
        unit.setLatLon(lat, lon)
        unit.updateData()
        unit.startAuto()
        unit.startClock()
        unit.setMqttConnection()
        things.add(unit)
    },
    connectByIp: (ip) => {
        let unit = new Unit()
        unit.setIp(ip)
        unit.updateData()
        unit.startAuto()
        unit.startClock()
        things.add(unit)
    },
    getUnits: () => {
        things.getAll()
    }
}