document.getElementById("landingScreen").onclick = function (event) {
  let elem = document.getElementById("landingScreen");
  elem.style.transition = "all 1s ease-in-out";
  elem.style.opacity = "0";

  if (document.getElementById("landingScreen").style.opacity == "0") {
    document.getElementById("landingScreen").style.display = "none";
  }
};

document.getElementById("tutorialScreen").onclick = function (event) {
  let elem = document.getElementById("tutorialScreen");
  elem.style.transition = "all 0.5s ease-in";
  elem.style.top = "-2000px";
};

let mode = "DE";

let colors = [
  "#F25F5C55",
  "#F9A03F55",
  "#F4D35E55",
  "#70C1B355",
  "#BDD5EA55",
  "#7678ED55",
  "#5B5F9755",
  "#FFA5AB55",
];

let diskUID = [
  "6A 82 23 28",
  "9A C4 28 28",
  "8A 1B F1 3F",
  "09 64 57 B3",
  "99 01 6A B3",
  "DA 67 EB 3F",
  "2A E2 04 40",
  "FA FC 21 28",
];

var synth = new Tone.Synth().toMaster();
var kit = new Tone.Players({
  se: "se.mp3",
});
kit.toMaster();

let clients_canvas = [];

let circle_r = [0, 0, 0, 0];
let isColorReceived = 0;
let isWrongDir = 1;

let color_r = ["#33333333", "#33333333", "#33333333", "#33333333"];

const circles = [];
const numCircles = 4;

const gridCircles = [];

const circles_c = [];
for (let x = 0; x < numCircles; x++) {
  circles_c[x] = [];
}

const ripple = [];

let cellSize = 20;

let boardWidth = Math.ceil(window.innerWidth / cellSize);
let boardHeight = Math.ceil(window.innerHeight / cellSize);

let cells = [];
let next = [];
let previous = [];
let states = 5;
for (let x = 0; x < boardWidth; x++) {
  cells[x] = [];
}
for (let x = 0; x < boardWidth; x++) {
  next[x] = [];
}
for (let x = 0; x < boardWidth; x++) {
  previous[x] = [];
}

let totalCells = boardWidth * boardHeight;

var predatorMin = 3;
var randomPredatorMinimum = 3;
var prevTime = 0,
  interval = 10;
var iterationCount = 0;
let isColorInserted = 0;

let rBlink = cellSize;
let easing = 0.5;
let noiseScale = 2000;

var client = mqtt.connect("mqtt://f689edec:4926cc8764167d4b@broker.shiftr.io", {
  clientId: "javascript",
});

client.on("connect", function () {
  console.log("client has connected!");

  client.subscribe("/rotary1");
  client.subscribe("/rfid1");
  client.subscribe("/onerev1");
  client.subscribe("/rotary2");
  client.subscribe("/rfid2");
  client.subscribe("/onerev2");
  client.subscribe("/rotary3");
  client.subscribe("/rfid3");
  client.subscribe("/onerev3");
  client.subscribe("/rotary4");
  client.subscribe("/rfid4");
  client.subscribe("/onerev4");
  client.subscribe("/button");
  client.unsubscribe("/example");

  // setInterval(function () {
  //     client.publish('/hello', 'world');
  // }, 1000);
});

