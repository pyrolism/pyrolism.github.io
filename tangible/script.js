// Note: This line is only required when running in node.js
var mqtt = require('mqtt');

var client = mqtt.connect('mqtt://f689edec:4926cc8764167d4b@broker.shiftr.io', {
    clientId: 'javascript'
});

client.on('connect', function () {
    console.log('client has connected!');

    client.subscribe('/example');
    // client.unsubscribe('/example');

    setInterval(function () {
        client.publish('/hello', 'world');
    }, 1000);
});

client.on('message', function (topic, message) {
    console.log('new message:', topic, message.toString());
});