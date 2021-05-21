
// * * * * * * * * VARS * * * * * * * * *//

// html elements
let wordProgress;
let manProgress;
let gallowsDisplay;
let letterBoxes;

// inputs
let categoriesDropdown;
let maxLettersInput;
let wordGuessInput;
let letterGuessInput;

// buttons
let letterGuessBtn = document.getElementById("guess-letter-btn");
let wordGuessBtn = document.getElementById("guess-word-btn");

// gameplay vars
let theChosenWord = "unselected"
let guessedLetters = [];


// * * * * * * * * PAGE INITIALIZATION * * * * * * * * *//


// assign page element vars, assign event handlers, popuate html content
document.addEventListener("DOMContentLoaded", () => {

    // get page elements
    letterGuessBtn = document.getElementById("guess-letter-btn");
    wordGuessBtn = document.getElementById("guess-word-btn");
    wordProgress = document.getElementById("word-progress");
    manProgress = document.getElementById("man-progress");
    gallowsDisplay = document.getElementById("gallows");
    letterBoxes = document.getElementById("word-container").getElementsByClassName("letter-box");

    categoriesDropdown = document.getElementById("word-categories");
    maxLettersInput = document.getElementById("word-letters-max");
    wordGuessInput = document.getElementById("word-guess");
    letterGuessInput = document.getElementById("letter-guess");

    //settup button handlers
    document.getElementById("play-btn").onclick = Play;
    letterGuessBtn.onclick = GuessLetter;
    wordGuessBtn.onclick = GuessWord;


    // POPULATE CATEGORIES DROP DOWN
    for (const wordGroup of wordBank){
        option = document.createElement("option");
        option.value = wordGroup.category;
        option.textContent = wordGroup.category;
        categoriesDropdown.appendChild(option);
    }

    // draw gallows
    gallowsDisplay.innerText = hangmanASCII;

    // set gamestate
    DisableGuessBtns();
});



// * * * * * * * * Event Handlers * * * * * * * * *//


// gameplay settup.  Choose word show letter positions
function Play(){
    let possibleWords;
    // find words in the selected catagory
    for ( const wordGroup of wordBank )
        if ( wordGroup.category === categoriesDropdown.value)
            possibleWords = [...wordGroup.words];

    // select only the words with correct number of letters
    FilterWordsBySize(possibleWords, maxLettersInput.value);

    // randomly choose one of those words
    let length = possibleWords.length;
    let randomIndex = Math.floor(Math.random() * length)
    theChosenWord = possibleWords[randomIndex];

    alert(theChosenWord);

    // initialize the word letter boxes
    SetLetterboxVisibility(theChosenWord.length);

    // reset the game
    let guessedLetters = [];
    EnableGuessBtns();
}

async function GuessLetter(){

    if ( letterGuessInput.value == "")

    function isLetterCorrect(){
        return true;
    }
}

async function GuessWord(){

    // is word correct?
    if ( isWordCorrect() ){
        await SetProgress( wordProgress, 100);
        alert("You guessed the word correctly!  You Win!"); // give win message after progress bar finishes
    }
    else
    {
        await SetProgress( manProgress, 100);
        alert("Your word guess was incorrect. You Lose! Try again..."); // give win message after progress bar finishes
    }

    DisableGuessBtns();

    function isWordCorrect(){
        return wordGuessInput.value.toUpperCase() == theChosenWord.toUpperCase();
    }
}


// * * * * * * * * html element updaters * * * * * * * * *//


function SetLetterboxVisibility(numberVisible){
    let boxesToRemove = letterBoxes.length - numberVisible;

    // set visibility (display) for each box
    for (let i = 0; i < letterBoxes.length; i++) {
        if (i < boxesToRemove)
            letterBoxes[i].classList.add("d-none");
        else
            letterBoxes[i].classList.remove("d-none");
    }
}

// sets the given progress bar to the correct value
async function SetProgress(bar, value){

    // we don't want to wait for this function to finish the animation, so
    // put code this animation in a timeout callback
    setTimeout( async ()=>{
        // set the bar's new value
        bar.style.width = value+"%";
        bar.setAttribute("aria-valuenow", value);
        bar.innerText = value+"%";

        // stop the animation after a pause
        await Sleep(2000);
        bar.classList.remove("progress-bar-animated");

    }, 0 );

    // make awaitable
    return new Promise(async resolve => {
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

            // pause before next itteration
            await Sleep(interval);
        }

        resolve("resolved");
    });
}

function DisableGuessBtns(){
    wordGuessBtn.setAttribute("disabled", "disabled");
    letterGuessBtn.setAttribute("disabled", "disabled");
}
function EnableGuessBtns(){
    wordGuessBtn.removeAttribute("disabled");
    letterGuessBtn.removeAttribute("disabled");
}


// * * * * * * * * helper functions * * * * * * * * *//

function isEmptyOrWhitespace{
    var regex = /^\s*$/;
}

// used for easier to read waiting intervals/timeouts (async style code)
function Sleep(ms) {
    return new Promise( callback => setTimeout(callback, ms));
}

function FilterWordsBySize(words, sizeCap){
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > sizeCap){
            words.splice(i, 1);                         // remove the current element if too big
            return FilterWordsBySize(words, sizeCap);   // do it again...
        }
    }
}

// * * * * * * * * DATA * * * * * * * * *//

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