client.on("message", function (topic, message) {
  //console.log('new message:', topic, message.toString());
  let obj = JSON.parse(message.toString());
  //console.log(topic, obj);

  for (let i = 0; i < numCircles; i++) {
    let circleIndex = (i + 1).toString();
    let rotaryTopic = "/rotary" + circleIndex;
    if (topic === rotaryTopic) {
      if (obj.hasOwnProperty("rSpeed")) {
        circle_r[i] = 10 * parseInt(obj.rSpeed);
      }
      if (obj.hasOwnProperty("rDir")) {
        if (obj.rDir === "0") {
          image(img_error, circles[i].pos.x - 40, circles[i].pos.y - 40);
          isWrongDir = 1;
          synth.triggerAttackRelease("C3", "8n");
        } else {
          isWrongDir = 0;
        }
      }
    }

    let rfidTopic = "/rfid" + circleIndex;
    if (topic === rfidTopic) {
      if (obj.hasOwnProperty("UID")) {
        for (let k = 0; k < diskUID.length; k++) {
          if (obj.UID === diskUID[k]) {
            color_r[i] = colors[k];
          }
        }
        isColorReceived = 1;
        //console.log("s");
      }
    }

    let onerevTopic = "/onerev" + circleIndex;
    if (topic === onerevTopic) {
      if (
        obj.hasOwnProperty("rOneRev") &&
        isColorReceived == 1 &&
        isWrongDir != 1
      ) {
        let angle = random(-TWO_PI / 2, TWO_PI / 2);
        let xpos = circles[i].pos.x + cos(angle) * random(0, circles[i].r / 2);
        let ypos = circles[i].pos.y + sin(angle) * random(0, circles[i].r / 2);
        //console.log(circles[i].pos.x, circles[i].pos.y, xpos, ypos);
        circles_c[i].push(new Circle(xpos, ypos, random(20, 60)));
        //console.log(sin(angle), cos(angle));
        let currentColor = color(circles[i].color);
        let r_value = red(currentColor) + Math.floor(random(-10, 10));
        let g_value = green(currentColor) + Math.floor(random(-10, 10));
        let b_value = blue(currentColor) + Math.floor(random(-10, 10));
        let newColor = color(r_value, g_value, b_value, 100);
        circles_c[i][circles_c[i].length - 1].setColor(newColor);
        ripple.push(new Circle(xpos, ypos, circles[i].r, circles[i].r));
        ripple[ripple.length - 1].setColor(currentColor);
        isColorInserted = 1;
        //synth.triggerAttackRelease("B4", "16n");
        kit.get("se").start();
      }
    }
  }

  if (topic === "/button") {
    if (obj.hasOwnProperty("button1")) {
      clients_canvas[0].clear();
      circles_c[0].splice(0, circles_c[0].length);
    }
    if (obj.hasOwnProperty("button2")) {
      clients_canvas[1].clear();
      circles_c[1].splice(0, circles_c[1].length);
    }
    if (obj.hasOwnProperty("button3")) {
      clients_canvas[2].clear();
      circles_c[2].splice(0, circles_c[2].length);
    }
    if (obj.hasOwnProperty("button4")) {
      clients_canvas[3].clear();
      circles_c[3].splice(0, circles_c[3].length);
    }
  }

  // if (topic === "/rotary1") {
  //   if (obj.hasOwnProperty("rSpeed")) {
  //     circle_r1 = 50 * parseInt(obj.rSpeed);
  //     //frameRate(parseInt(obj.rSpeed) + 1);
  //   }
  // }
  // if (topic === "/rfid1") {
  //   if (obj.hasOwnProperty("UID")) {
  //     for (let i = 0; i < diskUID.length; i++) {
  //       if (obj.UID === diskUID[i]) {
  //         color_r1 = colors[i];
  //       }
  //     }
  //   }
  // }

  // if (topic === "/rotary2") {
  //   if (obj.hasOwnProperty("rSpeed")) {
  //     circle_r2 = 50 * parseInt(obj.rSpeed);
  //     frameRate(parseInt(obj.rSpeed) + 1);
  //   }
  // }
  // if (topic === "/rfid2") {
  //   if (obj.hasOwnProperty("UID")) {
  //     for (let i = 0; i < diskUID.length; i++) {
  //       if (obj.UID === diskUID[i]) {
  //         color_r2 = colors[i];
  //       }
  //     }
  //   }
  // }

  // if (topic === "/rotary3") {
  //   if (obj.hasOwnProperty("rSpeed")) {
  //     circle_r3 = 50 * parseInt(obj.rSpeed);
  //     //frameRate(parseInt(obj.rSpeed) + 1);
  //   }
  // }
  // if (topic === "/rfid3") {
  //   if (obj.hasOwnProperty("UID")) {
  //     for (let i = 0; i < diskUID.length; i++) {
  //       if (obj.UID === diskUID[i]) {
  //         color_r3 = colors[i];
  //       }
  //     }
  //   }
  // }
});

// let img;
let img_error;
let ele;

