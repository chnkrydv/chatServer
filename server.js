var http = require('http');
var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

function onRequest(req, res) {
    res.writeHead('200', { 'Content-Type': 'text/html' });

    fs.readFile('./index.html', function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(404);
            res.write('Page Not Found');
        } else {
            res.write(data);
            res.end();
        }
    });
}

http.createServer(onRequest).listen(8888);

mongo.connect('mongodb://127.0.0.2/chat', function(err, db) {
    if (err) throw err;
    client.on('connection', function(socket) {
        console.log('someone connected');
        var coll = db.collection('messages');

        //get message from server
        socket.on('input', function(data) {
            var name = data.name;
            var message = data.message;

            //emit latest message to all clients
            client.emit('output', [data]);

            coll.insert({ name: name, message: message }, function() {
                console.log('inserted');
            });
        });

        //emit all messages to client
        var allMsg = coll.find().limit(100).sort({ _id: 1 }).toArray(function(err, res) {
            if (err) throw err;
            socket.emit('output', res);
        });

    })
});