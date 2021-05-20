let gameWindow;
let wordProgress;
let manProgress;
let categories;

// Get elements and set event handlers
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("play-btn").onclick = Run;
    document.getElementById("guess-btn").onclick = Guess;

    gameWindow = document.getElementById("game-window");
    wordProgress = document.getElementById("word-progress");
    manProgress = document.getElementById("man-progress");
    categories = document.getElementById("word-categories");



    PopulateCategories();
});

// used for easier to read waiting intervals/timeouts (async style code)
function Sleep(ms) {
    return new Promise( callback => setTimeout(callback, ms));
}

function PopulateCategories(){

    for (const wordGroup of wordBank){
        option = document.createElement("option");
        option.value = wordGroup.category;
        option.textContent = wordGroup.category;
        categories.appendChild(option);
    }


}

function Guess(){
    SetProgress( wordProgress, 80);
    SetProgress( manProgress, 20);
}

function Run(){

    if (gameWindow.classList.contains("d-none"))
        gameWindow.classList.remove("d-none");
    else
        gameWindow.classList.add("d-none");
}

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


let wordBank =
    [
        {"category": "Animal", "words": ["dog", "cat", "mouse", "rabbit", "horse", "anaconda", "ox", "tardigrade", "turtle", "bear"]},
        {"category": "Fruit", "words": ["apple", "pear", "fig", "grape", "watermelon", "strawberry", "persimmon", "cherimoya", "plumb", "avacado"]},
        {"category": "State Of Mind", "words": ["fearful", "happy", "sad", "mad", "indecisive", "content", "agitated", "confused", "twitterpated", "convinced"]}
    ];
