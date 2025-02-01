import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PlayerSelection from '../components/PlayerSelection';

function Onboarding() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const startGame = async () => {
    if (!player1 || !player2) {
      alert('Please enter both player names');
      return;
    }

    try {
      const response = await api.post('/start-game', {
        player1Name: player1,
        player2Name: player2,
      });

      const gameId = response.data._id;
      navigate(`/game/${gameId}`, { state: { player1, player2 } });
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-dark-100 p-8 rounded-lg shadow-lg w-96">
          <div className="space-y-4">
            <PlayerSelection
              users={users}
              player1={player1}
              setPlayer1={setPlayer1}
              player2={player2}
              setPlayer2={setPlayer2}
            />
            
            <button
              onClick={startGame}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!player1 || !player2}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Onboarding;