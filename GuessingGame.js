function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(arr) {
    var i = arr.length;
    while(i) {
        var randomIndex = Math.floor(Math.random() * i--);
        var temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(num) {
    if(typeof num !== 'number' || num < 1 || num > 100) {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;
    return this.checkGuess();
};

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop('disabled', true);
        $('#subtitle').text('Press the Reset button to play again!');
        return 'You Win!';
    } else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop('disabled', true);
                $('#subtitle').text('Press the Reset button to play again!');
                return 'You Lose.';
            } else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text('Guess Higher!');
                } else {
                    $('#subtitle').text('Guess Lower!');
                }
                if(diff < 10) {
                    return 'You\'re burning up!';
                } else if(diff < 25) {
                    return 'You\'re lukewarm.';
                } else if(diff < 50) {
                    return 'You\'re a bit chilly.';
                } else {
                    return 'You\'re ice cold!';
                }
            }
        }
    }
};

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function guessANum(game) {
    var guess = $('#players-input').val();
    $('#players-input').val('');
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function() {
        guessANum(game);
    });

    $('#players-input').keypress(function(event) {
        if(event.which == 13) {
            guessANum(game);
        }
    });

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });
    
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('-');
        $('#submit, #hint').prop('disabled', false);
    });
    
});


