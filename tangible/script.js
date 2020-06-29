let circle_r1;
let circle_r2;

const circles = [];

let cellSize = 20;
let cells = new Array(Math.floor(innerHeight / cellSize));
for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(Math.floor(innerWidth / cellSize));
}
for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
        cells[i][j] = 0;
    }
}

var client = mqtt.connect('mqtt://f689edec:4926cc8764167d4b@broker.shiftr.io', {
    clientId: 'javascript'
});

client.on('connect', function () {
    console.log('client has connected!');

    client.subscribe('/rotary1');
    client.subscribe('/rotary2');
    // client.unsubscribe('/example');

    // setInterval(function () {
    //     client.publish('/hello', 'world');
    // }, 1000);
});

client.on('message', function (topic, message) {
    //console.log('new message:', topic, message.toString());
    let obj = JSON.parse(message.toString());
    console.log('new message:', obj.rotary1);

    if (obj.hasOwnProperty('rotary1')) {
        circle_r1 = 5 * parseInt(obj.rotary1);
        console.log('circle_r1');
    }

    if (obj.hasOwnProperty('rotary2')) {
        circle_r2 = 5 * parseInt(obj.rotary2);
        console.log('circle_r2');
    }

});


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);
    bg = createGraphics(width, height);
    bg.background(255, 20);
    bg.noStroke();
    for (let i = 0; i < 300000; i++) {
        let x = random(width);
        let y = random(height);
        let s = noise(x * 0.01, y * 0.01) * 2;
        bg.fill(240, 50);
        bg.rect(x, y, s, s);
    }

}

function draw() {

    image(bg, 0, 0);

    // fill(0, 20);
    // rect(0, 0, window.innerWidth, window.innerHeight);

    // circles.push(new Circle(100, 100, circle_r1));
    // circles.push(new Circle(window.innerWidth - 300, window.innerWidth - 300, circle_r2));


    // circles.forEach(p => {
    //     p.display(255, 136, 115, 255);
    // });

    //fill('#FF887388');
    //noStroke();
    // circle(window.innerWidth - 300, window.innerHeight - 300, circle_r1);
    noFill();
    stroke('#BEB8EB88');
    ellipse(window.innerWidth - 300, window.innerHeight - 300, circle_r1, circle_r1);
    noFill();
    stroke('#A2BCE088');
    ellipse(300, 300, circle_r2, circle_r2);

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            fill('#888888FF');
            noStroke();
            let xpos = j * cellSize + cellSize / 2;
            let ypos = i * cellSize + cellSize / 2;
            let dist1 = Math.sqrt(Math.pow((window.innerWidth - 300 - xpos), 2) + Math.pow((window.innerHeight - 300 - ypos), 2));
            let dist2 = Math.sqrt(Math.pow((300 - xpos), 2) + Math.pow((300 - ypos), 2));
            if (dist1 < circle_r1 / 2) {
                fill('#FF887333');
                ellipse(xpos, ypos, cellSize * 2, cellSize * 2);
            } else if (dist2 < circle_r2 / 2) {
                fill('#9F9CFF33')
                ellipse(xpos, ypos, cellSize * 2, cellSize * 2);
            }
            ellipse(xpos, ypos, cellSize / 14, cellSize / 14);
        }
    }

}

class Circle {
    constructor(xpos, ypos, radius) {
        this.x = xpos;
        this.y = ypos;
        this.r = radius;
    }

    display(r, g, b, a) {
        noStroke();
        fill(r, g, b, a);
        circle(this.x, this.y, this.r)
    }

}