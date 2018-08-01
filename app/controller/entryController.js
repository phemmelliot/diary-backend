import pool from '../db/pool';

const badRequest = { status: 400, message: 'Bad Request' };
const getEntry = (req, res) => {
  pool.query('SELECT title, description FROM entries WHERE id = ($1)', [req.params.id], (err, dbRes) => {
    if (err) {
      // console.log(dbRes);
      const reply = { status: '500', message: 'Internal Server Error', description: 'Could not retrieve entry' };
      res.status(500).send(reply);
    } else {
      // console.log(dbRes.rows[0]);
      const reply = {
        status: '404', message: 'Entry Not Found',
      };
      if (dbRes.rows[0] === undefined) {
        res.status(404).send(reply);
      } else {
        res.status(200).send(dbRes.rows[0]);
      }
    }
  });
};

const getEntries = (req, res) => {
  pool.query('SELECT * FROM entries ORDER BY id ASC', (err, dbRes) => {
    if (err) {
      // console.log(err.stack);
      const reply = { status: '500', message: 'Internal Server Error', description: 'Could not retrieve entry' };
      res.status(500).send(reply);
    } else {
      // console.log(dbRes.rows[0]);
      const db = { entries: dbRes.rows, size: dbRes.rows.length };
      const reply = {
        status: '404', message: 'Entry Not Found',
      };
      if (dbRes.rows === undefined) {
        res.status(404).send(reply);
      } else {
        res.status(200).send(db);
      }
    }
  });
};

const createEntry = (req, res) => {
  if (req.body.text == null || req.body.title == null) {
    badRequest.description = 'Body or title cannot be empty';
    res.status(400).send(badRequest);
  } else {
    pool.query('INSERT INTO entries(title, description) values($1, $2)',
      [req.body.title, req.body.text], (error) => {
        if (error) {
          const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not post entry' };
          res.status(500).send(replyServer);
        } else {
          // res.status(200).send(reply);
          pool.query('SELECT * FROM entries ORDER BY id ASC', (err, dbRes) => {
            if (err) {
              // console.log(err.stack);
              const reply = { status: '500', message: 'Internal Server Error', description: 'Could not retrieve entry' };
              res.status(500).send(reply);
            } else {
              // console.log(dbRes.rows[0]);
              const db = { entries: dbRes.rows, size: dbRes.rows.length };
              const reply = { status: '404', message: 'Entry Not Found' };
              if (dbRes.rows === undefined) {
                res.status(404).send(reply);
              } else {
                res.status(200).send(db);
              }
            }
          });
        }
      });
  }
};

const updateEntry = (req, res) => {
  pool.query('UPDATE entries SET title = ($1), description = ($2) WHERE id = ($3)',
    [req.body.title, req.body.text, req.body.id], (error) => {
      if (error) {
        const replyServer = { status: '500', message: 'Internal Server Error', description: 'Could not update entry' };
        res.status(500).send(replyServer);
      } else {
        pool.query('SELECT * FROM entries ORDER BY id ASC', (err, dbRes) => {
          if (err) {
            // console.log(err.stack);
            const reply = { status: '500', message: 'Internal Server Error', description: 'Could not retrieve entry' };
            res.status(500).send(reply);
          } else {
            // console.log(dbRes.rows[0]);
            const db = { entries: dbRes.rows, size: dbRes.rows.length };
            const reply = { status: '404', message: 'Entry Not Found' };
            if (dbRes.rows === undefined) {
              res.status(404).send(reply);
            } else {
              res.status(200).send(db);
            }
          }
        });
      }
    });
};

const deleteEntry = (req, res) => {
  let reply = {};
  pool.query('DELETE FROM entries WHERE id = ($1)', [req.params.id], (err) => {
    if (err) {
      reply = { status: '500', message: 'Internal Server Error', description: 'Could not delete Entry' };
      res.status(500).send(reply);
    } else {
      reply = { status: '200', message: 'Entry Deleted Successfully' };
      res.status(200).send(reply);
    }
  });
};

export {
  getEntry, getEntries, createEntry, updateEntry, deleteEntry,
};
