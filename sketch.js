
const CHAR_WIDTH = 12;
const MATRIX_RATE = 10;

//keep track of time
let deltaTime = 0;
let lastMillis = 0;

//
let updateCounter = 0;
let grid = [];

let bgVideo;
let videoStartLoop = 5.5;
let videoEndLoop = 19.5;

function setup() {
  
  createCanvas(windowWidth, windowHeight);

  bgVideo = createVideo(['media/2018-03-09 21-57-06.mp4', 'media/2018-03-09 21-57-06.webm']);
  bgVideo.hide();
  bgVideo.time(videoStartLoop);
  bgVideo.loop();

  createGrid();

}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  createGrid();
}

function draw() {

  deltaTime = millis() - lastMillis;
  lastMillis = millis();
  

  background(0, 30, 0);
 
  // loop the video
  if(bgVideo.time() > videoEndLoop) {
    bgVideo.time(videoStartLoop);
  }

  // modify the video image
  bgVideo.loadPixels();

  var bgCanvas = createImage(bgVideo.width, bgVideo.height);
  bgCanvas.loadPixels();
  for(var y = 0; y < bgVideo.height; y++) {
    for(var x = 0; x < bgVideo.width; x++) {
      
      var i = (x + y * bgVideo.width) * 4;

      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;

      if(y < bgVideo.height - 120 && x < bgVideo.width - 222 && x > 220) {
        g = bgVideo.pixels[i + 1] > 0? map(bgVideo.pixels[i + 1], 0, 100, 150, 255) : 0;
        a = bgVideo.pixels[i + 1] > 0? 255 : 0;
      }

      bgCanvas.pixels[i]     = r;
      bgCanvas.pixels[i + 1] = g;
      bgCanvas.pixels[i + 2] = b;
      bgCanvas.pixels[i + 3] = a;
      
    }
  }
  bgCanvas.updatePixels();
  imageMode(CENTER);
  image(bgCanvas, width/2, height/2 + 100, bgCanvas.width*2, bgCanvas.height*2);
  imageMode(CORNER);

  fill(0, 255, 0);
  textSize(128);
  textAlign(CENTER)
  text('The Matrix', width/2, height/2 - 100);
  


  var gridColors = []
  // save the colors of the canvas for each character in the matrix grid
  loadPixels();
  for(let y = 0; y < height; y+= CHAR_WIDTH) {
    let row = [];
    for(let x = 0; x < width; x+= CHAR_WIDTH) {
      let i = (x + y * width) * 4;
      row.push({
        r:pixels[i],
        g:pixels[i+1],
        b:pixels[i+2]
      })
    }
    gridColors.push(row);
  }

  background(0);

  textSize(12);
  textAlign(LEFT);
  // cycle through the matrix grid and display the characters with the adjusted
  // brightness and whiteness
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {

      let mult = grid[y][x].brightness;
      if(mult > 0.1) {
        // only display text if it will be visible

        let avgColorNum = (0.2126*gridColors[y][x].r + 0.7152*gridColors[y][x].g + 0.0722*gridColors[y][x].b)
        let whiteness = (mult*255 > 200) && (avgColorNum > 127) ? map(mult, 0.8, 1, 127, 255, true) : 0;

        let r = gridColors[y][x].r * mult + whiteness;
        let g = gridColors[y][x].g * mult + whiteness;
        let b = gridColors[y][x].b * mult + whiteness;

        fill(r, g, b);
        text(grid[y][x].char, x * CHAR_WIDTH, y * CHAR_WIDTH);
      }

    }
  }

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(0.94, 0.03);
  }

}

// function draw() {

//   deltaTime = millis() - lastMillis;
//   lastMillis = millis();
  
//   //background(0, 75, 0);
//   background(0, 75, 50);
 

//   if(bgVideo.time() > videoEndLoop) {
//     bgVideo.time(videoStartLoop);
//   }

//   //image(bgVideo, width/2 - bgVideo.width/2, height/2 - bgVideo.height/2);
//   bgVideo.loadPixels();

