
// Selektoren für die HTML-Elemente
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('#start-button'),
    win: document.querySelector('.win'),
    difficulty: document.querySelector('#difficulty-select')
}

// Spielzustand
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    difficulty: 4 // Default difficulty
}

// Funktionen
// Mischen des Arrays, sprich die Karten werden zufällig angeordnet
const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

// Zufällige Auswahl von Elementen aus einem Array, sprich die Karten werden zufällig ausgewählt
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

// Generieren des Spiels
const generateGame = () => {

    // Dimension des Spielfelds
    const dimension = parseInt(selectors.difficulty.value);

    // Überprüfen, ob die Dimension eine gerade Zahl ist
    if (dimension % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    // Emojis, die auf den Karten angezeigt werden
    const emojis = [
        '😀', '😊', '😎', '🥳', '🤩', '😍', '🤪', '😜', '🤔', '🤓',
        '🙌', '👏', '👍', '🤙', '👌', '✌️', '🤞', '🤟', '🤘', '👊',
        '🖐️', '🙏', '🤝', '💪', '👈', '👉', '👆', '👇', '👋', '💃',
        '🕺', '🙈', '🙉', '🙊', '💥', '💦', '🔥', '💫', '⭐', '🌟',
        '✨', '🌈', '☀️', '🌤️', '⛅', '🌦️', '☁️', '🌧️', '⛈️', '🌩️',
        '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '🌍',
        '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'
    ];

    // Zufällige Auswahl von Emojis
    const picks = pickRandom(emojis, (dimension * dimension) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimension}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
        </div>
    `;

    selectors.board.innerHTML = cards;
}

// Starten des Spiels
const startGame = () => {
    if (state.gameStarted) {
        resetGame();
        generateGame();
        return;
    }

    state.gameStarted = true;

    state.loop = setInterval(() => {
        state.totalTime++;

        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
}

// Zurücksetzen des Spiels
const resetGame = () => {
    state.gameStarted = false;
    selectors.start.textContent = 'Start / New Game';
    selectors.board.innerHTML = '';
    selectors.moves.innerText = '0 moves';
    selectors.timer.innerText = 'time: 0 sec';
    clearInterval(state.loop);
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;
}

// Umkehren der Karten, falls sie nicht übereinstimmen
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });

    state.flippedCards = 0;
}

// 
const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame();
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    // Überprüfen, ob alle Karten übereinstimmen
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `;

            clearInterval(state.loop);
        }, 1000);
    }
}

// Hinzufügen von Event-Listenern
const attachEventListeners = () => {

    // Starten des Spiels, wenn der Start-Button geklickt wird
    selectors.start.addEventListener('click', () => {
        startGame();
    });

    // Zurücksetzen des Spiels, wenn der Reset-Button geklickt wird
    selectors.difficulty.addEventListener('change', () => {
        state.difficulty = parseInt(selectors.difficulty.value);
        resetGame();
        generateGame();
    });

    // Umkehren der Karten, wenn eine Karte geklickt wird
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        }
    });
}

// Generieren des Spiels
generateGame();
// Hinzufügen von Event-Listenern
attachEventListeners();
