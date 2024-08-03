const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
// const connectDb = require('./config/dbConnection');
require("dotenv").config();

// connectDb(); // Commented out to bypass database connection
const app = express();

const port = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  '*'
];

// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.FRONTEND_URL === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true
};

// Use CORS middleware with the defined options
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/contacts', require('./routes/contractsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
