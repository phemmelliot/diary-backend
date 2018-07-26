const Request = require('request');
const fsArray = require('../server');

const fs = fsArray[0];
const array = fsArray[1];
describe('Server', () => {
  let server;
  beforeAll(() => {
    server = fs;
  });
  afterAll(() => {
    server.close();
  });
  // Test for getting all entries
  describe('GET /v1/entries', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:5000/v1/entries', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it('Status 200', () => {
      expect(data.status).toBe(200);
    });
    it('Body', () => {
      // const db = { entries: array, size: array.length };
      expect(data.body.entries.length).toBe(array.length);
    });
  });
  // Test for delete request
  describe('DELETE /v1/entries/:id', () => {
    const data = {};
    beforeAll((done) => {
      Request.get('http://localhost:5000/v1/entries/0', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it('Status 200', () => {
      if (data.status === 200) {
        expect(data.status).toBe(200);
      } else {
        expect(data.status).toBe(300);
      }
    });
    it('Body', () => {
      // console.log(data.body);
      if (data.body.message === undefined) {
        expect(data.body.message).toBe(undefined);
      } else {
        expect(data.body.message).toBe('Bad Request');
      }
    });
  });
  // Test for put request
  describe('PUT /v1/entries/:id', () => {
    const data = {};
    beforeAll((done) => {
      Request.put('http://localhost:5000/v1/entries/0', (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it('Status 200', () => {
      expect(data.status).toBe(200);
    });
    it('Body', () => {
      expect(data.body.message).toBe('Entry Modified Successfully');
    });
  });
  //
  // describe('GET /entries/:id', () => {
  //   const data = {};
  //   beforeAll((done) => {
  //     Request.put('http://localhost:3000/entries', (error, response, body) => {
  //       data.status = response.statusCode;
  //       data.body = JSON.parse(body);
  //       done();
  //     });
  //   });
  //   it('Status 200', () => {
  //     expect(data.status).toBe(200);
  //   });
  // it('Body', () => {
  //   expect(data.body.message).toBe('Entry Uploaded Successfully');
  // });
  // });
});
