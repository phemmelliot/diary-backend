// Nothing is using this yet
export default function route(app, pool) {
  pool.query('DROP TABLE entries',
    (err, res) => {
      console.log(err, res);
    //  pool.end;()
    });

  pool.query('CREATE TABLE users(id SERIAL PRIMARY KEY, email text not null, password text not null)',
    (err, res) => {
      console.log(err, res);
    //  pool.end;()
    });

  pool.query('CREATE TABLE entries(id SERIAL PRIMARY KEY, user_id SERIAL REFERENCES users(id),  title text not null, description text not null)',
    (err, res) => {
      console.log(err, res);
    //  pool.end;()
    });
}