function preload() {
  img_error = loadImage("img/Error_CW.png");
}

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.parent("canvasContainer");
  background(255);

  frameRate(60);

  ele = createAudio("bgmusic.mp3");

  img_error.resize(80, 80);

  bg = createGraphics(width, height);
  bg.background(255, 70);
  bg.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x * 0.01, y * 0.01) * 2;
    bg.fill(240, 70);
    bg.rect(x, y, s, s);
  }

  /* draw grid */
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      let xpos = i * cellSize + cellSize / 2;
      let ypos = j * cellSize + cellSize / 2;
      bg.fill("#888888FF");
      bg.noStroke();
      bg.ellipse(xpos, ypos, cellSize / 15, cellSize / 15);
    }
  }

  for (let i = 0; i < numCircles; i++) {
    circles.push(new Circle(random(width), random(height), 50));
  }

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      gridCircles.push(
        new Circle(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 20)
      );
    }
  }

  // for (let i = 0; i < clients_canvas.length; i++) {
  //   clients_canvas[i] = createGraphics(width, height);
  // }
  clients_canvas[0] = createGraphics(width, height);
  clients_canvas[1] = createGraphics(width, height);
  clients_canvas[2] = createGraphics(width, height);
  clients_canvas[3] = createGraphics(width, height);

  initCell();
}

let value = 0;

function keyTyped() {
  if (mode === "CA") {
    if (key === "r") {
      value = 1;
    }
    if (key === "c") {
      value = 2;
    }
    if (key === "p") {
      value = 3;
    }
    if (key == "y") {
      value = 4;
    }
    if (key == "k") {
      value = 0;
    }
  }

  if (key == "q") {
    mode = "DE";
  }
  if (key == "a") {
    mode = "CA";
  }
}

function mousePressed() {
  let m_radius = 150;
  ellipse(mouseX, mouseY, m_radius);
  let c_mouseX = Math.ceil(mouseX / cellSize) * cellSize - cellSize / 2;
  let c_mouseY = Math.ceil(mouseY / cellSize) * cellSize - cellSize / 2;
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      let xpos = i * cellSize + cellSize / 2;
      let ypos = j * cellSize + cellSize / 2;
      let dist = Math.sqrt(
        Math.pow(c_mouseX - xpos, 2) + Math.pow(c_mouseY - ypos, 2)
      );
      if (dist < m_radius / 2) cells[i][j] = value;

      //console.log(mouseX, mouseY, xpos, ypos, dist);
    }
  }
}

