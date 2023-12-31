const express = require('express');
const morgan = require('morgan');
const router = require('./router');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

app.use('/api', router);

module.exports = app;
