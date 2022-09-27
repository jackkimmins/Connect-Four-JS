//Randomly pick starting player
let currentPlayer = Math.random() < 0.5 ? 'blue' : 'red';
let gameWinner = "NONE";
let autoPlay = false;

//Function to populate the cells with the column number
const AddColNumsAttr = () => {
    const cells = $('.cell');

    for (let i = 0; i < 7; i++)
        for (let j = 0; j < 6; j++)
            cells[i + j * 7].setAttribute('data-col', i);
}

// Get the column number of the provided cell
const GetColNum = (cell) => {
    return parseInt(cell.getAttribute('data-col'));
}

// Set the status indicator and colour to match the current player
const SetStatusIndicator = (status) => {
    $('#turn').text(status.charAt(0).toUpperCase() + status.slice(1)).css('color', status);
}

//Check if the game has been won, return "NONE" if not
function CheckForWinner()
{
    const cells = $('.cell');

    //Check for vertical wins
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 6; j++)
        {
            const cell = cells[i * 7 + j];
            const player = cell.getAttribute('data-player');

            if (player !== null &&
                player === cells[(i + 1) * 7 + j].getAttribute('data-player') &&
                player === cells[(i + 2) * 7 + j].getAttribute('data-player') &&
                player === cells[(i + 3) * 7 + j].getAttribute('data-player'))
            {
                return player;
            }
        }
    }

    //Check for horizontal wins
    for (let i = 0; i < 6; i++)
    {
        for (let j = 0; j < 4; j++)
        {
            const cell = cells[i * 7 + j];
            const player = cell.getAttribute('data-player');

            if (player !== null &&
                player === cells[i * 7 + j + 1].getAttribute('data-player') &&
                player === cells[i * 7 + j + 2].getAttribute('data-player') &&
                player === cells[i * 7 + j + 3].getAttribute('data-player'))
            {
                return player;
            }
        }
    }

    //Check for diagonal win from top left to bottom right
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 4; j++)
        {
            const cell = cells[i * 7 + j];
            const player = cell.getAttribute('data-player');

            if (player !== null &&
                player === cells[(i + 1) * 7 + j + 1].getAttribute('data-player') &&
                player === cells[(i + 2) * 7 + j + 2].getAttribute('data-player') &&
                player === cells[(i + 3) * 7 + j + 3].getAttribute('data-player'))
            {
                return player;
            }
        }
    }

    //Check for diagonal win from bottom left to top right
    for (let i = 3; i < 6; i++)
    {
        for (let j = 0; j < 4; j++)
        {
            const cell = cells[i * 7 + j];
            const player = cell.getAttribute('data-player');

            if (player !== null &&
                player === cells[(i - 1) * 7 + j + 1].getAttribute('data-player') &&
                player === cells[(i - 2) * 7 + j + 2].getAttribute('data-player') &&
                player === cells[(i - 3) * 7 + j + 3].getAttribute('data-player'))
            {
                return player;
            }
        }
    }


    return "NONE";
}

//Place a piece in the column of the provided cell, the chip will fall to the bottom of the column
function PlaceChip(cell) {
    const colNum = GetColNum(cell);
    const col = $(`.cell[data-col="${colNum}"]`);
    const emptyCell = col.filter((i, c) => c.innerHTML === '');

    if (emptyCell.length === 0) return;

    const selectedCell = emptyCell[emptyCell.length - 1];

    selectedCell.setAttribute('data-player', currentPlayer);
    selectedCell.innerHTML = `<div class="circle colour-${currentPlayer}"></div>`;

    currentPlayer = currentPlayer === 'blue' ? 'red' : 'blue';

    SetStatusIndicator(currentPlayer);
}

$('#grid').click(function(e) {
    if (gameWinner !== "NONE") location.reload();

    const cell = e.target.closest('.cell');
    if (cell) {
        PlaceChip(cell);
    }

    gameWinner = CheckForWinner();

    if (gameWinner !== "NONE") {

        //Play ding.mp3
        new Audio('ding.mp3').play();

        $('#status').text(`${gameWinner} wins!`).css('color', gameWinner);
    }
});

//Cell hover effect
$('.cell').hover(function() {
    //Set the .hover call to the other cells that are in the same column
    const colNum = GetColNum(this);

    const col = $(`.cell[data-col="${colNum}"]`);
    const emptyCell = col.filter((i, c) => c.innerHTML === '');

    for (let i = 0; i < emptyCell.length; i++)
        emptyCell[i].classList.add('hover');

}, function() {
    $('.cell').removeClass('hover');
});

$('#btnRestart').click(function() {
    location.reload();
});

//#autoplay
$('#autoplay').click(function() {
    if ($(this).is(':checked'))
    {
        localStorage.setItem('autoplay', true);
        autoPlay = true;
    }
    else
    {
        localStorage.setItem('autoplay', false);
        autoPlay = false;
    }
});

$(document).ready(function() {
    AddColNumsAttr();
    SetStatusIndicator(currentPlayer);

    if (localStorage.getItem('autoplay') === 'true')
    {
        $('#autoplay').prop('checked', true);
        autoPlay = true;
    }
});

setInterval(function() {
    if (autoPlay)
    {
        if (gameWinner !== "NONE")
        {
            new Audio('ding.mp3').play();
    
            $('#status').text(`${gameWinner} wins!`).css('color', gameWinner);
    
            setTimeout(function() {
                location.reload();
            }, 3000);
        }
        else
        {
            const emptyCells = $('.cell').filter((i, c) => c.innerHTML === '');
    
            if (emptyCells.length === 0) location.reload();
        
            PlaceChip(emptyCells[Math.floor(Math.random() * emptyCells.length)]);
        
            gameWinner = CheckForWinner();
        }
    }
}, 500);