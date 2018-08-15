import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../db/pool';
import { validateEmail, validatePassword, isEmpty } from './validate';

dotenv.config();

const badRequest = { status: '400', message: 'Bad Request' };


const loginQuery = (req, res, login) => {
  pool.query('SELECT * FROM users WHERE email = ($1)', [req.body.email], (error, dbRes) => {
    if (error) {
      const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not Log User in' };
      res.status(500).send(replyServer);
    } else {
      const reply = { status: '401', message: 'User does not exist' };
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
              reply.message = 'Unable to encrypt password';
              res.status(401).send(reply);
            }
          });
      }
    }
  });
};

const logIn = (req, res) => {
  if (isEmpty(req.body.email) || isEmpty(req.body.password)) {
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
  if (isEmpty(req.body.email) || isEmpty(req.body.username) || isEmpty(req.body.password)) {
    badRequest.description = 'Email, password or username field cannot be empty';
    res.status(400).send(badRequest);
  } else {
    pool.query('SELECT * FROM users WHERE email = ($1)', [req.body.email], (error, dbRes) => {
      if (error) {
        const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not create user' };
        res.status(500).send(replyServer);
      } else {
        const reply = { status: '409', message: 'User Already Exists' };
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
          res.status(409).send(reply);
        }
      }
    });
  }
};

const getProfile = (req, res) => {
  pool.query('SELECT email, username FROM users WHERE user_id = ($1)', [req.userData.userId], (err, response) => {
    if (err) {
      const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not create user' };
      res.status(500).send(replyServer);
    } else {
      const reply = { status: '404', message: 'User Does not exist' };
      if (response.rows[0] === undefined) {
        res.status(404).send(reply);
      } else {
        const goodReply = { status: '200', message: 'User Returned Successfully', user: response.rows[0] };
        res.status(200).send(goodReply);
      }
    }
  });
};

const updateProfile = (req, res) => {
  pool.query('UPDATE users SET email = ($1), username = ($2) WHERE user_id = $3',
    [req.body.email, req.body.username, req.userData.userId], (error) => {
      if (error) {
        const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not update profile' };
        res.status(500).send(replyServer);
      } else {
        pool.query('SELECT email, username FROM users WHERE user_id = ($1)', [req.userData.userId], (err, dbRes) => {
          if (err) {
            const reply = { status: '500', message: 'Internal Server Error', description: 'Could not retrieve updated profile' };
            res.status(500).send(reply);
          } else {
            // const db = { entries: dbRes.rows, size: dbRes.rows.length };
            const reply = { status: '404', message: 'Entry Not Found' };
            if (dbRes.rows === undefined) {
              res.status(404).send(reply);
            } else {
              const goodReply = { status: '200', message: 'Profile Modified successfully', profile: dbRes.rows[0] };
              res.status(200).send(goodReply);
            }
          }
        });
      }
    });
};

export {
  createUser, logIn, getProfile, updateProfile,
};
