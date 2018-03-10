
const CHAR_WIDTH = 12;
const MATRIX_RATE = 100;

//keep track of time
let deltaTime = 0;
let lastMillis = 0;

//
let updateCounter = 0;
let grid = [];

let bgImg;

function preload() {
  bgImg = loadImage('media/IMG_0666.JPG');
}

function setup() {
  
  createCanvas(windowWidth, 400);

  createGrid();

}

function windowResized() {
  createCanvas(windowWidth, 400);
  createGrid();
}

function draw() {

  deltaTime = millis() - lastMillis;
  lastMillis = millis();
  
  background(0, 75, 0);

  fill(0, 255, 0);
  textSize(128);
  textAlign(CENTER)
  text('The Matrix', width/2, height/2);
  

  loadPixels();
  var imgCanvas = createImage(width, height);

  imgCanvas.loadPixels();
  for (var i = 0; i < 4 * (width * height); i += 4) {
    imgCanvas.pixels[i]     = pixels[i];
    imgCanvas.pixels[i + 1] = pixels[i + 1];
    imgCanvas.pixels[i + 2] = pixels[i + 2];
    imgCanvas.pixels[i + 3] = pixels[i + 3];
  }
  imgCanvas.updatePixels();

  background(0);

  textSize(12);
  textAlign(LEFT);
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      
      fill(255 * grid[i][j].brightness);
      text(grid[i][j].char, j * CHAR_WIDTH, i * CHAR_WIDTH);

    }
  }

  loadPixels();
  var matrixCanvas = createImage(width, height);

  matrixCanvas.loadPixels();
  imgCanvas.loadPixels();
  for (var i = 0; i < 4 * (width * height); i += 4) {

    var mult = pixels[i] / 255;

    var avgColorNum = (0.2126*imgCanvas.pixels[i] + 0.7152*imgCanvas.pixels[i + 1] + 0.0722*imgCanvas.pixels[i + 2])
    var whiteness = (pixels[i] > 200) && (avgColorNum > 127) ? map(mult, 0.8, 1, 127, 255, true) : 0;

    matrixCanvas.pixels[i]     = imgCanvas.pixels[i]     * mult + whiteness;
    matrixCanvas.pixels[i + 1] = imgCanvas.pixels[i + 1] * mult + whiteness;
    matrixCanvas.pixels[i + 2] = imgCanvas.pixels[i + 2] * mult + whiteness;
    matrixCanvas.pixels[i + 3] = imgCanvas.pixels[i + 3]        + whiteness;
  }
  matrixCanvas.updatePixels();

  background(0);
  image(matrixCanvas, 0, 0);

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(0.8);
  }
  
  //text(getRandomChar(), width/2, height/2);

}

function updateRain(rainCapPercent) {

  for(let i = grid.length - 1; i >= 0; i--) {
    for(let j = grid[i].length - 1; j >= 0; j--) {
      
      if(i === 0) {
        if(Math.random() > rainCapPercent) {
          grid[i][j].rain = true;
        }
      }

      grid[i][j].brightness -= 0.05;

      if(grid[i][j].rain === true) {

        if(i < grid.length - 1) {
          grid[i + 1][j].rain = true;
          grid[i + 1][j].brightness = 1;
          grid[i + 1][j].char = getRandomChar();
        }

        grid[i][j].rain = false;
      } else if(Math.random() > 0.95 && grid[i][j].brightness > 0.5) {
        grid[i][j].char = getRandomChar();
      }

    }
  }

}


function createGrid() {
  grid = [];

  for(let i = 0; i < height / CHAR_WIDTH; i++) {
    let row = []

    for(let j = 0; j < width / CHAR_WIDTH; j++) {
      row.push(
        {
          char: getRandomChar(),
          brightness: Math.random(),
          rain: (Math.random > 0.8)
        }
      );
    }

    grid.push(row);
  }
}

function getRandomChar() {

  let randInt = Math.floor(Math.random() * 80);
  let offsetHex = parseInt('0x' + randInt.toString(16));
  return String.fromCharCode(0x30A0 + offsetHex);

}