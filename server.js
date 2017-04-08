var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
    if (err) throw err;
    client.on('connection', function(socket) {
        console.log('someone connected');
        var coll = db.collection('messages');

        //get message from server
        socket.on('input', function(data) {
            var name = data.name;
            var message = data.message;

            coll.insert({ name: name, message: message }, function() {
                console.log('inserted');
            });
        });

        //emit status to client
        socket.emit('output', );
    })
})