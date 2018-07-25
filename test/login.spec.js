import {server, array} from '../server';
const chai = require('chai')
const chaiHttp = require('chai-http');
//const [server, array] = require('../server');

const baseUrl = '/v1/entries'
const { expect } = chai;
chai.use(chaiHttp);


describe('this', () => {
  it('tests that', async () => {
    try {
      const result = await chai.request(server).get(baseUrl);
      console.log(JSON.stringify(result.body, undefined, 3))
    } catch (e) {
      console.error(e);
    }
  });
});
