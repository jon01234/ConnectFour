export class Mouse {
	constructor(canvas) {
		this.canvas = canvas;
		this.x = 0;
		this.y = 0;

		this.down = false;
		this.up = false;
		this.clicked = false;

		this.#addListener();
	}

	update() {
		this.down = false;
		this.up = false;
		this.clicked = false;
	}

	#addListener() {
		this.canvas.addEventListener("mousemove", (e) => {
			let cRect = this.canvas.getBoundingClientRect(); // Gets CSS pos, and width/height
			this.x = Math.round(e.clientX - cRect.left); // Subtract the 'left' of the canvas
			this.y = Math.round(e.clientY - cRect.top);
		});

		this.canvas.addEventListener("mousedown", (e) => {
			this.down = true;
			this.up = false;
		});

		this.canvas.addEventListener("mouseup", (e) => {
			this.down = false;
			this.up = true;
		});

		this.canvas.addEventListener("click", (e) => {
			this.clicked = true;
		});
	}
}
