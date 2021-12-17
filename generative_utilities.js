const canvasGn = document.createElement("canvas");
const contextGn = canvasGn.getContext("2d");

canvasGn.width = 175;
canvasGn.height = 250;

export function generate_cover() {
    return ten_print();
}

function ten_print() {
    let edge, cellsX, cellsY;

    edge = Math.floor(Math.random() * 10 + 10);
    cellsX = canvasGn.width / edge;
    cellsY = canvasGn.height / edge;

    contextGn.fillStyle = "rgb(20, 5, 10)";
    contextGn.fillRect(0, 0, canvasGn.width, canvasGn.height);

    contextGn.lineWidth = 2;
    for (let x = 0; x < cellsX; x++)
      for (let y = 0; y < cellsY; y++) {
        contextGn.beginPath();
        let rand = Math.random();
        if (rand < .5) {
          contextGn.strokeStyle = "rgb(255, 0, 0)"
          contextGn.moveTo(x * edge, y * edge);
          contextGn.lineTo((x + 1) * edge, (y + 1) * edge);
        }
        else {
          contextGn.strokeStyle = "rgb(0, 255, 0)";
          contextGn.moveTo((x + 1) * edge, y * edge);
          contextGn.lineTo(x * edge, (y + 1) * edge);
        }
        contextGn.stroke();
      }
      return canvasGn.toDataURL();
  }