import { Board } from "./Board.js";
import { resize } from "./utils.js";
import { Mouse } from "./Mouse.js";
import { AI } from "./AI.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let mouse;
let board;

window.onresize = () => {
	resize(canvas);
	board.resize();
};

function start() {
	resize(canvas);
	mouse = new Mouse(canvas);
	board = new Board(ctx, mouse);
}

function draw() {
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	board.update();
	AI(board);

	board.draw();

	mouse.update();
}

start();
draw();
