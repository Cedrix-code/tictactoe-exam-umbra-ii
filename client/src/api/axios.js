import axios from "axios";

const api = axios.create({
  baseURL: `https://tictactoe-exam-umbra-ii-server.onrender.com/api`, // Add /api to match server routes
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