function draw() {
  ele.loop();
  // if (frameCount % 5 == 0) {

  //image(img, 0, 0);
  if (mode === "DE") {
    image(bg, 0, 0);
    // }
    // noFill();
    // stroke("#333333");
    // rect(width / 5, height / 5, (width * 3) / 5, (height * 3) / 5);
    //updateCell();

    for (let i = 0; i < numCircles; i++) {
      circles[i].setRadius(circle_r[i]);
    }
    circles[0].setColor(color_r[0]);
    circles[1].setColor(color_r[1]);
    circles[2].setColor(color_r[2]);
    circles[3].setColor(color_r[3]);
    //console.log(color_r1, color_r2);

    for (let i = 0; i < circles_c.length; i++) {
      circles_c[i].forEach((p) => {
        p.edges();
        p.move_drop();
        if (frameCount % 60 == 0) {
          p.shrinkCircle();
          //p.dimCircle();
        }
      });
      for (let j = 0; j < circles_c[i].length; j++) {
        clients_canvas[i].noStroke();
        clients_canvas[i].fill(circles_c[i][j].color);
        clients_canvas[i].ellipse(
          circles_c[i][j].pos.x,
          circles_c[i][j].pos.y,
          circles_c[i][j].r,
          circles_c[i][j].r
        );
      }

      // if (circles_c1[i].r > 0) {
      //   circles_c1[i].setRadius(circles_c1[i].r - 1);
      // }
      //console.log(circles_c1[i].pos.x, circles_c1[i].pos.y);
    }

    // gridCircles.forEach((p) => {
    //   p.blink();
    // });

    /* draw grid */
    for (let i = 0; i < boardWidth; i++) {
      for (let j = 0; j < boardHeight; j++) {
        let xpos = i * cellSize + cellSize / 2;
        let ypos = j * cellSize + cellSize / 2;

        for (let n = 0; n < ripple.length; n++) {
          let dist = Math.sqrt(
            Math.pow(ripple[n].pos.x - xpos, 2) +
              Math.pow(ripple[n].pos.y - ypos, 2)
          );
          if (dist < ripple[n].r / 2 && dist > (ripple[n].r / 2) * 0.9) {
            fill(ripple[n].color);
            noStroke();
            ellipse(xpos, ypos, cellSize, cellSize);
          }
        }

        //     fill("#888888FF");
        //     noStroke();
        //     ellipse(xpos, ypos, cellSize / 15, cellSize / 15);

        //     // let isBlink = floor(random(5 * totalCells));
        //     // //console.log(isBlink);
        //     // if (isBlink < 1) {
        //     //   gridCircles[i * boardHeight + j].setColor("#FFFFFFFF");
        //     // } else {
        //     //   gridCircles[i * boardHeight + j].setColor("#00000000");
        //     // }

        // for (let n = 0; n < circles.length; n++) {
        //   let dist = Math.sqrt(
        //     Math.pow(circles[n].pos.x - xpos, 2) +
        //     Math.pow(circles[n].pos.y - ypos, 2)
        //   );
        //   if (dist <= circles[n].r / 2) {
        //     fill(circles[n].color);
        //     noStroke();
        //     let radius = map(dist, 0, circles[n].r / 2, 50, 0);
        //     //rectMode(RADIUS);
        //     // triangle(
        //     //   xpos,
        //     //   ypos,
        //     //   xpos - radius,
        //     //   ypos + radius,
        //     //   xpos + radius,
        //     //   ypos + radius
        //     // );
        //     ellipse(xpos, ypos, radius, radius);
        //     for (let k = 0; k < colors.length; k++) {
        //       if (circles[n].color === colors[k]) {
        //         //console.log(circles[n]);
        //         cells[i][j] = k + 1;
        //       }
        //     }
        //     //rotate(PI / 2);
        //   }
        // }

        //     // if (cells[i][j] == 1) {
        //     //   fill('#FCCF1222');
        //     //   noStroke();
        //     //   ellipse(xpos - cellSize / 2, ypos - cellSize / 2, cellSize, cellSize);
        //     // } else {

        //     //fill('#15224488');
        //     // }

        // if (cells[i][j] != previous[i][j]) {
        //   if (cells[i][j] == 1) {
        //     fill(colors[0]);
        //   } else if (cells[i][j] == 2) {
        //     fill(colors[1]);
        //   } else if (cells[i][j] == 3) {
        //     fill(colors[2]);
        //   } else if (cells[i][j] == 4) {
        //     fill(colors[3]);
        //   } else fill("#33333300");
        //   noStroke();
        //   ellipse(xpos, ypos, cellSize, cellSize);
        // }

        //   }

        // image(bg, 0, 0);
        // }
      }
    }
    // fill("#ed1234");
    // textSize(24);
    // text(int(frameRate()), 20, 100);

    image(clients_canvas[0], 0, 0);
    image(clients_canvas[1], 0, 0);
    image(clients_canvas[2], 0, 0);
    image(clients_canvas[3], 0, 0);

    // noFill();
    // stroke("#BEB8EB88");
    // ellipse(
    //   window.innerWidth - 300,
    //   window.innerHeight - 300,
    //   circle_r1,
    //   circle_r1
    // );
    // noFill();
    // stroke("#A2BCE088");
    // ellipse(300, 300, circle_r2, circle_r2);

    // for (let i = 0; i < cells.length; i++) {
    //   for (let j = 0; j < cells[i].length; j++) {
    //     fill("#888888FF");
    //     noStroke();
    //     let xpos = j * cellSize + cellSize / 2;
    //     let ypos = i * cellSize + cellSize / 2;

    //     ellipse(xpos, ypos, cellSize / 14, cellSize / 14);

    //     let dist1 = Math.sqrt(
    //       Math.pow(window.innerWidth - 300 - xpos, 2) +
    //         Math.pow(window.innerHeight - 300 - ypos, 2)
    //     );
    //     let dist2 = Math.sqrt(Math.pow(300 - xpos, 2) + Math.pow(300 - ypos, 2));
    //     if (dist1 < circle_r1 / 2) {
    //       fill("#BEB8EB33");
    //       ellipse(xpos, ypos, cellSize * 2, cellSize * 2);
    //     } else if (dist2 < circle_r2 / 2) {
    //       fill("#A2BCE033");
    //       ellipse(xpos, ypos, cellSize, cellSize);
    //     }
    //   }
    // }
  }

  if (mode === "CA") {
    image(bg, 0, 0);
    //fill(240);
    //rect(0, 0, width, height);
    for (y = 0; y < boardHeight; y++) {
      for (x = 0; x < boardWidth; x++) {
        let xpos = x * cellSize;
        let ypos = y * cellSize;
        for (let n = 0; n < circles.length; n++) {
          let dist = Math.sqrt(
            Math.pow(circles[n].pos.x - xpos, 2) +
              Math.pow(circles[n].pos.y - ypos, 2)
          );
          if (dist <= circles[n].r / 2) {
            fill(circles[n].color);
            noStroke();
            let radius = map(dist, 0, circles[n].r / 2, 50, 0);
            //rectMode(RADIUS);
            // triangle(
            //   xpos,
            //   ypos,
            //   xpos - radius,
            //   ypos + radius,
            //   xpos + radius,
            //   ypos + radius
            // );
            ellipse(xpos, ypos, radius, radius);
            if (isColorInserted == 1) {
              isColorInserted = 0;
              for (let k = 0; k < colors.length; k++) {
                if (circles[n].color === colors[k]) {
                  cells[x][y] = n;
                }
              }
            }

            //rotate(PI / 2);
          }
        }
        // if (cells[x][y] != previous[x][y]) {
        if (cells[x][y] == 4) {
          fill("#00000000");
        } else fill(color_r[cells[x][y]]);
        rect(xpos, ypos, cellSize, cellSize);
        // }
      }
    }
    if (millis() - prevTime > interval) {
      step();
      prevTime = millis();
    }
  }

  circles.forEach((p) => {
    p.edges();
    p.move();
    p.displayPos();
    p.display();
  });

  ripple.forEach((p) => {
    p.edges();
    p.display();
    p.expandCircle();
    p.dimCircle();
  });
  for (let i = 0; i < ripple.length; i++) {
    if (ripple[i].r > 1500) {
      ripple.splice(i, 1);
      break;
    }
  }
}

