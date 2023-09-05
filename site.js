document.getElementById('newcard').addEventListener('click', function(e) {
    e.preventDefault();
    showNewCard();

    
});

function attachEventListeners(card) {
    let isResizing = false, isDragging = false, isRotated = false;
    let startX, startY, offsetX, offsetY, startScale = 1;

    const resizeIcon = card.querySelector('.resize-icon');

    resizeIcon.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    });

    card.addEventListener('mousedown', (e) => {
        if (!isResizing) {
            isDragging = true;
            offsetX = e.clientX - card.getBoundingClientRect().left;
            offsetY = e.clientY - card.getBoundingClientRect().top;
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        }
    });

    document.addEventListener('dblclick', (e) => {
        if (!e.target.classList.contains('draggable-resizable')) {
            // Exit the function if the double-clicked target doesn't have class 'draggable-resizable'
            return;
        }
    
        rotateDiv(e.target);
    });

    function rotateDiv(card) {
        // Extract current scale from transform property.
        const matches = card.style.transform.match(/scale\(([^)]+)\)/);
        const currentScale = matches ? matches[1] : 1;
        const isRotated = card.getAttribute('data-rotated') === 'true';
        card.style.transition = 'transform 0.3s';
        // Use the currentScale together with the rotate transformation
        card.style.transform = isRotated ? `scale(${currentScale})` : `scale(${currentScale}) rotate(90deg)`;
        card.setAttribute('data-rotated', !isRotated);
    }
    

    function doResize(e) {
        if (isResizing) {
            const scaleChange = (e.clientX - startX + e.clientY - startY) / 200;
            const newScale = startScale + scaleChange;
            card.style.transform = `scale(${newScale})${isRotated ? ' rotate(90deg)' : ''}`;
        }
    }

    function stopResize() {
        isResizing = false;
        startScale = parseFloat(card.style.transform.match(/scale\(([^)]+)\)/)[1] || '1');
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
    }

    function doDrag(e) {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
        }
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
    }
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
  attachEventListeners(newCard);
  };
  
  const getNewCard = async () => {
    const newCard = await fetchCard().catch(handleErrors);
    await showCard(newCard).catch(handleErrors);
  };
  
  const showNewCard = async () => {
    await getNewCard();
    
  }

  attachEventListeners(document.getElementById('frank'))







  let selecting = false;
  let justFinishedSelecting = false;  // New flag
  let startX, startY;
  let selectedCards = [];
  let selectionArea = null;
  let multiSelectMode = false;
  let didDrag = false;

  
  document.addEventListener('mousedown', (e) => {
      if (e.target.closest('.draggable-resizable') || e.target.closest("#menu-bar")) {
          return;
      }
  
      deselectAllCards();
  
      selecting = true;
      startX = e.clientX;
      startY = e.clientY;
  
      selectionArea = document.createElement('div');
      selectionArea.className = 'selection-area';
      selectionArea.style.left = `${startX}px`;
      selectionArea.style.top = `${startY}px`;
      document.body.appendChild(selectionArea);
      didDrag = false;
  });

  document.addEventListener('mousemove', (e) => {
    if (!selecting) return;

    didDrag = true;  // This indicates a drag action occurred.

    // Determine the boundaries of the selection area
    const selectionLeft = Math.min(e.clientX, startX);
    const selectionRight = Math.max(e.clientX, startX);
    const selectionTop = Math.min(e.clientY, startY);
    const selectionBottom = Math.max(e.clientY, startY);

    const cards = document.querySelectorAll('.draggable-resizable');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (
            selectionLeft < rect.right &&
            selectionRight > rect.left &&
            selectionTop < rect.bottom &&
            selectionBottom > rect.top
        ) {
            if (!selectedCards.includes(card)) {
                card.style.boxShadow = '0px 0px 10px 3px green';
                selectedCards.push(card);
            }
        } else {
            const index = selectedCards.indexOf(card);
            if (index > -1) {
                card.style.boxShadow = '';
                selectedCards.splice(index, 1);
            }
        }
    });

    // Adjust the selection rectangle
    selectionArea.style.width = `${Math.abs(e.clientX - startX)}px`;
    selectionArea.style.height = `${Math.abs(e.clientY - startY)}px`;
    selectionArea.style.left = `${selectionLeft}px`;
    selectionArea.style.top = `${selectionTop}px`;
});


