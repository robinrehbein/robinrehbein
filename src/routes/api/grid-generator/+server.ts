import { json } from '@sveltejs/kit';
import Jimp from 'jimp';

export async function GET() {
	// const { searchParams }: { searchParams: URLSearchParams } = url,
	const pixelColors: {
		x: number;
		y: number;
		color: { r: number; g: number; b: number; a: number };
	}[] = [];

	const pixels: { r: number; g: number; b: number; a: number }[][] = [];

	const jimpImg = await Jimp.read(
		// '/Users/robinrehbein/code/private/robinrehbein/src/routes/api/grid-generator/me_3_sq_inverted.jpg'
		'/Users/robinrehbein/Documents/Bilder/Download/me_3_sq_compressed.jpg'
	);
	const width: number = jimpImg.getWidth();
	const height: number = jimpImg.getHeight();

	// activate for vertical lines
	// jimpImg.rotate(90);

	for (let x = 0; x < width; x++) {
		const row: { r: number; g: number; b: number; a: number }[] = [];
		for (let y = 0; y < height; y++) {
			const color = {
				x,
				y,
				color: Jimp.intToRGBA(jimpImg.getPixelColor(x, y))
			};
			// console.log(color);
			pixelColors.push(color);
			row.push(color.color);
			y += 3; //6
		}
		pixels.push(row);
		x += 3; //6
	}
	console.log(pixels);
	return json({ pixelColors, width, height });

	// return Jimp.read('/Users/robinrehbein/Documents/Bilder/Download/me_3_sq.jpg')
	// 	.then((image) => {
	// 		const width: number = image.getWidth();
	// 		const height: number = image.getHeight();

	// 		for (let y = 0; y < height / 10; y++) {
	// 			for (let x = 0; x < width / 10; x++) {
	// 				const color = {
	// 					x,
	// 					y,
	// 					color: Jimp.intToRGBA(image.getPixelColor(x, y))
	// 				};
	// 				pixelColors.push(color);
	// 			}
	// 		}
	//         return json({ pixelColors, width, height });
	// 	})
	// 	.catch((error) => {
	// 		console.error(error);
	// 		return json(error);
	// 	});
}
