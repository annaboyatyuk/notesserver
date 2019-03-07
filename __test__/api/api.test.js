'use strict';

import supertest from 'supertest';
import {server} from '../../src/app.js';
import Notes from '../../src/models/notes.js';

import {Mockgoose} from 'mockgoose';
import mongoose from 'mongoose';

/*do i need this?
*/
// WARNING: Travis runs slow due to Mongo, give long timeout
jest.setTimeout(60000);

const mockgoose = new Mockgoose(mongoose);
const mockRequest = supertest(server);

const API_URL = '/api/v1/notes';

afterAll(done => {
  mongoose.disconnect()
    .then(() => {
      console.log('Disconnected');
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
});
beforeAll(done => {
  mockgoose.prepareStorage()
    .then(() => {
      mongoose.connect('mongodb://127.0.0.1/notes')
        .then(() => {
          done();
        });
    });
});
afterEach(done => {
  mockgoose.helper.reset()
    .then(done);
});

describe('Api', () => {
  
  it('mockRequest should exist', () => {
    expect(mockRequest).toBeDefined();
  });

  it('should get back an enpty array for find', () => {
    return mockRequest
      .get(API_URL)
      .then(results => {
        let coffees = JSON.parse(results.text);
        expect(coffees).toEqual([]);
      });
  });

  it('GET should return 200, a resource with a valid body', () => {
    return mockRequest
      .get(API_URL)
      .then(response => {
        expect(response.statusCode).toEqual(200);
      })
      .catch(console.err);
  });

  it('should return 500 when wrong id was provided', () => {
    let model = {title:'name', note:'hello'};
    return mockRequest
      .post(API_URL)
      .send(model)
      .then(() => {
        return mockRequest
          .get(`${API_URL}/4`)
          .then(response => {
            expect(response.status).toBe(500);
          });
      });
  });

  it('should contain response body for request made with valid id', () => {
    let model = {title:'name', note:'good day sir'};
    return mockRequest
      .post(API_URL)
      .send(model)
      .then(data => {
        return mockRequest
          .get(`${API_URL}/${data.body._id}`)
          .then(response => {
            expect(response.body.name).toEqual(data.body.name);
          });
      });
  });

  it('should return 400 bad request when no body content or invalid body content', () => {
    return mockRequest
      .post(API_URL)
      .catch(err => {
        expect(err.response.text).toBe('Bad Request');
        expect(err.status).toBe(400);
      });
  });

  it('should respond with body content', () => {
    let model = {title:'hello', note:'its me'};
    return mockRequest
      .post(API_URL)
      .send(model)
      .then(data => {
        expect(data.body.title).toBe('hello');
      });
  });

});


describe('Notes model', () => {

  it('should create note', () => {
    return Notes
      .create({title:'good morning', note:'yes'})
      .then(note => {
        expect(note.note).toBe('yes');
      });
  });

});