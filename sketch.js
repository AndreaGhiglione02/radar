let angle = "";
let distance = "";
let data = "";
let noObject;
let pixsDistance;
let iAngle;
let iDistance;
let index1 = 0;
let index2 = 0;
let orcFont;
let counter = 0;
let obj;

//let windowWidth = 1200; // SCREEN RESOLUTION
//let windowHeight = 700;

//-----------------------------------------------

// Create events for the sensor readings
if (!!window.EventSource) {
  var source = new EventSource('/events');

  source.addEventListener('open', function(e) {
    console.log("Events Connected");
  }, false);

  source.addEventListener('error', function(e) {
    if (e.target.readyState != EventSource.OPEN) {
      console.log("Events Disconnected");
    }
  }, false);

  source.addEventListener('readings', function(e) {
    //console.log("gyro_readings", e.data);
    obj = JSON.parse(e.data);
    document.getElementById("angle").innerHTML = obj.angle;
    document.getElementById("distance").innerHTML = obj.distance;
  }, false);
}

//-----------------------------------------------

function setup() {
    createCanvas(windowWidth, windowHeight);
    smooth(); //myPort = new Serial(this,"COM5", 9600); // starts the serial communication
    //myPort.bufferUntil('.'); // reads the data from the serial port up to the character '.'. So actually it reads this: angle,distance.
}
function draw() {
    fill(98, 245, 31); // simulating motion blur and slow fade of the moving line
    noStroke();
    fill(0, 4);
    rect(0, 0, width, height - height * 0.065);
    fill(108, 179, 89); // green color
    // calls the functions for drawing the radar
    drawRadar();
    drawLine();
    drawObject();
    drawText();
    iAngle = counter; //iAngle = obj.angle
    iDistance = 20 + 10 * sin(radians(6 * counter)); //iDistance = obj.distance
    counter = counter + 1;
    if (counter == 180) {
        counter = 0;
    }
} /*void serialEvent (Serial myPort) { // starts reading data from the Serial Port
  // reads the data from the Serial Port up to the character '.' and puts it into the String variable "data".
  data = myPort.readStringUntil('.');
  data = data.substring(0,data.length()-1);

  index1 = data.indexOf(","); // find the character ',' and puts it into the variable "index1"
  angle= data.substring(0, index1); // read the data from position "0" to position of the variable index1 or thats the value of the angle the Arduino Board sent into the Serial Port
  distance= data.substring(index1+1, data.length()); // read the data from position "index1" to the end of the data pr thats the value of the distance

  // converts the String variables into Integer
  iAngle = int(angle);
  iDistance = int(distance);
} */
function drawRadar() {
    push();
    translate(width / 2, height - height * 0.074); // moves the starting coordinats to new location
    noFill();
    strokeWeight(2);
    stroke(108, 179, 89); // draws the arc lines
    arc(0, 0, width - width * 0.0625, width - width * 0.0625, PI, TWO_PI);
    arc(0, 0, width - width * 0.16625, width - width * 0.16625, PI, TWO_PI);
    arc(0, 0, width - width * 0.27, width - width * 0.27, PI, TWO_PI);
    arc(0, 0, width - width * 0.3745, width - width * 0.3745, PI, TWO_PI);
    arc(0, 0, width - width * 0.479, width - width * 0.479, PI, TWO_PI);
    arc(0, 0, width - width * 0.583, width - width * 0.583, PI, TWO_PI);
    arc(0, 0, width - width * 0.687, width - width * 0.687, PI, TWO_PI); // draws the angle lines
    line(-width / 2, 0, width / 2, 0);
    for (i=15; i <= 180; i= i + 15) {
        line(0,0,(-width / 2) * cos(radians(i)),(-width / 2) * sin(radians(i)))
    }
    line((-width / 2) * cos(radians(30)), 0, width / 2, 0);
    pop();
}
function drawObject() {
    push();
    translate(width / 2, height - height * 0.074); // moves the starting coordinats to new location
    strokeWeight(9);
    stroke(163, 61, 59); // red color
    pixsDistance = iDistance * (((width / 2) - (width / 2) * 0.1666) * 0.025); // covers the distance from the sensor from cm to pixels
    // limiting the range to 40 cms
    if (iDistance < 40) {
        // draws the object according to the angle and the distance
        line(
            pixsDistance * cos(radians(iAngle)),
            -pixsDistance * sin(radians(iAngle)),
            (width - width * 0.505) * cos(radians(iAngle)),
            -(width - width * 0.505) * sin(radians(iAngle))
        );
    }
    pop();
}
function drawLine() {
    push();
    strokeWeight(9);
    stroke(124, 252, 0);
    translate(width / 2, height - height * 0.074); // moves the starting coordinats to new location
    line(
        0,
        0,
        ((width / 2) - (width / 2) * 0.12) * cos(radians(iAngle)),
        -((width / 2) - (width / 2) * 0.12) * sin(radians(iAngle))
    ); // draws the line according to the angle
    pop();
}
function drawText() {
    // draws the texts on the screen
    push();
    if (iDistance > 10) {
        noObject = "Out of Range";
    } else {
        noObject = "In Range";
    }
    fill(0, 4);
    noStroke();
    rect(0, height - height * 0.0648, width, height);
    fill(108, 179, 89);
    textSize(25);
    text("Fire distance: 10cm", width - width * 0.95, height - height * 0.025);
    text("10cm", width - width * 0.3854, height - height * 0.0833);
    text("20cm", width - width * 0.281, height - height * 0.0833);
    text("30cm", width - width * 0.177, height - height * 0.0833);
    text("40cm", width - width * 0.0729, height - height * 0.0833);
    textSize(25);
    fill(108, 179, 89);
    translate(
        width - width * 0.4994 + (width / 2) * cos(radians(30)),
        height - height * 0.0907 - (width / 2) * sin(radians(30))
    );
    rotate(-radians(-60));
    text("30°", 0, 0);
    resetMatrix();
    translate(
        width - width * 0.503 + (width / 2) * cos(radians(60)),
        height - height * 0.0888 - (width / 2) * sin(radians(60))
    );
    rotate(-radians(-30));
    text("60°", 0, 0);
    resetMatrix();
    translate(
        width - width * 0.507 + (width / 2) * cos(radians(90)),
        height - height * 0.0833 - (width / 2) * sin(radians(90))
    );
    rotate(radians(0));
    text("90°", 0, 0);
    resetMatrix();
    translate(
        width - width * 0.513 + (width / 2) * cos(radians(120)),
        height - height * 0.07129 - (width / 2) * sin(radians(120))
    );
    rotate(radians(-30));
    text("120°", 0, 0);
    resetMatrix();
    translate(
        width - width * 0.5104 + (width / 2) * cos(radians(150)),
        height - height * 0.0574 - (width / 2) * sin(radians(150))
    );
    rotate(radians(-60));
    text("150°", 0, 0);
    pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

