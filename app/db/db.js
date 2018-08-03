// Nothing is using this yet
import pool from './pool';

// pool.query('DROP TABLE users, entries',
//   (err, res) => {
//     console.log(err, res);
//     //  pool.end;()
//   });

pool.query('CREATE TABLE IF NOT EXISTS users(user_id SERIAL PRIMARY KEY, email text not null, password text not null, username text not null)',
  (err, res) => {

  });

pool.query('CREATE TABLE IF NOT EXISTS entries(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(user_id),  title text not null, description text not null, time_created timestamp default now())',
  (err, res) => {
    
  });
