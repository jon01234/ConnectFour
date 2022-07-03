// turn 1 for starting and 0 for second
export const AI_TURN = 1;
export const PLAYER_TURN = AI_TURN ^ 1;

// TODO: FIX WHY THIS ALWAYS PUTS ON FIRST OPEN SLOT
export function AI(board, turn = AI_TURN) {
	if (board.turn === turn && board.dropping === false) {
		let maxEval = -1000;
		let evaluation = maxEval;
		let x = 0;

		for (let i = 0; i < board.cols; i++) {
			if (board.canPlace(i)) {
				let b = board.clone();

				b.place(i, 0);
				evaluation = minimax(b, 3, false);

				if (maxEval < evaluation) {
					maxEval = evaluation;
					x = i;
				}
			}
		}

		console.log(x);
		board.place(x, 0);
	}
}

function minimax(board, depth, isMaximizing) {
	if (depth === 0 || board.gameIsOver) {
		return evalBoard(board);
	}

	if (isMaximizing) {
		let maxEval = -10000;
		let evaluation = maxEval;
		for (let i = 0; i < board.cols; i++) {
			if (board.canPlace(i)) {
				let b = board.clone();
				b.place(i, 0);
				evaluation = minimax(b, depth - 1, false);
				maxEval = Math.max(maxEval, evaluation);
			}
		}
		return maxEval;
	} else {
		let minEval = 10000;
		let evaluation = minEval;
		for (let i = 0; i < board.cols; i++) {
			if (board.canPlace(i)) {
				let b = board.clone();
				b.place(i, 0);
				evaluation = minimax(b, depth - 1, false);
				minEval = Math.min(minEval, true);
			}
		}
		return minEval;
	}
}

// positive good for AI negative good for player
function evalBoard(board) {
	let ev = 0;
	for (let i = 0; i < board.rows; i++) {
		for (let j = 0; j < board.cols; j++) {
			// Horizontal checks
			ev += horizontal(i, j, board);

			// Vertical checks
			ev += vertical(i, j, board);

			// Diagonal checks
			// slash (/)
			ev += slash(i, j, board);

			// backslash (\)
			ev += backslash(i, j, board);
		}
	}

	return ev;
}

function horizontal(i, j, board) {
	let ev = 0;

	if ((board.grid[i + 3] || [])[j] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j]?.type === AI_TURN &&
			(board.grid[i + 2] || [])[j]?.type === AI_TURN &&
			(board.grid[i + 3] || [])[j]?.type === AI_TURN
		) {
			ev += 10;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j]?.type === PLAYER_TURN &&
			(board.grid[i + 2] || [])[j]?.type === PLAYER_TURN &&
			(board.grid[i + 3] || [])[j]?.type === PLAYER_TURN
		) {
			ev -= 10;
		}
	}

	if ((board.grid[i + 2] || [])[j] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j]?.type === AI_TURN &&
			(board.grid[i + 2] || [])[j]?.type === AI_TURN
		) {
			ev += 5;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j]?.type === PLAYER_TURN &&
			(board.grid[i + 2] || [])[j]?.type === PLAYER_TURN
		) {
			ev -= 5;
		}
	}

	if ((board.grid[i + 2] || [])[j] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j]?.type === AI_TURN &&
			(board.grid[i + 2] || [])[j]?.type === AI_TURN
		) {
			ev += 5;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j]?.type === PLAYER_TURN &&
			(board.grid[i + 2] || [])[j]?.type === PLAYER_TURN
		) {
			ev -= 5;
		}
	}

	if ((board.grid[i + 1] || [])[j] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j]?.type === AI_TURN
		) {
			ev += 2;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j]?.type === PLAYER_TURN
		) {
			ev -= 2;
		}
	}

	return ev;
}

function vertical(i, j, board) {
	let ev = 0;

	if ((board.grid[i][j + 3] || []) !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i][j + 1] || [])?.type === AI_TURN &&
			(board.grid[i][j + 2] || [])?.type === AI_TURN &&
			(board.grid[i][j + 3] || [])?.type === AI_TURN
		) {
			ev += 10;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i][j + 1] || [])?.type === PLAYER_TURN &&
			(board.grid[i][j + 2] || [])?.type === PLAYER_TURN &&
			(board.grid[i][j + 3] || [])?.type === PLAYER_TURN
		) {
			ev -= 10;
		}
	}

	if ((board.grid[i][j + 2] || []) !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i][j + 1] || [])?.type === AI_TURN &&
			(board.grid[i][j + 2] || [])?.type === AI_TURN
		) {
			ev += 5;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i][j + 1] || [])?.type === PLAYER_TURN &&
			(board.grid[i][j + 2] || [])?.type === PLAYER_TURN
		) {
			ev -= 5;
		}
	}

	if ((board.grid[i][j + 1] || []) !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i][j + 1] || [])?.type === AI_TURN
		) {
			ev += 2;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i][j + 1] || [])?.type === PLAYER_TURN
		) {
			ev -= 2;
		}
	}

	return ev;
}

function slash(i, j, board) {
	let ev = 0;

	if ((board.grid[i + 3] || [])[j - 3] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === AI_TURN &&
			(board.grid[i + 2] || [])[j - 2]?.type === AI_TURN &&
			(board.grid[i + 3] || [])[j - 3]?.type === AI_TURN
		) {
			ev += 10;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === PLAYER_TURN &&
			(board.grid[i + 2] || [])[j - 2]?.type === PLAYER_TURN &&
			(board.grid[i + 3] || [])[j - 3]?.type === PLAYER_TURN
		) {
			ev -= 10;
		}
	}

	if ((board.grid[i + 2] || [])[j - 2] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === AI_TURN &&
			(board.grid[i + 2] || [])[j - 2]?.type === AI_TURN
		) {
			ev += 5;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === PLAYER_TURN &&
			(board.grid[i + 2] || [])[j - 2]?.type === PLAYER_TURN
		) {
			ev -= 5;
		}
	}

	if ((board.grid[i + 1] || [])[j - 1] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === AI_TURN
		) {
			ev += 2;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i + 1] || [])[j - 1]?.type === PLAYER_TURN
		) {
			ev -= 2;
		}
	}

	return ev;
}

function backslash(i, j, board) {
	let ev = 0;

	if ((board.grid[i - 3] || [])[j - 3] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === AI_TURN &&
			(board.grid[i - 2] || [])[j - 2]?.type === AI_TURN &&
			(board.grid[i - 3] || [])[j - 3]?.type === AI_TURN
		) {
			ev += 10;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === PLAYER_TURN &&
			(board.grid[i - 2] || [])[j - 2]?.type === PLAYER_TURN &&
			(board.grid[i - 3] || [])[j - 3]?.type === PLAYER_TURN
		) {
			ev -= 10;
		}
	}

	if ((board.grid[i - 2] || [])[j - 2] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === AI_TURN &&
			(board.grid[i - 2] || [])[j - 2]?.type === AI_TURN
		) {
			ev += 5;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === PLAYER_TURN &&
			(board.grid[i - 2] || [])[j - 2]?.type === PLAYER_TURN
		) {
			ev -= 5;
		}
	}

	if ((board.grid[i - 1] || [])[j - 1] !== undefined) {
		if (
			board.grid[i][j]?.type === AI_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === AI_TURN
		) {
			ev += 2;
		}

		if (
			board.grid[i][j]?.type === PLAYER_TURN &&
			(board.grid[i - 1] || [])[j - 1]?.type === PLAYER_TURN
		) {
			ev -= 2;
		}
	}

	return ev;
}
