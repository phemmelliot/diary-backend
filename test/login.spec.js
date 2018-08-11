import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../server';

const { expect } = chai;
chai.use(chaiHttp);

describe('Entries', () => {
  beforeEach((done) => {
    // I am emptying the array before testing
    entries.length = 0;
    done();
  });
  // Testing the Get all entries
  describe('/GET entries', () => {
    it('it should GET all the entries', (done) => {
      chai.request(server)
        .get('/v1/entries')
        .end((err, res) => {
          // console.log(JSON.stringify(res.body, undefined, 3));
          expect(res.body.entries).to.be.an('array');
          expect(res.status).equal(200);
          expect(res.body.size).equal(0);
          done();
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
        .post('/v1/entries')
        .send(entry)
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
        .post('/v1/entries')
        .send(entry)
        .end((err, res) => {
          expect(res.body.message).equals('Bad Request');
          expect(res.body.status).equals(400);
          done();
        });
    });

    it('it should POST an entry', (done) => {
      const entry = {
        text: 'Today was Hectic',
        title: 'So that was how my day went, hectic as ...',
      };
      chai.request(server)
        .post('/v1/entries')
        .send(entry)
        .end((err, res) => {
          expect(res.body.message).equals('Entry Uploaded Successfully');
          expect(res.body.status).equals('200');
          expect(res.status).equals(200);
          done();
        });
    });
  });
  // Testing for getting an entry by id
  describe('/GET/:id entry', () => {
    it('it should GET an entry by id', (done) => {
      const entry = {
        text: 'Today was Hectic',
        title: 'So that was how my day went, hectic as ...',
      };
      entries.push(entry);
      const id = entries.indexOf(entry).toString();
      chai.request(server)
        .get(`/v1/entries/${id}`)
        .send(entry)
        .end((err, res) => {
          expect(res.body.title).equals('So that was how my day went, hectic as ...');
          expect(res.body.text).equals('Today was Hectic');
          expect(res.status).equals(200);
          done();
        });
    });
  });
  // Testing of updating of an entry
  describe('/PUT/:id entry', () => {
    it('it should Update an entry by id', (done) => {
      const entryOriginal = {
        text: 'Today was Hectic',
        title: 'So that was how my day went, hectic as ...',
      };
      const entryUpdated = {
        text: 'Today was Hectic',
        title: 'This is the updated title',
      };
      entries.push(entryOriginal);
      const id = entries.indexOf(entryOriginal).toString();
      chai.request(server)
        .put(`/v1/entries/${id}`)
        .send(entryUpdated)
        .end((err, res) => {
          // console.log(JSON.stringify(res.body, undefined, 3));
          expect(res.body.status).equals('200');
          expect(res.body.message).equals('Entry Modified Successfully');
          expect(res.status).equals(200);
          done();
        });
    });
  });

  describe('/DELETE/:id entry', () => {
    it('it should DELETE an entry by id', (done) => {
      const entry = {
        text: 'Today was Hectic',
        title: 'So that was how my day went, hectic as ...',
      };
      entries.push(entry);
      const id = entries.indexOf(entry);
      // console.log(entries);
      chai.request(server)
        .delete(`/v1/entries/${id}`)
        .end((err, res) => {
          // console.log(JSON.stringify(res.body, undefined, 3));
          // console.log(JSON.stringify(entries[id], undefined, 3));
          // console.log(entries);
          expect(res.body.status).equals('200');
          expect(res.body.message).equals('Entry Deleted Successfully');
          expect(res.status).equals(200);
          done();
        });
    });
  });
});
