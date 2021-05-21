
/*
*
*   Hangman class.  Keeps track of the selected word and all of the guesses.
*   holds an array 'hangmanLetters' as a representation of what should be
*   displayed to the user as the game progresses.
*
*/
class HangmanWord{
    constructor(word, incorrectLimit = 6) {
        this._word = word.toUpperCase();
        this._hangmanLetters = [...word];
        this._guesses = [];
        this._incorrectLimit = incorrectLimit;
        this._incorrectCount = 0;

        // clear hangman letters
        for (const i in this._hangmanLetters) {
            this._hangmanLetters[i] = " ";
        }
    }

    get word(){
        return this._word;
    }
    get hangmanLetters(){
        return [...this._hangmanLetters];
    }
    get guesses(){
        return [...this._guesses]
    }
    get incorrectLimit(){
        return this._incorrectLimit;
    }
    get incorrectCount(){
        return this._incorrectCount;
    }
    get lettersCompleted(){
        let count = 0;
        for (const letter of this._hangmanLetters)
            if (letter != " ")
                count++;
        return count;
    }
    get playerLost(){
        return this.guessPercentUsed == 100;
    }
    get playerWon(){
        return this.wordPercentComplete == 100;
    }

    /**
     * Gets the percentage of the hangman's word completion.
     * @returns {number} percent complete.
     */
    get wordPercentComplete(){
        return Math.ceil( (this.lettersCompleted / this.word.length) * 100 );
    }

    /**
     * Gets the percentage of the hangman's incorrect guesses that have been
     * used up.
     * @returns {number} percent used.
     */
    get guessPercentUsed(){
        return Math.ceil( (this.incorrectCount / this.incorrectLimit) * 100 );
    }

    GuessLetter(letter) {
        this._guesses.push(letter.toLowerCase());

        // if the letter is in the word
        if ( this._word.indexOf( letter.toUpperCase() ) != -1 ){
            // add letter to hangman letters
            for (let i = 0; i < this._word.length; i++) {
                if (letter.toUpperCase() == this._word[i])
                    this._hangmanLetters[i] = letter.toUpperCase();
            }
            return true;
        }
        else{
            this._incorrectCount++;
            return false;
        }
    }

    GuessWord(word){
        if (word.toUpperCase() == this._word){
            for (const char in this._word) {
                this._hangmanLetters[char] = this._word[char];
            }
            return true;
        }
        else
            return false;
    }

    HasGuessedLetter(letter){
        return this._guesses.indexOf(letter) != -1;
    }
}

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

let hangman;

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
    let chosenWord = possibleWords[randomIndex];

    alert(chosenWord);

    // initialize the word letter boxes
    SetLetterboxVisibility(chosenWord.length);

    // reset the game
    hangman = new HangmanWord(chosenWord);
    let guessedLetters = [];
    EnableGuessBtns();
    letterGuessInput.value = "";
    wordGuessInput.value = "";
    SetProgress(manProgress, 0);
    SetProgress(wordProgress, 0)
}

async function GuessLetter(){
    let correct = false;
    let letter = letterGuessInput.value;
    letterGuessInput.value = "";            //clear old input

    // early out
    if ( isEmptyOrWhitespace(letter) ){
        alert("To guess a word, you must enter a value.\nTry again.");
        return;
    }

    // early out
    if ( hangman.HasGuessedLetter(letter) ){
        alert(`You already guessed letter '${letter.toLowerCase()}'.\nTry again.`);
        return;
    }

    // update the display boxes and progress bars
    if ( hangman.GuessLetter(letter) ){
        UpdateLetterboxLetters();
        SetProgress(wordProgress, hangman.wordPercentComplete);
    }
    else {
        SetProgress(manProgress, hangman.guessPercentUsed);
    }

    // did the player win or loose?
    if (hangman.playerWon)
        playerWon();

    if (hangman.playerLost)
        playerLost();
}

async function GuessWord(){

    let word = wordGuessInput.value;

    // early out
    if ( isEmptyOrWhitespace(word) ){
        alert("To guess a word, you must enter a value.\nTry again.");
        return;
    }

    // is word correct?
    if ( hangman.GuessWord(word) ){
      playerWon();
    }
    else
    {
        playerLost();
    }

}


// * * * * * * * * html element updaters * * * * * * * * *//

async function playerWon(){
    DisableGuessBtns();
    UpdateLetterboxLetters();
    // give message after progress bar finishes
    await SetProgress( wordProgress, 100);
    alert("You Chose Correctly!  You Win!");
}
async function playerLost(){
    DisableGuessBtns();
    // give message after progress bar finishes
    await SetProgress( manProgress, 100);
    alert("You Lost! Try again...");
}

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

function UpdateLetterboxLetters(){
    // get boxes that are visible
    let visibleBoxes = [];
    for (var letterBox of letterBoxes)
        if ( !letterBox.classList.contains("d-none") )
            visibleBoxes.push(letterBox);

    // match hangman letters to the page letter boxes
    for (const box in visibleBoxes) {
        visibleBoxes[box].innerText = hangman.hangmanLetters[box];
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
