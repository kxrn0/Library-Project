import { random, Vector } from "../utilities.js";

const colors = [ "rgb(255, 255, 255)", "rgb(50, 200, 255)", "rgb(255, 243, 35)", "rgb(6, 255, 0)", "rgb(255, 0, 92)" ];

export function chaos_game(canvas) {
    let points, kaosP, angle, angleInc, radius, imageData, context, color, red, green, blue, regsult;

    points = [];
    kaosP = new Vector(canvas.width / 2, canvas.height / 2);
    angle = random(0, Math.PI * 2);
    angleInc = Math.PI * 2 / 3;
    radius = 75;
    imageData = new ImageData(canvas.width, canvas.height);
    context = canvas.getContext("2d");
    color = colors[Math.floor(random(0, colors.length))];

    regsult = /rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/g.exec(color);
    red = regsult[1];
    green = regsult[2];
    blue = regsult[3];

    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 255;
    }

    for (let i = 0; i < 3; i++, angle += angleInc)
        points.push(new Vector(canvas.width / 2 + radius * Math.cos(angle), canvas.height / 2 + radius * Math.sin(angle)));

    for (let i = 0; i < 20000; i++) {
        let rndP, index;
        
        rndP = points[Math.floor(random(0, points.length))];
        kaosP = new Vector(.5 * (kaosP.x + rndP.x), .5 * (kaosP.y + rndP.y));
        index = 4 * (Math.floor(kaosP.y) * canvas.width + Math.floor(kaosP.x));
        imageData.data[index] = red;
        imageData.data[index + 1] = green;
        imageData.data[index + 2] = blue;
        imageData.data[index + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}