module.exports = (app, local, eventHandler) => {
    app.get('/', async (req, res, next) => {
        let response = 'Welcome'
        res.send(response)
        next()
    })
}
