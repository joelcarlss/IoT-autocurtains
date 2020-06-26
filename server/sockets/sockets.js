const { connect } = require('../routes/things');

module.exports = (server) => {
    const io = require('socket.io')(server);
    io.on('connection', client => {
        console.log('connect')
        client.on('event', data => { console.log('event') });
        client.on('disconnect', () => { console.log('disconnect') });
    });
    server.listen(3001);
}