const express = require('express');
const morgan = require('morgan');
const router = require('./router');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(morgan('tiny'));

const port = 3000; // Choose a port number

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

app.use('/api', router);
