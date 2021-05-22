
/*
*
*   Hangman class.  Keeps track of the selected word and all of the guesses.
*   holds an array 'hangmanLetters' as a representation of what should be
*   displayed to the user as the game progresses.
*
*/
class HangmanGame{
    constructor(word, incorrectLimit = 5) {
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
        return Math.ceil( (this.incorrectCount / (this.incorrectLimit+1)) * 100 );
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
        else{
            this._incorrectCount = this.incorrectLimit + 1;
            return false;
        }
    }
    HasGuessedLetter(letter){
        return this._guesses.indexOf(letter) != -1;
    }

    /**
     * Returns the current hangman's image rendered in ascii.
     * @returns {string} the rendered hangman in ascii
     */
    GetCurrentRenderedMan(){
        return HangmanGame.GetRenderedMan(this.incorrectCount);
    }

    /**
     * Returns hangman rendering depending on the given stage.  There are 6 total possible stages.
     * By default, returns the hangman at stage 6 - the completed hangman.
     *
     * @param stage - The hangman stage to return (0 - 6)
     * @returns {string} the hangman rendered in ascii
     */

    static GetRenderedMan(stage = 6){
        let manImage = hangmanASCII;
        for (const part of bodyparts) {
            if (part.stage <= stage){
                manImage = manImage.replaceAll(part.bodyNumber, part.ascii);
            }
            else{
                manImage = manImage.replaceAll(part.bodyNumber, " ");
            }
        }
        return manImage;
    }
}


/* HANGMAN DRAWING OUTPUT
        ===§===\\==tt==
           §    \  ||
           §     \ ||
           š()    \||
          /|\      ||
           |       ||
         _/ \_     ||
========      //===TT=========
*/

// each of the numbers in the hangman ascii is replaced with
// the corresponding character depending on the stage

let hangmanASCII = "" +
    "        ===§===\\\\==tt==\n" +
    "           §    \\  ||\n" +
    "           §     \\ ||\n" +
    "           š12    \\||\n" +
    "          435      ||\n" +
    "           3       ||\n" +
    "         67 89     ||\n" +
    "========      //===TT=========\n" +
    "  \\||/        /         \\||/\n" +
    "   ||        /           ||\n" +
    "   ||                    ||\n" +
    "  /||\\                  /||\\\n" +
    "==####=^^======^====^^^=####===\n" +
    "                       -picasso";

let bodyparts = [
    { stage: 1, bodyNumber : 1,  ascii : '(' },
    { stage: 1, bodyNumber : 2,  ascii : ')' },
    { stage: 2, bodyNumber : 3,  ascii : '|' },
    { stage: 2, bodyNumber : 3,  ascii : '|' },
    { stage: 3, bodyNumber : 4,  ascii : '/' },
    { stage: 4, bodyNumber : 5,  ascii : '\\' },
    { stage: 5, bodyNumber : 6,  ascii : '_' },
    { stage: 5, bodyNumber : 7,  ascii : '/' },
    { stage: 6, bodyNumber : 8,  ascii : '\\' },
    { stage: 6, bodyNumber : 9,  ascii : '_' } ];