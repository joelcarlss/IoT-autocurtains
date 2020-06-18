module.exports = class Things {
    constructor() {
        this.units = []
    }
    add(unit) {
        this.units.push(unit)
    }
    getById(id) {
        this.units[id]
    }
    getAll() {
        return this.units
    }

}