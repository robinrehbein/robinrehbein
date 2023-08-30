import { json } from '@sveltejs/kit';
import Jimp from 'jimp';

// const imgSrc = '/Users/robinrehbein/Documents/Bilder/Download/me_3_sq_compressed.jpg';
// const imgSrc = 'src/routes/api/grid-generator/me_3_sq_inverted.jpg';
const imgSrc = 'src/routes/api/grid-generator/me_3_compressed.jpg';

export type Pixel = {
	x: number;
	y: number;
	color: { r: number; g: number; b: number; a: number };
};

export async function GET({ url }: { url: URL }) {


	console.log('url', url)
	const { searchParams }: { searchParams: URLSearchParams } = url;
	const pixels: Pixel[] = [];
	const jimpImg = await Jimp.read(imgSrc);
	// const width: number = +(searchParams.get('width') || 0);
	// const height: number = +(searchParams.get('height') || 0);
	// const density: number = +(searchParams.get('density') || 10);

	const imgWidth: number = jimpImg.getWidth();
	const imgHeight: number = jimpImg.getHeight();

const width = 927
const height = 746
const density = 4

	jimpImg.scaleToFit(width, height);

	console.log(width, density);

	for (let x = 0; x < width; x += density) {
		console.log('x', x);
		for (let y = 0; y < height; y += density) {
			const color = {
				x,
				y,
				color: Jimp.intToRGBA(jimpImg.getPixelColor(x, y))
			};
			pixels.push(color);
		}
	}

	console.log('pixels', pixels);

	return json(pixels);
}