class Circle {
  constructor(xpos, ypos, radius) {
    this.dir = createVector(0, 0);
    this.pos = createVector(xpos, ypos);
    this.vel = createVector(0, 0);
    this.r = radius;
    //this.speed = 0.4;
    this.color = "#33333333";
    this.xn = random(2048);
    this.yn = random(2048);
    this.speed = 0.4;
    this.opacity = 100;
  }

  move() {
    this.xn += 0.001;
    this.yn += 0.001;
    this.pos.x = -(width / 5) + ((noise(this.xn) * 7) / 5) * window.innerWidth;
    // this.pos.x += 10;
    this.pos.y =
      -(height / 5) + ((noise(this.yn) * 7) / 5) * window.innerHeight;
  }

  move_drop() {
    var angle =
      noise(this.pos.x / noiseScale, this.pos.y / noiseScale) *
      TWO_PI *
      noiseScale;
    this.dir.x = cos(angle);
    // this.dir.x = 1;
    this.dir.y = sin(angle);
    // this.dir.y = 1;
    this.vel = this.dir.copy();
    this.vel.mult(this.speed);
    this.pos.add(this.vel);
  }

  display() {
    noStroke(this.color);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
  }

  displayPos() {
    stroke(this.color);
    noFill(this.color);
    ellipse(this.pos.x, this.pos.y, 50, 50);
    line(this.pos.x + 20, this.pos.y, this.pos.x + 30, this.pos.y);
    line(this.pos.x - 20, this.pos.y, this.pos.x - 30, this.pos.y);
    line(this.pos.x, this.pos.y + 20, this.pos.x, this.pos.y + 30);
    line(this.pos.x, this.pos.y - 20, this.pos.x, this.pos.y - 30);
    noStroke(this.color);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }

