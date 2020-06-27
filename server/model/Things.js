module.exports = class Things {
    constructor() {
        this.units = []
    }
    add(unit) {
        this.units.push(unit)
        this.startUnit(unit)
    }
    getById(id) {
        this.units[id]
    }
    getAll() {
        return this.units
    }
    startUnit(unit) {
        unit.updateData()
        unit.startClock()
        unit.setMqttConnection()
        unit.startAutoPosition()
    }

}