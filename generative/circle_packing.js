import { random, Vector } from "../utilities.js";

const strokeColors = [
    { bg : "rgb(0, 0, 0)", stroke : "rgb(255, 255, 255)" },
    { bg : "rgb(255, 255, 255)", stroke : "rgb(0, 0, 0)" },
    { bg : "rgb(100, 190, 255)", stroke : "rgb(255, 20, 35)" },
    { bg : "rgb(20, 220, 100)", stroke : "rgb(255, 25, 5)" },
    { bg : "rgb(255, 150, 200)", stroke : "rgb(25, 255, 100)" },    
];
const fillColors = [
    ["rgb(237, 210, 243)", "rgb(255, 252, 220)", "rgb(132, 223, 255)", "rgb(81, 107, 235)"],
    ["rgb(12, 236, 221)", "rgb(255, 243, 56)", "rgb(255, 103, 231)", "rgb(196, 0, 255)"],
    ["rgb(251, 198, 164)", "rgb(244, 169, 168)", "rgb(206, 151, 176)", "rgb(175, 185, 200)"],
    ["rgb(255, 50, 100)", "rgb(50, 255, 200)", "rgb(100, 50, 255)", "rgb(100, 50, 150)"],
    ["rgb(249, 7, 22)", "rgb(255, 84, 3)", "rgb(255, 202, 3)", "rgb(255, 243, 35)"]
];

export function circle_packing(canvas) {
    let context, style;

    context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    let circles = [];

    for (let i = 0; i < 2000; i++) {
        let count;

        count = 0;
        do {
            let radius, center, overlap;

            radius = Math.random() * 37 + 3;
            center = new Vector(Math.floor(random(radius, canvas.width - radius)), Math.floor(random(radius, canvas.height - radius)));
            overlap = false;

            for (let circle of circles) {
                let distance;

                distance = Math.sqrt((center.x - circle.center.x) * (center.x - circle.center.x) + (center.y - circle.center.y) * (center.y - circle.center.y));
                if (distance < radius + circle.radius) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                circles.push({ radius, center });
                break;
            }
            count++;
        } while (count < 1e3);
    }

    style = Math.floor(random(0, 2));
    if (style) {
        let colors = fillColors[Math.floor(random(0, fillColors.length))];
        for (let circle of circles) {
            context.beginPath();
            context.fillStyle = colors[Math.floor(random(0, colors.length))];
            context.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
            context.fill();
        }
    }
    else {
        let color = strokeColors[Math.floor(random(0, strokeColors.length))];
        context.fillStyle = color.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = color.stroke;
        for (let circle of circles) {
            context.beginPath();
            context.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
            context.stroke();
        }
    }

    return canvas.toDataURL();
}