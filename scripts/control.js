const X_Turn = "x";
const O_TURN = "o";
const EMPTY_CELL = "e";

const menuElement = $("#menu");
const messageElement = $("#message");
const messageTextElement = $("[data-message-text]");
const boardElement = $("#board");
const gameLevelButtons = $("[data-btn]");
const startButton = $("#btn-start");
const squareElements = $("[data-square]");
const restartButton = $("#btn-restart");
const menuButton = $("#btn-menu");

boardElement.hide();
messageElement.hide();
menuElement.show();

gameLevelButtons.each(function () {
    let btn = $(this);

    btn.click(function () {
        $(".selected").toggleClass("not-selected");
        $(".selected").toggleClass("selected");
        btn.toggleClass("not-selected");
        btn.toggleClass("selected");
        $("[data-menu-text]").text("Click Start to Continue...");
        globals.selectedLevel = btn.attr("id");
    });

    startButton.click(function () {
        if (typeof globals.selectedLevel !== "undefined") {
            let aiplayer = new AIPlayer(globals.selectedLevel);
            globals.game = new Game(aiplayer);
            aiplayer.plays(globals.game);
            globals.game.start();
            menuElement.fadeOut();
            boardElement.show();
        }
    });

    squareElements.each(function () {
        let square = $(this);
        square.click(function () {
            if (globals.game.status === "running" && globals.game.currentState.turn === X_TURN && !square.hasClass("clicked")) {
                let index = parseInt(square.attr("data-square"));
                let next = new State(globals.game.currentState);
                next.board[index] = X_TURN;

                globals.updateUI(index, X_TURN);
                next.nextTurn();

                globals.game.advanceTo(next);
            }
        });
    });

    restartButton.click(function () {
        clearBoard();
        startButton.click();
        messageElement.fadeOut();
    });

    menuButton.click(function () {
        clearBoard();
        messageElement.fadeOut();
        boardElement.hide();
        menuElement.show();
    });


    globals.updateUI = function (index, turn) {
        let targetSquare = $(`div[data-square="${index}"]`);
        if (!targetSquare.hasClass('clicked')) {
            targetSquare.addClass(turn);
            targetSquare.addClass('clicked');
        }
    }

    function clearBoard () {
        squareElements.each(function () {
            let square = $(this);
            square.removeClass();
            square.addClass("square");
        })
    }
});