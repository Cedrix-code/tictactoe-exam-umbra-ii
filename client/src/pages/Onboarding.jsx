import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PlayerSelection from '../components/PlayerSelection';

function Onboarding() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/users');
        setUsers(response.data || []);
      } catch (error) {
        const errorMessage = error.response?.status === 404
          ? 'No users found. Be the first to play!'
          : 'Failed to load users. Please try again later.';
        setError(errorMessage);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const startGame = async () => {
    if (!player1 || !player2) {
      setError('Please enter both player names');
      return;
    }

    try {
      setError(null);
      const response = await api.post('/start-game', {
        player1Name: player1,
        player2Name: player2,
      });

      navigate('/game', { 
        state: { 
          player1, 
          player2 
        } 
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start game. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <main>
      <h1 className="text-gradient pt-4">Tic Tac Ohh</h1>
      <div className="wrapper flex items-center justify-center">
        <div className="bg-dark-100 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-center">Welcome Aboard!</h2>
          
          {loading && <div className="text-center">Loading users...</div>}
          
          {error && (
            <div className="bg-red-400/20 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}

          {!loading && (
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
                className="w-full text-white py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all animate-bounce focus:animate-none hover:animate-none"
                disabled={!player1 || !player2}
              >
                Start Game
              </button>
              
              <button
                onClick={handleBack}
                className="w-full text-white py-2 bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition-all"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Onboarding;