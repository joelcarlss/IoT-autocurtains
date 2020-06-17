module.exports = (server, local, eventHandler) => {
    server.get('/', async (req, res, next) => {
        let response = 'Welcome'
        res.send(response)
        next()
    })
}
