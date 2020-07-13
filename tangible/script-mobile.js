var client = mqtt.connect("mqtt://f689edec:4926cc8764167d4b@broker.shiftr.io", {
    clientId: 'javascript-mobile'
});

client.on('connect', function () {
    console.log('client has connected!');

    client.subscribe('/example');
    client.subscribe('/web');
    // client.unsubscribe('/example');

});

client.on('message', function (topic, message) {
    //console.log('new message:', topic, message.toString());
    if (message.toString() === 'started') {
        document.getElementById('btnTutorial').style.display = "none";
        document.getElementById('btnPlay').style.display = "none";
        document.getElementById('btnStop').style.display = "block";
    }
});

function tutorial() {
    client.publish('/btnTutorial', '1');
}

function play() {
    client.publish('/btnPlay', '1');
}

function stop() {
    client.publish('/btnStop', '1');
    document.getElementById('btnStop').style.display = "none";
    document.getElementById('btnResume').style.display = "block";
}

function resume() {
    client.publish('/btnResume', '1');
    document.getElementById('btnResume').style.display = "none";
    document.getElementById('btnStop').style.display = "block";
}