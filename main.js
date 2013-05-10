 /**
  * Vars:
  * correctwords
  * attempts
  
  * words[]
  * wordsPos[]
  * window.n
  * randomIndexes[]
  * Slots[]
  
  * slotNumber
  * wordNumber
  
  * wrongwords
  * correctprec
  */

var correctwords = 0;
var attempts = 0;
var n = 0;

$( init );

function init(words) {

  // Hide the success message
  $('#successMessage').hide();
  $('#successMessage').css( {
  } );

  // Reset the game
  correctwords = 0;
  attempts = 0;
  $(".attempts").html( '' );
  $(".corrects").html( '' );
  $(".answers").html( '' );
  $('#wordPile').html( '' );
  $('#wordSlots').html( '' );

  // Create words
  //var words = [ "Yksi", "Kaksi", "Kolme", "Neljä", "Viisi"];
  var data = getData();
  var words = data.words;
  var Slots = data.slots;

  n = words.length;


  for ( var i = 0; i < n; i++ ) { 
    if(words[i].indexOf("<img") != -1){ 
      $("#wordSlots").addClass("img");
      $("#wordPile").addClass("img");
    }
    if(Slots[i].indexOf("img") != -1){ 
      $("#wordSlots").addClass("img");
      $("#wordPile").addClass("img");
    }
  }

  // Create posvalue for words
  var wordsPos = [];
  for (var i = 0; i <= n; i++){wordsPos.push(i+1);}

  // Random index
  var randomIndexes = [];
  for (var i=0; i < n; i++) {
     randomIndexes[i] = i;
  }
  randomIndexes.sort(function() { return (Math.round(Math.random())-0.5); });

  // Add words in random order
  for ( var i = 0; i < n; i++ ) {
    $('<div>' + words[randomIndexes[i]] + '</div>').data( 'word', wordsPos[randomIndexes[i]] ).attr( 'id', 'word'+words[randomIndexes[i]] ).appendTo( '#wordPile' ).draggable( {
      containment: '',
      stack: '#wordPile div',
      cursor: 'move',
      revert: true
    } );
  }

  // Create the word slots
  //var Slots = [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten' ];

  // Add the words
  for ( var i=1; i<=n; i++ ) {
    $('<div>' + Slots[i-1] + '</div>').data( 'word', i ).appendTo( '#wordSlots' ).droppable( {
      accept: '#wordPile div',
      hoverClass: 'hovered',
      drop: handlewordDrop
    } );
  }

}

// DropEventHandler
function handlewordDrop( event, ui ) {
  var n = window.n; // Gets the number of words
  var slotNumber = $(this).data( 'word' );
  var wordNumber = ui.draggable.data( 'word' );

  attempts=attempts+1; // Adds to the attempts counter

  // If the word was dropped to the correct slot,
  // change the word colour, position it directly
  // on top of the slot, and prevent it being dragged
  // again

  if ( slotNumber == wordNumber ) {
    ui.draggable.addClass( 'correct' );
    ui.draggable.draggable( 'disable' );
    $(this).droppable( 'disable' );
    ui.draggable.position( { my: 'left center', at: 'left center', of: $(this) } );
    ui.draggable.draggable( 'option', 'revert', false );
    correctwords++;
  } 

  var wrongwords = attempts-correctwords; // Number of wrong answers
  var correctprec = Math.round(correctwords/attempts*100); // Precent of correct answers

  // Show how many times user has answered and what precent of the answers are correct
  $(".answers").html(' Answers: ' +correctwords+'/'+n);
  $(".attempts").html(' Wrong: ' +wrongwords);  
  $(".corrects").html(' Correct: ' +correctprec+'%');
  

  // If all the words have been placed correctly
  if ( correctwords == n ) {
    $('#successMessage').html('<h2>Correct: '+correctprec+'%</h2><button onclick="init()">Play Again</button>');
    $('#successMessage').show();
    $('#successMessage').animate( {
      opacity: 1
    } );
  }
}
