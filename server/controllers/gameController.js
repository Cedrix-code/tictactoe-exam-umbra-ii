import Game from '../models/gameModel.js';

export const startGame = async (req, res) => {
  const { player1, player2 } = req.body;
  const newGame = new Game({ player1, player2, rounds: [] });
  await newGame.save();
  res.json(newGame);
};

export const recordRound = async (req, res) => {
  const { gameId, winner, draw } = req.body;
  const game = await Game.findById(gameId);
  game.rounds.push({ winner, draw });
  await game.save();
  res.json(game);
};

export const endGame = async (req, res) => {
  const { gameId } = req.body;
  const game = await Game.findById(gameId);
  res.json(game);
};

export const getGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};