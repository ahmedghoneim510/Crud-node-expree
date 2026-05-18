require('dotenv').config();

const app = require('./app');
const config = require('./config');
const connectDB = require('./config/db');

const startServer = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
  });
};

startServer();
