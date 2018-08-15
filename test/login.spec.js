import chai from 'chai';
import bcrypt from 'bcrypt';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../server';
import pool from '../app/db/pool';
import addTables from '../app/db/db';

addTables();

dotenv.config();

const { expect } = chai;
chai.use(chaiHttp);

const title = 'Here is a title';
const description = 'Here is a sample description';
const email = 'test@gmail.com';
const password = 'testingtesting';
const username = 'test';

// Generating token for testing
const token = jwt.sign(
  {
    email: 'test@gmail.com',
    userId: 1,
  },
  process.env.JWT_KEY,
  {
    expiresIn: '1h',
  },
);
beforeEach(() => {
  pool.query('TRUNCATE TABLE users CASCADE',
    (err) => {
      if (err) {
        // console.log(err);
      }
      //  pool.end;()
    });
  pool.query('TRUNCATE TABLE entries CASCADE',
    (err) => {
      if (err) {
        // console.log(err);
      }
      //  pool.end;()
    });
});
// Testing the Get all entries
describe('/GET entries', () => {
  it('it should not GET all the entries when there is no auth token', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .end((err, res) => {
        // console.log(JSON.stringify(res.body, undefined, 3));
        expect(res.body.message).equal('Auth failed');
        expect(res.status).equal(401);
        done();
      });
  });
  it('it should not GET entries when empty', (done) => {
    chai.request(server)
      .get('/api/v1/entries')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        // console.log(JSON.stringify(res.body, undefined, 3));
        expect(res.status).equal(404);
        expect(res.body.message).equal('There is no entries yet');
        done();
      });
  });
  it('it should GET all the entries', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // console.log(result);
        pool.query('INSERT INTO entries(title, description, user_id) values($1, $2, $3)', [title, description, 1], () => {
          chai.request(server)
            .get('/api/v1/entries')
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
              // console.log(JSON.stringify(res.body, undefined, 3));
              expect(res.body.data.entries).to.be.an('Array');
              expect(res.status).equal(200);
              expect(res.body.data.size).equal(1);
              done();
            });
        });
      }
    });
  });
});
// Test for an invalid post request
describe('/POST entry', () => {
  it('it should not POST an entry without text field', (done) => {
    const entry = {
      title: 'Today was Hectic',
    };
    chai.request(server)
      .post('/api/v1/entries')
      .send(entry)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals(400);
        done();
      });
  });

  it('it should not POST an entry without title field', (done) => {
    const entry = {
      text: 'Today was Hectic',
    };
    chai.request(server)
      .post('/api/v1/entries')
      .send(entry)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals(400);
        done();
      });
  });

  it('it should not POST an entry when there is no user', (done) => {
    const entry = {
      text: 'Today was Hectic',
      title: 'So that was how my day went, hectic as ...',
    };
    chai.request(server)
      .post('/api/v1/entries')
      .send(entry)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('Internal Server Error');
        expect(res.body.description).equals('Could not post entry');
        expect(res.body.status).equals('500');
        expect(res.status).equals(500);
        done();
      });
  });

  it('it should  POST an entry when there is a user', (done) => {
    const entry = {
      text: 'Today was Hectic',
      title: 'So that was how my day went, hectic as ...',
    };
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        chai.request(server)
          .post('/api/v1/entries')
          .send(entry)
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            expect(res.body.message).equals('Entry Created successfully');
            expect(res.body.data.entries).to.be.an('Array');
            expect(res.body.status).equals('201');
            expect(res.status).equals(201);
            done();
          });
      }
    });
  });
  it('it should not POST an entry when there is no auth token', (done) => {
    const entry = {
      text: 'Today was Hectic',
      title: 'So that was how my day went, hectic as ...',
    };
    chai.request(server)
      .post('/api/v1/entries')
      .send(entry)
      .end((err, res) => {
        // console.log(JSON.stringify(res.body, undefined, 3));
        expect(res.body.message).equal('Auth failed');
        expect(res.status).equal(401);
        done();
      });
  });
});
// Testing for getting an entry by id
describe('/GET/:id entry', () => {
  it('it should not GET an entry by id if there is no auth token', (done) => {
    const id = 1000;
    chai.request(server)
      .get(`/api/v1/entries/${id}`)
      .end((err, res) => {
        expect(res.body.message).equals('Auth failed');
        expect(res.status).equals(401);
        done();
      });
  });

  it('it should not GET an entry by id if entry does not exist', (done) => {
    const id = 1000;
    chai.request(server)
      .get(`/api/v1/entries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('Entry Not Found');
        expect(res.status).equals(404);
        done();
      });
  });

  it('it should GET an entry by id', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // console.log(result);
        pool.query('INSERT INTO entries(title, description, user_id, id) values($1, $2, $3, $4)', [title, description, 1, 1], () => {
          const id = 1;
          chai.request(server)
            .get(`/api/v1/entries/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
              // console.log(JSON.stringify(res.body, undefined, 3));
              expect(res.body.entry).to.be.an('Object');
              expect(res.status).equal(200);
              expect(res.body.message).equal('Entry returned successfully');
              done();
            });
        });
      }
    });
  });
});


