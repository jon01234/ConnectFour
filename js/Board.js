import { pointInRect, wait } from "./utils.js";

class Cell {
	// Cell types:
	// -1: none
	//  0: blue
	//  1: red

	constructor(w, h, type) {
		this.w = w;
		this.h = h;
		this.type = type;

		this.x = 0;
		this.y = 0;
	}
}

export class Board {
	constructor(ctx, mouse, rows = 6, columns = 7) {
		this.ctx = ctx;
		this.rows = columns;
		this.cols = rows;

		this.mouse = mouse;

		this.tie = false;

		this.turn = 1;
		this.grid = [];

		this.dropping = false;

		this.gameIsOver = false;

		for (let i = 0; i < Math.max(this.cols, this.rows); i++) {
			this.grid.push([]);
		}
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.grid[i][j] = new Cell(
					this.ctx.canvas.width / this.rows,
					this.ctx.canvas.height / this.cols,
					-1
				);
				this.grid[i][j].x = i * this.grid[i][j].w;
				this.grid[i][j].y = j * this.grid[i][j].h;
			}
		}
	}

	update() {
		if (this.dropping !== true) {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					let cell = this.grid[i][j];

					if (
						this.mouse.clicked &&
						cell.type === -1 &&
						pointInRect(
							cell,
							this.mouse.x - cell.w,
							-1,
							cell.w,
							this.cols * cell.h
						)
					) {
						this.place(i, 0);
						break;
					}
				}
			}
		}
	}

	draw() {
		let colors = { "-1": "#808080", 0: "#0000ff", 1: "#ff0000" };
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				let cell = this.grid[i][j];
				this.ctx.beginPath();

				this.ctx.fillStyle = "#d3d3d3";

				if (
					pointInRect(
						cell,
						this.mouse.x - cell.w,
						-1,
						cell.w,
						this.cols * cell.h
					)
				) {
					this.ctx.fillStyle = colors[this.turn] + "4f";
				}

				this.ctx.strokeWidth = 5;
				this.ctx.rect(cell.x, cell.y, cell.w, cell.h);

				this.ctx.fill();
				this.ctx.stroke();

				this.ctx.beginPath();
				this.ctx.fillStyle = colors[cell.type];

				this.ctx.arc(
					cell.x + cell.w / 2,
					cell.y + cell.h / 2,
					Math.min(cell.w, cell.h) / 2 - 4,
					0,
					Math.PI * 2
				);

				this.ctx.fill();
			}
		}
	}

	resize() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				let cell = this.grid[i][j];
				cell.w = this.ctx.canvas.width / this.rows;
				cell.h = this.ctx.canvas.height / this.cols;
				cell.x = i * cell.w;
				cell.y = j * cell.h;
			}
		}
	}

	async place(i, j) {
		this.dropping = true;

		// make cell fall down
		this.grid[i][j].type = this.turn;

		await wait(100);
		while (j < this.cols - 1) {
			if (this.grid[i][j + 1].type !== -1) break;

			this.grid[i][j + 1].type = this.grid[i][j].type;
			this.grid[i][j].type = -1;

			this.draw();
			await wait(60);

			j++;
		}

		if (this.#gameOver()) {
			this.gameIsOver = true;
			this.tie
				? alert("Tie")
				: alert(`${this.turn === 0 ? "blue" : "red"} won`);
		}

		this.turn = this.turn === 0 ? 1 : 0;

		this.dropping = false;
	}

	#gameOver() {
		// check horizontal
		for (let i = 0; i < this.rows - 3; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (this.#horizontal(i, j)) return true;
			}
		}

		// check vertical
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols - 3; j++) {
				if (this.#vertical(i, j)) return true;
			}
		}

		// check slash (/)
		for (let i = 0; i < this.rows - 4; i++) {
			for (let j = this.cols - 1; j > 2; j--) {
				if (this.#slash(i, j)) return true;
			}
		}

		// check backslash (\)
		for (let i = this.rows - 1; i > 2; i--) {
			for (let j = this.cols - 1; j > 2; j--) {
				if (this.#backslash(i, j)) return true;
			}
		}

		// check for tie
		if (this.#boardisfull()) {
			this.tie = true;
			return true;
		}

		return false;
	}

	canPlace(i) {
		if (this.grid[i][0].type !== -1) return false;
		return true;
	}

	clone() {
		return new Board(this.ctx, this.mouse, this.riws, this.cols);
	}

	#horizontal(x, y) {
		return (
			this.grid[x][y].type === this.turn &&
			this.grid[x + 1][y].type === this.turn &&
			this.grid[x + 2][y].type === this.turn &&
			this.grid[x + 3][y].type === this.turn
		);
	}

	#vertical(x, y) {
		return (
			this.grid[x][y].type === this.turn &&
			this.grid[x][y + 1].type === this.turn &&
			this.grid[x][y + 2].type === this.turn &&
			this.grid[x][y + 3].type === this.turn
		);
	}

	#slash(x, y) {
		return (
			this.grid[x][y].type === this.turn &&
			this.grid[x + 1][y - 1].type === this.turn &&
			this.grid[x + 2][y - 2].type === this.turn &&
			this.grid[x + 3][y - 3].type === this.turn
		);
	}

	#backslash(x, y) {
		return (
			this.grid[x][y].type === this.turn &&
			this.grid[x - 1][y - 1].type === this.turn &&
			this.grid[x - 2][y - 2].type === this.turn &&
			this.grid[x - 3][y - 3].type === this.turn
		);
	}

	#boardisfull() {
		// check if draw
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (this.grid[i][j].type === -1) {
					return false;
				}
			}
		}

		return true;
	}
}
