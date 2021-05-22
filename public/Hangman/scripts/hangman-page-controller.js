// * * * * * * * * VARS * * * * * * * * *//

// html elements
let wordProgress;
let manProgress;
let gallowsDisplay;
let letterBoxes;
let letterBoxSpacers;
let guessHistory;
let guessRemainingCountElement;

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
var playSound = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav");
var incorrectSound = new Audio("https://rpg.hamsterrepublic.com/wiki-images/d/d7/Oddbounce.ogg");
var correctSound = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3");

playSound.volume = 0.6;
incorrectSound.volume = 0.5;
correctSound.volume = 0.5;


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
    guessHistory = document.getElementById("letters-guessed");
    guessRemainingCountElement = document.getElementById("guess-remaining-count");

    categoriesDropdown = document.getElementById("word-categories");
    maxLettersInput = document.getElementById("word-letters-max");
    wordGuessInput = document.getElementById("word-guess");
    letterGuessInput = document.getElementById("letter-guess");

    //settup event handlers
    document.getElementById("play-btn").onclick = Play;
    letterGuessBtn.onclick = GuessLetter;             // GuessLetter on Enter
    letterGuessInput.onkeypress = (event) => {        // GuessLetter on Enter
        if (event.code === 'Enter') {
            GuessLetter();
        }
    };
    wordGuessBtn.onclick = GuessWord;               // GuessWord on Click
    wordGuessInput.onkeypress = (event) => {        // GuessWord on Enter
        if (event.code === 'Enter') {
            GuessWord();
        }
    };


    // POPULATE CATEGORIES DROP DOWN
    for (const wordGroup of wordBank){
        option = document.createElement("option");
        option.value = wordGroup.category;
        option.textContent = wordGroup.category;
        categoriesDropdown.appendChild(option);
    }

    // set gamestate
    DisableGuessBtns();

    gallowsDisplay.innerText = HangmanGame.GetRenderedMan(0);
});



// * * * * * * * * Event Handlers * * * * * * * * *//


// gameplay settup.  Choose word show letter positions
function Play(){

    // early out
    if (maxLettersInput.value < 3){
        alert("You much choose a value greater then 2.");
        maxLettersInput.value = 3;
        return;
    }

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

    alert(
`Picking a word with ${maxLettersInput.value} letters or fewer...
Found a word with ${chosenWord.length} letters!
Start guessing.`);

    // initialize the word letter boxes
    SetLetterboxVisibility(chosenWord.length);

    // reset the game
    hangman = new HangmanGame(chosenWord);
    let guessedLetters = [];
    EnableGuessBtns();
    letterGuessInput.value = "";
    wordGuessInput.value = "";
    SetProgress(manProgress, 0);
    SetProgress(wordProgress, 0);
    guessHistory.innerText = "";
    guessRemainingCountElement.innerText = 5;

    // draw gallows
    SetContentAnimated(gallowsDisplay, HangmanGame.GetRenderedMan(0), HangmanGame.GetRenderedMan(), 5, 150);

    // sound effect
    playSound.play();
}

function GuessLetter(){
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
    if ( hangman.GuessLetter(letter) ){             // if correct letter
        UpdateLetterboxLetters();
        SetProgress(wordProgress, hangman.wordPercentComplete);
        correctSound.currentTime = 0; // long sound - so restart for next play
        correctSound.play();
    }
    else {                                          // else incorrect letter
        SetProgress(manProgress, hangman.guessPercentUsed);
        guessRemainingCountElement.innerText = hangman.incorrectLimit - hangman.incorrectCount;
        incorrectSound.play();
    }

    // update the guess history display
    guessHistory.innerText = hangman.guesses.join(" ");

    /// WIN OR LOOSE?

    if (hangman.playerWon)
        playerWon();
    else if (hangman.playerLost) {
        guessRemainingCountElement.innerText = 0;
        playerLost();
    }

    // update gallows
    let renderedCurrentMan = hangman.GetCurrentRenderedMan();
    SetContentAnimated(gallowsDisplay, renderedCurrentMan, HangmanGame.GetRenderedMan(0));

}

function GuessWord(){
    let word = wordGuessInput.value;

    // early out
    if ( isEmptyOrWhitespace(word) ){
        alert("To guess a word, you must enter a value.\nTry again.");
        return;
    }

    // is word correct?
    if ( hangman.GuessWord(word) ){
        playerWon();
        correctSound.play();
    }
    else {
        // update gallows
        let renderedCurrentMan = hangman.GetCurrentRenderedMan();
        SetContentAnimated(gallowsDisplay, renderedCurrentMan, HangmanGame.GetRenderedMan(0));

        playerLost();
        incorrectSound.play();
    }
}


// * * * * * * * * html element updaters * * * * * * * * *//

function playerWon(){
    DisableGuessBtns();
    UpdateLetterboxLetters();
    // give message after progress bar finishes
    SetProgress( wordProgress, 100);
    setTimeout(()=> {alert("You Chose Correctly!  You Win!")}, 700 )
}
function playerLost(){
    DisableGuessBtns();
    // give message after progress bar finishes
    SetProgress( manProgress, 100);
    setTimeout(()=> {alert(`You Lost!\nThe word was: ${hangman.word}\nTry again...`)}, 700 )
}

function SetLetterboxVisibility(numberVisible){
    let boxesToRemove = letterBoxes.length - numberVisible;
    let spacersToRemove = boxesToRemove;

    // set visibility (display) for each box
    for (let i = 0; i < letterBoxes.length; i++) {
        if (i < boxesToRemove){
            letterBoxes[i].classList.add("d-none");
            letterBoxes[i].innerText = " ";
        }
        else {
            letterBoxes[i].classList.remove("d-none");
            letterBoxes[i].innerText = " ";
        }
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
function SetProgress(bar, value){

    // temporarily animate the bar
    bar.classList.add("progress-bar-animated");

    // set the bar's new value
    bar.style.width = value+"%";
    bar.setAttribute("aria-valuenow", value);
    bar.innerText = value + "%";

    // stop the animation after a pause
    setTimeout( () => {
        bar.classList.remove("progress-bar-animated");
    }, 2000);
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

    wordGuessInput.setAttribute("disabled", "disabled");
    letterGuessInput.setAttribute("disabled", "disabled");
}
function EnableGuessBtns(){
    wordGuessBtn.removeAttribute("disabled");
    letterGuessBtn.removeAttribute("disabled");

    wordGuessInput.removeAttribute("disabled");
    letterGuessInput.removeAttribute("disabled");
}

function SetContentAnimated(element, stateOn, stateOff, numberOfFlashes = 6, interval = 180){

    element.innerHTML = stateOn; // for iphone -> someties does not run setInterval callbacks

    let flashCount = 0;
    let toggle = true;
    let flashing = setInterval(()=>{
        if (toggle)
            element.innerHTML = stateOn;
        else
            element.innerHTML = stateOff;

        toggle = !toggle;
        flashCount++;

        if (flashCount == numberOfFlashes*2){
            clearInterval(flashing);
            element.innerHTML = stateOn;
        }

    }, interval);
}


// * * * * * * * * helper functions * * * * * * * * *//

function isEmptyOrWhitespace(string) {
    var regex = /^\s*$/; // whitespace

    if ( string.length == 0 || string.replace(regex, '').length == 0)
        return true;
    else
        return false;
}

function FilterWordsBySize(words, sizeCap){
    for (let i = 0; i < words.length; i++) {
        if (words[i].length > sizeCap){
            words.splice(i, 1);                         // remove the current element if too big
            return FilterWordsBySize(words, sizeCap);   // do it again...
        }
    }
}
