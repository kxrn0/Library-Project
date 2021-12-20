import { random, Vector } from "../utilities.js";

const walkers = [];

class Walker {
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }

    walk(canvas) {
        this.position.add(Vector.random_vector(1));

        if (this.position.x < 0)
            this.position.x = canvas.width;
        if (this.position.x > canvas.width)
            this.position.x = 0;
        if (this.position.y < 0)
            this.position.y = canvas.height;
        if (this.position.y > canvas.height)
            this.position.y = 0;
    }
}

export function random_walkers(canvas) {
    let context, imageData, red, green, blue;
    
    context = canvas.getContext("2d");
    imageData = new ImageData(canvas.width, canvas.height);

    if (!walkers.length)
        for (let i = 0; i < 50; i++) {
            red = Math.floor(random(0, 255));
            green = Math.floor(random(0, 255));
            blue = Math.floor(random(0, 255));
            walkers.push(new Walker(new Vector(random(0, canvas.width), random(0, canvas.height)), `rgb(${red}, ${green}, ${blue})`));
        }
                
    for (let i = 0; i < 10000; i++) {
        for (let wkr of walkers) {
            let index, colors;

            index = 4 * (Math.floor(wkr.position.y) * canvas.width + Math.floor(wkr.position.x));
            colors = /rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)/g.exec(wkr.color);
            red = colors[1];
            green = colors[2];
            blue = colors[3];
            imageData.data[index] = red;
            imageData.data[index + 1] = green;
            imageData.data[index + 2] = blue;
            imageData.data[index + 3] = 255;

            wkr.walk(canvas);
        }
    }
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}