// Testing of updating of an entry
describe('/PUT/:id entry', () => {
  const entryUpdated = {
    text: 'Today was Hectic',
    title: 'This is the updated title',
  };
  it('it should not UPDATE an entry by id if there is no auth token', (done) => {
    const id = 1000;
    chai.request(server)
      .put(`/api/v1/entries/${id}`)
      .send(entryUpdated)
      .end((err, res) => {
        expect(res.body.message).equals('Auth failed');
        expect(res.status).equals(401);
        done();
      });
  });

  it('it should POST an entry by id if entry does not exist while updating', (done) => {
    const id = 1000;
    chai.request(server)
      .put(`/api/v1/entries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(entryUpdated)
      .end((err, res) => {
        expect(res.body.message).equals('Entry Modified successfully');
        expect(res.status).equals(200);
        done();
      });
  });
  it('it should UPDATE an entry by id', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // console.log(result);
        pool.query('INSERT INTO entries(title, description, user_id, id) values($1, $2, $3, $4)', [title, description, 1, 1], () => {
          const id = 1;
          chai.request(server)
            .put(`/api/v1/entries/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(entryUpdated)
            .end((error, res) => {
              // console.log(JSON.stringify(res.body, undefined, 3));
              expect(res.body.data).to.be.an('Object');
              expect(res.status).equal(200);
              expect(res.body.message).equal('Entry Modified successfully');
              done();
            });
        });
      }
    });
  });
});
//
describe('/DELETE/:id entry', () => {
  it('it should not DELETE an entry by id if there is no auth token', (done) => {
    const id = 1000;
    chai.request(server)
      .delete(`/api/v1/entries/${id}`)
      .end((err, res) => {
        expect(res.body.message).equals('Auth failed');
        expect(res.status).equals(401);
        done();
      });
  });

  it('it should not DELETE an entry by id if entry does not exist', (done) => {
    const id = 1000;
    chai.request(server)
      .delete(`/api/v1/entries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('Entry does not exist');
        expect(res.status).equals(200);
        done();
      });
  });
  it('it should DELETE an entry by id', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // console.log(result);
        pool.query('INSERT INTO entries(title, description, user_id, id) values($1, $2, $3, $4)', [title, description, 1, 1], () => {
          const id = 1;
          chai.request(server)
            .delete(`/api/v1/entries/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, res) => {
              // console.log(JSON.stringify(res.body, undefined, 3));
              expect(res.body.data).to.be.an('Object');
              expect(res.status).equal(200);
              expect(res.body.message).equal('Entry Deleted successfully');
              done();
            });
        });
      }
    });
  });
});


// Authentication
describe('/POST new user', () => {
  it('it should not CREATE a user without email or password field only', (done) => {
    const user = {
      username: 'phemmelliot',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not CREATE a user without email or username field only', (done) => {
    const user = {
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not CREATE a user without username or password field only', (done) => {
    const user = {
      email: 'testing@gmail.com',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });
  it('it should not POST a user, if user already exists', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'phemmelliot',
    };
    pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)', ['test@gmail.com', 'password', 'phemmelliot'], () => {
      chai.request(server)
        .post('/api/v1/user/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body.message).equals('User Already Exists');
          expect(res.body.status).equals('409');
          done();
        });
    });
  });


  it('it should not POST a user, if email is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'password',
      username: 'phemmelliot',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not POST a user, if password is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'pass',
      username: 'phemmelliot',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not POST a user, if password is empty spaces', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: '         ',
      username: 'phemmelliot',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should  POST a user', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'phemmelliot',
    };
    chai.request(server)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('User Created Successfully');
        expect(res.body.status).equals('201');
        done();
      });
  });
});

// LogIn testing
describe('/POST Log user in', () => {
  it('it should not log a user in without email field', (done) => {
    const user = {
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not Log a user in without password field', (done) => {
    const user = {
      email: 'testing@gmail.com',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not Log a user in, if password is empty spaces', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: '         ',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not Log a user in, if email is incorrect', (done) => {
    const user = {
      email: 'test.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not Log a user in, if password is substandard', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'pass',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done();
      });
  });

  it('it should not LOG a user in if user does not exist', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
    };
    chai.request(server)
      .post('/api/v1/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('User does not exist');
        expect(res.body.status).equals('401');
        done();
      });
  });

  it('it should LOG a user in', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
    };
    let logInpassword;
    bcrypt.hash('password', 10, (error, hash) => {
      logInpassword = hash;
      pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)', ['test@gmail.com', logInpassword, 'phemmelliot'], () => {
        chai.request(server)
          .post('/api/v1/user/login')
          .send(user)
          .end((err, res) => {
            expect(res.body.message).equals('User Logged In Successfully');
            expect(res.body.status).equals('200');
            done();
          });
      });
    });
  });
});

describe('/GET/ user profile', () => {
  it('it should not GET profile if there is no auth token', (done) => {
    chai.request(server)
      .get('/api/v1/user/profile')
      .end((err, res) => {
        expect(res.body.message).equals('Auth failed');
        expect(res.status).equals(401);
        done();
      });
  });

  it('it should not GET profile if user does not exist', (done) => {
    chai.request(server)
      .get('/api/v1/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body.message).equals('User Does not exist');
        expect(res.status).equals(404);
        done();
      });
  });

  it('it should GET an entry by id', (done) => {
    pool.query('INSERT INTO users(email, password, username, user_id) values($1, $2, $3, $4)', [email, password, username, 1], (err) => {
      if (err) {
        // console.log(err);
      } else {
        // const id = 1;
        chai.request(server)
          .get('/api/v1/user/profile')
          .set('Authorization', `Bearer ${token}`)
          .end((error, res) => {
            // console.log(JSON.stringify(res.body, undefined, 3));
            expect(res.body.user).to.be.an('Object');
            expect(res.status).equal(200);
            expect(res.body.message).equal('User Returned Successfully');
            done();
          });
      }
    });
  });
});
