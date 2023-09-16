$(document).ready(function () {

  $('body').on('click', function (e) {
    if (e.target === this) {
      $('.icon-menu').css('opacity', '0');
    }
  });

 $(body).on('click touchstart', '#newcard', function() { 
  e.preventDefault();
    showNewCard();
}); 
  
  $('#newcard').on('click touchstart', function (e) {
    e.preventDefault();
    showNewCard();
  });

  let currentZIndex = 0;

  function attachEventListeners(card) {
    let isRotated = false;

    const position = { x: 0, y: 0 };


    interact(card)
      .draggable({
        listeners: {
          move(event) {
            position.x += event.dx;
            position.y += event.dy;

            // Use top and left for positioning
            event.target.style.left = `${position.x}px`;
            event.target.style.top = `${position.y}px`;
          },

          start(event) {
            // Increase the z-index and assign to the element when it's clicked/dragged
            currentZIndex++;
            event.target.style.zIndex = currentZIndex;
          }
        }
      })
      .resizable({
        edges: { bottom: true, right: true },
        listeners: {
          move: function (event) {
            let x = (parseFloat(event.target.style.left) || 0) + event.deltaRect.left;
            let y = (parseFloat(event.target.style.top) || 0) + event.deltaRect.top;

            Object.assign(event.target.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              left: `${x}px`,
              top: `${y}px`
            });
          }
        },
        modifiers: [
          interact.modifiers.aspectRatio({
            ratio: 'preserve',
            modifiers: [
              interact.modifiers.restrictSize({ max: 'parent' }),
            ]
          })
        ]
      });




    $(card).on('dblclick', function () {
      tap($(this))
    });
  }

  function tap($card) {
    const currentScale = parseFloat($card.css("transform").split(',')[3]) || 1;
    const isRotated = $card.attr('data-rotated') === 'true';

    // Continue to rotate the card as per the original behavior
    $card.css({
      'transition': 'transform 0.3s',
      'transform': isRotated ? `scale(${currentScale})` : `scale(${currentScale}) rotate(90deg)`
    });

    // Get the icon-menu inside the card
    const $iconMenu = $card.find('.icon-menu');

    // Move and rotate the icon-menu
    $iconMenu.css({
      'transform-origin': 'top left',
      'transform': isRotated ? 'rotate(0deg) translateY(0)' : `rotate(-90deg) translateY(${($card.width())}px)`,
      'width': isRotated ? '100%' : `${($card.height() - $iconMenu.height())}px`
    });

    $card.attr('data-rotated', !isRotated);
  }

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
    const newCard = document.createElement('div');
    newCard.classList.add('draggable-resizable');
    newCard.style.position = 'absolute'; // To allow the usage of top and left properties



    const img = document.createElement('img');
    img.src = `${Math.floor(Math.random() * (9 - 0 + 1)) + 0}.jpg`;
    img.alt = 'Your Image';
    img.draggable = false;


    newCard.appendChild(img);

    const menu = document.createElement('div');
    menu.classList.add('icon-menu');
    menu.style.opacity = '0';  // Initially hidden
    menu.style.transition = 'opacity 0.3s';  // Fade effect

    const btnTap = document.createElement('button');
    btnTap.innerText = '⤵';
    menu.appendChild(btnTap);
    btnTap.addEventListener('click', function () {
      tap($(this).closest('.draggable-resizable'))
    });

    const btnCopy = document.createElement('button');
    btnCopy.innerText = 'Clone';
    menu.appendChild(btnCopy);

    btnCopy.addEventListener('click', function () {
      document.body.removeChild(newCard);
    });

    const btnKill = document.createElement('button');
    btnKill.innerText = '💀';
    menu.appendChild(btnKill);

    btnKill.addEventListener('click', function () {
      document.body.removeChild(newCard);
    });

    newCard.appendChild(menu);
    newCard.addEventListener('click', function (e) {
      currentZIndex++;
      this.style.zIndex = currentZIndex;

      // Toggle menu visibility
      menu.style.opacity = 1;//(menu.style.opacity === '0' ? '1' : '0');

      e.stopPropagation();  // To prevent the global click listener from hiding the menu immediately
    });
    document.body.appendChild(newCard);
    attachEventListeners(newCard);
  };

  const getNewCard = async () => {
    // const newCard = await fetchCard().catch(handleErrors);
    let newCard = ''
    await showCard(newCard).catch(handleErrors);
  };

  const showNewCard = async () => {
    await getNewCard();
  }

});
