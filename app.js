var Application = PIXI.Application;
var app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
    antialias: true,
    align: "center"
});
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";
document.body.appendChild(app.view);
var Graphics = PIXI.Graphics;
// Useful html elements
var canvas = document.querySelector("canvas");
var result = document.querySelector(".result");
var playAgainButton = document.querySelector(".btn");
console.log(playAgainButton);
playAgainButton.addEventListener("click", function (e) {
    e.preventDefault();
    restartGame();
});
// Create time remaining box & text
var timeRemaining = 20000;
var score = 0;
var isCountingDown = false;
var buttonsActive = true;
var startingMs = null;
var msPassedSinceButtonClick = 0;
var msPassedForColourUpdate = 0;
var timeRemainingText = addSimpleRectangleWithCenteredText((timeRemaining / 1000).toFixed(1).toString(), 5);
var scoreText = addSimpleRectangleWithCenteredText(score.toString(), 20);
// Create the large central circle which cycles through colours
var mainCircle = new Graphics();
mainCircle.beginFill(0XFFFFFF)
    .lineStyle(1, 0X000000, 1)
    .drawCircle(window.innerWidth / 2, window.innerHeight / 2, 100)
    .endFill();
app.stage.addChild(mainCircle);
// Create the smaller circles which represent buttons that the player can click
var buttons = new Array(5);
buttons = [
    new ColouredButton("Red", "0Xff0000"),
    new ColouredButton("Blue", "0X0000FF"),
    new ColouredButton("Green", "0X00FF00"),
    new ColouredButton("Yellow", "0XFFFF00"),
    new ColouredButton("Orange", "0XFFA500")
];
var lastButtonClicked = null;
var randomButtonSelected = null;
var offset = 40;
buttons.forEach(function (button) {
    var smallCircle = new Graphics();
    smallCircle.beginFill(button.hexCodeOfColour)
        .lineStyle(1, 0X000000, 1)
        .drawCircle((window.innerWidth / 100) * offset, (window.innerHeight / 100) * 75, 25)
        .endFill();
    smallCircle.interactive = true;
    smallCircle.buttonMode = true;
    smallCircle.click = function (mouseData) {
        if (timeRemaining > 0 && buttonsActive) {
            msPassedSinceButtonClick = 0;
            isCountingDown = true;
            lastButtonClicked = button;
            buttonsActive = false;
        }
    };
    app.stage.addChild(smallCircle);
    offset += 5;
});
// Gameplay Loop
app.ticker.add(function (delta) { return loop(delta); }, {});
// Functions
function addSimpleRectangleWithCenteredText(text, percentOffsetFromTop) {
    var rect = new PIXI.Graphics();
    rect.beginFill(0xFFFFFF)
        .lineStyle(5, 0x000000)
        .drawRect(0, 0, 400, 75);
    app.stage.addChild(rect);
    rect.x = (window.innerWidth / 2) - 200;
    rect.y = (window.innerHeight / 100) * percentOffsetFromTop;
    var style = new PIXI.TextStyle({
        fontFamily: "Montserrat",
        fontSize: 60,
        stroke: "#ffffff",
        strokeThickness: 4
    });
    var textObj = new PIXI.Text(text, style);
    textObj.x = rect.width / 2;
    textObj.y = rect.height / 2;
    textObj.anchor.set(0.5);
    rect.addChild(textObj);
    return textObj;
}
function loop(delta) {
    if (isCountingDown) {
        if (startingMs == null) {
            startingMs = Date.now();
        }
        else {
            var diff = Date.now() - startingMs;
            startingMs = Date.now();
            timeRemaining -= diff;
            msPassedSinceButtonClick += diff;
            msPassedForColourUpdate += diff;
            timeRemainingText.text = (timeRemaining / 1000).toFixed(1).toString();
            if (msPassedForColourUpdate >= 100 && msPassedSinceButtonClick < 2000 && buttonsActive == false) {
                randomButtonSelected = buttons[randomIntFromInterval(0, 4)];
                mainCircle.tint = randomButtonSelected.hexCodeOfColour;
                msPassedForColourUpdate = 0;
            }
            if (msPassedSinceButtonClick >= 2000) {
                msPassedSinceButtonClick = 0;
                msPassedForColourUpdate = 0;
                buttonsActive = true;
                if ((randomButtonSelected === null || randomButtonSelected === void 0 ? void 0 : randomButtonSelected.nameOfColour) == (lastButtonClicked === null || lastButtonClicked === void 0 ? void 0 : lastButtonClicked.nameOfColour)) {
                    score += 1;
                    scoreText.text = score.toString();
                    lastButtonClicked = null;
                }
            }
        }
    }
    if (timeRemaining < 0) {
        timeRemaining = 0;
        isCountingDown = false;
        buttonsActive = false;
        result.classList.remove("d-none");
        canvas.classList.add("d-none");
        var output_1 = 0;
        var interval_1 = setInterval(function () {
            result.querySelector("span").textContent = score.toString();
            if (output_1 === score) {
                clearInterval(interval_1);
            }
            else {
                output_1++;
            }
        }, 100);
    }
}
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function restartGame() {
    result.classList.add("d-none");
    canvas.classList.remove("d-none");
    timeRemaining = 20000;
    timeRemainingText.text = timeRemaining.toString();
    score = 0;
    scoreText.text = score.toString();
    isCountingDown = false;
    buttonsActive = true;
    startingMs = null;
    msPassedSinceButtonClick = 0;
    msPassedForColourUpdate = 0;
}
