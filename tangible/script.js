let colors = ["#F7220D55", "#F88B2355", "#FFF03155", "#7CD72855", "#10FFE255", "#3297CB55", "#6D29CF55", "#EA00D955"];

let diskUID = ['6A 82 23 28', '9A C4 28 28', '8A 1B F1 3F', '09 64 57 B3', '99 01 6A B3', 'DA 67 EB 3F', '2A E2 04 40', 'FA FC 21 28'];

let circle_r1 = 0;
let circle_r2 = 0;
let circle_r3 = 0;

let color_r1 = "#00000000";
let color_r2 = "#00000000";
let color_r3 = "#00000000";

const circles = [];
const numCircles = 3;

const gridCircles = [];

let cellSize = 20;

let boardWidth = Math.ceil(window.innerWidth / cellSize);
let boardHeight = Math.ceil(window.innerHeight / cellSize);

let cells = [];
let next = [];
let previous = [];
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

let rBlink = cellSize;
let easing = 0.5;

var client = mqtt.connect("mqtt://f689edec:4926cc8764167d4b@broker.shiftr.io", {
  clientId: "javascript",
});

client.on("connect", function () {
  console.log("client has connected!");

  client.subscribe("/rotary1");
  client.subscribe("/rfid1");
  client.subscribe("/rotary2");
  client.subscribe("/rfid2");
  client.subscribe("/rotary3");
  client.subscribe("/rfid3");
  client.subscribe("/button");
  // client.unsubscribe('/example');

  // setInterval(function () {
  //     client.publish('/hello', 'world');
  // }, 1000);
});

client.on("message", function (topic, message) {

  //console.log('new message:', topic, message.toString());
  let obj = JSON.parse(message.toString());
  //console.log(topic, obj);

  if (topic === "/rotary1") {
    if (obj.hasOwnProperty("rSpeed")) {
      circle_r1 = 50 * parseInt(obj.rSpeed);
      //frameRate(parseInt(obj.rSpeed) + 1);
    }
  }
  if (topic === "/rfid1") {
    if (obj.hasOwnProperty("UID")) {
      for (let i = 0; i < diskUID.length; i++) {
        if (obj.UID === diskUID[i]) {
          color_r1 = colors[i];
        }
      }
    }
  }

  if (topic === "/rotary2") {
    if (obj.hasOwnProperty("rSpeed")) {
      circle_r2 = 50 * parseInt(obj.rSpeed);
      frameRate(parseInt(obj.rSpeed) + 1);
    }
  }
  if (topic === "/rfid2") {
    if (obj.hasOwnProperty("UID")) {
      for (let i = 0; i < diskUID.length; i++) {
        if (obj.UID === diskUID[i]) {
          color_r2 = colors[i];
        }
      }
    }
  }

  if (topic === "/rotary3") {
    if (obj.hasOwnProperty("rSpeed")) {
      circle_r3 = 50 * parseInt(obj.rSpeed);
      //frameRate(parseInt(obj.rSpeed) + 1);
    }
  }
  if (topic === "/rfid3") {
    if (obj.hasOwnProperty("UID")) {
      for (let i = 0; i < diskUID.length; i++) {
        if (obj.UID === diskUID[i]) {
          color_r3 = colors[i];
        }
      }
    }
  }

});

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(30);

  frameRate(60);

  bg = createGraphics(width, height);
  bg.background(30, 20);
  bg.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x * 0.01, y * 0.01) * 2;
    bg.fill(20, 20);
    bg.rect(x, y, s, s);
  }

  for (let i = 0; i < numCircles; i++) {
    circles.push(new Circle(random(width), random(height), 300));
  }

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {
      gridCircles.push(
        new Circle(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 20)
      );
    }
  }

  //initCell();
}

let value = 0;

function keyTyped() {
  if (key === 'r') {
    value = 1;
  }
  if (key === 'c') {
    value = 2;
  }
  if (key === 'p') {
    value = 3;
  }
  if (key == 'y') {
    value = 4;
  }
  if (key == 'k') {
    value = 0;
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
        Math.pow(c_mouseX - xpos, 2) +
        Math.pow(c_mouseY - ypos, 2)
      );
      if (dist < m_radius / 2)
        cells[i][j] = value;

      //console.log(mouseX, mouseY, xpos, ypos, dist);
    }
  }
}

function draw() {
  // if (frameCount % 5 == 0) {


  image(bg, 0, 0);
  // }
  // noFill();
  // stroke("#333333");
  // rect(width / 5, height / 5, (width * 3) / 5, (height * 3) / 5);
  //updateCell();


  circles[0].setRadius(circle_r1);
  circles[1].setRadius(circle_r2);
  circles[2].setRadius(circle_r3);
  circles[0].setColor(color_r1);
  circles[1].setColor(color_r2);
  circles[2].setColor(color_r3);
  //console.log(color_r1, color_r2);

  circles.forEach((p) => {
    p.edges();
    p.move();
    p.display();
  });


  gridCircles.forEach((p) => {
    p.blink();
  });

  for (let i = 0; i < boardWidth; i++) {
    for (let j = 0; j < boardHeight; j++) {


      let xpos = i * cellSize + cellSize / 2;
      let ypos = j * cellSize + cellSize / 2;
      fill("#888888FF");
      noStroke();
      ellipse(xpos, ypos, cellSize / 15, cellSize / 15);

      let isBlink = floor(random(5 * totalCells));
      //console.log(isBlink);
      if (isBlink < 1) {
        gridCircles[i * boardHeight + j].setColor("#FFFFFFFF");
      } else {
        gridCircles[i * boardHeight + j].setColor("#00000000");
      }

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
          for (let k = 0; k < colors.length; k++) {
            if (circles[n].color === colors[k]) {
              //console.log(circles[n]);
              cells[i][j] = k + 1;
            }
          }
          //rotate(PI / 2);
        }
      }


      // if (cells[i][j] == 1) {
      //   fill('#FCCF1222');
      //   noStroke();
      //   ellipse(xpos - cellSize / 2, ypos - cellSize / 2, cellSize, cellSize);
      // } else {

      //fill('#15224488');
      // }
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
      //   rect(xpos, ypos, cellSize, cellSize);
      // }

    }
  }

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

class Circle {
  constructor(xpos, ypos, radius) {
    this.dir = createVector(0, 0);
    this.pos = createVector(xpos, ypos);
    this.vel = createVector(0, 0);
    this.r = radius;
    //this.speed = 0.4;
    this.color = "#333333FF";
    this.xn = random(2048);
    this.yn = random(2048);
  }

  move() {
    this.xn += 0.005;
    this.yn += 0.005;
    // this.pos.x = -(width / 5) + ((noise(this.xn) * 7) / 5) * window.innerWidth;
    this.pos.x = (noise(this.xn) / 4 * window.innerWidth);
    // this.pos.x += 10;
    // this.pos.y = -(height / 5) + ((noise(this.yn) * 7) / 5) * window.innerHeight;
    this.pos.y = (noise(this.yn) / 4 * window.innerHeight);
  }

  display() {
    stroke(this.color);
    noFill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
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

      if (i == 0 || j == 0 || i == boardWidth - 1 || j == boardHeight - 1)
        cells[i][j] = 0;
      // Filling the rest randomly
      else
        cells[i][j] = 4;
      //cells[i][j] = Math.ceil(random(0, 5));
      next[i][j] = 0;
      previous[i][j] = 0;
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