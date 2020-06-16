module.exports = (server, local, eventHandler) => {
    server.get('/', async (req, res, next) => {
        let response = 'Welcome'
        res.send(response)
        next()
    })
    server.get('/things', async (req, res, next) => {
        res.send('connected things')
        next()
    })
}
