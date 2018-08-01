import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import router from './app/routes';

dotenv.config();
const dbConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(dbConfig);

// create express app
const app = express();
// const entries = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
router(app, pool);
// require('./app/routes')(app, array);

// listen for requests
const server = app.listen(process.env.PORT || 5000, () => {
  // console.log('Server is listening on port 5000');
});

// module.exports = [server, array];
export { server, pool };
