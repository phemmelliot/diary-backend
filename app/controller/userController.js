import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/pool';
import { validateEmail, validatePassword } from './validate';

dotenv.config();

const badRequest = { status: 400, message: 'Bad Request' };


const loginQuery = (req, res, login) => {
  pool.query('SELECT * FROM users WHERE email = ($1)', [req.body.email], (error, dbRes) => {
    if (error) {
      const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not Log User in' };
      res.status(500).send(replyServer);
    } else {
      const reply = { status: '401', message: 'Auth failed' };
      if (dbRes.rows[0] === undefined) {
        res.status(401).send(reply);
      } else {
        bcrypt.compare(req.body.password, dbRes.rows[0].password,
          (bcryptError, bcryptRes) => {
            if (bcryptError) {
              res.status(401).send(reply);
            } else if (bcryptRes) {
              const token = jwt.sign(
                {
                  email: dbRes.rows[0].email,
                  userId: dbRes.rows[0].user_id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: '1h',
                },
              );
              if (login) {
                const replyGood = { status: '200', message: 'User Logged In Successfully' };
                replyGood.token = token;
                replyGood.user_id = dbRes.rows[0].user_id;
                res.status(200).send(replyGood);
              } else {
                const replyCreate = { status: '201', message: 'User Created Successfully' };
                replyCreate.token = token;
                replyCreate.user_id = dbRes.rows[0].user_id;
                res.status(201).send(replyCreate);
              }
            } else {
              res.status(401).send(reply);
            }
          });
      }
    }
  });
};

const logIn = (req, res) => {
  req.body.email.trim();
  req.body.password.trim();
  if (req.body.email == null || req.body.password == null || req.body.email === '' || req.body.password === '') {
    badRequest.description = 'Email or password field cannot be empty';
    res.status(400).send(badRequest);
  } else if (validateEmail(req.body.email) && validatePassword(req.body.password)) {
    loginQuery(req, res, true);
  } else if (!validateEmail(req.body.email) || !validatePassword(req.body.password)) {
    const replyServer = { status: '400', message: 'Invalid email or password' };
    res.status(400).send(replyServer);
  }
};


const createUser = (req, res) => {
  req.body.email.trim();
  req.body.password.trim();
  req.body.username.trim();
  if (req.body.email == null || req.body.password == null || req.body.username == null || req.body.email === '' || req.body.password === '' || req.body.username === '') {
    badRequest.description = 'Email, password or username field cannot be empty';
    res.status(400).send(badRequest);
  } else {
    pool.query('SELECT * FROM users WHERE email = ($1)', [req.body.email], (error, dbRes) => {
      if (error) {
        const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not create user' };
        res.status(500).send(replyServer);
      } else {
        const reply = { status: '200', message: 'User Already exists' };
        if (dbRes.rows[0] === undefined) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.status(500).json({
                error: err,
              });
            } else if (validateEmail(req.body.email) && validatePassword(req.body.password)) {
              pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)',
                [req.body.email, hash, req.body.username], (errorRes) => {
                  if (errorRes) {
                    const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not create user' };
                    res.status(500).send(replyServer);
                  } else {
                    loginQuery(req, res, false);
                  }
                });
            } else if (!validateEmail(req.body.email) || !validatePassword(req.body.password)) {
              const replyServer = { status: '400', message: 'Invalid email or password' };
              res.status(400).send(replyServer);
            }
          });
        } else {
          res.status(200).send(reply);
        }
      }
    });
  }
};

export { createUser, logIn };
