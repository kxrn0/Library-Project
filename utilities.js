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