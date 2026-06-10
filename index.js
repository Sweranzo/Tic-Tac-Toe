function createPlayer (name,marker) {
    return {
        name,
        marker
    }
}

const gameBoard = (function () {
    let board = ["","","",
                "","","",
                 "","","",]

    function getBoard (){
        return board;
    }

    function placeMarker (index,marker) { 
        if(board[index] !== "") {
            return false;
        } board[index] = marker; 
            return true;
        
    }

    function resetBoard()
    {
        board = ["","","","","","","","","",];
    }

    return{
        getBoard,
        placeMarker,
        resetBoard
    }

})()

const gameController = (function(){
let players = [];
let playersIndexPosition = 0;   
let gameOver = true;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
    ];

    function startGame (player1, player2){
        gameBoard.resetBoard();

        players = [createPlayer(player1, "X"),
                    createPlayer(player2, "O")];

        playersIndexPosition = 0;           
        gameOver = false;

        return "Game Started." +" "+ getCurrentPlayer().name + "'s turn.";
                
    }

    function getCurrentPlayer(){
        return players[playersIndexPosition];
    }

    function switchPlayer(){
        playersIndexPosition = playersIndexPosition === 0 ? 1 : 0; 
    }

    function playRound(index){

        if(gameOver === true) {
            return "the game is already over. start a new game";
        }
       
        const currentPlayer =  getCurrentPlayer();
        const moveIsSuccessful = gameBoard.placeMarker(index,currentPlayer.marker);
        
        

        if(moveIsSuccessful === false) {
            return 'This spot is already taken.';
        } 

        if(checkWinner(currentPlayer.marker) === true){
            gameOver = true;
            return currentPlayer.name +" "+ "wins!";
            
        }

        if(checkTie()=== true){
             gameOver = true;
            return "its a tie";
           
        }

        switchPlayer();
        return "Move was successful." +" "+ `Now its ${getCurrentPlayer().name}'s return`;

       
        
    }

    

    function checkWinner(marker) {
    const board = gameBoard.getBoard();

    for (let i = 0; i < winningCombinations.length; i++) {
        const combination = winningCombinations[i];

        if (
            board[combination[0]] === marker &&
            board[combination[1]] === marker &&
            board[combination[2]] === marker
        ) {
            return true;
        }
    }

    return false;
    }

    function checkTie(){
        const board = gameBoard.getBoard(); 
        return board.every((boxes) => boxes !== "");   
        
    }

    return{
        startGame,
        playRound,
        getCurrentPlayer
        
    }



})()



    const displayController = (function () {
    const cells = document.querySelectorAll(".cell");
    const message = document.querySelector("#message");
    const startBtn = document.querySelector("#startBtn");
    const playerOneInput = document.querySelector("#playerOne");
    const playerTwoInput = document.querySelector("#playerTwo");

    function renderBoard() {
        const board = gameBoard.getBoard();

        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = board[i];
        }
    }

    function setMessage(text) {
        message.textContent = text;
    }

    function handleStartClick() {
        const playerOneName = playerOneInput.value || "Player 1";
        const playerTwoName = playerTwoInput.value || "Player 2";

        const result = gameController.startGame(playerOneName, playerTwoName);

        renderBoard();
        setMessage(result);
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;

        const result = gameController.playRound(index);

        renderBoard();
        setMessage(result);
    }

    function addEventListeners() {
        startBtn.addEventListener("click", handleStartClick);

        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", handleCellClick);
        }
    }

    addEventListeners();

    return {
        renderBoard,
        setMessage
    };
})();