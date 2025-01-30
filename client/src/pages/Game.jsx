import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId, player1, player2 } = location.state;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer === player1 ? "X" : "O";
    setBoard(newBoard);
    checkWinner(newBoard);
    setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(currentPlayer);
        axios.post("http://localhost:5000/api/record-round", {
          gameId,
          winner: currentPlayer,
          draw: false,
        });
        return;
      }
    }
    if (board.every((cell) => cell)) {
      setWinner("Draw");
      axios.post("http://localhost:5000/api/record-round", {
        gameId,
        winner: null,
        draw: true,
      });
    }
  };

  const handleContinue = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer(player1);
  };

  const handleStop = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-3xl font-bold mb-4">Game Session</h2>
      <div className="grid grid-cols-3 gap-2 w-64">
        {board.map((cell, index) => (
          <button
            key={index}
            className="w-20 h-20 text-2xl border border-gray-500 flex items-center justify-center"
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-4">
          <h3 className="text-2xl font-bold mb-4">
            {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
          </h3>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg mr-2"
            onClick={handleContinue}
          >
            Continue
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg"
            onClick={handleStop}
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
