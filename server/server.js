import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes/router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('dist'));

app.use(cors());
// Log environment variables for debugging
console.log('MONGODB_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

// CORS Configuration
const ALLOWED_ORIGINS = [
  'https://tictacohh-ii-client.onrender.com',
  'http://localhost:5173', // React dev server
  'http://localhost:4000'  // Express server
];

app.use(
  cors({ 
    origin: 'https://tictacohh-ii-client.onrender.com' || 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/api', routes);

// Global headers middleware
app.use('/api/games',(req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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

