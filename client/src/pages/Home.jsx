import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Home = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/games").then((response) => {
      setGames(response.data);
    });
  }, []);

  const startNewGame = () => {
    axios
      .post("http://localhost:5000/api/start-game", { player1, player2 })
      .then((response) => {
        navigate("/game", { state: { gameId: response.data._id, player1, player2 } });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-6">Tic Tac Ohhh</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="px-4 py-2 border rounded-lg mb-2"
        />
        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="px-4 py-2 border rounded-lg mb-2"
        />
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          onClick={startNewGame}
        >
          Start New Game
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Previous Games</h2>
      <ul>
        {games.map((game) => (
          <li key={game._id}>
            {game.player1} vs {game.player2} - Rounds: {game.rounds.length}
          </li>
        ))}
      </ul>
    </div>
  );
};
