export function resize(canvas) {
	// make the canvas a square with the minimum of width and height with a small margin
	let wh = Math.min(window.innerWidth, window.innerHeight) - 10;
	canvas.width = wh;
	canvas.height = wh;
}

export function pointInRect(A, x, y, w, h) {
	return A.x > x && A.x < x + w && A.y > y && A.y < y + h;
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
