import { map, random } from "../utilities.js";

export function mozaic(canvas) {
    let edge, cols, rows, scale, context;

    noise.seed(Math.random());
    context = canvas.getContext("2d");

    edge = 5;
    cols = Math.floor(canvas.width / edge);
    rows = Math.floor(canvas.height / edge);
    scale = .1;

    for (let x = 0; x < cols; x++)
        for (let y = 0; y < rows; y++) {
            let red, green, blue;

            red = map(noise.simplex2(x * scale, y * scale), -1, 1, 0, 255);
            green = map(noise.simplex2((x + 100) * scale, (y + 100) * scale), -1, 1, 0, 255);
            blue = map(noise.simplex2((x + 200) * scale, (y + 200) * scale), -1, 1, 0, 255);

            context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            context.fillRect(x * edge, y * edge, edge, edge);
            context.fill();
        }
    return canvas.toDataURL();
}