  shrinkCircle() {
    //this.r /= 1.2;
  }

  expandCircle() {
    this.r *= 1.1;
  }

  dimCircle() {
    let currentColor = color(this.color);
    let newAlpha = alpha(currentColor);
    newAlpha /= 1.1;
    this.color = color(
      red(currentColor),
      green(currentColor),
      blue(currentColor),
      newAlpha
    );
  }

  edges() {
    if (this.pos.x < 0) {
      this.pos.x = window.innerWidth;
    }
    if (this.pos.x > window.innerWidth) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = window.innerHeight;
    }
    if (this.pos.y > window.innerHeight) {
      this.pos.y = 0;
    }
    // if (this.pos.x < 0 || this.pos.x > width) {
    //   this.vel.x *= -1;
    // }
    // if (this.pos.y < 0 || this.pos.y > height) {
    //   this.vel.y *= -1;
    // }
  }

  blink() {
    this.r -= 1 * easing;
    if (this.r < 0.5) {
      this.r = 20;
    }
    this.display();
  }

  setColor(cHex) {
    this.color = cHex;
  }

  setRadius(radius) {
    this.r = radius;
  }
}

function initCell() {
  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      // Filling the rest randomly
      //cells[i][j] = 4;
      cells[i][j] = int(random(states));
      //next[i][j] = 0;
      previous[i][j] = 4;
    }
  }
}