//   var bgCanvas = createImage(bgVideo.width, bgVideo.height);
//   bgCanvas.loadPixels();
//   for(var y = 0; y < bgVideo.height; y++) {
//     for(var x = 0; x < bgVideo.width; x++) {
      
//       var i = (x + y * bgVideo.width) * 4;

//       var r = 0;
//       var g = 0;
//       var b = 0;
//       var a = 0;

//       if(y < bgVideo.height - 120 && x < bgVideo.width - 222 && x > 220) {
//         g = bgVideo.pixels[i + 1] > 0? map(bgVideo.pixels[i + 1], 0, 100, 150, 255) : 0;
//         a = bgVideo.pixels[i + 1] > 0? 255 : 0;
//       }

//       bgCanvas.pixels[i]     = r;
//       bgCanvas.pixels[i + 1] = g;
//       bgCanvas.pixels[i + 2] = b;
//       bgCanvas.pixels[i + 3] = a;
      
//     }
//   }
//   bgCanvas.updatePixels();
//   imageMode(CENTER);
//   image(bgCanvas, width/2, height/2 + 100, bgCanvas.width*2, bgCanvas.height*2);
//   imageMode(CORNER);

//   fill(0, 255, 0);
//   textSize(128);
//   textAlign(CENTER)
//   text('The Matrix', width/2, height/2 - 100);
  

//   loadPixels();
//   var imgCanvas = createImage(width, height);

//   imgCanvas.loadPixels();
//   for (var i = 0; i < 4 * (width * height); i += 4) {
//     imgCanvas.pixels[i]     = pixels[i];
//     imgCanvas.pixels[i + 1] = pixels[i + 1];
//     imgCanvas.pixels[i + 2] = pixels[i + 2];
//     imgCanvas.pixels[i + 3] = pixels[i + 3];
//   }
//   imgCanvas.updatePixels();

//   background(0);

//   textSize(12);
//   textAlign(LEFT);
//   for(let i = 0; i < grid.length; i++) {
//     for(let j = 0; j < grid[i].length; j++) {
      
//       fill(255 * grid[i][j].brightness);
//       text(grid[i][j].char, j * CHAR_WIDTH, i * CHAR_WIDTH);

//     }
//   }

//   loadPixels();
//   var matrixCanvas = createImage(width, height);

//   matrixCanvas.loadPixels();
//   imgCanvas.loadPixels();
//   for (var i = 0; i < 4 * (width * height); i += 4) {

//     var mult = pixels[i] / 255;

//     var avgColorNum = (0.2126*imgCanvas.pixels[i] + 0.7152*imgCanvas.pixels[i + 1] + 0.0722*imgCanvas.pixels[i + 2])
//     var whiteness = (pixels[i] > 200) && (avgColorNum > 127) ? map(mult, 0.8, 1, 127, 255, true) : 0;

//     matrixCanvas.pixels[i]     = imgCanvas.pixels[i]     * mult + whiteness;
//     matrixCanvas.pixels[i + 1] = imgCanvas.pixels[i + 1] * mult + whiteness;
//     matrixCanvas.pixels[i + 2] = imgCanvas.pixels[i + 2] * mult + whiteness;
//     matrixCanvas.pixels[i + 3] = imgCanvas.pixels[i + 3]        + whiteness;
//   }
//   matrixCanvas.updatePixels();

//   background(0);
//   image(matrixCanvas, 0, 0);

//   updateCounter += deltaTime;
//   if(updateCounter >= MATRIX_RATE) {
//     updateCounter -= MATRIX_RATE;
//     updateRain(0.95, 0.03);
//   }

// }

function updateRain(rainCapPercent = 0.98, decay = 0.05) {

  for(let i = grid.length - 1; i >= 0; i--) {
    for(let j = grid[i].length - 1; j >= 0; j--) {
      
      if(i === 0) {
        if(Math.random() > rainCapPercent) {
          grid[i][j].rain = true;
        }
      }

      grid[i][j].brightness -= decay;

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
          rain: (Math.random() > 0.99)
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