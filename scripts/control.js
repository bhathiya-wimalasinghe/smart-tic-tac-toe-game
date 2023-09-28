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
});