$(document).ready(function () {

    $('#newcard').on('click', function(e) {
        e.preventDefault();
        showNewCard();
    });

    function attachEventListeners($card) {
        let isRotated = false;

        // Make card draggable
        $card.draggable();

        // Make card resizable using the bottom right corner
        $card.resizable({
            handles: {
                'se': $card.find('.resize-icon')
            }
        });

        $card.on('dblclick', function() {
            const currentScale = parseFloat($card.css("transform").split(',')[3]) || 1;
            isRotated = $card.attr('data-rotated') === 'true';
            
            $card.css({
                'transition': 'transform 0.3s',
                'transform': isRotated ? `scale(${currentScale})` : `scale(${currentScale}) rotate(90deg)`
            });

            $card.attr('data-rotated', !isRotated);
        });
    }



// Display promise errors
const handleErrors = (err) => {
    console.log('Oh no, something went wrong!');
    console.log(err);
  };

  
const fetchCard = async () => {
    const res = await fetch("https://api.scryfall.com/cards/random?q=is%3Acommander");
    const data = await res.json();
    return data;
  };
  
  const showCard = async (card) => {
  // Create the new card
  const newCard = document.createElement('div');
  newCard.classList.add('draggable-resizable');

  // Optionally add an image or other contents to the card here
  const img = document.createElement('img');
  img.src = card.image_uris.normal; // replace with your image path
  img.alt = 'Your Image';
  img.draggable = false;

  const resizeIcon = document.createElement('div');
  resizeIcon.classList.add('resize-icon');

  newCard.appendChild(img);
  newCard.appendChild(resizeIcon);
  
  document.body.appendChild(newCard);

  // Hook up the event listeners to the new card
  attachEventListeners($(newCard));
  };
  
  const getNewCard = async () => {
    const newCard = await fetchCard().catch(handleErrors);
    await showCard(newCard).catch(handleErrors);
  };
  
  const showNewCard = async () => {
    await getNewCard();
    
  }

})