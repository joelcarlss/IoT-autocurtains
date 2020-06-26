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
        // unit.testInterval((value) => {
        //     console.log(value)
        // })
        // unit.setMqttConnection()
        setTimeout(() => unit.isTimeForMovement(), 3000)
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