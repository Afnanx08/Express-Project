const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');
require("dotenv").config();

const cors = require("cors");

connectDb();
const app = express();

const port = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || ''
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/contacts', require('./routes/contractsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
