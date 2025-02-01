import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables for debugging
console.log('MONGODB_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// CORS Configuration
const allowedOrigins = [
  'https://tictacohh-ii-client.onrender.com',
  'http://localhost:5173', // React dev server
  'http://localhost:5000'  // Express server
];

const corsOptions = {
  origin: 'https://tictacohh-ii-client.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Adjust as needed
  allowedHeaders: ['Content-Type', 'Authorization'], // Adjust as needed
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URl is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

export default app;

