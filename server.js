import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import router from './app/routes';
import addTables from './app/db/db';

const swaggerDocument = YAML.load(path.join(process.cwd(), './swagger/swagger.yaml'));

addTables();
dotenv.config();

// create express app
const app = express();
// const entries = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router(app);

// listen for requests
const server = app.listen(process.env.PORT || 5000, () => {
  // console.log('Server is listening on port 5000');
});

// module.exports = [server, array];
export default server;
