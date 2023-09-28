const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

class State {
    constructor(old) {
        this.turn = "";
        this.oMovesCount = 0;
        this.result = "still running";
        this.board = [];

        if (typeof old !== "undefined") {
            const len = old.board.length;
            this.board = new Array(len);
            for (let i = 0; i < len; i++) {
                this.board[i] = old.board[i];
            }
            this.oMovesCount = old.oMovesCount;
            this.result = old.result;
            this.turn = old.turn;
        }
    }

    nextTurn () {
        this.turn = this.turn === X_TURN ? O_TURN : X_TURN;
    }

    findEmptyCells () {
        const emptyIndex = [];
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === EMPTY_CELL) {
                emptyIndex.push(i);
            }
        }
        return emptyIndex;
    }

    isGameOver () {
        const currentBoard = this.board;

        const isXWin = WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => {
                return this.board[index] === X_TURN;
            });
        });

        const isOWin = WINNING_COMBINATIONS.some((combination) => {
            return combination.every((index) => {
                return this.board[index] === O_TURN;
            });
        });

        if (isXWin || isOWin) {
            this.result = isXWin ? "You Won!" : "You Lost!";
            return true;
        }

        const emptyCells = this.findEmptyCells();
        if (emptyCells.length === 0) {
            this.result = "Draw";
            return true;
        } else {
            return false;
        }
    }
}


class Game {
    constructor(autoPlayer) {
        this.ai = autoPlayer;
        this.currentState = new State();
        this.currentState.board = ["e", "e", "e",
            "e", "e", "e",
            "e", "e", "e"];
        this.currentState.turn = X_TURN;
        this.status = "beginning";
    }

    static score (_state) {
        if (_state.result !== "still running") {
            if (_state.result === "You Won!") {
                return 10 - _state.oMovesCount;
            } else if (_state.result === "You Lost!") {
                return -10 + _state.oMovesCount;
            } else {
                return 0;
            }
        }
    }

    advanceTo (_state) {
        this.currentState = _state;

        if (_state.isGameOver()) {
            this.status = "ended";
            messageTextElement.text(this.currentState.result);
            messageElement.show();
        }

        if (this.currentState.turn !== X_TURN) {
            this.ai.notify(O_TURN);
        }

    }

    start () {
        if (this.status === "beginning") {
            this.advanceTo(this.currentState);
            this.status = "running";
        }
    }

}
