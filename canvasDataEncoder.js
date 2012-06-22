var canvasDataEncoder = (function () {
	function encode(canvas, x, y, maxX, data) {
		"use strict";
		// Stringify the data
		var stringData = JSON.stringify(data),
			ctx = canvas.getContext('2d'),
			quartet,
			quartets = [],
			currentX = 0, currentY = 0,
			i;

		// Make sure the string has a length divisible by 3,
		// or add padding
		while (stringData.length % 3 > 0) {
			stringData += ' ';
		}

		// Loop the string and generate quartet pixel data
		for (i = 0; i < stringData.length; i += 3) {
			quartet = [
				stringData.charCodeAt(i),
				stringData.charCodeAt(i + 1),
				stringData.charCodeAt(i + 2),
				255 // The last value is always 255 to represent full alpha
			];

			quartets.push(quartet);
		}

		// Add the terminal quartet
		quartets.push([3, 2, 1, 255]);

		// Loop the quartets and paint them!
		for (i = 0; i < quartets.length; i++) {
			quartet = quartets[i];
			ctx.fillStyle = 'rgba(' + quartet[0] + ', ' + quartet[1] + ', ' + quartet[2] + ', 255)';
			ctx.fillRect(x + currentX, y + currentY, 1, 1);

			currentX++;
			if (currentX >= maxX) { currentX = 0; currentY++; }
		}
	}

	function decode(canvas, x, y, maxX) {
		"use strict";
		var ctx = canvas.getContext('2d'),
			imageData = ctx.getImageData(x, y, maxX, canvas.height).data,
			run = true,
			quadCode,
			i = 0,
			jsonString = '';

		while (run) {
			quadCode = String(imageData[i]) + ' ' + String(imageData[i + 1]) + ' ' + String(imageData[i + 2]);
			if (quadCode === '3 2 1') {
				// We have scanned the terminal code
				// so exit the loop
				run = false;
				return JSON.parse(jsonString);
			} else {
				jsonString += String.fromCharCode(imageData[i]) + String.fromCharCode(imageData[i + 1]) + String.fromCharCode(imageData[i + 2]);
			}
			i += 4;

			if (i > imageData.length) {
				run = false;
				console.log('Image JSON Decode Error!');
			}
		}
	}

	return {encode:encode, decode:decode};
}());