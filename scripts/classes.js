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

class AIMove {
    constructor(position) {
        this.movePosition = position;
        this.minimaxVal = 0;
    }

    applyTo (state) {
        const next = new State(state);

        next.board[this.movePosition] = state.turn;

        if (state.turn === O_TURN) {
            next.oMovesCount++;
        }

        next.nextTurn();

        return next;
    }
}

AIMove.ASCENDING = function (firstAction, secondAction) {
    if (firstAction.minimaxVal < secondAction.minimaxVal) return -1;
    else if (firstAction.minimaxVal > secondAction.minimaxVal) return 1;
    else return 0;
};


class AIPlayer {
    constructor(level) {
        this.gameLevel = level;
        this.game = {};
    }

    minimaxValue (state) {
        if (state.isGameOver()) {
            return Game.score(state);
        } else {
            var stateScore;

            if (state.turn === X_TURN) stateScore = -1000;
            else stateScore = 1000;

            let availablePositions = state.findEmptyCells();

            let availableNextStates = availablePositions.map(function (position) {
                let action = new AIMove(position);

                let nextState = action.applyTo(state);

                return nextState;
            });

            availableNextStates.forEach((nextState) => {
                var nextScore = this.minimaxValue(nextState);

                if (state.turn === X_TURN) {
                    if (nextScore > stateScore) stateScore = nextScore;
                } else {
                    if (nextScore < stateScore) stateScore = nextScore;
                }
            });

            return stateScore;
        }
    }

    playEasyMove (turn) {
        let available = this.game.currentState.findEmptyCells();

        let move = new AIMove(available[Math.floor(Math.random() * available.length)]);

        let next = move.applyTo(this.game.currentState);

        globals.updateUI(move.movePosition, turn);

        globals.game.advanceTo(next);
    }

    playMediumMove (turn) {
        let available = this.game.currentState.findEmptyCells();

        let possibleMoves = available.map((position) => {
            let move = new AIMove(position);

            let next = move.applyTo(globals.game.currentState);

            move.minimaxVal = this.minimaxValue(next);

            return move;
        });

        possibleMoves.sort(AIMove.ASCENDING);

        let chosenAction = possibleMoves[Math.floor(Math.random() * (possibleMoves.length / 2))];
        let next = chosenAction.applyTo(this.game.currentState);
        globals.updateUI(chosenAction.movePosition, turn);

        globals.game.advanceTo(next);
    }

    playHardMove (turn) {
        let available = this.game.currentState.findEmptyCells();

        let possibleMoves = available.map((position) => {
            let move = new AIMove(position);

            let next = move.applyTo(globals.game.currentState);

            move.minimaxVal = this.minimaxValue(next);

            return move;
        });

        possibleMoves.sort(AIMove.ASCENDING);

        let chosenAction = possibleMoves[0];
        let next = chosenAction.applyTo(this.game.currentState);
        globals.updateUI(chosenAction.movePosition, turn);

        globals.game.advanceTo(next);
    }

    plays (_game) {
        this.game = _game;
    }

    notify (turn) {
        if (globals.game.status === "ended") return;
        switch (this.gameLevel) {
            case "btn-easy":
                this.playEasyMove(turn);
                break;
            case "btn-medium":
                this.playMediumMove(turn);
                break;
            case "btn-hard":
                this.playHardMove(turn);
                break;
        }
    }
}