function updateCell() {
  // let neighbors = [];

  // for (let i = 0; i < 8; i++) {
  //     neighbors[i] = 0;
  // }
  for (let i = 1; i < width / cellSize - 1; i++) {
    for (let j = 1; j < height / cellSize - 1; j++) {
      let threshold = 3;
      /* scissors paper rock */
      for (let k = 0; k < 5; k++) {
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (cells[i + x][j + y] == k) {
              neighbors++;
            }
          }
        }
        if (cells[i][j] == k) {
          neighbors--;
        }
        let predator = k - 1;
        if (predator + 1 == 0) {
          predator = 4;
        }
        let predator2 = (k + 2) % 5;

        // if (cells[i][j] == predator) {
        //   if (neighbors >= threshold + Math.floor(random(3))) {
        //     next[i][j] = k;
        //   } else {
        //     next[i][j] = cells[i][j];
        //   }
        // }

        if (cells[i][j] == predator || cells[i][j] == predator2) {
          if (neighbors >= threshold + Math.floor(random(3))) {
            next[i][j] = k;
          } else if (cells[i][j] != predator2) {
            next[i][j] = cells[i][j];
          }
        }
        // if (cells[i][j] == predator2) {
        //   if (neighbors >= threshold + Math.floor(random(3))) {
        //     next[i][j] = k;
        //   } else if (cells[i][j] != predator) {
        //     next[i][j] = cells[i][j];

        //   }
        // }
      }

      // let gCount = 0;
      // for (let x = -1; x <= 1; x++) {
      //   for (let y = -1; y <= 1; y++) {
      //     if (cells[i + x][j + y] == 2) {
      //       gCount++;
      //     }
      //   }
      // }
      // if (cells[i][j] == 2) {
      //   gCount--;
      // }
      // if (cells[i][j] == 1) {
      //   if (gCount >= threshold + Math.floor(random(3))) {

      //     next[i][j] = 2;
      //   } else {
      //     next[i][j] = cells[i][j];
      //   }
      // }

      // let bCount = 0;
      // for (let x = -1; x <= 1; x++) {
      //   for (let y = -1; y <= 1; y++) {
      //     if (cells[i + x][j + y] == 3) {
      //       bCount++;
      //     }
      //   }
      // }
      // if (cells[i][j] == 3) {
      //   bCount--;
      // }
      // if (cells[i][j] == 2) {
      //   if (bCount >= threshold + Math.floor(random(3))) {
      //     next[i][j] = 3;
      //   } else {
      //     next[i][j] = cells[i][j];
      //   }
      // }

      // let rCount = 0;
      // for (let x = -1; x <= 1; x++) {
      //   for (let y = -1; y <= 1; y++) {
      //     if (cells[i + x][j + y] == 1) {
      //       rCount++;
      //     }
      //   }
      // }
      // if (cells[i][j] == 1) {
      //   rCount--;
      // }
      // if (cells[i][j] == 3) {
      //   if (rCount >= threshold + Math.floor(random(3))) {
      //     next[i][j] = 1;
      //   } else {
      //     next[i][j] = cells[i][j];
      //   }
      // }

      // let neighbors = 0;
      // for (let x = -1; x <= 1; x++) {
      //   for (let y = -1; y <= 1; y++) {
      //     neighbors += cells[i + x][j + y];
      //   }
      // }
      // neighbors -= cells[i][j];

      // let average = neighbors / 8;
      // if (average > cells[i][j]) {
      //   next[i][j] = cells[i][j] + 1;
      // } else {

      //   next[i][j] = cells[i][j] - 1;
      // }

      // let liveCount = neighbors;
      // if ((cells[i][j] == 1) && (liveCount < 2)) next[i][j] = 0;
      // else if ((cells[i][j] == 1) && (liveCount > 3)) next[i][j] = 0;
      // else if ((cells[i][j] == 0) && (liveCount == 3)) next[i][j] = 1;
      // else next[i][j] = cells[i][j];

      // let liveCount = neighbors;
      // if ((cells[i][j] == 1) && (liveCount < 2)) next[i][j] = 0;
      // else if ((cells[i][j] == 1) && (liveCount > 3)) next[i][j] = 0;
      // else if ((cells[i][j] == 0) && (liveCount == 3)) next[i][j] = 1;
      // else next[i][j] = cells[i][j];

      // if (i - 1 > 0 && j - 1 > 0 && i + 1 < width / cellSize && j + 1 < height / cellSize) {
      //     neighbors[0] = cells[i - 1][j - 1];
      //     neighbors[1] = cells[i][j - 1];
      //     neighbors[2] = cells[i + 1][j - 1];
      //     neighbors[3] = cells[i - 1][j];
      //     neighbors[4] = cells[i + 1][j];
      //     neighbors[5] = cells[i + 1][j - 1];
      //     neighbors[6] = cells[i + 1][j];
      //     neighbors[7] = cells[i + 1][j + 1];
      // }

      /* average color */

      // let alivedN = 0;
      // let numberN = 0;
      // for (let x = 0; x < neighbors.length; x++) {
      //     alivedN += neighbors[x];
      //     numberN++;
      //     let average = alivedN / numberN;
      //     //console.log(average, cells[i][j], i, j);
      //     if (average > cells[i][j]) {
      //         nextCell = cells[i][j] + 1;
      //     } else {
      //         nextCell = cells[i][j] - 1;
      //     }
      // }
      // if (nextCell > 0) {
      //     cells[i][j] = nextCell;
      // }
      //console.log(cells[i][j]);

      // let liveCount = 0;

      // for (let i = 0; i < neighbors.length; i++) {
      //     if (neighbors[i] == 1) {
      //         liveCount++;
      //     }
      // }

      //cells[i][j] = nextState;
    }
  }
  previous = cells;
  let temp = cells;
  cells = next;
  next = temp;
}

function step() {
  var cellsBuffer = cells;
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      var predatorNum = floor(states / 2);
      var predators = [];
      var predatorStates = [];
      var gesamtPredators = 0;

      for (var k = 0; k < predatorNum; k++) {
        predatorStates[k] = (cells[x][y] + 1 + k) % states;
        predators[k] = countNeighbours(x, y, predatorStates[k]);
        gesamtPredators += predators[k];
      }

      if (gesamtPredators >= predatorMin + int(random(randomPredatorMinimum))) {
        var r = int(random(gesamtPredators));
        k = -1;
        while (r >= 0) {
          k++;
          r -= predators[k];
        }
        cellsBuffer[x][y] = predatorStates[k];
      }
    }
  }
  previous = cells;
  cells = cellsBuffer;
  iterationCount++;
}

function countNeighbours(x, y, s) {
  var c = 0;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      if (i != 1 || j != 1) {
        if (getCellState(x + j - 1, y + i - 1) == s) {
          c++;
        }
      }
    }
  }
  return c;
}

function getCellState(x, y) {
  return cells[(x + boardWidth) % boardWidth][(y + boardHeight) % boardHeight];
}
