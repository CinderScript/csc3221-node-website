
// * * * * * * * * VARS * * * * * * * * *//

// html elements
let wordProgress;
let manProgress;
let gallowsDisplay;
let letterBoxes;
let letterBoxSpacers;

// inputs
let categoriesDropdown;
let maxLettersInput;
let wordGuessInput;
let letterGuessInput;

// buttons
let letterGuessBtn = document.getElementById("guess-letter-btn");
let wordGuessBtn = document.getElementById("guess-word-btn");

// gameplay vars
const MAXIMUM_GUESSES = 6;
let theHangmanWord = "unselected";
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
    letterBoxSpacers = document.getElementById("word-container").getElementsByClassName("spacer");

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
    theHangmanWord = possibleWords[randomIndex];

    alert(theHangmanWord);

    // initialize the word letter boxes
    SetLetterboxVisibility(theHangmanWord.length);

    // reset the game
    let guessedLetters = [];
    EnableGuessBtns();
    letterGuessInput.value = "";
    wordGuessInput.value = "";
}

async function GuessLetter(){

    let letter = letterGuessInput.value;
    guessedLetters.push(letter);

    // early out
    if ( isEmptyOrWhitespace(letter) ){
        alert("To guess a word, you must enter a value.\nTry again.");
        return;
    }
    // if letter is correct, update the letter boxes
    for (const char of theHangmanWord)
        if (char == letter)
            UpdateLetterboxLetters(guessedLetters);

    // clear old input
    letterGuessInput.value = "";
}

async function GuessWord(){

    let word = wordGuessInput.value;

    // early out
    if ( isEmptyOrWhitespace(word) ){
        alert("To guess a word, you must enter a value.\nTry again.");
        return;
    }

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
        return word.toUpperCase() == theHangmanWord.toUpperCase();
    }
}


// * * * * * * * * html element updaters * * * * * * * * *//


function SetLetterboxVisibility(numberVisible){
    let boxesToRemove = letterBoxes.length - numberVisible;
    let spacersToRemove = boxesToRemove;

    // set visibility (display) for each box
    for (let i = 0; i < letterBoxes.length; i++) {
        if (i < boxesToRemove)
            letterBoxes[i].classList.add("d-none");
        else
            letterBoxes[i].classList.remove("d-none");
    }

    // set visibility (display) for each spacer
    for (let i = 0; i < letterBoxSpacers.length; i++) {
        if (i < spacersToRemove)
            letterBoxSpacers[i].classList.add("d-none");
        else
            letterBoxSpacers[i].classList.remove("d-none");
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

function UpdateLetterboxLetters(guessedLetters){
    // get boxes that are visible
    let visibleBoxes = [];
    for (var letterBox of letterBoxes)
        if ( !letterBox.classList.contains("d-none") )
            visibleBoxes.push(letterBox);

    // for each letter that was guessed, find it's position in the hangman word
    for (const letterIndex in guessedLetters) {
        let guess = guessedLetters[letterIndex];

        // find each match in hangman word
        for (const hangIndex in theHangmanWord)
            if (theHangmanWord[hangIndex] == guess)
                visibleBoxes[hangIndex].innerText = theHangmanWord[hangIndex].toUpperCase();


    }
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

function isEmptyOrWhitespace(string) {
    var regex = /^\s*$/; // whitespace

    if ( string.length == 0 || string.replace(regex, '').length == 0)
        return true;
    else
        return false;
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
    "==####=^^======^====^^^=####===\n" +
    "                       -picasso";
