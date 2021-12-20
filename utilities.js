const canvasCover = document.createElement("canvas");
const contextCover = canvasCover.getContext("2d");

canvasCover.width = 175;
canvasCover.height = 250;

//thanks to anon from 4chan.org/g/ for helping me figure out promises
export function fit_image(source) {
    return new Promise(resolve => {
        let image = new Image();
        image.src = source;
        image.addEventListener("load", () => {
            fit(image);
            resolve(canvasCover.toDataURL());
        });
    });
}

function fit(image) {
    let ratio = image.height / image.width;
    let imageData;

    if (ratio < canvasCover.height / canvasCover.width) {
        if (image.width > image.height) {
            let bgWidth = canvasCover.height / ratio;
            contextCover.drawImage(image, -bgWidth / 4, 0, bgWidth, canvasCover.height);
        }
        else {
            let bgWidth = 2 * canvasCover.width;
            let bgHeight = bgWidth * ratio;
            contextCover.drawImage(image, .5 * (canvasCover.width - bgWidth), .5 * (canvasCover.height - bgHeight), bgWidth, bgHeight);
        }

        imageData = contextCover.getImageData(0, 0, canvasCover.width, canvasCover.height);
        blur(imageData, 13);

        let height = canvasCover.width * ratio;
        contextCover.drawImage(image, 0, .5 * (canvasCover.height - height), canvasCover.width, height);
    }
    else {
        let bgHeight = canvasCover.width * ratio;
        contextCover.drawImage(image, 0, .5 * (canvasCover.height - bgHeight), canvasCover.width, bgHeight);

        imageData = contextCover.getImageData(0, 0, canvasCover.width, canvasCover.height);
        blur(imageData, 13);

        let width = canvasCover.height / ratio;
        contextCover.drawImage(image, .5 * (canvasCover.width - width), 0, width, canvasCover.height);
    }
}

function blur(imageData, kWidth) {
    let blurred = new Uint8ClampedArray(canvasCover.width * canvasCover.height * 4);
    let scannedData = imageData.data;
    let demon = Math.floor(kWidth / 2);

    for (let x = 0; x < canvasCover.width; x++)
        for (let y = 0; y < canvasCover.height; y++) {
            let avgRed, avgGreen, avgBlue;

            avgRed = 0;
            avgGreen = 0;
            avgBlue = 0;

            for (let kx = -demon; kx <= demon; kx++)
                for (let ky = -demon; ky <= demon; ky++) {
                    let dx, dy;

                    dx = 4 * (x + kx);
                    dy = 4 * (y + ky);

                    let index = dy * canvasCover.width + dx;
                    if (0 <= index && index < scannedData.length) {
                        avgRed += scannedData[index];
                        avgGreen += scannedData[index + 1];
                        avgBlue += scannedData[index + 2];
                    }
                }
            avgRed /= kWidth * kWidth;
            avgGreen /= kWidth * kWidth;
            avgBlue /= kWidth * kWidth;

            let index = 4 * (canvasCover.width * y + x);

            blurred[index] = avgRed;
            blurred[index + 1] = avgGreen;
            blurred[index + 2] = avgBlue;
            blurred[index + 3] = scannedData[index + 3];
        }

    for (let i = 0; i < blurred.length; i++)
        scannedData[i] = blurred[i];

    contextCover.putImageData(imageData, 0, 0);
}

export function random(a, b) {
    return a + Math.random() * (b - a);
}

export function map(value, start1, end1, start2, end2) {
    return start2 + (end2 - start2) * (value - start1) / (end1 - start1);
}
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        this.angle = Math.atan2(this.y, this.x);
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        this.angle = Math.atan2(this.y, this.x);
    }

    subs(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.length = Math.sqrt(this.x * this.x + this.y * this.y);
        this.angle = Math.atan2(this.y, this.x);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    mult(value) {
        this.x *= value;
        this.y *= value;
    }

    static add(vec1, vec2) {
        return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
    }

    static subs(vec1, vec2) {
        return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
    }

    static dot(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y + vec2.y;
    }

    static vector_from_angle(angle, mag = 1) {
        return new Vector(mag * Math.cos(angle), mag * Math.sin(angle));
    }

    static random_vector(mag = 1) {
        return new Vector(mag * Math.cos(random(0, 2 * Math.PI)), mag * Math.sin(random(0, Math.PI * 2)));
    }
}