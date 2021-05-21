
/*
*
*   Hangman class.  Keeps track of the selected word and all of the guesses.
*   holds an array 'hangmanLetters' as a representation of what should be
*   displayed to the user as the game progresses.
*
*/
class HangmanWord{
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
        else
            return false;
    }

    HasGuessedLetter(letter){
        return this._guesses.indexOf(letter) != -1;
    }
}