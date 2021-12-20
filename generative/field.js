import { Vector } from "../utilities.js";

export function field(canvas) {
    let edge, cols, rows, scale, context;

    noise.seed(Math.random());
    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    edge = 5;
    cols = Math.floor(canvas.width / edge) + 1;
    rows = Math.floor(canvas.height / edge) + 1;
    scale = .03;

    context.strokeStyle = "#000";
    for (let x = 0; x < cols; x++)
        for (let y = 0; y < rows; y++) {
            let vec = Vector.vector_from_angle(noise.simplex2(x * scale, y * scale) * Math.PI * 2, edge);
            context.beginPath();
            context.translate(x * edge, y * edge);
            context.rotate(vec.angle);
            context.moveTo(0, 0);
            context.lineTo(vec.length, 0);
            context.stroke();
            context.setTransform(1, 0, 0, 1, 0, 0);
        }

    return canvas.toDataURL();
}