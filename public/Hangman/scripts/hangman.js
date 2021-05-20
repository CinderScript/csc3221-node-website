let gameWindow;
let wordProgress;
let manProgress;
let categories;
let gallows;

// INITIALIZATION - GET ELEMENTS, SET HANDLERS, POPULATE DROP DOWN
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("play-btn").onclick = Play;
    document.getElementById("guess-letter-btn").onclick = GuessLetter;

    gameWindow = document.getElementById("game-window");
    wordProgress = document.getElementById("word-progress");
    manProgress = document.getElementById("man-progress");
    categories = document.getElementById("word-categories");
    gallows = document.getElementById("gallows");

    // write each category name from the json object to the select element's options
    for (const wordGroup of wordBank){
        option = document.createElement("option");
        option.value = wordGroup.category;
        option.textContent = wordGroup.category;
        categories.appendChild(option);
    }

    // draw gallows
    gallows.innerText = hangmanASCII;
});

function Play(){

    if (gameWindow.classList.contains("d-none"))
        gameWindow.classList.remove("d-none");
    else
        gameWindow.classList.add("d-none");
}

function GuessLetter(){
    SetProgress( wordProgress, 80);
    SetProgress( manProgress, 20);
}

// sets the given progress bar to the correct value
async function SetProgress(bar, value){

    // temporarily animate the bar
    bar.classList.add("progress-bar-animated");

    // flash the progress bar
    let flashCount = 6;
    let interval = 120;
    for (let i = 0; i < flashCount; i++){
        if (bar.classList.contains("d-none"))
            bar.classList.remove("d-none");
        else
            bar.classList.add("d-none");

        await Sleep(interval);
    }

    // set the bar's new value
    bar.style.width = value+"%";
    bar.setAttribute("aria-valuenow", value);
    bar.innerText = value+"%";

    // stop the animation after a pause
    await Sleep(3000);
    bar.classList.remove("progress-bar-animated");
}

// used for easier to read waiting intervals/timeouts (async style code)
function Sleep(ms) {
    return new Promise( callback => setTimeout(callback, ms));
}


let wordBank =
    [
        {"category": "Animal", "words": ["dog", "cat", "mouse", "rabbit", "horse", "anaconda", "ox", "tardigrade", "turtle", "bear"]},
        {"category": "Fruit", "words": ["apple", "pear", "fig", "grape", "watermelon", "strawberry", "persimmon", "cherimoya", "plumb", "avacado"]},
        {"category": "State Of Mind", "words": ["fearful", "happy", "sad", "mad", "indecisive", "content", "agitated", "confused", "twitterpated", "convinced", "terrified"]}
    ];


let hangmanASCII = "" +
    "        ===§===\\\\==tt==\n" +
    "           §    \\  ||\n" +
    "           §     \\ ||\n" +
    "           šO     \\||\n" +
    "          /|\\      ||\n" +
    "           |       ||\n" +
    "         _/ \\_     ||\n" +
    "========      //===TT=========\n" +
    "  \\||/        /         \\||/\n" +
    "   ||        /           ||\n" +
    "   ||                    ||\n" +
    "  /||\\                  /||\\\n" +
    "==####=^^======^====^^^=####===";