document.addEventListener('mouseup', () => {
    selecting = false;
    if (selectionArea) {
        document.body.removeChild(selectionArea);
        selectionArea = null;
    }
    if (didDrag) {
        justFinishedSelecting = true;  // Only set this if a drag action took place
    }
    updateMenuVisibility();
});

function deselectAllCards() {
    selectedCards.forEach(card => {
        card.style.boxShadow = '';
    });
    selectedCards = [];
    updateMenuVisibility();
}

document.addEventListener('click', (e) => {
    if (justFinishedSelecting) {
        justFinishedSelecting = false;
        return;
    }

    const card = e.target.closest('.draggable-resizable');

    if (multiSelectMode && card) {
        toggleCardSelection(card);
        updateMenuVisibility();
        return;
    }

    // This part checks if you clicked outside of any draggable-resizable element or menu-bar
    if (!card && !selecting && !e.target.closest('#menu-bar') && !e.target.closest('#multi-select-button')) {
        deselectAllCards();
    }
});

function updateMenuVisibility() {
    const menuBar = document.getElementById('menu-bar');
    if (selectedCards.length > 0) {
        menuBar.style.display = 'block';
    } else {
        menuBar.style.display = 'none';
    }
}


document.getElementById('tap-button').addEventListener('click', () => {
    selectedCards.forEach(card => {
        const isRotated = card.getAttribute('data-rotated') === 'true';
        card.style.transition = 'transform 0.3s'; 
        card.style.transform = isRotated ? 'none' : 'rotate(90deg)';
        card.setAttribute('data-rotated', !isRotated);
    });
});

document.getElementById('multi-select-button').addEventListener('click', () => {
    multiSelectMode = !multiSelectMode; 
    updateMultiSelectButtonText();
    if (!multiSelectMode) deselectAllCards();
});

function updateMultiSelectButtonText() {
    const btn = document.getElementById('multi-select-button');
    btn.textContent = multiSelectMode ? 'Exit Multi-Select' : 'Multi-Select';
}

function toggleCardSelection(card) {
    if (selectedCards.includes(card)) {
        const index = selectedCards.indexOf(card);
        selectedCards.splice(index, 1);
        card.style.boxShadow = '';
    } else {
        selectedCards.push(card);
        card.style.boxShadow = '0px 0px 15px 2px green';
    }
}

// Modify the counter by a given adjustment
function adjustSelectedCards(adjustment) {
    selectedCards.forEach(card => {
        let counterDiv = card.querySelector('.counter-div');

        if (counterDiv) {
            // Adjust the existing counter
            adjustCounter(counterDiv, adjustment);
        } else {
                counterDiv = createNewCounterDiv();
                card.appendChild(counterDiv);
                adjustCounter(counterDiv, adjustment);
        }
    });
}

// Create and return a new counter div container
function createNewCounterDiv() {
    const counterDiv = document.createElement('div');
    counterDiv.className = 'counter-div';

    const plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.onclick = function() {
        adjustCounter(counterDiv, 1);
    };

    const minusButton = document.createElement('button');
    minusButton.textContent = '-';
    minusButton.onclick = function() {
        adjustCounter(counterDiv, -1);
    };

    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = '0/0';

    counterDiv.appendChild(minusButton);
    counterDiv.appendChild(counter);
    counterDiv.appendChild(plusButton);

    return counterDiv;
}

function adjustCounter(counterDiv, adjustment) {
    const counter = counterDiv.querySelector('.counter');
    const numbers = counter.textContent.split('/');
    const adjusted = numbers.map(num => {
        const newValue = parseInt(num) + adjustment;
        return newValue > 0 ? `+${newValue}` : newValue;
    });
    counter.textContent = adjusted.join('/');
}


document.getElementById('global-increment-button').addEventListener('click', () => adjustSelectedCards(1));
document.getElementById('global-decrement-button').addEventListener('click', () => adjustSelectedCards(-1));
